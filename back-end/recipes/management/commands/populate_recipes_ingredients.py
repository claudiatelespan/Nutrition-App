from django.core.management.base import BaseCommand
from recipes.models import Ingredient, Recipe, RecipeIngredient
import json

class Command(BaseCommand):
    help = "Populează tabela RecipeIngredient folosind fișierele JSON"

    def handle(self, *args, **kwargs):
        RecipeIngredient.objects.all().delete()

        with open(f"./recipes/management/data/recipes/all_recipes.json", "r", encoding="utf-8") as f:
            recipes_data = json.load(f)

        for recipe_data in recipes_data:
            recipe_name = recipe_data["name"].strip()
            recipe = Recipe.objects.filter(name__iexact=recipe_name).first()

            if not recipe:
                print(f"⚠️ Rețeta '{recipe_name}' nu a fost găsită în baza de date.")
                continue

            for item in recipe_data.get("simplified_ingredients", []):
                ingredient_name = item["ingredient"].strip().lower()
                unit = item.get("unit", "").strip().lower()
                quantity = item.get("quantity", 0)

                ingredient = Ingredient.objects.filter(name__iexact=ingredient_name).first()

                if not ingredient:
                    print(f"⚠️ Ingredientul '{ingredient_name}' nu a fost găsit pentru rețeta '{recipe_name}'")
                    continue

                RecipeIngredient.objects.create(
                    reteta_id=recipe.id,
                    ingredient_id=ingredient.id,
                    quantity=quantity,
                    unit=unit,
                )

        self.stdout.write(self.style.SUCCESS("✔️ Tabela RecipeIngredient a fost populată cu succes!"))