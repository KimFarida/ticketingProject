from django.urls import path
from .views import sold_vouchers, bought_vouchers, create_voucher


urlpatterns = [
    path('bought_vouchers', bought_vouchers, name='bought_vouchers'),
    path('sold_vouchers', sold_vouchers, name='sold_vouchers'),
    path('create_voucher/', create_voucher, name='create_voucher')
]