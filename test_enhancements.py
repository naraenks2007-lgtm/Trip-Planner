import requests

BASE_URL = "http://localhost:5000/api"

def test_api():
    # 1. Test case-insensitive slug
    print("Testing case-insensitive slug (RESTAURANTS)...")
    resp = requests.get(f"{BASE_URL}/categories/RESTAURANTS/places")
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"Success: Found {len(resp.json())} places")
    
    # 2. Test bus timing simulation
    print("\nTesting bus timing simulation...")
    resp = requests.get(f"{BASE_URL}/categories/bus-timings/places")
    if resp.status_code == 200:
        data = resp.json()
        if data and 'real_time' in data[0]:
            print(f"Success: Found real-time data: {data[0]['real_time']}")
        else:
            print("Failed: No real-time data found for bus-timings")
            
    # 3. Test empty city search (should be 200)
    print("\nTesting empty city search...")
    resp = requests.get(f"{BASE_URL}/places-by-city?city=NowhereLand&slug=restaurants")
    print(f"Status: {resp.status_code}, Response: {resp.json()}")

if __name__ == "__main__":
    test_api()
