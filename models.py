from database import db

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
    crowd_level = db.Column(db.String(50), nullable=True) # Low, Medium, High
    location = db.Column(db.String(200), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    map_link = db.Column(db.String(500), nullable=True)
    opening_hours = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)

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
            'image_url': self.image_url
        }
