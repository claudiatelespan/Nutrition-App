from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, IngredientViewSet, FavoriteRecipeViewSet, SnackViewSet, PhysicalActivityViewSet

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'ingredients', IngredientViewSet, basename='ingredient')
router.register(r'favorites', FavoriteRecipeViewSet, basename='favorite')
router.register(r"snacks", SnackViewSet, basename="snack")
router.register(r"activities", PhysicalActivityViewSet, basename="activity")

urlpatterns = [
    path('', include(router.urls)),
]
