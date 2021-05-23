import { AnyAction } from "redux";
import { PortfolioDataBase } from "../../utils/dbInit";
import { Wallet } from "../../utils/types";
import { ActionTypes, store } from "../store";

export const idbtx = async (
  wallet: Wallet,
  db: PortfolioDataBase
): Promise<AnyAction | void> => {
  store?.dispatch({
    type: ActionTypes.IDBTX_START,
  });
  await db.addWallet(wallet);
};
