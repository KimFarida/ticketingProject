from base64 import urlsafe_b64encode

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import UserSerializer, UserLoginSerializer, PasswordResetSerializer, PasswordResetRequestSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(method='post', request_body=UserSerializer, responses={200: 'Success'})
@api_view(['POST'])
def register(request):
    """
    Create a new user with the provided details.

    - `first_name` (str): First name of the user.
    - `last_name` (str): Last name of the user.
    - `email` (str): Email address of the user.
    - `address` (str): User's address.
    - `phone_number` (str): User's phone number.
    - `gender` (str): User's gender.
    - `password` (str): User's password (must be at least 8 characters long with a digit).

    Returns:
    - `id` (int): User ID.
    - `first_name` (str): User's first name.
    - `last_name` (str): User's last name.
    - `email` (str): User's email address.
    - `address` (str): User's address.
    - `phone_number` (str): User's phone number.
    - `gender` (str): User's gender.
    - `role` (str): User's role set to "Agent".
    - `message` (str): Success message.
    """
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=UserLoginSerializer, responses={200: 'Success'})
@api_view(['POST'])
def login(request):
    """
    Authenticate a user with the provided email/login ID and password.

    - `email_or_login_id` (str): User's email or login ID.
    - `password` (str): User's password.

    Returns:
    - `token` (str): Authentication token.
    - `user_id` (int): User ID.
    - `email` (str): User's email.
    - `login_id` (str): User's login ID.
    - `message` (str): Success message.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        token, _ = Token.objects.get_or_create(user=user)

        print(f"Token: {token}, Created: {_}")
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'user_role': user.role,
            'email': user.email,
            'login_id': user.login_id,
             'message': 'Successfully log in.'
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=None,
    responses={204: 'Success', 400: 'Bad Request'},
    security=[{"Token": []}],
    manual_parameters=[
        openapi.Parameter(
            name='Authorization',
            in_=openapi.IN_HEADER,
            type=openapi.TYPE_STRING,
            description='Token <your_token_here>',
            required=True
        )
    ]
)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def logout(request):
    """
    Logout the currently authenticated user.

    This endpoint invalidates the user's authentication token, effectively logging them out.

    Returns:
    - 204: Successfully logged out.
    - 400: Bad request if an error occurs during the logout process.
    """
    if request.method == 'POST':
        try:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data={'message': 'Successfully logged out.'})
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=PasswordResetRequestSerializer, responses={200: 'Success'})
@api_view(['POST'])
def request_password_reset(request):
    """
    Request a password reset by providing the user's email address.

    - `email` (str): User's email address.

    Returns:
    - `message` (str): Success message.
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():

        user = serializer.validated_data['user']

        #Generate Password Token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)

        #Generate URL with token and USER ID
        user_id = str(user.pk)
        uid = urlsafe_base64_encode(user_id.encode('utf-8'))
        reset_url = f"http://127.0.0.1:8000/reset-password/{uid}/{token}/"
        print(f"Reset URL: {uid} {token}")

        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_url}',
            'Farida Momoh',
            ['momohgodsfavour@gmail.com'],
            fail_silently=False,
        )

        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@swagger_auto_schema(method='post', request_body=PasswordResetSerializer, responses={200: 'Success'})
@api_view(['POST'])
def reset_password_confirm(request):
    """
    Confirm password reset by providing a new password along with a token and UID.

    - `new_password` (str): New password for the user.
    - `uid` (str): User ID as URL-safe base64 encoded string.
    - `token` (str): Token for password reset.

    Returns:
    - `message` (str): Success message.
    """

    serializer = PasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
