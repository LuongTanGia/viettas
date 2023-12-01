import { configureStore } from "@reduxjs/toolkit";
// import filtersSlice from "../components/Filters/FiltersSlice";
// import todoListSlice from "../components/TodoList/TodoSlice";

const store = configureStore({
    reducer: {
        // filters: filtersSlice.reducer,
        // todoList: todoListSlice.reducer,
    },
});

export default store;
