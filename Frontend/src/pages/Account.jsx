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
  const [realizedPL, setRealizedPL] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoading, logout } = useAuth();
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
      setRealizedPL(0);
      setLoading(false);
      setError(null);
      navigate("/login");
      return;
    }

    let isMounted = true;

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
        if (isMounted) {
          console.log("Profile response:", profileRes.data);
          setUserInfo(profileRes.data || {});
        }

        const tradesRes = await axios.get(`${API_URL}/api/trades`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (isMounted) {
          setTradeHistory(Array.isArray(tradesRes.data) ? tradesRes.data : []);
        }

        const summaryRes = await axios.get(
          `${API_URL}/api/trades/summary`,
          {
            headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
          }
        );
        const summaryData = Array.isArray(summaryRes.data) ? summaryRes.data : [];
        if (isMounted) {
          setSummary(summaryData);
        }

        // Compute totals with safety checks
        let totalInvested = 0;
        let totalPL = 0;
        if (Array.isArray(summaryData)) {
          summaryData.forEach((item) => {
            if (item && item.quantity > 0) {
              totalInvested += item.invested || 0;
              totalPL += item.pl || 0;
            }
          });
        }
        if (isMounted) {
          setInvestedMargin(totalInvested);
          setUnrealisedPL(totalPL);
        }
        
        // Fetch realized P&L
        try {
          const realizedPLRes = await axios.get(
            `${API_URL}/api/trades/realized-pl`,
            {
              withCredentials: true,
            }
          );
          if (isMounted) {
            setRealizedPL(realizedPLRes.data?.realizedPL || 0);
          }
        } catch (err) {
          console.error("Error fetching realized P&L:", err);
          if (isMounted) {
            setRealizedPL(0);
          }
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
        if (isMounted) {
          setError(error.response?.data?.message || "Failed to fetch account data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Listen for position exit events to refresh realized P&L
    const handlePositionExited = () => {
      if (isMounted) {
        axios.get(
          `${API_URL}/api/trades/realized-pl`,
          {
            withCredentials: true,
          }
        ).then(res => {
          if (isMounted) {
            setRealizedPL(res.data?.realizedPL || 0);
          }
        }).catch(err => {
          console.error("Error fetching realized P&L:", err);
        });
      }
    };
    window.addEventListener('positionExited', handlePositionExited);
    
    return () => {
      isMounted = false;
      window.removeEventListener('positionExited', handlePositionExited);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="bg-gradient-to-r from-gray-900  to-black min-h-[100vh]">
  <Navbar />

  {/* Main Grid */}
  <div className="bg-gradient-to-r from-gray-900 to-black min-h-[100vh] grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10 relative top-20">
    
    {/* Left Profile Card */}
    <div className="bg-[#1a1d2b] p-6 rounded-lg shadow-md flex flex-col items-center h-[40vh]">
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

      {/* Account Settings */}
      <button className="text-white p-2 rounded-md bg-rose-700 my-2 w-24" onClick={logout}>Logout</button>
    </div>

    {/* Middle + Right Stats */}
    <div className="md:col-span-2 space-y-6">
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Invested Margin</p>
          <p className="text-white text-2xl font-semibold">
            ₹{investedMargin.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Available Margin</p>
          <p className="text-white text-2xl font-semibold">
            ₹{(1000000 - investedMargin + realizedPL).toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Unrealised P&amp;L</p>
          <p
            className={`text-2xl font-semibold ${
              unrealisedPL >= 0 ? "text-green-400" : "text-red-500"
            }`}
          >
            ₹{unrealisedPL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[#1a1d2b] p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">Realised P&amp;L</p>
          <p
            className={`text-2xl font-semibold ${
              realizedPL >= 0 ? "text-green-400" : "text-red-500"
            }`}
          >
            ₹{realizedPL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
                    <td>{trade.date ? new Date(trade.date).toLocaleString() : 'N/A'}</td>
                    <td>{trade.symbol || 'N/A'}</td>
                    <td
                      className={
                        trade.type === "buy" ? "text-green-400" : "text-red-500"
                      }
                    >
                      {trade.type ? trade.type.toUpperCase() : 'N/A'}
                    </td>
                    <td>{trade.quantity || 0}</td>
                    <td>₹{trade.price ? trade.price.toFixed(2) : '0.00'}</td>
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
