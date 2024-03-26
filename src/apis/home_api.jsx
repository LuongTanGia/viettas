import axios from "../axios";

export const TongHop = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/statistics/TongHop",
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {},
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const RefreshToken = (refreshToken) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/Auth/RefreshToken",
        method: "post",
        data: {
          TokenID: refreshToken,
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
