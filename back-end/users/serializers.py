from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, FriendRequest

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'weight', 'height', 'sex', 'birth_date',
            'activity_level', 'goal', 'diet'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user_username = serializers.CharField(source="from_user.username", read_only=True)
    to_user_username = serializers.CharField(source="to_user.username", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["id", "from_user", "from_user_username", "to_user", "to_user_username", "status", "created_at", "responded_at"]
        read_only_fields = ["status", "created_at", "responded_at"]
