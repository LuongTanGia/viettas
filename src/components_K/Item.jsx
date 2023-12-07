import React, { memo } from "react";
import icons from "../untils/icons";

const { PiDogLight } = icons;

const Item = ({ data }) => {
  return (
    <div className="bg-white shadow-lg rounded-md">
      <div className="p-4 grid grid-cols-4 gap-4  ">
        {/* item DOANHSO */}
        <div className="h-[126px] flex gap-4   shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Doanh Số </div>
            {data?.map(
              (item) =>
                item.DataCode === "DOANHSO_SUM_AMOUNT" && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item TONKHO*/}
        <div className="h-[126px] flex gap-4  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Tồn Kho</div>
            {data?.map(
              (item) =>
                (item.DataCode === "TONKHO_COUNT_ITEM_D" ||
                  item.DataCode === "TONKHO_COUNT_ITEM_A") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item MUAHANG */}
        <div className="flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Mua Hàng</div>
            {data?.map(
              (item) =>
                (item.DataCode === "MUAHANG_COUNT_REF" ||
                  item.DataCode === "MUAHANG_COUNT_SUP" ||
                  item.DataCode === "MUAHANG_COUNT_ITEM" ||
                  item.DataCode === "MUAHANG_SUM_AMOUNT") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item XUATTRA */}
        <div className="flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Xuất Trả</div>
            {data?.map(
              (item) =>
                (item.DataCode === "XUATTRA_COUNT_REF" ||
                  item.DataCode === "XUATTRA_COUNT_SUP" ||
                  item.DataCode === "XUATTRA_COUNT_ITEM" ||
                  item.DataCode === "XUATTRA_SUM_AMOUNT") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>

        {/* item BANHANG*/}
        <div className="flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Bán Hàng</div>
            {data?.map(
              (item) =>
                (item.DataCode === "BANHANG_COUNT_CUS" ||
                  item.DataCode === "BANHANG_COUNT_ITEM" ||
                  item.DataCode === "BANHANG_SUM_AMOUNT" ||
                  item.DataCode === "BANHANG_COUNT_REF") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item NHAPTRA*/}
        <div className="flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Nhập Trả</div>
            {data?.map(
              (item) =>
                (item.DataCode === "NHAPTRA_COUNT_REF" ||
                  item.DataCode === "NHAPTRA_COUNT_SUP" ||
                  item.DataCode === "NHAPTRA_COUNT_ITEM" ||
                  item.DataCode === "NHAPTRA_SUM_AMOUNT") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item THU*/}
        <div className="flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Thu Tiền </div>
            {data?.map(
              (item) =>
                (item.DataCode === "THU_COUNT_REF" ||
                  item.DataCode === "THU_COUNT_SUP" ||
                  item.DataCode === "THU_COUNT_ITEM" ||
                  item.DataCode === "THU_SUM_AMOUNT") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item CHI*/}
        <div className="flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold ">Chi Tiền</div>
            {data?.map(
              (item) =>
                (item.DataCode === "CHI_COUNT_REF" ||
                  item.DataCode === "CHI_COUNT_SUP" ||
                  item.DataCode === "CHI_COUNT_ITEM" ||
                  item.DataCode === "CHI_SUM_AMOUNT") && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item PHAITRA*/}
        <div className=" h-[126px] flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Phải Trả</div>
            {data?.map(
              (item) =>
                item.DataCode === "PHAITRA_SUM_AMOUNT" && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
        {/* item PHAITHU*/}
        <div className="h-[126px] flex gap-4 items-center  shadow-lg rounded-md border bg-gray-100">
          <div>
            <PiDogLight size={50} />
          </div>
          <div></div>
          <div>
            <div className="text-lg font-semibold">Phải Thu</div>
            {data?.map(
              (item) =>
                item.DataCode === "PHAITHU_SUM_AMOUNT" && (
                  <div key={item.DataCode}>
                    {item.DataName} : {item.DataValue}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Item);
