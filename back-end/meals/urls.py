from django.urls import path, include
from .views import MealLogViewSet, SnackLogViewSet, PhysicalActivityLogViewSet
from .views import daily_macros_log, daily_calories_log_with_target, calories_intake_vs_burned_log, macro_distribution
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
]