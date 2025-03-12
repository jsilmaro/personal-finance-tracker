from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction  # Assuming Transaction model exists
from .serializers import TransactionSerializer  # Assuming you have a serializer for Transaction
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view

class SignUpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)

class SignInView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful", "username": user.username}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class SignOutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows transactions to be viewed, created, updated, or deleted.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Ensures the transaction is linked to the logged-in user

def home(request):
    return HttpResponse("<h1>Welcome to Centsible!</h1>")


def api_root(request):
    return JsonResponse({
        "transactions": "/api/transactions/",
        "signup": "/api/signup/",
        "signin": "/api/signin/",
        "signout": "/api/signout/",
})


@api_view(["GET"])
def transaction_api(request):
    return Response({"message": "This is the transaction API"})

