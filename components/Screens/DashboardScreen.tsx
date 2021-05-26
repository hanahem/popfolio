import React, { FC, useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomState, loadDb } from "../../store/store";
import { lottieAnimation } from "../../utils/animation";
import { db } from "../../utils/dbInit";
import { Asset, GroupedWallet, Wallet } from "../../utils/types";
import OverviewChart from "../Charts/OverviewChart";
import Title from "../Generics/Title";
import WalletsGrid from "../WalletsOverview.tsx/WalletsGrid";

const DashboardScreen: FC = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const dispatch = useDispatch();

  const storeDb = useSelector((state: CustomState) => state.db);

  useEffect(() => {
    (async function () {
      try {
        dispatch(loadDb(db));
      } catch (e) {
        console.error("DB load error: ", e);
      }
    })();
  }, [db]);

  const [groupedAssets, setGroupedAssets] = useState<GroupedWallet[] | undefined>();

  useEffect(() => {
    if (storeDb?.wallets && storeDb?.assets) {
      const wallets = storeDb.wallets.map((wallet: Wallet) => ({
        ...wallet,
        assets: storeDb.assets.filter((asset: Asset) => asset.walletId === wallet.id?.toString()),
      }));
      setGroupedAssets(wallets);
    }
  }, [storeDb]);

  return (
    <div>
      <Title title="Overview" subtitle="An overview of your portfolio and assets performance" />
      <div className="w-full my-8">
        {storeDb ? (
          <OverviewChart ids={storeDb.plainAssets} assets={storeDb.assets} />
        ) : (
          <div className="h-44 animate-pulse" />
        )}
      </div>
      <Title title="Wallets" />
      <div className="mt-4">
        {storeDb && groupedAssets?.length ? (
          <WalletsGrid wallets={groupedAssets} />
        ) : (
          <div className="h-20 flex-col flex justify-center items-center">
            <lottie-player
              ref={lottieRef}
              autoplay
              loop
              mode={"normal"}
              src={JSON.stringify(lottieAnimation)}
              className={"absolute inset-0 w-full h-full object-cover"}
            />
            <p className="text-sm mt-2">{"You don't have any wallets or assets yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
