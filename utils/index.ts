import { Currencies } from "../store/store";
import { TimeFrame, Wallet } from "./types";

/*
 ** Util functions
 */

export function getWalletById(
  wallets: Wallet[],
  id: string
): Wallet | undefined {
  return wallets?.find((w) => w.id?.toString() === id);
}

export function fromEntries<T>(entries: [keyof T, T[keyof T]][]): T {
  return entries.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    <T>{}
  );
}

export function formatCurrency(currency: Currencies): string {
  return currency === Currencies.EUR ? "€" : "$";
}

export function factorAssetPrices(
  assetsPrices: { [key: string]: number[] },
  assetsAmounts: { [key: string]: number }
) {
  Object.keys(assetsPrices).map((id) => {
    const factorPrice = assetsAmounts[id] * assetsPrices[id][1];
    return [assetsPrices[id][0], factorPrice];
  });
}

/*
 ** Utils constants
 */

export const CHART_OPTS = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "rgba(255, 255, 255, 1)",
        },
        gridLines: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "rgba(255, 255, 255, 1)",
        },
        gridLines: {
          color: "rgba(255, 255, 255, .2)",
          borderDash: [5, 5],
          zeroLineColor: "rgba(255, 255, 255, .2)",
          zeroLineBorderDash: [5, 5],
        },
      },
    ],
  },
  layout: {
    padding: {
      right: 10,
    },
  },
};

export const FRAMES: TimeFrame[] = [
  {
    label: "ALL",
    value: "max",
  },
  {
    label: "1M",
    value: "30",
  },
  {
    label: "1W",
    value: "7",
  },
  {
    label: "1D",
    value: "1",
  },
];
