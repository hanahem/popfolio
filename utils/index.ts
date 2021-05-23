import { Wallet } from "./types";

export const getWalletById = (
  wallets: Wallet[],
  id: string
): Wallet | undefined => {
  return wallets?.find((w) => w.id?.toString() === id);
};
