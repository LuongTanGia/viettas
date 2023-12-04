import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line react-refresh/only-export-components
export default createSlice({
    name: "mainData",
    initialState: {
        DANHSACHHANGHOA: [],
    },
    reducers: {
        getDSHH: (state, action) => {
            state.DANHSACHHANGHOA = action.payload;
        },
    },
});
