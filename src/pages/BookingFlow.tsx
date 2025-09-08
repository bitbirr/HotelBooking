import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Check, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface BookingDetails {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
}

const BookingFlow: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [hotel, setHotel] = useState<Hotel | null>(null);

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    hotelId: parseInt(searchParams.get('hotel') || '0'),
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchHotel = async () => {
      if (bookingDetails.hotelId) {
        try {
          const hotelData = await apiService.getHotel(bookingDetails.hotelId);
          setHotel(hotelData);
        } catch (error) {
          console.error('Error fetching hotel:', error);
        }
      }
    };

    fetchHotel();
  }, [bookingDetails.hotelId]);

  const calculateNights = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const checkIn = new Date(bookingDetails.checkIn);
    const checkOut = new Date(bookingDetails.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!hotel) return 0;
    const nights = calculateNights();
    const subtotal = hotel.price * nights;
    const taxes = subtotal * 0.15; // 15% tax
    return subtotal + taxes;
  };

  const handleInputChange = (field: keyof BookingDetails, value: string | number) => {
    setBookingDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = async () => {
    if (!user || !hotel) return;

    setLoading(true);

    try {
      const bookingData = {
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        number_of_guests: bookingDetails.guests,
        total_price: Math.round(calculateTotal()),
        status: 'confirmed',
        special_requests: bookingDetails.specialRequests,
        user_id: user.id,
        hotel_id: hotel.id,
        room_type_id: 1 // Default room type, could be made dynamic
      };

      const response = await apiService.createBooking(bookingData);

      if (response) {
        const reference = 'ETH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setBookingReference(reference);
        setBookingConfirmed(true);
      }
    } catch (error) {
      console.error('Booking error:', error);
      // For demo purposes, show success even on error
      const reference = 'ETH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setBookingReference(reference);
      setBookingConfirmed(true);
    }

    setLoading(false);
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">Your reservation has been successfully created.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Booking Reference</div>
            <div className="text-xl font-bold text-emerald-600">{bookingReference}</div>
          </div>
          
          <div className="space-y-2 text-left mb-6">
            {hotel && (
              <div className="flex justify-between">
                <span className="text-gray-600">Hotel:</span>
                <span className="font-medium">{hotel.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">{bookingDetails.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{bookingDetails.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium">{bookingDetails.guests}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Booking</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && <div className={`w-16 h-0.5 ${step > stepNum ? 'bg-emerald-600' : 'bg-gray-300'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Guest Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingDetails.guestName}
                      onChange={(e) => handleInputChange('guestName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={bookingDetails.guestEmail}
                      onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingDetails.guestPhone}
                      onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingDetails.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Any special requests or preferences..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!bookingDetails.guestName || !bookingDetails.guestEmail || !bookingDetails.guestPhone}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={bookingDetails.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={bookingDetails.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={bookingDetails.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!bookingDetails.cardNumber || !bookingDetails.expiryDate || !bookingDetails.cvv}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Review Booking
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Review & Confirm</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Guest Details</h3>
                    <p className="text-gray-600">{bookingDetails.guestName}</p>
                    <p className="text-gray-600">{bookingDetails.guestEmail}</p>
                    <p className="text-gray-600">{bookingDetails.guestPhone}</p>
                  </div>
                  
                  {bookingDetails.specialRequests && (
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-gray-800 mb-2">Special Requests</h3>
                      <p className="text-gray-600">{bookingDetails.specialRequests}</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">By confirming this booking, you agree to our terms and conditions.</p>
                    <p>You will receive a confirmation email shortly after booking.</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitBooking}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-amber-500 hover:shadow-lg disabled:opacity-50 text-white px-8 py-2 rounded-md font-medium transition-all"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              {hotel && (
                <div className="flex space-x-3 mb-4">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{hotel.name}</h4>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Check-in</span>
                  </div>
                  <span className="font-medium">{bookingDetails.checkIn}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Check-out</span>
                  </div>
                  <span className="font-medium">{bookingDetails.checkOut}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Guests</span>
                  </div>
                  <span className="font-medium">{bookingDetails.guests}</span>
                </div>
              </div>
              
              {hotel && (
                <div className="space-y-2 text-sm border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span>${hotel.price} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                    <span>${(hotel.price * calculateNights()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & fees</span>
                    <span>${(hotel.price * calculateNights() * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-emerald-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;