import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black py-10">
      <div className="container mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">About TradeWise</h3>
            <p>
              TradeWise is your ultimate trading companion. Practice with virtual money, 
              track cryptocurrencies, and stay updated with the latest market trends.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#about" className="hover:text-blue-400">About</a></li>
              <li><a href="#contact" className="hover:text-blue-400">Contact Us</a></li>
              <li><a href="#privacy" className="hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter & Social Media */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Stay Connected</h3>
            <p className="mb-4">Subscribe to our newsletter for the latest updates:</p>
            <form className="flex items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-r-md hover:scale-105"
              >
                Subscribe
              </button>
            </form>
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-blue-400"><FaFacebook size={24} /></a>
              <a href="#" className="text-white hover:text-blue-400"><FaTwitter size={24} /></a>
              <a href="#" className="text-white hover:text-blue-400"><FaInstagram size={24} /></a>
              <a href="#" className="text-white hover:text-blue-400"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400">
          <p>© 2024 TradeWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
