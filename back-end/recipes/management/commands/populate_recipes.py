from django.core.management.base import BaseCommand
from django.core.files import File
from recipes.models import Ingredient, Recipe, RecipeIngredient
import json
import os

CATEGORIES = ["appetizers_and_snacks", "breakfast_and_brunch", "desserts", "main_dish", "meat_and_poultry", "salad"]

class Command(BaseCommand):
    help = "Populează baza de date cu rețete"

    def handle(self, *args, **kwargs):
        print(os.getcwd())
        # Golește bazele de date pentru test
        Recipe.objects.all().delete()

        for cat in CATEGORIES:
            with open(f"./recipes/management/data/recipes/{cat}_augmented.json", "r", encoding="utf-8") as f:
                recipes_data = json.load(f)
            for recipe in recipes_data:
                image_file_name = recipe["name"].replace('"','').replace(' ', '_')
                image_path = f"./recipes/management/data/recipes/images/{image_file_name}.jpg"
                reteta = Recipe.objects.create(
                    name=recipe["name"],
                    description=recipe["summary"],
                    directions=recipe["directions"],
                    ingredients=recipe["ingredients"],
                    calories=recipe["calories"],
                    protein=recipe["protein_g"],
                    carbohydrates=recipe["carbohydrates_g"],
                    fat=recipe["fat_g"],
                    sugars=recipe["sugars_g"],
                    fiber=recipe["dietary_fiber_g"],
                    cuisine_type=recipe["cuisine_type"],
                    prep_time=recipe["prep_time"],
                    difficulty=recipe["difficulty"],
                    category=recipe["category"],
                    rating=recipe["rating"],
                )
                try:
                    with open(image_path, "rb") as img_file:
                        reteta.image.save(f"{image_file_name}.jpg", File(img_file), save=True)
                except FileNotFoundError:
                    print(f"⚠️ Imaginea nu a fost găsită pentru {recipe['name']}")

                
        self.stdout.write(self.style.SUCCESS("✔️ Baza de date a fost populată cu retete!"))
