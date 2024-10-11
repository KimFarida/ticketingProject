import uuid
import random
import string
from datetime import datetime
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    #Custom Fields
    login_id = models.CharField(max_length=7, unique=True)
    gender = models.CharField(max_length=1, null=True, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('Admin', 'Admin'),
        ('Merchant', 'Merchant'),
        ('Agent', 'Agent'),
    ], default='Agent')
    phone_number = PhoneNumberField(blank=True, help_text="Contact phone number")
    address = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Automatically assign Agent group on user creation
        if self.pk and not self.groups.filter(name='Merchants').exists():
            agent_group, _ = Group.objects.get_or_create(name='Agents')
            self.groups.add(agent_group)

        # If user role changes to Merchant, update groups
        if self.role == 'Merchant':
            merchant_group, _ = Group.objects.get_or_create(name='Merchants')
            agent_group, _ = Group.objects.get_or_create(name='Agents')
            self.groups.remove(agent_group)
            self.groups.add(merchant_group)


    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Merchant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='merchant')

class Agent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent')

class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    voucher_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    bonus_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    #account_number = models.IntegerField(max_length=10, null=True, blank=True)

class Voucher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    voucher_code = models.CharField(max_length=20, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_vouchers')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sold_vouchers')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.voucher_code

class TicketType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    expiration_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_code = models.CharField(max_length=8, unique=True)
    buyer_name = models.CharField(max_length=50)
    buyer_contact = models.CharField(max_length=50)
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    ticket_type = models.ForeignKey(TicketType, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    valid_until = models.DateTimeField(editable=False)
    valid =models.BooleanField(default=True)

class PayoutRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payout_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    updated_at = models.DateTimeField(auto_now=True)



