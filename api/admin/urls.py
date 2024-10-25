from django.urls import path
from .views import promote_to_merchant, list_merchants, list_agents, ticket_sales_log

urlpatterns = [
    path('promote-to-merchant/<uuid:user_id>/', promote_to_merchant, name='promote_to_merchant'),
    path('merchants/', list_merchants, name='list_merchants'),
    path('agents/', list_agents, name='list_agents'),
    path('ticket-sales-log/', ticket_sales_log, name='ticket_sales_log'),
]
