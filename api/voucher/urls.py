from django.urls import path
from .views import sold_vouchers, bought_vouchers, create_voucher, process_voucher, get_voucher


urlpatterns = [
    path('sold_vouchers/', sold_vouchers, name='sold_vouchers'),
    path('bought_vouchers/', bought_vouchers, name='bought_vouchers'),
    path('create_voucher/', create_voucher, name='create_voucher'),
    path('get_voucher/', get_voucher, name='get_voucher'),
    path('process_voucher/', process_voucher, name='process_voucher')
]
