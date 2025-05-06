from django.urls import path
from .views import RegisterView, logout_view, get_user_info
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)   

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    path("me/", get_user_info),
]
