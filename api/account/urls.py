from django.urls import path
from .views import  register, login, logout, request_password_reset,reset_password_confirm, get_user_details

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('request-password-reset/', request_password_reset, name='request-password-reset'),
    path('reset-password-confirm/', reset_password_confirm, name='reset-password-confirm'),
    path('get-user/<uuid:user_id>', get_user_details, name='get-user'),
]