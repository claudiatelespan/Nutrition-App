from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import MealLog, SnackLog, PhysicalActivityLog
from .serializers import MealLogSerializer, SnackLogSerializer, PhysicalActivityLogSerializer
from datetime import timedelta, date
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_macros_log(request):
    user = request.user
    start = request.GET.get("start")
    end = request.GET.get("end")
    if not start or not end:
        return JsonResponse({"error": "Provide start and end date"}, status=400)

    start_date = date.fromisoformat(start)
    end_date = date.fromisoformat(end)
    days = (end_date - start_date).days + 1
    result = {
        start_date + timedelta(days=i): {
            "protein": 0,
            "carbohydrates": 0,
            "sugar": 0,
            "fiber": 0,
            "fat": 0
        } for i in range(days)
    }

    meal_logs = (
        MealLog.objects
        .filter(user=user, date__range=[start_date, end_date])
        .select_related("recipe")
        .values("date", "recipe__protein", "recipe__carbohydrates", "recipe__sugars", "recipe__fiber", "recipe__fat")
    )
    for log in meal_logs:
        d = log["date"]
        result[d]["protein"] += log["recipe__protein"] or 0
        result[d]["carbohydrates"] += log["recipe__carbohydrates"] or 0
        result[d]["sugar"] += log["recipe__sugars"] or 0
        result[d]["fiber"] += log["recipe__fiber"] or 0
        result[d]["fat"] += log["recipe__fat"] or 0

    snack_logs = (
        SnackLog.objects
        .filter(user=user, date__range=[start_date, end_date])
        .values("date")
        .annotate(
            protein=Sum("protein"),
            carbohydrates=Sum("carbohydrates"),
            sugar=Sum("sugar"),
            fiber=Sum("fiber"),
            fat=Sum("fat"),
        )
    )
    for log in snack_logs:
        d = log["date"]
        result[d]["protein"] += log["protein"] or 0
        result[d]["carbohydrates"] += log["carbohydrates"] or 0
        result[d]["sugar"] += log["sugar"] or 0
        result[d]["fiber"] += log["fiber"] or 0
        result[d]["fat"] += log["fat"] or 0

    json_result = []
    for d in sorted(result.keys()):
        json_result.append({
            "date": d.strftime("%Y-%m-%d"),
            "protein": round(result[d]["protein"], 2),
            "carbohydrates": round(result[d]["carbohydrates"], 2),
            "sugar": round(result[d]["sugar"], 2),
            "fiber": round(result[d]["fiber"], 2),
            "fat": round(result[d]["fat"], 2),
        })

    return JsonResponse(json_result, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calories_intake_vs_burned_log(request):
    user = request.user
    start = request.GET.get("start")
    end = request.GET.get("end")

    if not start or not end:
        return JsonResponse({"error": "Provide start and end date"}, status=400)

    start_date = date.fromisoformat(start)
    end_date = date.fromisoformat(end)
    days = (end_date - start_date).days + 1
    result = {start_date + timedelta(days=i): {"intake": 0, "burned": 0} for i in range(days)}

    meal_logs = (
        MealLog.objects.filter(user=user, date__range=[start_date, end_date])
        .values("date")
        .annotate(total_calories=Sum("calories"))
    )
    for log in meal_logs:
        result[log["date"]]["intake"] += log["total_calories"] or 0

    snack_logs = (
        SnackLog.objects.filter(user=user, date__range=[start_date, end_date])
        .values("date")
        .annotate(total_calories=Sum("calories"))
    )
    for log in snack_logs:
        result[log["date"]]["intake"] += log["total_calories"] or 0

    activity_logs = (
        PhysicalActivityLog.objects.filter(user=user, date__range=[start_date, end_date])
        .values("date")
        .annotate(total_burned=Sum("calories_burned"))
    )
    for log in activity_logs:
        result[log["date"]]["burned"] += log["total_burned"] or 0

    response = []
    for d in sorted(result.keys()):
        intake = round(result[d]["intake"], 2)
        burned = round(result[d]["burned"], 2)
        total_net = round(intake - burned, 2)
        response.append({
            "date": d.strftime("%Y-%m-%d"),
            "intake": intake,
            "burned": burned,
            "total_net": total_net,
        })

    return JsonResponse(response, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def macro_distribution(request):
    user = request.user
    day = request.GET.get("date", date.today().isoformat())

    meal_logs = MealLog.objects.filter(user=user, date=day)
    snack_logs = SnackLog.objects.filter(user=user, date=day)

    protein = sum((ml.recipe.protein or 0) for ml in meal_logs) + sum((s.protein or 0) for s in snack_logs)
    carbs = sum((ml.recipe.carbohydrates or 0) for ml in meal_logs) + sum((s.carbohydrates or 0) for s in snack_logs)
    fat = sum((ml.recipe.fat or 0) for ml in meal_logs) + sum((s.fat or 0) for s in snack_logs)
    sugar = sum((ml.recipe.sugars or 0) for ml in meal_logs) + sum((s.sugar or 0) for s in snack_logs)
    fiber = sum((ml.recipe.fiber or 0) for ml in meal_logs) + sum((s.fiber or 0) for s in snack_logs)

    protein_cal = protein * 4
    carbs_cal = carbs * 4
    fat_cal = fat * 9
    sugar_cal = sugar * 4
    fiber_cal = fiber * 2
   

    total = protein_cal + carbs_cal + fat_cal + sugar_cal + fiber_cal or 1  

    return JsonResponse({
        "protein_g": round(protein, 2),
        "carbs_g": round(carbs, 2),
        "fat_g": round(fat, 2),
        "sugar_g": round(sugar, 2),
        "fiber_g": round(fiber, 2),
        "protein_percent": round(100 * protein_cal / total, 2),
        "carbs_percent": round(100 * carbs_cal / total, 2),
        "fat_percent": round(100 * fat_cal / total, 2),
        "sugar_percent": round(100 * sugar_cal / total, 2),
        "fiber_percent": round(100 * fiber_cal / total, 2),
    })
