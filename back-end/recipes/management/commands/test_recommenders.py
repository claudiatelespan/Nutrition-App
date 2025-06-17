# your_app/management/commands/test_recommenders.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from recipes.models import Recipe
from recipes.recommenders import get_recipes_by_content  # Adjust import path
from django.db.models import Max, Min
from recipes.recommenders import get_combined_recommendations


User = get_user_model()

class Command(BaseCommand):
    help = "Test combined popularity + content-based recommender"

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-id',
            type=int,
            required=True,
            help='User ID to generate recommendations for'
        )
        parser.add_argument(
            '--top-n',
            type=int,
            default=10,
            help='Number of top recipes to recommend'
        )
        parser.add_argument(
            '--alpha',
            type=float,
            default=1,
            help='Weight for content-based similarity (between 0 and 1)'
        )

    def handle(self, *args, **options):
        user_id = options['user_id']
        top_n = options['top_n']
        alpha = options['alpha']

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            self.stderr.write(f"User with ID {user_id} does not exist.")
            return
        
        self.stdout.write(f"Running combined recommender for user '{user.username}' (ID: {user_id})")
        recommended_recipes = get_combined_recommendations(user_id=user_id, top_n=top_n, alpha=alpha)

        if not recommended_recipes:
            self.stdout.write("No recommendations could be generated for this user.")
            return
        
        self.stdout.write(f"Top {top_n} recommended recipes:")
        for i, recipe in enumerate(recommended_recipes, start=1):
            self.stdout.write(f"{i}. {recipe.name} (ID: {recipe.id})")

        self.stdout.write(self.style.SUCCESS("✔️ Combined recommender test complete!"))