import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, LogOut, Edit2, ArrowLeft, Camera, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Profile() {
    console.log('✅ Profile component is rendering with glassmorphism!');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        upi_id: ''
    });

    // Lottie animation data for profile decoration
    const profileAnimation = {
        loop: true,
        autoplay: true,
        animationData: {
            "v": "5.7.4",
            "fr": 30,
            "ip": 0,
            "op": 60,
            "w": 200,
            "h": 200,
            "nm": "Profile Decoration",
            "ddd": 0,
            "assets": [],
            "layers": [
                {
                    "ddd": 0,
                    "ind": 1,
                    "ty": 4,
                    "nm": "Circle 1",
                    "sr": 1,
                    "ks": {
                        "o": { "a": 0, "k": 30 },
                        "r": { "a": 1, "k": [{ "t": 0, "s": [0] }, { "t": 60, "s": [360] }] },
                        "p": { "a": 0, "k": [100, 100] },
                        "a": { "a": 0, "k": [0, 0] },
                        "s": { "a": 1, "k": [{ "t": 0, "s": [100, 100] }, { "t": 30, "s": [120, 120] }, { "t": 60, "s": [100, 100] }] }
                    },
                    "ao": 0,
                    "shapes": [
                        {
                            "ty": "gr",
                            "it": [
                                {
                                    "d": 1,
                                    "ty": "el",
                                    "s": { "a": 0, "k": [80, 80] },
                                    "p": { "a": 0, "k": [0, 0] }
                                },
                                {
                                    "ty": "st",
                                    "c": { "a": 0, "k": [0.4, 0.49, 0.92, 1] },
                                    "o": { "a": 0, "k": 100 },
                                    "w": { "a": 0, "k": 3 }
                                },
                                {
                                    "ty": "tr",
                                    "p": { "a": 0, "k": [0, 0] },
                                    "a": { "a": 0, "k": [0, 0] },
                                    "s": { "a": 0, "k": [100, 100] },
                                    "r": { "a": 0, "k": 0 },
                                    "o": { "a": 0, "k": 100 }
                                }
                            ]
                        }
                    ],
                    "ip": 0,
                    "op": 60,
                    "st": 0
                }
            ]
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                phone: parsedUser.phone || '',
                upi_id: parsedUser.upi_id || ''
            });
            setLoading(false);

            // Optionally refresh profile from server
            fetch(`http://127.0.0.1:5000/api/auth/profile?user_id=${parsedUser.id}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setUser(data);
                        setFormData({
                            name: data.name || '',
                            phone: data.phone || '',
                            upi_id: data.upi_id || ''
                        });
                        localStorage.setItem('user', JSON.stringify(data));
                    }
                })
                .catch(err => console.error('Error fetching profile:', err));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('http://127.0.0.1:5000/api/auth/logout', {
                method: 'POST',
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    ...formData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 1rem',
            paddingTop: '80px', // Added top padding for mobile menu
            position: 'relative'
        }}>
            {/* Background decorations */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }} />

            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.3s'
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>My Profile</h1>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(239, 68, 68, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Profile Card - Premium Glassmorphism */}
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        borderRadius: '32px',
                        padding: '3rem',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.6s ease-out'
                    }}
                >
                    {/* Inner glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '200px',
                        background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
                        pointerEvents: 'none'
                    }} />
                    {/* Avatar Section */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '5px solid white',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}>
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={60} color="white" />
                                )}
                            </div>
                            <button style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: '3px solid white',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}>
                                <Camera size={18} />
                            </button>
                        </div>

                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {user.name || 'User'}
                        </h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>{user.email}</p>
                    </div>

                    {/* Edit Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.75rem 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0.75rem 2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name || '',
                                            phone: user.phone || '',
                                            upi_id: user.upi_id || ''
                                        });
                                    }}
                                    style={{
                                        background: '#6b7280',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0.75rem 2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Information */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Name */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '12px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                                }}>
                                    <User size={20} color="white" />
                                </div>
                                <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Full Name</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        color: '#1f2937'
                                    }}
                                />
                            ) : (
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>{user.name || 'Not set'}</p>
                            )}
                        </motion.div>

                        {/* Email */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    borderRadius: '12px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                                }}>
                                    <Mail size={20} color="white" />
                                </div>
                                <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Email Address</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>{user.email}</p>
                        </motion.div>

                        {/* Phone */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    borderRadius: '12px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                                }}>
                                    <Phone size={20} color="white" />
                                </div>
                                <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Phone Number</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        color: '#1f2937'
                                    }}
                                />
                            ) : (
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>{user.phone || 'Not set'}</p>
                            )}
                        </motion.div>

                        {/* UPI ID */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 100%)',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    borderRadius: '12px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                                }}>
                                    <CreditCard size={20} color="white" />
                                </div>
                                <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>UPI ID</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.upi_id}
                                    onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                                    placeholder="yourname@upi"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        color: '#1f2937'
                                    }}
                                />
                            ) : user.upi_id ? (
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>{user.upi_id}</p>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px dashed rgba(255, 255, 255, 0.4)',
                                        borderRadius: '8px',
                                        padding: '0.4rem 0.8rem',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    + Add UPI ID
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
