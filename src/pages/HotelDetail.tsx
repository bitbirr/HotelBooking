import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Wifi, Car, Utensils, Waves, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  images: string[];
  amenities: string[];
  description: string;
  fullDescription: string;
  reviews: number;
}

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Mock hotel data - in real app, this would come from Xano API
    const mockHotel: Hotel = {
      id: id || '1',
      name: 'Ethiopian Skylight Hotel',
      location: 'Bole, Addis Ababa',
      rating: 4.8,
      price: 120,
      images: [
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Spa & Wellness', 'Airport Shuttle', 'Fitness Center', 'Room Service', 'Conference Rooms'],
      description: 'Luxury hotel in the heart of Addis Ababa near Bole International Airport',
      fullDescription: 'Experience unparalleled luxury at Ethiopian Skylight Hotel, strategically located in the vibrant Bole district of Addis Ababa. Our premium accommodations offer modern amenities with traditional Ethiopian hospitality, making it the perfect choice for both business and leisure travelers. Each room is thoughtfully designed with contemporary furnishings, high-speed internet, and stunning city views. Our world-class spa, fine dining restaurants, and comprehensive business facilities ensure an exceptional stay.',
      reviews: 247
    };
    
    setHotel(mockHotel);
  }, [id]);

  const nextImage = () => {
    if (hotel) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel) {
      setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('WiFi')) return <Wifi className="h-5 w-5 text-emerald-600" />;
    if (amenity.includes('Pool')) return <Waves className="h-5 w-5 text-blue-600" />;
    if (amenity.includes('Restaurant')) return <Utensils className="h-5 w-5 text-amber-600" />;
    if (amenity.includes('Shuttle')) return <Car className="h-5 w-5 text-gray-600" />;
    return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
  };

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="font-medium">{hotel.rating}</span>
                <span>({hotel.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => toggleFavorite(hotel.id)}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Heart 
              className={`h-6 w-6 ${
                isFavorite(hotel.id) ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden">
                <img 
                  src={hotel.images[currentImageIndex]} 
                  alt={hotel.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="flex space-x-2 mt-4">
                {hotel.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-emerald-600' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">About This Hotel</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.fullDescription}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Link */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Guest Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(hotel.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="font-medium text-lg">{hotel.rating}</span>
                    <span className="text-gray-600">({hotel.reviews} reviews)</span>
                  </div>
                </div>
                <Link 
                  to={`/hotel/${hotel.id}/reviews`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  View All Reviews
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-emerald-600">${hotel.price}</div>
                <div className="text-gray-600">per night</div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check In
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check Out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Link
                  to={`/booking/new?hotel=${hotel.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                  className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-center block"
                >
                  Book Now
                </Link>
              </form>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Free cancellation up to 24 hours before check-in
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;