from rest_framework import serializers
from api.models import TicketType, Ticket
from django.utils import timezone
from api.utilities import generate_ticket_code


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
    # agent field no longer needs a nested serializer, just a direct reference
    agent = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_code', 'buyer_name', 'buyer_contact', 'agent', 'ticket_type', 'created_at', 'updated_at', 'valid_until', 'valid']

    def validate(self, data):
        """
        Custom validation to check the ticket_type expiration and set valid_until.
        """
        ticket_type = data.get('ticket_type')

        if not ticket_type:
            raise serializers.ValidationError("Ticket type is required.")

        current_time = timezone.now()

        # Check if the ticket type expiration date has passed
        if current_time >= ticket_type.expiration_date:
            raise serializers.ValidationError("Cannot create ticket after the ticket type expiration date.")

        return data

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

        # Now save the ticket with agent and valid_until set
        ticket = Ticket.objects.create(**validated_data)

        return ticket
