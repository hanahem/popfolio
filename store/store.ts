import axios, { AxiosResponse } from "axios";
import { useMemo } from "react";
import { createStore, applyMiddleware, Store, AnyAction } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PortfolioDataBase } from "../utils/dbInit";
import { Asset, GroupedWallet, Wallet } from "../utils/types";

export type StatusType = {
  success: boolean;
  loading: boolean;
  error: boolean;
  errorMessage: string;
};

export type PricesType = {
  /*eslint-disable @typescript-eslint/no-explicit-any*/
  data: any;
  currentTotalAssets: {
    [currencyName: string]: number;
  };
  status: StatusType;
};

export type WalletsPricesType = {
  data: {
    [id: number]: {
      lastPrice: number;
      priceChange: number;
      prices: number[][];
    };
  }[];
  cumulativePrice: number;
  cumulativeChange: number;
};

export type WalletsPricesStatusType = StatusType;

export type DbType = {
  wallets: Wallet[];
  assets: Asset[];
  plainAssets: string[];
};

export enum Currencies {
  USD = "usd",
  EUR = "eur",
}

export enum ActionTypes {
  FETCH_PRICES_REQUEST = "FETCH_PRICES_REQUEST",
  FETCH_PRICES_FAILURE = "FETCH_PRICES_FAILURE",
  FETCH_PRICES_SUCCESS = "FETCH_PRICES_SUCCESS",

  FETCH_WALLETS_PRICES_REQUEST = "FETCH_WALLETS_PRICES_REQUEST",
  FETCH_WALLETS_PRICES_FAILURE = "FETCH_WALLETS_PRICES_FAILURE",
  FETCH_WALLETS_PRICES_SUCCESS = "FETCH_WALLETS_PRICES_SUCCESS",

  LOAD_DB_SUCCESS = "LOAD_DB_SUCCESS",

  UPDATE_CURRENCY = "UPDATE_CURRENCY",
  UPDATE_DARKMODE = "UPDATE_DARKMODE",
}

let store: Store | undefined;

export type CustomState = {
  darkMode: boolean;
  currency: Currencies;
  prices: PricesType;
  walletsPrices?: WalletsPricesType;
  walletsPricesStatus?: WalletsPricesStatusType;
  db?: DbType;
};

const initialState: CustomState = {
  darkMode: false,
  currency: Currencies.USD,
  prices: {
    data: {},
    currentTotalAssets: {
      eur: 0.0,
      usd: 0.0,
    },
    status: {
      success: false,
      loading: false,
      error: false,
      errorMessage: "",
    },
  },
  walletsPrices: undefined,
  walletsPricesStatus: undefined,
  db: undefined,
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    /**
     * Fetch wallets prices Reducers
     */
    case ActionTypes.FETCH_WALLETS_PRICES_REQUEST:
      return {
        ...state,
        walletsPricesStatus: {
          success: false,
          loading: true,
          error: false,
          errorMessage: "",
        },
      };
    case ActionTypes.FETCH_WALLETS_PRICES_FAILURE:
      return {
        ...state,
        walletsPricesStatus: {
          success: false,
          loading: false,
          error: true,
          errorMessage: action.payload.errorMessage,
        },
      };
    case ActionTypes.FETCH_WALLETS_PRICES_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        walletsPrices: action.payload,
        walletsPricesStatus: {
          success: true,
          loading: false,
          error: false,
          errorMessage: "",
        },
      };
    /**
     * Load Db Reducers
     */
    case ActionTypes.LOAD_DB_SUCCESS:
      return {
        ...state,
        db: action.payload,
      };
    case ActionTypes.UPDATE_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };
    case ActionTypes.UPDATE_DARKMODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(reducer, preloadedState, composeWithDevTools(applyMiddleware()));
}

