import React, { useState, useEffect, useCallback } from 'react';
import { Send, MessageSquare, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../../services/api';

interface WhatsAppMessage {
  id: string;
  to: string;
  message: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  read_at?: string;
}

interface WhatsAppStats {
  total_messages: number;
  delivered_messages: number;
  failed_messages: number;
  pending_messages: number;
  response_rate: number;
}

const WhatsAppManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [messageData, setMessageData] = useState({
    to: '',
    message: '',
    bookingId: ''
  });
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [stats, setStats] = useState<WhatsAppStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab, fetchMessages]);

  const fetchMessages = useCallback(async () => {
    if (!selectedBookingId) return;
    try {
      setLoading(true);
      const data = await apiService.getBookingMessages(parseInt(selectedBookingId));
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBookingId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWhatsAppStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiService.sendWhatsAppMessage({
        to: messageData.to,
        message: messageData.message,
        booking_id: messageData.bookingId ? parseInt(messageData.bookingId) : undefined
      });
      setMessageData({ to: '', message: '', bookingId: '' });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">WhatsApp Management</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'send' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Send className="h-4 w-4 inline mr-2" />
            Send Message
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'messages' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'stats' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Statistics
          </button>
        </nav>
      </div>

      {/* Send Message Tab */}
      {activeTab === 'send' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Send WhatsApp Message</h2>
          <form onSubmit={handleSendMessage}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={messageData.to}
                  onChange={(e) => setMessageData({ ...messageData, to: e.target.value })}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking ID (Optional)
                </label>
                <input
                  type="number"
                  value={messageData.bookingId}
                  onChange={(e) => setMessageData({ ...messageData, bookingId: e.target.value })}
                  placeholder="Link to booking"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                rows={4}
                placeholder="Enter your message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Message History</h2>
            <div>
              <input
                type="number"
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                placeholder="Enter Booking ID"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mr-2"
              />
              <button
                onClick={fetchMessages}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
              >
                Load Messages
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading messages...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">To: {message.to}</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span className="ml-1 capitalize">{message.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{message.message}</p>
                  <div className="text-sm text-gray-500">
                    Sent: {new Date(message.sent_at).toLocaleString()}
                    {message.delivered_at && (
                      <span className="ml-4">Delivered: {new Date(message.delivered_at).toLocaleString()}</span>
                    )}
                    {message.read_at && (
                      <span className="ml-4">Read: {new Date(message.read_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 0 && selectedBookingId && (
                <div className="text-center py-8 text-gray-500">
                  No messages found for this booking.
                </div>
              )}
              {!selectedBookingId && (
                <div className="text-center py-8 text-gray-500">
                  Enter a booking ID to view messages.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Statistics</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading statistics...</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Messages</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.total_messages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-900">{stats.delivered_messages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{stats.failed_messages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.pending_messages}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.response_rate}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load statistics.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WhatsAppManager;