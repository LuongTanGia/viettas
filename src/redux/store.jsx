import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../components/Auth/loginSlice";
import MainSlice from "../components/MainPage/MainSlice";
import DuLieuSlice from "../components/DULIEU/DuLieuSlice";
const store = configureStore({
    reducer: {
        AuthData: LoginSlice.reducer,
        mainData: MainSlice.reducer,
        dataDuLieu: DuLieuSlice.reducer,
    },
});

export default store;
