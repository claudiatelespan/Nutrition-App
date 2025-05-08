from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Recipe, Ingredient, FavoriteRecipe
from .serializers import RecipeSerializer, IngredientSerializer, FavoriteRecipeSerializer

class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

class FavoriteRecipeViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavoriteRecipe.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)