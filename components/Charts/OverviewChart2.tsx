import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { CustomState, getPrices } from "../../store/store";

function Example() {
  const dispatch = useDispatch();
  const [data, set_data] = useState<any>(undefined);
  const prices = useSelector((state: CustomState) => state.prices);

  useEffect(() => {
    (async function () {
      try {
        await dispatch(getPrices("max"));
      } catch (e) {
        console.error("getPrices error: ", e);
      }
    })();
  }, []);

  async function fetchData(prices: any) {
    set_data({
      labels: prices?.map((p: number[]) => p[0]),
      datasets: [
        {
          label: "# of Votes",
          data: prices,
          fill: "start",
          backgroundColor: "rgba(249, 177, 42, 0.5)",
          borderColor: "rgba(249, 177, 42, 0.6)",
        },
      ],
    });
  }

  useEffect(() => {
    if (prices.data) {
      fetchData(prices.data.prices);
    }
  }, [prices]);

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
  };

  return (
    <div className={""}>
      <div className={"h-32 relative"}>
        <div className={"absolute bottom-0 left-0 right-0 h-20"}>
          {data ? (
            <Line type="line" data={data} options={options} height={128} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OverviewChart2() {
  return (
    <div>
      <Example />
      <div
        className={
          "flex flex-wrap w-full mb-16 tabular-nums lining-nums space-y-6 flex-col lg:flex-row"
        }
      ></div>
    </div>
  );
}

export default OverviewChart2;
