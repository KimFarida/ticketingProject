from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import Voucher
from api.voucher.serializer import CreateVoucherSerializer, VoucherDetailSerializer
from drf_yasg.utils import swagger_auto_schema


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