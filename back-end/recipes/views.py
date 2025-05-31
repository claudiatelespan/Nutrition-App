from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recipe, Ingredient, RecipeIngredient, FavoriteRecipe, Snack, PhysicalActivity, ShoppingListItem, ShoppingList, RecipeRating
from .serializers import RecipeSerializer, IngredientSerializer, FavoriteRecipeSerializer, SnackSerializer, PhysicalActivitySerializer, ShoppingListSerializer, ShoppingListItemSerializer, RecipeRatingSerializer
from .utils import CATEGORY_UNIT_CONVERSIONS, get_quantity_and_unit, smart_round

UNIT_IS_GRAMS = ["Grains", "Vegetables", "Meat", "Seafood", "Nuts", "Baking", "Legumes", "Fruits"]
DAIRY_NOT_GRAMS = ["Half And Half", "Heavy Cream", "Heavy Whipping Cream", "Whipping Cream"]

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

class RecipeRatingViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeRatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecipeRating.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my_rating/(?P<recipe_id>[^/.]+)')
    def my_rating(self, request, recipe_id=None):
        """
        GET /api/recipe_ratings/my_rating/<recipe_id>/
        Returnează ratingul userului pentru rețeta dată, dacă există
        """
        try:
            rating = RecipeRating.objects.get(recipe_id=recipe_id, user=request.user)
            serializer = self.get_serializer(rating)
            return Response(serializer.data)
        except RecipeRating.DoesNotExist:
            return Response({"detail": "No rating found."}, status=status.HTTP_404_NOT_FOUND)

class SnackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Snack.objects.all()
    serializer_class = SnackSerializer
    permission_classes = [IsAuthenticated]

class PhysicalActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PhysicalActivity.objects.all()
    serializer_class = PhysicalActivitySerializer
    permission_classes = [IsAuthenticated]

class ShoppingListViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        shopping_list, _ = ShoppingList.objects.get_or_create(user=request.user)
        serializer = ShoppingListSerializer(shopping_list)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def generate(self, request):
        recipe_ids = request.data.get("recipe_ids", [])
        if not recipe_ids:
            return Response({"detail": "No recipes provided."}, status=400)

        shopping_list, _ = ShoppingList.objects.get_or_create(user=request.user)
        shopping_list.items.all().delete()

        ingredients = RecipeIngredient.objects.filter(reteta__id__in=recipe_ids)
        item_map = {}

        for ri in ingredients:
            ing = ri.ingredient
            quantity, unit = get_quantity_and_unit(ri)

            if ing.id in item_map:
                item_map[ing.id]["quantity"] += quantity
            else:
                item_map[ing.id] = {
                    "ingredient": ing,
                    "quantity": quantity,
                    "unit": unit,
                }

        for ing_data in sorted(item_map.values(), key=lambda x: x["ingredient"].name):
            ShoppingListItem.objects.create(
                shopping_list=shopping_list,
                ingredient=ing_data["ingredient"],
                quantity=smart_round(ing_data["quantity"], ing_data["unit"]),
                unit=ing_data["unit"]
            )

        serializer = ShoppingListSerializer(shopping_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ShoppingListItemViewSet(viewsets.ModelViewSet):
    serializer_class = ShoppingListItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShoppingListItem.objects.filter(shopping_list__user=self.request.user)

    @action(detail=True, methods=["patch"])
    def toggle(self, request, pk=None):
        item = self.get_object()
        item.is_checked = not item.is_checked
        item.save()
        return Response({"is_checked": item.is_checked})

@api_view(['POST'])
def recommend_recipes_by_ingredients(request):
    input_ingredients = request.data.get('ingredients', [])
    if not input_ingredients:
        return Response({'error': 'No ingredients provided'}, status=400)

    input_ingredients = [ing.lower() for ing in input_ingredients]

    scored_recipes = []

    for recipe in Recipe.objects.all():
        ingredient_text = recipe.ingredients.lower()
        match_count = sum(1 for ing in input_ingredients if ing in ingredient_text)

        if match_count > 0:
            scored_recipes.append({
                'id': recipe.id,
                'name': recipe.name,
                'match_score': match_count,
                'matched_ingredients': [ing for ing in input_ingredients if ing in ingredient_text]
            })

    scored_recipes.sort(key=lambda r: r['match_score'], reverse=True)
    scored_recipes = scored_recipes[:10]

    return Response(scored_recipes)