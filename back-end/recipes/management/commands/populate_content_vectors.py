from django.core.management.base import BaseCommand
from recipes.models import Recipe, RecipeIngredient
from sklearn.feature_extraction.text import TfidfVectorizer

class Command(BaseCommand):
    help = "Populate Recipe.content_vector with TF-IDF vectors from ingredients + name + cuisine + category + difficulty"

    def handle(self, *args, **kwargs):
        # Step 1: Gather ingredients per recipe
        recipe_texts = {}
        all_ri = RecipeIngredient.objects.select_related('ingredient')
        for ri in all_ri:
            recipe_id = ri.reteta_id
            ingredient_name = ri.ingredient.name.strip().lower() if ri.ingredient else ""
            recipe_texts.setdefault(recipe_id, []).append(ingredient_name)

        # Step 2: Build combined text string per recipe
        combined_texts = {}
        recipes = Recipe.objects.all()
        for recipe in recipes:
            ingredients_str = " ".join(recipe_texts.get(recipe.id, []))
            fields = [
                ingredients_str,
                recipe.name.lower() if recipe.name else "",
                recipe.cuisine_type.lower() if recipe.cuisine_type else "",
                recipe.category.lower() if recipe.category else "",
                recipe.difficulty.lower() if recipe.difficulty else "",
            ]
            combined_texts[recipe.id] = " ".join(fields).strip()

        # Step 3: Vectorize all combined texts
        recipe_ids = list(combined_texts.keys())
        corpus = [combined_texts[rid] for rid in recipe_ids]

        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(corpus)  # sparse matrix (num_recipes, num_features)

        # Step 4: Save vectors back to Recipe
        for idx, rid in enumerate(recipe_ids):
            vector = X[idx].toarray().flatten().tolist()
            Recipe.objects.filter(id=rid).update(content_vector=vector)

        self.stdout.write(self.style.SUCCESS("✔️ content_vector field populated with combined features"))
