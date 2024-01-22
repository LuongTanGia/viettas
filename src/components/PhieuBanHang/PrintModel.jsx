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

function ModelPrint({ soChungTuPrint, isShowModel, handleCloseAction, data, modelType, selectMH }) {
  const token = localStorage.getItem('TKN')

  const [dateFrom, setDateFrom] = useState(dayjs(data?.NgayBatDau))
  const [dateTo, setDateTo] = useState(dayjs(data?.NgayKetThuc))
  const [soLien, setSoLien] = useState([1])
  const [loading, setLoading] = useState(true)
  const [dataSoChungTu, setDataSoChungTu] = useState([])

  const [soChungTuFrom, setSoChungTuFrom] = useState(soChungTuPrint !== '' ? soChungTuPrint : selectMH)
  const [soChungTuTo, setSoChungTuTo] = useState(soChungTuPrint !== '' ? soChungTuPrint : selectMH)

  useEffect(() => {
    setLoading(true)
    setDateFrom(dayjs(data?.NgayBatDau))
    setDateTo(dayjs(data?.NgayKetThuc))
    setSoChungTuFrom(soChungTuPrint !== '' ? soChungTuPrint : selectMH)
    setSoChungTuTo(soChungTuPrint !== '' ? soChungTuPrint : selectMH)
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [data?.NgayBatDau, data?.NgayKetThuc, soChungTuPrint, selectMH])
  const handleDateFromChange = (newValue) => {
    setDateFrom(newValue)
  }
  const handleDateToChange = (newValue) => {
    setDateTo(newValue)
  }
  const onChange = (value) => {
    setSoLien(value)
  }

  useEffect(() => {
    const handleListPhieuThu = async () => {
      setLoading(true)

      const response = await LISTCHUNGTU(API.LISTCHUNGTU, token, { NgayBatDau: dateFrom.format('YYYY-MM-DD'), NgayKetThuc: dateTo.format('YYYY-MM-DD') })
      setDataSoChungTu(response)
      setLoading(false)
    }
    if (isShowModel) {
      handleListPhieuThu()
      setSoLien([1])
    }

    if (dataSoChungTu < 1) {
      setSoChungTuTo()
      setSoChungTuFrom()
    }
  }, [isShowModel])

  const handleChangeSCTFrom = (value) => {
    setSoChungTuFrom(value)
  }
  const handleChangeSCTTo = (value) => {
    setSoChungTuTo(value)
  }
  const handleListPhieuThu = async () => {
    setLoading(true)

    const response = await LISTCHUNGTU(API.LISTCHUNGTU, token, { NgayBatDau: dateFrom.format('YYYY-MM-DD'), NgayKetThuc: dateTo.format('YYYY-MM-DD') })
    setDataSoChungTu(response)
    setLoading(false)
  }
  const handleInPhieu = async () => {
    if (soLien !== null) {
      console.log(soLien)
      const response = await INPHIEUPBS(modelType !== 'PhieuKho' ? API.INPHIEU : API.INPHIEUKHO, token, {
        NgayBatDau: dateFrom.format('YYYY-MM-DD'),
        NgayKetThuc: dateTo.format('YYYY-MM-DD'),
        SoChungTuBatDau: soChungTuFrom,
        SoChungTuKetThuc: soChungTuTo,
        SoLien: soLien.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      })

      base64ToPDF(response)
    } else {
      toast.info('Chọn Số Liên Muốn In !')
    }
  }
  const close = () => {
    handleCloseAction()
    setSoChungTuFrom('')
    setSoChungTuTo('')
  }

  return (
    <>
      {isShowModel ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
          <div className="m-6 p-4  shadow-lg bg-white rounded-md flex flex-col h-[45%]">
            <Spin tip="Loading..." spinning={loading}>
              <div className="w-[40vw] h-[270px] min-w-[420px] flex flex-col justify-between">
                <div className="flex justify-between items-start ">
                  <label className=" flex gap-1 mb-2 text-blue-700 uppercase font-semibold ">
                    <img src={Logo} alt="logo" className="w-[20px]" />
                    {modelType !== 'PhieuKho' ? 'In Phiếu Bán Hàng' : 'In Phiếu Bán Sỉ (Kho)(Phiếu Kho)'}
                  </label>
                </div>
                <div className="w-full h-[270px] rounded-sm text-sm border border-gray-300 flex flex-col justify-between">
                  <div>
                    <div className="w-full flex items-center justify-center mt-3 gap-5  ">
                      <DateField value={dateFrom} onChange={handleDateFromChange} onBlur={handleListPhieuThu} format="DD/MM/YYYY" />
                      <DateField value={dateTo} onChange={handleDateToChange} onBlur={handleListPhieuThu} format="DD/MM/YYYY" />
                    </div>
                    <div className="w-full flex items-center justify-center gap-5 mt-3 ">
                      <div className="flex justify-center ">
                        <Select className="w-[170px] outline-none" placeholder="Số Chứng từ " value={soChungTuFrom} onChange={handleChangeSCTFrom} showSearch>
                          {dataSoChungTu?.map((item, index) => (
                            <Option value={item?.SoChungTu} key={index}>
                              {modelType !== 'PhieuKho' ? item?.SoChungTu : `${item?.SoChungTu}_GV`}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className=" flex justify-center">
                        <Select className="w-[170px] outline-none" placeholder="Đến" value={soChungTuTo} onChange={handleChangeSCTTo} showSearch>
                          {dataSoChungTu?.map((item, index) => (
                            <Option value={item?.SoChungTu} key={index}>
                              {modelType !== 'PhieuKho' ? item?.SoChungTu : `${item?.SoChungTu}_GV`}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="w-full  flex items-center justify-center gap-2  mt-3">
                      {modelType !== 'PhieuKho' ? (
                        <Checkbox.Group
                          style={{
                            width: '100%',
                          }}
                          defaultValue={[1]}
                          onChange={onChange}
                          className="phieuKhoLien"
                        >
                          <Row>
                            <Col span={6}>
                              <Checkbox value={1}>Liên 1</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox value={2}>Liên 2</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox value={4}>Liên 3</Checkbox>
                            </Col>
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
                          <Row>
                            <Col span={6}>
                              <Checkbox value={1}>Liên 1</Checkbox>
                            </Col>
                            <Col span={6}>
                              <Checkbox value={2}>Liên 2</Checkbox>
                            </Col>
                          </Row>
                        </Checkbox.Group>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-[20%] flex items-center justify-end gap-2  pr-4">
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
                      handleAction={close}
                    />
                  </div>
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
