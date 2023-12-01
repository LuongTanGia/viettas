import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../components/Auth/loginSlice";

const store = configureStore({
    reducer: {
        AuthData: LoginSlice.reducer,
        // todoList: todoListSlice.reducer,
    },
});

export default store;
