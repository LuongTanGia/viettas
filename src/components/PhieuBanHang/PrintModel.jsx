/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Logo from '../../assets/VTS-iSale.ico'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import './phieubanhang.css'
import { Select, Checkbox, Button } from 'antd'
import ActionButton from '../util/Button/ActionButton'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { HiOutlineDocumentMagnifyingGlass } from 'react-icons/hi2'
import { TfiPrinter } from 'react-icons/tfi'
import { RiFilePaper2Line } from 'react-icons/ri'
import { INPHIEUPBS, LISTCHUNGTU, base64ToPDF } from '../../action/Actions'
import API from '../../API/API'

const { Option } = Select

function ModelPrint({ isShowModel, handleCloseAction }) {
  const token = localStorage.getItem('TKN')

  const [dateFrom, setDateFrom] = useState(dayjs(new Date()))
  const [dateTo, setDateTo] = useState(dayjs(new Date()))
  const [soLien, setSoLien] = useState(0)
  const [dataSoChungTu, setDataSoChungTu] = useState([])
  const [soChungTuFrom, setSoChungTuFrom] = useState()
  const [soChungTuTo, setSoChungTuTo] = useState()

  const handleDateFromChange = (newValue) => {
    setDateFrom(newValue)
  }
  const handleDateToChange = (newValue) => {
    setDateTo(newValue)
  }
  const onChange = (e) => {
    if (e.target.checked) {
      setSoLien((pre) => pre + e.target.value)
    } else {
      setSoLien((pre) => pre - e.target.value)
    }
  }
  console.log(soLien)
  useEffect(() => {
    const handleListPhieuThu = async () => {
      const response = await LISTCHUNGTU(API.LISTCHUNGTU, token, { NgayBatDau: dateFrom.format('YYYY-MM-DD'), NgayKetThuc: dateTo.format('YYYY-MM-DD') })
      setDataSoChungTu(response)
    }
    if (isShowModel) {
      handleListPhieuThu()
      setSoLien(1)
    }

    if (dataSoChungTu < 1) {
      setSoChungTuTo()
      setSoChungTuFrom()
    }
  }, [dateFrom, dateTo, isShowModel])

  const handleChangeSCTFrom = (value) => {
    setSoChungTuFrom(value)
  }
  const handleChangeSCTTo = (value) => {
    setSoChungTuTo(value)
  }

  const handleInPhieu = async () => {
    const response = await INPHIEUPBS(API.INPHIEU, token, {
      NgayBatDau: dateFrom.format('YYYY-MM-DD'),
      NgayKetThuc: dateTo.format('YYYY-MM-DD'),
      SoChungTuBatDau: soChungTuFrom,
      SoChungTuKetThuc: soChungTuTo,
      SoLien: soLien,
    })

    base64ToPDF(response)
  }

  return (
    <>
      {isShowModel ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
          <div className="m-6 p-4 absolute shadow-lg bg-white rounded-md flex flex-col h-[45%]">
            <div className="w-[40vw] h-[100%]">
              <div className="flex justify-between items-start ">
                <label className="font-bold flex gap-1 mb-2">
                  <img src={Logo} alt="logo" className="w-[20px]" />
                  In Phiếu Bán Hàng
                </label>
              </div>
              <div className="w-full h-[70%] rounded-sm text-sm border border-gray-300">
                <div className="w-full flex items-center justify-center mt-3 gap-5 DateBox flex-wrap">
                  <DatePicker
                    value={dateFrom}
                    onChange={handleDateFromChange}
                    label="Từ ngày"
                    slotProps={{
                      textField: {
                        helperText: 'Ngày/Tháng/Năm',
                      },
                    }}
                    format="DD/MM/YYYY"
                  />
                  <DatePicker
                    value={dateTo}
                    onChange={handleDateToChange}
                    label="Đến ngày"
                    slotProps={{
                      textField: {
                        helperText: 'Ngày/Tháng/Năm',
                      },
                    }}
                    format="DD/MM/YYYY"
                  />
                </div>
                <div className="w-full flex items-center justify-center gap-[50px]  flex-wrap mt-3 selectBox">
                  <div className="flex justify-center ">
                    <Select className="w-[200px] outline-none" placeholder="Số Chứng từ " value={soChungTuFrom} onChange={handleChangeSCTFrom} showSearch>
                      {dataSoChungTu?.map((item, index) => (
                        <Option value={item?.SoChungTu} key={index}>
                          {item?.SoChungTu}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className=" flex justify-center">
                    <Select className="w-[200px] outline-none" placeholder="Đến" value={soChungTuTo} onChange={handleChangeSCTTo} showSearch>
                      {dataSoChungTu?.map((item, index) => (
                        <Option value={item?.SoChungTu} key={index}>
                          {item?.SoChungTu}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="w-full  flex items-center justify-center gap-2  mt-3">
                  <Checkbox onChange={onChange} className="text-base" value={1}>
                    Liên 1
                  </Checkbox>
                  <Checkbox onChange={onChange} className="text-base" value={2}>
                    Liên 2
                  </Checkbox>
                  <Checkbox onChange={onChange} className="text-base" value={4}>
                    Liên 3
                  </Checkbox>
                </div>
                <div className="w-full h-[20%] flex items-center justify-end gap-2 mt-10 ">
                  <ActionButton
                    color={'slate-50'}
                    title={'Chữ Ký'}
                    background={'blue-500'}
                    icon={<RiFilePaper2Line />}
                    bg_hover={'white'}
                    color_hover={'blue-500'}
                    // handleAction={handleCloseAction}
                  />
                  <ActionButton
                    color={'slate-50'}
                    title={'In Nhanh'}
                    background={'blue-500'}
                    icon={<TfiPrinter />}
                    bg_hover={'white'}
                    color_hover={'blue-500'}
                    // handleAction={handleCloseAction}
                  />
                  <ActionButton
                    color={'slate-50'}
                    title={'Xem Bản In'}
                    background={'blue-500'}
                    icon={<HiOutlineDocumentMagnifyingGlass />}
                    bg_hover={'white'}
                    color_hover={'blue-500'}
                    handleAction={handleInPhieu}
                  />
                  <ActionButton
                    color={'slate-50'}
                    title={'Đóng'}
                    background={'red-500'}
                    icon={<IoIosCloseCircleOutline />}
                    bg_hover={'white'}
                    color_hover={'red-500'}
                    handleAction={handleCloseAction}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ModelPrint
