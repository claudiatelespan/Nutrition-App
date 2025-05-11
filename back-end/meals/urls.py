from django.urls import path, include
from .views import MealLogViewSet, SnackLogViewSet, PhysicalActivityLogViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"meals", MealLogViewSet, basename="meallog")
router.register(r"snacks", SnackLogViewSet, basename="snacklog")
router.register(r"activities", PhysicalActivityLogViewSet, basename="activitylog")

urlpatterns = [
    path('', include(router.urls)),
]