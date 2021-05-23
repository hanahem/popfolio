import Dexie from "dexie";
import { Asset, Wallet } from "./types";

export class PortfolioDataBase extends Dexie {
  wallets: Dexie.Table<Wallet, number>;
  assets: Dexie.Table<Asset, number>;

  constructor() {
    super("app");
    this.version(1).stores({
      wallets: "++id, walletId, name, icon",
      assets: "++id, walletId, name, ticker, icon",
    });
    this.wallets = this.table("wallets");
    this.assets = this.table("assets");
  }

  /*
   ** Wallets
   */

  addWallet = (wallet: Wallet) => {
    const { walletId, name, icon } = wallet;
    db.wallets
      .add({
        walletId,
        name,
        icon,
      })
      .catch((e: any) => {
        alert("error: " + e.stack || e);
      });
  };

  updateWallet = (wallet: Wallet, id: string) => {
    db.wallets.where("id").equals(id).modify({ wallet });
  };

  /*
   ** Assets
   */

  updateAsset = (asset: Asset, id: string) => {
    db.assets.where("id").equals(id).modify({ asset });
  };

  addAsset = (asset: Asset) => {
    db.assets.add(asset).catch((e: any) => {
      alert("error: " + e.stack || e);
    });
  };
}

export const db = new PortfolioDataBase();
