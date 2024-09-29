from django.urls import path
from .views import promote_to_merchant, list_merchants, list_agents

urlpatterns = [
    path('promote-to-merchant/<uuid:user_id>/', promote_to_merchant, name='promote_to_merchant'),
    path('merchants/', list_merchants, name='list_merchants'),
    path('agents/', list_agents, name='list_agents'),
]
