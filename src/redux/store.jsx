import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../components/Auth/loginSlice";
import MainSlice from "../components/MainPage/MainSlice";

const store = configureStore({
    reducer: {
        AuthData: LoginSlice.reducer,
        mainData: MainSlice.reducer,
    },
});

export default store;
