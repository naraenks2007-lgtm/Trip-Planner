
import requests
import sys

BASE_URL = "http://localhost:5000/api"

def test_auth_flow():
    email = "testuser@example.com"
    password = "password123"
    
    print(f"--- Testing registration for {email} ---")
    reg_data = {
        "name": "Test User",
        "email": email,
        "password": password
    }
    resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    print(f"Registration Status: {resp.status_code}")
    print(f"Registration Response: {resp.json()}")
    
    if resp.status_code not in [201, 400]:
        print("Registration failed unexpectedly")
        return

    print(f"\n--- Testing login for {email} ---")
    login_data = {
        "email": email,
        "password": password
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login Status: {resp.status_code}")
    print(f"Login Response: {resp.json()}")

    if resp.status_code == 200:
        print("Login SUCCESSful")
    else:
        print("Login FAILED")

    print(f"\n--- Testing case-sensitivity login for {email.upper()} ---")
    login_data_upper = {
        "email": email.upper(),
        "password": password
    }
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data_upper)
    print(f"Login (Upper) Status: {resp.status_code}")
    print(f"Login (Upper) Response: {resp.json()}")

if __name__ == "__main__":
    test_auth_flow()
