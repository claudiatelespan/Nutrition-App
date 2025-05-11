from rest_framework import serializers
from .models import MealLog, SnackLog, PhysicalActivityLog

class MealLogSerializer(serializers.ModelSerializer):
    recipe_name = serializers.CharField(source="recipe.name", read_only=True)

    class Meta:
        model = MealLog
        fields = "__all__"        
        read_only_fields = ["user"]

class SnackLogSerializer(serializers.ModelSerializer):
    snack_name = serializers.CharField(source="snack.name", read_only=True)

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

class PhysicalActivityLogSerializer(serializers.ModelSerializer):
    activity_name = serializers.CharField(source="activity.name", read_only=True)
    
    class Meta:
        model = PhysicalActivityLog
        fields = "__all__"
        read_only_fields = ["user", "calories_burned"]

    def create(self, validated_data):
        user = self.context["request"].user
        log = PhysicalActivityLog.objects.create(user=user, **validated_data)
        return log