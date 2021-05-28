import { useRouter } from "next/dist/client/router";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomState } from "../../store/store";
import { Asset, Wallet, WalletPriceData } from "../../utils/types";
import BackButton from "../Generics/BackButton";
import WalletAssets from "../Wallet/WalletAssets";
import WalletHeader from "../Wallet/WalletHeader";

const WalletScreen: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [wallet, setWallet] =
    useState<{ wallet: Wallet; walletPriceData: WalletPriceData } | undefined>();
  const [assets, setAssets] = useState<Asset[] | undefined>();
  const walletsPrices = useSelector((state: CustomState) => state.walletsPrices);
  const storeDb = useSelector((state: CustomState) => state.db);

  useEffect(() => {
    if (
      storeDb?.wallets &&
      storeDb?.wallets.length &&
      storeDb?.assets &&
      storeDb?.assets.length &&
      walletsPrices
    ) {
      const walletDb = storeDb.wallets.find((w: Wallet) => w.id === parseInt(id as string));
      const walletPriceData = walletsPrices[parseInt(id as string)];
      const walletAssets = storeDb.assets.filter((a: Asset) => a.walletId === id);
      setWallet({ wallet: walletDb as Wallet, walletPriceData });
      setAssets(walletAssets);
    }
  }, [walletsPrices, storeDb, id]);

  return (
    <div>
      <BackButton />
      {wallet ? (
        <WalletHeader wallet={wallet?.wallet} walletPriceData={wallet?.walletPriceData} />
      ) : (
        <div className="animate-pulse bg-gray-200 w-72 h-28 rounded" />
      )}
      {assets ? (
        <WalletAssets assets={assets} />
      ) : (
        <div className="animate-pulse bg-gray-200 w-full h-96 rounded mt-12" />
      )}
    </div>
  );
};

export default WalletScreen;
