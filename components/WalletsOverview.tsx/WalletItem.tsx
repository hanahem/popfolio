import React, { FC } from "react";
import { useSelector } from "react-redux";
import { CustomState } from "../../store/store";
import { Asset, GroupedWallet } from "../../utils/types";
import OverviewChart from "../Charts/OverviewChart";

const WalletItem: FC<{ wallet: GroupedWallet }> = ({ wallet }) => {
  const storeDb = useSelector((state: CustomState) => state.db);
  const { icon, name, assets, id } = wallet;
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
      <div className=""></div>
      {storeDb ? (
        <OverviewChart
          ids={assets.map((asset: Asset) => asset.cgId as string)}
          assets={assets}
          isWallet
        />
      ) : null}
    </div>
  );
};

export default WalletItem;
