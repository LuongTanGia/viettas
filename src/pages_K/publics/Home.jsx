import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as apis from "../../apis";
import { Body } from "../../components";

const Home = ({ Login }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        await checkTokenExpiration();
      } catch (error) {
        console.error("lấy data thất bại", error);
        toast.error("lấy data thất bại. Vui lòng thử lại sau.");
      }
    };
    getData();
  }, []);

  // Hàm kiểm tra token hết hạn
  const checkTokenExpiration = async () => {
    try {
      const tokenLogin = localStorage.getItem("tokenlogin");
      const response = await apis.TongHop(tokenLogin);

      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults);
      } else if (response.data && response.data.DataError === -107) {
        // Thực hiện lấy lại token
        await refreshToken();
      } else {
        toast.error(
          "Có người đang nhập ở nơi khác. Bạn sẽ bị chuyển đến trang đăng nhập."
        );
        Login();
      }
    } catch (error) {
      console.error("Kiểm tra token thất bại", error);
    }
  };

  // Hàm lấy lại token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("rtkn");
      const response = await apis.RefreshToken(refreshToken);

      if (response.data && response.data.DataError === 0) {
        const newToken = response.data.TKN;
        localStorage.setItem("tokenlogin", newToken);

        const token = localStorage.getItem("tokenlogin");
        const response2 = await apis.TongHop(token);
        if (response2.data && response2.data.DataError === 0) {
          setData(response2.data.DataResults);
        }
      } else {
        // Xử lý khi reFreshToken het han
        toast.error("FreshToken het han. Vui lòng đăng nhập lại.");
        Login();
      }
    } catch (error) {
      console.error("Lấy lại token thất bại", error);
    }
  };

  return (
    <div className="h-[87.1vh] overflow-y-scroll">
      <Body data={data}></Body>
    </div>
  );
};

export default Home;
