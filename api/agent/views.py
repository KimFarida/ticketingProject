from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.models import Merchant, Agent, Wallet

@api_view(['GET'])
@permission_classes([IsAuthenticated])
# @permission_classes([IsAgent])
def list_all_merchants(request):
    merchants = Merchant.objects.select_related('user').all()
    all_merchants = [
        {
            "id": merchant.id,
            "first_name": merchant.user.first_name,
            "last_name": merchant.user.last_name,
            "balance": (wallet.voucher_balance if (wallet := Wallet.objects.filter(user=merchant.user).first()) else 0),
        }
        for merchant in merchants
    ]
    return Response(all_merchants, status=status.HTTP_200_OK)
