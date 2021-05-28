import React, { FC } from "react";
import { useSelector } from "react-redux";
import { CustomState } from "../../store/store";
import { formatCurrency } from "../../utils";
import { Asset } from "../../utils/types";

const headers = ["Asset", "Quantity", "Price", "Allocation", "Share"];

const WalletAssetItem: FC<{ asset: Asset }> = ({ asset }) => {
  const { icon, ticker, name, amount, currentPrice, walletId } = asset;

  const currency = useSelector((state: CustomState) => state.currency);
  const walletsPrices = useSelector((state: CustomState) => state.walletsPrices);

  const totalWalletAmount = walletsPrices?.[parseInt(walletId as string)].currentTotalAssets[
    currency
  ] as number;
  const currentPriceFiat = currentPrice?.[currency];
  const allocation = (amount as number) * (currentPriceFiat as number);
  const share = (allocation * 100) / totalWalletAmount;

  return (
    <div className="w-full grid grid-cols-6 rounded hover:bg-gray-100 dark:bg-darkgray my-1 p-2">
      <div className="col-span-2 flex justify-start items-center">
        <img className="rounded-full w-5 h-5" alt={name} src={icon} />
        <p className="ml-2">{name}</p>
      </div>
      <p className="text-right">{amount + " " + ticker.toUpperCase()}</p>
      <p className="text-right">{currentPriceFiat?.toFixed(2) + formatCurrency(currency)}</p>
      <p className="text-right">{allocation.toFixed(2) + formatCurrency(currency)}</p>
      <p className="text-right">{share.toPrecision(2)}%</p>
    </div>
  );
};

const WalletAssets: FC<{ assets: Asset[] }> = ({ assets }) => {
  console.log(assets);
  return (
    <div className="mt-12 w-full 2xl:w-2/3 flex flex-col pt-2 border-t border-gray-200">
      <p className="text-xl font-semibold my-4">Assets</p>
      <div className="grid grid-cols-6 px-2">
        {headers.map((h: string, idx: number) => {
          return (
            <div className={idx === 0 ? `col-span-2` : "justify-end"}>
              <p
                key={idx}
                className={`font-semibold text-sm ${idx === 0 ? `text-left` : "text-right"}`}
              >
                {h}
              </p>
            </div>
          );
        })}
      </div>
      <div className={"mt-4"}>
        {assets.map((asset: Asset, idx: number) => {
          return <WalletAssetItem key={idx} asset={asset} />;
        })}
      </div>
    </div>
  );
};

export default WalletAssets;
