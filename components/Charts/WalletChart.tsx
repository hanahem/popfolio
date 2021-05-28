import React, { FC } from "react";
import { Line } from "react-chartjs-2";

const WalletChart: FC<{ data: any }> = ({ data }) => {
  const options = {
    maintainAspectRatio: false,
    plugins: {
      filler: { propagate: false },
      title: { display: false },
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      y: { display: false },
      x: { display: false },
    },
    elements: {
      point: { radius: 0 },
    },
    interaction: { intersect: false },
    tooltips: {
      mode: "x",
      intersect: false
    },
  };

  const chartData = {
    labels: data.map((d: number[][]) => d[0]),
    datasets: [
      {
        data: data.map((d: number[][]) => d[1]),
        fill: "start",
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderColor: "#eb7cb8",
      },
    ],
  };

  return <Line type="line" data={chartData} options={options} />;
};

export default WalletChart;
