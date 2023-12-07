import axios from "../axios";

export const KhoanNgay = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/settings/GiaTriHeThong/KhoanNgay",
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
