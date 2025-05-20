from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recipe, Ingredient, RecipeIngredient, FavoriteRecipe, Snack, PhysicalActivity, ShoppingListItem, ShoppingList
from .serializers import RecipeSerializer, IngredientSerializer, FavoriteRecipeSerializer, SnackSerializer, PhysicalActivitySerializer, ShoppingListSerializer, ShoppingListItemSerializer

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
            category = ing.category
            if category == "Dairy":
                if ing.name in DAIRY_NOT_GRAMS or "Milk" in ing.name or "Soup" in ing.name:
                    unit = "ml"
                else:
                    unit = "g"
            elif category in UNIT_IS_GRAMS:
                unit = "g"
            else:
                unit = "ml"

            if ing.id in item_map:
                item_map[ing.id]["quantity"] += ri.quantity
            else:
                item_map[ing.id] = {
                    "ingredient": ing,
                    "quantity": ri.quantity,
                    "unit": unit,
                }
            
            print(item_map)

        for ing_data in item_map.values():
            ShoppingListItem.objects.create(
                shopping_list=shopping_list,
                ingredient=ing_data["ingredient"],
                quantity=round(ing_data["quantity"], 2),
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