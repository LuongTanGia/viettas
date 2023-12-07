/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaCaretRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { FiDatabase } from "react-icons/fi";
import { SiGooglebigquery } from "react-icons/si";
import { IoBagHandleOutline } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { MdOutlineSystemSecurityUpdateGood } from "react-icons/md";

const Sidebar = () => {
  const [string, setString] = useState();
  const [child, setChild] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem("data"));
    setData(dataLocal.DataResults);
  }, []);

  const handleClick = (index) => {
    index === string ? setString(-1) : setString(index);
  };

  const getData = data && data.filter((item) => item.NhomChucNang === "10");

  return (
    <div
      className="flex flex-1 flex-col py-4 px-2  border-r-2 border-slate-100 overflow-hidden bg-slate-100  z-10 "
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex-1 flex flex-col overflow-y-auto  ">
        {getData?.map((item, index) => (
          <>
            <div key={index} className="flex flex-col px-2">
              <div
                className="flex items-center text-center justify-between py-2 cursor-pointer rounded-lg px-4 bg-blue-200  hover:bg-indigo-700 hover:text-white"
                onClick={() => handleClick(index)}
              >
                <div className="text-lg font-semibold">
                  {item.MaChucNang === "DanhMuc" ? (
                    <div className="flex gap-2 items-center">
                      <BiCategory />
                      {item.TenChucNang}
                    </div>
                  ) : item.MaChucNang === "DuLieu" ? (
                    <div className="flex gap-2 items-center">
                      <FiDatabase />
                      {item.TenChucNang}
                    </div>
                  ) : item.MaChucNang === "TruyVan" ? (
                    <div className="flex gap-2 items-center">
                      <SiGooglebigquery />
                      {item.TenChucNang}
                    </div>
                  ) : item.MaChucNang === "ThietLap" ? (
                    <div className="flex gap-2 items-center">
                      <MdOutlineSettings />
                      {item.TenChucNang}
                    </div>
                  ) : item.MaChucNang === "XuLy" ? (
                    <div className="flex gap-2 items-center">
                      <IoBagHandleOutline />
                      {item.TenChucNang}
                    </div>
                  ) : item.MaChucNang === "BaoCao" ? (
                    <div className="flex gap-2 items-center">
                      <MdOutlineReportGmailerrorred />
                      {item.TenChucNang}
                    </div>
                  ) : item.MaChucNang === "HeThong" ? (
                    <div className="flex gap-2 items-center">
                      <MdOutlineSystemSecurityUpdateGood />
                      {item.TenChucNang}
                    </div>
                  ) : (
                    item.TenNhomChucNang
                  )}
                </div>
                <FaCaretRight
                  className={`block duration-500 ${
                    string == index && "rotate-90"
                  }`}
                />
              </div>
              <div className="p-2 ">
                {data.map(
                  (itemChild) =>
                    string == index && (
                      <>
                        {itemChild.NhomChucNang !== "10" &&
                        itemChild.NhomChucNang === item.MaChucNang ? (
                          <>
                            <div className="group">
                              <Link
                                to={`${
                                  child.includes(itemChild.MaChucNang)
                                    ? "#!"
                                    : itemChild.MaChucNang
                                } `}
                              >
                                <div
                                  className="group flex items-center mb-2 px-2 py-2 rounded-lg cursor-pointer font-semibold bg-cyan-200  hover:bg-cyan-700 hover:text-white "
                                  title={itemChild.TenChucNang}
                                >
                                  <div className=" block truncate">
                                    {itemChild.TenChucNang}
                                  </div>
                                </div>
                              </Link>
                              <div className="hidden group-hover:block">
                                <div className=" flex flex-col px-2 rounded-lg">
                                  {data.map((item2) =>
                                    item2.NhomChucNang === itemChild.MaChucNang
                                      ? child.push(itemChild.MaChucNang) && (
                                          <Link
                                            to={`${itemChild.MaChucNang}/${item2.MaChucNang}`}
                                            key={item2.MaChucNang}
                                          >
                                            <div
                                              className=" bg-blue-200 mb-2 p-2 py-2 font-medium  rounded-md text-sm hover:bg-blue-600 hover:text-white"
                                              title={item2.TenChucNang}
                                            >
                                              <div className="truncate">
                                                {item2.TenChucNang}
                                              </div>
                                            </div>
                                          </Link>
                                        )
                                      : null
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </>
                    )
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
