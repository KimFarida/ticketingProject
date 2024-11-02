from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializer import PayoutRequestCreateSerializer, PayoutRequestSerializer, PayoutRequestStatusSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from api.models import PayoutRequest, PayoutSettings, Ticket
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db import DatabaseError
from django.utils import  timezone
from api.utilities import calculate_salary



@swagger_auto_schema(
    method='POST',
    request_body=PayoutRequestCreateSerializer,
    responses={
        201: "Payout request created successfully.",

    }
)
@api_view(['POST'])
def request_payout(request):
    """
    Request a payout based on the user's bonus balance.

    This endpoint allows authenticated agents to request a payout.
    The request is validated to ensure that the amount does not exceed the user's bonus balance
    and that it is made at the end of the month.

    **Request Body:**
    - `amount` (float): The amount to be requested for payout.

    **Responses:**
    - 201: Payout request created successfully.
    - 400: Invalid request data (e.g., insufficient balance or request made not at the end of the month).
    """
    serializer = PayoutRequestCreateSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        payout_request = serializer.save(user=request.user)
        return Response({"message": "Payout request created successfully.",
                         "payout_id": payout_request.payment_id,
                         "payout_request": serializer.data,
                         "requested_at": payout_request.requested_at,
                         "status": payout_request.status,
                         "salary": payout_request.salary

                         },
                        status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    operation_summary="Retrieve Payout Request by ID",
    operation_description="Fetch a specific payout request by its ID for authenticated users.",
    responses={
        200: openapi.Response(
            description="Details of the payout request.",
            schema=PayoutRequestSerializer(),
        ),
        404: openapi.Response(
            description="Payout request not found."
        ),
        400: openapi.Response(
            description="Invalid input."
        ),
        500: openapi.Response(
            description="A database error occurred."
        ),
    },
)
@api_view(['GET'])
def get_payout_by_id(request, payout_id):
    """
    Return a payout requests for the authenticated user given the ID.

    **Query Parameters:**
    - `payout_id` (str, optional): Filter requests by ID.

    **Responses:**
    - 200: Details on a payout request.
    """
    try:
        payout_request = PayoutRequest.objects.get(payment_id=payout_id)
        serializer = PayoutRequestSerializer(payout_request)
    except PayoutRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except DatabaseError:
        return Response({"error": "A database error occurred while fetching payout requests."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": "An unexpected error occurred.", "details": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({
        "message": "Payout request retrieved successfully.",
        "data": serializer.data
    }, status=status.HTTP_200_OK)
@swagger_auto_schema(
    method='get',
    operation_summary="List Payout Requests",
    operation_description="Retrieve payout requests for the authenticated user or all users if the user is an admin.",
    manual_parameters=[
        openapi.Parameter(
            'status',
            openapi.IN_QUERY,
            description="Filter by payout request status (e.g., 'pending', 'approved', 'rejected').",
            type=openapi.TYPE_STRING,
        ),
        openapi.Parameter(
            'user_id',
            openapi.IN_QUERY,
            description="Filter requests by a specific user (admin only).",
            type=openapi.TYPE_STRING,
        ),
    ],
    responses={
        200: openapi.Response(
            description="A list of payout requests.",
            schema=PayoutRequestSerializer(many=True),
        ),
        403: "Forbidden",
    },
)
@api_view(['GET'])
def list_payout_requests(request):
    """
    List all payout requests for the authenticated user or for all users if the user is an admin.

    **Query Parameters:**
    - `status` (str, optional): Filter by payout request status (e.g., 'pending', 'approved', 'rejected').
    - `user_id` (int, optional): Filter requests by a specific user (admin only).

    **Responses:**
    - 200: A list of payout requests.
    """
    status_filter = request.query_params.get('status')
    user_id = request.query_params.get('user_id')
    try:

        if status_filter and status_filter not in ['pending', 'approved', 'rejected']:
            return Response({'message': "Status must be 'approved', 'pending', or 'rejected'."},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_superuser:
            # Admin: filter by user_id and/or status if provided
            payout_requests = PayoutRequest.objects.all()
            if user_id:
                payout_requests = payout_requests.filter(user_id=user_id)
            if status_filter:
                payout_requests = payout_requests.filter(status=status_filter)
        else:
            payout_requests = PayoutRequest.objects.filter(user=request.user)
            if status_filter:
                payout_requests = payout_requests.filter(status=status_filter)

        serializer = PayoutRequestSerializer(payout_requests, many=True)
    except DatabaseError:
        return Response({"error": "A database error occurred while fetching payout requests."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": "An unexpected error occurred.", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({
        "message": "Payout requests retrieved successfully.",
        "data": serializer.data
    }, status=status.HTTP_200_OK)
@swagger_auto_schema(
    method='PUT',
    request_body=PayoutRequestStatusSerializer,
    responses={
        200: PayoutRequestSerializer(many=False),
        400: "Invalid status.",
        404: "Payout request not found."
    }
)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def process_payout(request, payment_id):
    """
    Admin: Approve or reject a payout request.
    Deducts the user's bonus balance if the payout is approved and calculates the salary based on quota fulfillment.
    """
    try:
        payout_request = PayoutRequest.objects.get(payment_id=payment_id)
    except (PayoutRequest.DoesNotExist, PayoutSettings.DoesNotExist):
        return Response({"error": "Payout request or settings not found."}, status=status.HTTP_404_NOT_FOUND)

    status_value = request.data.get('status')
    if status_value not in ['approved', 'rejected', 'pending']:
        return Response({"error": "Invalid status. Use 'approved', 'pending', or 'rejected'."},
                        status=status.HTTP_400_BAD_REQUEST)

    user = payout_request.user

    with transaction.atomic():
        if status_value == 'approved':
            # Deduct bonus balance if payout is approved
            user.wallet.bonus_balance -= payout_request.amount
            user.wallet.save()

    # Update payout request status and save the calculated salary amount
    payout_request.status = status_value
    payout_request.save()

    return Response({
        "message": f"Payout request {status_value} successfully.",
        "payment_id": payout_request.payment_id,
        "payout_request": {
            "user": {
                "login_id": user.login_id,
                "id": user.id,
                "name": f'{user.first_name} {user.last_name}',
                "role": user.role
            },
            "amount": payout_request.amount,
            "salary": payout_request.salary,
            "requested_at": payout_request.requested_at,
            "status": payout_request.status,
            "payment_id": payout_request.payment_id
        }
    }, status=status.HTTP_200_OK)
