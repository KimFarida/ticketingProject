from pyexpat.errors import messages

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializer import PayoutRequestCreateSerializer, PayoutRequestSerializer, PayoutRequestStatusSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from api.models import PayoutRequest
from ..account.permissions import IsAdmin
from django.db import transaction
from rest_framework import serializers


@swagger_auto_schema(
    method='POST',
    request_body=PayoutRequestCreateSerializer,
    responses={
        201: "Payout request created successfully.",

    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
                         "status": payout_request.status

                         },
                        status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
@permission_classes([IsAuthenticated])
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

    if request.user.is_superuser:
        # If admin, filter by user_id if provided, otherwise return all requests
        if user_id:
            payout_requests = PayoutRequest.objects.filter(user__id=user_id)
        else:
            payout_requests = PayoutRequest.objects.all()
    else:
        payout_requests = PayoutRequest.objects.filter(user=request.user)

    if status_filter:
        payout_requests = payout_requests.filter(status=status_filter)

    serializer = PayoutRequestSerializer(payout_requests, many=True)
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
@permission_classes([IsAuthenticated, IsAdmin])
def process_payout(request, payment_id):
    """
    Admin: Approve or reject a payout request.
    Deducts the user's bonus balance if the payout is approved and returns the details of the payout request.
    """
    try:
        payout_request = PayoutRequest.objects.get(payment_id=payment_id)
    except PayoutRequest.DoesNotExist:
        return Response({"error": "Payout request not found."}, status=status.HTTP_404_NOT_FOUND)

    status_value = request.data.get('status')
    if status_value not in ['approved', 'rejected']:
        return Response({"error": "Invalid status. Use 'approved' or 'rejected'."}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        if status_value == 'approved':
            user = payout_request.user
            user.wallet.bonus_balance -= payout_request.amount
            user.wallet.save()

    # Update payout request status
    payout_request.status = status_value
    payout_request.save()

    return Response({
        "message": f"Payout request {status_value} successfully.",
        "payment_id": payout_request.payment_id,
        "payout_request": {
            "user":{
                "login_id": payout_request.user.login_id,
                "id": payout_request.user_id,
                "name": payout_request.user.first_name,
                "role": payout_request.user.role
            },
            "amount": payout_request.amount,
            "requested_at": payout_request.requested_at,
            "status": payout_request.status,
            "payment_id": payout_request.payment_id
        }
    }, status=status.HTTP_200_OK)
