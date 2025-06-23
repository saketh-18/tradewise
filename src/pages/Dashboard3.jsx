import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/SideBar";
import Example from "../Components/lineChar"; // chart placeholder or performance line

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState({
    assets: [],
    totalInvested: 0,
    currentValue: 0,
    profitLoss: 0,
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setPortfolio(data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans">
      <nav className="z-50 h-24">
        <Navbar />
      </nav>

      <div className="grid grid-cols-[auto_1fr] gap-1 w-screen">
        <div className="ml-2 my-4">
          <Sidebar />
        </div>

        <div className="">
          {/* Portfolio Section */}
          <section className="bg-[#1a1d2b] p-6 m-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[#7f8fa6]">
                  <th className="py-2">Asset</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Current Price</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.assets.map((asset, i) => (
                  <tr key={i} className="border-t border-[#2b2f40]">
                    <td className="py-2 font-medium">{asset.name}</td>
                    <td>{asset.quantity}</td>
                    <td>${asset.price.toFixed(2)}</td>
                    <td>${asset.current.toFixed(2)}</td>
                    <td
                      className={
                        asset.pl >= 0 ? "text-green-400" : "text-red-500"
                      }
                    >
                      {asset.pl >= 0
                        ? `+$${asset.pl.toFixed(2)}`
                        : `-$${Math.abs(asset.pl).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Chart Placeholder */}
            <div className="mt-8 h-32 bg-gradient-to-r from-cyan-400/10 to-cyan-500/30 rounded-lg">
              <Example />
              <div
                className="h-full w-full bg-no-repeat bg-contain bg-bottom"
                style={{ backgroundImage: 'url("/graph-placeholder.svg")' }}
              ></div>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="bg-[#1a1d2b] m-4 p-6 rounded-lg flex justify-between items-center text-sm">
            <div>
              <p className="text-[#7f8fa6]">Total Invested</p>
              <p className="font-semibold text-lg">
                ₹{portfolio.totalInvested.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[#7f8fa6]">Current Value</p>
              <p className="font-semibold text-lg">
                ₹{portfolio.currentValue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[#7f8fa6]">Profit/Loss</p>
              <p
                className={`font-semibold text-lg ${
                  portfolio.profitLoss >= 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {portfolio.profitLoss >= 0
                  ? `+₹${portfolio.profitLoss.toLocaleString()}`
                  : `-₹${Math.abs(portfolio.profitLoss).toLocaleString()}`}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
