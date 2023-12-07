import { useEffect, useState } from "react";
import axios from "../../axios";
import { toast } from "react-toastify";
import backgroundImg from "../../assets/login_background.svg";
import icons from "../../untils/icons";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import * as apis from "../../apis";
import { data } from "autoprefixer";

const { IoMdClose, LuLoader2 } = icons;

const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remoteDB, setRemoteDB] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const handleLogin = async () => {
    try {
      // Kiểm tra user và pass trước khi gọi API đăng nhập
      if (!user || !pass) {
        toast.warn("Vui lòng nhập tên người dùng và mật khẩu.");
        return;
      }

      // Gọi API đăng nhập với user và pass
      const response = await apis.dsDuLieu(user, pass);

      // Kiểm tra nếu API trả về token
      if (response.data && response.data.TKN) {
        const token = response.data.TKN;
        // Lưu token vào localStorage
        localStorage.setItem("token", token);
        handleRemoteDB();
      } else {
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại tên người dùng và mật khẩu."
        );
      }
    } catch (error) {
      console.error("Đăng nhập thất bại", error);
    }
  };

  const handleGoogleLogin = async (TokenID) => {
    try {
      // Gọi API đăng nhập gg với TokenID
      const dataGG = jwtDecode(TokenID.credential);
      localStorage.setItem("dataGG", JSON.stringify(dataGG));
      const TokenIDcredential = TokenID.credential;
      const response = await apis.authGG(TokenIDcredential);
      // Lưu tokenID vào localStorage
      const tokenID = TokenID.credential;
      localStorage.setItem("tokenID", tokenID);

      if (response.data && response.data.DataError === 0) {
        const token = response.data.TKN;

        // Lưu token mới vào localStorage
        localStorage.setItem("token", token);

        handleRemoteDB();
      } else {
        console.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại", error);
    }
  };

  const handleRemoteDB = async (remoteDB) => {
    try {
      const TokenID = localStorage.getItem("token");
      const response = await apis.dangNhap(TokenID, remoteDB);

      if (response.data && response.data.DataError === 0) {
        const tokenlogin = response.data.TKN;
        localStorage.setItem("tokenlogin", tokenlogin);

        const datalogin = response.data.DataResults;

        localStorage.setItem("datalogin", JSON.stringify(datalogin));

        const rtkn = response.data.RTKN;
        localStorage.setItem("rtkn", rtkn);
      }
      if (!remoteDB) {
        setIsShowModal(true);
      }

      if (response.data && response.data.DataError === 0) {
        onLogin();

        toast.success("Đăng nhập thành công");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* login */}
      <div className="relative w-[500px] p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-center font-semibold text-4xl">Đăng Nhập</h1>
        <div className="mt-8">
          <div className="mb-4">
            <label className="text-lg font-medium mb-2">Tài Khoản</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-base  focus:outline-none focus:ring-0 focus:border-blue-500 hover:border-blue-500 bg-blue-100"
              placeholder="Nhập tài khoản..."
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-medium mb-2">Mật Khẩu</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-base  focus:outline-none focus:ring-0 focus:border-blue-500 hover:border-blue-500 bg-blue-100"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <input id="remember" type="checkbox" />
              <label htmlFor="remember" className="ml-2 text-base font-medium">
                Nhớ mật khẩu
              </label>
            </div>
            <button className="ml-2 text-base font-medium text-blue-500 ">
              Quên mật khẩu ?
            </button>
          </div>
          <div className="flex flex-col gap-y-4 mt-14">
            <button
              onClick={handleLogin}
              className="  active:scale-[.98] active:duration-75 text-white text-lg font-bold  bg-blue-500 rounded-md px-4 py-2 "
            >
              Đăng nhập
            </button>
            {/* <button
              onClick={handleGoogleLogin}
              className="flex justify-center items-center
                active:scale-[.98] active:duration-75  text-lg font-bold rounded-md px-4 py-2  border border-gray-300  "
            >
              <span className="pr-2">
                <FcGoogle size={30}></FcGoogle>
              </span>
              Đăng nhập bằng Google
            </button> */}
            <div className="flex justify-center items-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* selected remoteDB */}
      {isShowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <div className="w-[600px] m-6 p-6 absolute   shadow-lg bg-white rounded-md flex flex-col">
            <div className="flex justify-between items-center">
              <label>Chọn cơ sở dữ liệu</label>
              <button
                onClick={() => setIsShowModal(false)}
                className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
              >
                <IoMdClose />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center p-3 ">
                <input
                  id="ISALEWEB_VINHLONG"
                  type="radio"
                  name="remoteDB"
                  value="ISALEWEB_VINHLONG"
                  onChange={(e) => setRemoteDB(e.target.value)}
                />
                <label
                  htmlFor="ISALEWEB_VINHLONG"
                  className="ml-2 text-base font-medium"
                >
                  VTS-iSale - Vĩnh Long
                </label>
              </div>
              <div className="flex items-center p-3">
                <input
                  id="ISALEWEB_VUNGTAU"
                  type="radio"
                  name="remoteDB"
                  value="ISALEWEB_VUNGTAU"
                  onChange={(e) => setRemoteDB(e.target.value)}
                />
                <label
                  htmlFor="ISALEWEB_VUNGTAU"
                  className="ml-2 text-base font-medium"
                >
                  VTS-iSale - Vũng Tàu
                </label>
              </div>
            </div>

            <button
              onClick={() => handleRemoteDB(remoteDB)}
              className="active:scale-[.98] active:duration-75 text-white text-lg font-bold  bg-blue-500 rounded-md px-2 py-1"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
