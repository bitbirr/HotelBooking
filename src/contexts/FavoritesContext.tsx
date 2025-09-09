/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../services/api';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (hotelId: string) => void;
  isFavorite: (hotelId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const localFavorites = localStorage.getItem('favorites');
    if (localFavorites) {
      setFavorites(JSON.parse(localFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Sync with backend if authenticated
    if (isAuthenticated && user) {
      syncFavoritesWithBackend();
    }
  }, [favorites, isAuthenticated, user]);

  const syncFavoritesWithBackend = async () => {
    try {
      // Sync favorites with backend - assuming POST to /favorite_hotel with favorites array
      await apiService.createFavoriteHotel({ favorites });
    } catch (error) {
      console.error('Failed to sync favorites:', error);
    }
  };

  const toggleFavorite = (hotelId: string) => {
    setFavorites(prev => {
      if (prev.includes(hotelId)) {
        return prev.filter(id => id !== hotelId);
      } else {
        return [...prev, hotelId];
      }
    });
  };

  const isFavorite = (hotelId: string) => favorites.includes(hotelId);

  const value: FavoritesContextType = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};