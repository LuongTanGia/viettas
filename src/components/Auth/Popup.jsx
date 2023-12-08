import { useSelector, useDispatch } from "react-redux";
import { authDataSelector } from "../../redux/selector";
import { LOGIN } from "../../action/Actions";

import API from "../../API/API";
import { useState } from "react";
import Cookies from "js-cookie";
// eslint-disable-next-line react/prop-types
const CollectionCreateForm = ({ isShow, close }) => {
  const data = useSelector(authDataSelector);
  const [RemoteDB, setRemoteDB] = useState();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    await LOGIN(API.DANGNHAP, data.TKN, RemoteDB, dispatch);
    window.localStorage.setItem("firstLogin", true);
    Cookies.set("user", true);
    window.location.href = "/";
  };
  const handleChangeRadio = (e) => {
    setRemoteDB(e.target.value);
  };
  console.log(isShow);
  return (
    <>
      {isShow ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <div className="w-[600px] m-6 p-6 absolute   shadow-lg bg-white rounded-md flex flex-col">
            <div className="flex justify-between items-center">
              <label>Chọn cơ sở dữ liệu</label>
              <button
                onClick={() => close()}
                className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
              >
                X{/* <IoMdClose /> */}
              </button>
            </div>

            <div className="p-6">
              {data?.DataResults?.map((item, index) => (
                <div className="flex items-center p-3 " key={index}>
                  <input
                    id={item.RemoteDB}
                    type="radio"
                    name="remoteDB"
                    value={item.RemoteDB}
                    onChange={handleChangeRadio}
                  />
                  <label
                    htmlFor={item.RemoteDB}
                    className="ml-2 text-base font-medium"
                  >
                    {item.RemoteDBDescription}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogin}
              className="active:scale-[.98] active:duration-75 text-white text-lg font-bold  bg-blue-500 rounded-md px-2 py-1"
            >
              Xác nhận
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CollectionCreateForm;