export const initializeStore = (preloadedState: CustomState): Store<any, AnyAction> => {
  let _store = store || initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: CustomState): Store<any, AnyAction> {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

/*
 ** Actions utils
 */

export const getMarketChartURI = (coinId: string, days: string): string =>
  `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${
    store?.getState().currency
  }&days=${days}`;

export const getSimplePriceURI = (ids: string[]): string =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,eur`;

/*
 ** Price Actions
 */

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

export async function loadWalletsData(
  gWallets: GroupedWallet[],
  timeFrame: string,
): Promise<AnyAction | void> {
  store?.dispatch({
    type: ActionTypes.FETCH_WALLETS_PRICES_REQUEST,
  });

  try {
    const allUsedTokens = [
      ...new Set(flatten(gWallets.map((gw: GroupedWallet) => gw.assets.map((a) => a.cgId)))),
    ] as string[];
    await Promise.all(
      allUsedTokens.map(
        async (cgId: string) =>
          await axios
            .get(getMarketChartURI(cgId, timeFrame))
            .then((res) => {
              const data = { [cgId]: res.data.prices };
              return data;
            })
            .catch((e) => console.error("Load prices of " + cgId + ": ", e)),
      ),
    )
      .then((res) => {
        //Format all tokens to {[token]: prices[][]}
        let data = {};
        res.map((r) => Object.assign(data, r));

        const shortestArray = res
          .map((r) => Object.keys(r).map((key) => r[key]))
          .reduce((prev, next) => (prev.length > next.length ? next : prev))[0];
        const timeScale = flatten(shortestArray.map((sa) => sa[0]));

        const shortenedData = Object.keys(data).map((key) => {
          let timedData = [];
          if (data[key].length > shortestArray.length) {
            timedData = data[key].slice(
              data[key].length - shortestArray.length - 1,
              data[key].length - 1,
            );
          } else {
            timedData = data[key];
          }
          return { [key]: timedData.map((t, idx) => [timeScale[idx], t[1]]) };
        });

        let formattedData = {};
        shortenedData.map((r) => Object.assign(formattedData, r));

        //Format from tokens to wallets {[walletId]: {prices[][], lastPrice, priceChange}}
        const formattedWallets = gWallets.map((gw) => ({
          [(gw.id as number).toString()]: gw.assets
            .map((a) => a.cgId)
            .map((cgId) => {
              const prices = formattedData[cgId];
              const lastPrice = prices[prices.length - 1][1];
              const firstPrice = prices[0][1];
              const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
              return {
                [cgId]: {
                  prices,
                  lastPrice,
                  priceChange,
                },
              };
            }),
        }));

        // const cumulativePrice = formattedWallets.map((fw) => {
        //   Object.keys(fw).map((key) =>
        //     // Object.keys(fw[key]).map((k2) => fw[key][k2].reduce((a, b) => a[1] + b[1])),
            
        //   );
        // });

        return store?.dispatch({
          type: ActionTypes.FETCH_WALLETS_PRICES_SUCCESS,
          payload: {
            data: formattedWallets,
            cumulativePrice: 0,
            cumulativeChange: 0,
          },
        });
      })
      .catch((e) => {
        console.error("Load prices promise error ", e);
        return store?.dispatch({
          type: ActionTypes.FETCH_WALLETS_PRICES_FAILURE,
          payload: { errorMessage: "Failed to load prices data" },
        });
      });
  } catch (e) {
    console.error("Load prices error ", e);
    return store?.dispatch({
      type: ActionTypes.FETCH_WALLETS_PRICES_FAILURE,
      payload: { errorMessage: "Failed to load prices data" },
    });
  }
}

export async function loadDb(db: PortfolioDataBase): Promise<AnyAction | void> {
  const assets = await db.assets.toArray();
  const wallets = await db.wallets.toArray();
  if (db) {
    return store?.dispatch({
      type: ActionTypes.LOAD_DB_SUCCESS,
      payload: {
        wallets,
        assets,
        plainAssets: assets.map((a) => a.cgId).filter((item, i, ar) => ar.indexOf(item) === i),
      },
    });
  }
}

export function updateCurrency(): void {
  const currency = store?.getState().currency;
  const nextCurrency = currency === Currencies.EUR ? Currencies.USD : Currencies.EUR;
  store?.dispatch({
    type: ActionTypes.UPDATE_CURRENCY,
    payload: nextCurrency,
  });
}

export function updateDarkMode(): void {
  const darkMode = store?.getState().darkMode;
  store?.dispatch({
    type: ActionTypes.UPDATE_DARKMODE,
    payload: !darkMode,
  });
}
