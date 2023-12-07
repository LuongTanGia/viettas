import React, { memo, useEffect, useRef, useState } from "react";
import logo from "../assets/VTS-iSale.ico";
import icons from "../untils/icons";
import { BsAndroid } from "react-icons/bs";
import { Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { data } from "autoprefixer";
// import MyButton from "./myComponents/MyButton";

const { LuLogOut } = icons;

const HeaderMain = ({ offLogin, setIsCollapsed, isCollapsed }) => {
  const [isShowUserSelected, setIsShowUserSelected] = useState(false);
  const [dataGG, setDataGG] = useState(null);

  useEffect(() => {
    const getDataGG = () => {
      const storedDataGG = localStorage.getItem("dataGG");
      const dataGG = storedDataGG ? JSON.parse(storedDataGG) : null;
      setDataGG(dataGG);
    };

    getDataGG();
  }, []);

  const handleLogOut = () => {
    offLogin();
  };

  return (
    <>
      <div className=" flex justify-between items-center p-1  ">
        <div className="flex gap-4 items-center flex-shrink-0 px-3 ">
          <img src={logo} alt="logo" className="w-[40px] h-[40px] " />
          <Button
            type="text"
            className="toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          ></Button>
        </div>
        <div></div>
        {/* User */}
        <div className="px-2 ">
          <span
            onClick={() => setIsShowUserSelected(!isShowUserSelected)}
            className="relative cursor-pointer "
          >
            {dataGG?.picture !== null ? (
              <img
                src={dataGG?.picture}
                alt="picture"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <button className=" w-8 h-8 rounded-full bg-blue-400 ] font-semibold text-2xl text-white">
                {dataGG?.given_name.slice(0, 1)}
              </button>
            )}
            {/* <MyButton givenName={dataGG.given_name} /> */}
          </span>

          {/* user selection */}
          {isShowUserSelected && (
            <div className="absolute w-[320px] right-6 shadow-lg border border-gray-200 rounded-md bg-white  z-10  ">
              <div className="m-1 flex flex-col gap-2 ">
                <div className="p-1 flex gap-1 items-center">
                  <img
                    src={dataGG.picture}
                    alt="picture"
                    className="w-10 h-10 rounded-full "
                  />

                  <div className="flex flex-col ">
                    <span className=" pl-3">
                      {dataGG.name.length >= 26
                        ? `${dataGG.name.slice(0, 26)}...`
                        : dataGG.name}
                    </span>
                    <span className=" pl-3">
                      {dataGG.email.length >= 30
                        ? `${dataGG.email.slice(0, 24)}...`
                        : dataGG.email}
                    </span>
                  </div>
                </div>
                <hr />
                <button className="p-2 active:scale-[.98] active:duration-75 text-black text-base rounded-md flex items-center hover:bg-[#f1f0f0]">
                  <span>
                    <LuLogOut size={20} />
                  </span>
                  <span onClick={handleLogOut} className="pl-3">
                    Đăng xuất
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />
    </>
  );
};

export default HeaderMain;
