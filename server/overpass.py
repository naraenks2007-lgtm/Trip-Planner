from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

@app.route("/")
def home():
    return "Overpass API backend is running!"

@app.route("/api/places")
def get_places():

    lat = request.args.get("lat")
    lon = request.args.get("lon")
    place_type = request.args.get("type")

    if place_type == "hotel":
        tag = '["tourism"="hotel"]'
    elif place_type == "restaurant":
        tag = '["amenity"="restaurant"]'
    else:
        tag = '["tourism"="attraction"]'

    query = f"""
    [out:json];
    node{tag}({float(lat)-0.02},{float(lon)-0.02},{float(lat)+0.02},{float(lon)+0.02});
    out;
    """

    response = requests.get(OVERPASS_URL, params={'data': query})
    data = response.json()

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
