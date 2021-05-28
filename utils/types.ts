export type Asset = {
  walletId?: string;
  name: string;
  ticker: string;
  address?: string;
  icon: string;
  currentPrice?: { [currency: string]: number };
  amount?: number;
  cgId?: string;
};

export type Assets = Asset[] | undefined[];

export interface ListedAsset extends Asset {
  amount: number;
  evolutionPts?: number;
  evolutionPrice?: number;
}

export type Wallet = {
  id?: number;
  walletId?: string;
  name: string;
  icon: string;
  totalValue?: number;
  totalEvolutionPts?: number;
  totalEvolutionPrice?: number;
};

export interface Portfolio {
  [walletId: string]: Wallet;
}

export interface GroupedWallet extends Wallet {
  assets: Asset[];
}

export type WalletPriceData = {
  /*eslint-disable @typescript-eslint/no-explicit-any*/
  data: any;
  currentTotalAssets: {
    [currecyName: string]: number;
  };
};

export type CryptoPrice = {
  date: string;
  close: number;
};

export type TimeFrame = {
  label: string;
  value: string;
};
