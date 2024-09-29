from rest_framework import serializers
from api.models import User

class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'login_id', 'first_name', 'last_name', 'email', 'phone_number', 'address']

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'login_id', 'first_name', 'last_name', 'email', 'phone_number', 'address']
