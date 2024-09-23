from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import UserSerializer, UserLoginSerializer


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    """
    Authenticate a user and return a token.

    Accepts either email or login ID along with password for authentication.

    Parameters:
    - email_or_login_id (str): User's email or login ID
    - password (str): User's password

    Returns:
    - token (str): Authentication token
    - user_id (int): User's ID
    - email (str): User's email
    - login_id (str): User's login ID
    - message (str): Success message
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        token, _ = Token.objects.get_or_create(user=user)

        print(f"Token: {token}, Created: {_}")
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'login_id': user.login_id,
             'message': 'Successfully log in.'
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def logout(request):
    if request.method == 'POST':
        try:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data={'message': 'Successfully logged out.'})
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)