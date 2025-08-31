import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetPieChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.symbol),
    datasets: [
      {
        data: data.map((item) => item.invested),
        backgroundColor: [
          "#00ffb3", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"
        ],
      },
    ],
  };

  return (
    <div className="bg-[#1a1d2b] p-4 rounded-lg ">
      <h3 className="text-lg font-semibold mb-2 text-white">Asset Allocation</h3>
      <Pie data={chartData} />
    </div>
  );
}
