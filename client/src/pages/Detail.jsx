import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, Clock, DollarSign, Users, ExternalLink } from 'lucide-react';
import MapComponent from '../components/MapView';
import { motion } from 'framer-motion';

function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/places/${id}`)
            .then(res => res.json())
            .then(data => {
                setPlace(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
            Loading...
        </div>
    );
    if (!place) return <div className="container" style={{ color: 'white' }}>Place not found</div>;

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div className="glass-panel" style={{
                position: 'fixed',
                top: '1rem',
                left: '1rem',
                right: '1rem',
                maxWidth: 'calc(100% - 2rem)',
                margin: '0 auto',
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
                <h1 className="text-lg font-bold" style={{ color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {place.name}
                </h1>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ paddingTop: '80px' }}
            >
                {place.image_url && (
                    <div style={{ width: '100%', height: '300px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--bg-dark) 100%)', zIndex: 1 }} />
                        <img
                            src={place.image_url}
                            alt={place.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                <div className="container" style={{ position: 'relative', zIndex: 2, marginTop: place.image_url ? '-60px' : '0' }}>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: 'white', marginBottom: '0.5rem' }}>{place.name}</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{place.description}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Info Cards */}
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '12px' }}>
                                    <MapPin className="text-main" size={20} style={{ color: '#818cf8' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Location</p>
                                    <p className="text-sm" style={{ color: 'white' }}>{place.location}</p>
                                </div>
                                <a href={place.map_link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem', borderRadius: '12px' }}>
                                    <ExternalLink size={18} />
                                </a>
                            </div>

                            {/* Embedded Map */}
                            <div style={{ marginTop: '1.5rem', height: '250px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <MapComponent lat={place.latitude} lng={place.longitude} name={place.name} />
                            </div>
                        </div>

                        {place.phone && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <div className="flex items-center gap-4">
                                    <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '10px', borderRadius: '12px' }}>
                                        <Phone size={20} style={{ color: '#f472b6' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Phone</p>
                                        <p className="text-sm" style={{ color: 'white' }}>{place.phone}</p>
                                    </div>
                                    <a href={`tel:${place.phone}`} className="btn" style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>
                                        Call
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <DollarSign style={{ color: 'var(--text-muted)' }} />
                                    <div>
                                        <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Price / Fee</p>
                                        <p className="text-sm" style={{ color: 'white' }}>{place.price_fee}</p>
                                    </div>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <div className="flex items-center gap-4">
                                    <Clock style={{ color: 'var(--text-muted)' }} />
                                    <div>
                                        <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Opening Hours</p>
                                        <p className="text-sm" style={{ color: 'white' }}>{place.opening_hours}</p>
                                    </div>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <div className="flex items-center gap-4">
                                    <Users style={{ color: 'var(--text-muted)' }} />
                                    <div>
                                        <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Crowd Level</p>
                                        <p className="text-sm" style={{ color: 'white' }}>{place.crowd_level}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Detail;
