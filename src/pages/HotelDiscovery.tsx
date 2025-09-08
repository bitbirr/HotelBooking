/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Heart, Wifi, Car, Utensils, Waves } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { apiService } from '../services/api';

interface Hotel {
  id: number;
  created_at: number;
  name: string;
  location: string;
  city: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
}

const HotelDiscovery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  // Mock hotel data - in real app, this would come from Xano API
  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Ethiopian Skylight Hotel',
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      rating: 4.8,
      price: 120,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Airport Shuttle'],
      description: 'Luxury hotel in the heart of Addis Ababa near Bole International Airport'
    },
    {
      id: '2',
      name: 'Blue Nile Resort',
      location: 'Lake Tana, Bahir Dar',
      city: 'Bahir Dar',
      rating: 4.6,
      price: 95,
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Lake View', 'Restaurant', 'Garden', 'Boat Tours'],
      description: 'Beautiful lakeside resort with stunning views of Lake Tana'
    },
    {
      id: '3',
      name: 'Gondar Castle Lodge',
      location: 'Historic District, Gondar',
      city: 'Gondar',
      rating: 4.4,
      price: 85,
      image: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Historic View', 'Restaurant', 'Tour Desk'],
      description: 'Heritage hotel with views of the famous Gondar castles'
    },
    {
      id: '4',
      name: 'Axum Heritage Hotel',
      location: 'Archaeological Zone, Axum',
      city: 'Axum',
      rating: 4.3,
      price: 75,
      image: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Restaurant', 'Cultural Tours', 'Garden'],
      description: 'Experience ancient Axumite history in comfort'
    },
    {
      id: '5',
      name: 'Lalibela Mountain View',
      location: 'Church Complex, Lalibela',
      city: 'Lalibela',
      rating: 4.5,
      price: 110,
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Mountain View', 'Restaurant', 'Cultural Tours'],
      description: 'Premium lodge near the famous rock-hewn churches'
    },
    {
      id: '6',
      name: 'Hawassa Lake Resort',
      location: 'Lake Shore, Hawassa',
      city: 'Hawassa',
      rating: 4.2,
      price: 90,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Lake View', 'Pool', 'Restaurant', 'Spa'],
      description: 'Relaxing lakeside retreat in the Rift Valley'
    }
  ];

  const cities = ['All Cities', 'Addis Ababa', 'Bahir Dar', 'Gondar', 'Axum', 'Lalibela', 'Hawassa'];
  const amenityOptions = ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Airport Shuttle', 'Lake View', 'Mountain View', 'Garden'];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsData = await apiService.getHotels();
        setHotels(hotelsData);
        setFilteredHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        // Fallback to mock data if API fails
        setHotels(mockHotels);
        setFilteredHotels(mockHotels);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCity, priceRange, selectedAmenities, hotels]);

  const applyFilters = () => {
    let filtered = hotels;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(hotel => 
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // City filter
    if (selectedCity && selectedCity !== 'All Cities') {
      filtered = filtered.filter(hotel => hotel.city === selectedCity);
    }

    // Price range filter
    filtered = filtered.filter(hotel => 
      hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    );

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel =>
        selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    setFilteredHotels(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi': return <Wifi className="h-4 w-4" />;
      case 'Pool': return <Waves className="h-4 w-4" />;
      case 'Restaurant': return <Utensils className="h-4 w-4" />;
      case 'Airport Shuttle': return <Car className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotels, cities, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-6`}>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* City Filter */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {cities.map(city => (
                    <option key={city} value={city === 'All Cities' ? '' : city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Amenities</label>
                <div className="space-y-2">
                  {amenityOptions.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {filteredHotels.length} Hotels Found
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-48 relative">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(hotel.id)}
                        className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`h-5 w-5 ${
                            isFavorite(hotel.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">${hotel.price}</div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>

                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'fill-current' : ''}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map(amenity => (
                          <span key={amenity} className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/hotel/${hotel.id}`}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors text-center block"
                      >
                        View Details & Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No hotels found matching your criteria</div>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('');
                    setPriceRange([0, 500]);
                    setSelectedAmenities([]);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDiscovery;