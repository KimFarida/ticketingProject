from rest_framework.permissions import IsAdminUser

from api.account.permissions import IsAdmin
from django.contrib.auth.models import Group
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from api.models import User, Merchant, Agent, Ticket, PayoutSettings
from rest_framework.response import Response
from .serializer import AgentSerializer, MerchantSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Count, Sum
import csv
from django.utils import timezone


@swagger_auto_schema(
    method='POST',
    responses={
        201: "Agent successfully promoted to Merchant.",

    },

)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def promote_to_merchant(request, user_id):
    """
    Promote an existing user (Agent) to a Merchant.

    - `user_id` (UUID): The unique identifier of the user to be promoted.

    Returns:
    - `Response`:
        - On success (201 Created): Success message indicating the user has been promoted.
        - On failure (400 Bad Request): Message indicating the user is already a Merchant.
        - On failure (404 Not Found): Error message indicating the user or Merchant group was not found.
    """
    try:
        user = User.objects.get(pk=user_id)

        if user.role == 'Merchant':
            return Response({"message":"This user is already a Merchant"}, status=status.HTTP_400_BAD_REQUEST)

        Agent.objects.filter(user=user).delete()

        user.role = 'Merchant'
        user.save()

        Merchant.objects.create(user=user)

        return Response({"message": f"Agent {user.id} has been promoted to Merchant"},
                        status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Group.DoesNotExist:
        return Response({"error": "Merchant group not found."}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    method='GET',
    responses={200: MerchantSerializer(many=True)},
)
@api_view(['GET'])
def list_merchants(request):
    """
    List all merchants in the system.

    Returns:
    - `Response`:
        - On success (200 OK): A JSON array containing details of all merchants.
    """
    merchants = Merchant.objects.filter()
    serializer = MerchantSerializer(merchants, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='GET',
    responses={200: AgentSerializer(many=True)},
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_agents(request):
    """
    List all agents in the system.

    Returns:
    - `Response`:
        - On success (200 OK): A JSON array containing details of all agents.
    """
    agents = Agent.objects.filter()
    serializer = AgentSerializer(agents, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)




@swagger_auto_schema(
    method='GET',
    operation_summary="Download Ticket Sales Log",
    operation_description="Retrieve daily, weekly, or monthly ticket sales log, categorized by ticket type and agent.",
    manual_parameters=[
        openapi.Parameter(
            'date',
            openapi.IN_QUERY,
            description="Specify a date in YYYY-MM-DD format to filter the logs.",
            type=openapi.TYPE_STRING,
        ),
        openapi.Parameter(
            'period',
            openapi.IN_QUERY,
            description="Specify the period: 'day', 'week', or 'month' (optional, defaults to 'day').",
            type=openapi.TYPE_STRING,
        ),
        openapi.Parameter(
            'agent_id',
            openapi.IN_QUERY,
            description="The ID of the agent to filter by (optional).",
            type=openapi.TYPE_STRING,
        ),
        openapi.Parameter(
            'format',
            openapi.IN_QUERY,
            description="Specify the response format: 'json' or 'csv' (optional, defaults to 'json').",
            type=openapi.TYPE_STRING,
        ),
    ],
    responses={
        200: openapi.Response(
            description="A list of ticket sales with totals.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'data': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'ticket_type': openapi.Schema(type=openapi.TYPE_STRING),
                            'agent': openapi.Schema(type=openapi.TYPE_STRING),
                            'total_sold': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'total_amount': openapi.Schema(type=openapi.TYPE_NUMBER),
                        }
                    )),
                },
            ),
        ),
        403: "Forbidden",
    }
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def ticket_sales_log(request):
    """
    Download daily, weekly, or monthly ticket sales log, categorized by ticket type and agent.

    Query Parameters:
    - `date`: Specify a date in YYYY-MM-DD format to filter the logs.
    - `period`: 'day', 'week', or 'month' (optional, defaults to 'day').
    - `agent_id`: The ID of the agent to filter by (optional).
    - `format`: 'json' or 'csv' (optional, defaults to 'json').
    """
    date_str = request.query_params.get('date')
    period = request.query_params.get('period', 'day')
    agent_id = request.query_params.get('agent_id')
    output_format = request.query_params.get('format', 'json')

    # Default to today's date if no date is provided
    if not date_str:
        query_date = timezone.now().date()
    else:
        try:
            query_date = timezone.datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response({"error": "Invalid or missing date."}, status=400)

    # Adjust filtering based on period
    if period == 'day':
        start_date = query_date
        end_date = query_date + timezone.timedelta(days=1)
    elif period == 'week':
        start_date = query_date - timezone.timedelta(days=query_date.weekday())
        end_date = start_date + timezone.timedelta(days=7)
    elif period == 'month':
        start_date = query_date.replace(day=1)
        end_date = (start_date + timezone.timedelta(days=32)).replace(day=1)
    else:
        return Response({"error": "Invalid period. Choose 'day', 'week', or 'month'."}, status=400)

    # Query tickets sold in the given period
    tickets = Ticket.objects.filter(created_at__gte=start_date, created_at__lt=end_date, valid=True)

    # Filter by agent if agent_id is provided
    if agent_id:
        tickets = tickets.filter(agent__id=agent_id)

    # Group by ticket type and agent
    sales_data = tickets.values('ticket_type__name', 'agent__first_name', 'agent__last_name')\
        .annotate(
            total_sold=Count('id'),
            total_amount=Sum('ticket_type__unit_price')
        )

    # Return as JSON
    if output_format == 'json':
        return Response({
            "period": period,
            "date": query_date.strftime('%Y-%m-%d'),
            "sales_log": list(sales_data)
        }, status=200)

    elif output_format == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="ticket_sales_{period}_{query_date}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Ticket Type', 'Agent', 'Total Sold', 'Total Amount'])
        for ticket in sales_data:
            writer.writerow([ticket['ticket_type__name'], ticket['agent_name'], ticket['total_sold'], ticket['total_amount']])

        return response

    return Response({"error": "Invalid format. Choose 'json' or 'csv'."}, status=400)


