import { useState, useEffect } from 'react';

/**
 * Custom hook for managing favorites in localStorage
 * @returns {Object} - { favorites, addFavorite, removeFavorite, isFavorite }
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('trip-planner-favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (error) {
                console.error('Error loading favorites:', error);
                setFavorites([]);
            }
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('trip-planner-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (placeId) => {
        setFavorites(prev => {
            if (!prev.includes(placeId)) {
                return [...prev, placeId];
            }
            return prev;
        });
    };

    const removeFavorite = (placeId) => {
        setFavorites(prev => prev.filter(id => id !== placeId));
    };

    const isFavorite = (placeId) => {
        return favorites.includes(placeId);
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite
    };
}
