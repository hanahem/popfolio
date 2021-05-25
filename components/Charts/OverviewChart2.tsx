import React, { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { CustomState, getPrices } from "../../store/store";
import { formatCurrency, FRAMES } from "../../utils";
import { TimeFrame } from "../../utils/types";

type TimeFrameProps = {
  selectedTimeFrame: string;
  setTimeFrame: (v: string) => void;
};

const TimeFrameControls: FC<TimeFrameProps> = ({
  selectedTimeFrame,
  setTimeFrame,
}) => {
  return (
    <div className="absolute top-2 left-2">
      <div className="grid grid-cols-4 grid-rows-1 gap-1">
        {FRAMES.map((frame: TimeFrame, idx: number) => {
          return (
            <div
              key={idx}
              className={`bg-white bg-opacity-75 rounded hover:bg-brand-100 p-1 flex justify-center items-center cursor-pointer ${
                selectedTimeFrame === frame.value ? "bg-brand-100 border" : ""
              }`}
              onClick={() => setTimeFrame(frame.value)}
            >
              <p className="text-gray-600 text-xs">{frame.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Example() {
  const dispatch = useDispatch();
  const [data, set_data] = useState<any>(undefined);
  const prices = useSelector((state: CustomState) => state.prices);
  const currency = useSelector((state: CustomState) => state.currency);
  const [timeFrame, setTimeFrame] = useState("30");
  const [finalPrice, setFinalPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    (async function () {
      try {
        await dispatch(getPrices(timeFrame));
      } catch (e) {
        console.error("getPrices error: ", e);
      }
    })();
  }, [timeFrame]);

  async function fetchData(prices: number[][]) {
    set_data({
      labels: prices?.map((p: number[]) => p[0]),
      datasets: [
        {
          label: "# of Votes",
          data: prices,
          fill: "start",
          backgroundColor: "#ffd0ea",
          borderColor: "#eb7cb8",
        },
      ],
    });
    const firstPrice = prices[0][1];
    const lastPrice = prices[prices.length - 1][1];
    setFinalPrice(lastPrice);
    setPriceChange(((lastPrice - firstPrice) / firstPrice) * 100);
  }

  useEffect(() => {
    if (prices.data) {
      fetchData(prices.data);
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
    <div className={"h-44"}>
      <div className="w-full">
        <div className="rounded-lg shadow mb-4">
          <div className="rounded-lg bg-white relative overflow-hidden">
            <div className="px-3 pt-8 pb-10 text-center relative z-10">
              <TimeFrameControls
                selectedTimeFrame={timeFrame}
                setTimeFrame={setTimeFrame}
              />
              <h4 className="text-sm uppercase text-gray-500 leading-tight">
                Total assets
              </h4>
              <h3 className="text-3xl text-gray-700 font-semibold leading-tight my-3">
                {finalPrice?.toFixed(2) + " " + formatCurrency(currency)}
              </h3>
              <p className="text-xs text-green-500 leading-tight">
                ▲ {priceChange.toFixed(2)}% ({timeFrame} days)
              </p>
            </div>
            <div className="absolute bottom-0 inset-x-0">
              {data ? (
                <Line type="line" data={data} options={options} height={128} />
              ) : null}
            </div>
          </div>
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
