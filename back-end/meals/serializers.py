from rest_framework import serializers
from .models import MealLog, SnackLog

class MealLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealLog
        fields = ["id", "user", "recipe", "meal_type", "date", "calories"]        
        read_only_fields = ["user"]

class SnackLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnackLog
        fields = "__all__"
        read_only_fields = ["user", "calories"]

    def validate(self, attrs):
        snack = attrs.get("snack")
        quantity = attrs.get("quantity")

        if not snack or quantity is None:
            raise serializers.ValidationError("Snack and quantity are required.")

        attrs["calories"] = round(quantity * snack.calories_per_unit, 2)
        return attrs
