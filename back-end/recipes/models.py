from django.db import models
from django.conf import settings

class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    directions = models.TextField(blank=True, null=True)
    ingredients = models.TextField(blank=True, null=True)

    calories = models.FloatField(null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    carbohydrates = models.FloatField(null=True, blank=True)
    sugars = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)
    fiber = models.FloatField(null=True, blank=True)
    servings = models.IntegerField(null=True, blank=True)

    cuisine_type = models.CharField(max_length=256, blank=True, null=True)
    prep_time = models.IntegerField(help_text="Time in minutes", null=True, blank=True)
    difficulty = models.CharField(
        max_length=20,
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
        blank=True,
        null=True
    )
    category = models.CharField(max_length=256, blank=True, null=True)
    rating = models.FloatField(default=0, blank=True, null=True)
    rating_count = models.IntegerField(default=0)
    image = models.ImageField(upload_to='recipe_images/', null=True, blank=True)

    def update_rating(self):
        ratings = self.ratings.all()
        if ratings.exists():
            self.rating = sum([r.rating for r in ratings]) / ratings.count()
            self.rating_count = ratings.count()
        else:
            self.rating = 0
            self.rating_count = 0
        self.save(update_fields=["rating", "rating_count"])

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    reteta = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} of {self.ingredient.name} for {self.reteta.name}"

class FavoriteRecipe(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="favorited_by")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "recipe")
        ordering = ["-added_at"]

    def __str__(self):
        return f"{self.user.username} ❤️ {self.recipe.name}"
    
class RecipeRating(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('recipe', 'user')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.recipe.update_rating()

    def delete(self, *args, **kwargs):
        recipe = self.recipe
        super().delete(*args, **kwargs)
        recipe.update_rating()

class Snack(models.Model):
    name = models.CharField(max_length=100)
    calories_per_100g = models.FloatField(null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    carbohydrates = models.FloatField(null=True, blank=True)
    sugar = models.FloatField(null=True, blank=True)
    fiber = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} (grams)"

class PhysicalActivity(models.Model):
    name = models.CharField(max_length=100)
    met_low = models.FloatField()
    met_moderate = models.FloatField()
    met_high = models.FloatField()
    information = models.TextField(blank=True, help_text="Describe what each intensity means, e.g. speed or effort.")

    def __str__(self):
        return self.name
    
class ShoppingList(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Shopping List"


class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name="items")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField()
    is_checked = models.BooleanField(default=False)
    unit = models.CharField(max_length=25)

    class Meta:
        unique_together = ("shopping_list", "ingredient")