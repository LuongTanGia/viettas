import axios from "axios";
import loginSlice from "../components/Auth/loginSlice";
import MainSlice from "../components/MainPage/MainSlice";
import DuLieuSlice from "../components/DULIEU/DuLieuSlice";

// import { toast } from "react-toastify";

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
      dispatch(loginSlice.actions.login(response.data));
      localStorage.setItem("TKN", response.data.TKN);
    } else {
      dispatch(loginSlice.actions.login([]));
    }
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
export const DATATONGHOP = async (API, token, KhoanNgay, dispatch) => {
  try {
    const response = await axios.post(API, KhoanNgay, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
