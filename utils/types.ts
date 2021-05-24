export type Asset = {
  walletId?: string;
  name: string;
  ticker: string;
  address?: string;
  icon: string;
  currentPrice?: number;
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

export type CryptoPrice = {
  date: string;
  close: number;
};

export type TimeFrame = {
  label: string;
  value: string;
};
