from django.urls import path
from .views import process_voucher
urlpatterns = [
    path('process_voucher', process_voucher, name='process_voucher')
]