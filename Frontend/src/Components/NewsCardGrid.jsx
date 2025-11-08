// src/Components/Widgets/NewsCardGrid.jsx
import React from "react";
import { motion } from "framer-motion";

const NewsCardGrid = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-400 text-center py-10">
        No news available at the moment.
      </div>
    );
  }

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
        Latest Market News
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.slice(0, 12).map((item, index) => (
          <motion.a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl overflow-hidden shadow-lg bg-[#1a1d2f] border border-[#2b2f44] hover:border-[#3f46a1]/60 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={item.image || "https://via.placeholder.com/400x250"}
                alt={item.headline}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
            </div>

            {/* Text Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#9ca3ff] transition-colors">
                {item.headline?.length > 70
                  ? item.headline.slice(0, 70) + "..."
                  : item.headline}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {item.summary?.length > 100
                  ? item.summary.slice(0, 100) + "..."
                  : item.summary}
              </p>
              <div className="mt-3 text-sm text-[#9ca3ff] font-medium hover:underline">
                Read more →
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default NewsCardGrid;
