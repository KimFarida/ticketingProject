from django.urls import path
from .views import request_payout, list_payout_requests, process_payout


urlpatterns = [
    path('request/', request_payout, name='payout'),
    path('list/', list_payout_requests, name='payout_requests'),
    path('process/<str:payment_id>', process_payout, name='payout_process')

]