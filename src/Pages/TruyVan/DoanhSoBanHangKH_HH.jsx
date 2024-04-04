/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { Select, Tooltip, Typography, Checkbox, Row, Button, Col, Spin, Input, Empty, Table } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import { TbEye } from 'react-icons/tb'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { CloseSquareFilled } from '@ant-design/icons'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, exportToExcel } from '../../action/Actions'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsDSBHHH } from '../../components/util/Table/ColumnName'
import { DateField } from '@mui/x-date-pickers'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { PermissionView } from '../../components_K'
const DoanhSoBanHangKH_HH = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataDSBH, setDataDSBH] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataDSBH)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const showOption = useRef(null)
  const [nhomHang, setNhomHang] = useState([])
  const [nhomDoiTuong, seNhomDoiTuong] = useState([])
  const [khoanNgayFrom, setKhoanNgayFrom] = useState([])
  const [khoanNgayTo, setKhoanNgayTo] = useState([])
  const [selectedHHFrom, setSelectedHHFrom] = useState(null)
  const [selectedHHTo, setSelectedHHTo] = useState(null)
  const [selectedHHList, setSelectedHHList] = useState([])
  const [selectedDTFrom, setSelectedDTFrom] = useState(null)
  const [selectedDTTo, setSelectedDTTo] = useState(null)
  const [selectedDTList, setSelectedDTList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [tableLoad, setTableLoad] = useState(true)
  const [dataCRUD, setDataCRUD] = useState()
  const [dateData, setDateData] = useState({})
  const [dateChange, setDateChange] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOption.current && !showOption.current.contains(event.target)) {
        setIsShowOption(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (dataCRUD?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataCRUD])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('TruyVan_DoanhSoBanHangKHHH', TokenAccess)
        if (response.data.DataError === 0) {
          setDataCRUD(response.data)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataQuyenHan()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }

    getDataQuyenHan()
  }, [])

  useEffect(() => {
    const getListNhomHang = async () => {
      try {
        const response = await categoryAPI.ListNhomHang_DSBH(TokenAccess)
        if (response.data.DataError == 0) {
          setNhomHang(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListNhomHang()
        } else {
          setNhomHang([])
          setIsLoading(true)
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListNhomHang()
    }
  }, [isLoading])

  useEffect(() => {
    const ListNhomDoiTuong = async () => {
      try {
        const response = await categoryAPI.ListNhomDoiTuong_DSBH(TokenAccess)
        if (response.data.DataError == 0) {
          seNhomDoiTuong(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          ListNhomDoiTuong()
        } else {
          seNhomDoiTuong([])
          console.log(response.data)
          setIsLoading(true)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      ListNhomDoiTuong()
    }
  }, [isLoading])

  useEffect(() => {
    setKhoanNgayFrom(dayjs(dateData?.NgayBatDau))
    setKhoanNgayTo(dayjs(dateData?.NgayKetThuc))
  }, [dateData?.NgayBatDau, dateData?.NgayKetThuc])

  useEffect(() => {
    const getTimeSetting = async () => {
      try {
        const response = await categoryAPI.KhoanNgay(TokenAccess)
        if (response.data.DataError == 0) {
          setDateData(response.data)
          setKhoanNgayFrom(dayjs(response.data.NgayBatDau))
          setKhoanNgayTo(dayjs(response.data.NgayKetThuc))
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getTimeSetting()
        } else {
          console.log(response.data)
          setIsLoading(true)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getTimeSetting()
    }
  }, [isLoading])

  useEffect(() => {
    const getdataDSBHFirst = async () => {
      try {
        if (isLoading == true) {
          setTableLoad(true)
          const response = await categoryAPI.InfoDSBHKhachHang_HangHoa(
            dateData == {}
              ? {}
              : {
                  NgayBatDau: dateData.NgayBatDau,
                  NgayKetThuc: dateData.NgayKetThuc,
                },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            setDataDSBH(response.data.DataResults)
            setIsLoading(true)
            setTableLoad(false)
          } else if ((response.data && response.data.DataError == -107) || (response.data && response.data.DataError == -108)) {
            await RETOKEN()
            getdataDSBHFirst()
          } else {
            setDataDSBH([])
            console.log(response.data)
            setTableLoad(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getdataDSBHFirst()
  }, [searchHangHoa, isLoading])

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataDSBH[0] || []).filter((key) => key != 'ThongTinHangHoa' && key != 'DiaChiDoiTuong')
    setOptions(key)
  }, [selectVisible])

  const getDataDSBH = async () => {
    try {
      const response = await categoryAPI.InfoDSBHKhachHang_HangHoa(
        {
          NgayBatDau: dateData.NgayBatDau,
          NgayKetThuc: dateData.NgayKetThuc,
          CodeValue1From: selectedHHFrom,
          CodeValue1To: selectedHHTo,
          CodeValue1List: selectedHHList.join(', '),
          CodeValue2From: selectedDTFrom,
          CodeValue2To: selectedDTTo,
          CodeValue2List: selectedDTList.join(', '),
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        setDataDSBH(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataDSBH()
      } else if (response.data.DataError == -104) {
        setDataDSBH([])
        setTableLoad(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleFilterDS = () => {
    setTableLoad(true)
    if (!tableLoad) {
      getDataDSBH()
    }
  }

  const handleDateChange = () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (
        !dateChange &&
        khoanNgayFrom &&
        khoanNgayTo &&
        typeof khoanNgayFrom.isAfter === 'function' &&
        typeof khoanNgayTo.isAfter === 'function' &&
        khoanNgayFrom.isAfter(khoanNgayTo)
      ) {
        setDateData({
          NgayBatDau: dayjs(khoanNgayFrom).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(khoanNgayFrom).format('YYYY-MM-DD'),
        })

        return
      } else if (dateChange && khoanNgayFrom && khoanNgayTo && khoanNgayFrom.isAfter(khoanNgayTo)) {
        setDateData({
          NgayBatDau: dayjs(khoanNgayTo).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(khoanNgayTo).format('YYYY-MM-DD'),
        })
      } else {
        setDateData({
          NgayBatDau: dayjs(khoanNgayFrom).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(khoanNgayTo).format('YYYY-MM-DD'),
        })
      }
    }, 300)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  let timerId
  const handleSearch = (event) => {
    clearTimeout()
    timerId = setTimeout(() => {
      setSearchHangHoa(event.target.value)
    }, 300)
  }
  const handleHidden = () => {
    setSelectVisible(!selectVisible)
  }
  const onChange = (checkedValues) => {
    setCheckedList(checkedValues)
  }
  const onClickSubmit = () => {
    setTableLoad(true)
    setTimeout(() => {
      setHiddenRow(checkedList)
      setTableLoad(false)
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
    }, 1000)
  }

  const titles = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      fixed: 'left',
      key: 'STT',
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã Kh.hàng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.TenDoiTuong.localeCompare(b.TenDoiTuong),
      showSorterTooltip: false,
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div className="flex justify-start">
            <div className="truncate">
              <HighlightedCell text={text} search={searchHangHoa} />
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div className="flex justify-start">
            <div className="truncate">
              <HighlightedCell text={text} search={searchHangHoa} />
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tiền hàng',
      dataIndex: 'TienHang',
      key: 'TienHang',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TienHang - b.TienHang,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TienThue',
      key: 'TienThue',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TienThue - b.TienThue,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tiền chiết khấu',
      dataIndex: 'TienCKTT',
      key: 'TienCKTT',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TienCKTT - b.TienCKTT,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tiền mặt',
      dataIndex: 'TongCong_TM',
      key: 'TongCong_TM',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongCong_TM - b.TongCong_TM,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Công nợ',
      dataIndex: 'TongCong_CN',
      key: 'TongCong_CN',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongCong_CN - b.TongCong_CN,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.ThanhTien - b.ThanhTien,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
  ]

  const newTitles = titles.filter((item) => !hiddenRow?.includes(item.dataIndex))
  return (
    <>
      {dataCRUD?.VIEW == false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center ">
                    <div className="flex items-center gap-2 py-1">
                      <h1 className="text-lg font-bold text-black-600 uppercase">Doanh số bán hàng (Kh.Hàng, H.hóa)</h1>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
                    <div className="flex ">
                      {isShowSearch && (
                        <div className={`flex transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                          <Input
                            allowClear={{
                              clearIcon: <CloseSquareFilled />,
                            }}
                            placeholder="Nhập ký tự bạn cần tìm"
                            onBlur={handleSearch}
                            onPressEnter={handleSearch}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div ref={showOption}>
                    <Tooltip title="Chức năng khác" color="blue">
                      <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)}>
                        <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                      </div>
                    </Tooltip>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-200 px-3 py-2 items-center top-16 right-[4.5%] rounded-lg z-10 duration-500 shadow-custom  ">
                        <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                          <ActionButton
                            handleAction={() => (dataCRUD?.EXCEL == false ? '' : exportToExcel())}
                            title={'Xuất Excel'}
                            isPermission={dataCRUD?.EXCEL}
                            icon={<RiFileExcel2Fill className="w-5 h-5" />}
                            color={'slate-50'}
                            background={dataCRUD?.EXCEL == false ? 'gray-400' : 'green-500'}
                            color_hover={dataCRUD?.EXCEL == false ? 'gray-500' : 'green-500'}
                            bg_hover={'white'}
                          />
                          <ActionButton
                            handleAction={handleHidden}
                            title={'Ẩn Cột'}
                            icon={<FaEyeSlash className="w-5 h-5" />}
                            color={'slate-50'}
                            background={'red-500'}
                            color_hover={'red-500'}
                            bg_hover={'white'}
                          />
                        </div>
                        <div>
                          {selectVisible && (
                            <div>
                              <Checkbox.Group
                                style={{
                                  width: '320px',
                                  background: 'white',
                                  padding: 10,
                                  borderRadius: 10,
                                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                  whiteSpace: 'nowrap',
                                }}
                                className="flex flex-col"
                                defaultValue={checkedList}
                                onChange={onChange}
                              >
                                <Row>
                                  {options && options.length > 0 ? (
                                    options?.map((item, index) => (
                                      <Col span={10} key={(item, index)}>
                                        <Checkbox value={item} checked={true}>
                                          {nameColumsDSBHHH[item]}
                                        </Checkbox>
                                      </Col>
                                    ))
                                  ) : (
                                    <Empty className="w-[100%] h-[100%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  )}
                                </Row>
                                <Spin spinning={tableLoad}>
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
                <div className="flex justify-between gap-2 w-[95vw]">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex gap-1">
                        <div className="flex items-center gap-1">
                          <label>Từ</label>
                          <DateField
                            className="DatePicker_NXTKho  max-w-[120px]"
                            onBlur={handleDateChange}
                            onKeyDown={handleKeyDown}
                            format="DD/MM/YYYY"
                            value={khoanNgayFrom}
                            onChange={(values) => {
                              setKhoanNgayFrom(values)
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
                        <div className=" flex items-center gap-1 ">
                          <label>Đến</label>
                          <DateField
                            className="DatePicker_NXTKho max-w-[120px]"
                            onBlur={handleDateChange}
                            onKeyDown={handleKeyDown}
                            format="DD/MM/YYYY"
                            value={khoanNgayTo}
                            onChange={(values) => {
                              setKhoanNgayTo(values)
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
                      <Tooltip title="Xem dữ liệu" color="blue">
                        <div>
                          <ActionButton
                            handleAction={handleFilterDS}
                            icon={<TbEye className="w-5 h-5" />}
                            color={'slate-50'}
                            background={'blue-500'}
                            color_hover={'blue-500'}
                            bg_hover={'white'}
                            isModal={true}
                          />
                        </div>
                      </Tooltip>
                    </div>
                    <div className=" flex flex-col gap-2">
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <div>Từ</div>
                          <Select
                            allowClear
                            showSearch
                            size="small"
                            placeholder="Nhóm hàng"
                            value={selectedHHFrom}
                            onChange={(value) => {
                              setSelectedHHFrom(value)
                              selectedHHTo == null ? setSelectedHHTo(value) : ''
                              if (selectedHHTo !== null && nhomHang.findIndex((item) => item.Ma === value) > nhomHang.findIndex((item) => item.Ma === selectedHHTo)) {
                                setSelectedHHTo(value)
                              }
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {nhomHang?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                  <p className="truncate">{item.Ma}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                        <div className="flex gap-1 items-center">
                          <div>Đến</div>
                          <Select
                            allowClear
                            showSearch
                            size="small"
                            placeholder="Nhóm hàng"
                            value={selectedHHTo}
                            onChange={(value) => {
                              setSelectedHHTo(value)
                              if (selectedHHFrom !== null && nhomHang.findIndex((item) => item.Ma === value) < nhomHang.findIndex((item) => item.Ma === selectedHHFrom)) {
                                setSelectedHHFrom(value)
                              }
                              selectedHHFrom == null ? setSelectedHHFrom(value) : ''
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {nhomHang?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                  <p className="truncate">{item.Ma}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                        <div className="flex gap-1 items-center">
                          <div>Chọn</div>
                          <Select
                            mode="multiple"
                            allowClear
                            filterOption
                            size="small"
                            placeholder="Nhóm hàng"
                            value={selectedHHList}
                            onChange={(value) => setSelectedHHList(value)}
                            className="md:w-[30vw] lg:w-[40vw] xl:w-[50vw]"
                            maxTagCount="responsive"
                            optionFilterProp="children"
                            maxTagPlaceholder={(omittedValues) => (
                              <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                                <span>+{omittedValues?.length}...</span>
                              </Tooltip>
                            )}
                          >
                            {nhomHang?.map((item) => {
                              return (
                                <Select.Option key={item.Ma} value={item.Ma} title={item.ThongTinNhomHang}>
                                  <p className="truncate">{item.ThongTinNhomHang}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <div>Từ</div>
                          <Select
                            allowClear
                            showSearch
                            placeholder="Mã đối tượng"
                            size="small"
                            value={selectedDTFrom}
                            onChange={(value) => {
                              setSelectedDTFrom(value)
                              selectedDTTo == null ? setSelectedDTTo(value) : ''
                              if (selectedDTTo !== null && nhomDoiTuong.findIndex((item) => item.Ma === value) > nhomDoiTuong.findIndex((item) => item.Ma === selectedDTTo)) {
                                setSelectedDTTo(value)
                              }
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {nhomDoiTuong?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomDoiTuong}>
                                  <p className="truncate">{item.Ma}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                        <div className="flex gap-1 items-center">
                          <div>Đến</div>
                          <Select
                            allowClear
                            showSearch
                            size="small"
                            placeholder="Mã đối tượng"
                            value={selectedDTTo}
                            onChange={(value) => {
                              setSelectedDTTo(value)
                              selectedDTFrom == null ? setSelectedDTFrom(value) : ''
                              if (selectedDTFrom !== null && nhomDoiTuong.findIndex((item) => item.Ma === value) < nhomDoiTuong.findIndex((item) => item.Ma === selectedDTFrom)) {
                                setSelectedDTFrom(value)
                              }
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {nhomDoiTuong?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomDoiTuong}>
                                  <p className="truncate">{item.Ma}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <div>Chọn</div>
                          <Select
                            mode="multiple"
                            allowClear
                            size="small"
                            filterOption
                            value={selectedDTList}
                            onChange={(value) => setSelectedDTList(value)}
                            placeholder="Mã đối tượng"
                            className="md:w-[30vw] lg:w-[40vw] xl:w-[50vw]"
                            maxTagCount="responsive"
                            optionFilterProp="children"
                            maxTagPlaceholder={(omittedValues) => (
                              <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                                <span>+{omittedValues?.length}...</span>
                              </Tooltip>
                            )}
                          >
                            {nhomDoiTuong?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma}>
                                  <p className="truncate">{item.ThongTinNhomDoiTuong}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="DSBH_KH_HH" id="my-table">
                <Table
                  loading={tableLoad}
                  className="setHeight"
                  columns={newTitles}
                  dataSource={filteredHangHoa.map((item, index) => ({ ...item, key: index }))}
                  size="small"
                  scroll={{
                    x: 'max-content',
                    y: 300,
                  }}
                  pagination={{
                    defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                    showSizeChanger: true,
                    pageSizeOptions: ['50', '100', '1000'],
                    onShowSizeChange: (current, size) => {
                      localStorage.setItem('pageSize', size)
                    },
                  }}
                  scrollToFirstRowOnChange
                  bordered
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '24px',
                    borderRadius: '10px',
                  }}
                  summary={() => {
                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          {newTitles
                            .filter((column) => column.render)
                            .map((column, index) => {
                              const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] == 'number' && column.dataIndex !== 'SoLuong'
                              return (
                                <Table.Summary.Cell
                                  index={index}
                                  key={`summary-cell-${index + 1}`}
                                  align={isNumericColumn ? 'right' : 'left'}
                                  className="text-end font-bold  bg-[#f1f1f1]"
                                >
                                  {isNumericColumn ? (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLESOTIEN,
                                        maximumFractionDigits: dataThongSo.SOLESOTIEN,
                                      })}
                                    </Text>
                                  ) : column.dataIndex == 'STT' ? (
                                    <Text className="text-center flex justify-center" strong>
                                      {dataDSBH?.length}
                                    </Text>
                                  ) : null}
                                </Table.Summary.Cell>
                              )
                            })}
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DoanhSoBanHangKH_HH
