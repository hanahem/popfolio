import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { db } from "../../utils/dbInit";
import { Asset, Wallet } from "../../utils/types";
import SearchAsset from "../Generics/SearchAsset";
import SearchWallet from "../Generics/SearchWallet";

const AddAsset: FC = () => {
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

  const { handleSubmit } = useForm<Asset>();
  const [asset, setAsset] = useState<Asset | undefined>();
  const onSubmit: SubmitHandler<Asset> = (data) => console.log(data);

  console.log(wallets)

  return (
    <div className="board flex flex-col">
      <p className="text-xl">Add an asset</p>
      <p className="font-light text-sm">
        You can your assets and the right amounts, then link them to the wallets
        you created.
      </p>
      <form className="mt-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <SearchAsset setAsset={setAsset} asset={asset} />
        <SearchWallet setAsset={setAsset} asset={asset} wallets={wallets} />

        <button type="submit" className="btn-primary mt-4" disabled={!asset}>
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default AddAsset;
