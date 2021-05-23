import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Wallet } from "../../utils/types";

const AddWallet: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Wallet>();
  const onSubmit: SubmitHandler<Wallet> = (data) => console.log(data);
  return (
    <div className="board flex flex-col">
      <p className="text-xl">Add a wallet</p>
      <p className="font-light text-sm">
        You can add any wallet you own in any app to link assets to it and be
        able to monitor it.
      </p>
      <form className="mt-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-input">
          <label>Icon (optional)</label>
          <input placeholder="A valid icon image URL" {...register("icon")} />
        </div>

        <div className="form-input">
          <label>Name *</label>
          <input placeholder="Binance, Coinbase, Metamask 1..." {...register("name", { required: true })} />
          {errors.name && <span className="text-red-500 text-xs">This field is required</span>}
        </div>

        <button type="submit" className="btn-primary mt-4">Add Wallet</button>
      </form>
    </div>
  );
};

export default AddWallet;
