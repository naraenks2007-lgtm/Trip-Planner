import requests
import sys

BASE_URL = "http://localhost:5000/api"

def test_endpoint(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    print(f"Testing: {url}")
    try:
        resp = requests.get(url)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            print(f"Name: {data.get('name')}")
            print(f"Phone: {data.get('phone')}")
            print(f"Rating: {data.get('rating')}")
            print(f"OSM: {data.get('from_osm')}")
            return True
        else:
            print(f"Error: {resp.text}")
            return False
    except Exception as e:
        print(f"Failed to connect: {e}")
        return False

if __name__ == "__main__":
    print("--- Verification Start ---")
    
    # Test 1: City Search (to get some IDs)
    print("\n1. Testing places-by-city...")
    resp = requests.get(f"{BASE_URL}/places-by-city?city=coimbatore&slug=restaurants")
    if resp.status_code == 200:
        places = resp.json()
        print(f"Found {len(places)} places in Coimbatore")
        if places:
            first_id = places[0]['id']
            print(f"Using first ID: {first_id}")
            
            # Test 2: Detail with the OSM ID
            print("\n2. Testing detail with OSM ID...")
            test_endpoint(f"places/{first_id}")
    else:
        print(f"Failed to get places: {resp.text}")

    # Test 3: Local DB ID (assuming ID 1 exists from seed)
    print("\n3. Testing detail with Numeric ID (1)...")
    test_endpoint("places/1")

    # Test 4: New Hotels category
    print("\n4. Testing Hotels category...")
    resp = requests.get(f"{BASE_URL}/places-by-city?city=London&slug=hotels")
    if resp.status_code == 200:
        places = resp.json()
        print(f"Found {len(places)} hotels in London")
    else:
        print(f"Failed to get hotels: {resp.status_code} - {resp.text}")

    # Test 5: Empty result fix (No 404)
    print("\n5. Testing empty results (should be 200 [])...")
    resp = requests.get(f"{BASE_URL}/places-by-city?city=NonExistentCity12345&slug=restaurants")
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"Response: {resp.json()}")
    else:
        print(f"Failed: {resp.text}")

    print("\n--- Verification End ---")
