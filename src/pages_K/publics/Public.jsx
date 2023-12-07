import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Body, Chart, HeaderMain, Footer } from "../../components";

const Public = ({ offLogin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className=" h-screen">
      <div className=" ">
        <HeaderMain
          offLogin={offLogin}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        ></HeaderMain>
      </div>

      <div className=" flex">
        <div className="">
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          ></Sidebar>
        </div>
        {/* className={`w-[87%] ${isCollapsed && "w-[94.4%] "}`} */}
        <div className="w-full">
          <Outlet></Outlet>
        </div>
      </div>

      <div className="">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Public;
