/* eslint-disable @typescript-eslint/no-explicit-any */
const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:DOHLSKFz';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${XANO_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Hotel endpoints
  async getHotels() {
    return this.request('/hotel');
  }

  async getHotel(id: number) {
    return this.request(`/hotel/${id}`);
  }

  async createHotel(data: any) {
    return this.request('/hotel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHotel(id: number, data: any) {
    return this.request(`/hotel/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteHotel(id: number) {
    return this.request(`/hotel/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings() {
    return this.request('/booking');
  }

  async getBooking(id: number) {
    return this.request(`/booking/${id}`);
  }

  async createBooking(data: any) {
    return this.request('/booking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: number, data: any) {
    return this.request(`/booking/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: number) {
    return this.request(`/booking/${id}`, {
      method: 'DELETE',
    });
  }

  // Review endpoints
  async getReviews() {
    return this.request('/review');
  }

  async getReview(id: number) {
    return this.request(`/review/${id}`);
  }

  async createReview(data: any) {
    return this.request('/review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReview(id: number, data: any) {
    return this.request(`/review/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteReview(id: number) {
    return this.request(`/review/${id}`, {
      method: 'DELETE',
    });
  }

  // Room Type endpoints
  async getRoomTypes() {
    return this.request('/room_type');
  }

  async getRoomType(id: number) {
    return this.request(`/room_type/${id}`);
  }

  async createRoomType(data: any) {
    return this.request('/room_type', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoomType(id: number, data: any) {
    return this.request(`/room_type/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRoomType(id: number) {
    return this.request(`/room_type/${id}`, {
      method: 'DELETE',
    });
  }

  // Amenity endpoints
  async getAmenities() {
    return this.request('/amenity');
  }

  async getAmenity(id: number) {
    return this.request(`/amenity/${id}`);
  }

  async createAmenity(data: any) {
    return this.request('/amenity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAmenity(id: number, data: any) {
    return this.request(`/amenity/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAmenity(id: number) {
    return this.request(`/amenity/${id}`, {
      method: 'DELETE',
    });
  }

  // Special Offer endpoints
  async getSpecialOffers() {
    return this.request('/special_offer');
  }

  async getSpecialOffer(id: number) {
    return this.request(`/special_offer/${id}`);
  }

  async createSpecialOffer(data: any) {
    return this.request('/special_offer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSpecialOffer(id: number, data: any) {
    return this.request(`/special_offer/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSpecialOffer(id: number) {
    return this.request(`/special_offer/${id}`, {
      method: 'DELETE',
    });
  }

  // Availability Calendar endpoints
  async getAvailabilityCalendars() {
    return this.request('/availability_calendar');
  }

  async getAvailabilityCalendar(id: number) {
    return this.request(`/availability_calendar/${id}`);
  }

  async createAvailabilityCalendar(data: any) {
    return this.request('/availability_calendar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAvailabilityCalendar(id: number, data: any) {
    return this.request(`/availability_calendar/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAvailabilityCalendar(id: number) {
    return this.request(`/availability_calendar/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer Profile endpoints
  async getCustomerProfiles() {
    return this.request('/customer_profile');
  }

  async getCustomerProfile(id: number) {
    return this.request(`/customer_profile/${id}`);
  }

  async createCustomerProfile(data: any) {
    return this.request('/customer_profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomerProfile(id: number, data: any) {
    return this.request(`/customer_profile/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomerProfile(id: number) {
    return this.request(`/customer_profile/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();