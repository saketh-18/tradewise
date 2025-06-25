import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/SideBar";
import Watchlist from "../Components/Watchlist";

export default function TradePage() {
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState("");
  const [watchlist, setWatchlist] = useState(["AAPL"]);

  // Chart load on symbol change
  useEffect(() => {
    if (window.TradingView) {
      const existing = document.getElementById("tradingview-widget");
      if (existing) existing.innerHTML = "";

      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: "D",
        timezone: "Asia/Kolkata",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0f111a",
        container_id: "tradingview-widget",
      });
    }
  }, [symbol]);

  const handleSearch = () => {
    setSymbol(inputSymbol.toUpperCase());
  };

  const handleAddToWatchlist = () => {
    const upper = symbol.toUpperCase();
    if (!watchlist.includes(upper)) {
      setWatchlist((prev) => [...prev, upper]);
    }
  };

  const handleTrade = async (type) => {
  if (!quantity || parseFloat(quantity) <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Login required to perform trades.");
    return;
  }

  try {
    // 🔽 Get live price
    const priceRes = await fetch("http://localhost:5000/api/price/"+symbol);
    const priceData = await priceRes.json();
    const currentPrice = priceData.price;
    console.log(priceData);

    if (!currentPrice || currentPrice === 0) {
      console.log(symbol);
      alert("Invalid stock symbol or unable to fetch price.");
      return;
    }

    const tradeData = {
      symbol,
      quantity: parseFloat(quantity),
      price: currentPrice,
      type,
    };
    
    console.log(token);
    const res = await fetch("http://localhost:5000/api/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(tradeData),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Trade successful!");
      setQuantity("");
    } else {
      alert(result.message || "Trade failed.");
    }
  } catch (error) {
    alert("Server error. Please try again.");
    console.error(error);
  }
};


  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans">
      <nav className="z-50 h-24">
        <Navbar />
      </nav>
      <div className="grid grid-cols-[auto_1fr] gap-1 w-full overflow-x-hidden">
        <div className="ml-2 my-4">
          {/* <Sidebar /> */}
        </div>

        <div className="p-6 w-full">
          <h2 className="text-xl font-bold mb-4">Trade</h2>
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g. AAPL, BTCUSD)"
              className="bg-[#1a1d2b] px-4 py-2 rounded-md border border-[#2b2f40] w-full md:w-1/3"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value)}
            />
            <button
              className="bg-[#00ffb3] text-black px-4 py-2 rounded-md"
              onClick={handleSearch}
            >
              Load Chart
            </button>
            <button
              className="bg-[#2b2f40] text-white px-4 py-2 rounded-md border"
              onClick={handleAddToWatchlist}
            >
              + Add to Watchlist
            </button>
          </div>

          {/* Chart */}
          <div className="bg-[#1a1d2b] rounded-lg p-2 shadow">
            <div id="tradingview-widget" className="h-[400px]" />
          </div>

          {/* Buy/Sell Form */}
          <div className="bg-[#1a1d2b] p-4 mt-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Buy / Sell <span className="text-[#00ffb3]">{symbol}</span>
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-[#2b2f40] text-white px-4 py-2 rounded-md"
              />
              <button
                className="bg-green-500 text-black px-4 py-2 rounded-md"
                onClick={() => handleTrade("buy")}
              >
                Buy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => handleTrade("sell")}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Watchlist */}
          <div className="mt-8">
            <Watchlist watchlist={watchlist} />
          </div>
        </div>
      </div>
    </div>
  );
}
