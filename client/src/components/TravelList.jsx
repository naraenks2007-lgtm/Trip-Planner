import React, { useState, useContext } from 'react';
import { Phone, MapPin, Clock, DollarSign, Star, GripHorizontal } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

function TravelList({ selectedOption }) {
    const { dark } = useContext(ThemeContext);
    const [panelHeight, setPanelHeight] = useState(40); // percentage
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const windowHeight = window.innerHeight;
            const newHeight = ((windowHeight - e.clientY) / windowHeight) * 100;
            setPanelHeight(Math.min(Math.max(newHeight, 20), 80)); // Between 20% and 80%
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    // Sample data for different travel options
    const carRentals = [
        { id: 1, name: 'Speedy Wheels Car Rental', location: '123 Main St, Downtown', phone: '+1 (555) 123-4567', cost: '$50/day', timing: '8:00 AM - 8:00 PM', rating: 4.5 },
        { id: 2, name: 'Premium Auto Rentals', location: '456 Park Ave, City Center', phone: '+1 (555) 234-5678', cost: '$65/day', timing: '24/7', rating: 4.8 },
        { id: 3, name: 'Budget Car Hire', location: '789 Oak Rd, Suburb', phone: '+1 (555) 345-6789', cost: '$35/day', timing: '7:00 AM - 10:00 PM', rating: 4.2 }
    ];

    const restaurants = [
        { id: 1, name: 'The Golden Fork', location: '321 Food St, Gourmet District', phone: '+1 (555) 111-2222', cost: '$$$ - $$$$', timing: '11:00 AM - 11:00 PM', rating: 4.7 },
        { id: 2, name: 'Spice Garden', location: '654 Curry Lane, Flavor Town', phone: '+1 (555) 222-3333', cost: '$$ - $$$', timing: '12:00 PM - 10:00 PM', rating: 4.6 },
        { id: 3, name: 'Ocean Breeze Seafood', location: '987 Beach Blvd, Coastal Area', phone: '+1 (555) 333-4444', cost: '$$$', timing: '5:00 PM - 12:00 AM', rating: 4.9 }
    ];

    const hotels = [
        { id: 1, name: 'Grand Plaza Hotel', location: '111 Luxury Ave, Premium District', phone: '+1 (555) 444-5555', cost: '$150/night', timing: '24/7 Check-in', rating: 4.8 },
        { id: 2, name: 'Comfort Inn & Suites', location: '222 Cozy St, Midtown', phone: '+1 (555) 555-6666', cost: '$80/night', timing: '24/7 Check-in', rating: 4.4 },
        { id: 3, name: 'Boutique Stay', location: '333 Charm Rd, Historic Quarter', phone: '+1 (555) 666-7777', cost: '$120/night', timing: '24/7 Check-in', rating: 4.6 }
    ];

    const touristAttractions = [
        { id: 1, name: 'City Museum', location: '444 Culture St, Arts District', phone: '+1 (555) 777-8888', cost: '$15 entry', timing: '9:00 AM - 6:00 PM', rating: 4.7 },
        { id: 2, name: 'Botanical Gardens', location: '555 Green Path, Nature Park', phone: '+1 (555) 888-9999', cost: '$10 entry', timing: '7:00 AM - 7:00 PM', rating: 4.9 },
        { id: 3, name: 'Historic Fort', location: '666 Heritage Rd, Old Town', phone: '+1 (555) 999-0000', cost: '$12 entry', timing: '10:00 AM - 5:00 PM', rating: 4.5 }
    ];

    const busTimings = [
        { id: 1, name: 'Central Bus Station', location: 'Downtown Transit Hub', phone: '+1 (555) 100-2000', cost: '$2 - $5 per ride', timing: '5:00 AM - 12:00 AM', rating: 4.0 },
        { id: 2, name: 'North Terminal', location: 'North District', phone: '+1 (555) 200-3000', cost: '$2 - $5 per ride', timing: '6:00 AM - 11:00 PM', rating: 4.1 }
    ];

    const famousPlaces = [
        { id: 1, name: 'City Landmark Tower', location: 'City Center', phone: '+1 (555) 300-4000', cost: '$20 entry', timing: '9:00 AM - 9:00 PM', rating: 4.8 },
        { id: 2, name: 'Waterfront Promenade', location: 'Riverside District', phone: '+1 (555) 400-5000', cost: 'Free', timing: 'Open 24/7', rating: 4.9 }
    ];

    let data = [];
    let title = '';

    switch (selectedOption) {
        case 'car-rentals':
            data = carRentals;
            title = '🚗 Car Rentals';
            break;
        case 'restaurants':
            data = restaurants;
            title = '🍽️ Restaurants';
            break;
        case 'hotels':
            data = hotels;
            title = '🏨 Hotels';
            break;
        case 'tourist-attractions':
            data = touristAttractions;
            title = '📍 Tourist Attractions';
            break;
        case 'bus':
            data = busTimings;
            title = '🚌 Bus Timings';
            break;
        case 'famous':
            data = famousPlaces;
            title = '⭐ Famous Places';
            break;
        default:
            return null;
    }

    if (!selectedOption || data.length === 0) {
        return null;
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${panelHeight}%`,
            background: dark ? '#1f2937' : 'white',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            padding: '1.5rem',
            zIndex: 1000,
            transition: isDragging ? 'none' : 'height 0.2s'
        }}>
            {/* Drag Handle */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'ns-resize',
                    userSelect: 'none'
                }}
            >
                <div style={{
                    width: '60px',
                    height: '4px',
                    background: dark ? '#4b5563' : '#d1d5db',
                    borderRadius: '2px',
                    marginBottom: '8px'
                }} />
            </div>

            <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                marginTop: '1.5rem',
                color: dark ? '#f9fafb' : '#1f2937'
            }}>
                {title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            background: dark ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            border: dark ? '1px solid #4b5563' : '1px solid #e5e7eb',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = dark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: dark ? '#f9fafb' : '#111827', margin: 0 }}>
                                {item.name}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706' }}>{item.rating}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16} color="#6b7280" />
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.location}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} color="#6b7280" />
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.phone}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DollarSign size={16} color="#6b7280" />
                                <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>{item.cost}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} color="#6b7280" />
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.timing}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TravelList;
