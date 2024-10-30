from django.urls import path
from .views import request_payout, list_payout_requests, process_payout, get_payout_by_id


urlpatterns = [
    path('request/', request_payout, name='payout'),
    path('list/', list_payout_requests, name='payout_requests'),
    path('get_payout_by_id/<str:payment_id>', get_payout_by_id, name='payout_by_id'),
    path('process/<str:payment_id>', process_payout, name='payout_process')

]