import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Bus, Utensils, Map as MapIcon, Search, User, MapPin, Heart, Train, Plane, Navigation, Hotel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGeolocation } from '../hooks/useGeolocation';
import LottieAnimation from '../components/LottieAnimation';
import API_BASE from '../config/api';

const iconMap = {
    'car': Car,
    'bus': Bus,
    'utensils': Utensils,
    'map-marked-alt': MapIcon,
    'train': Train,
    'plane': Plane,
    'hotel': Hotel
};

function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startLocation, setStartLocation] = useState('');
    const [isRoutingMode, setIsRoutingMode] = useState(false);
    const { location, requestLocation, stopLocation, error: locationError, isTracking } = useGeolocation();

    // Handle search and route finding
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        if (isRoutingMode) {
            // Direction search
            let origin = startLocation;
            if (location && (!startLocation || startLocation === 'My Location')) {
                origin = `${location.latitude},${location.longitude}`;
            }

            if (!origin) {
                // If no start location, just search the destination
                const query = encodeURIComponent(searchQuery);
                const mapsUrl = `https://www.google.com/maps/search/${query}`;
                window.open(mapsUrl, '_blank');
                return;
            }

            const destination = encodeURIComponent(searchQuery);
            const mapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
            window.open(mapsUrl, '_blank');
        } else {
            // Normal search
            const query = encodeURIComponent(searchQuery);
            const mapsUrl = `https://www.google.com/maps/search/${query}`;
            window.open(mapsUrl, '_blank');
        }
    };

    // Auto-fill start location when GPS is enabled
    useEffect(() => {
        if (location) {
            setStartLocation('My Location');
            setIsRoutingMode(true);
        }
    }, [location]);

    const toggleGPS = () => {
        if (isTracking) {
            stopLocation();
            setStartLocation('');
        } else {
            requestLocation();
        }
    };

    useEffect(() => {
        fetch(`${API_BASE}/api/categories`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch categories", err);
                setLoading(false);
            });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
            <LottieAnimation
                animationData="https://lottie.host/embed/8b7d4d80-8633-4796-9f1e-360341767667/rFz8k8z8gE.json"
                width="200px"
                height="200px"
            />
            {!loading && "Loading..."} {/* Fallback if lottie fails visually */}
        </div>
    );

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Header / Navbar */}
            {/* Header / Navbar - REMOVED, replaced by Sidebar */}
            {/* Added top padding to prevent content from being hidden behind the mobile menu button */}
            <div style={{ height: '60px' }}></div>

            {/* Hero Section */}
            <div style={{ padding: '1rem 1.5rem 0rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ flex: 1 }}
                >
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0.5rem' }}>
                        Discover <br /> New Adventures
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Explore the world's most beautiful places with us.
                    </p>
                </motion.div>

                {/* Lottie Animation Hero */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', maxWidth: '180px' }}
                >
                    {/* Placeholder for Lottie */}
                    <div style={{
                        width: '100%',
                        height: '150px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <Plane size={48} color="#c4b5fd" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.75rem', color: '#c4b5fd' }}>Travel More</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div style={{ padding: '0 1.5rem' }}>

                {/* Search Bar with Route Finding */}
                <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>

                    {/* Routing Inputs */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        padding: '1rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        marginBottom: '1rem'
                    }}>
                        {/* Start Location Input (only in routing mode) */}
                        <motion.div
                            initial={false}
                            animate={{ height: isRoutingMode ? 'auto' : 0, opacity: isRoutingMode ? 1 : 0 }}
                            style={{ overflow: 'hidden', marginBottom: isRoutingMode ? '1rem' : 0 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <MapPin size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                                <input
                                    type="text"
                                    placeholder="Start Location (or use GPS)"
                                    value={startLocation}
                                    onChange={(e) => setStartLocation(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Destination Input */}
                        <div style={{ position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search destination..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {/* GPS Toggle */}
                        <button
                            type="button"
                            onClick={toggleGPS}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: isTracking ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                background: isTracking ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                minWidth: '140px'
                            }}
                        >
                            <Navigation size={18} color={isTracking ? '#10b981' : 'white'} />
                            {isTracking ? 'GPS Enabled' : 'Enable GPS'}
                        </button>

                        {/* Route/Search Mode Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsRoutingMode(!isRoutingMode)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: isRoutingMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                minWidth: '140px'
                            }}
                        >
                            <MapIcon size={18} color={isRoutingMode ? '#818cf8' : 'white'} />
                            {isRoutingMode ? 'Routing On' : 'Route Mode'}
                        </button>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!searchQuery.trim()}
                            style={{
                                flex: 2,
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: searchQuery.trim() ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                opacity: searchQuery.trim() ? 1 : 0.5,
                                minWidth: '160px'
                            }}
                        >
                            <Search size={18} />
                            {isRoutingMode ? 'Get Directions' : 'Search Only'}
                        </button>
                    </div>

                    {/* GPS Error Message */}
                    {locationError && (
                        <div style={{ marginTop: '0.5rem', color: '#fca5a5', fontSize: '0.8rem', textAlign: 'center' }}>
                            {locationError}
                        </div>
                    )}

                    {/* Accuracy/Stop hint */}
                    {isTracking && location && (
                        <div style={{ marginTop: '0.5rem', color: '#6ee7b7', fontSize: '0.8rem', textAlign: 'center' }}>
                            Live GPS Active (Accuracy: ~{Math.round(location.accuracy)}m)
                        </div>
                    )}
                </form>

                {/* Categories */}
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>Categories</h3>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem'
                    }}
                >
                    {categories.map(cat => {
                        const Icon = iconMap[cat.icon] || MapIcon;
                        return (
                            <Link to={`/category/${cat.slug}`} key={cat.id} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    variants={itemVariants}
                                    className="glass-card"
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        gap: '1rem',
                                        padding: '1.5rem'
                                    }}
                                >
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                                        padding: '1rem',
                                        borderRadius: '50%',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                    }}>
                                        <Icon size={28} />
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem' }}>{cat.name}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}

export default Home;
