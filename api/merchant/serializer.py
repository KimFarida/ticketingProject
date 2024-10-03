from rest_framework import serializers
from api.models import Voucher, Wallet



class VoucherProcessSerializer(serializers.Serializer):
    voucher_code = serializers.CharField(max_length=20)

    def validate_voucher_code(self, value):
        # Check if the voucher exists
        if not Voucher.objects.filter(voucher_code=value).exists():
            raise serializers.ValidationError("Voucher with this code does not exist.")
        return value
