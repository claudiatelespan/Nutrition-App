from django.db import models
from django.conf import settings

class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)
    calories_per_unit = models.FloatField()
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    calories = models.FloatField()
    cuisine_type = models.CharField(max_length=100)
    prep_time = models.IntegerField(help_text="Time in minutes")
    difficulty = models.CharField(max_length=20, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])
    meal_type = models.CharField(max_length=50, choices=[('breakfast', 'Breakfast'), ('lunch', 'Lunch'), ('dinner', 'Dinner')])
    rating = models.FloatField(default=0)
    image = models.ImageField(upload_to='recipe_images/', null=True, blank=True)

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    reteta = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField()

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

class Snack(models.Model):
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=20)
    calories_per_unit = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.unit})"

class PhysicalActivity(models.Model):
    name = models.CharField(max_length=100)
    met_low = models.FloatField()
    met_moderate = models.FloatField()
    met_high = models.FloatField()

    def __str__(self):
        return self.name
    
class ShoppingList(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Shopping List"


class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name="items")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=100)
    is_checked = models.BooleanField(default=False)

    class Meta:
        unique_together = ("shopping_list", "ingredient")