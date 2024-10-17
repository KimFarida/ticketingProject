import decimal
from rest_framework import serializers
from api.models import PayoutRequest
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from api.utilities import generate_payment_id


class PayoutRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutRequest
        fields = ['amount', 'requested_at', 'status', 'payment_id']

class PayoutRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutRequest
        fields = ['amount']

    def validate_amount(self, value):
        user = self.context['request'].user

        try:
            if Decimal(value) > user.wallet.bonus_balance:
                raise serializers.ValidationError("Insufficient bonus balance for payout.")
        except decimal.InvalidOperation:
            raise serializers.ValidationError("Invalid amount.")
        except ValueError:
            raise serializers.ValidationError("Invalid amount.")

        return value

    def validate(self, attrs):
        now = timezone.now()
        if now.month == (now + timedelta(days=1)).month:
            raise serializers.ValidationError("Payout requests can only be made at the end of the month.")
        return attrs

    def create(self, validated_data):
        validated_data['payment_id'] = generate_payment_id()

        payout_request = PayoutRequest.objects.create(**validated_data)

        return payout_request

class PayoutRequestStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])