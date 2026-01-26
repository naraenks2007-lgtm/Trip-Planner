from flask import Blueprint, jsonify, request
from models import Category, Place
from database import db

api = Blueprint('api', __name__)

@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])

@api.route('/categories/<int:category_id>/places', methods=['GET'])
def get_places_by_category(category_id):
    places = Place.query.filter_by(category_id=category_id).all()
    return jsonify([p.to_dict() for p in places])

@api.route('/places/<int:place_id>', methods=['GET'])
def get_place_detail(place_id):
    place = Place.query.get_or_404(place_id)
    return jsonify(place.to_dict())

@api.route('/seed', methods=['POST'])
def seed_db():
    if Category.query.first():
        return jsonify({"message": "Database already seeded"}), 200

    # Create Categories
    cats = [
        Category(name="Car Rentals", slug="car-rentals", icon="car"),
        Category(name="Bus Timings", slug="bus-timings", icon="bus"),
        Category(name="Restaurants", slug="restaurants", icon="utensils"),
        Category(name="Tourist Places", slug="tourist-places", icon="map-marked-alt"),
    ]
    db.session.add_all(cats)
    db.session.commit()

    # Create Mock Places
    places = []
    
    # Car Rentals
    places.append(Place(
        category_id=cats[0].id,
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
    
    # Bus Timings (Mocking as places for the list)
    places.append(Place(
        category_id=cats[1].id,
        name="Express Line 101",
        description="Direct bus to the mountains.",
        price_fee="$12/ticket",
        crowd_level="High",
        location="Central Bus Station",
        phone=None,
        map_link="https://maps.google.com",
        opening_hours="Every 30 mins",
        image_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80"
    ))
    
    # Restaurants
    places.append(Place(
        category_id=cats[2].id,
        name="The Gourmet Spot",
        description="Fine dining experience with local cuisine.",
        price_fee="$$-$$$",
        crowd_level="High [Reservations Recommended]",
        location="456 Foodie Lane",
        phone="+9876543210",
        map_link="https://maps.google.com",
        opening_hours="11:00 AM - 10:00 PM",
        image_url="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"
    ))
    
    # Tourist Places
    places.append(Place(
        category_id=cats[3].id,
        name="Sunset Viewpoint",
        description="Best place to see the sunset over the city.",
        price_fee="Free",
        crowd_level="Low",
        location="Top of the Hill",
        phone=None,
        map_link="https://maps.google.com",
        opening_hours="24/7",
        image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ))
    
    db.session.add_all(places)
    db.session.commit()
    
    return jsonify({"message": "Database seeded successfully!"})
