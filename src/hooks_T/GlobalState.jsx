/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

const GlobalState = createContext();
const storeReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "DANHSACHDULIEU":
      localStorage.setItem("data", JSON.stringify(payload.data));
      return {
        ...state,
        accessToken: payload.data,
      };

    case "SIDEBAR":
      return {
        ...state,
        isShowSidebar: payload,
      };

    default:
      return state;
  }
};
const initialState = {
  accessToken: null,
  isShowSidebar: false,
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <GlobalState.Provider value={{ state, dispatch }}>
      {children}
    </GlobalState.Provider>
  );
};
export default function useStore() {
  return useContext(GlobalState);
}
