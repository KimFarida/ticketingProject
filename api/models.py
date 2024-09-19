from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    login_id = models.CharField(max_length=6, unique=True)
    gender = models.CharField(max_length=1, null=True, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('Admin', 'Admin'),
        ('Merchant', 'Merchant'),
        ('Agent', 'Agent'),
    ])

    # Add related_name to avoid clashes with auth.User
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
        related_query_name="user",
    )

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
    agent_id = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='tickets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    valid =models.BooleanField(default=False)
