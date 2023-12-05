import axios from "axios";
import loginSlice from "../components/Auth/loginSlice";
import MainSlice from "../components/MainPage/MainSlice";
export const DANHSACHDULIEU = async (API, user, dispatch) => {
    try {
        const response = await axios.post(API, user);
        if (response.data.DataResults !== null) {
            dispatch(loginSlice.actions.getDSDL(response.data));
        } else {
            dispatch(loginSlice.actions.getDSDL([]));
        }
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
            dispatch(loginSlice.actions.login(response.data));
        } else {
            dispatch(loginSlice.actions.login([]));
        }
        localStorage.setItem("TKN", response.data.TKN);
    } catch (error) {
        console.error("Error adding user:", error);
    }
};
export const DANHSACHCHUCNANG = async (API, token, dispatch) => {
    try {
        const response = await axios.post(
            API,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(loginSlice.actions.login(response.data));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};
export const DANHSACHHANGHOA = async (API, token, dispatch) => {
    try {
        const response = await axios.post(
            API,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(MainSlice.actions.getDSHH(response.data));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

export const KHOANNGAY = async (API, token, dispatch) => {
    try {
        const response = await axios.post(
            API,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(MainSlice.actions.getKhoanNgay(response.data));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

export const DATATONGHOP = async (API, token, dispatch) => {
    try {
        const response = await axios.post(
            API,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(MainSlice.actions.getDataTongHop(response.data));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};
