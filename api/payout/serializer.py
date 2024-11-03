import decimal
from rest_framework import serializers
from api.models import PayoutRequest
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from api.utilities import generate_payment_id, calculate_salary
from api.admin.serializer import UserDSerializer


class PayoutRequestSerializer(serializers.ModelSerializer):
    user = UserDSerializer(read_only=True)
    class Meta:
        model = PayoutRequest
        fields = ['amount', 'requested_at', 'status', 'payment_id', 'user']

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

    # def validate(self, attrs):
    #     now = timezone.now()
    #     if now.month == (now + timedelta(days=1)).month:
    #         raise serializers.ValidationError("Payout requests can only be made at the end of the month.")
    #     return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        salary, tickets_sold,monthly_quota  = calculate_salary(user)

        validated_data['payment_id'] = generate_payment_id()
        validated_data['salary'] = salary

        self.salary_info = {
            "salary": salary,
            "tickets_sold": tickets_sold,
            "monthly_quota": monthly_quota
        }

        return PayoutRequest.objects.create(**validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if hasattr(self, 'salary_info'):
            rep.update({
                "salary": self.salary_info["salary"],
                "tickets_sold": self.salary_info["tickets_sold"],
                "monthly_quota": self.salary_info["monthly_quota"]
            })

        return rep
class PayoutRequestStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])