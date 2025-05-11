from django.db import models
from django.conf import settings
from recipes.models import Recipe, Snack, PhysicalActivity

class MealLog(models.Model):
    MEAL_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=20, choices=MEAL_CHOICES)
    date = models.DateField()
    calories = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.meal_type} - {self.date}"

class SnackLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    snack = models.ForeignKey(Snack, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.PositiveIntegerField()
    calories = models.FloatField(editable=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.calories = self.snack.calories_per_unit * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.snack.name} x{self.quantity} - {self.date}"

class PhysicalActivityLog(models.Model):
    INTENSITY_CHOICES = [
        ("low", "Low"),
        ("moderate", "Moderate"),
        ("high", "High"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity = models.ForeignKey(PhysicalActivity, on_delete=models.CASCADE)
    intensity = models.CharField(max_length=10, choices=INTENSITY_CHOICES)
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.FloatField(blank=True, null=True)
    date = models.DateField()

    def save(self, *args, **kwargs):
        met = getattr(self.activity, f"met_{self.intensity}")
        weight = 70  # TODO: replace with user.profile.weight if available
        self.calories_burned = round(met * weight * (self.duration_minutes / 60), 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} - {self.activity.name} - {self.date}"