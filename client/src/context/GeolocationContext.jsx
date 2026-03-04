import React, { createContext, useContext, useState, useEffect } from 'react';

const GeolocationContext = createContext(null);

export const GeolocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [watchId, setWatchId] = useState(null);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        setError(null);
        localStorage.setItem('gps_tracking_active', 'true');

        // Clear existing watch if any
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        setWatchId(id);
    };

    const stopLocation = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        localStorage.removeItem('gps_tracking_active');
        setLocation(null);
        setLoading(false);
    };

    // Auto-resume tracking on mount if it was previously active
    useEffect(() => {
        const isActive = localStorage.getItem('gps_tracking_active') === 'true';
        if (isActive && watchId === null) {
            requestLocation();
        }

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []); // Run once on mount

    const value = {
        location,
        error,
        loading,
        requestLocation,
        stopLocation,
        isTracking: watchId !== null
    };

    return (
        <GeolocationContext.Provider value={value}>
            {children}
        </GeolocationContext.Provider>
    );
};

export const useGeolocationContext = () => {
    const context = useContext(GeolocationContext);
    if (!context) {
        throw new Error('useGeolocationContext must be used within a GeolocationProvider');
    }
    return context;
};
