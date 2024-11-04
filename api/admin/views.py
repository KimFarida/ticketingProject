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
from decimal import Decimal


@swagger_auto_schema(
    method='POST',
    responses={
        201: openapi.Response(
            description="Agent successfully promoted to Merchant.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: "User is already a Merchant",
        404: "User or Merchant group not found"
    }
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def promote_to_merchant(request, user_id):
    """
    Promote an existing user (Agent) to a Merchant.

    - user_id (UUID): The unique identifier of the user to be promoted.

    Returns:
    - Response:
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
    operation_description="List all merchants in the system",
    responses={
        200: openapi.Response(
            description="List of all merchants",
            schema=MerchantSerializer(many=True)
        )
    }
)
@api_view(['GET'])
def list_merchants(request):
    """
    List all merchants in the system.

    Returns:
    - Response:
        - On success (200 OK): A JSON array containing details of all merchants.
    """
    merchants = Merchant.objects.filter()
    serializer = MerchantSerializer(merchants, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='GET',
    operation_description="List all agents in the system",
    responses={
        200: openapi.Response(
            description="List of all agents",
            schema=AgentSerializer(many=True)
        ),
        403: "Forbidden - Admin access required"
    }
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_agents(request):
    """
    List all agents in the system.

    Returns:
    - Response:
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
                    'period': openapi.Schema(type=openapi.TYPE_STRING),
                    'date': openapi.Schema(type=openapi.TYPE_STRING),
                    'sales_log': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'ticket_type__name': openapi.Schema(type=openapi.TYPE_STRING),
                                'agent__first_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'agent__last_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'total_sold': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'total_amount': openapi.Schema(type=openapi.TYPE_NUMBER),
                            }
                        )
                    ),
                },
            ),
        ),
        400: "Bad Request - Invalid parameters",
        403: "Forbidden - Admin access required",
    }
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def ticket_sales_log(request):
    """
    Download daily, weekly, or monthly ticket sales log, categorized by ticket type and agent.

    Query Parameters:
    - date: Specify a date in YYYY-MM-DD format to filter the logs.
    - period: 'day', 'week', or 'month' (optional, defaults to 'day').
    - agent_id: The ID of the agent to filter by (optional).
    - format: 'json' or 'csv' (optional, defaults to 'json').
    """
    # ... rest of the implementation remains the same ...
    pass


@swagger_auto_schema(
    method='POST',
    operation_summary="Update Payout Settings",
    operation_description="Admin updates the monthly ticket quota, base salary, and percentage for partial payout when half of the quota is met.",
    manual_parameters=[
        openapi.Parameter(
            'monthly_quota',
            openapi.IN_QUERY,
            description="The target number of tickets to be sold monthly for full payout.",
            type=openapi.TYPE_INTEGER,
            required=True,
        ),
        openapi.Parameter(
            'full_salary',
            openapi.IN_QUERY,
            description="The full monthly salary amount to be paid when the quota is met.",
            type=openapi.TYPE_NUMBER,
            required=True,
        ),
        openapi.Parameter(
            'partial_salary_percentage',
            openapi.IN_QUERY,
            description="Percentage of the salary to pay if half the quota is met.",
            type=openapi.TYPE_NUMBER,
            required=True,
        ),
    ],
    responses={
        200: openapi.Response(
            description="Payout settings updated successfully.",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'settings': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'monthly_quota': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'full_salary': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'partial_salary_percentage': openapi.Schema(type=openapi.TYPE_NUMBER),
                        }
                    ),
                },
            ),
        ),
        400: "Bad Request - Invalid parameters",
        403: "Forbidden - Admin access required",
    }
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_payout_settings(request):
    """
    Admin: Update monthly quota, full salary, and partial salary percentage.
    """
    # Define required fields for validation
    required_fields = ['monthly_quota', 'full_salary', 'partial_salary_percentage']

    # Check for missing fields in the request query params
    missing_fields = [field for field in required_fields if field not in request.query_params]
    if missing_fields:
        return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get or create the PayoutSettings instance
        settings = PayoutSettings.objects.first() or PayoutSettings()

        # Update settings based on query params
        settings.monthly_quota = Decimal(request.query_params['monthly_quota'])
        settings.full_salary = Decimal(request.query_params['full_salary'])
        settings.partial_salary_percentage = Decimal(request.query_params['partial_salary_percentage'])

        settings.save()

        return Response({
            "message": "Payout settings updated successfully.",
            "settings": {
                "monthly_quota": settings.monthly_quota,
                "full_salary": settings.full_salary,
                "partial_salary_percentage": settings.partial_salary_percentage,
            }
        }, status=status.HTTP_200_OK)

    except (ValueError, TypeError) as e:
        return Response({
            "error": f"Invalid data format: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
