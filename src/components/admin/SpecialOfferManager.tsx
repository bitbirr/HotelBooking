import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Percent } from 'lucide-react';
import { apiService } from '../../services/api';

interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  hotel_id?: number;
  room_type_id?: number;
  created_at?: string;
  updated_at?: string;
}

const SpecialOfferManager: React.FC = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: 0,
    valid_from: '',
    valid_until: '',
    is_active: true,
    hotel_id: '',
    room_type_id: ''
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSpecialOffers();
      setOffers(data);
      setFilteredOffers(data);
    } catch (error) {
      console.error('Error fetching special offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = offers;

    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter(offer => offer.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(offer => !offer.is_active);
    }

    setFilteredOffers(filtered);
  }, [offers, searchTerm, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        hotel_id: formData.hotel_id ? parseInt(formData.hotel_id) : undefined,
        room_type_id: formData.room_type_id ? parseInt(formData.room_type_id) : undefined
      };

      if (editingOffer) {
        await apiService.updateSpecialOffer(editingOffer.id, submitData);
      } else {
        await apiService.createSpecialOffer(submitData);
      }
      await fetchOffers();
      setIsModalOpen(false);
      setEditingOffer(null);
      setFormData({
        title: '',
        description: '',
        discount_percentage: 0,
        valid_from: '',
        valid_until: '',
        is_active: true,
        hotel_id: '',
        room_type_id: ''
      });
    } catch (error) {
      console.error('Error saving special offer:', error);
    }
  };

  const handleEdit = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_percentage: offer.discount_percentage,
      valid_from: offer.valid_from.split('T')[0], // Extract date part
      valid_until: offer.valid_until.split('T')[0], // Extract date part
      is_active: offer.is_active,
      hotel_id: offer.hotel_id?.toString() || '',
      room_type_id: offer.room_type_id?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this special offer?')) {
      try {
        await apiService.deleteSpecialOffer(id);
        await fetchOffers();
      } catch (error) {
        console.error('Error deleting special offer:', error);
      }
    }
  };

  const handleCreate = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      discount_percentage: 0,
      valid_from: '',
      valid_until: '',
      is_active: true,
      hotel_id: '',
      room_type_id: ''
    });
    setIsModalOpen(true);
  };

  const isOfferActive = (offer: SpecialOffer) => {
    const now = new Date();
    const validFrom = new Date(offer.valid_from);
    const validUntil = new Date(offer.valid_until);
    return offer.is_active && now >= validFrom && now <= validUntil;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Special Offers Management</h1>
        <button
          onClick={handleCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Offer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search offers..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading special offers...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                    <div className="text-sm text-gray-500">{offer.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <Percent className="h-4 w-4 mr-1" />
                      {offer.discount_percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(offer.valid_from).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {new Date(offer.valid_until).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isOfferActive(offer)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isOfferActive(offer) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="text-emerald-600 hover:text-emerald-900 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
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

        {!loading && filteredOffers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No special offers found matching your filters.'
              : 'No special offers found.'
            }
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingOffer ? 'Edit Special Offer' : 'Add Special Offer'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel ID
                  </label>
                  <input
                    type="number"
                    value={formData.hotel_id}
                    onChange={(e) => setFormData({ ...formData, hotel_id: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type ID
                  </label>
                  <input
                    type="number"
                    value={formData.room_type_id}
                    onChange={(e) => setFormData({ ...formData, room_type_id: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                </label>
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
                  {editingOffer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOfferManager;