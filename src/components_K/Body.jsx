import React, { memo } from "react";
import Item from "./Item";
import name from "module";
import icons from "../untils/icons";

const { GoInbox, LuBoxes } = icons;

const Body = ({ data }) => {
  return (
    <div className="w-full bg-[#dfe9f6] p-3 ">
      <div className="text-lg font-bold pb-4">Tổng Hợp</div>
      <div className="flex gap-6  items-center px-3 ">
        {/* total */}
        <div className="border border-gray-200 shadow-lg rounded-md p-3 w-[200px] h-[100px] bg-white">
          <div className="text-lg font-semibold pr-2">Total</div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2">
              <span title="Kho Hang ">
                <GoInbox size={22} />
              </span>
              <span>222</span>
            </div>
            <div className="flex items-center gap-2">
              <span title="Nhom Hang">
                <LuBoxes size={22} />
              </span>
              <span>222</span>
            </div>
          </div>
        </div>
        {/* total */}
        <div className="border border-gray-200 shadow-lg rounded-md p-3 w-[200px] h-[100px] bg-white">
          <div className="text-lg font-semibold pr-2">Total</div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2">
              <span title="Kho Hang ">
                <GoInbox size={22} />
              </span>
              <span>222</span>
            </div>
            <div className="flex items-center gap-2">
              <span title="Nhom Hang">
                <LuBoxes size={22} />
              </span>
              <span>222</span>
            </div>
          </div>
        </div>
        {/* total */}
        <div className="border border-gray-200 shadow-lg rounded-md p-3 w-[200px] h-[100px] bg-white">
          <div className="text-lg font-semibold pr-2">Total</div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2">
              <span title="Kho Hang ">
                <GoInbox size={22} />
              </span>
              <span>222</span>
            </div>
            <div className="flex items-center gap-2">
              <span title="Nhom Hang">
                <LuBoxes size={22} />
              </span>
              <span>222</span>
            </div>
          </div>
        </div>{" "}
        {/* total */}
        <div className="border border-gray-200 shadow-lg rounded-md p-3 w-[200px] h-[100px] bg-white">
          <div className="text-lg font-semibold pr-2">Total</div>
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center gap-2">
              <span title="Kho Hang ">
                <GoInbox size={22} />
              </span>
              <span>222</span>
            </div>
            <div className="flex items-center gap-2">
              <span title="Nhom Hang">
                <LuBoxes size={22} />
              </span>
              <span>222</span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 text-lg font-bold ">Title</div>
      <div className="px-3">
        <Item data={data} />
      </div>
    </div>
  );
};

export default memo(Body);
