import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line react-refresh/only-export-components
export default createSlice({
    name: "mainData",
    initialState: {
        DANHSACHHANGHOA: [],
        KhoanNgay: [],
        DATATONGHOP: [],
    },
    reducers: {
        getDSHH: (state, action) => {
            state.DANHSACHHANGHOA = action.payload;
        },
        getKhoanNgay: (state, action) => {
            state.KhoanNgay = action.payload;
        },
        getDataTongHop: (state, action) => {
            state.DATATONGHOP = action.payload;
        },
    },
});
