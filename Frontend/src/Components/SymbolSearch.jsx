import React, { useState, useEffect, useRef } from "react";
import symbols from "../../Data/bseSymbols.json";

export default function SymbolSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFiltered([]);
      }
    };

    if (filtered.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtered.length]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 2) {
      setFiltered([]);
      return;
    }

    const matches = symbols.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase()) ||
      s.symbol.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(matches.slice(0, 10)); // limit to 10 results
  };

  return (
    <div className="relative w-full mx-auto mt-2" ref={searchRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search stocks (e.g. TCS, Infosys)"
        className="w-full bg-[#0b0e19] border border-[#24283b] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#28e0b9]/30"
      />

      {filtered.length > 0 && (
        <ul className="absolute z-20 bg-[#111422] border border-[#24283b] rounded-lg w-full mt-1 max-h-60 overflow-y-auto shadow-xl">
          {filtered.map((stock) => (
            <li
              key={stock.symbol}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(stock.symbol, stock.name);
                setQuery(stock.name);
                setFiltered([]);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-[#1b1f30] text-sm text-gray-200"
            >
              {stock.name}{" "}
              <span className="text-gray-500 text-xs">({stock.symbol})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
