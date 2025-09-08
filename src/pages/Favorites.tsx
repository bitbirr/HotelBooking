import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Mock hotel data - in real app, this would fetch from Xano API based on favorite IDs
  const favoriteHotels = [
    {
      id: '1',
      name: 'Ethiopian Skylight Hotel',
      location: 'Bole, Addis Ababa',
      rating: 4.8,
      price: 120,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa']
    },
    {
      id: '2',
      name: 'Blue Nile Resort',
      location: 'Lake Tana, Bahir Dar',
      rating: 4.6,
      price: 95,
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Lake View', 'Restaurant', 'WiFi', 'Garden']
    }
  ].filter(hotel => favorites.includes(hotel.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {isAuthenticated 
              ? "Your favorite hotels are synced across all your devices"
              : "Your favorites are saved locally. Sign in to sync across devices."
            }
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Heart className="h-5 w-5 text-amber-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800">Save your favorites permanently</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Sign in to sync your favorite hotels across all devices and never lose them.
                </p>
                <Link 
                  to="/login"
                  className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
                >
                  Sign in now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {favoriteHotels.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start exploring and save hotels you love by clicking the heart icon
            </p>
            <Link 
              to="/hotels"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Discover Hotels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteHotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors group"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${hotel.price}/night
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      to={`/hotel/${hotel.id}`}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => toggleFavorite(hotel.id)}
                      className="px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {favoriteHotels.length > 0 && (
          <div className="mt-8 text-center">
            <Link 
              to="/hotels"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Discover more hotels →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;