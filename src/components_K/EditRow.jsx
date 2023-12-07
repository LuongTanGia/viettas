/* eslint-disable react/prop-types */
import React from "react";
import icons from "../untils/icons";
import { toast } from "react-toastify";
const { MdDelete } = icons;

const EditRow = ({
  index,
  handleDeleteRow,
  roundNumber,
  item,
  dataHangHoa,
}) => {
  return (
    <tr key={item.MaHang}>
      <td className="py-2 px-4 border text-center">{index + 1}</td>
      <td className="py-2 px-4 border ">{item.MaHang} </td>
      <td className="py-2 px-4 border ">{item.TenHang} </td>
      <td className="py-2 px-4 border text-center">{item.DVT}</td>
      <td className="py-2 px-4 border text-end">{item.SoLuong}</td>
      <td className="py-2 px-4 border text-end">{item.DonGia}</td>
      <td className="py-2 px-4 border text-end">{item.TienHang}</td>
      <td className="py-2 px-4 border text-end">{item.Thue}</td>
      <td className="py-2 px-4 border text-end">{item.TienThue}</td>
      <td className="py-2 px-4 border text-end">{item.ThanhTien}</td>
      {/* <td className="py-2 flex justify-center ">
        <span
          onClick={() => handleDeleteRow(index)}
          className="p-[3px] text-red-500 border  border-red-500 rounded-md hover:text-white hover:bg-red-500  cursor-pointer "
        >
          <MdDelete size={20} />
        </span>
      </td> */}
    </tr>
  );
};

export default EditRow;
