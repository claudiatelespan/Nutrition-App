from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient, FavoriteRecipe, Snack, PhysicalActivity, ShoppingList, ShoppingListItem

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
    ingredients = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'description', 'calories', 'cuisine_type',
                  'prep_time', 'difficulty', 'meal_type', 'rating', 'ingredients']

    def get_ingredients(self, obj):
        ingredients_rel = RecipeIngredient.objects.filter(reteta=obj)
        return RecipeIngredientSerializer(ingredients_rel, many=True).data

class FavoriteRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRecipe
        fields = ['id', 'user', 'recipe', 'added_at']
        read_only_fields = ['user', 'added_at']

class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = ["id", "name", "unit", "calories_per_unit"]

class PhysicalActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalActivity
        fields = "__all__"

class ShoppingListItemSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = ShoppingListItem
        fields = ['id', 'ingredient', 'quantity', 'is_checked']

class ShoppingListSerializer(serializers.ModelSerializer):
    items = ShoppingListItemSerializer(many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'items']