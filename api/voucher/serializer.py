from rest_framework import serializers
from api.models import Voucher, User
from api.utilities import generate_voucher_code

class VoucherListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = ['id', 'voucher_code', 'owner', 'amount', 'processed', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'address']

class VoucherDetailSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    seller = UserSerializer(read_only=True)

    class Meta:
        model = Voucher
        fields = '__all__'

class CreateVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = ['amount', 'seller']

    def validate(self, attrs):
        user = self.context['request'].user

        if user.role == 'Agent':
            # attrs.get will take the userid and get the loginid which is my username
            seller = User.objects.get(username=attrs.get('seller'))

            if seller.role != 'Merchant':
                raise serializers.ValidationError("The selected seller must be a Merchant")
            attrs['seller'] = seller

        elif user.role == 'Merchant':
            admin = User.objects.get(is_superuser=True)
            attrs['seller'] = admin

        else:
            raise serializers.ValidationError("Invalid User role for voucher creation")
        return  attrs

    def create(self, validated_data):
        # Generate a unique voucher code
        voucher_code = generate_voucher_code()

        # Ensure the generated code is unique
        while Voucher.objects.filter(voucher_code=voucher_code).exists():
            voucher_code = generate_voucher_code()

        validated_data['owner'] = self.context['request'].user

        # Create the voucher
        voucher = Voucher.objects.create(
            voucher_code=voucher_code,
            owner=validated_data['owner'],  # Set the owner as the current user
            seller=validated_data['seller'],
            amount=validated_data['amount']
        )

        return voucher


class VoucherProcessSerializer(serializers.Serializer):
    voucher_code = serializers.CharField(max_length=20)

    def validate_voucher_code(self, value):
        # Check if the voucher exists
        if not Voucher.objects.filter(voucher_code=value).exists():
            raise serializers.ValidationError("Voucher with this code does not exist.")
        return value
