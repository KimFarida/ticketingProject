from django.urls import path
from .views import process_voucher, get_merchant_vouchers

urlpatterns = [
    path('get_merchant_vouchers', get_merchant_vouchers, name='get_merchant_vouchers'),
    path('process_voucher', process_voucher, name='process_voucher')
]