export default function BuySellPanel() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Trade Action</h3>
      <form className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Stock Symbol (e.g. AAPL)"
          className="bg-[#2b2f40] text-white px-4 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Quantity"
          className="bg-[#2b2f40] text-white px-4 py-2 rounded-md"
        />
        <div className="flex gap-3">
          <button type="submit" className="bg-green-500 text-black px-4 py-2 rounded-md w-full">
            Buy
          </button>
          <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md w-full">
            Sell
          </button>
        </div>
      </form>
    </div>
  );
}
