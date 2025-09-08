import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
      const token = localStorage.getItem('authToken');
      await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ favorites }),
      });
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