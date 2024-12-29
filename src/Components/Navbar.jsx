import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className=" text-white px-4 py-2 z-10 fixed top-0 w-full">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">
            <img
              src="/Images/logo-1.png"
              width={"220px"} 
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search for scrips , indices and cryptocurrencies.."
            className="searchbar w-96 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-xl w-1/4 justify-between">
          <Link to="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <Link to="/trade" className="hover:text-primary">
            Trade
          </Link>
          <Link to="/crypto" className="hover:text-primary">
            Crypto
          </Link>
        </div>

        {/* User Profile */}
        <div className="hidden md:block">
          <button className="px-4 py-2 rounded-md hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-zinc-900 to-transparent w-full m-0 rounded-lg z-50">
          
          <Link to="/dashboard" className="block px-3 py-2 hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/trade" className="block px-3 py-2 hover:bg-gray-700">
            Trade
          </Link>
          <Link to="/crypto" className="block px-3 py-2 hover:bg-gray-700">
            Crypto
          </Link>
          
          <button className="block w-full text-left px-3 py-2 text-white rounded-md">
            Profile
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// logo center for small screens and left for large screens
// menu items hidden for small screens and right for large screens
