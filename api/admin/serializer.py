from rest_framework import serializers
from api.models import User, Merchant, Agent, Wallet


class UserDSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'login_id', 'role', 'first_name', 'last_name', 'email', 'phone_number']


class MerchantSerializer(serializers.ModelSerializer):
    user = UserDSerializer()

    class Meta:
        model = Merchant
        fields = '__all__'

class AgentSerializer(serializers.ModelSerializer):
    user = UserDSerializer()

    class Meta:
        model = Agent
        fields =  '__all__'