
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from api.models import Voucher, Wallet
from .serializer import VoucherProcessSerializer, VoucherListSerializer
from drf_yasg.utils import swagger_auto_schema
from decimal import Decimal


@swagger_auto_schema(
    method='GET',
    responses={200: VoucherListSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_merchant_vouchers(request):
    merchant = request.user

    # Fetch all vouchers where the merchant is the seller
    vouchers = Voucher.objects.filter(seller=merchant)

    # Serialize the vouchers
    serializer = VoucherListSerializer(vouchers, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


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
@permission_classes([IsAuthenticated])
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
                voucher.processed = True
                voucher.save()

                # Update the agent's wallet balance and bonus
                agent_wallet = Wallet.objects.get(user=voucher.owner)
                agent_wallet.voucher_balance += voucher.amount
                agent_wallet.bonus_balance += voucher.amount * Decimal('0.05')  # Adding 5% bonus
                agent_wallet.save()

            return Response({"message": "Voucher processed successfully."}, status=status.HTTP_200_OK)

        except Voucher.DoesNotExist:
            return Response({"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
