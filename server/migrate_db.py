"""
Database migration script to add new features:
1. Add rating field to existing places
2. Create new categories (Trains, Flights)
3. Add sample data for new categories
"""

from app import create_app
from database import db
from models import Category, Place
import random

def migrate_database():
    app = create_app()
    
    with app.app_context():
        print("Starting database migration...")
        
        # Drop all tables and recreate (for development only)
        print("Recreating database schema...")
        db.drop_all()
        db.create_all()
        
        # Create categories
        print("Creating categories...")
        categories_data = [
            {'name': 'Car Rentals', 'slug': 'car-rentals', 'icon': 'car'},
            {'name': 'Bus Timings', 'slug': 'bus-timings', 'icon': 'bus'},
            {'name': 'Restaurants', 'slug': 'restaurants', 'icon': 'utensils'},
            {'name': 'Hotels', 'slug': 'hotels', 'icon': 'hotel'},
            {'name': 'Tourist Places', 'slug': 'tourist-places', 'icon': 'map-marked-alt'},
            {'name': 'Trains', 'slug': 'trains', 'icon': 'train'},
            {'name': 'Flights', 'slug': 'flights', 'icon': 'plane'}
        ]
        
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
        
        db.session.commit()
        print(f"Created {len(categories_data)} categories")
        
        # Add sample places for existing categories
        print("Adding sample places...")
        
        # Car Rentals
        car_rentals_cat = Category.query.filter_by(slug='car-rentals').first()
        car_rentals = [
            {
                'name': 'Avis',
                'description': 'Premium car rental service with wide selection',
                'price_fee': '₹2000/day',
                'crowd_level': 'Moderate',
                'location': 'Chennai Airport',
                'phone': '+91 44 1234 5678',
                'opening_hours': '24/7',
                'latitude': 12.9941,
                'longitude': 80.1709,
                'rating': 4.2,
                'category_id': car_rentals_cat.id
            },
            {
                'name': 'Capital Hire',
                'description': 'Affordable car rentals for budget travelers',
                'price_fee': '₹1500/day',
                'crowd_level': 'Moderate',
                'location': 'T Nagar',
                'phone': '+91 44 2345 6789',
                'opening_hours': '8 AM - 10 PM',
                'latitude': 13.0418,
                'longitude': 80.2341,
                'rating': 3.8,
                'category_id': car_rentals_cat.id
            },
            {
                'name': 'Easirent London Kings Cross',
                'description': 'Quick and easy car pickup service',
                'price_fee': '₹1800/day',
                'crowd_level': 'Moderate',
                'location': 'Egmore',
                'phone': '+91 44 3456 7890',
                'opening_hours': '7 AM - 11 PM',
                'latitude': 13.0732,
                'longitude': 80.2609,
                'rating': 4.0,
                'category_id': car_rentals_cat.id
            },
            {
                'name': 'Enterprise',
                'description': 'Trusted car rental with excellent customer service',
                'price_fee': '₹2200/day',
                'crowd_level': 'Moderate',
                'location': 'Anna Nagar',
                'phone': '+91 44 4567 8901',
                'opening_hours': '24/7',
                'latitude': 13.0878,
                'longitude': 80.2086,
                'rating': 4.5,
                'category_id': car_rentals_cat.id
            }
        ]
        
        # Restaurants
        restaurants_cat = Category.query.filter_by(slug='restaurants').first()
        restaurants = [
            {
                'name': 'Murugan Idli Shop',
                'description': 'Famous for authentic South Indian breakfast',
                'price_fee': '₹150 for two',
                'crowd_level': 'High',
                'location': 'T Nagar',
                'phone': '+91 44 2815 2828',
                'opening_hours': '6 AM - 11 PM',
                'latitude': 13.0418,
                'longitude': 80.2341,
                'rating': 4.6,
                'category_id': restaurants_cat.id
            },
            {
                'name': 'Saravana Bhavan',
                'description': 'Vegetarian restaurant chain with traditional dishes',
                'price_fee': '₹200 for two',
                'crowd_level': 'High',
                'location': 'Anna Salai',
                'phone': '+91 44 2852 5511',
                'opening_hours': '7 AM - 11 PM',
                'latitude': 13.0569,
                'longitude': 80.2506,
                'rating': 4.4,
                'category_id': restaurants_cat.id
            },
            {
                'name': 'Anjappar Chettinad',
                'description': 'Spicy Chettinad cuisine and biryanis',
                'price_fee': '₹400 for two',
                'crowd_level': 'Moderate',
                'location': 'Nungambakkam',
                'phone': '+91 44 2833 4455',
                'opening_hours': '11 AM - 11 PM',
                'latitude': 13.0569,
                'longitude': 80.2424,
                'rating': 4.3,
                'category_id': restaurants_cat.id
            },
            {
                'name': 'Buhari Hotel',
                'description': 'Legendary restaurant known for biryanis',
                'price_fee': '₹500 for two',
                'crowd_level': 'High',
                'location': 'Anna Salai',
                'phone': '+91 44 2852 2100',
                'opening_hours': '11 AM - 11:30 PM',
                'latitude': 13.0643,
                'longitude': 80.2675,
                'rating': 4.5,
                'category_id': restaurants_cat.id
            },
            {
                'name': 'The Marina',
                'description': 'Fine dining with seafood specialties',
                'price_fee': '₹800 for two',
                'crowd_level': 'Low',
                'location': 'Besant Nagar',
                'phone': '+91 44 2441 4142',
                'opening_hours': '12 PM - 11 PM',
                'latitude': 13.0001,
                'longitude': 80.2668,
                'rating': 4.7,
                'category_id': restaurants_cat.id
            }
        ]
        
        # Tourist Places
        tourist_cat = Category.query.filter_by(slug='tourist-places').first()
        tourist_places = [
            {
                'name': 'Marina Beach',
                'description': 'Second longest urban beach in the world',
                'price_fee': 'Free',
                'crowd_level': 'High',
                'location': 'Marina Beach Road',
                'opening_hours': 'Open 24 hours',
                'latitude': 13.0499,
                'longitude': 80.2824,
                'rating': 4.3,
                'category_id': tourist_cat.id
            },
            {
                'name': 'Kapaleeshwarar Temple',
                'description': 'Ancient Shiva temple with Dravidian architecture',
                'price_fee': 'Free',
                'crowd_level': 'Moderate',
                'location': 'Mylapore',
                'opening_hours': '5:30 AM - 12 PM, 4 PM - 9 PM',
                'latitude': 13.0339,
                'longitude': 80.2692,
                'rating': 4.6,
                'category_id': tourist_cat.id
            },
            {
                'name': 'Fort St. George',
                'description': 'Historic British fort and museum',
                'price_fee': '₹15 entry',
                'crowd_level': 'Low',
                'location': 'George Town',
                'opening_hours': '9 AM - 5 PM',
                'latitude': 13.0795,
                'longitude': 80.2884,
                'rating': 4.1,
                'category_id': tourist_cat.id
            },
            {
                'name': 'Government Museum',
                'description': 'One of India\'s oldest museums',
                'price_fee': '₹15 entry',
                'crowd_level': 'Low',
                'location': 'Egmore',
                'opening_hours': '9:30 AM - 5 PM (Closed Fridays)',
                'latitude': 13.0732,
                'longitude': 80.2609,
                'rating': 4.2,
                'category_id': tourist_cat.id
            }
        ]
        
        # Trains
        trains_cat = Category.query.filter_by(slug='trains').first()
        trains = [
            {
                'name': 'Chennai Central Railway Station',
                'description': 'Major railway hub connecting to all parts of India',
                'price_fee': 'Varies by destination',
                'crowd_level': 'High',
                'location': 'Park Town',
                'phone': '139 (Railway Enquiry)',
                'opening_hours': '24/7',
                'latitude': 13.0827,
                'longitude': 80.2707,
                'rating': 4.0,
                'category_id': trains_cat.id
            },
            {
                'name': 'Chennai Egmore Railway Station',
                'description': 'Terminus for trains to southern Tamil Nadu and Kerala',
                'price_fee': 'Varies by destination',
                'crowd_level': 'High',
                'location': 'Egmore',
                'phone': '139 (Railway Enquiry)',
                'opening_hours': '24/7',
                'latitude': 13.0732,
                'longitude': 80.2609,
                'rating': 3.9,
                'category_id': trains_cat.id
            },
            {
                'name': 'Tambaram Railway Station',
                'description': 'Important suburban railway junction',
                'price_fee': 'Varies by destination',
                'crowd_level': 'Moderate',
                'location': 'Tambaram',
                'phone': '139 (Railway Enquiry)',
                'opening_hours': '24/7',
                'latitude': 12.9250,
                'longitude': 80.1167,
                'rating': 3.7,
                'category_id': trains_cat.id
            }
        ]
        
        # Flights
        flights_cat = Category.query.filter_by(slug='flights').first()
        flights = [
            {
                'name': 'Chennai International Airport',
                'description': 'Major international airport serving Chennai',
                'price_fee': 'Varies by destination',
                'crowd_level': 'High',
                'location': 'Meenambakkam',
                'phone': '+91 44 2256 0551',
                'opening_hours': '24/7',
                'latitude': 12.9941,
                'longitude': 80.1709,
                'rating': 4.1,
                'category_id': flights_cat.id
            },
            {
                'name': 'IndiGo Airlines - Chennai',
                'description': 'Low-cost carrier with frequent domestic flights',
                'price_fee': 'From ₹2000',
                'crowd_level': 'High',
                'location': 'Chennai Airport',
                'phone': '1800 180 3838',
                'opening_hours': '24/7',
                'latitude': 12.9941,
                'longitude': 80.1709,
                'rating': 4.0,
                'category_id': flights_cat.id
            },
            {
                'name': 'Air India - Chennai',
                'description': 'National carrier with domestic and international routes',
                'price_fee': 'From ₹3000',
                'crowd_level': 'Moderate',
                'location': 'Chennai Airport',
                'phone': '1800 180 1407',
                'opening_hours': '24/7',
                'latitude': 12.9941,
                'longitude': 80.1709,
                'rating': 3.8,
                'category_id': flights_cat.id
            },
            {
                'name': 'SpiceJet - Chennai',
                'description': 'Budget airline with good connectivity',
                'price_fee': 'From ₹1800',
                'crowd_level': 'High',
                'location': 'Chennai Airport',
                'phone': '1800 180 3333',
                'opening_hours': '24/7',
                'latitude': 12.9941,
                'longitude': 80.1709,
                'rating': 3.9,
                'category_id': flights_cat.id
            }
        ]
        
        # Bus Timings
        bus_cat = Category.query.filter_by(slug='bus-timings').first()
        bus_timings = [
            {
                'name': 'Koyambedu (CMBT) - Platform 1',
                'description': 'Main hub for government and private long-distance buses',
                'price_fee': '₹50 - ₹800',
                'crowd_level': 'High',
                'location': 'Koyambedu',
                'phone': '+91 44 2479 4700',
                'opening_hours': '24/7',
                'latitude': 13.0678,
                'longitude': 80.2048,
                'rating': 3.5,
                'category_id': bus_cat.id
            },
            {
                'name': 'MTC Local Bus Stand - T.Nagar',
                'description': 'Main station for Chennai local city buses',
                'price_fee': '₹5 - ₹50',
                'crowd_level': 'High',
                'location': 'T.Nagar',
                'phone': '044-23455851',
                'opening_hours': '4 AM - 11 PM',
                'latitude': 13.0401,
                'longitude': 80.2337,
                'rating': 3.9,
                'category_id': bus_cat.id
            }
        ]

        # Hotels
        hotels_cat = Category.query.filter_by(slug='hotels').first()
        hotels = [
            {
                'name': 'ITC Grand Chola',
                'description': 'Luxury hotel with regal Indian architecture and premium amenities',
                'price_fee': '₹12000/night',
                'crowd_level': 'Low',
                'location': 'Guindy',
                'phone': '+91 44 2220 0000',
                'opening_hours': '24/7',
                'latitude': 13.0116,
                'longitude': 80.2215,
                'rating': 4.9,
                'category_id': hotels_cat.id
            },
            {
                'name': 'The Residency Towers',
                'description': 'Business hotel in the heart of the city',
                'price_fee': '₹6000/night',
                'crowd_level': 'Moderate',
                'location': 'T Nagar',
                'phone': '+91 44 2815 6363',
                'opening_hours': '24/7',
                'latitude': 13.0441,
                'longitude': 80.2361,
                'rating': 4.3,
                'category_id': hotels_cat.id
            }
        ]

        # Add all places
        all_places = car_rentals + restaurants + tourist_places + trains + flights + bus_timings + hotels
        for place_data in all_places:
            place = Place(**place_data)
            db.session.add(place)
        
        db.session.commit()
        print(f"Added {len(all_places)} places")
        print("Migration completed successfully!")

if __name__ == '__main__':
    migrate_database()
