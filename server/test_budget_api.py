import requests
import json

url = "http://127.0.0.1:5000/api/estimate-budget"
headers = {'Content-Type': 'application/json'}

payloads = [
    {
        "budget": 5000,
        "transport_mode": "car",
        "distance": 250,
        "places": [
            {"name": "Museum", "hasTicket": True, "ticketPrice": "150"},
            {"name": "Park", "hasTicket": False, "ticketPrice": ""}
        ]
    },
    {
        "budget": 2000,
        "transport_mode": "bus",
        "distance": 500,
        "places": [
            {"name": "Temple", "hasTicket": True, "ticketPrice": ""}, # Should use default 200
            {"name": "Beach", "hasTicket": False, "ticketPrice": ""}
        ]
    }
]

for i, payload in enumerate(payloads):
    print(f"\n--- Test Case {i+1} ---")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
