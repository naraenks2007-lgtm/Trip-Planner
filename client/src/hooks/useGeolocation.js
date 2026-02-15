import { useState, useEffect } from 'react';

/**
 * Custom hook for accessing user's geolocation
 * @returns {Object} - { location: {latitude, longitude, accuracy}, error, loading, requestLocation }
 */
export function useGeolocation() {
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
        setLocation(null);
        setLoading(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    return {
        location,
        error,
        loading,
        requestLocation,
        stopLocation,
        isTracking: watchId !== null
    };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param {number} km - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export function formatDistance(km) {
    if (km < 1) {
        return `${Math.round(km * 1000)}m away`;
    } else if (km < 10) {
        return `${km.toFixed(1)}km away`;
    } else {
        return `${Math.round(km)}km away`;
    }
}
