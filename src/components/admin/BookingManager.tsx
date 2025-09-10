import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiService } from '../../services/api';

interface Booking {
  id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  status: string;
  special_requests?: string;
  user_id: number;
  hotel_id: number;
  room_type_id: number;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
  hotel?: {
    name: string;
  };
  room_type?: {
    name: string;
  };
}

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      if (newStatus === 'confirmed') {
        await apiService.confirmBooking(bookingId);
      } else if (newStatus === 'cancelled') {
        await apiService.cancelBooking(bookingId);
      }
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await apiService.deleteBooking(id);
        await fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm ||
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, email, hotel, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.user?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.hotel?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {new Date(booking.check_out_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${booking.total_price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-4"
                          title="Confirm booking"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 mr-4"
                          title="Cancel booking"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No bookings found matching your filters.'
              : 'No bookings found.'
            }
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Booking Details #{selectedBooking.id}</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Guest Information</h3>
                <p><strong>Name:</strong> {selectedBooking.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedBooking.user?.email || 'N/A'}</p>
                <p><strong>Guests:</strong> {selectedBooking.number_of_guests}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <p><strong>Hotel:</strong> {selectedBooking.hotel?.name || 'N/A'}</p>
                <p><strong>Room Type:</strong> {selectedBooking.room_type?.name || 'N/A'}</p>
                <p><strong>Check-in:</strong> {new Date(selectedBooking.check_in_date).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(selectedBooking.check_out_date).toLocaleDateString()}</p>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <p><strong>Status:</strong>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="ml-1 capitalize">{selectedBooking.status}</span>
                  </span>
                </p>
                <p><strong>Total Price:</strong> ${selectedBooking.total_price}</p>
                {selectedBooking.special_requests && (
                  <p><strong>Special Requests:</strong> {selectedBooking.special_requests}</p>
                )}
                <p><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedBooking.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;