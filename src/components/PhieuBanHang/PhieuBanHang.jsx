/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import LoadingPage from '../util/Loading/LoadingPage'
import { MdDelete, MdEdit, MdPrint } from 'react-icons/md'
import { nameColumnsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG, XOAPHIEUBANHANG, LAPPHIEUTHU, KHOANNGAY, exportToExcel, APIPHANQUYEN, RETOKEN, addRowClass } from '../../action/Actions'
import API from '../../API/API'
import { toast } from 'react-toastify'
import ModelPrint from './PrintModel'
import ActionButton from '../util/Button/ActionButton'
import Model from './Model'
import { DateField } from '@mui/x-date-pickers/DateField'
import { BsSearch } from 'react-icons/bs'
import dayjs from 'dayjs'
import { Checkbox, Col, Empty, Input, Row, Table, Tooltip, Typography } from 'antd'
import { TfiMoreAlt } from 'react-icons/tfi'
import { CgCloseO } from 'react-icons/cg'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { Button, Spin } from 'antd'
import { IoAddCircleOutline } from 'react-icons/io5'
import { FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearch } from '../hooks/Search'
import HighlightedCell from '../hooks/HighlightedCell'
import { GiReceiveMoney } from 'react-icons/gi'
function PhieuBanHang() {
  const optionContainerRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [modelType, setModelType] = useState('')
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [data, setData] = useState([])
  const [isShow, setIsShow] = useState(false)
  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isShowDelete, setIsShowDelete] = useState(false)
  const [typeModel, setTypeModel] = useState('')
  const [type, setType] = useState()
  const [dataRecord, setDataRecord] = useState([])
  const [selectMH, setSelectMH] = useState()
  const [isShowOption, setIsShowOption] = useState(false)
  const [dateModal, setDateModal] = useState()
  const [dataDate, setDataDate] = useState()
  const [khoanNgayFrom, setKhoanNgayFrom] = useState()
  const [khoanNgayTo, setKhoanNgayTo] = useState()
  const [dateChange, setDateChange] = useState(false)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [dataCRUD, setDataCRUD] = useState()
  const [count, setCount] = useState(20)
  const [dataLoad, setDataLoad] = useState([])
  const [setSearchData, filteredData, searchData] = useSearch(data)

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = data && data[0] ? Object.keys(data[0]).filter((key) => key !== 'MaSoThue') : []
    setOptions(key)
  }, [selectVisible])

  useEffect(() => {
    setDataLoad(filteredData?.splice(0, count))
  }, [data?.length, searchData])

  useEffect(() => {
    const tableContainer = document.querySelector('.ant-table-body')
    const handleScroll = async () => {
      if (tableContainer && tableContainer?.scrollTop + tableContainer?.clientHeight + 1 >= tableContainer?.scrollHeight) {
        if (dataLoad.length < data.length) {
          setDataLoad((prevDataLoad) => [...prevDataLoad, ...data.slice(count, count + 20)])
          setCount((pre) => pre + 20)
        }
      }
    }
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [data, dataLoad?.length, count])

  useEffect(() => {
    setKhoanNgayFrom(dataDate?.NgayBatDau)
    setKhoanNgayTo(dataDate?.NgayKetThuc)
  }, [dataDate?.NgayBatDau, dataDate?.NgayKetThuc])

  useEffect(() => {
    const getDate = async () => {
      const date = await KHOANNGAY(API.KHOANNGAY, token)
      if (date.DataError == 0) {
        setKhoanNgayFrom(dayjs(date.NgayBatDau))
        setKhoanNgayTo(dayjs(date.NgayKetThuc))
        setDataLoaded(true)
      }
    }
    if (dataLoaded) {
      getDate()
    }
  }, [dataLoaded])

  useEffect(() => {
    const getQuyenHan = async () => {
      const quyenHan = await APIPHANQUYEN(token, {
        Ma: 'DuLieu_PBS',
      })
      setDataCRUD(quyenHan)
    }
    getQuyenHan()
  }, [])

  let timerId
  const handleInputChange = (e) => {
    const inputValue = e.target.value
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchData(inputValue)
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
        setDataDate({
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayFrom,
        })
        return
      } else if (dateChange && khoanNgayFrom && khoanNgayTo && khoanNgayFrom.isAfter(khoanNgayTo)) {
        setDataDate({
          NgayBatDau: khoanNgayTo,
          NgayKetThuc: khoanNgayTo,
        })
      } else {
        setDataDate({
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayTo,
        })
      }
    }, 300)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }

  useEffect(() => {
    const getListData = async () => {
      setLoadingSearch(true)
      const res = await DANHSACHPHIEUBANHANG(
        API.DANHSACHPBS,
        token,
        dataDate == null
          ? {}
          : {
              NgayBatDau: dayjs(dataDate?.NgayBatDau).format('YYYY-MM-DD'),
              NgayKetThuc: dayjs(dataDate?.NgayKetThuc).format('YYYY-MM-DD'),
            },
        dispatch,
      )
      if (res.DataError === 0) {
        setData(res.DataResults)
        setDataLoaded(true)
        setLoadingSearch(false)
      } else if ((res && res.DataError === -107) || (res && res.DataError === -108)) {
        await RETOKEN()
        getListData()
      } else {
        setData([])
        setDataLoaded(true)
        setLoadingSearch(false)
      }
    }
    getListData()
  }, [searchData, selectMH, dataDate?.NgayBatDau, dataDate?.NgayKetThuc])

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
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
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
      setHiddenRow(checkedList)
    }, 1000)
  }
  const titles = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      fixed: 'left',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      showSorterTooltip: false,
      render: (text) => (
        <span className="flex text-start">
          <HighlightedCell text={text} search={searchData} />
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
          <HighlightedCell text={dayjs(text).format('DD/MM/YYYY')} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Mã đối tượng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 130,
      align: 'center',
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-start">
          <HighlightedCell text={text} search={searchData} />
        </div>
      ),
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 220,
      align: 'center',
      sorter: (a, b) => (a.TenDoiTuong?.toString() || '').localeCompare(b.TenDoiTuong?.toString() || ''),
      showSorterTooltip: false,
      render: (text) => (
        <div className="whitespace-pre-wrap text-start">
          <HighlightedCell text={text} search={searchData} />
        </div>
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
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchData} />
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChi',
      key: 'DiaChi',
      width: 280,
      align: 'center',
      sorter: (a, b) => a.DiaChi.localeCompare(b.DiaChi),
      showSorterTooltip: false,
      render: (text) => (
        <div className="whitespace-pre-wrap text-start">
          <HighlightedCell text={text} search={searchData} />
        </div>
      ),
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'MST',
      key: 'MST',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.MST - b.MST,
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchData} />,
    },
    {
      title: 'Tổng mặt hàng',
      dataIndex: 'TongMatHang',
      key: 'TongMatHang',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongMatHang - b.TongMatHang,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), 0)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOLUONG)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOTIEN)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tổng tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOTIEN)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOTIEN)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'TLCK Thanh Toán',
      dataIndex: 'TyLeCKTT',
      key: 'TyLeCKTT',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TyLeCKTT - b.TyLeCKTT,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOTIEN)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tổng CK thanh toán',
      dataIndex: 'TongTienCKTT',
      key: 'TongTienCKTT',
      align: 'center',
      width: 160,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongTienCKTT - b.TongTienCKTT,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOTIEN)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'TongTongCong',
      key: 'TongTongCong',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongTongCong - b.TongTongCong,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLESOTIEN)} search={searchData} />
        </span>
      ),
    },
    {
      title: 'Tiền mặt',
      dataIndex: 'TTTienMat',
      key: 'TTTienMat',
      align: 'center',
      width: 100,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.TTTienMat ? 1 : 0
        const valueB = b.TTTienMat ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className="justify-center" id={`TTTienMat_${record.key}`} checked={text} />,
    },
    {
      title: 'Phiếu thu',
      dataIndex: 'PhieuThu',
      key: 'PhieuThu',
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.PhieuThu?.toString() || '').localeCompare(b.PhieuThu?.toString() || ''),
      showSorterTooltip: false,
      render: (text) => (
        <div className="whitespace-pre-wrap text-start">
          <HighlightedCell text={text} search={searchData} />
        </div>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      width: 250,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => (a.GhiChu?.toString() || '').localeCompare(b.GhiChu?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div className="text-start whitespace-pre-wrap">
            <HighlightedCell text={text} search={searchData} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 180,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      render: (text) => (
        <div className="truncate">
          <HighlightedCell text={text} search={searchData} />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => <HighlightedCell text={dayjs(text).format('DD/MM/YYYY HH:mm:ss')} search={searchData} />,
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      width: 180,
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),
      render: (text) => (
        <div className="truncate">
          <HighlightedCell text={text} search={searchData} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => {
        if (text) {
          return <HighlightedCell text={dayjs(text).format('DD/MM/YYYY HH:mm:ss')} search={searchData} />
        } else {
          return ''
        }
      },
    },
    {
      title: 'Chức năng',
      key: 'operation',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center ">
              <Tooltip title="Lập phiếu thu" color="blue">
                <div
                  onClick={() => (record.PhieuThu ? null : handleChangePhieuThu(record))}
                  className={` p-[4px] border-2 rounded text-slate-50 hover:bg-white ${
                    record.PhieuThu ? 'border-gray-400 bg-gray-400  hover:text-gray-500 cursor-not-allowed' : 'border-blue-500 bg-blue-500 hover:text-blue-500 cursor-pointer'
                  }   `}
                  disabled={record.PhieuThu ? true : false}
                >
                  <GiReceiveMoney />
                </div>
              </Tooltip>
              <Tooltip title="Sửa" color="blue">
                <div
                  onClick={() => (dataCRUD?.EDIT == false ? '' : handleEdit(record))}
                  className={`${
                    dataCRUD?.EDIT == false ? 'border-gray-400 bg-gray-400  hover:text-gray-500' : 'border-yellow-400 bg-yellow-400 hover:text-yellow-400'
                  } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
                >
                  <MdEdit />
                </div>
              </Tooltip>
              <Tooltip title="Xóa" color="blue">
                <div
                  onClick={() => (dataCRUD?.DEL == false ? '' : handleDelete(record))}
                  className={`${
                    dataCRUD?.DEL == false ? 'border-gray-400 bg-gray-400 hover:text-gray-500' : 'border-red-500 bg-red-500 hover:text-red-500'
                  } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
                >
                  <MdDelete />
                </div>
              </Tooltip>
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
                          <ActionButton
                            icon={<FaEyeSlash className="w-6 h-6" />}
                            color={'slate-50'}
                            title={'Ẩn cột'}
                            background={'red-500'}
                            bg_hover={'white'}
                            color_hover={'red-500'}
                            handleAction={handleShow_hidden}
                          />
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
                      className="max-w-[130px] min-w-[130px]"
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
                  <div className="flex gap-x-2 items-center">
                    <label htmlFor="">Đến</label>
                    <DateField
                      onBlur={handleDateChange}
                      onKeyDown={handleKeyDown}
                      className="max-w-[130px] min-w-[130px]"
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
                  loading={loadingSearch}
                  rowKey={(record) => record.SoChungTu}
                  onRow={(record) => ({
                    onDoubleClick: () => handleView(record),
                  })}
                  rowClassName={(record, index) => (record.SoChungTu == selectMH ? 'highlighted-row' : addRowClass(record, index))}
                  className="setHeight"
                  columns={newTitles}
                  dataSource={dataLoad?.map((item, index) => ({
                    ...item,
                    modifiedIndex: index + 1,
                  }))}
                  size="small"
                  scroll={{
                    x: 'max-content',
                    y: 400,
                  }}
                  pagination={false}
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
                              const isNumericColumn = typeof filteredData[0]?.[column.dataIndex] === 'number'
                              return (
                                <Table.Summary.Cell
                                  index={index}
                                  key={`summary-cell-${index + 1}`}
                                  align={isNumericColumn ? 'right' : 'left'}
                                  className="text-end font-bold bg-[#f1f1f1]"
                                >
                                  {isNumericColumn ? (
                                    (() => {
                                      const total = Number(data?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0))
                                      return column.dataIndex === 'TongSoLuong' ? (
                                        <Typography.Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : 'text-white'}>
                                          {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                            maximumFractionDigits: dataThongSo.SOLESOLUONG,
                                          })}
                                        </Typography.Text>
                                      ) : [
                                          'TongTienHang',
                                          'TongTienThue',
                                          'TongThanhTien',
                                          'TongTienCKTT',
                                          'TongTongCong',
                                          'SoLuong',
                                          'TienHang',
                                          'TienThue',
                                          'TienCKTT',
                                          'TongCong_TM',
                                          'TongCong_CN',
                                          'TongCong',
                                        ].includes(column.dataIndex) ? (
                                        <Typography.Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : 'text-white'}>
                                          {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo.SOLESOTIEN,
                                          })}
                                        </Typography.Text>
                                      ) : ['TyLeCKTT'].includes(column.dataIndex) ? (
                                        <Typography.Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : 'text-white'}>
                                          {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo.SOLETYLE,
                                            maximumFractionDigits: dataThongSo.SOLETYLE,
                                          })}
                                        </Typography.Text>
                                      ) : column.dataIndex === 'key' ? (
                                        <Typography.Text strong className="flex justify-center text-white">
                                          {data.length}
                                        </Typography.Text>
                                      ) : (
                                        <Typography.Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : 'text-white'}>
                                          {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          })}
                                        </Typography.Text>
                                      )
                                    })()
                                  ) : column.dataIndex === 'TTTienMat' ? (
                                    <Typography.Text strong className="text-white text-center flex justify-center">
                                      {Object?.values(data)?.filter((value) => value.TTTienMat)?.length}
                                    </Typography.Text>
                                  ) : column.dataIndex == 'STT' ? (
                                    <Typography.Text className="text-center flex justify-center text-white" strong>
                                      {data?.length}
                                    </Typography.Text>
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
