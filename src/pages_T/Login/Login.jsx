/* eslint-disable no-self-assign */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import BackGround from "/icons/login_background.svg";
import Logo from "/icons/viettas.svg";
import categoryAPI from "../../API/linkAPI.js";
import { AiOutlineClose } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const navigate = useNavigate();
  const [User, setUsername] = useState("");
  const [Pass, setPassword] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [selected, setSelected] = useState();
  const [dataResults, setDataResults] = useState([]);
  const dataBody = {
    User,
    Pass,
  };

  const handleGoogleLoginSuccess = async (response) => {
    const googleCredential = response.credential;
    const infoGoogle = jwtDecode(googleCredential);
    if (googleCredential) {
      try {
        const apiResponse = await categoryAPI.DangNhapGG(googleCredential);
        const remoteDbG = apiResponse.data.DataResults.map(
          (result) => result.RemoteDB
        );
        if (apiResponse.data && apiResponse.data.DataError == "0") {
          localStorage.setItem("user", infoGoogle.email);
          const token = apiResponse.data.TKN;
          localStorage.setItem("token", token);
          localStorage.setItem("remoteDB", JSON.stringify(remoteDbG));
          const getRemoteGG = localStorage.getItem("remoteDB");
          const tokenGG = localStorage.getItem("token");
          if (JSON.parse(getRemoteGG).length == 1) {
            const response = await categoryAPI.DangNhap(tokenGG, remoteDbG[0]);
            localStorage.setItem("data", JSON.stringify(response.data));
            if (response.data && response.data.DataError == "0") {
              localStorage.setItem("tokenAccess", response.data.TKN);
              localStorage.setItem("rfTokenAccess", response.data.RTKN);
              toast.success("Đăng Nhập Thành Công");
              navigate("/tonghop");
            }
          } else {
            setIsShow(true);
          }
        } else {
          toast.error("Lỗi khi đăng nhập");
        }
        setDataResults(apiResponse.data.DataResults);
      } catch (error) {
        console.error("Lỗi khi gọi API");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const login = await categoryAPI.getTokenDSDL(dataBody);
      const remoteDBValues = login.data.DataResults.map(
        (result) => result.RemoteDB
      );
      if (login.data && login.data.DataError == 0) {
        const token = login.data.TKN;
        localStorage.setItem("user", dataBody.User);
        localStorage.setItem("password", dataBody.Pass);
        localStorage.setItem("token", token);
        localStorage.setItem("remoteDB", JSON.stringify(remoteDBValues));
        const getRemoteDB = localStorage.getItem("remoteDB");
        const tokenId = localStorage.getItem("token");
        if (JSON.parse(getRemoteDB).length == 1) {
          const response = await categoryAPI.DangNhap(
            tokenId,
            remoteDBValues[0]
          );
          localStorage.setItem("data", JSON.stringify(response.data));
          if (response.data && response.data.DataError == 0) {
            toast.success("Đăng Nhập Thành Công");
            localStorage.setItem("tokenAccess", response.data.TKN);
            localStorage.setItem("rfTokenAccess", response.data.RTKN);
            localStorage.removeItem("password");
            navigate("/tonghop");
          }
        } else {
          setIsShow(true);
        }
      }
      setDataResults(login.data.DataResults);
    } catch (error) {
      toast.error("Sai tài khoản hoặc mật khẩu !");
    }
  };

  const handleLogin = async () => {
    const tokenId = localStorage.getItem("token");
    try {
      const response = await categoryAPI.DangNhap(tokenId, selected);
      if (response.data && response.data.DataError == 0) {
        localStorage.setItem("data", JSON.stringify(response.data));
        localStorage.setItem("tokenAccess", response.data.TKN);
        localStorage.setItem("rfTokenAccess", response.data.RTKN);
        toast.success("Đăng Nhập Thành Công");
        localStorage.removeItem("password");
        navigate("/tonghop");
      } else if (response.data && response.data.DataError === -107) {
        toast.error("Thời gian đăng nhập đã hết. Xin chọn lại miền");
        if (localStorage.getItem("password") == null) {
          toast.info("Login Google chưa phát triển tín năng này");
        } else {
          const userRequest = {
            User: localStorage.getItem("user"),
            Pass: localStorage.getItem("password"),
          };
          const login2 = await categoryAPI.getTokenDSDL(userRequest);
          if (login2.data && login2.data.DataError == 0) {
            console.log(login2.data);
            localStorage.setItem("token", login2.data.TKN);
            setIsShow(true);
          }
        }
      } else if (response.data && response.data.DataError === -100) {
        toast.error("Vui lòng chọn Miền");
      } else {
        toast.error.log("Lỗi", response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="relative">
      <div
        className=" table min-h-screen w-full bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${BackGround})`,
        }}
      >
        <div className="items-center bg-neutral-100  rounded-3xl shadow-custom absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2">
          <div className="flex justify-center items-center flex-col my-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8 w-full px-20"
            >
              <div className="flex flex-col gap-4 items-center">
                <div className="text-2xl font-semibold ">Đăng Nhập</div>
                <div className="object-contain block ">
                  <img src={Logo} alt="logo" />
                </div>
              </div>
              <div className="flex flex-col gap-1 font-medium ">
                <label htmlFor="username">Username</label>
                <input
                  className="px-8 py-2 rounded-lg border-2 border-gray-400 w-full"
                  placeholder="Email"
                  type="text"
                  id="User"
                  value={User}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1 font-medium ">
                <label htmlFor="password">Password</label>
                <input
                  className="px-4 py-2 rounded-lg border-2 border-gray-400 border-solid"
                  placeholder="Password"
                  type="password"
                  id="Pass"
                  value={Pass}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="bg-blue-500 px-16 py-2 text-white shadow-md rounded-md cursor-pointer hover:bg-white hover:text-blue-500"
                type="submit"
              >
                Đăng Nhập
              </button>
              <div className="block w-full border-t border-gray-300 my-2  text-center">
                <b className="inline-block px-4 font-normal text-center leading-10 text-slate-400 bg-neutral-100   border-gray-300 rounded-[50%] relative top-[-22px] z-1">
                  or login with
                </b>
              </div>
            </form>
            <div className="px-8">
              <GoogleLogin
                clientID="1087400588139-83e46v586sifjv3v8r5lbu8152nikkk9.apps.googleusercontent.com"
                cookiePolicy={"single_host_origin"}
                isSignIn={false}
                buttonText="Login"
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error("Đăng Nhập Thất Bại")}
              ></GoogleLogin>
            </div>
          </div>
          {/* <img src={Image} alt="" className="w-1/2 p-8 object-contain " /> */}
        </div>

        {isShow && (
          <div className="modal w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div
              onClick={() => setIsShow(!isShow)}
              className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"
            ></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col  min-w-[25rem] min-h-[5rem] bg-white p-4 gap-2 rounded-xl shadow-custom overflow-hidden">
              {/* <div className="line-run-animation absolute w-full h-1 top-0 overflow-hidden rounded-full bg-blue-700  bg-backgroundImage ;"></div> */}
              <div className="flex justify-between items-center">
                <div className="font-semibold text-red-700 text-lg">
                  VUI LÒNG CHỌN MIỀN
                </div>
                <div
                  onClick={() => setIsShow(!isShow)}
                  className="w-100 h-100 p-2 rounded-full border-current  hover:bg-slate-200 hover:text-red-500"
                >
                  <AiOutlineClose />
                </div>
              </div>
              {dataResults.map((value, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    id={value.RemoteDB}
                    className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none focus:ring focus:border-blue-300"
                    type="radio"
                    name="remoteDB"
                    value={value.RemoteDB}
                    checked={value.RemoteDB == selected}
                    onChange={(e) => setSelected(e.target.value)}
                  />
                  <label
                    className="text-blue-700 cursor-pointer hover:text-emerald-700 hover:font-semibold "
                    htmlFor={value.RemoteDB}
                  >
                    {value.RemoteDBDescription}
                  </label>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={(e) => handleLogin(e.target.value)}
                  className="text-white p-2  rounded-lg font-semibold bg-blue-600 shadow-custom hover:bg-white hover:text-blue-600"
                >
                  Chọn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default LoginForm;
