import axios from "axios";
import { useMemo } from "react";
import { createStore, applyMiddleware, Store, AnyAction } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PortfolioDataBase } from "../utils/dbInit";
import { Asset, Wallet } from "../utils/types";

export type PricesType = {
  /*eslint-disable @typescript-eslint/no-explicit-any*/
  data: any;
  currentTotalAssets: {
    [currencyName: string]: number;
  };
  status: {
    success: boolean;
    loading: boolean;
    error: boolean;
    errorMessage: string;
  };
};

export type WalletsPricesType = {
  [id: number]: {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    data: any;
    currentTotalAssets: {
      [currecyName: string]: number;
    };
  };
};

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
  FETCH_WALLET_PRICES_SUCCESS = "FETCH_WALLET_PRICES_SUCCESS",

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
  db: undefined,
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.FETCH_PRICES_REQUEST:
      return {
        ...state,
        prices: {
          ...state.prices,
          status: {
            success: false,
            loading: true,
            error: false,
            errorMessage: "",
          },
        },
      };
    case ActionTypes.FETCH_PRICES_FAILURE:
      return {
        ...state,
        prices: {
          ...state.prices,
          status: {
            success: false,
            loading: false,
            error: true,
            errorMessage: action.payload.errorMessage,
          },
        },
      };
    case ActionTypes.FETCH_PRICES_SUCCESS:
      return {
        ...state,
        prices: {
          data: action.payload.prices,
          currentTotalAssets: action.payload.currentTotalAssets,
          status: {
            success: true,
            loading: false,
            error: false,
            errorMessage: "",
          },
        },
      };
    case ActionTypes.FETCH_WALLET_PRICES_SUCCESS:
      return {
        ...state,
        walletsPrices: {
          ...state.walletsPrices,
          [action.payload.walletId]: {
            data: action.payload.prices,
            currentTotalAssets: action.payload.currentTotalAssets,
          },
        },
        prices: {
          status: {
            success: true,
            loading: false,
            error: false,
            errorMessage: "",
          },
        },
      };
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

export async function getPrices(
  timeFrame: string,
  ids: string[],
  assets: Asset[],
  walletId?: number,
): Promise<AnyAction | void> {
  store?.dispatch({
    type: ActionTypes.FETCH_PRICES_REQUEST,
  });

  if (ids && assets && assets.length) {
    await Promise.all(ids.map((id) => axios.get(getMarketChartURI(id, timeFrame))))
      // SUCCESS
      .then(async (res) => {
        const data: { [id: string]: number[][] }[] = await Promise.all(
          res.map((r) => ({
            [r.request.responseURL.split("/")[6]]: r.data.prices,
          })),
        );

        const assetsAmounts: { [key: string]: number } = assets.reduce(
          (obj, item) =>
            Object.assign(obj, {
              [item.cgId as string]: item.amount as number,
            }),
          {},
        );

        const aggPrices = await axios.get(getSimplePriceURI(ids)).then((r) => r.data);
        const currentTotalAssets = {
          eur: Object.keys(aggPrices)
            .map((key) => aggPrices[key].eur * assetsAmounts[key])
            .reduce((a, b) => a + b),
          usd: Object.keys(aggPrices)
            .map((key) => aggPrices[key].usd * assetsAmounts[key])
            .reduce((a, b) => a + b),
        };

        const aggTimes = ids.map((id, idx) => data[idx][id].map((dt) => dt[0]));
        const shortestArray = aggTimes.reduce((prev, next) =>
          prev.length > next.length ? next : prev,
        );

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const objData: { [key: string]: any } = { ...data.map((dt, idx) => dt[ids[idx]]) };
        const objDataArray = Object.keys(objData).map((k) => objData[k]);

        //Array of price arrays for each asset in crypto
        const basePricesMatrix = objDataArray
          .map((oba) => [oba.map((p: number[]) => p[1])])
          .map((pm) => pm[0]);
        //Array of price arrays for each asset in fiat based on amount
        const pricesMatrix = basePricesMatrix.map((pm, idx) =>
          pm.map((val: number) => val * assetsAmounts[ids[idx]]),
        );

        //Fully computed prices with shortest array timestamps
        const compPrices = shortestArray.map((sa: number, idx: number) => [
          sa,
          pricesMatrix[0].map((_: null, jdx: number) =>
            pricesMatrix.reduce((sum, curr) => sum + curr[jdx], 0),
          )[idx],
        ]);

        if (walletId) {
          return store?.dispatch({
            type: ActionTypes.FETCH_WALLET_PRICES_SUCCESS,
            payload: {
              prices: compPrices,
              currentTotalAssets: currentTotalAssets,
              walletId,
            },
          });
        } else {
          return store?.dispatch({
            type: ActionTypes.FETCH_PRICES_SUCCESS,
            payload: {
              prices: compPrices,
              currentTotalAssets: currentTotalAssets,
            },
          });
        }
      })
      // FAILURE
      .catch((err) => {
        console.error(err);
        return store?.dispatch({
          type: ActionTypes.FETCH_PRICES_FAILURE,
          payload: { errorMessage: "Failed to load prices data" },
        });
      });
  } else {
    return store?.dispatch({
      type: ActionTypes.FETCH_PRICES_FAILURE,
      payload: {
        errorMessage: "You don't have assets in your portfolio. Add some from your profile board.",
      },
    });
  }
}

export async function loadDb(db: PortfolioDataBase): Promise<void> {
  const assets = await db.assets.toArray();
  const wallets = await db.wallets.toArray();
  if (db) {
    store?.dispatch({
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
