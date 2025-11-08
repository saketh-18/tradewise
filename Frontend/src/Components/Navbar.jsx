import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion } from "framer-motion";
import { Moon, Sun, Bell } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [time, setTime] = useState("");
  const [marketOpen, setMarketOpen] = useState(false);
  const { user } = useAuth();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      // Check market open/close (IST 9:15 AM - 3:30 PM)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const isOpen =
        (hours > 9 || (hours === 9 && minutes >= 15)) &&
        (hours < 15 || (hours === 15 && minutes <= 30));
      setMarketOpen(isOpen);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`text-white px-6 py-3 fixed top-0 w-full z-50 transition-all duration-300 ${
        hasShadow
          ? "bg-gradient-to-r from-zinc-900/80 via-black/70 to-zinc-800/60 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/Images/logo-1.png" alt="logo" className="w-52" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-lg">
          {["dashboard", "trade", "news"].map((path) => (
            <Link
              key={path}
              to={`/${path}`}
              className="relative group font-medium"
            >
              <span className="text-2xl group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_6px_rgba(52,211,153,0.6)] transition-all duration-200">
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </span>
              <span className=" -bottom-1 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Live Time */}
          <span className="text-sm text-gray-400 tracking-wide font-mono">
            {time}
          </span>

          {/* Market Status */}
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all duration-500 cursor-default ${
              marketOpen
                ? "border-green-500/30 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
            title="Market hours: 9:15 AM – 3:30 PM IST"
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                marketOpen ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                marketOpen ? "text-green-400" : "text-red-400"
              }`}
            >
              {marketOpen ? "Market Open" : "Market Closed"}
            </span>
          </div>

          {/* User Profile */}
          <Link to="/account" className="flex items-center gap-2 hover:opacity-90">
            <div className="bg-white/10 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 11-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0Z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-300">
              {user?.name ? `Hi, ${user.name}` : "Login"}
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 bg-zinc-900/80 backdrop-blur-lg rounded-lg overflow-hidden"
        >
          {["dashboard", "trade", "news"].map((path) => (
            <Link
              key={path}
              to={`/${path}`}
              className="block px-4 py-3 hover:bg-zinc-800 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          ))}
          <Link
            to="/account"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 hover:bg-zinc-800 transition"
          >
            Account
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
