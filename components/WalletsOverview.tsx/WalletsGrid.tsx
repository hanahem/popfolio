import React, { FC } from "react";
import { GroupedWallet } from "../../utils/types";
import WalletItem from "./WalletItem";

const WalletsGrid: FC<{ wallets: GroupedWallet[] }> = ({ wallets }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
      {wallets.map((wallet: GroupedWallet) => {
        return <WalletItem wallet={wallet} key={wallet.id} />;
      })}
    </div>
  );
};

export default WalletsGrid;
