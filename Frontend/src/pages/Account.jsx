import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { API_URL } from "../config";

export default function Account() {
  const [userInfo, setUserInfo] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [investedMargin, setInvestedMargin] = useState(0);
  const [unrealisedPL, setUnrealisedPL] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    // Clear all data when user logs out and redirect to login
    if (!user) {
      setUserInfo({});
      setTradeHistory([]);
      setSummary([]);
      setInvestedMargin(0);
      setUnrealisedPL(0);
      setLoading(false);
      setError(null);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching profile data...");
        const profileRes = await axios.get(
          `${API_URL}/api/profile`,
          {
            withCredentials: true,
          }
        );
        console.log("Profile response:", profileRes.data);
        setUserInfo(profileRes.data);

        const tradesRes = await axios.get(`${API_URL}/api/trades`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setTradeHistory(tradesRes.data);

        const summaryRes = await axios.get(
          `${API_URL}/api/trades/summary`,
          {
            headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
          }
        );
        setSummary(summaryRes.data);

        // Compute totals
        let totalInvested = 0;
        let totalPL = 0;
        console.log(summaryRes.data);
        summaryRes.data.forEach((item) => {
          if (item.quantity > 0) {
            totalInvested += item.invested;
            totalPL += item.pl;
          }
        });
        setInvestedMargin(totalInvested);
        setUnrealisedPL(totalPL);
      } catch (error) {
        console.error("Error fetching account data:", error);
        setError(error.response?.data?.message || "Failed to fetch account data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
  <Navbar />

  {/* Main Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10 relative top-20">
    
    {/* Left Profile Card */}
    <div className="bg-[#1a1d2b] p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-[#2b2f40] flex items-center justify-center text-3xl text-white">
        👤
      </div>
      <h2 className="mt-4 text-xl font-semibold text-white">
        {userInfo?.name || "Login to see"}
      </h2>
      <p className="text-gray-400">{userInfo?.username || "Login to see"}</p>
      <p className="mt-2 text-sm flex items-center gap-2">
        <span className="text-green-400">● Verified</span>
      </p>
      <p className="text-gray-400 text-sm">Member Since Jan 2023</p>

      <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium">
        Edit Profile
      </button>

      {/* Account Settings */}
      <div className="mt-6 w-full">
        <h3 className="text-gray-300 font-semibold mb-3">Account Settings</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="hover:text-blue-400 cursor-pointer">🔒 Security & Login</li>
          <li className="hover:text-blue-400 cursor-pointer">🔔 Notifications</li>
          <li className="hover:text-blue-400 cursor-pointer">💳 Payment Methods</li>
          <li className="hover:text-blue-400 cursor-pointer">🌐 Language</li>
          <li className="text-red-500 hover:text-red-400 cursor-pointer">🗑 Delete Account</li>
        </ul>
      </div>
    </div>

    {/* Middle + Right Stats */}
    <div className="md:col-span-2 space-y-6">
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Invested Margin</p>
          <p className="text-white text-2xl font-semibold">
            ${investedMargin.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Available Margin</p>
          <p className="text-white text-2xl font-semibold">
            ${(1000000 - investedMargin).toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Unrealised P&amp;L</p>
          <p
            className={`text-2xl font-semibold ${
              unrealisedPL >= 0 ? "text-green-400" : "text-red-500"
            }`}
          >
            ${unrealisedPL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-[#1a1d2b] rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4">Trade History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2b2f40]">
                <th className="py-2 text-left">Date</th>
                <th className="text-left">Symbol</th>
                <th className="text-left">Type</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No trades yet.
                  </td>
                </tr>
              ) : (
                tradeHistory.map((trade, idx) => (
                  <tr key={idx} className="border-t border-[#2b2f40]">
                    <td>{new Date(trade.date).toLocaleString()}</td>
                    <td>{trade.symbol}</td>
                    <td
                      className={
                        trade.type === "buy" ? "text-green-400" : "text-red-500"
                      }
                    >
                      {trade.type.toUpperCase()}
                    </td>
                    <td>{trade.quantity}</td>
                    <td>${trade.price.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
