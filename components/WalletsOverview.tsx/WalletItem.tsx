import React, { FC, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CustomState } from "../../store/store";
import { formatCurrency } from "../../utils";
import { Asset, GroupedWallet } from "../../utils/types";
import OverviewChart from "../Charts/OverviewChart";

const WalletItem: FC<{ wallet: GroupedWallet }> = ({ wallet }) => {
  const storeDb = useSelector((state: CustomState) => state.db);
  const walletsPrices = useSelector((state: CustomState) => state.walletsPrices);
  const currency = useSelector((state: CustomState) => state.currency);

  const [priceChange, setPriceChange] = useState(0);

  const { icon, name, assets, id } = wallet;
  
  const walletsData = walletsPrices?.[id as number];

  useEffect(() => {
    if (walletsData && currency) {
      const firstPrice = walletsData.data[0][1];
      setPriceChange(((walletsData.currentTotalAssets[currency] - firstPrice) / firstPrice) * 100);
    }
  }, [walletsData, currency]);

  return (
    <div className="board flex items-start justify-between relative h-28">
      <div className="flex items-start z-10">
        <div className="flex relative bg-orange-500 justify-center items-center w-12 h-12">
          <img className="rounded-full w-12 h-12" alt={name} src={icon} />
        </div>
        <div className="flex flex-col items-start ml-6">
          <p className="font-semibold">{name}</p>
          <p className="font-light text-sm">{`${assets.length} asset${
            assets.length > 1 ? "s" : ""
          }`}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-sm">
          {walletsData && walletsData.currentTotalAssets
            ? walletsData.currentTotalAssets[currency].toFixed(2) + " " + formatCurrency(currency)
            : "--"}
        </p>
        <p
          className={`text-xs leading-tight ${
            priceChange >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {priceChange >= 0 ? "▲" : "▼"} {priceChange.toFixed(2)}% (1 days)
        </p>
      </div>
      {storeDb ? (
        <OverviewChart
          ids={assets.map((asset: Asset) => asset.cgId as string)}
          assets={assets}
          isWallet
          wallet={wallet}
        />
      ) : null}
    </div>
  );
};

export default WalletItem;
