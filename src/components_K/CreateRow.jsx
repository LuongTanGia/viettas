/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import icons from "../untils/icons";
import { toast } from "react-toastify";
const { MdDelete } = icons;

const CreateRow = ({
  index,
  item,
  dataHangHoa,
  roundNumber,
  handleDeleteRow,
  setRowData,
}) => {
  const [x, setX] = useState(item.SoLuong);

  const handleChangeData = (e) => {
    const mahang = e.target.value;
    const selectedItem = dataHangHoa.find((item) => item.MaHang === mahang);
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            MaHang: selectedItem.MaHang,
            TenHang: selectedItem.TenHang,
            DVT: selectedItem.DVT,
            SoLuong: 1,
          };
        }
        return i;
      });
      return newData;
    });
  };

  const handleChangeQuantity = () => {
    const newQuantity = Number(Math.round(x)).toFixed(1);
    setX(newQuantity);
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            SoLuong: Number(newQuantity),
          };
        }
        return i;
      });
      return newData;
    });
  };

  const handleChangePrice = (e) => {
    const isValid = /^[0-9,]*$/.test(e.target.value);
    if (!isValid) return;
    const newPrice = Number(e.target.value.replace(/,/g, "")).toLocaleString();
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            DonGia: newPrice,
          };
        }
        return i;
      });
      return newData;
    });
  };

  const handleChangeTax = (e) => {
    const newTax = e.target.value;
    console.log(newTax);
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            Thue: Number(newTax),
          };
        }
        return i;
      });
      return newData;
    });
  };

  return (
    <tr key={index}>
      <td className="py-2 px-4 border text-center ">{index + 1}</td>
      <td className="border">
        <select
          className=" bg-white  w-[200px] h-full outline-none  "
          value={item.MaHang}
          onChange={handleChangeData}
        >
          {dataHangHoa?.map((item) => (
            <option key={item.MaHang} value={item.MaHang}>
              {item.MaHang} - {item.TenHang}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 px-4 border">{item.TenHang}</td>
      <td className="py-2 px-4 border text-center">{item.DVT}</td>
      <td className="py-2  border ">
        <input
          className="text-end px-4 "
          type="text"
          value={x}
          onChange={(e) => {
            const value = e.target.value;
            if (value.includes(".") && value.split(".")[1].length > 2) return;
            setX(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleChangeQuantity();
          }}
          onBlur={handleChangeQuantity}
        />
      </td>
      <td className="py-2 border ">
        <input
          className=" px-4 text-end"
          type="text"
          pattern="[0-9]+"
          title="Please enter a numeric value"
          value={item.DonGia}
          onChange={handleChangePrice}
        />
      </td>
      <td className="py-2 px-4 border text-end">
        <NumericFormat
          value={
            item.DonGia
              ? Number(item.DonGia.replace(/,/g, "")) * Number(item.SoLuong)
              : 0
          }
          displayType={"text"}
          thousandSeparator={true}
        />
      </td>
      <td className="py-2 border">
        <input
          className=" text-end"
          type="number"
          min={0}
          max={100}
          value={item.Thue}
          onChange={handleChangeTax}
        />
      </td>
      <td className="py-2 px-4 border text-end">
        <NumericFormat
          value={
            item.DonGia
              ? Number(item.DonGia.replace(/,/g, "")) *
                Number(item.SoLuong) *
                (Number(item.Thue) / 100)
              : 0
          }
          displayType={"text"}
          thousandSeparator={true}
        />
      </td>
      <td className="py-2 px-4 border text-end">
        <NumericFormat
          value={
            item.DonGia
              ? Number(item.DonGia.replace(/,/g, "")) * Number(item.SoLuong) +
                Number(item.DonGia.replace(/,/g, "")) *
                  Number(item.SoLuong) *
                  (Number(item.Thue) / 100)
              : 0
          }
          displayType={"text"}
          thousandSeparator={true}
        />
      </td>
      <td className="py-2 flex justify-center ">
        <span
          onClick={() => handleDeleteRow(index)}
          className="p-[3px] text-red-500 border  border-red-500 rounded-md hover:text-white hover:bg-red-500  cursor-pointer "
        >
          <MdDelete size={20} />
        </span>
      </td>
    </tr>
  );
};

export default CreateRow;
