import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Watchlist from "../Components/Watchlist";
import { API_URL } from "../config";
import { useAuth } from "../context/authContext";
import SymbolNews from "../Components/SymbolNews";
import AISignal from "../Components/AiSignal";

export default function TradePage() {
  const { user, isLoading } = useAuth();
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState("");
  const [watchlist, setWatchlist] = useState(["AAPL"]);

  // Chart load on symbol change
  useEffect(() => {
    const loadWidget = () => {
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
    };
    const timer = setTimeout(loadWidget, 300);
    return () => {
      clearTimeout(timer);
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

    if (!user) {
      alert("Login required to perform trades.");
      return;
    }

    try {
      // 🔽 Get live price
      const priceRes = await fetch(`${API_URL}/api/price/` + symbol);
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

      const res = await fetch(`${API_URL}/api/trades`, {
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f111a] text-white font-sans flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-white font-sans">
        <nav className="z-50 h-24">
          <Navbar />
        </nav>
        <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-400 mb-4">
              You need to be logged in to access the trading page.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-[#00ffb3] text-black px-6 py-2 rounded-md font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans">
      <nav className="z-50 h-24">
        <Navbar />
      </nav>
      {/* Main grid: Watchlist | Chart & header | Order & signals */}
      <div className="px-4 md:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5">
          {/* Left: Watchlist + News */}
          <aside className="lg:sticky h-max  rounded-xl">
            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80">
              <Watchlist watchlist={watchlist} setWatchlist={setWatchlist}/>
            </div>
            <div className="mt-4 border border-[#24283b] rounded-xl bg-[#111422]/80">
            <h3 className="text-xl font-semibold mb-3 p-3 "> Latest News about {symbol}</h3>
              {/* {News Widget } */}
              <SymbolNews symbol={symbol}/>
            </div>
          </aside>

          {/* Center: Chart + Header */}
          <section className="space-y-4">
            {/* Page header */}
            <div className="bg-[#111422] border border-[#24283b] rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{symbol} Dashboard</h2>
                <p className="text-gray-400 text-sm">Real-time market data and analysis</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToWatchlist}
                  className="px-3 py-2 text-sm rounded-lg bg-[#0e1b1a] border border-[#1f2d2b] text-[#6ff9cf] hover:bg-[#12302c]"
                >
                  + Add to Watchlist
                </button>
              </div>
            </div>

            {/* Symbol controls */}
            <div className="bg-[#111422] border border-[#24283b] rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center justify-center gap-3 w-full">
                <input
                  type="text"
                  placeholder="Enter symbol (e.g. AAPL, BTCUSD)"
                  className="w-5/6 bg-[#0b0e19] border border-[#24283b] rounded-lg px-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#28e0b9]/30"
                  value={inputSymbol}
                  onChange={(e) => setInputSymbol(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2.5 rounded-lg bg-[#28e0b9] text-black font-semibold hover:bg-[#22c7a3]"
                >
                  Load Chart
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#0b0e19] border border-[#24283b] rounded-xl p-2">
              <div id="tradingview-widget" className="h-[450px]" />
            </div>
          </section>

          {/* Right: Order + AI Signals (visual) */}
          <aside className="space-y-4">
            {/* New Order */}
            <div className="bg-[#111422] border border-[#24283b] rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4"> Trade {symbol} </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400">Amount</label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 w-full bg-[#0b0e19] border border-[#24283b] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#28e0b9]/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleTrade('buy')}
                    className="rounded-lg px-4 py-2.5 bg-[#28e0b9] text-black font-semibold hover:bg-[#22c7a3]"
                  >
                    Buy / Long
                  </button>
                  <button
                    onClick={() => handleTrade('sell')}
                    className="rounded-lg px-4 py-2.5 bg-[#ef4444] text-white font-semibold hover:bg-[#dc2626]"
                  >
                    Sell / Short
                  </button>
                </div>
              </div>
            </div>

            {/* AI Trade Signals (static cards) */}
            <div className="bg-[#111422] border border-[#24283b] rounded-xl p-5">
              <AISignal symbol={symbol}/>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
