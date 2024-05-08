/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { Table, Select, Tooltip, Typography, Checkbox, Row, Button, Col, Spin, Input, Empty } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import { CgCloseO } from 'react-icons/cg'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { CloseSquareFilled } from '@ant-design/icons'
import { TbEyeDollar, TbEye } from 'react-icons/tb'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, addRowClass, exportToExcel } from '../../action/Actions'
import ActionButton from '../../components/util/Button/ActionButton'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsNhapXuatTon_TongKho } from '../../components/util/Table/ColumnName'
import { useNavigate } from 'react-router-dom'
import { DateField } from '@mui/x-date-pickers'

const NhapXuatTon = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataNXT, setDataNXT] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataNXT)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const showOption = useRef(null)
  const [nhomHangNXT, setNhomHangNXT] = useState([])
  const [hangHoaNXT, setHangHoaNXT] = useState([])
  const [khoanNgayFrom, setKhoanNgayFrom] = useState([])
  const [khoanNgayTo, setKhoanNgayTo] = useState([])
  const [selectedMaFrom, setSelectedMaFrom] = useState(null)
  const [selectedMaTo, setSelectedMaTo] = useState(null)
  const [selectedMaList, setSelectedMaList] = useState([])
  const [selectedNhomFrom, setSelectedNhomFrom] = useState(null)
  const [selectedNhomTo, setSelectedNhomTo] = useState(null)
  const [selectedNhomList, setSelectedNhomList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setcheckedList] = useState([])
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
        const response = await categoryAPI.QuyenHan('TruyVan_CanDoiNXT_TongKho', TokenAccess)
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
    selectedMaFrom == null ? setSelectedMaTo(null) : ''
    selectedNhomFrom == null ? setSelectedNhomTo(null) : ''
  }, [selectedMaFrom, selectedNhomFrom])

  useEffect(() => {
    const getListNhomHangNXT = async () => {
      try {
        const response = await categoryAPI.ListNhomHangNXT(TokenAccess)
        if (response.data.DataError == 0) {
          setNhomHangNXT(response.data.DataResults)
          setIsLoading(true)
        } else {
          console.log(response.data)
          setIsLoading(true)
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListNhomHangNXT()
    }
  }, [isLoading])

  useEffect(() => {
    const getListHangHoaNXT = async () => {
      try {
        const response = await categoryAPI.ListHangHoaNXT(TokenAccess)
        if (response.data.DataError == 0) {
          setHangHoaNXT(response.data.DataResults)
          setIsLoading(true)
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
      getListHangHoaNXT()
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
          setIsLoading(true)
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
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setcheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataNXT ? dataNXT[0] : [] || []).filter((key) => key !== 'MaNhomHang' && key !== 'MaKho')
    setOptions(key)
  }, [selectVisible])

  useEffect(() => {
    const getDataNXTFirst = async () => {
      try {
        if (isLoading === true) {
          setTableLoad(true)
          const response = await categoryAPI.InfoNXTTongKho(
            dateData == {}
              ? {}
              : {
                  NgayBatDau: dateData.NgayBatDau,
                  NgayKetThuc: dateData.NgayKetThuc,
                },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            setDataNXT(response.data.DataResults)
            setIsLoading(true)
            setTableLoad(false)
          } else {
            setDataNXT([])
            console.log(response.data)
            setTableLoad(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDataNXTFirst()
  }, [searchHangHoa, isLoading])

  const getDataNXT = async () => {
    try {
      const response = await categoryAPI.InfoNXTTongKho(
        {
          NgayBatDau: dateData.NgayBatDau,
          NgayKetThuc: dateData.NgayKetThuc,
          CodeValue1From: selectedNhomFrom,
          CodeValue1To: selectedNhomTo,
          CodeValue1List: selectedNhomList.join(', '),
          CodeValue2From: selectedMaFrom,
          CodeValue2To: selectedMaTo,
          CodeValue2List: selectedMaList.join(', '),
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        setDataNXT(response.data.DataResults)
        setTableLoad(false)
      } else if (response.data.DataError == -104) {
        setDataNXT([])
        setTableLoad(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleFilterDS = () => {
    setTableLoad(true)
    if (!tableLoad) {
      getDataNXT()
    }
  }
  const getDataNXT_DVTQD = async () => {
    try {
      const response = await categoryAPI.InfoNXTTongKho_DVTQD(
        {
          NgayBatDau: dateData.NgayBatDau,
          NgayKetThuc: dateData.NgayKetThuc,
          CodeValue1From: selectedNhomFrom,
          CodeValue1To: selectedNhomTo,
          CodeValue1List: selectedNhomList.join(', '),
          CodeValue2From: selectedMaFrom,
          CodeValue2To: selectedMaTo,
          CodeValue2List: selectedMaList.join(', '),
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        setDataNXT(response.data.DataResults)
        setTableLoad(false)
      } else {
        setDataNXT([])
        setTableLoad(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleFilterDS_DVTQD = () => {
    setTableLoad(true)
    if (!tableLoad) {
      getDataNXT_DVTQD()
    }
  }
  let timerId
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
  const handleSearch = (event) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchHangHoa(event.target.value)
    }, 300)
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
  const titles = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      with: 10,
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      fixed: 'left',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      fixed: 'left',
      align: 'center',
      width: 220,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Nhóm',
      dataIndex: 'TenNhomHang',
      key: 'TenNhomHang',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.TenNhomHang.localeCompare(b.TenNhomHang),
      showSorterTooltip: false,
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
            }}
          >
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
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Số lượng - Tồn đầu',
      dataIndex: 'SoLuongTonDK',
      key: 'SoLuongTonDK',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTonDK - b.SoLuongTonDK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Tồn đầu',
      dataIndex: 'TriGiaTonDK',
      key: 'TriGiaTonDK',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaTonDK - b.TriGiaTonDK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Mua hàng',
      dataIndex: 'SoLuongNhap_PMH',
      key: 'SoLuongNhap_PMH',
      align: 'center',
      width: 150,

      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_PMH - b.SoLuongNhap_PMH,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Mua hàng',
      dataIndex: 'TriGiaNhap_PMH',
      key: 'TriGiaNhap_PMH',
      align: 'center',
      width: 150,

      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaNhap_PMH - b.TriGiaNhap_PMH,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Trả hàng',
      dataIndex: 'SoLuongNhap_NTR',
      key: 'SoLuongNhap_NTR',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_NTR - b.SoLuongNhap_NTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Trả hàng',
      dataIndex: 'TriGiaNhap_NTR',
      key: 'TriGiaNhap_NTR',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaNhap_NTR - b.TriGiaNhap_NTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Nhập Điều chỉnh',
      dataIndex: 'SoLuongNhap_NDC',
      key: 'SoLuongNhap_NDC',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_NDC - b.SoLuongNhap_NDC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Nhập Điều chỉnh',
      dataIndex: 'TriGiaNhap_NDC',
      key: 'TriGiaNhap_NDC',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaNhap_NDC - b.TriGiaNhap_NDC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Tổng nhập',
      dataIndex: 'SoLuongNhap',
      key: 'SoLuongNhap',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap - b.SoLuongNhap,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Tổng nhập',
      dataIndex: 'TriGiaNhap',
      key: 'TriGiaNhap',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaNhap - b.TriGiaNhap,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Bán sỉ',
      dataIndex: 'SoLuongXuat_PBS',
      key: 'SoLuongXuat_PBS',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_PBS - b.SoLuongXuat_PBS,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Bán sỉ',
      dataIndex: 'TriGiaXuat_PBS',
      key: 'TriGiaXuat_PBS',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_PBS - b.TriGiaXuat_PBS,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Bán lẻ',
      dataIndex: 'SoLuongXuat_PBL',
      key: 'SoLuongXuat_PBL',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_PBL - b.SoLuongXuat_PBL,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Bán lẻ',
      dataIndex: 'TriGiaXuat_PBL',
      key: 'TriGiaXuat_PBL',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_PBL - b.TriGiaXuat_PBL,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Bán lẻ (Quầy)',
      dataIndex: 'SoLuongXuat_PBQ',
      key: 'SoLuongXuat_PBQ',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_PBQ - b.SoLuongXuat_PBQ,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Bán lẻ (Quầy)',
      dataIndex: 'TriGiaXuat_PBQ',
      key: 'TriGiaXuat_PBQ',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_PBQ - b.TriGiaXuat_PBQ,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Trả hàng',
      dataIndex: 'SoLuongXuat_XTR',
      key: 'SoLuongXuat_XTR',
      align: 'center',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XTR - b.SoLuongXuat_XTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Trả hàng',
      dataIndex: 'TriGiaXuat_XTR',
      key: 'TriGiaXuat_XTR',
      align: 'center',
      width: 150,

      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_XTR - b.TriGiaXuat_XTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Sử dụng',
      dataIndex: 'SoLuongXuat_XSD',
      key: 'SoLuongXuat_XSD',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XSD - b.SoLuongXuat_XSD,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Sử dụng',
      dataIndex: 'TriGiaXuat_XSD',
      key: 'TriGiaXuat_XSD',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_XSD - b.TriGiaXuat_XSD,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Hủy',
      dataIndex: 'SoLuongXuat_HUY',
      key: 'SoLuongXuat_HUY',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_HUY - b.SoLuongXuat_HUY,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Hủy',
      dataIndex: 'TriGiaXuat_HUY',
      key: 'TriGiaXuat_HUY',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_HUY - b.TriGiaXuat_HUY,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Xuất Điều chỉnh',
      dataIndex: 'SoLuongXuat_XDC',
      key: 'SoLuongXuat_XDC',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XDC - b.SoLuongXuat_XDC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Xuất Điều chỉnh',
      dataIndex: 'TriGiaXuat_XDC',
      key: 'TriGiaXuat_XDC',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat_XDC - b.TriGiaXuat_XDC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Xuất',
      dataIndex: 'SoLuongXuat',
      key: 'SoLuongXuat',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat - b.SoLuongXuat,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Xuất',
      dataIndex: 'TriGiaXuat',
      key: 'TriGiaXuat',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaXuat - b.TriGiaXuat,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số lượng - Tồn Cuối',
      dataIndex: 'SoLuongTonCK',
      key: 'SoLuongTonCK',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTonCK - b.SoLuongTonCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trị giá - Tồn Cuối',
      dataIndex: 'TriGiaTonCK',
      key: 'TriGiaTonCK',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TriGiaTonCK - b.TriGiaTonCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
  ]
  const newTitles = titles.filter((item) => !hiddenRow?.includes(item.dataIndex))
  const titlesChildren = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      with: 10,
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      fixed: 'left',
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
      fixed: 'left',
      align: 'center',
      width: 220,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Nhóm',
      dataIndex: 'TenNhomHang',
      key: 'TenNhomHang',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.TenNhomHang.localeCompare(b.TenNhomHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Tồn đầu kỳ',
      align: 'center',
      dataIndex: 'TonDK',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongTonDK',
          key: 'SoLuongTonDK',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongTonDK - b.SoLuongTonDK,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaTonDK',
          key: 'TriGiaTonDK',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaTonDK - b.TriGiaTonDK,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Nhập - Mua hàng',
      align: 'center',
      dataIndex: 'Nhap_PMH',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng ',
          dataIndex: 'SoLuongNhap_PMH',
          key: 'SoLuongNhap_PMH',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongNhap_PMH - b.SoLuongNhap_PMH,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá ',
          dataIndex: 'TriGiaNhap_PMH',
          key: 'TriGiaNhap_PMH',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaNhap_PMH - b.TriGiaNhap_PMH,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Nhập - Trả hàng',
      align: 'center',
      ellipsis: true,
      dataIndex: 'Nhap_NTR',
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongNhap_NTR',
          key: 'SoLuongNhap_NTR',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongNhap_NTR - b.SoLuongNhap_NTR,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaNhap_NTR',
          key: 'TriGiaNhap_NTR',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaNhap_NTR - b.TriGiaNhap_NTR,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Nhập - Điều chỉnh',
      align: 'center',
      ellipsis: true,
      dataIndex: 'Nhap_NDC',
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongNhap_NDC',
          key: 'SoLuongNhap_NDC',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongNhap_NDC - b.SoLuongNhap_NDC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaNhap_NDC',
          key: 'TriGiaNhap_NDC',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaNhap_NDC - b.TriGiaNhap_NDC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Nhập - Tổng',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongNhap',
          key: 'SoLuongNhap',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongNhap - b.SoLuongNhap,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaNhap',
          key: 'TriGiaNhap',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaNhap - b.TriGiaNhap,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Bán sỉ',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_PBS',
          key: 'SoLuongXuat_PBS',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_PBS - b.SoLuongXuat_PBS,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_PBS',
          key: 'TriGiaXuat_PBS',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_PBS - b.TriGiaXuat_PBS,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Bán lẻ',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_PBL',
          key: 'SoLuongXuat_PBL',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_PBL - b.SoLuongXuat_PBL,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_PBL',
          key: 'TriGiaXuat_PBL',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_PBL - b.TriGiaXuat_PBL,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Bán lẻ (Quầy)',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_PBQ',
          key: 'SoLuongXuat_PBQ',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_PBQ - b.SoLuongXuat_PBQ,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_PBQ',
          key: 'TriGiaXuat_PBQ',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_PBQ - b.TriGiaXuat_PBQ,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Trả hàng',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_XTR',
          key: 'SoLuongXuat_XTR',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_XTR - b.SoLuongXuat_XTR,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_XTR',
          key: 'TriGiaXuat_XTR',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_XTR - b.TriGiaXuat_XTR,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Sử dụng',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_XSD',
          key: 'SoLuongXuat_XSD',
          width: 120,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_XSD - b.SoLuongXuat_XSD,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_XSD',
          key: 'TriGiaXuat_XSD',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_XSD - b.TriGiaXuat_XSD,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Hủy',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_HUY',
          key: 'SoLuongXuat_HUY',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_HUY - b.SoLuongXuat_HUY,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_HUY',
          key: 'TriGiaXuat_HUY',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_HUY - b.TriGiaXuat_HUY,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Điều chỉnh',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat_XDC',
          key: 'SoLuongXuat_XDC',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat_XDC - b.SoLuongXuat_XDC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat_XDC',
          key: 'TriGiaXuat_XDC',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat_XDC - b.TriGiaXuat_XDC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Xuất - Tổng',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongXuat',
          key: 'SoLuongXuat',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongXuat - b.SoLuongXuat,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaXuat',
          key: 'TriGiaXuat',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaXuat - b.TriGiaXuat,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Tồn Cuối',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'SoLuongTonCK',
          key: 'SoLuongTonCK',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.SoLuongTonCK - b.SoLuongTonCK,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trị giá',
          dataIndex: 'TriGiaTonCK',
          key: 'TriGiaTonCK',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.TriGiaTonCK - b.TriGiaTonCK,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
  ]
  function filterChildren(children) {
    return children?.filter((item) => !hiddenRow?.includes(item.dataIndex))
  }
  const newTitlesChildren = titlesChildren
    .map((item) => {
      if (item.children && item.children.length > 0) {
        item.children = filterChildren(item.children)
        return item
      } else {
        return filterChildren([item])[0] || null
      }
    })
    .filter((item) => item !== null)

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
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center ">
                    <div className="flex items-center gap-2 py-1">
                      <h1 className="text-lg font-bold text-black-600 uppercase">Nhập Xuất Tồn</h1>
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
                            title={'Xuất excel'}
                            isPermission={dataCRUD?.EXCEL}
                            icon={<RiFileExcel2Fill className="w-5 h-5" />}
                            color={'slate-50'}
                            background={dataCRUD?.EXCEL == false ? 'gray-400' : 'green-500'}
                            color_hover={dataCRUD?.EXCEL == false ? 'gray-500' : 'green-500'}
                            bg_hover={'white'}
                          />
                          <ActionButton
                            handleAction={handleHidden}
                            title={'Ẩn cột'}
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
                                  width: '380px',
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
                                <Row className="flex justify-around">
                                  {options && options.length > 0 ? (
                                    options?.map((item, index) => (
                                      <Col span={10} key={(item, index)}>
                                        <Checkbox value={item} checked={true}>
                                          {nameColumsNhapXuatTon_TongKho[item]}
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
                <div className="flex justify-between  gap-2 w-[95vw]">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex gap-2 justify-between">
                      <div className="flex gap-1">
                        <div className="flex items-center gap-1">
                          <label>Từ</label>
                          <DateField
                            // className="DatePicker_NXTKho  max-w-[120px]"
                            className="max-w-[130px] min-w-[130px]"
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
                            className="max-w-[130px] min-w-[130px]"
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
                      <div className="flex items-center gap-1">
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
                        <Tooltip title="Xem ( ĐVT Quy Đổi )" color="blue">
                          <div>
                            <ActionButton
                              handleAction={handleFilterDS_DVTQD}
                              icon={<TbEyeDollar className="w-5 h-5" />}
                              color={'slate-50'}
                              background={'blue-500'}
                              color_hover={'blue-500'}
                              bg_hover={'white'}
                              isModal={true}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    <div className=" flex flex-col gap-2">
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <div>Từ</div>
                          <Select
                            allowClear
                            showSearch
                            size="small"
                            placeholder="Chọn nhóm"
                            value={selectedNhomFrom}
                            onChange={(value) => {
                              setSelectedNhomFrom(value)
                              selectedNhomTo == null ? setSelectedNhomTo(value) : ''
                              if (selectedNhomTo !== null && nhomHangNXT.findIndex((item) => item.Ma === value) > nhomHangNXT.findIndex((item) => item.Ma === selectedNhomTo)) {
                                setSelectedNhomTo(value)
                              }
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                            optionFilterProp="children"
                            popupMatchSelectWidth={false}
                            optionLabelProp="value"
                          >
                            {nhomHangNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                  {item.ThongTinNhomHang}
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
                            placeholder="Chọn nhóm"
                            value={selectedNhomTo}
                            onChange={(value) => {
                              setSelectedNhomTo(value)
                              if (selectedNhomFrom !== null && nhomHangNXT.findIndex((item) => item.Ma === value) < nhomHangNXT.findIndex((item) => item.Ma === selectedNhomFrom)) {
                                setSelectedNhomFrom(value)
                              }
                              selectedNhomFrom == null ? setSelectedNhomFrom(value) : ''
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                            optionFilterProp="children"
                            popupMatchSelectWidth={false}
                            optionLabelProp="value"
                          >
                            {nhomHangNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                  {item.ThongTinNhomHang}
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
                            placeholder="Danh sách nhóm"
                            value={selectedNhomList}
                            onChange={(value) => setSelectedNhomList(value)}
                            className="md:w-[30vw] lg:w-[40vw] xl:w-[50vw]"
                            maxTagCount="responsive"
                            optionFilterProp="children"
                            maxTagPlaceholder={(omittedValues) => (
                              <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                                <span>+{omittedValues?.length}...</span>
                              </Tooltip>
                            )}
                          >
                            {nhomHangNXT?.map((item) => {
                              return (
                                <Select.Option key={item.Ma} value={item.Ma} title={item.ThongTinNhomHang}>
                                  {item.ThongTinNhomHang} <br />
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
                            placeholder="Chọn mã hàng"
                            size="small"
                            value={selectedMaFrom}
                            onChange={(value) => {
                              setSelectedMaFrom(value)
                              selectedMaTo == null ? setSelectedMaTo(value) : ''
                              if (selectedMaTo !== null && hangHoaNXT.findIndex((item) => item.MaHang === value) > hangHoaNXT.findIndex((item) => item.MaHang === selectedMaTo)) {
                                setSelectedMaTo(value)
                              }
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                            optionFilterProp="children"
                            popupMatchSelectWidth={false}
                            optionLabelProp="value"
                          >
                            {hangHoaNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                  {item.MaHang} - {item.TenHang}
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
                            placeholder="Chọn mã hàng"
                            value={selectedMaTo}
                            onChange={(value) => {
                              setSelectedMaTo(value)
                              selectedMaFrom == null ? setSelectedMaFrom(value) : ''
                              if (
                                selectedMaFrom !== null &&
                                hangHoaNXT.findIndex((item) => item.MaHang === value) < hangHoaNXT.findIndex((item) => item.MaHang === selectedMaFrom)
                              ) {
                                setSelectedMaFrom(value)
                              }
                            }}
                            style={{
                              width: '12vw',
                              textOverflow: 'ellipsis',
                            }}
                            optionFilterProp="children"
                            popupMatchSelectWidth={false}
                            optionLabelProp="value"
                          >
                            {hangHoaNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                  {item.MaHang} - {item.TenHang}
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
                            value={selectedMaList}
                            onChange={(value) => setSelectedMaList(value)}
                            placeholder="Chọn mã hàng"
                            className="md:w-[30vw] lg:w-[40vw] xl:w-[50vw]"
                            maxTagCount="responsive"
                            optionFilterProp="children"
                            maxTagPlaceholder={(omittedValues) => (
                              <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                                <span>+{omittedValues?.length}...</span>
                              </Tooltip>
                            )}
                          >
                            {hangHoaNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                  {item.MaHang}-{item.TenHang} <br />
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
              <div className="TruyVan" id="my-table">
                <Table
                  loading={tableLoad}
                  className="setHeight"
                  columns={newTitlesChildren}
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
                  rowClassName={(record, index) => addRowClass(record, index)}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '24px',
                    borderRadius: '10px',
                  }}
                  summary={() => {
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row>
                          {newTitles
                            .filter((column) => column.render)
                            .map((column, index) => {
                              const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] === 'number'
                              const total = Number(filteredHangHoa?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0))
                              return (
                                <Table.Summary.Cell
                                  index={index}
                                  key={`summary-cell-${index + 1}`}
                                  align={isNumericColumn ? 'right' : 'left'}
                                  className="text-end font-bold  bg-[#f1f1f1]"
                                >
                                  {isNumericColumn ? (
                                    <Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : ''}>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                        maximumFractionDigits: dataThongSo.SOLESOLUONG,
                                      })}
                                    </Text>
                                  ) : column.dataIndex == 'STT' ? (
                                    <Text className="text-center flex justify-center" strong>
                                      {dataNXT?.length}
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

export default NhapXuatTon
