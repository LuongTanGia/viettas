/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'

import icons from '../untils/icons'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { base64ToPDF } from '../action/Actions'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import * as apis from '../apis'

const { IoMdClose } = icons

const ModalOnlyPrintWareHouse = ({ close, dataThongTin, dataPMH }) => {
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [newDataPMH, setNewDataPMH] = useState()

  const startDate = dayjs(dataThongTin.NgayCTu).format('YYYY-MM-DDTHH:mm:ss')
  const endDate = dayjs(dataThongTin.NgayCTu).format('YYYY-MM-DDTHH:mm:ss')

  const dataPMHByDate = useMemo(() => {
    return dataPMH.filter((item) => {
      const itemDate = new Date(item.NgayCTu)
      const ngaybt = new Date(startDate)
      const ngaykt = new Date(endDate)

      return itemDate >= ngaybt && itemDate <= ngaykt
    })
  }, [dataPMH, startDate, endDate])

  useEffect(() => {
    setNewDataPMH(dataPMHByDate)
  }, [dataPMHByDate])

  const [formPrint, setFormPrint] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  })

  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
  })

  useEffect(() => {
    if (dataPMHByDate) setSelectedSctBD(dataPMHByDate[0].SoChungTu)
    if (dataPMHByDate) setSelectedSctKT(dataPMHByDate[0].SoChungTu)
  }, [dataPMH, dataPMHByDate])

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2

    return total
  }

  const handleFilterPrint = () => {
    const ngayBD = dayjs(formPrint.NgayBatDau)
    const ngayKT = dayjs(formPrint.NgayKetThuc)
    // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
    const filteredData = dataPMH.filter((item) => {
      const itemDate = dayjs(item.NgayCTu)

      if (ngayBD.isValid() && ngayKT.isValid()) {
        return itemDate >= ngayBD && itemDate <= ngayKT
      }
    })
    setNewDataPMH(filteredData)
  }

  const handleLien = (checkboxName) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkboxName]: !prevValues[checkboxName],
    }))
  }

  const handleOnlyPrintWareHouse = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      const response = await apis.InPK(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults)
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else {
        toast.error(response.data.DataErrorDescription)
      }

      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="   ">
          <div className="pb-2 text-text-title font-bold">In phiếu kho</div>
          <div className="flex justify-center items-center  gap-3 pl-[74px] ">
            {/* DatePicker */}
            <div className="flex gap-x-5 items-center">
              <label htmlFor="">Ngày</label>
              <DatePicker
                className="DatePicker_PMH"
                format="DD/MM/YYYY"
                defaultValue={dayjs(dataThongTin?.NgayCTu)}
                onChange={(newDate) => {
                  setFormPrint({
                    ...formPrint,
                    NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                  })
                }}
              />
            </div>
            <div className="flex gap-x-5 items-center">
              <label htmlFor="">Đến</label>
              <DatePicker
                className="DatePicker_PMH"
                format="DD/MM/YYYY"
                defaultValue={dayjs(dataThongTin?.NgayCTu)}
                onChange={(newDate) => {
                  setFormPrint({
                    ...formPrint,
                    NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                  })
                }}
              />
            </div>

            <button
              className="flex items-center mx-2 py-1 px-2  rounded-md   border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main  "
              onClick={handleFilterPrint}
            >
              Lọc
            </button>
          </div>
          <div className="flex  mt-4">
            <div className="flex ">
              <label className="px-4">Số chứng từ</label>
              <select className=" bg-white border outline-none border-gray-300  " value={selectedSctBD} onChange={(e) => setSelectedSctBD(e.target.value)}>
                {newDataPMH?.map((item) => (
                  <option key={item.SoChungTu} value={item.SoChungTu}>
                    {item.SoChungTu}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex ">
              <label className="px-4">Đến</label>
              <select className=" bg-white border outline-none border-gray-300  " value={selectedSctKT} onChange={(e) => setSelectedSctKT(e.target.value)}>
                {newDataPMH?.map((item) => (
                  <option key={item.SoChungTu} value={item.SoChungTu}>
                    {item.SoChungTu}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* liên */}
          <div className="flex justify-center items-center gap-6 mt-4">
            <div>
              <input id="lien1" type="checkbox" checked={checkboxValues.checkbox1} onChange={() => handleLien('checkbox1')} />
              <label htmlFor="lien1">Liên 1</label>
            </div>

            <div>
              <input id="lien2" type="checkbox" checked={checkboxValues.checkbox2} onChange={() => handleLien('checkbox2')} />
              <label htmlFor="lien2">Liên 2</label>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={handleOnlyPrintWareHouse}
              className="active:scale-[.98] active:duration-75  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
            >
              Xác nhận
            </button>
            <button
              onClick={() => close()}
              className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalOnlyPrintWareHouse
