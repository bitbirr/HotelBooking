import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-emerald-400" />
              <span className="font-bold text-xl">
                Stay<span className="text-emerald-400">Ethiopia</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Discover the best hotels across Ethiopia. Experience authentic hospitality
              in the land of ancient civilizations and coffee.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/hotels" className="text-gray-300 hover:text-emerald-400 transition-colors">Discover Hotels</a></li>
              <li><a href="/favorites" className="text-gray-300 hover:text-emerald-400 transition-colors">My Favorites</a></li>
              <li><a href="/account" className="text-gray-300 hover:text-emerald-400 transition-colors">My Account</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Help & Support</a></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Destinations</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Addis Ababa</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Bahir Dar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Gondar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Axum</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-300">+251927802065</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-300">info@bitbirr.net</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5" />
                <span className="text-gray-300">Bole, Addis Ababa<br />Ethiopia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 StayEthiopia. All rights reserved. Built with love for Ethiopian hospitality.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;