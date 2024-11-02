import random
import  string
import uuid
from api.models import User, Ticket, PayoutRequest, PayoutSettings
from datetime import datetime
from django.utils import timezone


def generate_loginid():
    used_numbers = set()

    while True:
        letters = "".join(random.choices(string.ascii_uppercase, k=3))
        number = random.randint(0, 999)
        login_id = f"{letters}-{number:03d}"

        if not login_id_exist(login_id) and number not in used_numbers:
            used_numbers.add(number)
            return login_id

        if len(used_numbers) == 1000:
            used_numbers.clear()

def login_id_exist(login_id):
   return User.objects.filter(login_id=login_id).exists()

def generate_voucher_code():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return "".join(random.choice(chars) for _ in range(10))


def generate_ticket_code(length=8):
    while True:
        unique_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

        if not Ticket.objects.filter(ticket_code=unique_id).exists():
            return unique_id

def generate_payment_id():
    while True:
        date_str = datetime.now().strftime('%Y%m%d')
        random_str = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        payment_id = f"PAY{date_str}{random_str}"

        if not PayoutRequest.objects.filter(payment_id=payment_id).exists():
            return  payment_id

def calculate_salary(user):
    payout_settings = PayoutSettings.objects.first()
    start_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Calculate the start of the next month
    if start_of_month.month == 12:  # December edge case
        start_of_next_month = start_of_month.replace(year=start_of_month.year + 1, month=1)
    else:
        start_of_next_month = start_of_month.replace(month=start_of_month.month + 1)

    # Count tickets sold by the agent in the current month
    tickets_sold = Ticket.objects.filter(
        agent=user,
        created_at__gte=start_of_month,
        created_at__lt=start_of_next_month
    ).count()

    # Determine salary based on ticket quota
    if tickets_sold >= payout_settings.monthly_quota:
        # Full salary for meeting quota
        salary = payout_settings.full_salary
    elif tickets_sold >= payout_settings.monthly_quota / 2:
        # Partial salary for meeting half of the quota
        salary = (payout_settings.partial_salary_percentage / 100) * payout_settings.full_salary
    else:
        # No salary if quota isn't half-met
        salary = 0

    return salary, tickets_sold
