import { Line } from "react-chartjs-2";

export default function TradeChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Price",
        data: [200, 210, 220, 215, 230],
        fill: false,
        borderColor: "#00ffb3",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Stock Price Chart</h3>
      <Line data={data} />
    </div>
  );
}
