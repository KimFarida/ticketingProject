import random
import  string
import uuid
from api.models import User, Ticket, PayoutRequest
from datetime import datetime


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

