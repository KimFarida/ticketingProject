from api.account.permissions import IsAdmin
from django.contrib.auth.models import Group
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from api.models import User, Merchant
from rest_framework.response import Response
from .serializer import AgentSerializer, MerchantSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

token_auth = openapi.Schema(
    type=openapi.TYPE_STRING,
    description="Token authentication in the format 'Token <your_token_here>'",
    format="password"
)


@api_view(['POST'])
@permission_classes([IsAdmin])
@swagger_auto_schema(security=[{"TokenAuth": []}], manual_parameters=[token_auth])
def promote_to_merchant(request, user_id):
    try:
        user = User.objects.get(pk=user_id)

        if user.role == 'Merchant':
            return Response({"message":"This user is already a Mercahnt"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = 'Merchant'
        user.save()

        merchant_group = Group.objects.get(name='Merchant')
        user.groups.add(merchant_group)

        return Response({"message": f"Agent {user.id} has been promoted to Merchant"},
                        status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Group.DoesNotExist:
        return Response({"error": "Merchant group not found."}, status=status.HTTP_404_NOT_FOUND)

# Use the token_auth schema in the @swagger_auto_schema decorator
@api_view(['GET'])
@permission_classes([IsAdmin])
def list_merchants(request):
    merchants = User.objects.filter(role='Merchant')
    serializer = MerchantSerializer(merchants, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdmin])
def list_agents(request):
    agents = User.objects.filter(role='Agent')
    serializer = AgentSerializer(agents, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


