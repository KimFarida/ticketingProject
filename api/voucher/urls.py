from django.urls import path
from .views import created_vouchers, issued_vouchers, create_voucher, process_voucher, get_voucher


urlpatterns = [
    path('created_vouchers/', created_vouchers, name='created_vouchers'),
    path('issued_vouchers/', issued_vouchers, name='issued_vouchers'),
    path('create_voucher/', create_voucher, name='create_voucher'),
    path('get_voucher/', get_voucher, name='get_voucher'),
    path('process_voucher/', process_voucher, name='process_voucher')
]
#
# 9e720c19149846d8d19395e9fc830877d729cd6e
#Q6CxwogifM