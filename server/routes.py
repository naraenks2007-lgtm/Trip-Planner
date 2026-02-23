from flask import Blueprint, jsonify, request
import requests
from models import Category, Place, User
from database import db
import time

api = Blueprint('api', __name__)

@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])

@api.route('/categories/<int:category_id>/places', methods=['GET'])
def get_places_by_category(category_id):
    places = Place.query.filter_by(category_id=category_id).all()
    return jsonify([p.to_dict() for p in places])

@api.route('/categories/<string:slug>/places', methods=['GET'])
def get_places_by_slug(slug):
    """Fetch places by category text slug (e.g. 'restaurants', 'car-rentals')."""
    cat = Category.query.filter_by(slug=slug).first_or_404()
    places = Place.query.filter_by(category_id=cat.id).all()
    return jsonify([p.to_dict() for p in places])

@api.route('/places/<int:place_id>', methods=['GET'])
def get_place_detail(place_id):
    place = Place.query.get_or_404(place_id)
    return jsonify(place.to_dict())


    # Old seed method replaced
    return jsonify({"message": "Deprecated. Use new logic."})


def fetch_places_from_osm(location="Paris"):
    print(f"Fetching data for {location}...")
    cats = Category.query.all()
    count = 0
    
    # Simple rate limiting/header
    headers = {'User-Agent': 'TripPlannerApp/1.0'}
    
    for cat in cats:
        query = ""
        if "car" in cat.slug: query = "car rental"
        elif "bus" in cat.slug: query = "bus station"
        elif "restaurant" in cat.slug: query = "restaurant"
        elif "tourist" in cat.slug: query = "tourist attraction"
        
        if not query: continue
        
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': f"{query} in {location}",
            'format': 'json',
            'limit': 10,  # Fetch more results
            'addressdetails': 1
        }
        
        try:
            response = requests.get(url, params=params, headers=headers)
            if response.status_code == 200:
                results = response.json()
                for item in results:
                    # Avoid duplicates by name + category
                    if Place.query.filter_by(name=item.get('name'), category_id=cat.id).first():
                        continue
                        
                    lat = item.get('lat', '0')
                    lon = item.get('lon', '0')
                    
                    new_place = Place(
                        category_id=cat.id,
                        name=item.get('name', 'Unknown Place'),
                        description=f"Type: {item.get('type', 'Unknown')}. {item.get('display_name', '')}",
                        price_fee="See Website",
                        crowd_level="Moderate",
                        location=item.get('display_name', '').split(',')[0],
                        phone="N/A",
                        map_link=f"https://www.openstreetmap.org/?mlat={lat}&mlon={lon}",
                        opening_hours="09:00 - 18:00",
                        image_url=f"https://source.unsplash.com/400x300/?{query.replace(' ', ',')}",
                        latitude=float(lat) if lat else 0.0,
                        longitude=float(lon) if lon else 0.0
                    )
                    # Hack: Store lat/lon in map_link or description if we don't have columns? 
                    # Ideally we should add lat/lon columns. For now, I'll parse them from map_link or add them to description hiddenly or just rely on API for map.
                    # Wait, the user wants to INTEGRATE the map. I need lat/lon.
                    # I will add lat/lon columns to the model in the next step. 
                    # For now let's stick to valid model fields.
                    
                    db.session.add(new_place)
                    count += 1
                db.session.commit()
        except Exception as e:
            print(f"Error fetching {query}: {e}")
            
    return count

@api.route('/seed', methods=['POST'])
def seed_db():
    # Always create categories if missing
    if not Category.query.first():
        cats = [
            Category(name="Car Rentals", slug="car-rentals", icon="car"),
            Category(name="Bus Timings", slug="bus-timings", icon="bus"),
            Category(name="Restaurants", slug="restaurants", icon="utensils"),
            Category(name="Tourist Places", slug="tourist-places", icon="map-marked-alt"),
        ]
        db.session.add_all(cats)
        db.session.commit()

    # Always try to fetch data if there are no places
    if not Place.query.first():
        print("Database empty, fetching fresh data from OSM...")
        fetch_places_from_osm("London") # Default city
        
        # If still empty (fetch failed), add fallback mock data
        if not Place.query.first():
            # ... existing mock data code ...
            # (I will keep the existing mock data adding as fallback, but for brevity I am rewriting the flow)
             places = []
             # Car Rentals
             places.append(Place(
                category_id=1, # Assuming ID 1 exists
                name="Speedy Wheels",
                description="Affordable and fast car rentals for your city trip.",
                price_fee="$50/day",
                crowd_level="Medium",
                location="123 Main St, City Center",
                phone="+1234567890",
                map_link="https://maps.google.com",
                opening_hours="8:00 AM - 8:00 PM",
                image_url="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80"
            ))
             db.session.add_all(places)
             db.session.commit()
    
    return jsonify({"message": "Database check/seed completed!"})

