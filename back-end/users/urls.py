from django.urls import path
from .views import RegisterView, logout_view, get_user_info, update_user_profile 
from .views import SendFriendRequestView, RespondFriendRequestView, FriendListView, PendingFriendRequestsView, SharedFavoritesView, RemoveFriendView
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
    path("me/update-profile/", update_user_profile),
    path("friends/request/", SendFriendRequestView.as_view()),
    path("friends/respond/", RespondFriendRequestView.as_view()),
    path("friends/", FriendListView.as_view()),
    path("friends/pending/", PendingFriendRequestsView.as_view()),
    path("friends/<str:username>/shared-favorites/", SharedFavoritesView.as_view()),
    path("friends/<str:username>/", RemoveFriendView.as_view(), name="remove-friend"),

]
