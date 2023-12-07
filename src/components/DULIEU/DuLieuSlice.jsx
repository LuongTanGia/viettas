import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line react-refresh/only-export-components
export default createSlice({
    name: "dataDuLieu",
    initialState: {
        data: [],
    },
    reducers: {
        getDataDL: (state, action) => {
            state.data = action.payload;
        },
    },
});
