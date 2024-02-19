/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import { CgCloseO } from 'react-icons/cg'
import { TfiMoreAlt } from 'react-icons/tfi'
import { DateField } from '@mui/x-date-pickers'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { CloseSquareFilled } from '@ant-design/icons'
import { MdEdit, MdDelete, MdPrint } from 'react-icons/md'
import categoryAPI from '../../../../API/linkAPI'
import { useSearch } from '../../../../components/hooks/Search'
import { RETOKEN, exportToExcel } from '../../../../action/Actions'
import ActionButton from '../../../../components/util/Button/ActionButton'
import HighlightedCell from '../../../../components/hooks/HighlightedCell'
import SimpleBackdrop from '../../../../components/util/Loading/LoadingPage'
import { nameColumsPhieuXuatDieuChinh } from '../../../../components/util/Table/ColumnName'
import XDCCreate from '../../../../components/Modals/DuLieu/DuLieuTrongKho/PhieuXDC/XDCCreate'
import XDCView from '../../../../components/Modals/DuLieu/DuLieuTrongKho/PhieuXDC/XDCView'
import XDCEdit from '../../../../components/Modals/DuLieu/DuLieuTrongKho/PhieuXDC/XDCEdit'
import XDCDel from '../../../../components/Modals/DuLieu/DuLieuTrongKho/PhieuXDC/XDCDel'
import XDCPrint from '../../../../components/Modals/DuLieu/DuLieuTrongKho/PhieuXDC/XDCPrint'

