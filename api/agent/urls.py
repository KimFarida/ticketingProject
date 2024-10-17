from django.urls import path
from .views import list_all_merchants #create_voucher

urlpatterns = [
    path('list_all_merchants/', list_all_merchants, name='list_all_merchants'),
    #path('create_voucher/', create_voucher, name='create_voucher'),
]