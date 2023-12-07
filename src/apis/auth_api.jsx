import axios from "../axios";

export const dsDuLieu = (user, pass, TokenId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/Auth/DanhSachDuLieu",
        method: "post",
        data: {
          User: user,
          Pass: pass,
          TokenId: TokenId,
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const authGG = (TokenId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/Auth/DanhSachDuLieu",
        method: "post",
        data: {
          TokenId: TokenId,
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const dangNhap = (TokenID, remoteDB) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/Auth/DangNhap",
        method: "post",
        data: {
          TokenID: TokenID,
          remoteDB: remoteDB,
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
