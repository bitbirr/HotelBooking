import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-emerald-600" />
              <span className="font-bold text-xl text-gray-800">
                Stay<span className="text-emerald-600">Ethiopia</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/hotels" 
              className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Discover Hotels
            </Link>
            <Link 
              to="/favorites" 
              className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
            
            {isAuthenticated ? (
               <div className="flex items-center space-x-4">
                 <Link
                   to="/account"
                   className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   <User className="h-4 w-4" />
                   <span>{user?.name || 'Account'}</span>
                 </Link>
                 <Link
                   to="/admin"
                   className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   Admin
                 </Link>
                 <button
                   onClick={handleLogout}
                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   Logout
                 </button>
               </div>
            ) : (
              <Link 
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link 
              to="/hotels" 
              className="block text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover Hotels
            </Link>
            <Link 
              to="/favorites" 
              className="block text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="block text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;