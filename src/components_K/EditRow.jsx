/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import icons from '../untils/icons'
import { toast } from 'react-toastify'
import { NumericFormat } from 'react-number-format'
import { InputNumber } from 'antd'
const { MdDelete } = icons

const EditRow = ({ index, item, dataHangHoa, handleDeleteRow, setRowData, currentRowData, handleEditDetail }) => {
  const [SoLuong, setSoLuong] = useState(item.SoLuong)
  const [selectedDVT, setSelectedDVT] = useState(item.DVT)

  useEffect(() => {
    setSoLuong(item?.SoLuong?.toFixed(1))
  }, [item.SoLuong])

  const handleChangeData = (e) => {
    const mahang = e.target.value
    const selectedItem = dataHangHoa.find((item) => item.MaHang === mahang)
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
          }
        }
        return i
      })

      return newData
    })
  }

  const handleChangeUnit = (e) => {
    const newUnit = e

    setSelectedDVT(newUnit)
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            DVT: newUnit,
          }
        }
        return i
      })

      return newData
    })
  }

  const handleChangeQuantity = () => {
    const newQuantity = Number(SoLuong).toFixed(1)
    setSoLuong(newQuantity)
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            SoLuong: Number(newQuantity),
          }
        }
        return i
      })
      return newData
    })
  }

  const handleChangePrice = (e) => {
    const isValid = /^[0-9,]*$/.test(e.target.value)
    if (!isValid) return
    const newPrice = Number(e.target.value.replace(/,/g, '')).toLocaleString()
    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            DonGia: newPrice,
          }
        }
        return i
      })
      return newData
    })
  }

  const handleChangeTax = (value) => {
    // const newTax = e.target.value;
    const newTax = value

    setRowData((prev) => {
      const newData = prev.map((i) => {
        if (i.MaHang === item.MaHang) {
          return {
            ...i,
            TyLeThue: Number(newTax),
          }
        }
        return i
      })
      return newData
    })
  }

  return (
    <tr key={index}>
      <td className="py-2 px-4 border text-center ">{index + 1}</td>

      <td className="border items-center w-[114px]">
        <select className=" bg-white  w-[110px] h-full outline-none  " value={item.MaHang} onChange={handleChangeData}>
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
      <td className="py-2 px-4 border whitespace-nowrap ">{item.TenHang}</td>
      {/* DVT */}
      {!item.DVTDefault ? (
        <td className="py-2 px-10 border">{item.DVT}</td>
      ) : item.DVTDefault === item.DVTQuyDoi ? (
        <td className="py-2 px-10 border">{item.DVTDefault}</td>
      ) : (
        <td className="py-2 px-4 border text-center">
          <select className=" bg-white h-full outline-none" value={selectedDVT} onChange={(e) => handleChangeUnit(e.target.value)}>
            <option value={item.DVTDefault}>{item.DVTDefault}</option>

            <option value={item.DVTQuyDoi}>{item.DVTQuyDoi}</option>
          </select>
        </td>
      )}

      <td className="py-2  border w-20 ">
        <input
          className="text-end rounded-[4px]  "
          type="number"
          value={SoLuong}
          onChange={(e) => {
            const value = e.target.value
            if (value.includes('.') && value.split('.')[1].length > 2) return
            setSoLuong(e.target.value.replace(/[^0-9.]/g, ''))

            // handleEditDetail(index, 'SoLuong', e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleChangeQuantity()
          }}
          onBlur={handleChangeQuantity}
        />
      </td>
      <td className="py-2 border w-[150px] ">
        <input
          className=" px-2 text-end  rounded-[4px] "
          type="text"
          pattern="[0-9]+"
          title="Please enter a numeric value"
          value={item.DonGia.toLocaleString()}
          onChange={handleChangePrice}
        />
      </td>
      <td className="py-2 px-4 border text-end w-[150px]">
        <NumericFormat value={item.DonGia ? Number(item.DonGia.toString().replace(/,/g, '')) * Number(item.SoLuong) : 0} displayType={'text'} thousandSeparator={true} />
      </td>
      <td className="py-2 border w-[100px]">
        <InputNumber
          className="text-end w-full"
          min={0}
          max={100}
          size="small"
          bordered={false}
          defaultValue={item.TyLeThue}
          formatter={(value) => `${value}`.slice(0, 3)} // Hiển thị tối đa 3 chữ số
          parser={(value) => {
            const newValue = value.replace(/\D/g, '').slice(0, 3)
            return newValue === '' ? null : Number(newValue)
          }}
          onChange={handleChangeTax}
        />
        {/* <input
            className=" text-end"
            type="number"
            min={0}
            max={100}
            value={item.TyLeThue}
            onChange={handleChangeTax}
            
          /> */}
      </td>
      <td className="py-2 px-4 border text-end">
        <NumericFormat
          value={item.DonGia ? Number(item.DonGia.toString().replace(/,/g, '')) * Number(item.SoLuong) * (Number(item.TyLeThue) / 100) : 0}
          displayType={'text'}
          thousandSeparator={true}
        />
      </td>
      <td className="py-2 px-4 border text-end">
        <NumericFormat
          value={
            item.DonGia
              ? Number(item.DonGia.toString().replace(/,/g, '')) * Number(item.SoLuong) +
                Number(item.DonGia.toString().replace(/,/g, '')) * Number(item.SoLuong) * (Number(item.TyLeThue) / 100)
              : 0
          }
          displayType={'text'}
          thousandSeparator={true}
        />
      </td>
      <td className="py-2 flex justify-center  border ">
        <span onClick={() => handleDeleteRow(index)} className="p-[3px] text-red-500  rounded-md hover:text-white hover:bg-red-500  cursor-pointer ">
          <MdDelete size={20} />
        </span>
      </td>
    </tr>
  )
}

export default EditRow
