from django.core.management.base import BaseCommand
from recipes.models import Ingredient, Recipe, RecipeIngredient
from random import choice, randint, uniform
from faker import Faker

fake = Faker()

ingredient_list = [
    ("Paste", "g", 3.5, "carbs"),
    ("Ouă", "buc", 70, "protein"),
    ("Bacon", "g", 5.4, "protein"),
    ("Broccoli", "g", 0.34, "vegetable"),
    ("Somon", "g", 2.0, "protein"),
    ("Sparanghel", "g", 0.2, "vegetable"),
    ("Ulei de măsline", "ml", 8.0, "fat"),
    ("Sare", "g", 0, "spice"),
    ("Piper", "g", 0, "spice"),
    ("Parmezan", "g", 4.3, "dairy"),
    ("Pui", "g", 2.4, "protein"),
    ("Cartofi", "g", 0.9, "carbs"),
]

class Command(BaseCommand):
    help = "Populează baza de date cu 10 rețete și ingrediente asociate"

    def handle(self, *args, **kwargs):
        # Golește bazele de date pentru test
        RecipeIngredient.objects.all().delete()
        Recipe.objects.all().delete()
        Ingredient.objects.all().delete()

        # Adaugă ingrediente
        ingredient_objs = []
        for name, unit, cal, category in ingredient_list:
            ing = Ingredient.objects.create(
                name=name,
                unit=unit,
                calories_per_unit=cal,
                category=category
            )
            ingredient_objs.append(ing)

        # Creează 10 rețete
        for _ in range(10):
            reteta = Recipe.objects.create(
                name=fake.sentence(nb_words=2).replace(".", ""),
                description=fake.text(max_nb_chars=120),
                calories=round(uniform(300, 800), 2),
                cuisine_type=choice(["Italian", "Asian", "Mexican", "Vegan", "French"]),
                prep_time=randint(10, 60),
                difficulty=choice(["easy", "medium", "hard"]),
                meal_type=choice(["breakfast", "lunch", "dinner"]),
                rating=round(uniform(3.0, 5.0), 1)
            )

            selected_ings = [choice(ingredient_objs) for _ in range(randint(3, 6))]
            for ing in selected_ings:
                RecipeIngredient.objects.create(
                    reteta=reteta,
                    ingredient=ing,
                    quantity=round(uniform(20, 150), 1)
                )

        self.stdout.write(self.style.SUCCESS("✔️ Baza de date a fost populată cu 10 rețete și ingrediente!"))
