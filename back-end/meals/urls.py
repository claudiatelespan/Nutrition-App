from django.urls import path, include
from .views import MealLogViewSet, SnackLogViewSet, PhysicalActivityLogViewSet
from .views import daily_macros_log, daily_calories_log_with_target, calories_intake_vs_burned_log, macro_distribution
from .views import top_meal_categories, top_cuisine_ratings, average_activity_duration, average_snacks_per_day, activity_days_streak, top_activity_types
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"meals", MealLogViewSet, basename="meallog")
router.register(r"snacks", SnackLogViewSet, basename="snacklog")
router.register(r"activities", PhysicalActivityLogViewSet, basename="activitylog")

urlpatterns = [
    path('', include(router.urls)),
    path('calories-log/', daily_calories_log_with_target, name="calories-log"),
    path('macros-log/', daily_macros_log, name="macros-log"),
    path('calories-intake-vs-burned/', calories_intake_vs_burned_log, name="calories-intake-vs-burned"),
    path('macro_distribution/', macro_distribution, name="macro-distribution"),
    path("statistics/meal-categories/", top_meal_categories),
    path("statistics/favorite-cuisines/", top_cuisine_ratings),
    path("statistics/average-snacks/", average_snacks_per_day),
    path("statistics/average-activity-duration/", average_activity_duration),
    path("statistics/activity-days/", activity_days_streak, name="activity-days-streak"),
    path("statistics/top-activities/", top_activity_types, name="top-activity-types"),
]