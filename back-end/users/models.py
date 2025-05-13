from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    SEX_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
    ]

    ACTIVITY_LEVEL_CHOICES = [
        ("sedentary", "Sedentary"),
        ("moderate", "Moderate"),
        ("active", "Active"),
        ("very_active", "Very Active"),
    ]

    GOAL_CHOICES = [
        ("maintain", "Maintain Weight"),
        ("lose", "Lose Weight"),
        ("gain", "Gain Weight"),
    ]

    DIET_CHOICES = [
        ("omnivore", "Omnivore"),
        ("vegetarian", "Vegetarian"),
        ("vegan", "Vegan"),
        ("gluten_free", "Gluten-Free"),
        ("keto", "Keto"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    weight = models.FloatField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_LEVEL_CHOICES, null=True, blank=True)
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, null=True, blank=True)
    diet = models.CharField(max_length=20, choices=DIET_CHOICES, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()