from rest_framework import serializers
from api.models import Merchant, Wallet, Voucher, User
from api.utilities import generate_voucher_code

class MerchantBalanceSerializer(serializers.ModelSerializer):
    available_balance = serializers.SerializerMethodField()

    class Meta:
        model = Merchant
        fields = '__all__'

    def get_available_balance(self, obj):
        wallet = Wallet.objects.filter(merchant=obj).first()
        return wallet.voucher_balance

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'role', 'phone_number', 'address']
#
# class VoucherDetailSerializer(serializers.ModelSerializer):
#     owner = UserSerializer(read_only=True)
#     seller = UserSerializer(read_only=True)
#
#     class Meta:
#         model = Voucher
#         fields = '__all__'
#
# class AgentCreateVoucherSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Voucher
#         fields = ['amount', 'seller']
#
#     def validate(self, attrs):
#         #attrs.get will take the userid and get the loginid which is my username, then i can get the user obj
#         seller = User.objects.get(username=attrs.get('seller'))
#         # Ensure that the seller can sell vouchers
#         if seller.role != 'Merchant':
#             raise serializers.ValidationError("The selected seller must be a Merchant.")
#
#         return attrs
#
#     def create(self, validated_data):
#         # Generate a unique voucher code
#         voucher_code = generate_voucher_code()
#
#         # Ensure the generated code is unique
#         while Voucher.objects.filter(voucher_code=voucher_code).exists():
#             voucher_code = generate_voucher_code()
#
#         # Create the voucher
#         voucher = Voucher.objects.create(
#             voucher_code=voucher_code,
#             owner=validated_data['owner'],  # Set the owner as the current user
#             seller=validated_data['seller'],
#             amount=validated_data['amount']
#         )
#
#         return voucher