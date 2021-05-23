import { AnyAction } from "redux";
import { initialState } from "../store";

export const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "INIT_PORTFOLIO":
      return {
        ...state,
        portfolio: action.payload,
      };
    case "ADD_WALLET":
      return {
        ...state,
        portfolio: {
          ...state.wallets,
          [action.payload.id]: action.payload.wallet,
        },
      };
    case "ADD_ASSET":
      return {
        ...state,
        assets: [...state.assets, action.payload.accounts],
      };
    default:
      return state;
  }
};
