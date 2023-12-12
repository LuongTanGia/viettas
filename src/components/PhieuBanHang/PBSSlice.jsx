import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line react-refresh/only-export-components
export default createSlice({
    name: "phieuBanHang",
    initialState: {
        data: [],
    },
    reducers: {
        getDanhSach: (state, action) => {
            state.data = action.payload;
        },
    },
});
