import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useAuth } from "../context/authContext";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function CurrentHoldings() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch if user is not logged in
    if (!user) {
      setLoading(false);
      setHoldings([]);
      return;
    }

    async function loadHoldings() {
      try {
        // Use credentials: "include" for cookie-based authentication
        // The backend uses JWT tokens stored in cookies, not Authorization headers
        const res = await fetch(`${API_URL}/api/trades/holdings`, {
          method: "GET",
          credentials: "include", // This sends cookies with the request
        });
        
        if (!res.ok) {
          console.error("Holdings fetch failed:", res.status);
          setHoldings([]);
          return;
        }
        
        const data = await res.json();
        setHoldings(data || []);
      } catch (err) {
        console.error("Holdings fetch error:", err);
        setHoldings([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadHoldings();
  }, [user]);

  const handleExit = async (symbol, quantity) => {
    if (!window.confirm(`Exit ${quantity} shares of ${symbol}?`)) return;
    try {
      // Use credentials: "include" for cookie-based authentication
      const res = await fetch(`${API_URL}/api/trades/exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends cookies with the request
        body: JSON.stringify({ symbol, quantity }),
      });
      
      if (!res.ok) {
        const result = await res.json();
        alert(result.message || "Failed to exit position");
        return;
      }
      
      const result = await res.json();
      
      // Show realized P&L in the alert message
      const plMessage = result.realizedPL !== undefined 
        ? `\nRealized P&L: $${result.realizedPL.toFixed(2)}`
        : '';
      alert((result.message || "Exited successfully") + plMessage);
      
      // Reload holdings from server to get updated data
      const holdingsRes = await fetch(`${API_URL}/api/trades/holdings`, {
        method: "GET",
        credentials: "include",
      });
      
      if (holdingsRes.ok) {
        const updatedHoldings = await holdingsRes.json();
        setHoldings(updatedHoldings || []);
      }
      
      // Trigger a page refresh to update the Dashboard's realized P&L
      // This ensures the Dashboard shows the updated realized P&L
      window.dispatchEvent(new Event('positionExited'));
    } catch (err) {
      console.error("Exit trade error:", err);
      alert("Failed to exit position");
    }
  };

  if (loading)
    return (
      <div className="text-gray-400 text-center p-4 bg-[#0f172a] border border-[#1e293b] rounded-xl">
        Loading holdings...
      </div>
    );

  if (!holdings.length)
    return (
      <div className="text-gray-400 text-center p-4 bg-[#0f172a] border border-[#1e293b] rounded-xl my-5">
        No active holdings.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg text-gray-100 my-4`"
    >
      <h2 className="text-lg font-semibold mb-4">Current Holdings</h2>
      <div className="space-y-3">
        {holdings.map((h) => (
          <motion.div
            key={h.symbol}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between items-center bg-[#1e293b]/60 border border-[#334155]/40 rounded-xl p-3"
          >
            <div>
              <div className="text-md font-semibold">{h.symbol}</div>
              <div className="text-sm text-gray-400">
                {h.netQuantity} shares
              </div>
            </div>
            <button
              onClick={() => handleExit(h.symbol, h.netQuantity)}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-700/40 px-3 py-1.5 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Exit Position
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
