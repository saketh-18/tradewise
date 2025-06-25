import Navbar from "../../src/Components/Navbar";
import Sidebar from "../../src/Components/SideBar";
import TradeChart from "./TradeChart";
import BuySellPanel from "./BuySellPanel";
import Watchlist from "./Watchlist";

export default function TradePage() {
  return ( 
    <div className="min-h-screen bg-[#0f111a] text-white font-sans">
      <nav className="z-50 h-24"><Navbar /></nav>
      <div className="grid grid-cols-[auto_1fr] gap-1 w-screen">
        <div className="ml-2 my-4"><Sidebar /></div>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Trade Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#1a1d2b] p-4 rounded-lg shadow">
              <TradeChart />
            </div>
            <div className="bg-[#1a1d2b] p-4 rounded-lg shadow">
              <BuySellPanel />
            </div>
          </div>
          <div className="mt-6">
            <Watchlist />
          </div>
        </div>
      </div>
    </div>
  );
}
