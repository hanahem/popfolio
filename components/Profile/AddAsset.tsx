import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { db } from "../../utils/dbInit";
import { Asset, Wallet } from "../../utils/types";
import SelectItem from "../Generics/SelectItem";

const AddAsset: FC = () => {
  const [openSelect, setOpenSelect] = useState(false);
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

  console.log(wallets)

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
        <div className="form-input">
          <label>Name</label>
          <input
            placeholder="Ethereum, Bitcoin, ShibaInu..."
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        <div className="form-input">
          <label>Ticker</label>
          <input
            placeholder="ETH, BTC, SHIB..."
            {...register("ticker", { required: true })}
          />
          {errors.ticker && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>

        <div className="form-input">
          <label>Icon</label>
          <input
            placeholder="Place a valid token icon URL"
            {...register("icon", { required: true })}
          />
          {errors.icon && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>

        <div className="form-input">
          <label>Linked Wallet</label>
          <div className="relative">
            <input
              className="w-full bg-white"
              placeholder="Binance, Coinbase, Metamask 1 ..."
              {...register("walletId", { required: true })}
              onClick={() => setOpenSelect(!openSelect)}
            />
            {errors.walletId && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
            {openSelect ? (
              <div
                onBlur={() => setOpenSelect(false)}
                className="absolute shadow-lg bg-white top-100 z-40 w-full lef-0 overflow-y-scroll"
              >
                {wallets?.map((w: Wallet) => {
                    <SelectItem icon={w.icon} />
                })}
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
