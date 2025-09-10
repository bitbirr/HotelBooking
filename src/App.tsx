import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import HotelDiscovery from './pages/HotelDiscovery';
import HotelDetail from './pages/HotelDetail';
import BookingFlow from './pages/BookingFlow';
import Favorites from './pages/Favorites';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AIChat from './components/AIChat';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/hotels" element={<HotelDiscovery />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                <Route path="/booking/new" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path="/hotel/:id/reviews" element={<Reviews />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            <AIChat />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;