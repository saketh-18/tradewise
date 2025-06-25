import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/SideBar";
import axios from "axios";

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const startingMargin = 1000000;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/trades/summary", {
          withCredentials: true,
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching trade summary:", err);
      }
    };
    fetchSummary();
  }, []);

  const totalInvested = summary.reduce((sum, item) => sum + item.invested, 0);
  const currentValue = summary.reduce((sum, item) => sum + item.currentValue, 0);
  const totalPL = currentValue - totalInvested;
  const availableMargin = startingMargin - totalInvested;

  const topPerformers = [...summary].sort((a, b) => b.pl - a.pl).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      <Navbar />
      <div className="flex relative top-24">
        {/* <Sidebar /> */}

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1a1d2b] p-4 rounded-lg shadow-md">
              <p className="text-gray-400">Invested Margin</p>
              <p className="text-2xl font-semibold text-white">₹{totalInvested.toFixed(2)}</p>
            </div>
            <div className="bg-[#1a1d2b] p-4 rounded-lg shadow-md">
              <p className="text-gray-400">Available Margin</p>
              <p className="text-2xl font-semibold text-white">₹{availableMargin.toFixed(2)}</p>
            </div>
            <div className="bg-[#1a1d2b] p-4 rounded-lg shadow-md">
              <p className="text-gray-400">Total P&L</p>
              <p className={`text-2xl font-semibold ${totalPL >= 0 ? "text-green-400" : "text-red-400"}`}>
                ₹{totalPL.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Top Performing Assets */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Top Performing Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformers.map((item, index) => (
                <div key={index} className="bg-[#1a1d2b] p-4 rounded-lg">
                  <p className="text-lg font-semibold">{item.symbol}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-sm">Avg Buy Price: ₹{item.avgBuyPrice.toFixed(2)}</p>
                  <p className="text-sm">Current Price: ₹{item.currentPrice.toFixed(2)}</p>
                  <p className={`text-sm ${item.pl >= 0 ? "text-green-400" : "text-red-400"}`}>
                    P&L: ₹{item.pl.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Table */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Portfolio Summary</h2>
            <div className="bg-[#1a1d2b] p-4 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[#7f8fa6] text-left">
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Avg Buy Price</th>
                    <th>Current Price</th>
                    <th>Invested</th>
                    <th>Current Value</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item, index) => (
                    <tr key={index} className="border-t border-[#2b2f40]">
                      <td>{item.symbol}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.avgBuyPrice.toFixed(2)}</td>
                      <td>₹{item.currentPrice.toFixed(2)}</td>
                      <td>₹{item.invested.toFixed(2)}</td>
                      <td>₹{item.currentValue.toFixed(2)}</td>
                      <td className={item.pl >= 0 ? "text-green-400" : "text-red-400"}>
                        ₹{item.pl.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
