import Table from '../util/Table/Table'
import LoadingPage from '../util/Loading/LoadingPage'
import { MdPrint } from 'react-icons/md'
import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG, XOAPHIEUBANHANG, LAPPHIEUTHU, KHOANNGAY, exportToExcel } from '../../action/Actions'
import API from '../../API/API'
import { toast } from 'react-toastify'
import ModelPrint from './PrintModel'
import ActionButton from '../util/Button/ActionButton'
import Model from './Model'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'
import { BsSearch } from 'react-icons/bs'
import dayjs from 'dayjs'
import { Checkbox, Col, Empty, Input, Row, Tooltip } from 'antd'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { Button, Spin } from 'antd'
import { IoAddCircleOutline } from 'react-icons/io5'
import { FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
function PhieuBanHang() {
  const optionContainerRef = useRef(null)

  const dispatch = useDispatch()
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [modelType, setModelType] = useState('')
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [data, setData] = useState()
  const [isShow, setIsShow] = useState(false)
  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isShowDelete, setIsShowDelete] = useState(false)
  const [typeModel, setTypeModel] = useState('')
  const [type, setType] = useState()
  const [dataRecord, setDataRecord] = useState([])
  const [selectMH, setSelectMH] = useState()
  const [isShowOption, setIsShowOption] = useState(false)
  const [dataDate, setDataDate] = useState({})
  const [soChungTuPrint, setSoChungTuPrint] = useState()
  const [hiden, setHiden] = useState([])
  const [checkedList, setcheckedList] = useState([])
  const [searchData, setSearchData] = useState([])

  // const [searchTimeout, setSearchTimeout] = useState(null)

  const isMatch = (value, searchText) => {
    const stringValue = String(value).toLowerCase()
    const searchTextLower = searchText.toLowerCase()

    // Check if the string includes the searchText
    if (stringValue.includes(searchTextLower)) {
      return true
    }
    // Check if it's a valid date and matches (formatted or not)
    const isDateTime = dayjs(stringValue).isValid()
    if (isDateTime) {
      const formattedValue = dayjs(stringValue).format('DD/MM/YYYY').toString()
      const formattedSearchText = searchTextLower
      if (formattedValue.includes(formattedSearchText)) {
        return true
      }
    }
    return false
  }
  useEffect(() => {
    setHiden(JSON.parse(localStorage.getItem('hiddenColumns')))
    setcheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))

    const key = Object.keys(data ? data[0] : [] || []).filter((key) => key !== 'MaSoThue')
    setOptions(key)
  }, [selectVisible])
  useEffect(() => {
    const getDate = async () => {
      const date = await KHOANNGAY(API.KHOANNGAY, token)
      setDataDate(date)
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
      setSearchData({
        ...dataDate,
        searchText: searchText.trim(),
      })
    }, 300)
  }

  useEffect(() => {
    // setDataDate(dateHT)
    const getListData = async () => {
      setLoadingSearch(true)
      // const searchData = {
      //   ...dataDate,
      //   searchText: searchText.trim(),
      // }

      const filteredDataRes = await DANHSACHPHIEUBANHANG(API.DANHSACHPBS, token, searchData, dispatch)
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
    console.log()
    getListData()
  }, [searchText, selectMH, searchData.NgayBatDau, searchData.NgayKetThuc])

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

  const handleView = async (record) => {
    await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch)
    setIsShow(true)
    setType('view')
    setDataRecord(record)
  }

  const handleEdit = async (record) => {
    await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch)

    setIsShow(true)
    setType('edit')
    setDataRecord(record)
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
    setDataDate({})
    setDataRecord([])
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
    } else {
      toast.info(`${record?.SoChungTu} đã lập phiếu thu tiền!`)
    }
  }

  const ActionPay = async (record) => {
    await LAPPHIEUTHU(API.LAPPHIEUTHU, token, { SoChungTu: record?.SoChungTu }, dispatch)
    setIsShowDelete(false)
    setIsShow(false)
    setDataRecord([])
  }

  if (!dataLoaded) {
    return <LoadingPage />
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

  const handleShowPrint_action = (value, soCT) => {
    setSoChungTuPrint(soCT)
    setDataDate({ ...dataDate, NgayBatDau: value, NgayKetThuc: value })
    setIsShowPrint(!isShowPrint)
    setModelType('')
  }

  const handleShowPrint_kho_action = (value, soCT) => {
    setSoChungTuPrint(soCT)
    setDataDate({ ...dataDate, NgayBatDau: value, NgayKetThuc: value })
    setIsShowPrint(!isShowPrint)
    setModelType('PhieuKho')
  }

  // const handleSearch = async () => {
  //   setLoadingSearch(true)
  //   const searchData = {
  //     ...dataDate,
  //     searchText: searchText.trim(),
  //   }

  //   const filteredDataRes = await DANHSACHPHIEUBANHANG(API.DANHSACHPBS, token, searchData, dispatch)
  //   if (filteredDataRes === -1) {
  //     setData([])
  //   } else {
  //     const newData = filteredDataRes.filter((record) => {
  //       return Object.keys(record).some((key) => {
  //         const stringValue = String(record[key]).toString().toLowerCase()
  //         const searchTextLower = searchText.toString().toLowerCase()
  //         const isDate = dayjs(searchTextLower, { strict: true }).isValid()
  //         const isDateTime = dayjs(stringValue).isValid()

  //         if (isDate && isDateTime) {
  //           const formattedValue = dayjs(stringValue).format('YYYY-MM-DDTHH:mm:ss')
  //           const formattedSearchText = dayjs(searchTextLower, { strict: true }).format('YYYY-MM-DDTHH:mm:ss')

  //           if (formattedValue.startsWith(formattedSearchText)) {
  //             return true
  //           }
  //         } else if (!isDate && stringValue.includes(searchTextLower)) {
  //           return true
  //         }

  //         return false
  //       })
  //     })

  //     setData(newData)
  //   }

  //   setDataLoaded(true)
  //   setLoadingSearch(false)
  // }
  // const [debouncedSearchText] = useDebounce(searchText, 2000); // 2000 milliseconds (2 seconds)

  // useEffect will run after 2 seconds of user inactivity

  const handleShow_hiden = () => {
    setSelectVisible(!selectVisible)
  }
  const onChange = (checkedValues) => {
    setcheckedList(checkedValues)
  }
  const onClickSubmit = () => {
    // setcheckedList(checkedValues)
    setLoadingSearch(true)
    setTimeout(() => {
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
      setLoadingSearch(false)
      setHiden(checkedList)
    }, 1000)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }

  return (
    <>
      <div className="flex justify-between mb-2 relative">
        <div className=" flex items-center gap-x-4 ">
          <h1 className="text-xl font-black uppercase">Phiếu Bán Hàng </h1>
          <div>
            <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
          </div>
          <div className="flex  ">
            {isShowSearch && (
              <div className={`flex absolute left-[14rem] top-0 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
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
                    title={'Xuất Excel'}
                    background={'green-500'}
                    bg_hover={'white'}
                    color_hover={'green-500'}
                    handleAction={exportToExcel}
                  />
                  <ActionButton
                    icon={<MdPrint className="w-6 h-6" />}
                    color={'slate-50'}
                    title={'In Phiếu'}
                    background={'purple-500'}
                    bg_hover={'white'}
                    color_hover={'purple-500'}
                    handleAction={handleShowPrint}
                  />
                  <ActionButton
                    icon={<MdPrint className="w-6 h-6" />}
                    color={'slate-50'}
                    title={'In Phiếu Kho'}
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
                      handleAction={handleShow_hiden}
                    />
                  </>
                </div>
                <div className="flex justify-center">
                  {selectVisible && (
                    <div>
                      <Checkbox.Group
                        style={{
                          width: '600px',
                          background: 'white',
                          padding: 10,
                          borderRadius: 10,
                          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}
                        className="flex flex-col"
                        defaultValue={checkedList}
                        onChange={onChange}
                      >
                        <Row>
                          {options && options.length > 0 ? (
                            options?.map((item, index) => (
                              <Col span={6} key={(item, index)}>
                                <Checkbox value={item} checked={true}>
                                  {nameColumsPhieuBanHang[item]}
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
        <div className="flex gap-3 ">
          <div className="flex gap-x-2 items-center max-w-[200px]">
            <label htmlFor="">Ngày</label>
            <DateField
              onBlur={handleDateChange}
              onKeyDown={handleKeyDown}
              className="DatePicker_PMH min-w-[100px] w-[60%]"
              format="DD/MM/YYYY"
              defaultValue={dayjs(dataDate?.NgayBatDau)}
              maxDate={dayjs(dataDate.NgayKetThuc)}
              onChange={(newDate) => {
                setDataDate({
                  ...dataDate,
                  NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                })
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
          <div className="flex gap-x-2 items-center max-w-[200px]">
            <label htmlFor="">Đến</label>
            <DateField
              onBlur={handleDateChange}
              onKeyDown={handleKeyDown}
              className="DatePicker_PMH min-w-[100px] w-[60%]"
              format="DD/MM/YYYY"
              defaultValue={dayjs(dataDate?.NgayKetThuc)}
              onChange={(newDate) => {
                setDataDate({
                  ...dataDate,
                  NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                })
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

        <div className="flex justify-end gap-2    ">
          <ActionButton
            color={'slate-50'}
            title={'Thêm Phiếu'}
            background={'blue-500'}
            icon={<IoAddCircleOutline size={20} />}
            bg_hover={'white'}
            color_hover={'blue-500'}
            handleAction={handleCreate}
          />
        </div>
      </div>

      <div id="my-table">
        <Table
          param={data}
          columName={nameColumsPhieuBanHang}
          handleView={handleView}
          handleEdit={handleEdit}
          height={'setHeight'}
          handleCreate={handleCreate}
          handleDelete={handleDelete}
          handleChangePhieuThu={handleChangePhieuThu}
          loadingSearch={loadingSearch}
          selectMH={selectMH}
          textSearch={searchText}
          hiden={hiden}
        />
      </div>
      <ActionModals
        isShow={isShow}
        handleClose={handleClose}
        dataRecord={dataRecord}
        typeAction={type}
        setMaHang={setMaHang}
        handleShowPrint_action={handleShowPrint_action}
        handleShowPrint_kho_action={handleShowPrint_kho_action}
      />
      <Model isShow={isShowDelete} handleClose={handleClose} record={dataRecord} ActionDelete={ActionDelete} typeModel={typeModel} ActionPay={ActionPay} />
      <ModelPrint selectMH={selectMH} soChungTuPrint={soChungTuPrint} isShowModel={isShowPrint} handleCloseAction={handleCloseAction} data={dataDate} modelType={modelType} />
    </>
  )
}

export default PhieuBanHang
