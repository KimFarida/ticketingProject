from rest_framework import serializers
from api.models import TicketType, Ticket
from django.utils import timezone
from api.utilities import generate_ticket_code
from api.account.serializers import UserSerializer


class CreateTicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = '__all__'

    def validate(self, attrs):
        if 'expiration_date' in attrs and attrs['expiration_date'] <= timezone.now():
            raise serializers.ValidationError({"expiration_date": "Expiration date and time must be in the future."})

        if 'unit_price' in attrs and attrs['unit_price'] <= 0:
            raise serializers.ValidationError({"unit_price": "Unit price must be a positive value."})

        return attrs

class TicketSerializer(serializers.ModelSerializer):
    agent = UserSerializer(read_only=True)
    ticket_code = serializers.CharField(read_only=True)
    ticket_type = serializers.PrimaryKeyRelatedField(queryset=TicketType.objects.all())

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_code', 'buyer_name', 'buyer_contact', 'agent', 'ticket_type', 'created_at', 'updated_at', 'valid_until', 'valid']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add nested ticket type details
        representation['ticket_type'] = CreateTicketTypeSerializer(instance.ticket_type).data
        return representation

    def create(self, validated_data):
        # agent is passed via the context, so no need for agent.user
        agent = self.context['agent']

        if not agent:
            raise serializers.ValidationError("Agent information is required to create the ticket.")

        # Set the agent and valid_until fields
        ticket_code = generate_ticket_code()
        validated_data['ticket_code'] = ticket_code
        validated_data['agent'] = agent
        validated_data['valid_until'] = validated_data['ticket_type'].expiration_date


        ticket = Ticket.objects.create(**validated_data)

        return ticket

class CreateTicketSerializer(serializers.Serializer):
    buyer_name = serializers.CharField(max_length=255)
    buyer_contact = serializers.CharField(max_length=20)
    ticket_type = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)
