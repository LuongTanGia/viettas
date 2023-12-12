import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../components/Auth/loginSlice";
import MainSlice from "../components/MainPage/MainSlice";
import DuLieuSlice from "../components/DULIEU/DuLieuSlice";
import PBSSlice from "../components/PhieuBanHang/PBSSlice";

const store = configureStore({
    reducer: {
        AuthData: LoginSlice.reducer,
        mainData: MainSlice.reducer,
        dataDuLieu: DuLieuSlice.reducer,
        phieuBanHang: PBSSlice.reducer,
    },
});

export default store;
