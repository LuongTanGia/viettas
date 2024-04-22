import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import dayjs from 'dayjs'
// import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN, formatCurrency, formatPrice } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearch } from '../../components_K/myComponents/useSearch'
import { ModalTongHopPBL, PermissionView } from '../../components_K'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
// import ActionButton from '../../components/util/Button/ActionButton'
import { DateField } from '@mui/x-date-pickers'

const { Text } = Typography
const { BsSearch, TfiMoreAlt, FaEyeSlash, RiFileExcel2Fill, FaClockRotateLeft } = icons
const GoChotCa = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)
  // const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [actionType, setActionType] = useState('')
  const [dataRecord, setDataRecord] = useState(null)
  const [data, setData] = useState([])
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchGoChotCa, filteredGoChotCa, searchGoChotCa] = useSearch(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [formKhoanNgay, setFormKhoanNgay] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [prevdateValue, setPrevDateValue] = useState({})
  const [lastSearchTime, setLastSearchTime] = useState(0)

  // bỏ focus option thì hidden
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionContainerRef.current && !optionContainerRef.current.contains(event.target)) {
        // Click ngoài phần tử chứa isShowOption, ẩn isShowOption
        setIsShowOption(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isShowOption])

  // hide Columns
  useEffect(() => {
    setNewColumns(columns)
    // Lấy thông tin từ local storage sau khi đăng nhập
    const storedHiddenColumns = localStorage.getItem('hiddenColumnGoChotCa')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hiddenColumnGoChotCa')))
      setNewColumns(JSON.parse(localStorage.getItem('hiddenColumnGoChotCa')))
    }
  }, [confirmed])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'XuLy_GoDuLieuChotCa')

        if (response.data && response.data.DataError === 0) {
          setDataQuyenHan(response.data)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getChucNangQuyenHan()
        }
      } catch (error) {
        console.error('Kiểm tra token thất bại', error)
      }
    }

    getChucNangQuyenHan()
  }, [])

  useEffect(() => {
    if (dataQuyenHan?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataQuyenHan])

  // get Khoảng ngày
  useEffect(() => {
    const getKhoanNgay = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.KhoanNgay(tokenLogin)

        if (response.data && response.data.DataError === 0) {
          setFormKhoanNgay(response.data)
          setIsLoading(false)
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
          setIsLoading(false)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getKhoanNgay()
          // setIsLoading(false)
        } else {
          toast.error(response.data.DataErrorDescription)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Kiểm tra token thất bại', error)
        setIsLoading(false)
      }
    }

    getKhoanNgay()
  }, [])

  //get DSGoChotCa
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.RUN) {
      getDSGoChotCa()
    }
  }, [tableLoad, dataQuyenHan?.RUN])

  const getDSGoChotCa = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DSGoChotCa(tokenLogin, formKhoanNgay)
      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          setData(DataResults)
          setTableLoad(false)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          getDSGoChotCa()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
          setTableLoad(false)
        } else {
          toast.error(DataErrorDescription)
          setData([])
          setTableLoad(false)
        }
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(false)
    }
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      hight: 10,
      fixed: 'left',
      align: 'center',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
    },
    {
      title: 'Quầy',
      dataIndex: 'Quay',
      key: 'Quay',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.Quay - b.Quay,
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate ">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={formatCurrency(text)} search={searchGoChotCa} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchGoChotCa} />,
      width: 150,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },

    {
      title: 'Ca',
      dataIndex: 'Ca',
      key: 'Ca',
      align: 'center',
      width: 80,
      sorter: (a, b) => a.Ca.localeCompare(b.Ca),
      showSorterTooltip: false,
      render: (text) => (
        <div className="truncate ">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchGoChotCa} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className="text-start">
          <HighlightedCell text={text} search={searchGoChotCa} />
        </div>
      ),
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      showSorterTooltip: false,
    },

    {
      title: 'Tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongThanhTien - b.TongThanhTien,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Tiền CK TH.Toán',
      dataIndex: 'TongTienCKTT',
      key: 'TongTienCKTT',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTienCKTT - b.TongTienCKTT,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Tổng tiền bán',
      dataIndex: 'TongTongCong',
      key: 'TongTongCong',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTongCong - b.TongTongCong,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Tổng tiền thu',
      dataIndex: 'TongThu',
      key: 'TongThu',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongThu - b.TongThu,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Tổng tiền chi',
      dataIndex: 'TongChi',
      key: 'TongChi',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongChi - b.TongChi,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Tiền phải nộp',
      dataIndex: 'TienPhaiNop',
      key: 'TienPhaiNop',
      width: 150,
      fixed: 'right',
      align: 'center',
      sorter: (a, b) => a.TienPhaiNop - b.TienPhaiNop,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchGoChotCa} />
        </div>
      ),
    },
    {
      title: 'Chức năng',
      key: 'ChucNang',
      fixed: 'right',
      width: 90,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center">
              <Tooltip title="Gỡ dữ liệu" color="blue">
                <div
                  onClick={() => handleDelete(record)}
                  className="p-[3px] border-2 rounded-md text-slate-50  border-bg-main bg-bg-main hover:bg-white hover:text-bg-main cursor-pointer "
                >
                  <FaClockRotateLeft size={16} />
                </div>
              </Tooltip>
            </div>
          </>
        )
      },
    },
  ]

  const options = columns.slice(0, -1).map(({ key, title }) => ({
    label: title,
    value: key,
  }))

  const newColumnsHide = columns.filter((item) => {
    if (newColumns && newColumns.length > 0) {
      return !newColumns.includes(item.dataIndex)
    } else {
      return true
    }
  })

  const handleHideColumns = () => {
    setNewColumns(checkedList)
    setConfirmed(true)
  }

  const handleDelete = (record) => {
    setActionType('delete')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleFilterDS = () => {
    const currentTime = new Date().getTime()
    if (currentTime - lastSearchTime >= 1000 && formKhoanNgay !== prevdateValue) {
      setTableLoad(true)
      setLastSearchTime(currentTime)
    }
  }

  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formKhoanNgay.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
      })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formKhoanNgay.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DD')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, cập nhật ngày bắt đầu
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayKetThuc: endDate,
      })
    }
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchGoChotCa(newSearch)
    }
  }

  return (
    <>
      {dataQuyenHan?.RUN === false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          {isLoading ? (
            <SimpleBackdrop />
          ) : (
            <div className="w-auto">
              <div className="relative text-lg flex justify-between items-center mb-1">
                <div className="flex items-center gap-x-4 font-bold">
                  <h1 className="text-xl uppercase">Gỡ dữ liệu bán lẻ tổng hợp từ các quầy</h1>
                  <div>
                    <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                  </div>
                </div>
                <div className="flex  ">
                  {isShowSearch && (
                    <div
                      className={`flex absolute left-[31rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'md:w-[12rem] lg:w-[20rem]' : 'w-0'} overflow-hidden`}
                    >
                      <Input
                        allowClear={{
                          clearIcon: <CloseSquareFilled />,
                        }}
                        placeholder="Nhập ký tự bạn cần tìm"
                        onPressEnter={(e) => {
                          setPrevSearchValue(e.target.value)
                          handleSearch(e.target.value)
                        }}
                        onBlur={(e) => handleSearch(e.target.value)}
                        onFocus={(e) => setPrevSearchValue(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div ref={optionContainerRef}>
                  <Tooltip title="Chức năng khác" color="blue">
                    <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5" onClick={() => setIsShowOption(!isShowOption)}>
                      <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                    </div>
                  </Tooltip>
                  {isShowOption && (
                    <div className=" absolute flex flex-col gap-2 bg-slate-100 px-3 py-2 items-center top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
                      <div className={`flex flex-grow flex-wrap gap-1 ${!hideColumns ? 'flex-col' : ''}`}>
                        <button
                          onClick={dataQuyenHan?.EXCEL ? exportToExcel : ''}
                          className={`flex items-center py-1 px-2 rounded-md text-slate-50 text-base border-2 ${
                            dataQuyenHan?.EXCEL ? 'border-green-500  bg-green-500 hover:bg-white hover:text-green-500' : 'bg-gray-400 cursor-not-allowed'
                          } `}
                        >
                          <div className="pr-1">
                            <RiFileExcel2Fill size={20} />
                          </div>
                          <div>Xuất excel</div>
                        </button>

                        <button
                          onClick={() => setHideColumns(!hideColumns)}
                          className="flex items-center py-1 px-2 rounded-md border-2 border-red-500  text-slate-50 text-base bg-red-500 hover:bg-white hover:text-red-500 "
                        >
                          <div className="pr-1">
                            <FaEyeSlash size={20} />
                          </div>
                          <div>Ẩn cột</div>
                        </button>
                      </div>
                      <div className="flex justify-center">
                        {hideColumns && (
                          <div>
                            <Checkbox.Group
                              style={{
                                width: '340px',
                                background: 'white',
                                padding: 10,
                                borderRadius: 10,
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                              }}
                              className="flex flex-col"
                              defaultValue={checkedList}
                              onChange={(value) => {
                                setCheckedList(value)
                                localStorage.setItem('hiddenColumnGoChotCa', JSON.stringify(value))
                              }}
                            >
                              <Row className="flex justify-center">
                                {options.map((item) => (
                                  <Col span={10} key={item.value}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                  </Col>
                                ))}
                              </Row>

                              <button onClick={handleHideColumns} className="mt-2 w-full border-[1px] border-gray-400 px-1 py-1 rounded-md hover:text-bg-main hover:border-bg-main">
                                Xác Nhận
                              </button>
                            </Checkbox.Group>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex  items-center px-3 ">
                <div className="flex gap-3">
                  {/* DatePicker */}
                  <div className="flex gap-x-2 items-center">
                    <label htmlFor="">Ngày</label>
                    <DateField
                      className="DatePicker_PMH max-w-[115px]"
                      format="DD/MM/YYYY"
                      value={dayjs(formKhoanNgay.NgayBatDau)}
                      // maxDate={dayjs(formKhoanNgay.NgayKetThuc)}
                      onChange={(newDate) => {
                        setFormKhoanNgay({
                          ...formKhoanNgay,
                          NgayBatDau: dayjs(newDate).format('YYYY-MM-DD'),
                        })
                      }}
                      onBlur={() => {
                        handleStartDateChange(formKhoanNgay.NgayBatDau)
                        handleFilterDS()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleStartDateChange(formKhoanNgay.NgayBatDau)

                          setPrevDateValue(formKhoanNgay)
                          handleFilterDS()
                        }
                      }}
                      onFocus={() => setPrevDateValue(formKhoanNgay)}
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
                  <div className="flex  gap-x-2 items-center">
                    <label htmlFor="">Đến</label>
                    <DateField
                      className="DatePicker_PMH max-w-[115px]"
                      format="DD/MM/YYYY"
                      // minDate={dayjs(formKhoanNgay.NgayBatDau)}
                      value={dayjs(formKhoanNgay.NgayKetThuc)}
                      onChange={(newDate) => {
                        setFormKhoanNgay({
                          ...formKhoanNgay,
                          NgayKetThuc: dayjs(newDate).format('YYYY-MM-DD'),
                        })
                      }}
                      onBlur={() => {
                        handleEndDateChange(formKhoanNgay.NgayKetThuc)
                        handleFilterDS()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEndDateChange(formKhoanNgay.NgayKetThuc)
                          setPrevDateValue(formKhoanNgay)
                          handleFilterDS()
                        }
                      }}
                      onFocus={() => setPrevDateValue(formKhoanNgay)}
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
              </div>

              <div id="my-table" className="relative px-2 py-1 ">
                <Table
                  loading={tableLoad}
                  className="setHeight"
                  columns={newColumnsHide}
                  dataSource={filteredGoChotCa}
                  size="small"
                  scroll={{
                    x: 1500,
                    y: 410,
                  }}
                  bordered
                  pagination={{
                    defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                    showSizeChanger: true,
                    pageSizeOptions: ['50', '100', '1000'],
                    onShowSizeChange: (current, size) => {
                      localStorage.setItem('pageSize', size)
                    },
                  }}
                  // Bảng Tổng
                  summary={() => {
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row>
                          {newColumnsHide
                            .filter((column) => column.render)
                            .map((column, index) => {
                              const isNumericColumn = typeof filteredGoChotCa[0]?.[column.dataIndex] === 'number'
                              const total = Number(filteredGoChotCa?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0))

                              return (
                                <Table.Summary.Cell
                                  index={index}
                                  key={`summary-cell-${index + 1}`}
                                  align={isNumericColumn ? 'right' : 'left'}
                                  className="text-end font-bold  bg-[#f1f1f1]"
                                >
                                  {column.dataIndex === 'TyLeCKTT' ? (
                                    <Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : ''}>
                                      {Number(filteredGoChotCa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo?.SOLETYLE,
                                        maximumFractionDigits: dataThongSo?.SOLETYLE,
                                      })}
                                    </Text>
                                  ) : column.dataIndex === 'TongTienHang' ||
                                    column.dataIndex === 'TongTienThue' ||
                                    column.dataIndex === 'TongThanhTien' ||
                                    column.dataIndex === 'TongTienCKTT' ||
                                    column.dataIndex === 'TongTongCong' ||
                                    column.dataIndex === 'TongThu' ||
                                    column.dataIndex === 'TienPhaiNop' ||
                                    column.dataIndex === 'TongChi' ? (
                                    <Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : ''}>
                                      {Number(filteredGoChotCa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                        maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                      })}
                                    </Text>
                                  ) : column.dataIndex === 'STT' ? (
                                    <Text className="text-center flex justify-center" strong>
                                      {data.length}
                                    </Text>
                                  ) : null}
                                </Table.Summary.Cell>
                              )
                            })}
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }}
                ></Table>
              </div>

              {isShowModal && (
                <ModalTongHopPBL
                  namePage={'Tổng hợp dữ liệu bán lẻ từ các quầy'}
                  typePage={'GoChotCa'}
                  close={() => setIsShowModal(false)}
                  actionType={actionType}
                  dataRecord={dataRecord}
                  dataThongSo={dataThongSo}
                  loading={() => setTableLoad(true)}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default GoChotCa
