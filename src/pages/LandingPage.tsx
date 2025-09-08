import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Users, Calendar, Coffee, ChevronRight, Heart } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredHotels = [
    {
      id: '1',
      name: 'Ethiopian Skylight Hotel',
      location: 'Addis Ababa, Bole',
      rating: 4.8,
      price: 120,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa']
    },
    {
      id: '2',
      name: 'Blue Nile Resort',
      location: 'Bahir Dar, Lake Tana',
      rating: 4.6,
      price: 95,
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['Lake View', 'Restaurant', 'WiFi', 'Garden']
    },
    {
      id: '3',
      name: 'Gondar Castle Lodge',
      location: 'Gondar, Historic District',
      rating: 4.4,
      price: 85,
      image: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['Historic View', 'Restaurant', 'WiFi', 'Tour Desk']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-600">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=1600)'
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Discover
            <span className="block text-amber-300">Ethiopia</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Experience authentic hospitality in the land of coffee and ancient wonders
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where do you want to stay?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Link 
                to={`/hotels${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search Hotels</span>
              </Link>
            </div>
          </div>

          {/* AI Chat Teaser */}
          <div className="mt-8 bg-black bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2 text-amber-300">
              <Coffee className="h-5 w-5" />
              <span className="text-sm font-medium">
                Ask our AI: "Find me the best hotels in Addis Ababa!"
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Hotels
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked accommodations across Ethiopia's most beautiful destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <div key={hotel.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${hotel.price}/night
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
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

                  <Link 
                    to={`/hotel/${hotel.id}`}
                    className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
              <p className="text-gray-600">Find perfect hotels with our smart search and AI assistant</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book your stay in seconds with real-time availability</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Experience</h3>
              <p className="text-gray-600">Authentic Ethiopian hospitality and cultural immersion</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;