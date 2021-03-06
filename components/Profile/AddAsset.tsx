import React, { FC, SyntheticEvent, useEffect, useState } from "react";
import { db } from "../../utils/dbInit";
import { Asset, Wallet } from "../../utils/types";
import SearchAsset from "../Generics/SearchAsset";
import SearchWallet from "../Generics/SearchWallet";

const AddAsset: FC = () => {
  const [asset, setAsset] = useState<Asset>({
    walletId: "",
    name: "",
    ticker: "",
    icon: "",
    amount: 0.0,
  });
  const [wallets, setWallets] = useState<Wallet[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      if (db && !loading) {
        const table = await db.wallets.toArray();
        setWallets(table);
      }
    })();
  }, [db, loading]);

  const handleChangeAmount = (event: SyntheticEvent): void => {
    const { value } = event.target as HTMLInputElement;
    if (value.match(/[+-]?([0-9]*[.])?[0-9]+/)) {
      setAsset({
        ...asset,
        amount: parseFloat(value),
      });
    }
  };

  const addAsset = async (asset: Asset): Promise<void> => {
    setLoading(true);
    await db.addAsset(asset);
    setLoading(false);
  };

  return (
    <div className="board flex flex-col">
      <p className="text-xl">Add an asset</p>
      <p className="font-light text-sm">
        You can your assets and the right amounts, then link them to the wallets you created.
      </p>
      <form className="mt-4 flex flex-col" onSubmit={() => addAsset(asset)}>
        <SearchAsset setAsset={setAsset} asset={asset} />
        <SearchWallet setAsset={setAsset} asset={asset} wallets={wallets} />
        <div className="form-input">
          <label>Amount *</label>
          <input
            placeholder="Binance, Coinbase, Metamask 1..."
            onChange={handleChangeAmount}
            value={asset.amount}
          />
        </div>
        <button type="submit" className="btn-primary mt-4" disabled={!asset}>
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default AddAsset;
