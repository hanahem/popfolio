import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { db } from "../../utils/dbInit";
import { Asset, Wallet } from "../../utils/types";
import AssetSearchBar from "../Generics/AssetSearchBar";
import SelectItem from "../Generics/SelectItem";

const AddAsset: FC = () => {
  const [openSelectWallet, setOpenSelectWallet] = useState(false);
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

  console.log(wallets);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Asset>();
  const onSubmit: SubmitHandler<Asset> = (data) => console.log(data);

  return (
    <div className="board flex flex-col">
      <p className="text-xl">Add an asset</p>
      <p className="font-light text-sm">
        You can your assets and the right amounts, then link them to the wallets
        you created.
      </p>
      <form className="mt-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="form-input">
          <label>Name</label>
          <input
            placeholder="Ethereum, Bitcoin, ShibaInu..."
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div> */}

        <AssetSearchBar />

        <div className="form-input">
          <label>Linked Wallet</label>
          <div className="relative">
            <input
              className="w-full bg-white"
              placeholder="Binance, Coinbase, Metamask 1 ..."
              {...register("walletId", { required: true })}
              onFocus={() => setOpenSelectWallet(!openSelectWallet)}
              onBlur={() => setOpenSelectWallet(!openSelectWallet)}
            />
            {errors.walletId && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
            {openSelectWallet ? (
              <div
                onBlur={() => setOpenSelectWallet(false)}
                className="absolute shadow-lg bg-white top-100 z-40 w-full left-0"
              >
                <div className="relative h-60 overflow-y-scroll">
                  {wallets
                    ? wallets.map((w: Wallet, idx: number) => {
                        return <SelectItem key={idx} title={w.icon} />;
                      })
                    : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <button type="submit" className="btn-primary mt-4">
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default AddAsset;