const PhieuXuatDieuChinh = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataXDC, setDataXDC] = useState('')
  const [isDataKhoDC, setIsDataKhoDC] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataXDC)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [khoanNgayFrom, setKhoanNgayFrom] = useState('')
  const [khoanNgayTo, setKhoanNgayTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [actionType, setActionType] = useState('')
  const showOption = useRef(null)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setcheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [dateData, setDateData] = useState({})
  const [targetRow, setTargetRow] = useState([])
  const [dateChange, setDateChange] = useState(false)
  const [dataCRUD, setDataCRUD] = useState()

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setcheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataXDC ? dataXDC[0] : []).filter((key) => key !== 'SoThamChieu' && key !== 'MaKho_Nhan' && key !== 'ThongTinKhoNhan' && key !== 'MaKho')
    setOptions(key)
  }, [selectVisible])

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
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (!isLoading) {
      getTimeSetting()
    }
  }, [isLoading])

  useEffect(() => {
    setKhoanNgayFrom(dayjs(dateData?.NgayBatDau))
    setKhoanNgayTo(dayjs(dateData?.NgayKetThuc))
  }, [dateData?.NgayBatDau, dateData?.NgayKetThuc])

  useEffect(() => {
    const getDataNDC = async () => {
      try {
        if (isLoading == true) {
          setTableLoad(true)
          const response = await categoryAPI.GetDataXDC(
            dateData == {}
              ? {}
              : {
                  NgayBatDau: dateData.NgayBatDau,
                  NgayKetThuc: dateData.NgayKetThuc,
                },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            setDataXDC(response.data.DataResults)
            setTableLoad(false)
          } else if (response.data.DataError == -104) {
            setDataXDC([])
            setTableLoad(false)
          } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
            await RETOKEN()
            getDataNDC()
          }
        }
      } catch (error) {
        console.log(error)
        setTableLoad(false)
      }
    }
    getDataNDC()
  }, [searchHangHoa, isLoading, targetRow, dateData?.NgayBatDau, dateData?.NgayKetThuc])

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
        const response = await categoryAPI.QuyenHan('DuLieu_XDC', TokenAccess)
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

  function formatDateTime(inputDate, includeTime = false) {
    const date = new Date(inputDate)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    let formattedDateTime = `${day}/${month}/${year}`
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      formattedDateTime += ` ${hours}:${minutes}:${seconds} `
    }
    return formattedDateTime
  }
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US')
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  let timerId
  const handleSearch = (event) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchHangHoa(event.target.value)
    }, 300)
  }
  const handleCreate = () => {
    setIsShowModal(true)
    setActionType('create')
  }
  const handleEdit = (record) => {
    setIsShowModal(true)
    setActionType('edit')
    setIsDataKhoDC(record)
  }
  const handleView = (record) => {
    setIsShowModal(true)
    setIsDataKhoDC(record)
    setActionType('view')
  }
  const handleDelete = (record) => {
    setIsShowModal(true)
    setIsDataKhoDC(record)
    setActionType('delete')
  }
  const handlePrint = () => {
    setIsShowModal(true)
    setActionType('print')
  }
  const handleLoading = () => {
    setTableLoad(true)
  }
  const handleHidden = () => {
    setSelectVisible(!selectVisible)
  }
  const onChange = (checkedValues) => {
    setcheckedList(checkedValues)
  }
  const onClickSubmit = () => {
    setTableLoad(true)
    setTimeout(() => {
      setHiddenRow(checkedList)
      setTableLoad(false)
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
    }, 1000)
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
  const titles = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      with: 10,
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      align: 'center',
      fixed: 'left',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => (
        <span className="flex ">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Ngày chứng từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={formatDateTime(text)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Thông tin kho',
      dataIndex: 'ThongTinKho',
      key: 'ThongTinKho',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.ThongTinKho.localeCompare(b.ThongTinKho),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Số mặt hàng',
      dataIndex: 'SoMatHang',
      key: 'SoMatHang',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoMatHang - b.SoMatHang,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatCurrency(text)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </span>
      ),
    },
    ...(dataThongSo.HIENTHIGIATRIKHO == true
      ? [
          {
            title: 'Trị Giá',
            dataIndex: 'TongTriGiaKho',
            key: 'TongTriGiaKho',
            align: 'center',
            width: 120,
            showSorterTooltip: false,
            sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
            render: (text) => (
              <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
                <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOTIEN)} search={searchHangHoa} />
              </span>
            ),
          },
        ]
      : []),
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => (a.GhiChu?.toString() || '').localeCompare(b.GhiChu?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              justifyContent: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={formatDateTime(text, true)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),

      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Sửa lúc',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{text ? formatDateTime(text, true) : ''}</span>,
    },
    {
      title: ' ',
      key: 'operation',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className="flex gap-2 items-center justify-center">
              <div
                className={`${
                  dataCRUD?.EDIT == false ? 'border-gray-400 bg-gray-400 hover:text-gray-500' : 'border-yellow-400 bg-yellow-400 hover:text-yellow-400'
                } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
                title="Sửa"
                onClick={() => (dataCRUD?.EDIT == false ? '' : handleEdit(record))}
              >
                <MdEdit />
              </div>
              <div
                className={`${
                  dataCRUD?.DEL == false ? 'border-gray-400 bg-gray-400 hover:text-gray-500' : 'border-red-500 bg-red-500 hover:text-red-500'
                } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
                title="Xóa"
                onClick={() => (dataCRUD?.DEL == false ? '' : handleDelete(record))}
              >
                <MdDelete />
              </div>
            </div>
          </>
        )
      },
    },
  ]
  const newTitles = titles.filter((item) => !hiddenRow?.includes(item.dataIndex))
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
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-2 relative">
                  <div className="flex gap-1">
                    <div className="flex items-center gap-2 py-0.5">
                      <h1 className="text-lg font-bold uppercase">Phiếu Xuất Kho Điều Chỉnh</h1>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
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
                  <div className="flex" ref={showOption}>
                    <div
                      className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  "
                      onClick={() => setIsShowOption(!isShowOption)}
                      title="Chức năng khác"
                    >
                      <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                    </div>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-200 p-3 top-[12] right-[2.5%] rounded-lg z-10 duration-500 shadow-custom">
                        <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                          <ActionButton
                            handleAction={handlePrint}
                            title={'In Phiếu'}
                            icon={<MdPrint className="w-6 h-6" />}
                            color={'slate-50'}
                            background={'purple-500'}
                            color_hover={'purple-500'}
                            bg_hover={'white'}
                          />
                          <ActionButton
                            handleAction={() => (dataCRUD?.EXCEL == false ? '' : exportToExcel())}
                            title={'Xuất Excel'}
                            icon={<RiFileExcel2Fill className="w-5 h-5" />}
                            color={'slate-50'}
                            background={dataCRUD?.EXCEL == false ? 'gray-400' : 'green-500'}
                            color_hover={dataCRUD?.EXCEL == false ? 'gray-500' : 'green-500'}
                            bg_hover={'white'}
                          />
                          <ActionButton
                            handleAction={() => handleHidden()}
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
                                  width: '500px',
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
                                  {options.map((item) => (
                                    <Col span={8} key={item}>
                                      <Checkbox value={item} checked={true}>
                                        {nameColumsPhieuXuatDieuChinh[item]}
                                      </Checkbox>
                                    </Col>
                                  ))}
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
                <div className="flex justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1">
                        <label>Từ</label>
                        <DateField
                          onBlur={handleDateChange}
                          onKeyDown={handleKeyDown}
                          className="DatePicker_NXTKho max-w-[110px]"
                          format="DD/MM/YYYY"
                          value={khoanNgayFrom}
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
                          onChange={(values) => {
                            setKhoanNgayFrom(values)
                            setDateChange(false)
                          }}
                        />
                      </div>
                      <div className=" flex items-center gap-1 ">
                        <label>Đến</label>
                        <DateField
                          onBlur={handleDateChange}
                          onKeyDown={handleKeyDown}
                          className="DatePicker_NXTKho max-w-[110px]"
                          format="DD/MM/YYYY"
                          value={khoanNgayTo}
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
                          onChange={(values) => {
                            setKhoanNgayTo(values)
                            setDateChange(true)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ActionButton
                      handleAction={() => (dataCRUD?.ADD == false ? '' : handleCreate())}
                      title={'Thêm Sản Phẩm'}
                      icon={<IoMdAddCircleOutline className="w-6 h-6" />}
                      color={'slate-50'}
                      background={dataCRUD?.ADD == false ? 'gray-400' : 'blue-500'}
                      color_hover={dataCRUD?.ADD == false ? 'gray-500' : 'blue-500'}
                      bg_hover={'white'}
                    />
                  </div>
                </div>
                <div id="my-table">
                  <Table
                    loading={tableLoad}
                    bordered
                    className="table_DMHangHoa setHeight"
                    columns={newTitles}
                    dataSource={filteredHangHoa.map((record, index) => ({ ...record, key: index }))}
                    pagination={{
                      defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                      showSizeChanger: true,
                      pageSizeOptions: ['50', '100', '1000'],
                      onShowSizeChange: (current, size) => {
                        localStorage.setItem('pageSize', size)
                      },
                    }}
                    onRow={(record) => ({
                      onDoubleClick: () => {
                        handleView(record)
                      },
                    })}
                    rowClassName={(record) => (record.SoChungTu === targetRow ? 'highlighted-row' : '')}
                    size="small"
                    scroll={{
                      x: 2000,
                      y: 400,
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '24px',
                    }}
                    summary={() => {
                      return (
                        <Table.Summary fixed="bottom">
                          <Table.Summary.Row>
                            {newTitles
                              .filter((column) => column.render)
                              .map((column, index) => {
                                const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] === 'number'
                                return (
                                  <Table.Summary.Cell key={`summary-cell-${index + 1}`} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                    {isNumericColumn ? (
                                      column.dataIndex === 'SoMatHang' ? (
                                        <Text strong>
                                          {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'TongTriGiaKho' ? (
                                        <Text strong>
                                          {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo.SOLESOTIEN,
                                          })}
                                        </Text>
                                      ) : (
                                        <Text strong>
                                          {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                            maximumFractionDigits: dataThongSo.SOLESOLUONG,
                                          })}
                                        </Text>
                                      )
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
              <div>
                {isShowModal &&
                  (actionType == 'create' ? (
                    <XDCCreate close={() => setIsShowModal(false)} loadingData={handleLoading} setTargetRow={setTargetRow} />
                  ) : actionType == 'view' ? (
                    <XDCView close={() => setIsShowModal(false)} dataXDC={isDataKhoDC} />
                  ) : actionType == 'edit' ? (
                    <XDCEdit close={() => setIsShowModal(false)} dataXDC={isDataKhoDC} loadingData={handleLoading} setTargetRow={setTargetRow} />
                  ) : actionType == 'delete' ? (
                    <XDCDel close={() => setIsShowModal(false)} dataXDC={isDataKhoDC} loadingData={handleLoading} setTargetRow={setTargetRow} />
                  ) : actionType == 'print' ? (
                    <XDCPrint close={() => setIsShowModal(false)} />
                  ) : null)}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default PhieuXuatDieuChinh
