import axios from "axios";
import loginSlice from "../components/Auth/loginSlice";

export const DANHSACHDULIEU = async (API, user, dispatch) => {
    try {
        const response = await axios.post(API, user);
        if (response.data.DataResults !== null) {
            dispatch(loginSlice.actions.getDSDL(response.data));
        } else {
            dispatch(loginSlice.actions.getDSDL([]));
        }
        localStorage.setItem("userLogin", btoa(JSON.stringify(user)));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

export const LOGIN = async (API, TKN, RemoteDB, dispatch) => {
    try {
        const response = await axios.post(API, {
            TokenID: TKN,
            RemoteDB: RemoteDB,
        });
        if (response) {
            dispatch(loginSlice.actions.login(response.data.DataResults));
        } else {
            dispatch(loginSlice.actions.login([]));
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

export const GETDATA = (API, API2, dataPost, RemoteDB) => {
    return async (dispatch) => {
        try {
            const DATADULIEU = await axios.post(API, dataPost);
            const DATADANGNHAP = await axios.post(API2, {
                TokenID: DATADULIEU.data.TKN,
                RemoteDB: RemoteDB,
            });
            localStorage.setItem("TKN", DATADANGNHAP.data.TKN);

            dispatch({ type: "GETDATA", payload: DATADANGNHAP.data });
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };
};
