from django.core.management.base import BaseCommand
from recipes.models import Ingredient 
import json

class Command(BaseCommand):
    help = "Populează tabela Ingredient cu ingrediente"
    
    Ingredient.objects.all().delete()

    def handle(self, *args, **kwargs):
        with open('./recipes/management/data/ingredients/all_ingredients.json', encoding='utf-8') as f:
            data = json.load(f)
        
        for item in data:
            Ingredient.objects.create(
                name=item["name"],
                category=item["category"]
            )

        self.stdout.write(self.style.SUCCESS("✔️ Tabela Ingredient a fost populată cu succes!"))
