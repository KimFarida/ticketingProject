from api.account.permissions import IsAdmin
from django.contrib.auth.models import Group
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from api.models import User, Merchant, Agent
from rest_framework.response import Response
from .serializer import AgentSerializer, MerchantSerializer
from drf_yasg.utils import swagger_auto_schema


@swagger_auto_schema(
    method='POST',
    responses={
        201: "Agent successfully promoted to Merchant.",

    },

)
@api_view(['POST'])
@permission_classes([IsAdmin])
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

        user.role = 'Merchant'

        Merchant.objects.create(user=user)
        Agent.objects.filter(user=user).delete()

        user.save()

        merchant_group = Group.objects.get(name='Merchant')
        user.groups.add(merchant_group)

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
# @permission_classes([IsAdmin])
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
# @permission_classes([IsAdmin])
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


