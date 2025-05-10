from django.urls import path, include
from .views import MealLogViewSet, SnackLogViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"meals", MealLogViewSet, basename="meal")
router.register(r"snacks", SnackLogViewSet, basename="snacklog")

urlpatterns = [
    path('', include(router.urls)),
]