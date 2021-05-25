import React, { FC } from "react";
import { GroupedWallet } from "../../utils/types";

const WalletItem: FC<{ wallet: GroupedWallet }> = ({ wallet }) => {
  const { icon, name, assets } = wallet;
  return (
    <div className="board flex items-center justify-between">
      <div className="flex items-center">
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
      <div></div>
    </div>
  );
};

export default WalletItem;
