import { ChartData } from "chart.js";
import React, { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { Currencies, CustomState, getPrices } from "../../store/store";
import { formatCurrency, FRAMES } from "../../utils";
import { Asset, GroupedWallet, TimeFrame } from "../../utils/types";
import { useTheme } from "next-themes";

type TimeFrameProps = {
  selectedTimeFrame: string;
  setTimeFrame: (v: string) => void;
};

const TimeFrameControls: FC<TimeFrameProps> = ({ selectedTimeFrame, setTimeFrame }) => {
  const { setTheme } = useTheme();

  const darkMode = useSelector((state: CustomState) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [darkMode]);
  return (
    <div className="absolute top-2 left-2">
      <div className="grid grid-cols-4 grid-rows-1 gap-1">
        {FRAMES.map((frame: TimeFrame, idx: number) => {
          return (
            <div
              key={idx}
              className={`bg-white dark:bg-darkfg bg-opacity-75 rounded-sm hover:bg-brand-100 dark:hover:bg-brand-600 p-1 flex justify-center items-center cursor-pointer ${
                selectedTimeFrame === frame.value ? "bg-brand-100 border" : ""
              }`}
              onClick={() => setTimeFrame(frame.value)}
            >
              <p className="text-gray-600 dark:text-gray-300 text-xs">{frame.label}</p>
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
  wallet?: GroupedWallet;
}> = ({ ids, assets, isWallet, wallet }) => {
  const dispatch = useDispatch();

  //Store data
  const prices = useSelector((state: CustomState) => state.prices);
  const walletsPrices = useSelector((state: CustomState) => state.walletsPrices);
  const currency = useSelector((state: CustomState) => state.currency);

  //Local state
  // const [data, set_data] = useState<ChartData | undefined>(undefined);
  // const [timeFrame, setTimeFrame] = useState("1");
  // const [finalPrice, setFinalPrice] = useState(0);
  // const [priceChange, setPriceChange] = useState(0);

  //Functions
  // async function updateData(
  //   prices: number[][],
  //   currentPrice: { [currency: string]: number },
  //   currency: Currencies,
  //   totalPrice?: number,
  // ) {
  //   set_data({
  //     labels: prices?.map((p: number[]) => p[0]),
  //     datasets: [
  //       {
  //         data: prices?.map((p: number[]) => p[1]),
  //         fill: "start",
  //         backgroundColor: "#ffd0ea",
  //         borderColor: "#eb7cb8",
  //       },
  //     ],
  //   });
  //   const firstPrice = prices?.[0][1];
  //   const lastPrice = totalPrice || currentPrice?.[currency];
  //   setFinalPrice(lastPrice);
  //   setPriceChange(((lastPrice - firstPrice) / firstPrice) * 100);
  // }

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

  if (isWallet && wallet) {
    return (
      <div className={"absolute bottom-0 left-0 w-full h-1/2 z-0 opacity-25"}>
        {/* {!prices?.status?.loading && data ? (
          <Line type="line" data={data} options={options} height={128} />
        ) : null} */}
      </div>
    );
  } else {
    return (
      <div className={"h-44"}>
        {/* <div className="w-full">
          <div className="rounded-lg border border-gray-300 dark:border-black mb-4">
            <div className="rounded-lg bg-white dark:bg-darkbg relative overflow-hidden">
              <div className="px-3 pt-8 pb-10 text-center relative z-10">
                <TimeFrameControls selectedTimeFrame={timeFrame} setTimeFrame={setTimeFrame} />
                <div className={prices?.status?.loading ? "animate-pulse" : "animate-none"}>
                  <h4 className="text-sm uppercase text-gray-500 dark:text-gray-300 leading-tight">
                    Total assets
                  </h4>
                  <h3 className="text-3xl text-gray-700 dark:text-white font-semibold leading-tight my-3">
                    {finalPrice?.toFixed(2) + " " + formatCurrency(currency)}
                  </h3>
                  <p
                    className={`text-xs leading-tight ${
                      priceChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {priceChange >= 0 ? "▲" : "▼"} {priceChange.toFixed(2)}% ({timeFrame} days)
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0">
                {!prices?.status?.loading && data ? (
                  <Line type="line" data={data} options={options} height={128} />
                ) : null}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
};

const OverviewChart: FC<{
  ids: string[];
  assets: Asset[];
  isWallet?: boolean;
  wallet?: GroupedWallet;
}> = ({ ids, assets, isWallet, wallet }) => {
  return <ChartContainer ids={ids} assets={assets} isWallet={isWallet} wallet={wallet} />;
};

export default OverviewChart;
