from django.contrib.auth import authenticate
from rest_framework import serializers
from api.models import  User
from api.utilities import generate_loginid
from phonenumber_field.phonenumber import PhoneNumber

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
        return user

class UserLoginSerializer(serializers.Serializer):
    login_id = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        login_id = attrs.get('login_id')
        password = attrs.get('password')

        try:
            user = User.objects.get(login_id=login_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid login_id")

        user = authenticate(username=user.login_id, password=password)

        if not user:
            raise serializers.ValidationError("Invalid login_id or password")

        return user