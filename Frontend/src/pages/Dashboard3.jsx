import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/SideBar";
import axios from "axios";
import AssetPieChart from "../Components/AssetPieChart";
import RecentTrades from "../Components/RecentTrades";
import { useAuth } from "../context/authContext";
import { Import } from "lucide-react";
import { API_URL } from "../config";
import CurrentHoldings from "../Components/CurrentHoldings";

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const startingMargin = 1000000;
  const [recentTrades, setRecentTrades] = useState([]);
  const [realizedPL, setRealizedPL] = useState(0);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    // TODO: In production, ensure cookie settings match between frontend/backend domains
    if (isLoading) {
      return; // Still checking authentication, don't redirect yet
    }

    // Only redirect if auth check is complete AND user is not logged in
    if (!user) {
      setSummary([]);
      setRecentTrades([]);
      setRealizedPL(0);
      navigate("/login");
      return;
    }

    let isMounted = true;

    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/trades/summary`, {
          withCredentials: true,
        });
        if (isMounted) {
          setSummary(res.data || []);
        }
      } catch (err) {
        console.error("Error fetching trade summary:", err);
        if (isMounted) {
          setSummary([]);
        }
      }
    };
    
    const fetchData = async () => {
      try {
        const tradeRes = await axios.get(`${API_URL}/api/trades`, {
          withCredentials: true,
        });
        if (isMounted) {
          setRecentTrades(tradeRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching trades:", err);
        if (isMounted) {
          setRecentTrades([]);
        }
      }
    };
    
    const fetchRealizedPL = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/trades/realized-pl`, {
          withCredentials: true,
        });
        if (isMounted) {
          setRealizedPL(res.data?.realizedPL || 0);
        }
      } catch (err) {
        console.error("Error fetching realized P&L:", err);
        if (isMounted) {
          setRealizedPL(0);
        }
      }
    };

    // Fetch all data
    fetchSummary();
    fetchData();
    fetchRealizedPL();

    // Listen for position exit events to refresh realized P&L
    const handlePositionExited = () => {
      if (isMounted) {
        fetchRealizedPL();
      }
    };
    window.addEventListener("positionExited", handlePositionExited);

    return () => {
      isMounted = false;
      window.removeEventListener("positionExited", handlePositionExited);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  const totalInvested = Array.isArray(summary) 
    ? summary.reduce((sum, item) => sum + (item?.invested || 0), 0)
    : 0;
  const currentValue = Array.isArray(summary)
    ? summary.reduce((sum, item) => sum + (item?.currentValue || 0), 0)
    : 0;
  const totalPL = currentValue - totalInvested;
  // Available margin = starting margin - invested + realized profits (since realized profits add to available cash)
  const availableMargin = startingMargin - totalInvested + realizedPL;

  const topPerformers = Array.isArray(summary) && summary.length > 0
    ? [...summary]
        .filter(item => item && item.quantity > 0) // Only include items with positions
        .sort((a, b) => (b.pl || 0) - (a.pl || 0))
        .slice(0, 3)
    : [];

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="bg-[#0f111a] min-h-screen text-white w-full flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not loading and no user, the useEffect will redirect, but show a message just in case
  if (!user) {
    return (
      <div className="bg-[#0f111a] min-h-screen text-white w-full flex items-center justify-center">
        <div className="text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 to-black text-white w-full">
        <Navbar />
        {/* <div className="flex relative top-24 min-h-screen"> */}
        {/* <Sidebar /> */}

        <div className="flex flex-col w-full p-4 relative top-24 bg-inherit">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-4 shadow-md">
              <p className="text-gray-400">Invested Margin</p>
              <p className="text-2xl font-semibold text-white">
                ₹{totalInvested.toFixed(2)}
              </p>
            </div>
            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-4 shadow-md">
              <p className="text-gray-400">Available Margin</p>
              <p className="text-2xl font-semibold text-white">
                ₹{availableMargin.toFixed(2)}
              </p>
            </div>
            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-4 shadow-md">
              <p className="text-gray-400">Unrealized P&L</p>
              <p
                className={`text-2xl font-semibold ${
                  totalPL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹{totalPL.toFixed(2)}
              </p>
            </div>
            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-4 shadow-md">
              <p className="text-gray-400">Realized P&L</p>
              <p
                className={`text-2xl font-semibold ${
                  realizedPL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹{realizedPL.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Top Performing Assets */}
          <div className="mb-6 ">
            <h2 className="text-xl font-semibold mb-3">
              Top Performing Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformers.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-4"
                >
                  <p className="text-lg font-semibold">{item?.symbol || 'N/A'}</p>
                  <p className="text-sm text-gray-400">
                    Quantity: {item?.quantity || 0}
                  </p>
                  <p className="text-sm">
                    Avg Buy Price: ₹{(item?.avgBuyPrice || 0).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Current Price: ₹{(item?.currentPrice || 0).toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      (item?.pl || 0) >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    P&L: ₹{(item?.pl || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* {Current Holdings } */}
          <CurrentHoldings />
          {/* Asset Table */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Portfolio Summary</h2>

            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-4">
              {/* Scrollable table on small screens */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px] md:min-w-full">
                  <thead className="text-[#7f8fa6] text-left">
                    <tr>
                      <th className="py-2 px-3">Symbol</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3">Avg Buy Price</th>
                      <th className="py-2 px-3">Current Price</th>
                      <th className="py-2 px-3">Invested</th>
                      <th className="py-2 px-3">Current Value</th>
                      <th className="py-2 px-3">P&amp;L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-[#2b2f40] hover:bg-[#1a1d2e]/70 transition"
                      >
                        <td className="py-2 px-3">{item?.symbol || 'N/A'}</td>
                        <td className="py-2 px-3">{item?.quantity || 0}</td>
                        <td className="py-2 px-3">
                          ₹{(item?.avgBuyPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          ₹{(item?.currentPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          ₹{(item?.invested || 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          ₹{(item?.currentValue || 0).toFixed(2)}
                        </td>
                        <td
                          className={`py-2 px-3 ${
                            (item?.pl || 0) >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          ₹{(item?.pl || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stacked (card-like) view for mobile */}
              <div className="md:hidden mt-4 space-y-3">
                {summary.map((item, index) => (
                  <div
                    key={index}
                    className="border border-[#2b2f40] rounded-lg p-3 bg-[#0c0e17]/70"
                  >
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">Symbol:</span>
                      <span>{item?.symbol || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">Quantity:</span>
                      <span>{item?.quantity || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">Avg Buy:</span>
                      <span>₹{(item?.avgBuyPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">Current:</span>
                      <span>₹{(item?.currentPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">Invested:</span>
                      <span>₹{(item?.invested || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">Value:</span>
                      <span>₹{(item?.currentValue || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f8fa6]">P&amp;L:</span>
                      <span
                        className={`${
                          (item?.pl || 0) >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ₹{(item?.pl || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 mt-4">
            <h2 className="text-xl font-semibold mb-3">Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1f2235] p-4 rounded-lg overflow-auto">
                <AssetPieChart data={summary} />
              </div>
              <div className="bg-[#1f2235] p-4 rounded-lg overflow-auto">
                <RecentTrades trades={recentTrades} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
