from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
import uuid
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    #Fields from Abstract User
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    #Custom Fields
    login_id = models.CharField(max_length=7, unique=True)
    gender = models.CharField(max_length=1, null=True, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('Admin', 'Admin'),
        ('Merchant', 'Merchant'),
        ('Agent', 'Agent'),
    ])
    phone_number = PhoneNumberField(blank=True, help_text="Contact phone number")
    address = models.TextField(blank=True)


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

class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_id = models.CharField(max_length=20, unique=True)
    buyer_name = models.CharField(max_length=50)
    buyer_contact = models.CharField(max_length=50)
    agent_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    valid =models.BooleanField(default=False)