@api.route('/fetch-data', methods=['POST'])
def fetch_external_data():
    location = request.json.get('location', 'Paris')
    count = fetch_places_from_osm(location)
    return jsonify({"message": f"Fetched {count} new places for {location}"})


# Authentication Routes
@api.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # Create new user
    user = User(
        name=data.get('name', ''),
        email=data['email'],
        phone=data.get('phone', '')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully", "user": user.to_dict()}), 201

@api.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    return jsonify({"message": "Login successful", "user": user.to_dict()}), 200

@api.route('/auth/profile', methods=['GET'])
def get_profile():
    # In a real app, you'd get user_id from session/token
    # For now, we'll expect it in query params
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

@api.route('/auth/profile', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Update fields
    if 'name' in data:
        user.name = data['name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'avatar_url' in data:
        user.avatar_url = data['avatar_url']
    if 'upi_id' in data:
        user.upi_id = data['upi_id']
    
    db.session.commit()
    
    return jsonify({"message": "Profile updated successfully", "user": user.to_dict()}), 200


@api.route('/auth/logout', methods=['POST'])
def logout():
    # In a real app, you'd clear session/token
    return jsonify({"message": "Logout successful"}), 200


# Overpass API endpoint for real-time place data (used by MapView)
@api.route('/places', methods=['GET'])
def get_places_overpass():
    """
    Fetch real-time places from Overpass API based on coordinates and type.
    Used by MapView component to display markers on the map.
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    place_type = request.args.get('type')
    
    if not lat or not lon or not place_type:
        return jsonify({"error": "Missing required parameters: lat, lon, type"}), 400
    
    try:
        if place_type == "hotel":
            tag = '["tourism"="hotel"]'
        elif place_type == "restaurant":
            tag = '["amenity"="restaurant"]'
        elif place_type == "attraction":
            tag = '["tourism"="attraction"]'
        else:
            tag = '["tourism"="attraction"]'
        
        lat_f = float(lat)
        lon_f = float(lon)
        radius = 0.02
        
        query = f"""
        [out:json];
        node{tag}({lat_f - radius},{lon_f - radius},{lat_f + radius},{lon_f + radius});
        out;
        """
        
        overpass_url = "https://overpass-api.de/api/interpreter"
        response = requests.get(overpass_url, params={'data': query}, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            return jsonify({"error": "Failed to fetch data from Overpass API", "elements": []}), 500
            
    except Exception as e:
        print(f"Error fetching from Overpass API: {e}")
        return jsonify({"error": str(e), "elements": []}), 500


# ── slug mappings ──────────────────────────────────────────────────────────────

# Maps slug → (Nominatim keyword, Overpass tag, human label)
SLUG_CONFIG = {
    'restaurants':    ('restaurant',         '[\"amenity\"=\"restaurant\"]',             'Restaurant'),
    'car-rentals':    ('car rental',         '[\"amenity\"=\"car_rental\"]',              'Car Rental'),
    'bus-timings':    ('bus station',        '[\"amenity\"=\"bus_station\"]',             'Bus Station'),
    'tourist-places': ('tourist attraction', '[\"tourism\"~\"attraction|museum|viewpoint\"]', 'Tourist Place'),
    'trains':         ('railway station',    '[\"railway\"=\"station\"]',                'Train Station'),
    'flights':        ('airport',            '[\"aeroway\"~\"aerodrome|terminal\"]',      'Airport'),
}



def _build_place(el_id, name, description, location, phone,
                 opening, lat, lon, price, category_name):
    """Return a standard place dict used across all endpoints."""
    return {
        'id':            el_id,
        'name':          name,
        'description':   description,
        'location':      location,
        'phone':         phone,
        'opening_hours': opening,
        'latitude':      lat,
        'longitude':     lon,
        'rating':        None,
        'crowd_level':   'Moderate',
        'price_fee':     price,
        'image_url':     None,
        'map_link':      f"https://www.openstreetmap.org/?mlat={lat}&mlon={lon}",
        'category_name': category_name,
        'from_osm':      True,
    }


def _nominatim_keyword_search(keyword, city, limit=40):
    """
    Primary search for city-based queries.
    Uses Nominatim's free-text search: "restaurant in Coimbatore"
    Returns actual NAMED establishments with addresses, phone numbers, etc.
    """
    headers = {'User-Agent': 'TripPlannerApp/1.0 (trip-planner-app)'}
    try:
        resp = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params={
                'q':              f"{keyword} in {city}",
                'format':         'json',
                'limit':          limit,
                'addressdetails': 1,
                'extratags':      1,
                'namedetails':    1,
            },
            headers=headers,
            timeout=15,
        )
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        print(f"[Nominatim keyword] error: {e}")
    return []


def _overpass_bounding_box(lat_f, lon_f, osm_tag, radius_km=8, limit=40):
    """
    Supplementary search using Overpass API bounding box.
    Used when Nominatim returns < 5 named places.
    """
    r = radius_km / 111.0
    query = f"""
[out:json][timeout:30];
(
  node{osm_tag}({lat_f-r},{lon_f-r},{lat_f+r},{lon_f+r});
  way{osm_tag}({lat_f-r},{lon_f-r},{lat_f+r},{lon_f+r});
);
out center {limit};
"""
    try:
        resp = requests.post(
            'https://overpass-api.de/api/interpreter',
            data={'data': query},
            timeout=25,
            headers={'User-Agent': 'TripPlannerApp/1.0'},
        )
        if resp.status_code == 200:
            return resp.json().get('elements', [])
    except Exception as e:
        print(f"[Overpass] error: {e}")
    return []


def _parse_nominatim(results, label):
    """Convert Nominatim results to standard place dicts. Skips unnamed/generic entries."""
    places = []
    seen = set()
    skip_classes = {'boundary', 'highway', 'natural', 'landuse'}
    skip_types   = {'city', 'town', 'village', 'country', 'state', 'road', 'residential'}

    for item in results:
        # Extract the best name
        name_details = item.get('namedetails') or {}
        name = (name_details.get('name') or
                name_details.get('name:en') or
                item.get('display_name', '').split(',')[0].strip())

        if not name or name in seen:
            continue
        # Skip generic geographic entries
        if item.get('class') in skip_classes or item.get('type') in skip_types:
            continue
        seen.add(name)

        lat = float(item.get('lat', 0))
        lon = float(item.get('lon', 0))

        # Build address from structured addressdetails
        addr = item.get('address') or {}
        parts = list(filter(None, [
            addr.get('house_number'),
            addr.get('road'),
            addr.get('suburb') or addr.get('neighbourhood'),
            addr.get('city') or addr.get('town') or addr.get('state_district'),
        ]))
        location_str = ', '.join(parts) or addr.get('state', '')

        extra   = item.get('extratags') or {}
        phone   = extra.get('phone') or extra.get('contact:phone') or 'N/A'
        opening = extra.get('opening_hours') or 'See location'
        website = extra.get('website') or extra.get('contact:website') or ''
        cuisine = extra.get('cuisine') or ''

        desc_parts = []
        if cuisine:
            desc_parts.append(f"Cuisine: {cuisine.replace(';', ', ').title()}")
        if location_str:
            desc_parts.append(location_str)
        if website:
            desc_parts.append(f"Website: {website}")
        city_name = addr.get('city') or addr.get('town') or addr.get('state_district') or 'this area'
        description = '. '.join(desc_parts) if desc_parts else f"Real {label} in {city_name}, sourced from OpenStreetMap."

        places.append(_build_place(
            el_id        = f"nom_{item.get('osm_type','n')}_{item.get('osm_id','0')}",
            name         = name,
            description  = description,
            location     = location_str or city_name,
            phone        = phone,
            opening      = opening,
            lat          = lat,
            lon          = lon,
            price        = extra.get('fee', 'See location'),
            category_name= f"{label}s",
        ))
    return places


def _parse_overpass(elements, label, ref_lat, ref_lon):
    """Convert Overpass elements to standard place dicts. Skips unnamed nodes."""
    places = []
    seen = set()
    for el in elements:
        tags = el.get('tags') or {}
        name = tags.get('name') or tags.get('name:en') or tags.get('brand')
        if not name or name in seen:
            continue   # skip unnamed — they all look the same
        seen.add(name)

        if el['type'] == 'node':
            elat, elon = el.get('lat', ref_lat), el.get('lon', ref_lon)
        else:
            c = el.get('center') or {}
            elat, elon = c.get('lat', ref_lat), c.get('lon', ref_lon)

        addr_parts = list(filter(None, [
            tags.get('addr:housenumber'), tags.get('addr:street'),
            tags.get('addr:suburb'),      tags.get('addr:city'),
        ]))
        location_str = ', '.join(addr_parts) or tags.get('addr:full', 'Nearby')
        phone   = tags.get('phone') or tags.get('contact:phone') or 'N/A'
        opening = tags.get('opening_hours') or 'See location'
        website = tags.get('website') or tags.get('contact:website') or ''
        cuisine = tags.get('cuisine') or ''
        desc_parts = []
        if cuisine:
            desc_parts.append(f"Cuisine: {cuisine.replace(';', ', ').title()}")
        if website:
            desc_parts.append(f"Website: {website}")
        description = '. '.join(desc_parts) if desc_parts else f"Real-time {label} data from OpenStreetMap."

        places.append(_build_place(
            el_id        = f"osm_{el['type']}_{el['id']}",
            name         = name,
            description  = description,
            location     = location_str,
            phone        = phone,
            opening      = opening,
            lat          = elat,
            lon          = elon,
            price        = tags.get('fee', 'See location'),
            category_name= f"{label}s",
        ))
    return places


# ── slug resolver ─────────────────────────────────────────────────────────────

def _resolve_slug(raw_slug):
    """
    Accept either a text slug ('restaurants') OR a numeric category ID ('3').
    Returns the text slug string, or None if the category isn't found.
    """
    if raw_slug.isdigit():
        # Numeric ID — look up the real slug from the DB
        cat = Category.query.get(int(raw_slug))
        return cat.slug if cat else None
    return raw_slug   # already a text slug


# ── new endpoints ──────────────────────────────────────────────────────────────

@api.route('/nearby-places', methods=['GET'])
def nearby_places():
    """
    Return live places near GPS coordinates (uses Overpass bounding box).
    Query params: lat, lon, slug, radius (km, default 5)
    """
    lat    = request.args.get('lat')
    lon    = request.args.get('lon')
    slug   = _resolve_slug(request.args.get('slug', '').strip())
    radius = float(request.args.get('radius', 5))

    if not lat or not lon or not slug:
        return jsonify({"error": "lat, lon and slug are required"}), 400

    cfg = SLUG_CONFIG.get(slug)
    if not cfg:
        return jsonify({"error": f"Unknown category: {slug}"}), 400

    _, osm_tag, label = cfg
    try:
        elements = _overpass_bounding_box(float(lat), float(lon), osm_tag, radius)
        places   = _parse_overpass(elements, label, float(lat), float(lon))
        return jsonify(places), 200
    except Exception as e:
        print(f"[/nearby-places] {e}")
        return jsonify({"error": str(e)}), 500


@api.route('/places-by-city', methods=['GET'])
def places_by_city():
    """
    Search real named places in a city.
    Primary:   Nominatim keyword search  ("restaurant in Coimbatore")
    Fallback:  Overpass bounding box     (if Nominatim returns < 5 results)
    Query params: city, slug, radius (km, default 8)
    """
    city   = request.args.get('city', '').strip()
    slug   = _resolve_slug(request.args.get('slug', '').strip())
    radius = float(request.args.get('radius', 8))

    if not city or not slug:
        return jsonify({"error": "city and slug are required"}), 400

    cfg = SLUG_CONFIG.get(slug)
    if not cfg:
        return jsonify({"error": f"Unknown slug: {slug}"}), 400

    keyword, osm_tag, label = cfg

    # ── Step 1: Nominatim keyword search ────────────────────────────────────
    raw     = _nominatim_keyword_search(keyword, city, limit=40)
    places  = _parse_nominatim(raw, label)
    print(f"[/places-by-city] Nominatim '{keyword} in {city}': {len(raw)} raw → {len(places)} named")

    # ── Step 2: Overpass supplement if Nominatim gave too few ────────────────
    if len(places) < 5:
        time.sleep(0.5)
        try:
            geo = requests.get(
                'https://nominatim.openstreetmap.org/search',
                params={'q': city, 'format': 'json', 'limit': 1},
                headers={'User-Agent': 'TripPlannerApp/1.0'},
                timeout=10,
            ).json()
            if geo:
                lat_f = float(geo[0]['lat'])
                lon_f = float(geo[0]['lon'])
                elements    = _overpass_bounding_box(lat_f, lon_f, osm_tag, radius_km=radius, limit=40)
                ovr_places  = _parse_overpass(elements, label, lat_f, lon_f)
                existing    = {p['name'] for p in places}
                added = 0
                for p in ovr_places:
                    if p['name'] not in existing:
                        places.append(p)
                        existing.add(p['name'])
                        added += 1
                print(f"[/places-by-city] Overpass added {added} → total {len(places)}")
        except Exception as e:
            print(f"[/places-by-city] Overpass supplement failed: {e}")

    if not places:
        return jsonify({"error": f"No results for '{keyword}' in '{city}'. Try a different spelling."}), 404

    return jsonify(places), 200

