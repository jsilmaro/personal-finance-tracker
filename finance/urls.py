from django.urls import path
from .views import TransactionViewSet, SignUpView, SignInView, SignOutView, api_root

urlpatterns = [
    path('', api_root, name='api-root'),  # Add this line for the API root
    path('transactions/', TransactionViewSet.as_view({'get': 'list', 'post': 'create'}), name='transaction-list'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('signout/', SignOutView.as_view(), name='signout'),
]