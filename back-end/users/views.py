from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
