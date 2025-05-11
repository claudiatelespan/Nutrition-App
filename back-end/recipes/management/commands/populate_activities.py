from django.core.management.base import BaseCommand
from recipes.models import PhysicalActivity 

activity_list = [
    # name,            MET_easy, MET_moderate, MET_hard
    ("Alergare",        8.0,       9.8,           11.5),
    ("Mers pe jos",     2.5,       3.5,           4.5),
    ("Ciclism",         4.0,       6.8,           10.0),
    ("Înot",            6.0,       8.0,           10.3),
    ("Antrenament cu greutăți", 3.0,  4.5,        6.0),
    ("Yoga",            2.0,      2.5,           3.0),
    ("Dans",            3.5,       5.0,           7.0),
    ("HIIT",            6.0,       8.5,           11.0),
    ("Pilates",         2.5,      3.0,           3.5),
    ("Drumeție",        4.5,       6.0,           7.5),
]

class Command(BaseCommand):
    help = "Populează tabela PhysicalActivity cu activități predefinite"

    def handle(self, *args, **kwargs):
        PhysicalActivity.objects.all().delete()

        for name, met_easy, met_moderate, met_hard in activity_list:
            PhysicalActivity.objects.create(
                name=name,
                met_low=met_easy,
                met_moderate=met_moderate,
                met_high=met_hard,
            )

        self.stdout.write(self.style.SUCCESS("✔️ Tabela PhysicalActivity a fost populată cu succes!"))
