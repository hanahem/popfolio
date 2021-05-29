import { useTheme } from "next-themes";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomState, loadWalletsData } from "../../store/store";
import { GroupedWallet, Wallet, Asset } from "../../utils/types";

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { setTheme } = useTheme();

  const darkMode = useSelector((state: CustomState) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [darkMode]);

  const dispatch = useDispatch();

  const storeDb = useSelector((state: CustomState) => state.db);
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

  useEffect(() => {
    (async function () {
      try {
        if (groupedAssets) {
          await dispatch(loadWalletsData(groupedAssets, "1"));
        }
      } catch (e) {
        //TODO: add dispatch error
        console.error("Wallets data load error: ", e);
      }
    })();
  }, [groupedAssets]);

  return <>{children}</>;
};

export default AppProvider;
