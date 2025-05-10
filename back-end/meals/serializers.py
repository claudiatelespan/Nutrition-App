from rest_framework import serializers
from .models import MealLog, SnackLog

class MealLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealLog
        fields = "__all__"
        read_only_fields = ["user"]

class SnackLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnackLog
        fields = "__all__"
        read_only_fields = ["user", "calories"]
