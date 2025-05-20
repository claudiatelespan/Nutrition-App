from django.core.management.base import BaseCommand
from recipes.models import Snack
import json

class Command(BaseCommand):
    help = 'Populate the Snack table with data from snacks_100.json'
    
    Snack.objects.all().delete()

    def handle(self, *args, **kwargs):
        with open('./recipes/management/data/snacks/snacks_100.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        for item in data:
            Snack.objects.create(
                name=str(item['food']).title(),
                calories_per_100g=item['Caloric Value'],
                protein=item['Protein'],
                carbohydrates=item['Carbohydrates'],
                sugar=item['Sugars'],
                fiber=item['Dietary Fiber'],
                fat=item['Fat'],
            )

        self.stdout.write(self.style.SUCCESS("✔️ Tabela Snack a fost populată cu succes!"))
