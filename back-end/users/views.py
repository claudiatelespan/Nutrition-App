from rest_framework import generics, status
from django.contrib.auth.models import User
from .models import FriendRequest
from recipes.models import FavoriteRecipe
from recipes.serializers import FavoriteRecipeSerializer
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer, FriendRequestSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    profile = request.user.profile
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "Profile updated."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        to_username = request.data.get("to_username")

        if to_username == request.user.username:
            return Response({"detail": "You cannot friend yourself."}, status=400)

        try:
            to_user = User.objects.get(username=to_username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        if FriendRequest.objects.filter(from_user=request.user, to_user=to_user).exists():
            return Response({"detail": "Request already sent."}, status=400)

        friend_request = FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        return Response(FriendRequestSerializer(friend_request).data, status=201)


class RespondFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_id = request.data.get("request_id")
        action = request.data.get("action")  # 'accept' or 'reject'

        try:
            fr = FriendRequest.objects.get(id=request_id, to_user=request.user)
        except FriendRequest.DoesNotExist:
            return Response({"detail": "Request not found."}, status=404)

        if action == "accept":
            fr.accept()
        elif action == "reject":
            fr.reject()
        else:
            return Response({"detail": "Invalid action."}, status=400)

        return Response({"status": fr.status})


class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        friends = FriendRequest.objects.filter(
            (Q(from_user=user) | Q(to_user=user)), status="accepted"
        )
        friend_users = [fr.to_user if fr.from_user == user else fr.from_user for fr in friends]
        data = [{"id": u.id, "username": u.username} for u in friend_users]
        return Response(data)


class PendingFriendRequestsView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user, status="pending")

class SharedFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            target = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        if not FriendRequest.objects.filter(
            Q(from_user=request.user, to_user=target) | Q(from_user=target, to_user=request.user),
            status="accepted"
        ).exists():
            return Response({"detail": "You are not friends."}, status=403)

        if not hasattr(target, "profile") or not target.profile.share_favorites:
            return Response({"detail": "Favorites are private."}, status=403)

        favorites = FavoriteRecipe.objects.filter(user=target)
        data = FavoriteRecipeSerializer(favorites, many=True).data
        return Response(data)

class RemoveFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, username):
        try:
            target = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        friendship = FriendRequest.objects.filter(
            Q(from_user=request.user, to_user=target) |
            Q(from_user=target, to_user=request.user),
            status="accepted"
        ).first()

        if not friendship:
            return Response({"detail": "You are not friends."}, status=400)

        friendship.delete()
        return Response({"detail": "Friend removed successfully."}, status=204)