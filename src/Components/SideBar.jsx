import React, { useState } from "react";
import { Menu, X, Home, Settings, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
    { name: "Profile", icon: <User size={20} /> },
    { name: "Logout", icon: <LogOut size={20} /> },
  ];

  return (
    <div
      className={`rounded-lg bg-[#1a1d2b] h-full text-white ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        className="p-4 focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer transition"
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
