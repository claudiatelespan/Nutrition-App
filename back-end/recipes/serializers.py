from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'unit', 'calories_per_unit', 'category']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity']

class RecipeSerializer(serializers.ModelSerializer):
    ingrediente = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'description', 'calories', 'cuisine_type',
                  'prep_time', 'difficulty', 'meal_type', 'rating', 'ingrediente']

    def get_ingrediente(self, obj):
        ingrediente_rel = RecipeIngredient.objects.filter(reteta=obj)
        return RecipeIngredientSerializer(ingrediente_rel, many=True).data
