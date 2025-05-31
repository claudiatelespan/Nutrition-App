from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient, FavoriteRecipe, Snack, PhysicalActivity, ShoppingList, ShoppingListItem, RecipeRating

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'category']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity']

class RecipeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe
        fields = "__all__"

class FavoriteRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRecipe
        fields = ['id', 'user', 'recipe', 'added_at']
        read_only_fields = ['user', 'added_at']

class RecipeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeRating
        fields = ['id', 'recipe', 'user', 'rating', 'created_at']
        read_only_fields = ['user', 'created_at']

class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = "__all__"

class PhysicalActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalActivity
        fields = "__all__"

class ShoppingListItemSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = ShoppingListItem
        fields = ['id', 'ingredient', 'quantity', 'is_checked', 'unit']

class ShoppingListSerializer(serializers.ModelSerializer):
    items = ShoppingListItemSerializer(many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'items',]