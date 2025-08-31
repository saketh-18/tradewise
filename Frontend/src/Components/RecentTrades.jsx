export default function RecentTrades({ trades }) {
  return (
    <div className="bg-[#1a1d2b] p-4 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Recent Trades</h3>
      {trades.slice(0, 5).map((trade, i) => (
        <div key={i} className="border-b border-[#2b2f40] py-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">{trade.symbol}</span>
            <span className={trade.type === "buy" ? "text-green-400" : "text-red-500"}>
              {trade.type.toUpperCase()}
            </span>
            <span>{trade.quantity} @ ${trade.price.toFixed(2)}</span>
          </div>
          <p className="text-[#7f8fa6]">{new Date(trade.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
