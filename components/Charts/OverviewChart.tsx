import React, { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { Currencies, CustomState, getPrices } from "../../store/store";
import { formatCurrency, FRAMES } from "../../utils";
import { Asset, TimeFrame } from "../../utils/types";

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
              className={`bg-white bg-opacity-75 rounded-sm hover:bg-brand-100 p-1 flex justify-center items-center cursor-pointer ${
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

const ChartContainer: FC<{
  ids: string[];
  assets: Asset[];
  isWallet?: boolean;
  colors?: string[];
}> = ({ ids, assets, isWallet, colors }) => {
  const dispatch = useDispatch();

  //Store data
  const prices = useSelector((state: CustomState) => state.prices);
  const currency = useSelector((state: CustomState) => state.currency);

  //Local state
  const [data, set_data] = useState<any>(undefined);
  const [timeFrame, setTimeFrame] = useState("30");
  const [finalPrice, setFinalPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  //Functions
  async function fetchData(
    prices: number[][],
    currentPrice: { [currency: string]: number },
    currency: Currencies
  ) {
    set_data({
      labels: prices?.map((p: number[]) => p[0]),
      datasets: [
        {
          label: "# of Votes",
          data: prices,
          fill: "start",
          backgroundColor: colors ? colors[1] : "#ffd0ea",
          borderColor: colors ? colors[0] : "#eb7cb8",
        },
      ],
    });
    console.log(colors?.[2])
    const firstPrice = prices[0][1];
    const lastPrice = currentPrice[currency];
    setFinalPrice(lastPrice);
    setPriceChange(((lastPrice - firstPrice) / firstPrice) * 100);
  }

  //Effects
  useEffect(() => {
    (async function () {
      try {
        await dispatch(getPrices(timeFrame, ids, assets));
      } catch (e) {
        console.error("getPrices error: ", e);
      }
    })();
  }, [timeFrame]);

  useEffect(() => {
    if (prices.data && prices.data.length && currency) {
      fetchData(prices.data, prices.currentTotalAssets, currency);
    }
  }, [prices, currency]);

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
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      },
    },
    interaction: { intersect: false },
  };

  if (isWallet) {
    return (
      <div className={"absolute bottom-0 left-0 w-full h-1/2 z-0"}>
        {!prices?.status?.loading && data ? (
          <Line type="line" data={data} options={options} height={128} />
        ) : null}
      </div>
    );
  } else {
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
                <div
                  className={
                    prices?.status?.loading ? "animate-pulse" : "animate-none"
                  }
                >
                  <h4 className="text-sm uppercase text-gray-500 leading-tight">
                    Total assets
                  </h4>
                  <h3 className="text-3xl text-gray-700 font-semibold leading-tight my-3">
                    {finalPrice?.toFixed(2) + " " + formatCurrency(currency)}
                  </h3>
                  <p
                    className={`text-xs leading-tight ${
                      priceChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {priceChange >= 0 ? "▲" : "▼"} {priceChange.toFixed(2)}% (
                    {timeFrame} days)
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0">
                {!prices?.status?.loading && data ? (
                  <Line
                    type="line"
                    data={data}
                    options={options}
                    height={128}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const OverviewChart: FC<{
  ids: string[];
  assets: Asset[];
  isWallet?: boolean;
  colors?: string[];
}> = ({ ids, assets, isWallet, colors }) => {
  return (
    <ChartContainer
      ids={ids}
      assets={assets}
      isWallet={isWallet}
      colors={colors}
    />
  );
};

export default OverviewChart;
