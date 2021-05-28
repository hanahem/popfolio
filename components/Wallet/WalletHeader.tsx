import React, { FC } from "react";
import { useSelector } from "react-redux";
import { CustomState } from "../../store/store";
import { formatCurrency } from "../../utils";
import { Wallet, WalletPriceData } from "../../utils/types";

const WalletHeader: FC<{ wallet: Wallet; walletPriceData: WalletPriceData }> = ({
  wallet,
  walletPriceData,
}) => {
  const currency = useSelector((state: CustomState) => state.currency);

  const { name, icon } = wallet;
  const { currentTotalAssets, data } = walletPriceData;
  const total = currentTotalAssets[currency];
  const priceChange = (total - data[0][1]) / data[0][1];

  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-start items-center">
        <img className="rounded-full w-12 h-12" alt={name} src={icon} />
        <p className="text-3xl ml-4">{name}</p>
      </div>
      <div className="flex justify-start items-baseline mt-4">
        <p className="text-4xl font-light">{total.toFixed(2) + formatCurrency(currency)}</p>
        <p
          className={`ml-3 leading-tight ${
            priceChange >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {priceChange >= 0 ? "▲" : "▼"} {priceChange.toFixed(2)}% (1 day)
        </p>
      </div>
    </div>
  );
};

export default WalletHeader;
