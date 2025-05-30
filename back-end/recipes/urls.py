from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, IngredientViewSet, FavoriteRecipeViewSet, SnackViewSet, PhysicalActivityViewSet, ShoppingListItemViewSet, ShoppingListViewSet, RecipeRatingViewSet, recommend_recipes_by_ingredients

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'ingredients', IngredientViewSet, basename='ingredient')
router.register(r'favorites', FavoriteRecipeViewSet, basename='favorite')
router.register(r"snacks", SnackViewSet, basename="snack")
router.register(r"activities", PhysicalActivityViewSet, basename="activity")
router.register(r'shopping-list', ShoppingListViewSet, basename='shopping-list')
router.register(r'shopping-list-items', ShoppingListItemViewSet, basename='shopping-list-items')
router.register(r'recipe_ratings', RecipeRatingViewSet, basename='recipe-rating')

urlpatterns = [
    path('', include(router.urls)),
    path('recommend_by_ingredients/', recommend_recipes_by_ingredients, name='recommend-by-ingredients')
]
