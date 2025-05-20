from django.core.management.base import BaseCommand
from recipes.models import PhysicalActivity 
import json

class Command(BaseCommand):
    help = "Populează tabela PhysicalActivity cu activități"
    
    PhysicalActivity.objects.all().delete()

    def handle(self, *args, **kwargs):
        with open('./recipes/management/data/met_activities_final.json', encoding='utf-8') as f:
            data = json.load(f)
        
        for item in data:
            PhysicalActivity.objects.create(
                name=item['Activity'],
                met_low= item["MET_LOW"],
                met_moderate= item["MET_MODERATE"],
                met_high= item["MET_HIGH"],
                information= item.get("Description", "")
            )

        self.stdout.write(self.style.SUCCESS("✔️ Tabela PhysicalActivity a fost populată cu succes!"))
