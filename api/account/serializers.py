from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from django.db.models import Q
from uuid import UUID

from api.models import User, Wallet, Agent
from api.utilities import generate_loginid


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email','address','phone_number','gender','password']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def validate(self, attrs):
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError('Email already registered')

        phone_number = str(attrs['phone_number'])
        if User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError('Phone number already registered')

        if len(attrs['password']) < 8 or not any(char.isdigit() for char in attrs['password']):
            raise serializers.ValidationError('Password must be at least 8 characters and a digit')

        return attrs

    def create(self, validated_data):
        #Generate login_id
        login_id = generate_loginid()

        user = User.objects.create_user(
            username=login_id,
            email=validated_data['email'],
            password=validated_data['password'],
            login_id=login_id,
        )

        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.address = validated_data['address'],
        user.phone_number = str(validated_data['phone_number'])
        user.gender = validated_data['gender']
        user.role = "Agent"

        user.save()

        wallet = Wallet.objects.create(user=user)
        agent = Agent.objects.create(user=user)

        agent_group, _ = Group.objects.get_or_create(name='Agents')
        user.groups.add(agent_group)

        response_data = {
            'id': str(user.id),
            'login_id': login_id,
            'wallet_id': str(wallet.id),
            'wallet_balance': wallet.voucher_balance,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'address': user.address,
            'phone_number': str(user.phone_number),
            'gender': user.gender,
            'role': user.role,
            'agent_id': str(agent.id),
        }

        return response_data

class UserLoginSerializer(serializers.Serializer):
    email_or_login_id = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        email_or_login_id = attrs.get('email_or_login_id')
        password = attrs.get('password')

        if email_or_login_id and password:
            try:
                user = User.objects.get(Q(email=email_or_login_id) | Q(login_id=email_or_login_id))
            except User.DoesNotExist:
                raise serializers.ValidationError("No user found with this email or login ID.")

            authenticated_user = authenticate(username=user.username, password=password)

            if not authenticated_user:
                raise serializers.ValidationError("Unable to log in with provided credentials.")

            return  authenticated_user
        else:
            raise serializers.ValidationError("Must include 'email_or_login_id' and 'password'.")

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('email')
        try:
            user = User.objects.get(email=email)
            attrs['user'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        uid = attrs.get('uid')
        token = attrs.get('token')
        new_password = attrs.get('new_password')

        #Decode
        try:

            uid = urlsafe_base64_decode(uid).decode('utf-8')
            user = User.objects.get(pk=UUID(uid))
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError("Invalid Token")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid or expired Token")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'voucher_balance', 'bonus_balance']

class UserDetailsSerializer(serializers.ModelSerializer):
    wallet = WalletSerializer(read_only= True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'wallet']
