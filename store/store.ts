import { useMemo } from "react";
import { createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Assets, Portfolio } from "../utils/types";
import { reducer } from "./portfolio/reducers";

export let store: Store | undefined;

export type CustomState = {
  wallets: Portfolio;
  assets: Assets;
};

export const initialState: CustomState = { wallets: {}, assets: [] };

export enum ActionTypes {
  IDBTX_START = "IDBTX_START",
  IDBTX_SUCC = "IDBTX_SUCC",
  IDBTX_FAIL = "IDBTX_FAIL",
}

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
}

export const initializeStore = (preloadedState: CustomState) => {
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

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
