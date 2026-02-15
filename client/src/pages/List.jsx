import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Heart, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import StarRating from '../components/StarRating';
import { useGeolocation, calculateDistance, formatDistance } from '../hooks/useGeolocation';

function ListPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('Places');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [crowdFilter, setCrowdFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [ratingFilter, setRatingFilter] = useState('all');
    const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { location, requestLocation, loading: locationLoading } = useGeolocation();

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/categories/${slug}/places`)
            .then(res => res.json())
            .then(data => {
                setPlaces(data);
                if (data.length > 0) setCategoryName(data[0].category_name);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    // Calculate distances and filter places
    const placesWithDistance = useMemo(() => {
        if (!location || !places.length) return places;

        return places.map(place => ({
            ...place,
            distance: place.latitude && place.longitude
                ? calculateDistance(
                    location.latitude,
                    location.longitude,
                    place.latitude,
                    place.longitude
                )
                : null
        }));
    }, [places, location]);

    // Filter places based on search query, price, crowd level, and rating
    const filteredPlaces = placesWithDistance
        .filter(place => place.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(place => {
            if (priceFilter === 'all') return true;
            if (priceFilter === 'free') return place.price_fee?.toLowerCase().includes('free');
            if (priceFilter === 'paid') return !place.price_fee?.toLowerCase().includes('free');
            return true;
        })
        .filter(place => {
            if (crowdFilter === 'all') return true;
            return place.crowd_level?.toLowerCase().includes(crowdFilter.toLowerCase());
        })
        .filter(place => {
            if (ratingFilter === 'all') return true;
            const rating = place.rating || 0;
            if (ratingFilter === '4+') return rating >= 4.0;
            if (ratingFilter === '3+') return rating >= 3.0;
            if (ratingFilter === '2+') return rating >= 2.0;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'distance' && a.distance && b.distance) return a.distance - b.distance;
            if (sortBy === 'crowd-low') {
                const order = { 'low': 1, 'medium': 2, 'moderate': 2, 'high': 3 };
                const aLevel = order[a.crowd_level?.toLowerCase()] || 2;
                const bLevel = order[b.crowd_level?.toLowerCase()] || 2;
                return aLevel - bLevel;
            }
            if (sortBy === 'crowd-high') {
                const order = { 'low': 1, 'medium': 2, 'moderate': 2, 'high': 3 };
                const aLevel = order[a.crowd_level?.toLowerCase()] || 2;
                const bLevel = order[b.crowd_level?.toLowerCase()] || 2;
                return bLevel - aLevel;
            }
            return 0;
        });

    // Skeleton loader component
    const SkeletonCard = () => (
        <div className="glass-card" style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '1rem',
            gap: '1rem'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
            }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                    height: '20px',
                    width: '60%',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                }} />
                <div style={{
                    height: '16px',
                    width: '40%',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    animationDelay: '0.1s'
                }} />
            </div>
        </div>
    );

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
                <h1 className="text-lg font-bold" style={{ color: 'white', margin: 0 }}>{categoryName}</h1>
            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search places..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                </div>

                {/* Filter and Sort Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Price Filter */}
                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <option value="all" style={{ background: '#1f2937' }}>All Prices</option>
                        <option value="free" style={{ background: '#1f2937' }}>Free</option>
                        <option value="paid" style={{ background: '#1f2937' }}>Paid</option>
                    </select>

                    {/* Crowd Filter */}
                    <select
                        value={crowdFilter}
                        onChange={(e) => setCrowdFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <option value="all" style={{ background: '#1f2937' }}>All Crowds</option>
                        <option value="low" style={{ background: '#1f2937' }}>Low</option>
                        <option value="medium" style={{ background: '#1f2937' }}>Medium</option>
                        <option value="moderate" style={{ background: '#1f2937' }}>Moderate</option>
                        <option value="high" style={{ background: '#1f2937' }}>High</option>
                    </select>

                    {/* Rating Filter */}
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <option value="all" style={{ background: '#1f2937' }}>All Ratings</option>
                        <option value="4+" style={{ background: '#1f2937' }}>4+ Stars</option>
                        <option value="3+" style={{ background: '#1f2937' }}>3+ Stars</option>
                        <option value="2+" style={{ background: '#1f2937' }}>2+ Stars</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <option value="name" style={{ background: '#1f2937' }}>Name (A-Z)</option>
                        <option value="name-desc" style={{ background: '#1f2937' }}>Name (Z-A)</option>
                        <option value="rating" style={{ background: '#1f2937' }}>Highest Rated</option>
                        {location && <option value="distance" style={{ background: '#1f2937' }}>Nearest First</option>}
                        <option value="crowd-low" style={{ background: '#1f2937' }}>Crowd (Low to High)</option>
                        <option value="crowd-high" style={{ background: '#1f2937' }}>Crowd (High to Low)</option>
                    </select>

                    {/* Location Button */}
                    <button
                        onClick={requestLocation}
                        disabled={locationLoading}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: location ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: locationLoading ? 'wait' : 'pointer',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Navigation size={16} color={location ? '#10b981' : 'white'} />
                        {locationLoading ? 'Getting location...' : location ? 'Location On' : 'Use My Location'}
                    </button>

                    {/* Active filter count */}
                    {(priceFilter !== 'all' || crowdFilter !== 'all' || ratingFilter !== 'all') && (
                        <span style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#c4b5fd',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}>
                            {[priceFilter !== 'all', crowdFilter !== 'all', ratingFilter !== 'all'].filter(Boolean).length} active
                        </span>
                    )}
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                )}

                {/* Places list */}
                {!loading && filteredPlaces.map((place, index) => (
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
                                        if (isFavorite(place.id)) {
                                            removeFavorite(place.id);
                                        } else {
                                            addFavorite(place.id);
                                        }
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
                                        fill={isFavorite(place.id) ? '#ef4444' : 'none'}
                                        color={isFavorite(place.id) ? '#ef4444' : 'white'}
                                    />
                                </button>
                                {place.image_url ? (
                                    <img
                                        src={place.image_url}
                                        alt={place.name}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '12px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : null}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '12px',
                                    background: place.image_url
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                                    display: place.image_url ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MapPin size={24} color="var(--text-muted)" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 className="font-bold" style={{ color: 'var(--text-main)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</h3>

                                    {/* Rating */}
                                    {place.rating && (
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <StarRating rating={place.rating} size={14} />
                                        </div>
                                    )}

                                    <p className="text-sm" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{place.price_fee || 'Free'}</p>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {/* Crowd Level */}
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

                                        {/* Distance */}
                                        {place.distance && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                background: 'rgba(59, 130, 246, 0.2)',
                                                color: '#93c5fd',
                                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                <Navigation size={10} />
                                                {formatDistance(place.distance)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))
                }

                {/* Empty states */}
                {!loading && filteredPlaces.length === 0 && searchQuery && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                        No places found matching "{searchQuery}"
                    </p>
                )}
                {!loading && places.length === 0 && !searchQuery && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                        No places found in this category.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ListPage;
