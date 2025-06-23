import Example from "../Components/lineChar";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/SideBar";

export default function Portfolio() {
  const assets = [
    { name: "BTC", quantity: 1.5, price: 30000, current: 40000, pl: 15000 },
    { name: "ETH", quantity: 10, price: 2000, current: 2500, pl: 5000 },
    { name: "AAPL", quantity: 20, price: 150, current: 170, pl: 400 },
    { name: "MSFT", quantity: 15, price: 280, current: 275, pl: -75 },
  ];

  const totalInvested = 65500;
  const currentValue = 77750;
  const profitLoss = 12250;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans">
      {/* <header className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">TRADEWISE</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search stocks..."
            className="bg-[#1a1d2b] text-white px-4 py-2 rounded-md border border-[#2b2f40]"
          />
          <button className="bg-[#00ffb3] text-black font-bold px-4 py-2 rounded-md">
            BUY
          </button>
        </div>
      </header> */}
      {/* Navbar  */}
      <nav className="z-50 h-24">
        <Navbar />
      </nav>

      <div className="grid grid-cols-[auto_1fr] gap-1 w-screen">
        {/* Side Bar  */}
        <div className="ml-2 my-4"><Sidebar /></div>
        {/* main content  */}
        <div className="">
          <section className="bg-[#1a1d2b] p-6 m-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
            <table className="w-full text-left">
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
                {assets.map((asset, i) => (
                  <tr key={i} className="border-t border-[#2b2f40] text-sm">
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
                        : `-${Math.abs(asset.pl).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 h-32 bg-gradient-to-r from-cyan-400/10 to-cyan-500/30 rounded-lg">
              <Example />
              <div
                className="h-full w-full bg-no-repeat bg-contain bg-bottom"
                style={{ backgroundImage: 'url("/graph-placeholder.svg")' }}
              ></div>
            </div>
          </section>

          <section className="bg-[#1a1d2b] m-4 p-6 rounded-lg flex justify-between items-center text-sm">
            <div>
              <p className="text-[#7f8fa6]">Total Invested</p>
              <p className="font-semibold text-lg">
                ${totalInvested.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[#7f8fa6]">Current Value</p>
              <p className="font-semibold text-lg">
                ${currentValue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[#7f8fa6]">Profit/Loss</p>
              <p
                className={`font-semibold text-lg ${
                  profitLoss >= 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {profitLoss >= 0
                  ? `+$${profitLoss.toLocaleString()}`
                  : `-$${Math.abs(profitLoss).toLocaleString()}`}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
