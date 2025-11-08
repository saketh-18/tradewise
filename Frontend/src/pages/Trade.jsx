import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Watchlist from "../Components/Watchlist";
import { API_URL } from "../config";
import { useAuth } from "../context/authContext";
import AISignal from "../Components/AISignal";
import SymbolOverview from "../Components/Widgets/SymbolOverview";
import TopStories from "../Components/Widgets/TopStories";
import SymbolSearch from "../Components/SymbolSearch";
import { Search } from "lucide-react"; // for icon (install via: npm i lucide-react)

export default function TradePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState("BSE:TCS");
  const [name, setName] = useState("Tata Consultancy Services"); // 👈 company name
  const [quantity, setQuantity] = useState("");
  const [watchlist, setWatchlist] = useState(["BSE:TCS"]);

  // Handle authentication and navigation
  useEffect(() => {
    if (isLoading) {
      return; // Still checking authentication
    }

    if (!user) {
      navigate("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // 🧭 Chart load on symbol change
  useEffect(() => {
    const loadWidget = () => {
      try {
        if (window.TradingView) {
          const existing = document.getElementById("tradingview-widget");
          if (existing) {
            existing.innerHTML = "";
            
            new window.TradingView.widget({
              autosize: true,
              symbol,
              interval: "D",
              timezone: "Asia/Kolkata",
              theme: "dark",
              style: "1",
              locale: "en",
              toolbar_bg: "#0f111a",
              container_id: "tradingview-widget",
            });
          }
        }
      } catch (error) {
        console.error("Error loading TradingView widget:", error);
      }
    };
    const timer = setTimeout(loadWidget, 300);
    return () => clearTimeout(timer);
  }, [symbol]);

  // 🪙 Add to Watchlist
  const handleAddToWatchlist = () => {
    const upper = symbol.toUpperCase();
    if (!watchlist.includes(upper)) {
      setWatchlist((prev) => [...prev, upper]);
    }
  };

  // 🛒 Trade
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
      const priceRes = await fetch(`${API_URL}/api/indian-price/${symbol}`);
      const priceData = await priceRes.json();
      const currentPrice = priceData.price;

      if (!currentPrice || currentPrice === 0) {
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
        headers: { "Content-Type": "application/json" },
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
      console.error(error);
      alert("Server error. Please try again.");
    }
  };

  // 🌀 Loading and Auth handling
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f111a] text-white flex items-center justify-center text-xl">
          Loading...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-white">
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
              onClick={() => navigate("/login")}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <nav className="z-50 h-24">
        <Navbar />
      </nav>

      <div className="px-4 md:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5">
          {/* Left: Watchlist + News */}
          <aside className="lg:sticky h-max rounded-xl">
            <div className="border border-[#24283b] rounded-xl bg-[#111422]/80">
              <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
            </div>
            <div className="p-2 mt-4 h-96 border border-[#24283b] rounded-xl bg-[#111422]/80">
              <TopStories />
            </div>
          </aside>

          {/* Center: Chart + Header */}
          <section className="space-y-4">
            {/* Page header */}
            <div className="bg-[#111422] border border-[#24283b] rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {name}
                </h2>
                <p className="text-gray-400 text-sm">Real-time market data</p>
              </div>
              <button
                onClick={handleAddToWatchlist}
                className="px-4 py-2 text-sm rounded-lg bg-[#0e1b1a] border border-[#1f2d2b] text-[#6ff9cf] hover:bg-[#12302c] transition-all"
              >
                + Add {name.split(" ")[0]} to Watchlist
              </button>
            </div>

            {/* Stylish Search Bar */}
            <div className="relative w-full mx-auto">
              <div className="flex items-center gap-3 bg-[#0b0e19] border border-[#24283b] rounded-2xl px-4 py-2.5 shadow-lg transition-all focus-within:ring-2 focus-within:ring-[#28e0b9]/40 hover:border-[#28e0b9]/40">
                <Search size={20} className="text-gray-400 shrink-0" />
                <div className="flex w-full">
                  <SymbolSearch
                    onSelect={(s, n) => {
                      setSymbol(s);
                      setName(n);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#0b0e19] border border-[#24283b] rounded-xl p-2">
              <div id="tradingview-widget" className="h-[450px]" />
            </div>
          </section>

          {/* Right: Orders + AI Signals */}
          <aside className="space-y-4">
            <div className="bg-[#111422] border border-[#24283b] rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4">Trade {name}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400">Quantity</label>
                  <input
                    type="number"
                    placeholder={`Enter amount for ${name}`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 w-full bg-[#0b0e19] border border-[#24283b] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#28e0b9]/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleTrade("buy")}
                    className="rounded-lg px-4 py-2.5 bg-[#28e0b9] text-black font-semibold hover:bg-[#22c7a3]"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => handleTrade("sell")}
                    className="rounded-lg px-4 py-2.5 bg-[#ef4444] text-white font-semibold hover:bg-[#dc2626]"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111422] border border-[#24283b] rounded-xl p-5">
              <AISignal symbol={name} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
