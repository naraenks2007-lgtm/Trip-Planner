import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';

function Favorites() {
    const navigate = useNavigate();
    const { favorites, removeFavorite, isFavorite } = useFavorites();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all places and filter by favorites
        const fetchFavorites = async () => {
            if (favorites.length === 0) {
                setLoading(false);
                return;
            }

            try {
                // Fetch place details for each favorite
                const placePromises = favorites.map(id =>
                    fetch(`http://127.0.0.1:5000/api/places/${id}`)
                        .then(res => res.json())
                        .catch(() => null)
                );

                const results = await Promise.all(placePromises);
                setPlaces(results.filter(p => p !== null));
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [favorites]);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Added top padding for mobile menu */}
            <div style={{ height: '60px' }}></div>
            <div className="glass-panel" style={{
                position: 'sticky',
                top: '1rem',
                margin: '0 1rem 1.5rem',
                zIndex: 50,
                padding: '0.8rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderRadius: '50px',
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'white', display: 'flex' }}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold" style={{ color: 'white', margin: 0 }}>Favorites</h1>
            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                        Loading favorites...
                    </p>
                )}

                {!loading && places.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <Heart size={64} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>No favorites yet</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Start exploring and add places to your favorites!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '0.75rem 2rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Explore Places
                        </button>
                    </div>
                )}

                {!loading && places.map((place, index) => (
                    <motion.div
                        key={place.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/place/${place.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass-card" style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '1rem',
                                gap: '1rem',
                                position: 'relative'
                            }}>
                                {/* Favorite button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFavorite(place.id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        right: '0.75rem',
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        zIndex: 10
                                    }}
                                >
                                    <Heart
                                        size={18}
                                        fill="#ef4444"
                                        color="#ef4444"
                                    />
                                </button>

                                {place.image_url ? (
                                    <img
                                        src={place.image_url}
                                        alt={place.name}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '12px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <MapPin size={24} color="var(--text-muted)" />
                                    </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{place.price_fee || 'Free'}</p>
                                    {place.crowd_level && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: place.crowd_level.includes('High') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                            color: place.crowd_level.includes('High') ? '#fca5a5' : '#6ee7b7',
                                            border: `1px solid ${place.crowd_level.includes('High') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                                        }}>
                                            {place.crowd_level}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;
