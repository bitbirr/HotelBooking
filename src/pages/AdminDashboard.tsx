import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, Home, Tag, MessageSquare } from 'lucide-react';
import AmenityManager from '../components/admin/AmenityManager';
import BookingManager from '../components/admin/BookingManager';
import RoomTypeManager from '../components/admin/RoomTypeManager';
import SpecialOfferManager from '../components/admin/SpecialOfferManager';
import WhatsAppManager from '../components/admin/WhatsAppManager';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'amenities', label: 'Amenities', icon: Home },
    { id: 'room-types', label: 'Room Types', icon: Users },
    { id: 'offers', label: 'Special Offers', icon: Tag },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <BookingManager />;
      case 'amenities':
        return <AmenityManager />;
      case 'room-types':
        return <RoomTypeManager />;
      case 'offers':
        return <SpecialOfferManager />;
      case 'whatsapp':
        return <WhatsAppManager />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Guests</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Home className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Room Types</p>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection('bookings')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Bookings</h3>
                  <p className="text-sm text-gray-600">View and manage all bookings</p>
                </button>

                <button
                  onClick={() => setActiveSection('amenities')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Home className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Amenities</h3>
                  <p className="text-sm text-gray-600">Add and edit hotel amenities</p>
                </button>

                <button
                  onClick={() => setActiveSection('room-types')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Room Types</h3>
                  <p className="text-sm text-gray-600">Configure room types and pricing</p>
                </button>

                <button
                  onClick={() => setActiveSection('offers')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Tag className="h-6 w-6 text-orange-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Special Offers</h3>
                  <p className="text-sm text-gray-600">Create and manage promotions</p>
                </button>

                <button
                  onClick={() => setActiveSection('whatsapp')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <MessageSquare className="h-6 w-6 text-teal-600 mb-2" />
                  <h3 className="font-medium text-gray-900">WhatsApp Integration</h3>
                  <p className="text-sm text-gray-600">Send messages and view statistics</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;