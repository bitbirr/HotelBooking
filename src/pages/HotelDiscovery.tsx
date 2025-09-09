/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { apiService } from '../services/api';

interface Hotel {
  id: number;
  created_at: number;
  name: string;
  city: string;
  location: string;
  description: string;
  rating: number;
  price_per_night: number;
  is_active: boolean;
  contact_phone: string;
  contact_email: string;
  website: string;
  latitude: number;
  longitude: number;
}

const HotelDiscovery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);



  const cities = ['All Cities', 'Addis Ababa', 'Bahir Dar', 'Gondar', 'Axum', 'Lalibela', 'Hawassa'];

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const hotelsData = await apiService.getHotels();
        setHotels(hotelsData);
        setFilteredHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCity, priceRange, hotels]);

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
      hotel.price_per_night >= priceRange[0] && hotel.price_per_night <= priceRange[1]
    );

    setFilteredHotels(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
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

            </div>
          </div>

          {/* Hotels Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {filteredHotels.length} Hotels Found
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Loading hotels...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">${hotel.price_per_night}</div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{hotel.location}, {hotel.city}</span>
                  </div>

                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(hotel.rating / 1000) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">{(hotel.rating / 1000).toFixed(1)}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                  <div className="text-sm text-gray-600 mb-4">
                    <div><strong>Phone:</strong> {hotel.contact_phone}</div>
                    <div><strong>Email:</strong> {hotel.contact_email}</div>
                    <div><strong>Website:</strong> <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{hotel.website}</a></div>
                  </div>

                  <Link
                    to={`/hotel/${hotel.id}`}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors text-center block"
                  >
                    View Details & Book
                  </Link>
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
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDiscovery;