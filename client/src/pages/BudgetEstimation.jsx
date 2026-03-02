import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Car, Bus, Train, Plane, MapPin, Ticket, Plus, Trash2, Calculator, AlertCircle } from 'lucide-react';
import API_BASE from '../config/api';

const transportIcons = {
    car: <Car size={20} />,
    bus: <Bus size={20} />,
    train: <Train size={20} />,
    flight: <Plane size={20} />
};

export default function BudgetEstimation() {
    const [budget, setBudget] = useState('');
    const [transportMode, setTransportMode] = useState('car');

    // Location Search State
    const [originSearch, setOriginSearch] = useState('');
    const [originCoords, setOriginCoords] = useState(null);
    const [originResults, setOriginResults] = useState([]);
    const [destSearch, setDestSearch] = useState('');
    const [destCoords, setDestCoords] = useState(null);
    const [destResults, setDestResults] = useState([]);

    const [places, setPlaces] = useState([{ name: '', hasTicket: false, ticketPrice: '', results: [] }]);
    const [estimationData, setEstimationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddPlace = () => {
        setPlaces([...places, { name: '', hasTicket: false, ticketPrice: '', results: [] }]);
    };

    const handleRemovePlace = (index) => {
        const newPlaces = places.filter((_, i) => i !== index);
        setPlaces(newPlaces);
    };

    const handlePlaceChange = (index, field, value) => {
        const newPlaces = [...places];
        newPlaces[index][field] = value;
        setPlaces(newPlaces);
    };

    // Helper for places search using the new backend endpoint
    const searchPlacesForIndex = async (query, index) => {
        if (query.length < 3) {
            handlePlaceChange(index, 'results', []);
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/search-places?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            handlePlaceChange(index, 'results', data);
        } catch (err) {
            console.error(err);
        }
    };

    // Helper for location search
    const searchLocation = async (query, setResults) => {
        if (query.length < 3) {
            setResults([]);
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Debounced search logic could be added here, using basic onBlur/onChange for now

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setEstimationData(null);

        // Required validation
        if (!originCoords && originSearch.trim() !== '') {
            setError("Please select a valid origin from the dropdown.");
            setLoading(false);
            return;
        }
        if (!destCoords && destSearch.trim() !== '') {
            setError("Please select a valid destination from the dropdown.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/estimate-budget`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    budget: parseFloat(budget) || 0,
                    transport_mode: transportMode,
                    origin_coords: originCoords ? [parseFloat(originCoords.lon), parseFloat(originCoords.lat)] : null,
                    dest_coords: destCoords ? [parseFloat(destCoords.lon), parseFloat(destCoords.lat)] : null,
                    places: places.filter(p => p.name.trim() !== '')
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to estimate budget. Please try again.');
            }

            const data = await response.json();
            setEstimationData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1.5rem 80px', minHeight: '100vh', color: 'white' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                        padding: '1rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                        <IndianRupee size={28} color="#34d399" />
                    </div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }} className="gradient-text">Budget Estimation</h1>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>Plan your trip expenses and make sure you stay within budget.</p>
            </motion.div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Total Budget */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                        Available Budget (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                        <IndianRupee size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#34d399' }} />
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 5000"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Transport & Distance */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                        Travel Details
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {Object.entries({ car: 'Car / Taxi', bus: 'Bus', train: 'Train', flight: 'Flight' }).map(([key, label]) => (
                            <button
                                type="button"
                                key={key}
                                onClick={() => setTransportMode(key)}
                                style={{
                                    flex: '1 1 45%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: transportMode === key ? '1px solid #c4b5fd' : '1px solid rgba(255,255,255,0.1)',
                                    background: transportMode === key ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                    color: transportMode === key ? 'white' : 'rgba(255,255,255,0.7)',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                            >
                                {transportIcons[key]} {label}
                            </button>
                        ))}
                    </div>

                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                        Start Location
                    </label>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                        <input
                            type="text"
                            placeholder="e.g. Coimbatore, Tamil Nadu"
                            value={originSearch}
                            onChange={(e) => {
                                setOriginSearch(e.target.value);
                                setOriginCoords(null);
                                searchLocation(e.target.value, setOriginResults);
                            }}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 2.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        {/* Autocomplete Dropdown */}
                        {originResults.length > 0 && (
                            <div style={{ position: 'absolute', zIndex: 10, width: '100%', background: '#1e1e2d', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', overflow: 'hidden' }}>
                                {originResults.map((res, i) => (
                                    <div
                                        key={i}
                                        style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}
                                        onClick={() => {
                                            setOriginSearch(res.display_name);
                                            setOriginCoords({ lat: res.lat, lon: res.lon });
                                            setOriginResults([]);
                                        }}
                                    >
                                        {res.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                        End Location
                    </label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                        <input
                            type="text"
                            placeholder="e.g. Chennai, Tamil Nadu"
                            value={destSearch}
                            onChange={(e) => {
                                setDestSearch(e.target.value);
                                setDestCoords(null);
                                searchLocation(e.target.value, setDestResults);
                            }}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 2.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        {/* Autocomplete Dropdown */}
                        {destResults.length > 0 && (
                            <div style={{ position: 'absolute', zIndex: 10, width: '100%', background: '#1e1e2d', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', overflow: 'hidden' }}>
                                {destResults.map((res, i) => (
                                    <div
                                        key={i}
                                        style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}
                                        onClick={() => {
                                            setDestSearch(res.display_name);
                                            setDestCoords({ lat: res.lat, lon: res.lon });
                                            setDestResults([]);
                                        }}
                                    >
                                        {res.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Places to Visit */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                            Places to Visit
                        </label>
                        <button
                            type="button"
                            onClick={handleAddPlace}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'transparent',
                                border: 'none',
                                color: '#c4b5fd',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}
                        >
                            <Plus size={16} /> Add Place
                        </button>
                    </div>

                    {places.map((place, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                marginBottom: '1rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                                        <input
                                            type="text"
                                            placeholder="Place Name (e.g. Taj Mahal)"
                                            value={place.name}
                                            onChange={(e) => {
                                                handlePlaceChange(index, 'name', e.target.value);
                                                searchPlacesForIndex(e.target.value, index);
                                            }}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'white',
                                                outline: 'none',
                                                fontSize: '0.9rem'
                                            }}
                                        />

                                        {/* Autocomplete Dropdown for Places */}
                                        {place.results && place.results.length > 0 && (
                                            <div style={{ position: 'absolute', zIndex: 10, width: '100%', background: '#1e1e2d', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', overflow: 'hidden' }}>
                                                {place.results.slice(0, 5).map((res, i) => (
                                                    <div
                                                        key={i}
                                                        style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}
                                                        onClick={() => {
                                                            const newPlaces = [...places];
                                                            newPlaces[index].name = res.name || res.full_address.split(',')[0];
                                                            newPlaces[index].results = [];

                                                            // Auto-fill ticket info if available from OSM
                                                            if (res.has_fee) {
                                                                newPlaces[index].hasTicket = true;
                                                                if (res.ticket_price > 0) {
                                                                    newPlaces[index].ticketPrice = res.ticket_price.toString();
                                                                }
                                                            }
                                                            setPlaces(newPlaces);
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 600 }}>{res.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{res.full_address}</div>
                                                        {res.has_fee && (
                                                            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>
                                                                Ticket Fee found {res.ticket_price > 0 ? `(Approx ₹${res.ticket_price})` : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <input
                                            type="checkbox"
                                            checked={place.hasTicket}
                                            onChange={(e) => handlePlaceChange(index, 'hasTicket', e.target.checked)}
                                            style={{ accentColor: '#c4b5fd' }}
                                        />
                                        Requires Entry Ticket?
                                    </label>

                                    {place.hasTicket && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '0.75rem', position: 'relative' }}>
                                            <Ticket size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Expected Ticket Price (₹)"
                                                value={place.ticketPrice}
                                                onChange={(e) => handlePlaceChange(index, 'ticketPrice', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    outline: 'none',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {places.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePlace(index)}
                                        style={{
                                            padding: '0.75rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#f87171',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: loading ? 0.7 : 1,
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                    }}
                >
                    <Calculator size={20} />
                    {loading ? 'Calculating...' : 'Estimate Budget'}
                </button>
            </form>

            {error && (
                <div style={{ color: '#fca5a5', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {estimationData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '2rem', border: `1px solid ${estimationData.is_over_budget ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}
                >
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', textAlign: 'center', color: estimationData.is_over_budget ? '#fca5a5' : '#6ee7b7' }}>
                        {estimationData.is_over_budget ? "You're Over Budget!" : "You're Within Budget!"}
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Total Budget:</span>
                        <span style={{ fontWeight: 600 }}>₹{estimationData.budget_available}</span>
                    </div>

                    {estimationData.actual_distance_km > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Calculated Route Distance:</span>
                            <span style={{ color: '#818cf8', fontWeight: 500 }}>{estimationData.actual_distance_km} km</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Transport Cost:</span>
                        <span>₹{estimationData.transport_cost}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Tickets Cost:</span>
                        <span>₹{estimationData.tickets_cost}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Miscellaneous (10%):</span>
                        <span>₹{estimationData.misc_cost}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>
                        <span>Total Estimated:</span>
                        <span style={{ color: estimationData.is_over_budget ? '#fca5a5' : 'white' }}>₹{estimationData.total_estimated_cost}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
