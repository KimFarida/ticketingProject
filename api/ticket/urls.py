from django.urls import path
from .views import create_ticket_type,list_ticket_types,update_ticket_type, delete_ticket_type, create_tickets,check_ticket_validity,get_agent_tickets

urlpatterns = [
    path("ticket-type/", create_ticket_type, name="create_ticket_type"),
    path("ticket-types/list/", list_ticket_types, name="list_ticket_types"),
    path("ticket_type/<int:pk>/", update_ticket_type, name="update_ticket_type"),
    path("ticket-type/<int:pk>/delete/", delete_ticket_type, name="delete_ticket_type"),
    path("create-ticket/", create_tickets, name="create_tickets"),
    path("check-ticket/<str:ticket_code>/", check_ticket_validity, name="check_ticket_validity"),
    path("get-agent-tickets/", get_agent_tickets, name="get_agent_tickets"),
]