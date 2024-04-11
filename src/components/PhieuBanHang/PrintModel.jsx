/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Logo from '../../assets/VTS-iSale.ico'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import './phieubanhang.css'
import { Checkbox, Col, Row } from 'antd'
import { Select, Button, Spin } from 'antd'
import ActionButton from '../util/Button/ActionButton'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { HiOutlineDocumentMagnifyingGlass } from 'react-icons/hi2'
import { TfiPrinter } from 'react-icons/tfi'
import { RiFilePaper2Line } from 'react-icons/ri'
import { INPHIEUPBS, LISTCHUNGTU, base64ToPDF } from '../../action/Actions'
import API from '../../API/API'
import { toast } from 'react-toastify'
import { DateField } from '@mui/x-date-pickers/DateField'

const { Option } = Select

function ModelPrint({ soChungTuPrint, isShowModel, handleCloseAction, dataDatePrint, modelType, selectMH }) {
  const token = localStorage.getItem('TKN')
  // const [dateFrom, setDateFrom] = useState(data?.NgayBatDau)
  // const [dateTo, setDateTo] = useState(data?.NgayKetThuc)
  const [soLien, setSoLien] = useState([1])
  const [loading, setLoading] = useState(true)
  const [dataSoChungTu, setDataSoChungTu] = useState([])
  const [dataDate, setDataDate] = useState({
    NgayBatDau: null,
    NgayKetThuc: null,
  })
  const [dateChange, setDateChange] = useState(false)
  const [soChungTuFrom, setSoChungTuFrom] = useState(null)
  const [soChungTuTo, setSoChungTuTo] = useState(null)
  console.log(selectMH)
  useEffect(() => {
    setLoading(true)
    // setDateFrom(dayjs(data?.NgayBatDau))
    // setDateTo(dayjs(data?.NgayKetThuc))
    setDataDate({
      NgayBatDau: dayjs(dataDatePrint?.NgayBatDau),
      NgayKetThuc: dayjs(dataDatePrint?.NgayKetThuc),
    })
    setSoChungTuFrom(soChungTuPrint !== '' ? soChungTuPrint : selectMH)
    setSoChungTuTo(soChungTuPrint !== '' ? soChungTuPrint : selectMH)
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [dataDatePrint?.NgayBatDau, dataDatePrint?.NgayKetThuc, soChungTuPrint, selectMH])

  const handleDateFromChange = (newValue) => {
    setDataDate({
      ...dataDate,
      NgayBatDau: dayjs(newValue),
    })
    setDateChange(false)
  }
  const handleDateToChange = (newValue) => {
    setDataDate({
      ...dataDate,
      NgayKetThuc: dayjs(newValue),
    })
    setDateChange(true)
  }
  const onChange = (value) => {
    setSoLien(value)
  }

  useEffect(() => {
    const handleListPhieuThu = async () => {
      setLoading(true)
      const response = await LISTCHUNGTU(API.LISTCHUNGTU, token, {
        ...dataDate,
        NgayBatDau: dayjs(dataDate?.NgayBatDau).format('YYYY-MM-DD'),
        NgayKetThuc: dayjs(dataDate?.NgayKetThuc).format('YYYY-MM-DD'),
      })
      setDataSoChungTu(response)
      setLoading(false)
    }
    if (isShowModel) {
      handleListPhieuThu()
      setSoLien([1])
    }
    if (dataSoChungTu?.length < 1) {
      setSoChungTuTo(null)
      setSoChungTuFrom(null)
    }
  }, [isShowModel, dataDate?.NgayBatDau, dataDate?.NgayKetThuc])

  const handleChangeSCTFrom = (value) => {
    // setSoChungTuFrom(value)
    setSoChungTuFrom(value)
    if (soChungTuTo !== null && dataSoChungTu?.findIndex((item) => item.SoChungTu === value) > dataSoChungTu?.findIndex((item) => item.SoChungTu === soChungTuTo)) {
      setSoChungTuTo(value)
    } else {
      setSoChungTuTo(value)
    }
  }
  const handleChangeSCTTo = (value) => {
    // setSoChungTuTo(value)
    setSoChungTuTo(value)
    if (soChungTuFrom !== null && dataSoChungTu?.findIndex((item) => item.SoChungTu === value) < dataSoChungTu?.findIndex((item) => item.SoChungTu === soChungTuFrom)) {
      setSoChungTuFrom(value)
    } else {
      setSoChungTuTo(value)
    }
  }
  const handleInPhieu = async () => {
    if (soLien !== null) {
      const response = await INPHIEUPBS(modelType !== 'PhieuKho' ? API.INPHIEU : API.INPHIEUKHO, token, {
        NgayBatDau: dataDate?.NgayBatDau.format('YYYY-MM-DD'),
        NgayKetThuc: dataDate?.NgayKetThuc.format('YYYY-MM-DD'),
        SoChungTuBatDau: soChungTuFrom,
        SoChungTuKetThuc: soChungTuTo,
        SoLien: soLien.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      })
      base64ToPDF(response)
    } else {
      toast.warning('Chọn số liên muốn in !')
    }
  }
  const close = () => {
    handleCloseAction()
    setSoChungTuFrom(null)
    setSoChungTuTo(null)
  }
  let timerId
  const handleDateChange = () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!dateChange && dataDate?.NgayBatDau && dataDate?.NgayKetThuc && dataDate?.NgayBatDau.isAfter(dataDate?.NgayKetThuc)) {
        setDataDate({
          NgayBatDau: dayjs(dataDate?.NgayBatDau),
          NgayKetThuc: dayjs(dataDate?.NgayBatDau),
        })
        return
      } else if (dateChange && dataDate?.NgayBatDau && dataDate?.NgayKetThuc && dataDate?.NgayBatDau.isAfter(dataDate?.NgayKetThuc)) {
        setDataDate({
          NgayBatDau: dayjs(dataDate?.NgayKetThuc),
          NgayKetThuc: dayjs(dataDate?.NgayKetThuc),
        })
      } else {
        setDataDate({
          NgayBatDau: dayjs(dataDate?.NgayBatDau),
          NgayKetThuc: dayjs(dataDate?.NgayKetThuc),
        })
      }
    }, 800)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }
  return (
    <>
      {isShowModel ? (
        <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
          <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
            <Spin tip="Loading..." spinning={loading}>
              <div className="flex flex-col gap-2 p-2 xl:w-[50vw] lg:w-[70vw] md:w-[95vw]">
                <div className="flex gap-2 text-blue-700 font-semibold uppercase">
                  <img src={Logo} alt="logo" className="w-[20px]" />
                  {modelType !== 'PhieuKho' ? 'In - Phiếu Bán Hàng' : 'In - Phiếu Bán Hàng (Kho)'}
                </div>
                <div className="flex flex-col items-center gap-4 border-2 py-3">
                  <div className="flex justify-center gap-2">
                    <div className="DatePicker_NDCKho flex items-center gap-2">
                      <label className="ml-[20px]">Từ</label>
                      <DateField
                        className="max-w-[170px]"
                        sx={{
                          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                          '& .MuiButtonBase-root': {
                            padding: '4px',
                          },
                          '& .MuiSvgIcon-root': {
                            width: '18px',
                            height: '18px',
                          },
                        }}
                        value={dataDate?.NgayBatDau}
                        onChange={handleDateFromChange}
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        format="DD/MM/YYYY"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label>Đến</label>
                      <DateField
                        className="max-w-[180px]"
                        sx={{
                          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                          '& .MuiButtonBase-root': {
                            padding: '4px',
                          },
                          '& .MuiSvgIcon-root': {
                            width: '18px',
                            height: '18px',
                          },
                        }}
                        value={dataDate?.NgayKetThuc}
                        onChange={handleDateToChange}
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        format="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-2 items-center whitespace-nowrap w-[50%]">
                      <div>Số chứng từ</div>
                      <Select
                        style={{
                          width: '200px',
                        }}
                        placeholder={'Chọn nhóm'}
                        value={soChungTuFrom}
                        onChange={handleChangeSCTFrom}
                        showSearch
                        size="small"
                      >
                        {dataSoChungTu?.map((item, index) => (
                          <Option value={item?.SoChungTu} key={index}>
                            {modelType !== 'PhieuKho' ? item?.SoChungTu : `${item?.SoChungTu}_GV`}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-2 items-center w-[40%]">
                      <div>Tới</div>
                      <Select
                        style={{
                          width: '200px',
                        }}
                        placeholder={'Chọn nhóm'}
                        value={soChungTuTo}
                        onChange={handleChangeSCTTo}
                        showSearch
                        size="small"
                      >
                        {dataSoChungTu?.map((item, index) => (
                          <Option value={item?.SoChungTu} key={index}>
                            {modelType !== 'PhieuKho' ? item?.SoChungTu : `${item?.SoChungTu}_GV`}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {modelType !== 'PhieuKho' ? (
                      <Checkbox.Group
                        style={{
                          width: '100%',
                        }}
                        defaultValue={[1]}
                        onChange={onChange}
                        className="phieuKhoLien"
                      >
                        <Row className="flex gap-2 items-center">
                          <Checkbox value={1}>Liên 1</Checkbox>
                          <Checkbox value={2}>Liên 2</Checkbox>
                          <Checkbox value={4}>Liên 3</Checkbox>
                        </Row>
                      </Checkbox.Group>
                    ) : (
                      <Checkbox.Group
                        style={{
                          width: '100%',
                        }}
                        defaultValue={[1]}
                        onChange={onChange}
                        className="phieuKhoLien"
                      >
                        <Row className="flex gap-2 items-center">
                          <Checkbox value={1}>Liên 1</Checkbox>
                          <Checkbox value={2}>Liên 2</Checkbox>
                        </Row>
                      </Checkbox.Group>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <ActionButton
                    color={'slate-50'}
                    title={'Xác nhận'}
                    background={'blue-500'}
                    bg_hover={'white'}
                    color_hover={'blue-500'}
                    handleAction={handleInPhieu}
                    isModal={true}
                  />
                  <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={close} />
                </div>
              </div>
            </Spin>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ModelPrint
