/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import icons from "../untils/icons";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
const { MdDelete } = icons;

const EditRow = ({
  index,
  item,
  dataHangHoa,
  handleDeleteRow,
  setRowData,
  currentRowData,
}) => {
  const [x, setX] = useState(item.SoLuong);
  const [selectedDVT, setSelectedDVT] = useState(item.DVT);

  useEffect(() => {
    setX(item.SoLuong.toFixed(1));
  }, [item.SoLuong]);

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
            DVTQuyDoi: selectedItem.DVTQuyDoi,
            DVTDefault: selectedItem.DVT,
            // DonGia: selectedItem.DonGia,
          };
        }
        return i;
      });

      return newData;
    });
  };

  const handleChangeUnit = (e) => {
    const newUnit = e;

    setSelectedDVT(newUnit);
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            DVT: newUnit,
          };
        }
        return i;
      });

      return newData;
    });
  };

  const handleChangeQuantity = () => {
    const newQuantity = Number(x).toFixed(1);
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

    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            TyLeThue: Number(newTax),
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
          className=" bg-white  w-[110px] h-full outline-none  "
          value={item.MaHang}
          onChange={handleChangeData}
        >
          <option disabled value="">
            Chọn mã hàng
          </option>
          {dataHangHoa
            .filter((row) => !currentRowData.includes(row.MaHang))
            .map((item) => (
              <option key={item.MaHang} value={item.MaHang}>
                {item.MaHang} - {item.TenHang}
              </option>
            ))}
        </select>
      </td>
      <td className="py-2 px-4 border">{item.TenHang}</td>
      {/* DVT */}
      {!item.DVTDefault ? (
        <td className="py-2 px-10 border">{item.DVT}</td>
      ) : item.DVTDefault === item.DVTQuyDoi ? (
        <td className="py-2 px-10 border">{item.DVTDefault}</td>
      ) : (
        <td className="py-2 px-4 border text-center">
          <select
            className=" bg-white h-full outline-none"
            value={selectedDVT}
            onChange={(e) => handleChangeUnit(e.target.value)}
          >
            <option value={item.DVTDefault}>{item.DVTDefault}</option>

            <option value={item.DVTQuyDoi}>{item.DVTQuyDoi}</option>
          </select>
        </td>
      )}

      <td className="py-2  border ">
        <input
          className="text-end px-4 "
          type="number"
          value={x}
          onChange={(e) => {
            const value = e.target.value;
            if (value.includes(".") && value.split(".")[1].length > 2) return;
            setX(e.target.value.replace(/[^0-9.]/g, ""));
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
              ? Number(item.DonGia.toString().replace(/,/g, "")) *
                Number(item.SoLuong)
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
          value={item.TyLeThue}
          onChange={handleChangeTax}
          // onInput="validateInput(this)"
        />
      </td>
      <td className="py-2 px-4 border text-end">
        <NumericFormat
          value={
            item.DonGia
              ? Number(item.DonGia.toString().replace(/,/g, "")) *
                Number(item.SoLuong) *
                (Number(item.TyLeThue) / 100)
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
              ? Number(item.DonGia.toString().replace(/,/g, "")) *
                  Number(item.SoLuong) +
                Number(item.DonGia.toString().replace(/,/g, "")) *
                  Number(item.SoLuong) *
                  (Number(item.TyLeThue) / 100)
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

export default EditRow;
