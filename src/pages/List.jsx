import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function ListPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('Places');

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

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
            Loading...
        </div>
    );

    return (
        <div style={{ paddingBottom: '2rem' }}>
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
                {places.map((place, index) => (
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
                                gap: '1rem'
                            }}>
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
                {places.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No places found in this category.</p>}
            </div>
        </div>
    );
}

export default ListPage;
