import { useGeolocationContext } from '../context/GeolocationContext';

/**
 * Custom hook for accessing user's geolocation (now routes to Context)
 * @returns {Object} - { location: {latitude, longitude, accuracy}, error, loading, requestLocation, stopLocation, isTracking }
 */
export function useGeolocation() {
    return useGeolocationContext();
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
