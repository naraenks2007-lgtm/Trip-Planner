import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Map, Heart, User, LogOut, Settings, Compass, Car, Bus, Utensils, Map as MapIcon, Train, Plane, Hotel } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 60,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          padding: '0.5rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 55,
              backdropFilter: 'blur(2px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          zIndex: 60,
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}
      >
        {/* Logo Area */}
        <div style={{ marginBottom: '2rem', paddingTop: '1rem', paddingLeft: '0.5rem' }}>
          <h2 className="text-2xl font-bold gradient-text">TripPlanner</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your journey starts here</p>
        </div>

        {/* Main Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              background: location.pathname === '/' ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: '1px solid',
              borderColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontWeight: location.pathname === '/' ? 600 : 400
            }}
          >
            <Home size={20} color={location.pathname === '/' ? '#c4b5fd' : 'rgba(255,255,255,0.7)'} />
            Home
          </button>

          <button
            onClick={() => navigate('/favorites')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              background: location.pathname === '/favorites' ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: '1px solid',
              borderColor: location.pathname === '/favorites' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontWeight: location.pathname === '/favorites' ? 600 : 400
            }}
          >
            <Heart size={20} color={location.pathname === '/favorites' ? '#c4b5fd' : 'rgba(255,255,255,0.7)'} />
            Favorites
          </button>

          <button
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              background: location.pathname === '/profile' ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: '1px solid',
              borderColor: location.pathname === '/profile' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontWeight: location.pathname === '/profile' ? 600 : 400
            }}
          >
            <User size={20} color={location.pathname === '/profile' ? '#c4b5fd' : 'rgba(255,255,255,0.7)'} />
            Profile
          </button>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              paddingLeft: '0.5rem'
            }}>
              Explore
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Compass;
                const isActive = location.pathname === `/category/${cat.id}`;
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      color: 'rgba(255,255,255,0.9)',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      fontSize: '0.95rem'
                    }}
                  >
                    <Icon size={18} color={isActive ? '#c4b5fd' : 'rgba(255,255,255,0.6)'} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Logout / Footer */}
        <button
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            color: '#fca5a5',
            marginTop: 'auto',
            width: '100%',
            textAlign: 'left',
            transition: 'all 0.2s',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.div>
    </>
  );
};

export default Sidebar;
