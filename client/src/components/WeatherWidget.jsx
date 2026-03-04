import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, Wind, Loader2 } from 'lucide-react';
import API_BASE from '../config/api';

const WeatherWidget = ({ lat, lon }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lat || !lon) {
            setLoading(false);
            return;
        }

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}`);
                if (!res.ok) throw new Error('Weather unavailable');
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lon]);

    if (!lat || !lon) return null;

    if (loading) {
        return (
            <div className="glass-card flex items-center justify-center p-3 gap-2 text-sm" style={{ padding: '0.75rem', borderRadius: '12px' }}>
                <Loader2 className="animate-spin text-muted" size={16} />
                <span className="text-muted">Loading weather...</span>
            </div>
        );
    }

    if (error || !weather?.current) return null;

    const { temperature_2m, weather_code } = weather.current;

    // Map WMO weather codes to icons and descriptions
    // https://open-meteo.com/en/docs
    const getWeatherDetails = (code) => {
        if (code === 0) return { icon: Sun, color: '#fbbf24', text: 'Clear' };
        if (code >= 1 && code <= 3) return { icon: Cloud, color: '#9ca3af', text: 'Cloudy' };
        if (code >= 45 && code <= 48) return { icon: Wind, color: '#d1d5db', text: 'Foggy' };
        if (code >= 51 && code <= 67) return { icon: CloudRain, color: '#60a5fa', text: 'Rain' };
        if (code >= 71 && code <= 77) return { icon: CloudSnow, color: '#e5e7eb', text: 'Snow' };
        if (code >= 80 && code <= 82) return { icon: CloudRain, color: '#3b82f6', text: 'Showers' };
        if (code >= 95 && code <= 99) return { icon: CloudLightning, color: '#f59e0b', text: 'Thunderstorm' };
        return { icon: Sun, color: '#fbbf24', text: 'Clear' };
    };

    const details = getWeatherDetails(weather_code);
    const Icon = details.icon;

    return (
        <div className="glass-card" style={{
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={20} color={details.color} />
            </div>
            <div className="flex flex-col">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>
                        {Math.round(temperature_2m)}°C
                    </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {details.text}
                </span>
            </div>
        </div>
    );
};

export default WeatherWidget;
