import React, { FC, SyntheticEvent, useState } from "react";
import { getWalletById } from "../../utils";
import { Asset, Wallet } from "../../utils/types";
import SelectItem from "./SelectItem";

const SearchWallet: FC<{
  setAsset: (a: Asset) => void;
  asset: Asset;
  wallets?: Wallet[];
}> = ({ setAsset, asset, wallets }) => {
  const [openSelectWallet, setOpenSelectWallet] = useState(false);

  const selectWallet = (event: SyntheticEvent, wallet: Wallet) => {
    event.preventDefault();
    setAsset({
      ...asset,
      walletId: wallet.id?.toString(),
    });
    setOpenSelectWallet(false);
  };

  return (
    <div className="form-input">
      <label>Linked Wallet *</label>
      <div className="relative">
        <input
          className="w-full bg-white cursor-pointer"
          value={
            getWalletById(wallets as Wallet[], asset?.walletId as string)?.name
          }
          placeholder="Binance, Coinbase, Metamask 1 ..."
          onFocus={() => setOpenSelectWallet(true)}
          onBlur={() => setOpenSelectWallet(false)}
        />
        {openSelectWallet ? (
          <div
            onBlur={() => setOpenSelectWallet(false)}
            className="absolute shadow-lg bg-white top-100 z-40 w-full left-0"
          >
            <div className="relative h-60 overflow-y-scroll">
              {wallets ? (
                wallets.map((w: Wallet) => {
                  return (
                    <div
                      key={w.id as number}
                      onMouseDown={(e) => selectWallet(e, w)}
                    >
                      <SelectItem icon={w.icon} title={w.name} />
                    </div>
                  );
                })
              ) : (
                <p className="m-4 text-sm">Add a wallet first</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchWallet;
