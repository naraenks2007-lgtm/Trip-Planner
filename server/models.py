from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    icon = db.Column(db.String(100), nullable=True) # Icon name

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'icon': self.icon
        }

class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price_fee = db.Column(db.String(100), nullable=True)
    crowd_level = db.Column(db.String(50), nullable=True) # Low, Moderate, High
    location = db.Column(db.String(200), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    map_link = db.Column(db.String(500), nullable=True)
    opening_hours = db.Column(db.String(200), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    rating = db.Column(db.Float, nullable=True)  # 1.0 to 5.0 for star ratings

    category = db.relationship('Category', backref=db.backref('places', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'category_name': self.category.name,
            'name': self.name,
            'description': self.description,
            'price_fee': self.price_fee,
            'crowd_level': self.crowd_level,
            'location': self.location,
            'phone': self.phone,
            'map_link': self.map_link,
            'opening_hours': self.opening_hours,
            'image_url': self.image_url,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'rating': self.rating
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(500), nullable=True)
    upi_id = db.Column(db.String(100), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'avatar_url': self.avatar_url,
            'upi_id': self.upi_id
        }
