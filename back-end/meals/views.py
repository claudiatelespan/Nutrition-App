from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import MealLog, SnackLog, PhysicalActivityLog
from .serializers import MealLogSerializer, SnackLogSerializer, PhysicalActivityLogSerializer
from datetime import timedelta, date, datetime
from django.http import JsonResponse
from django.db.models import Sum
from users.models import UserProfile

ACTIVITY_FACTORS = {
    "sedentary": 1.2,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

class MealLogViewSet(viewsets.ModelViewSet):
    serializer_class = MealLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealLog.objects.filter(user=self.request.user).order_by("-date", "-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SnackLogViewSet(viewsets.ModelViewSet):
    serializer_class = SnackLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SnackLog.objects.filter(user=self.request.user).order_by("-date", "-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PhysicalActivityLogViewSet(viewsets.ModelViewSet):
    serializer_class = PhysicalActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PhysicalActivityLog.objects.filter(user=self.request.user).order_by("-date", "-id")

def get_bmr(weight, height, age, sex):
    if sex == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    elif sex == "female":
        return 10 * weight + 6.25 * height - 5 * age - 161
    return 0

def get_age(birth_date):
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

def get_daily_calorie_target(user_profile):
    weight = user_profile.weight or 65
    height = user_profile.height or 170
    sex = user_profile.sex or "male"
    birth_date = user_profile.birth_date or date(2000, 1, 1)
    activity = user_profile.activity_level or "moderate"
    age = get_age(birth_date)
    bmr = get_bmr(weight, height, age, sex)
    factor = ACTIVITY_FACTORS.get(activity, 1.55)
    return round(bmr * factor, 2)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_calories_log_with_target(request):
    user = request.user
    start = request.GET.get("start")
    end = request.GET.get("end")

    if not start or not end:
        return JsonResponse({"error": "Provide start and end date"}, status=400)

    start_date = date.fromisoformat(start)
    end_date = date.fromisoformat(end)
    days = (end_date - start_date).days + 1
    result = {start_date + timedelta(days=i): 0 for i in range(days)}

    meal_logs = (
        MealLog.objects.filter(user=user, date__range=[start_date, end_date])
        .values("date")
        .annotate(total_calories=Sum("calories"))
    )
    for log in meal_logs:
        result[log["date"]] += log["total_calories"] or 0

    snack_logs = (
        SnackLog.objects.filter(user=user, date__range=[start_date, end_date])
        .values("date")
        .annotate(total_calories=Sum("calories"))
    )
    for log in snack_logs:
        result[log["date"]] += log["total_calories"] or 0

    user_profile = getattr(user, "profile", None)
    if not user_profile:
        try:
            user_profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "Profile not found"}, status=404)
    calorie_target = get_daily_calorie_target(user_profile)

    json_result = []
    for d in sorted(result.keys()):
        calories = round(result[d], 2)
        hit_target = calories >= calorie_target
        json_result.append({
            "date": d.strftime("%Y-%m-%d"),
            "calories": calories,
            "calorie_target": calorie_target,
            "hit_target": hit_target,
            "status": (
                "Target atins" if calories == calorie_target
                else "Peste target" if calories > calorie_target
                else "Sub target"
            )
        })

    return JsonResponse(json_result, safe=False)