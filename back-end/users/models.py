from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

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
    share_favorites = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()


class FriendRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    from_user = models.ForeignKey(User, related_name="sent_requests", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="received_requests", on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("from_user", "to_user")

    def accept(self):
        self.status = "accepted"
        self.responded_at = timezone.now()
        self.save()

    def reject(self):
        self.status = "rejected"
        self.responded_at = timezone.now()
        self.save()