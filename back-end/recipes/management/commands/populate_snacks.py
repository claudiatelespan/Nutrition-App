from django.core.management.base import BaseCommand
from recipes.models import Snack

snack_list = [
    ("Măr", "buc", 95),
    ("Banana", "buc", 105),
    ("Baton proteic", "buc", 200),
    ("Iaurt grecesc", "g", 59),
    ("Nuci", "g", 6.5),
    ("Chipsuri", "g", 5.4),
    ("Biscuiți", "buc", 60),
    ("Ciocolată neagră", "g", 5.9),
    ("Popcorn", "g", 3.7),
    ("Suc natural", "ml", 0.5),
]

class Command(BaseCommand):
    help = "Populează baza de date cu snack-uri predefinite"

    def handle(self, *args, **kwargs):
        Snack.objects.all().delete()

        for name, unit, calories in snack_list:
            Snack.objects.create(
                name=name,
                unit=unit,
                calories_per_unit=calories
            )

        self.stdout.write(self.style.SUCCESS("✔️ Tabela Snack a fost populată cu succes!"))
