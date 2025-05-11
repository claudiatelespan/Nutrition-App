from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import MealLog, SnackLog, PhysicalActivityLog
from .serializers import MealLogSerializer, SnackLogSerializer, PhysicalActivityLogSerializer

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