import axios from "axios";
import loginSlice from "../components/Auth/loginSlice";
import MainSlice from "../components/MainPage/MainSlice";
import DuLieuSlice from "../components/DULIEU/DuLieuSlice";

import { toast } from "react-toastify";

export const REFTOKEN = async () => {
    const token = window.localStorage.getItem("RTKN");
    const login = window.localStorage.getItem("firstLogin");

    try {
        const response = await axios.post(
            "https://isalewebapi.viettassaigon.vn/api/Auth/RefreshToken",
            {
                TokenID: token,
            }
        );
        if (response.data.DataError === 0 && login === "true") {
            toast.error(response.data.DataErrorDescription);
            window.localStorage.setItem("TKN", response.data.TKN);
            return response.data.TKN;
        } else {
            toast.error(
                "Có người đang nhập ở nơi khác. Bạn sẽ bị chuyển đến trang đăng nhập."
            );
            window.location.href = "/login";
        }
    } catch (error) {
        window.location.href = "/login";
        console.error("Error adding user:", error);
    }
};

export const DANHSACHDULIEU = async (API, data, dispatch) => {
    try {
        const response = await axios.post(API, data);
        if (response.data.DataError === 0) {
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
            window.localStorage.setItem("TKN", response.data.TKN);
            window.localStorage.setItem("RTKN", response.data.RTKN);
            window.localStorage.setItem("User", response.data.MappingUser);

            dispatch(loginSlice.actions.login(response.data));

            console.log(response.data);
        } else {
            dispatch(loginSlice.actions.login([]));
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

export const DANHSACHCHUCNANG = async (API, token, dispatch) => {
    console.log("dataDANHSACHCHUCNANG");
    console.log("dataDANHSACHCHUCNANG");
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
        if (response.data.DataError === -107) {
            toast.error(response.data.DataErrorDescription);
            const newToken = await REFTOKEN();
            if (newToken) {
                await DANHSACHCHUCNANG(API, newToken, dispatch);
            } else {
                toast.error("Failed to refresh token!");
                window.location.href = "/";
            }
        } else {
            dispatch(loginSlice.actions.login(response.data));
        }
        if (response.data.DataError === -107) {
            toast.error(response.data.DataErrorDescription);
            const newToken = await REFTOKEN();
            if (newToken) {
                await DANHSACHCHUCNANG(API, newToken, dispatch);
            } else {
                toast.error("Failed to refresh token!");
                window.location.href = "/";
            }
        } else {
            dispatch(loginSlice.actions.login(response.data));
        }
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
export const DATATONGHOP = async (API, token, KhoanNgay, dispatch) => {
    try {
        const response = await axios.post(API, KhoanNgay, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.DataError === -107) {
            toast.error(response.data.DataErrorDescription);
            const newToken = await REFTOKEN();
            if (newToken) {
                await DATATONGHOP(API, newToken, KhoanNgay, dispatch);
            } else {
                console.error("Failed to refresh token!");
                window.location.href = "/";
            }
        }
        if (response.data.DataError === -107) {
            toast.error(response.data.DataErrorDescription);
            const newToken = await REFTOKEN();
            if (newToken) {
                await DATATONGHOP(API, newToken, KhoanNgay, dispatch);
            } else {
                console.error("Failed to refresh token!");
                window.location.href = "/";
            }
        }
        dispatch(MainSlice.actions.getDataTongHop(response.data));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};
export const DATADULIEU = async (API, token, dispatch) => {
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
        dispatch(DuLieuSlice.actions.getDataDL(response.data));
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

export const THAYDOIRMATKHAU = async (API, data, token) => {
    try {
        const response = await axios.post(API, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.DataError === 0) {
            toast(response.data.DataErrorDescription);
        } else {
            toast(response.data.DataErrorDescription);
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

// function Normal
export const base64ToPDF = (Base64PMH) => {
    // Decode base64 string
    const decodedData = atob(Base64PMH);
    // Convert decoded data to array buffer
    const arrayBuffer = new ArrayBuffer(decodedData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedData.length; i++) {
        uint8Array[i] = decodedData.charCodeAt(i);
    }
    // Create Blob from array buffer
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    // Create a data URL from the Blob
    const dataUrl = URL.createObjectURL(blob);
    // Open a new window with the data URL
    const newWindow = window.open(dataUrl, "_blank");
    // Print the opened window
    newWindow.onload = function () {
        newWindow.print();
    };
};

export const keyDown = (e) => {
    const validKeys = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "/",
        "Backspace",
    ];
    if (!validKeys.includes(e.key)) {
        e.preventDefault();
    }
};

export const roundNumber = (number) => {
    const roundedNumber = Math.round(number * 10) / 10;
    return roundedNumber.toFixed(1);
};
