/* eslint-disable react/prop-types */
import { useState } from "react";

import icons from "../untils/icons";
import { toast } from "react-toastify";
const { IoMdClose } = icons;
const ModalHH = ({ close, data, onRowCreate }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionCount, setSelectionCount] = useState(0);

  const handleRowClick = (dataRow) => {
    setSelectedRow(dataRow.MaHang);
  };

  const handleChoose = (dataRow) => {
    if (selectedRow && selectedRow.MaHang === dataRow.MaHang) {
      setSelectionCount(selectionCount + 1);

      const defaultValues = {
        SoLuong: 1,
        DonGia: 0,
        TienHang: 0,
        Thue: 0,
        TienThue: 0,
        ThanhTien: 0,
      };
      const newRow = { ...dataRow, ...defaultValues };
      onRowCreate(newRow);

      toast.success("Chọn hàng hóa thành công", {
        autoClose: 1000,
      });
    } else {
      setSelectedRow(dataRow);
      setSelectionCount(1);

      const defaultValues = {
        SoLuong: 1,
        DonGia: 0,
        TienHang: 0,
        Thue: 0,
        TienThue: 0,
        ThanhTien: 0,
      };
      const newRow = { ...dataRow, ...defaultValues };
      onRowCreate(newRow);

      toast.success("Chọn hàng hóa thành công", {
        autoClose: 1000,
      });
    }
  };

  const title = [
    "STT",
    "Mã Hàng",
    "Tên Hàng",
    "DVT",
    "Lắp Ráp",
    "Lưu Kho",
    "Số Lượng Tồn",
    "Nhóm",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px] ">
          <div className="flex justify-between items-start pb-1">
            <label className="font-bold ">Danh sách hàng hóa</label>
            <button
              onClick={() => close()}
              className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
            >
              <IoMdClose />
            </button>
          </div>
          {/* table */}
          <div className="max-w-[98%]  max-h-[90%] mx-auto bg-white  rounded-md my-3 overflow-y-auto text-sm">
            <table className="min-w-full min-h-full bg-white border border-gray-300 text-text-main">
              <thead>
                <tr className="bg-gray-100">
                  {title.map((item) => (
                    <th key={item} className="py-2 px-4 border">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr
                    key={item.MaHang}
                    className={`hover:bg-blue-200  cursor-pointer ${
                      selectedRow === item.MaHang ? "bg-blue-200 " : ""
                    }`}
                    onClick={() => handleRowClick(item)}
                    onDoubleClick={() => handleChoose(item)}
                  >
                    <td className="py-2 px-4 border text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border">{item.MaHang}</td>
                    <td className="py-2 px-4 border">{item.TenHang}</td>
                    <td className="py-2 px-4 border">{item.DVT}</td>
                    <td className="py-2 px-4 border text-center">
                      <input type="checkbox" defaultChecked={item.LapRap} />
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <input type="checkbox" defaultChecked={item.TonKho} />
                    </td>
                    <td
                      className={`py-2 px-4 border text-end ${
                        item.SoLuongTon < 0 ? "text-red-600 font-bold" : ""
                      }`}
                    >
                      {item.SoLuongTon}.0
                    </td>
                    <td className="py-2 px-4 border">{item.NhomHang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHH;
