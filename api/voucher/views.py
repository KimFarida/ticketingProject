from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.account.permissions import IsAdmin, IsMerchant, IsAgent
from api.models import Voucher
from api.voucher.serializer import CreateVoucherSerializer, VoucherDetailSerializer, VoucherListSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


processed_param = openapi.Parameter(
    'processed',
    openapi.IN_QUERY,
    description="Filter by processed status (true or false).",
    type=openapi.TYPE_BOOLEAN,
    required=False
)
@swagger_auto_schema(
    method='GET',
    manual_parameters=[processed_param],
    responses={200: VoucherListSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsMerchant | IsAdmin])
def created_vouchers(request):
    """
    Retrieve all vouchers sold by the authenticated merchant/admin.

    Returns:
    - `200 OK`: A list of vouchers sold by the merchant.
    - `403 Forbidden`: The user is not authorized to access this resource.
    - `401 Unauthorized`: Authentication credentials were not provided.
    """
    merchant = request.user
    processed = request.query_params.get('processed', None)

    # Fetch all vouchers where the merchant is the seller
    vouchers = Voucher.objects.filter(seller=merchant)

    if processed:
        vouchers = vouchers.filter(processed=(processed.lower() == 'true'))

    # Serialize the vouchers
    serializer = VoucherListSerializer(vouchers, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='GET',
    manual_parameters=[processed_param],
    responses={200: VoucherListSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issued_vouchers(request):
    """
    Retrieve all vouchers bought by the authenticated userc.

    Returns:
    - `200 OK`: A list of vouchers sold by the merchant.
    - `403 Forbidden`: The user is not authorized to access this resource.
    - `401 Unauthorized`: Authentication credentials were not provided.
    """
    user = request.user
    processed = request.query_params.get('processed', None)

    # Fetch all vouchers where the user is the buyer
    vouchers = Voucher.objects.filter(owner=user)

    if processed:
        vouchers = vouchers.filter(processed=(processed.lower() == 'true'))

    # Serialize the vouchers
    serializer = VoucherListSerializer(vouchers, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='POST',
    request_body=CreateVoucherSerializer,
    responses={
        201: "Success"}
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_voucher(request):
    """
    Create a voucher for Agents or Merchants based on their roles.

    - `amount` (Decimal): The amount of the voucher.
    - `seller` (UUID): Seller's ID. For Agents, this should be the Merchant's ID.

    Returns:
    - On success: Details of the newly created voucher.
    - On failure: Validation error or server error.
    """
    serializer = CreateVoucherSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        try:
            voucher = serializer.save()
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_serializer = VoucherDetailSerializer(voucher)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='GET',
    responses={200: CreateVoucherSerializer(many=False)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_voucher(request, voucher_):
    """
    Retrieve a voucher by its ID or voucher code.

    - `id` (UUID, optional): ID of the voucher to retrieve.
    - `voucher_code` (str, optional): Voucher code to retrieve.

    Returns:
    - `VoucherDetailSerializer`: Details of the voucher if found.
    - `error`: Error message if the voucher is not found or the user is unauthorized.

    """
    voucher_id = request.query_params.get('id', None)
    voucher_code = request.query_params.get('voucher_code', None)

    if voucher_id:
        try:
            voucher = Voucher.objects.get(id=voucher_id)
        except Voucher.DoesNotExist:
            return Response({"error": "Voucher not found"}, status=status.HTTP_404_NOT_FOUND)
    elif voucher_code:
        try:
            voucher = Voucher.objects.get(code=voucher_code)
        except Voucher.DoesNotExist:
            return Response({"error": "Voucher not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "Either 'id' or 'voucher_code' must be provided."}, status=status.HTTP_400_BAD_REQUEST)


    if request.user != voucher.owner and request.user != voucher.seller:
        return Response({"error": "You are not authorized to view this voucher."}, status=status.HTTP_403_FORBIDDEN)

    serializer = VoucherDetailSerializer(voucher)
    return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from api.models import Voucher, Wallet
from .serializer import VoucherProcessSerializer
from drf_yasg.utils import swagger_auto_schema
from decimal import Decimal
from django.db import transaction



@swagger_auto_schema(
    method='POST',
    request_body=VoucherProcessSerializer,
    responses={
        200: "Voucher processed successfully.",
        400: "Error processing the voucher.",
        404: "Voucher not found."
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsMerchant | IsAdmin])
def process_voucher(request):
    serializer = VoucherProcessSerializer(data=request.data)
    if serializer.is_valid():
        voucher_code = serializer.validated_data['voucher_code']

        try:
            # Fetch the voucher
            voucher = Voucher.objects.get(voucher_code=voucher_code)

            # Ensure the merchant is the seller of the voucher
            merchant = request.user
            if voucher.seller != merchant:
                return Response({"error": "You are not authorized to process this voucher."}, status=status.HTTP_403_FORBIDDEN)

            # Ensure the voucher hasn't already been processed
            if voucher.processed:
                return Response({"error": "This voucher has already been processed."}, status=status.HTTP_400_BAD_REQUEST)

            # Mark the voucher as processed in a transaction block
            with transaction.atomic():
                seller = voucher.seller
                if seller.role == "Merchant":
                    seller_wallet = Wallet.objects.get(user=seller)

                    # Check if the seller has sufficient funds
                    if seller_wallet.voucher_balance < voucher.amount:
                        return Response({"error": "Insufficient funds in seller's wallet."},
                                        status=status.HTTP_400_BAD_REQUEST)
                    seller_wallet.voucher_balance -= voucher.amount
                    seller_wallet.save()

                voucher.processed = True
                voucher.save()

                # Update the buyer's wallet balance and bonus
                buyer = voucher.owner
                buyer_wallet = Wallet.objects.get(user=voucher.owner)

                bonus_percentage = Decimal('0.10') if buyer.role == "Agent" else Decimal('0.20')
                buyer_wallet.voucher_balance += voucher.amount
                buyer_wallet.bonus_balance += voucher.amount * bonus_percentage
                buyer_wallet.save()

            return Response({"message": "Voucher processed successfully."}, status=status.HTTP_200_OK)

        except Voucher.DoesNotExist:
            return Response({"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND)
        except Wallet.DoesNotExist:
            return Response({"error": "Wallet not found for the user."}, status=status.HTTP_404_NOT_FOUND)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



