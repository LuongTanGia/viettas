/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import Table from '../util/Table/Table'
import LoadingPage from '../util/Loading/LoadingPage'
import { MdPrint } from 'react-icons/md'
import { nameColumnsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG, XOAPHIEUBANHANG, LAPPHIEUTHU, KHOANNGAY, exportToExcel, APIPHANQUYEN } from '../../action/Actions'
import API from '../../API/API'
import { toast } from 'react-toastify'
import ModelPrint from './PrintModel'
import ActionButton from '../util/Button/ActionButton'
import Model from './Model'
import { DateField } from '@mui/x-date-pickers/DateField'
import { BsSearch } from 'react-icons/bs'
import dayjs from 'dayjs'
import { Checkbox, Col, Empty, Input, Row, Tooltip } from 'antd'
import { TfiMoreAlt } from 'react-icons/tfi'
import { CgCloseO } from 'react-icons/cg'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { Button, Spin } from 'antd'
import { IoAddCircleOutline } from 'react-icons/io5'
import { FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'

function PhieuBanHang() {
  const optionContainerRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [modelType, setModelType] = useState('')
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [data, setData] = useState()
  const [isShow, setIsShow] = useState(false)
  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isShowDelete, setIsShowDelete] = useState(false)
  const [typeModel, setTypeModel] = useState('')
  const [type, setType] = useState()
  const [dataRecord, setDataRecord] = useState([])
  const [selectMH, setSelectMH] = useState()
  const [isShowOption, setIsShowOption] = useState(false)
  const [dateModal, setDateModal] = useState()
  const [dataDate, setDataDate] = useState({
    NgayBatDau: null,
    NgayKetThuc: null,
  })
  const [dateChange, setDateChange] = useState(false)
  // const [soChungTuPrint, setSoChungTuPrint] = useState()
  const [hidden, setHidden] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [dataCRUD, setDataCRUD] = useState()
  const isMatch = (value, searchText) => {
    const stringValue = String(value).toLowerCase()
    const searchTextLower = searchText.toLowerCase()
    if (stringValue.includes(searchTextLower)) {
      return true
    }
    const isDateTime = dayjs(stringValue).isValid()
    if (isDateTime) {
      const formattedValue = dayjs(stringValue).format('DD/MM/YYYY HH:mm:ss').toString()
      const formattedSearchText = searchTextLower
      if (formattedValue.includes(formattedSearchText)) {
        return true
      }
    }
    return false
  }
  useEffect(() => {
    setHidden(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(data ? data[0] : [] || []).filter((key) => key !== 'MaSoThue')
    setOptions(key)
  }, [selectVisible])

  useEffect(() => {
    const getDate = async () => {
      const date = await KHOANNGAY(API.KHOANNGAY, token)
      const quyenHan = await APIPHANQUYEN(token, {
        Ma: 'DuLieu_PBS',
      })
      setDataCRUD(quyenHan)
      setDataDate({
        NgayBatDau: dayjs(date.NgayBatDau),
        NgayKetThuc: dayjs(date.NgayKetThuc),
      })
    }
    getDate()
  }, [])

  let timerId
  const handleInputChange = (e) => {
    const inputValue = e.target.value
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchText(inputValue)
    }, 1000)
  }
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

  useEffect(() => {
    const getListData = async () => {
      setLoadingSearch(true)
      const filteredDataRes = await DANHSACHPHIEUBANHANG(
        API.DANHSACHPBS,
        token,
        {
          ...dataDate,
          NgayBatDau: dayjs(dataDate?.NgayBatDau).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(dataDate?.NgayKetThuc).format('YYYY-MM-DD'),
        },
        dispatch,
      )
      if (filteredDataRes === -1) {
        setData([])
      } else {
        const newData = filteredDataRes?.filter((record) => {
          return Object.keys(record).some((key) => isMatch(record[key], searchText))
        })
        setData(newData)
      }
      setDataLoaded(true)
      setLoadingSearch(false)
    }
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (dataDate && dataDate?.NgayBatDau && dataDate?.NgayKetThuc) {
        getListData()
      }
    }, 1000)
  }, [searchText, selectMH, dataDate?.NgayBatDau, dataDate?.NgayKetThuc])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionContainerRef.current && !optionContainerRef.current.contains(event.target)) {
        setIsShowOption(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isShowOption])

  useEffect(() => {
    if (dataCRUD?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataCRUD])

  const handleView = async (record) => {
    await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch)
    setIsShow(true)
    setType('view')
    setDataRecord(record)
  }
  const handleEdit = async (record) => {
    const res = await THONGTINPHIEU(API.CHITIETEDITPBS, token, record?.SoChungTu, dispatch)
    if (res.DataError == 0) {
      setIsShow(true)
      setType('edit')
      setDataRecord(record)
    } else {
      toast.warning(res.DataErrorDescription, { autoClose: 2000 })
    }
  }
  const handleCreate = async () => {
    setIsShow(true)
    setType('create')
    setDataRecord([])
  }
  const handleClose = () => {
    setIsShow(false)
    setIsShowDelete(false)
  }
  const setMaHang = (value) => {
    setSelectMH(value)
  }
  const handleCloseAction = () => {
    setIsShowPrint(false)
    // setDataRecord([])
  }
  const handleDelete = async (record) => {
    setIsShowDelete(true)
    setDataRecord(record)
    setTypeModel('Delete')
  }
  const ActionDelete = async (record) => {
    const response = await XOAPHIEUBANHANG(API.XOAPHIEUBANHANG, token, { SoChungTu: record?.SoChungTu }, dispatch)
    if (response !== 1) {
      setIsShowDelete(false)
      setIsShow(false)
      setDataRecord([])
      setSelectMH([])
    } else {
      toast.info(`${record?.SoChungTu} đã lập phiếu thu tiền!`)
    }
  }
  const ActionPay = async (record) => {
    await LAPPHIEUTHU(API.LAPPHIEUTHU, token, { SoChungTu: record?.SoChungTu }, dispatch)
    setIsShowDelete(false)
    setIsShow(false)
    setDataRecord(record?.SoChungTu)
    setSelectMH(record?.SoChungTu)
  }
  const handleChangePhieuThu = async (record) => {
    setIsShowDelete(true)
    setDataRecord(record)
    setTypeModel('Pay')
  }
  const handleShowPrint = () => {
    setIsShowPrint(!isShowPrint)
    setModelType('')
  }
  const handleShowPrint_kho = () => {
    setIsShowPrint(!isShowPrint)
    setModelType('PhieuKho')
  }
  const handleShowPrint_action = (value, soCT, type) => {
    setDateModal(value)
    setMaHang(soCT)
    setIsShowPrint(!isShowPrint)
    setModelType('')
    setType(type)
  }
  const handleShowPrint_kho_action = (value, soCT, type) => {
    setDateModal(value)
    setMaHang(soCT)
    setIsShowPrint(!isShowPrint)
    setModelType('PhieuKho')
    setType(type)
  }
  const handleShow_hidden = () => {
    setSelectVisible(!selectVisible)
  }
  const onChange = (checkedValues) => {
    setCheckedList(checkedValues)
  }
  const onClickSubmit = () => {
    setLoadingSearch(true)
    setTimeout(() => {
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
      setLoadingSearch(false)
      setHidden(checkedList)
    }, 1000)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }
  return (
    <>
      {dataCRUD?.VIEW == false ? (
        <>
          {isShowNotify && (
            <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
              <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
                <div className="flex flex-col gap-2 p-2 justify-between ">
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <p className="text-blue-700 font-semibold uppercase">Kiểm tra quyền hạn người dùng</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-2 p-3 items-center">
                      <div>
                        <CgCloseO className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="whitespace-nowrap">Bạn không có quyền thực hiện chức năng này!</p>
                        <p className="whitespace-nowrap">
                          Vui lòng liên hệ <span className="font-bold">Người Quản Trị</span> để được cấp quyền
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <ActionButton
                        handleAction={() => {
                          setIsShowNotify(false)
                          navigate(-1)
                        }}
                        title={'Đóng'}
                        isModal={true}
                        color={'slate-50'}
                        background={'red-500'}
                        color_hover={'red-500'}
                        bg_hover={'white'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {!dataLoaded ? (
            <LoadingPage />
          ) : (
            <>
              <div className="flex justify-between relative">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black uppercase py-0.5">Phiếu Bán Hàng </h1>
                  <div>
                    <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                  </div>
                  <div className="flex">
                    {isShowSearch && (
                      <div className={`flex transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                        <Input
                          allowClear={{
                            clearIcon: <CloseSquareFilled />,
                          }}
                          placeholder="Nhập ký tự bạn cần tìm"
                          onPressEnter={handleInputChange}
                          onBlur={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div ref={optionContainerRef}>
                  <div>
                    <Tooltip title="Chức năng khác" color="blue">
                      <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)}>
                        <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                      </div>
                    </Tooltip>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-100 px-2 py-3 items-center  top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
                        <div className={`flex flex-grow flex-wrap gap-1 ${!selectVisible ? 'flex-col' : ''}`}>
                          <ActionButton
                            icon={<RiFileExcel2Fill className="w-6 h-6" />}
                            color={'slate-50'}
                            title={'Xuất excel'}
                            background={dataCRUD?.EXCEL == false ? 'gray-400' : 'green-500'}
                            bg_hover={'white'}
                            color_hover={dataCRUD?.EXCEL == false ? 'gray-500' : 'green-500'}
                            handleAction={() => (dataCRUD?.EXCEL == false ? '' : exportToExcel())}
                          />
                          <ActionButton
                            icon={<MdPrint className="w-6 h-6" />}
                            color={'slate-50'}
                            title={'In phiếu'}
                            background={'purple-500'}
                            bg_hover={'white'}
                            color_hover={'purple-500'}
                            handleAction={handleShowPrint}
                          />
                          <ActionButton
                            icon={<MdPrint className="w-6 h-6" />}
                            color={'slate-50'}
                            title={'In phiếu kho'}
                            background={'purple-500'}
                            bg_hover={'white'}
                            color_hover={'purple-500'}
                            handleAction={handleShowPrint_kho}
                          />
                          <>
                            <ActionButton
                              icon={<FaEyeSlash className="w-6 h-6" />}
                              color={'slate-50'}
                              title={'Ẩn cột'}
                              background={'red-500'}
                              bg_hover={'white'}
                              color_hover={'red-500'}
                              handleAction={handleShow_hidden}
                            />
                          </>
                        </div>
                        <div className="flex justify-center">
                          {selectVisible && (
                            <div>
                              <Checkbox.Group
                                style={{
                                  width: '650px',
                                  background: 'white',
                                  padding: 10,
                                  borderRadius: 10,
                                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                }}
                                className="flex flex-col"
                                defaultValue={checkedList}
                                onChange={onChange}
                              >
                                <Row className="flex justify-center">
                                  {options && options.length > 0 ? (
                                    options?.map((item, index) => (
                                      <Col span={6} key={(item, index)}>
                                        <Checkbox value={item} checked={true}>
                                          {nameColumnsPhieuBanHang[item]}
                                        </Checkbox>
                                      </Col>
                                    ))
                                  ) : (
                                    <Empty className="w-[100%] h-[100%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  )}
                                </Row>
                                <Spin spinning={loadingSearch}>
                                  <Button className="mt-2 w-full" onClick={onClickSubmit}>
                                    Xác Nhận
                                  </Button>
                                </Spin>
                              </Checkbox.Group>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mb-1 justify-between ">
                <div className="flex gap-1">
                  <div className="flex gap-x-2 items-center">
                    <label htmlFor="">Ngày</label>
                    <DateField
                      onBlur={handleDateChange}
                      onKeyDown={handleKeyDown}
                      className="DatePicker_PMH max-w-[115px]"
                      format="DD/MM/YYYY"
                      value={dataDate?.NgayBatDau}
                      onChange={(newDate) => {
                        setDataDate({
                          ...dataDate,
                          NgayBatDau: dayjs(newDate),
                        })
                        setDateChange(false)
                      }}
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
                    />
                  </div>
                  <div className="flex gap-x-2 items-center">
                    <label htmlFor="">Đến</label>
                    <DateField
                      onBlur={handleDateChange}
                      onKeyDown={handleKeyDown}
                      className="max-w-[115px]"
                      format="DD/MM/YYYY"
                      value={dataDate?.NgayKetThuc}
                      onChange={(newDate) => {
                        setDataDate({
                          ...dataDate,
                          NgayKetThuc: dayjs(newDate),
                        })
                        setDateChange(true)
                      }}
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
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <ActionButton
                    color={'slate-50'}
                    title={'Thêm'}
                    background={dataCRUD?.ADD == false ? 'gray-400' : 'blue-500'}
                    icon={<IoAddCircleOutline className="w-6 h-6" />}
                    bg_hover={'white'}
                    color_hover={dataCRUD?.ADD == false ? 'gray-500' : 'blue-500'}
                    handleAction={() => (dataCRUD?.ADD == false ? '' : handleCreate())}
                    isPermission={dataCRUD?.ADD}
                    isModal={true}
                  />
                </div>
              </div>
              <div id="my-table">
                <Table
                  param={data}
                  columName={nameColumnsPhieuBanHang}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  height={'setHeight'}
                  handleCreate={handleCreate}
                  handleDelete={handleDelete}
                  handleChangePhieuThu={handleChangePhieuThu}
                  loadingSearch={loadingSearch}
                  selectMH={selectMH}
                  textSearch={searchText}
                  hidden={hidden}
                />
              </div>
              {isShow ? (
                <ActionModals
                  isShow={isShow}
                  handleClose={handleClose}
                  dataRecord={dataRecord}
                  typeAction={type}
                  setMaHang={setMaHang}
                  handleShowPrint_action={handleShowPrint_action}
                  handleShowPrint_kho_action={handleShowPrint_kho_action}
                />
              ) : null}
              <Model isShow={isShowDelete} handleClose={handleClose} record={dataRecord} ActionDelete={ActionDelete} typeModel={typeModel} ActionPay={ActionPay} />
              <ModelPrint
                selectMH={selectMH}
                dateModal={dateModal}
                isShowModel={isShowPrint}
                handleCloseAction={handleCloseAction}
                handleClose={handleClose}
                modelType={modelType}
                typeAction={type}
              />
            </>
          )}
        </>
      )}
    </>
  )
}
export default PhieuBanHang
