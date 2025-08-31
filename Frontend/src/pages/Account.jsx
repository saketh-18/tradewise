import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useAuth } from "../context/authContext";

export default function Account() {
  const [userInfo, setUserInfo] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [investedMargin, setInvestedMargin] = useState(0);
  const [unrealisedPL, setUnrealisedPL] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.email) return;

    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          "https://tradewise-b8jz.onrender.com/api/profile",
          {
            params: { email: user.email },
          }
        );
        setUserInfo(profileRes.data);

        const tradesRes = await axios.get("https://tradewise-b8jz.onrender.com/api/trades", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setTradeHistory(tradesRes.data);

        const summaryRes = await axios.get(
          "https://tradewise-b8jz.onrender.com/api/trades/summary",
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
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="w-full grid grid-cols-3 gap-4 h-44 top-24 relative px-4">
        <div className="bg-[#1a1d2b] p-4 rounded-lg flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <div className="flex flex-col justify-center ml-4">
            <p className="text-white text-xl font-medium">
              {userInfo?.email || "Loading..."}
            </p>
            <p className="text-white text-md font-light">
              {userInfo?.username || "Trader"}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-[#1a1d2b] p-4 rounded-lg flex items-center justify-evenly">
          <div className="flex flex-col text-center">
            <p className="text-neutral text-lg font-medium">Invested Margin</p>
            <p className="text-white text-xl font-semibold">${investedMargin.toLocaleString()}</p>
          </div>
          <div className="flex flex-col text-center">
            <p className="text-neutral text-lg font-medium">Available Margin</p>
            <p className="text-white text-xl font-semibold">
  ${(1000000 - investedMargin).toLocaleString()}
</p>
          </div>
          <div className="flex flex-col text-center">
            <p className="text-neutral text-lg font-medium">Unrealised P&L</p>
            <p className={`text-xl font-semibold ${unrealisedPL >= 0 ? "text-success" : "text-red-500"}`}>
  ${unrealisedPL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
</p>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="p-6 relative top-24">
        <h2 className="text-xl font-semibold text-white mb-4">Trade History</h2>
        <div className="bg-[#1a1d2b] rounded-lg p-4 overflow-x-auto">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="text-[#7f8fa6] text-left">
                <th className="py-2">Date</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-neutral-400">
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
  );
}
