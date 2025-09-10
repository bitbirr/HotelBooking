import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Users, Bed } from 'lucide-react';
import { apiService } from '../../services/api';

interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  amenities?: string[];
  image?: string;
  created_at?: string;
  updated_at?: string;
}

const RoomTypeManager: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 1,
    price_per_night: 0,
    amenities: '',
    image: ''
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRoomTypes();
      setRoomTypes(data);
      setFilteredRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = roomTypes;

    if (searchTerm) {
      filtered = filtered.filter(roomType =>
        roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roomType.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRoomTypes(filtered);
  }, [roomTypes, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : []
      };

      if (editingRoomType) {
        await apiService.updateRoomType(editingRoomType.id, submitData);
      } else {
        await apiService.createRoomType(submitData);
      }
      await fetchRoomTypes();
      setIsModalOpen(false);
      setEditingRoomType(null);
      setFormData({
        name: '',
        description: '',
        capacity: 1,
        price_per_night: 0,
        amenities: '',
        image: ''
      });
    } catch (error) {
      console.error('Error saving room type:', error);
    }
  };

  const handleEdit = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
      capacity: roomType.capacity,
      price_per_night: roomType.price_per_night,
      amenities: roomType.amenities ? roomType.amenities.join(', ') : '',
      image: roomType.image || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        await apiService.deleteRoomType(id);
        await fetchRoomTypes();
      } catch (error) {
        console.error('Error deleting room type:', error);
      }
    }
  };

  const handleCreate = () => {
    setEditingRoomType(null);
    setFormData({
      name: '',
      description: '',
      capacity: 1,
      price_per_night: 0,
      amenities: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Room Type Management</h1>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Room Type</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search room types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Room Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          filteredRoomTypes.map((roomType) => (
            <div key={roomType.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              {roomType.image && (
                <img
                  src={roomType.image}
                  alt={roomType.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{roomType.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(roomType)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(roomType.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{roomType.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Capacity: {roomType.capacity} guests</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Bed className="h-4 w-4 mr-2" />
                    <span>${roomType.price_per_night} per night</span>
                  </div>
                </div>

                {roomType.amenities && roomType.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {roomType.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                      {roomType.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{roomType.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filteredRoomTypes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm ? 'No room types found matching your search.' : 'No room types found.'}
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingRoomType ? 'Edit Room Type' : 'Add Room Type'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, TV, Air Conditioning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  {editingRoomType ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypeManager;