import random
import  string
from api.models import User


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
