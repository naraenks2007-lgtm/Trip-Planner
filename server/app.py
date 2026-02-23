from flask import Flask
from flask_cors import CORS
from database import db
from routes import api
import os

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Database config — DB_PATH env var for Docker, fallback for local dev
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.environ.get('DB_PATH') or os.path.join(basedir, 'trip_planner.db')
    # Ensure the directory exists (important for the Docker named volume path)
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path.replace('\\', '/')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(api, url_prefix='/api')

    with app.app_context():
        db.create_all()
        _auto_seed()   # seed only if DB is empty

    return app


def _auto_seed():
    """Seed categories + sample places if the DB is empty (first run / Docker)."""
    from models import Category, Place

    if Category.query.first():
        return   # already seeded

    print("[startup] Empty DB detected — seeding initial data...")

    categories_data = [
        {'name': 'Car Rentals',    'slug': 'car-rentals',    'icon': 'car'},
        {'name': 'Bus Timings',    'slug': 'bus-timings',    'icon': 'bus'},
        {'name': 'Restaurants',    'slug': 'restaurants',    'icon': 'utensils'},
        {'name': 'Tourist Places', 'slug': 'tourist-places', 'icon': 'map-marked-alt'},
        {'name': 'Trains',         'slug': 'trains',         'icon': 'train'},
        {'name': 'Flights',        'slug': 'flights',        'icon': 'plane'},
    ]
    for cat_data in categories_data:
        db.session.add(Category(**cat_data))
    db.session.commit()

    # ── Sample places (Chennai fallback data) ────────────────────────────────
    cats = {c.slug: c for c in Category.query.all()}

    sample_places = [
        # Restaurants
        dict(category_id=cats['restaurants'].id, name='Saravana Bhavan',
             description='Famous vegetarian restaurant chain.',
             location='Nelson Manickam Road, Chennai', phone='+91-44-23744050',
             opening_hours='06:00 - 23:00', price_fee='₹200-500',
             crowd_level='High', latitude=13.0694, longitude=80.2102,
             map_link='https://maps.google.com/?q=Saravana+Bhavan+Chennai'),
        dict(category_id=cats['restaurants'].id, name='Murugan Idli Shop',
             description='Authentic South Indian breakfast spot.',
             location='T. Nagar, Chennai', phone='+91-44-24344567',
             opening_hours='06:00 - 22:00', price_fee='₹100-300',
             crowd_level='High', latitude=13.0418, longitude=80.2341,
             map_link='https://maps.google.com/?q=Murugan+Idli+Shop+Chennai'),

        # Car Rentals
        dict(category_id=cats['car-rentals'].id, name='Avis Car Rental',
             description='Premium car rental with wide selection.',
             location='Anna Salai, Chennai', phone='+91-44-28294444',
             opening_hours='08:00 - 20:00', price_fee='₹1500/day',
             crowd_level='Moderate', latitude=13.0569, longitude=80.2425,
             map_link='https://maps.google.com/?q=Avis+Chennai'),
        dict(category_id=cats['car-rentals'].id, name='Zoom Car',
             description='Self-drive car rentals available 24/7.',
             location='Egmore, Chennai', phone='+91-80-46666666',
             opening_hours='24 hours', price_fee='₹800/day',
             crowd_level='Low', latitude=13.0732, longitude=80.2609,
             map_link='https://maps.google.com/?q=Zoomcar+Chennai'),

        # Tourist Places
        dict(category_id=cats['tourist-places'].id, name='Marina Beach',
             description='Longest natural urban beach in Asia.',
             location='Kamarajar Salai, Chennai', phone='N/A',
             opening_hours='Open 24 hours', price_fee='Free',
             crowd_level='High', latitude=13.0500, longitude=80.2824,
             map_link='https://maps.google.com/?q=Marina+Beach+Chennai'),
        dict(category_id=cats['tourist-places'].id, name='Kapaleeshwarar Temple',
             description='Ancient Dravidian-style Shiva temple.',
             location='Mylapore, Chennai', phone='+91-44-24641670',
             opening_hours='06:00 - 12:00, 16:00 - 21:00', price_fee='Free',
             crowd_level='High', latitude=13.0334, longitude=80.2693,
             map_link='https://maps.google.com/?q=Kapaleeshwarar+Temple+Chennai'),

        # Bus Timings
        dict(category_id=cats['bus-timings'].id, name='Chennai Mofussil Bus Terminus',
             description='Major inter-city bus hub (CMBT).',
             location='Koyambedu, Chennai', phone='+91-44-24794949',
             opening_hours='24 hours', price_fee='Varies',
             crowd_level='High', latitude=13.0694, longitude=80.1948,
             map_link='https://maps.google.com/?q=CMBT+Chennai'),

        # Trains
        dict(category_id=cats['trains'].id, name='Chennai Central',
             description='Main railway terminus for Chennai.',
             location='Park Town, Chennai', phone='139',
             opening_hours='24 hours', price_fee='Varies',
             crowd_level='High', latitude=13.0827, longitude=80.2707,
             map_link='https://maps.google.com/?q=Chennai+Central+Railway+Station'),

        # Flights
        dict(category_id=cats['flights'].id, name='Chennai International Airport',
             description='Primary airport serving Chennai.',
             location='Meenambakkam, Chennai', phone='+91-44-22560551',
             opening_hours='24 hours', price_fee='Varies',
             crowd_level='Moderate', latitude=12.9941, longitude=80.1709,
             map_link='https://maps.google.com/?q=Chennai+Airport'),
    ]

    for p in sample_places:
        db.session.add(Place(**p))
    db.session.commit()

    print(f"[startup] Seeded {len(categories_data)} categories and {len(sample_places)} places.")


if __name__ == '__main__':
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
