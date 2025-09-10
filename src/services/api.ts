/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = import.meta.env.VITE_BASE_URL || '/api';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
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

  // Booking Modification History endpoints
  async getBookingModificationHistories() {
    return this.request('/booking_modification_history');
  }

  async getBookingModificationHistory(id: number) {
    return this.request(`/booking_modification_history/${id}`);
  }

  async createBookingModificationHistory(data: any) {
    return this.request('/booking_modification_history', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBookingModificationHistory(id: number, data: any) {
    return this.request(`/booking_modification_history/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBookingModificationHistory(id: number) {
    return this.request(`/booking_modification_history/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat Session endpoints
  async getChatSessions() {
    return this.request('/chat_session');
  }

  async getChatSession(id: number) {
    return this.request(`/chat_session/${id}`);
  }

  async createChatSession(data: any) {
    return this.request('/chat_session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChatSession(id: number, data: any) {
    return this.request(`/chat_session/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteChatSession(id: number) {
    return this.request(`/chat_session/${id}`, {
      method: 'DELETE',
    });
  }

  // Room Image endpoints
  async getRoomImages() {
    return this.request('/room_image');
  }

  async getRoomImage(id: number) {
    return this.request(`/room_image/${id}`);
  }

  async createRoomImage(data: any) {
    return this.request('/room_image', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoomImage(id: number, data: any) {
    return this.request(`/room_image/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRoomImage(id: number) {
    return this.request(`/room_image/${id}`, {
      method: 'DELETE',
    });
  }

  // Room Type Amenity endpoints
  async getRoomTypeAmenities() {
    return this.request('/room_type_amenity');
  }

  async getRoomTypeAmenity(id: number) {
    return this.request(`/room_type_amenity/${id}`);
  }

  async createRoomTypeAmenity(data: any) {
    return this.request('/room_type_amenity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoomTypeAmenity(id: number, data: any) {
    return this.request(`/room_type_amenity/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRoomTypeAmenity(id: number) {
    return this.request(`/room_type_amenity/${id}`, {
      method: 'DELETE',
    });
  }

  // User Activity Log endpoints
  async getUserActivityLogs() {
    return this.request('/user_activity_log');
  }

  async getUserActivityLog(id: number) {
    return this.request(`/user_activity_log/${id}`);
  }

  async createUserActivityLog(data: any) {
    return this.request('/user_activity_log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserActivityLog(id: number, data: any) {
    return this.request(`/user_activity_log/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUserActivityLog(id: number) {
    return this.request(`/user_activity_log/${id}`, {
      method: 'DELETE',
    });
  }

  // Special Booking routes
  async searchBookings(query: string) {
    return this.request(`/bookings/search?q=${encodeURIComponent(query)}`);
  }

  async confirmBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/confirm`, {
      method: 'POST',
    });
  }

  async cancelBooking(bookingId: number) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  }

  async modifyBooking(bookingId: number, data: any) {
    return this.request(`/bookings/${bookingId}/modify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Room Type search
  async searchRoomTypes(query: string) {
    return this.request(`/room_types/search?q=${encodeURIComponent(query)}`);
  }

  // Review hotel rating
  async getHotelRating(hotelId: number) {
    return this.request(`/hotels/${hotelId}/rating`);
  }

  // WhatsApp API endpoints (authenticated)
  async sendWhatsAppMessage(data: any) {
    return this.request('/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWhatsAppMessageStatus(messageId: string) {
    return this.request(`/whatsapp/messages/${messageId}/status`);
  }

  async getBookingMessages(bookingId: number) {
    return this.request(`/whatsapp/bookings/${bookingId}/messages`);
  }

  async getWhatsAppStatistics() {
    return this.request('/whatsapp/statistics');
  }

  // WhatsApp Monitoring endpoints
  async getWhatsAppDashboard() {
    return this.request('/whatsapp/monitoring/dashboard');
  }

  async getWhatsAppAlerts() {
    return this.request('/whatsapp/monitoring/alerts');
  }

  async getWhatsAppStatusStream() {
    return this.request('/whatsapp/monitoring/stream');
  }

  async getWhatsAppAnalytics() {
    return this.request('/whatsapp/monitoring/analytics');
  }

  // WhatsApp Webhook endpoints
  async handleWhatsAppStatusUpdate(data: any) {
    return this.request('/webhooks/whatsapp/status', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async handleWhatsAppIncomingMessage(data: any) {
    return this.request('/webhooks/whatsapp/incoming', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getUserInfo() {
    return this.request('/auth/me');
  }
}

export const apiService = new ApiService();