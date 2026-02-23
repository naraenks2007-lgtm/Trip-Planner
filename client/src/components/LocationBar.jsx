import { useState } from 'react';
import { Navigation, Search, MapPin, X, Loader } from 'lucide-react';

/**
 * LocationBar – GPS + manual city entry component.
 *
 * Props:
 *   onLocationSelect(info) – called with { lat, lon, label } or null (reset)
 *   activeLabel            – currently active location label (for display)
 */
function LocationBar({ onLocationSelect, activeLabel }) {
    const [cityInput, setCityInput] = useState('');
    const [gpsLoading, setGpsLoading] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);
    const [error, setError] = useState('');

    // ── GPS ──────────────────────────────────────────────────────────────────
    const handleGPS = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setGpsLoading(true);
        setError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGpsLoading(false);
                onLocationSelect({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    label: 'Your Location',
                    cityName: null,          // GPS — use /api/nearby-places
                });
            },
            (err) => {
                setGpsLoading(false);
                setError('GPS error: ' + err.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    // ── Manual city search ───────────────────────────────────────────────────
    const handleCitySearch = async (e) => {
        e?.preventDefault();
        const q = cityInput.trim();
        if (!q) return;
        setCityLoading(true);
        setError('');
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
                { headers: { 'User-Agent': 'TripPlannerApp/1.0' } }
            );
            const data = await res.json();
            if (!data.length) {
                setError(`"${q}" not found. Try a different name.`);
            } else {
                onLocationSelect({
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    label: data[0].display_name.split(',').slice(0, 2).join(', '),
                    cityName: q,             // original typed text → use /api/places-by-city
                });
                setCityInput('');
            }
        } catch {
            setError('Geocoding failed. Please try again.');
        } finally {
            setCityLoading(false);
        }
    };

    // ── Reset ────────────────────────────────────────────────────────────────
    const handleReset = () => {
        setError('');
        setCityInput('');
        onLocationSelect(null);
    };

    // ── UI helpers ───────────────────────────────────────────────────────────
    const btnBase = {
        padding: '0.55rem 1rem',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            {/* Active location banner */}
            {activeLabel && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.6rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#6ee7b7',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                }}>
                    <MapPin size={13} />
                    Showing near: {activeLabel}
                    <button
                        onClick={handleReset}
                        title="Show default places"
                        style={{
                            marginLeft: 'auto',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6ee7b7',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Controls row */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* GPS button */}
                <button
                    onClick={handleGPS}
                    disabled={gpsLoading}
                    style={{
                        ...btnBase,
                        background: gpsLoading
                            ? 'rgba(16,185,129,0.1)'
                            : activeLabel === 'Your Location'
                                ? 'rgba(16,185,129,0.2)'
                                : 'rgba(255,255,255,0.05)',
                        border: activeLabel === 'Your Location'
                            ? '1px solid rgba(16,185,129,0.5)'
                            : '1px solid rgba(255,255,255,0.12)',
                        cursor: gpsLoading ? 'wait' : 'pointer',
                    }}
                >
                    {gpsLoading
                        ? <Loader size={15} className="spin" />
                        : <Navigation size={15} color={activeLabel === 'Your Location' ? '#10b981' : 'white'} />
                    }
                    {gpsLoading ? 'Locating…' : 'Use My Location'}
                </button>

                {/* Manual city input */}
                <form
                    onSubmit={handleCitySearch}
                    style={{ display: 'flex', gap: '0.4rem', flex: 1, minWidth: '200px' }}
                >
                    <input
                        type="text"
                        placeholder="Enter city / area (e.g. Coimbatore)"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none',
                            backdropFilter: 'blur(10px)',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={cityLoading || !cityInput.trim()}
                        style={{
                            ...btnBase,
                            background: cityInput.trim()
                                ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
                                : 'rgba(255,255,255,0.05)',
                            opacity: cityInput.trim() ? 1 : 0.5,
                            cursor: cityInput.trim() && !cityLoading ? 'pointer' : 'not-allowed',
                        }}
                    >
                        {cityLoading ? <Loader size={15} className="spin" /> : <Search size={15} />}
                        {cityLoading ? 'Searching…' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Error */}
            {error && (
                <p style={{ color: '#fca5a5', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default LocationBar;
