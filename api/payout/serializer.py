import decimal
from rest_framework import serializers
from api.models import PayoutRequest
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta, time
from api.utilities import generate_payment_id, calculate_salary
from api.admin.serializer import UserDSerializer



class PayoutRequestSerializer(serializers.ModelSerializer):
    user = UserDSerializer(read_only=True)
    class Meta:
        model = PayoutRequest
        fields = ['amount', 'requested_at', 'status', 'payment_id', 'user', 'salary']

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

        # Calculate the first day of the next month and subtract a day to get the last day of the current month
        first_day_of_next_month = (now.replace(day=1) + timedelta(days=32)).replace(day=1)
        last_day_of_month = first_day_of_next_month - timedelta(days=1)

        # Check if today is the last day of the month
        if now.date() != last_day_of_month.date():
            raise serializers.ValidationError("Payout requests can only be made on the last day of the month.")

        # Check if the current time is within the valid range for payout requests
        if not (time(0, 0) <= now.time() <= time(23, 59)):
            raise serializers.ValidationError(
                "Payout requests can only be made between 00:00 and 23:59 on the last day of the month.")

        #check if the person has already made a payout request before

        return attrs

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