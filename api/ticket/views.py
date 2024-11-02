from datetime import datetime, timedelta

from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializer import CreateTicketTypeSerializer, TicketSerializer, CreateTicketSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from decimal import Decimal
from api.models import TicketType, Ticket, Agent
from django.db import transaction
import traceback

import logging

from ..account.permissions import IsAgent

# Create a logger instance
logger = logging.getLogger(__name__)


@swagger_auto_schema(
    method='POST',
    request_body=CreateTicketTypeSerializer,
    responses={
        201: "Success"
    }
)
@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_ticket_type(request):
    """
    Create a new Ticket Type.

    - `name` (str): The name of the ticket type.
    - `unit_price` (Decimal): The price of the ticket type.
    - `description` (str): Description of the ticket type.
    - `expiration_datetime` (DateTime): Expiration date and time for the ticket.

    Returns:
    - On success: Details of the newly created ticket type.
    - On failure: Validation error or server error.
    """
    serializer = CreateTicketTypeSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        try:
            serializer.save()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='GET',
    responses={200: CreateTicketTypeSerializer(many=True)}
)
@api_view(["GET"])
def list_ticket_types(request):
    """
    List all Ticket Types with optional filtering.

    - `name` (str, optional): Filter ticket types by name.

    Returns:
    - On success: List of ticket types.
    """
    name = request.query_params.get('name', None)
    queryset = TicketType.objects.all()
    if name:
        queryset = queryset.filter(name__icontains=name)

    serializer = CreateTicketTypeSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='PUT',
    request_body=CreateTicketTypeSerializer,
    responses={200: "Success"}
)
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_ticket_type(request, id):
    """
    Update a Ticket Type by ID.

    - `pk`: ID of the ticket type to update.

    Returns:
    - On success: Details of the updated ticket type.
    - On failure: Validation error or server error.
    """

    try:
        ticket_type = TicketType.objects.get(pk=id)
    except TicketType.DoesNotExist:
        return Response({"error": "Ticket type not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = CreateTicketTypeSerializer(ticket_type, data=request.data, partial=True)
    if serializer.is_valid():
        ticket_type = serializer.save()

        # Update the `valid_until` field of all tickets with this TicketType
        Ticket.objects.filter(ticket_type=ticket_type).update(valid_until=ticket_type.expiration_date)

        #If there is an increase in expiration date, should reflect for all tickets
        if ticket_type.expiration_date > timezone.now():
            Ticket.objects.filter(ticket_type=ticket_type).update(valid=True)
        else:
            Ticket.objects.filter(ticket_type=ticket_type).update(valid=False)

        return Response({"message": "Successfully updated ticket type.",
            "updated_fields": serializer.validated_data,
            "data": serializer.data}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='DELETE',
    responses={204: "No Content"}
)
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_ticket_type(request, id):
    """
    Delete a Ticket Type by ID.

    - `id`: ID of the ticket type to delete.

    Returns:
    - On success: No content.
    - On failure: Ticket type not found.
    """
    try:
        ticket_type = TicketType.objects.get(pk=id)

        with transaction.atomic():
            #Invalidate Every Ticket Created Using This Type and set the Ticket Type to Null
            Ticket.objects.filter(ticket_type=ticket_type).update(valid=False, ticket_type=None)
            ticket_type.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except TicketType.DoesNotExist:
        return Response({"error": "Ticket type not found."}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    method='POST',
    request_body=CreateTicketSerializer,
    responses={201: "Success"}
)
@api_view(["POST"])
@permission_classes([IsAgent])
def create_tickets(request):
    """
    Create new tickets by an agent.

    - `ticket_type` (uuid): ID of the ticket type.
    - `quantity` (int): Number of tickets to create (default 1).
    - `buyer_name` (str): Name of the ticket buyer.
    - `buyer_contact` (str): Contact information for the buyer.

    Returns:
    - On success: Details of the newly created tickets.
    - On failure: Validation error or server error.
    """

    # Fetch the agent from the logged-in user
    agent = Agent.objects.filter(user=request.user).first()
    if not agent:
        return Response({"error": "Only agents can create tickets."}, status=status.HTTP_403_FORBIDDEN)

    user = agent.user
    wallet = agent.user.wallet  # Access the agent's wallet
    # wallet.bonus_balance += Decimal(100000)
    # wallet.save()
    ticket_type_id = request.data.get('ticket_type')
    quantity = int(request.data.get('quantity', 1))
    buyer_name = request.data.get('buyer_name')
    buyer_contact = request.data.get('buyer_contact')

    try:
        # Check if the ticket type exists
        ticket_type = TicketType.objects.get(pk=ticket_type_id)

        current_time = timezone.now()
        if current_time >= ticket_type.expiration_date:
            return Response({"error": "The selected Ticket Type has expired"}, status=status.HTTP_400_BAD_REQUEST)

        unit_price = ticket_type.unit_price
        total_cost = quantity * unit_price

        if wallet.voucher_balance < total_cost:
            return Response({"error": "Insufficient balance in the agent's wallet."},
                            status=status.HTTP_400_BAD_REQUEST)

        tickets_created = []
        with transaction.atomic():  # Ensure both ticket creation and wallet deduction are atomic
            for _ in range(quantity):
                ticket_data = {
                    'ticket_type': ticket_type_id,
                    'buyer_name': buyer_name,
                    'buyer_contact': buyer_contact,
                }

                # Pass the agent through the context to the serializer
                serializer = TicketSerializer(data=ticket_data, context={'agent': user})

                # Validate and save the ticket
                if serializer.is_valid():
                    ticket = serializer.save()
                    tickets_created.append(ticket)
                else:
                    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            wallet.voucher_balance -= total_cost
            wallet.save()

    except TicketType.DoesNotExist:
        return Response({"error": "Invalid Ticket Type ID provided."}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Any other error is caught and rolled back
        logger.error(f"Error: {str(e)}")
        logger.error(traceback.format_exc())
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    ticket_serializer = TicketSerializer(tickets_created, many=True)

    ticket_type_info = {
        "name": ticket_type.name,
        "description": ticket_type.description,
    }


    agent_info = {
        "login_id": agent.user.login_id,
        "name": f"{agent.user.first_name} {agent.user.last_name}",
    }
    return Response(
        {
            "message": f"{len(tickets_created)} tickets created successfully.",
            "tickets": ticket_serializer.data,
            "total_cost": total_cost,
            "voucher_balance": wallet.voucher_balance,
            "ticket_type_info": ticket_type_info,
            "agent_info": agent_info
        },
        status=status.HTTP_201_CREATED
    )

@swagger_auto_schema(
    method='GET',
    operation_summary="Check Ticket Validity",
    operation_description="Check if a ticket is valid given its ticket code. Returns ticket details if valid.",
    manual_parameters=[
        openapi.Parameter(
            'ticket_code',
            openapi.IN_PATH,
            description="The unique code of the ticket to check.",
            type=openapi.TYPE_STRING,
            required=True,
        ),
    ],
    responses={
        200: openapi.Response(
            description="Ticket is valid.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'valid': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                    'ticket_info': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'ticket_code': openapi.Schema(type=openapi.TYPE_STRING),
                            'buyer_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'buyer_contact': openapi.Schema(type=openapi.TYPE_STRING),
                            'ticket_type': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_STRING),
                                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'description': openapi.Schema(type=openapi.TYPE_STRING),
                                },
                            ),
                            'agent': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'login_id': openapi.Schema(type=openapi.TYPE_STRING),
                                },
                            ),
                            'valid_until': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                        },
                    ),
                },
            ),
        ),
        400: openapi.Response(
            description="Ticket is invalid or expired.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'valid': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                },
            ),
        ),
        404: openapi.Response(
            description="Ticket not found.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING),
                },
            ),
        ),
    },
)
@api_view(["GET"])
def check_ticket_validity(request, ticket_code):
    """
    Check if a ticket is valid given its ticket_code.

    Returns:
    - On success: Ticket details if valid.
    - On failure: if not valid or ticket does not exist.
    """

    try:
        ticket = Ticket.objects.get(ticket_code=ticket_code)
        if ticket.ticket_type is None:
            return Response({"error": "Ticket type deleted"}, status=status.HTTP_410_GONE)
        ticket_info = {
            "ticket_code": ticket.ticket_code,
            "buyer_name": ticket.buyer_name,
            "buyer_contact": ticket.buyer_contact,
            "ticket_type": {
                "id": ticket.ticket_type.id,
                "name": ticket.ticket_type.name,
                "description": ticket.ticket_type.description,
            },
            "agent": {
                "name": f"{ticket.agent.first_name} {ticket.agent.last_name}",
                "login_id": ticket.agent.login_id,
            },
            "valid_until": ticket.valid_until,
            "created_at": ticket.created_at,
            "updated_at": ticket.updated_at,
        }

        if ticket.valid and ticket.valid_until > timezone.now():
            return Response({"valid": True, "ticket_info": ticket_info}, status=status.HTTP_200_OK)
        else:
            ticket.valid = False
            return Response({"valid": False, "ticket_info": ticket_info, "message": "Ticket is invalid or expired."},
                            status=status.HTTP_200_OK)

    except Ticket.DoesNotExist:
        return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    method='GET',
    operation_summary="Get Filtered Tickets for Agent",
    operation_description="Retrieve tickets associated with the authenticated agent with optional date filtering.",
    manual_parameters=[
        openapi.Parameter(
            'start_date',
            openapi.IN_QUERY,
            description="Start date for filtering tickets (YYYY-MM-DD).",
            type=openapi.TYPE_STRING,
        ),
        openapi.Parameter(
            'end_date',
            openapi.IN_QUERY,
            description="End date for filtering tickets (YYYY-MM-DD).",
            type=openapi.TYPE_STRING,
        ),
        openapi.Parameter(
            'period',
            openapi.IN_QUERY,
            description="Filter tickets by period: 'today', 'week', or 'month'.",
            type=openapi.TYPE_STRING,
            enum=['today', 'week', 'month'],
        ),
    ],
    responses={
        200: openapi.Response(
            description="A list of tickets belonging to the agent.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'tickets': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'ticket_code': openapi.Schema(type=openapi.TYPE_STRING),
                                'buyer_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'buyer_contact': openapi.Schema(type=openapi.TYPE_STRING),
                                'valid_until': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                'valid': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            },
                        ),
                    ),
                },
            ),
        ),
        403: openapi.Response(
            description="Access denied for unauthorized users.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING),
                },
            ),
        ),
    },
)
@api_view(['GET'])
@permission_classes([IsAgent | IsAdminUser])
def get_agent_tickets(request):
    """
    Retrieve tickets associated with the authenticated agent or all tickets if the user is an admin,
    with optional date filtering.
    """

    if request.user.is_staff or request.user.is_superuser:
        tickets = Ticket.objects.all()
    else:
        agent = Agent.objects.filter(user=request.user).first()
        if not agent:
            return Response({"error": "Agent not found."}, status=status.HTTP_404_NOT_FOUND)

        tickets = Ticket.objects.filter(agent=request.user)

    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    period = request.query_params.get('period')

    if period == 'today':
        today = timezone.now().date()
        tickets = tickets.filter(created_at__date=today)
    elif period == 'week':
        start_of_week = timezone.now() - timedelta(days=7)
        tickets = tickets.filter(created_at__gte=start_of_week)
    elif period == 'month':
        start_of_month = timezone.now() - timedelta(days=30)
        tickets = tickets.filter(created_at__gte=start_of_month)
    elif start_date and end_date:
        # Validate and filter by specific date range
        try:
            start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
            end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d')) + timedelta(days=1)  # Inclusive
            tickets = tickets.filter(created_at__range=(start_date, end_date))
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    # Serialize and return the tickets
    ticket_serializer = TicketSerializer(tickets, many=True)

    return Response({"tickets": ticket_serializer.data}, status=status.HTTP_200_OK)
