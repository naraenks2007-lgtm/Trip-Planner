import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Bus, Utensils, Map as MapIcon, Search, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const iconMap = {
    'car': Car,
    'bus': Bus,
    'utensils': Utensils,
    'map-marked-alt': MapIcon
};

function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/categories')
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
            Loading content...
        </div>
    );

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Header / Navbar */}
            <div className="glass-panel" style={{
                position: 'sticky',
                top: '1rem',
                margin: '0 1rem',
                zIndex: 50,
                padding: '0.8rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '6px', borderRadius: '8px' }}>
                        <MapPin size={20} color="white" />
                    </div>
                    <h1 className="text-lg font-bold" style={{ color: 'white' }}>TripPlanner</h1>
                </div>

                <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <User size={18} />
                    </div>
                </button>
            </div>

            {/* Hero Section */}
            <div style={{ padding: '2rem 1.5rem 1rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0.5rem' }}>
                        Discover <br /> New Adventures
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Explore the world's most beautiful places.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search for places..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '20px',
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
                            <Link to={`/category/${cat.id}`} key={cat.id} style={{ textDecoration: 'none' }}>
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
