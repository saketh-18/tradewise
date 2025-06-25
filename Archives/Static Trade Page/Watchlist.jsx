export default function Watchlist() {
  const watchlist = ["AAPL", "GOOG", "BTC", "ETH"];

  return (
    <div className="bg-[#1a1d2b] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Your Watchlist</h3>
      <ul className="space-y-2">
        {watchlist.map((item, i) => (
          <li key={i} className="bg-[#2b2f40] px-4 py-2 rounded-md flex justify-between">
            <span>{item}</span>
            <button className="text-[#00ffb3] hover:underline text-sm">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