@swagger_auto_schema(
    method='POST',
    operation_summary="Update Payout Settings",
    operation_description="Admin updates the monthly ticket quota, base salary, and percentage for partial payout when half of the quota is met.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'monthly_quota': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description="The target number of tickets to be sold monthly for full payout.",
                example=210
            ),
            'full_salary': openapi.Schema(
                type=openapi.TYPE_NUMBER,
                description="The full monthly salary amount to be paid when the quota is met.",
                example=1000.00
            ),
            'partial_salary_percentage': openapi.Schema(
                type=openapi.TYPE_NUMBER,
                description="Percentage of the salary to pay if half the quota is met.",
                example=20.0
            ),
        },
        required=['monthly_quota', 'full_salary', 'partial_salary_percentage'],
    ),
    responses={
        200: openapi.Response(
            description="Payout settings updated successfully.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING, example="Payout settings updated successfully."),
                    'settings': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'monthly_quota': openapi.Schema(type=openapi.TYPE_INTEGER, example=210),
                            'full_salary': openapi.Schema(type=openapi.TYPE_NUMBER, example=1000.00),
                            'partial_salary_percentage': openapi.Schema(type=openapi.TYPE_NUMBER, example=20.0),
                        }
                    ),
                },
            ),
        ),
        400: "Bad Request",
        403: "Forbidden",
    }
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_payout_settings(request):
    """
    Admin: Update monthly quota, full salary, and partial salary percentage.
    """
    try:
        settings = PayoutSettings.objects.first() or PayoutSettings()
        settings.monthly_quota = request.data.get('monthly_quota', settings.monthly_quota)
        settings.full_salary = request.data.get('full_salary', settings.full_salary)
        settings.partial_salary_percentage = request.data.get('partial_salary_percentage', settings.partial_salary_percentage)
        settings.save()

        return Response({
            "message": "Payout settings updated successfully.",
            "settings": {
                "monthly_quota": settings.monthly_quota,
                "full_salary": settings.full_salary,
                "partial_salary_percentage": settings.partial_salary_percentage,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
