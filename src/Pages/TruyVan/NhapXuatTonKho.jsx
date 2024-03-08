/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { Table, Select, Tooltip, Typography, Checkbox, Row, Button, Col, Spin, Input, Empty } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import { CgCloseO } from 'react-icons/cg'
import { TbEyeDollar, TbEye } from 'react-icons/tb'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { CloseSquareFilled } from '@ant-design/icons'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, exportToExcel } from '../../action/Actions'
import ActionButton from '../../components/util/Button/ActionButton'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsNhapXuatTon_TheoKho } from '../../components/util/Table/ColumnName'
import { useNavigate } from 'react-router-dom'
import { DateField } from '@mui/x-date-pickers'

const NhapXuatTonKho = () => {
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
  const [khoHangNXT, setKhoHangNXT] = useState([])
  const [khoanNgayFrom, setKhoanNgayFrom] = useState([])
  const [khoanNgayTo, setKhoanNgayTo] = useState([])
  const [selectedMaFrom, setSelectedMaFrom] = useState(null)
  const [selectedMaTo, setSelectedMaTo] = useState(null)
  const [selectedMaList, setSelectedMaList] = useState([])
  const [selectedNhomFrom, setSelectedNhomFrom] = useState(null)
  const [selectedNhomTo, setSelectedNhomTo] = useState(null)
  const [selectedNhomList, setSelectedNhomList] = useState([])
  const [selectedMaKho, setSelectedMaKho] = useState(null)
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
    const getDataNXTFirst = async () => {
      try {
        setTableLoad(true)
        if (isLoading == true) {
          const response = await categoryAPI.InfoNXTTheoKho(
            {
              NgayBatDau: khoanNgayFrom.format('YYYY-MM-DD'),
              NgayKetThuc: khoanNgayTo.format('YYYY-MM-DD'),
            },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            setDataNXT(response.data.DataResults)
            setIsLoading(true)
            setTableLoad(false)
          } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
            await RETOKEN()
            getDataNXTFirst()
          } else {
            setDataNXT([])
            console.log(response.data)
            setTableLoad(false)
          }
        }
      } catch (error) {
        console.log(error)
        setDataNXT([])
        setTableLoad(false)
      }
    }
    if (searchHangHoa || isLoading) {
      getDataNXTFirst()
    }
  }, [searchHangHoa, isLoading])

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
        const response = await categoryAPI.QuyenHan('TruyVan_CanDoiNXT_TheoKho', TokenAccess)
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
    const getListNhomHangNXT = async () => {
      try {
        const response = await categoryAPI.ListNhomHangNXT(TokenAccess)
        if (response.data.DataError == 0) {
          setNhomHangNXT(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListNhomHangNXT()
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
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHangHoaNXT()
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
    const getListKhoNXT = async () => {
      try {
        const response = await categoryAPI.ListKhoHangNXT(TokenAccess)
        if (response.data.DataError == 0) {
          setKhoHangNXT(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListKhoNXT()
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
      getListKhoNXT()
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
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setcheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataNXT ? dataNXT[0] : [] || []).filter((key) => key !== 'MaNhomHang' && key !== 'MaKho')
    setOptions(key)
  }, [selectVisible])

  const getDataNXT = async () => {
    try {
      const response = await categoryAPI.InfoNXTTheoKho(
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
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataNXT()
      } else {
        setDataNXT([])
        setTableLoad(false)
      }
    } catch (error) {
      console.log(error)
      setDataNXT([])
      setTableLoad(false)
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
      const response = await categoryAPI.InfoNXTTheoKho_DVTQD(
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
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataNXT_DVTQD()
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
    setTableLoad(true)
    clearTimeout(timerId)
    setTableLoad(true)
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
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
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
      title: 'Nhóm',
      dataIndex: 'TenNhomHang',
      key: 'TenNhomHang',
      width: 150,
      sorter: (a, b) => a.TenNhomHang.localeCompare(b.TenNhomHang),
      showSorterTooltip: false,
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
      title: 'Tên Kho',
      dataIndex: 'TenKho',
      key: 'TenKho',
      width: 150,
      sorter: (a, b) => a.TenKho.localeCompare(b.TenKho),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Tồn đầu',
      dataIndex: 'SoLuongTonDK',
      key: 'SoLuongTonDK',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTonDK - b.SoLuongTonDK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Mua hàng',
      dataIndex: 'SoLuongNhap_PMH',
      key: 'SoLuongNhap_PMH',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_PMH - b.SoLuongNhap_PMH,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trả hàng',
      dataIndex: 'SoLuongNhap_NTR',
      key: 'SoLuongNhap_NTR',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_NTR - b.SoLuongNhap_NTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Chuyển kho',
      dataIndex: 'SoLuongNhap_NCK',
      key: 'SoLuongNhap_NCK',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_NCK - b.SoLuongNhap_NCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Điều chỉnh',
      dataIndex: 'SoLuongNhap_NDC',
      key: 'SoLuongNhap_NDC',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap_NDC - b.SoLuongNhap_NDC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tổng nhập',
      dataIndex: 'SoLuongNhap',
      key: 'SoLuongNhap',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongNhap - b.SoLuongNhap,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Bán sỉ',
      dataIndex: 'SoLuongXuat_PBS',
      key: 'SoLuongXuat_PBS',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_PBS - b.SoLuongXuat_PBS,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Bán lẻ',
      dataIndex: 'SoLuongXuat_PBL',
      key: 'SoLuongXuat_PBL',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_PBL - b.SoLuongXuat_PBL,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Bán lẻ (Quầy)',
      dataIndex: 'SoLuongXuat_PBQ',
      key: 'SoLuongXuat_PBQ',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_PBQ - b.SoLuongXuat_PBQ,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trả hàng',
      dataIndex: 'SoLuongXuat_XTR',
      key: 'SoLuongXuat_XTR',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XTR - b.SoLuongXuat_XTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Sử dụng',
      dataIndex: 'SoLuongXuat_XSD',
      key: 'SoLuongXuat_XSD',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XSD - b.SoLuongXuat_XSD,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Hủy',
      dataIndex: 'SoLuongXuat_HUY',
      key: 'SoLuongXuat_HUY',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_HUY - b.SoLuongXuat_HUY,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Điều chỉnh',
      dataIndex: 'SoLuongXuat_XDC',
      key: 'SoLuongXuat_XDC',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XDC - b.SoLuongXuat_XDC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Chuyển kho',
      dataIndex: 'SoLuongXuat_XCK',
      key: 'SoLuongXuat_XCK',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat_XCK - b.SoLuongXuat_XCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tổng xuất',
      dataIndex: 'SoLuongXuat',
      key: 'SoLuongXuat',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongXuat - b.SoLuongXuat,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tồn Cuối',
      dataIndex: 'SoLuongTonCK',
      fixed: 'right',
      key: 'SoLuongTonCK',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTonCK - b.SoLuongTonCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
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
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center ">
                    <div className="flex items-center gap-2 py-1">
                      <h1 className="text-lg font-bold text-black-600 uppercase">Nhập Xuất Tồn - Theo Kho</h1>
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
                    <div
                      className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  "
                      onClick={() => setIsShowOption(!isShowOption)}
                      title="Chức năng khác"
                    >
                      <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                    </div>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-200 px-2 py-3 items-center top-16 right-[4.5%] rounded-lg z-10 duration-500 shadow-custom  ">
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
                                  width: '350px',
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
                                          {nameColumsNhapXuatTon_TheoKho[item]}
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
                          >
                            {nhomHangNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                  <p className="truncate">{item.ThongTinNhomHang}</p>
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
                            value={selectedNhomTo}
                            placeholder="Chọn nhóm"
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
                          >
                            {nhomHangNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                  <p className="truncate">{item.ThongTinNhomHang}</p>
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
                          >
                            {hangHoaNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                  <p className="truncate">
                                    {item.MaHang} - {item.TenHang}
                                  </p>
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
                          >
                            {hangHoaNXT?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                  <p className="truncate">
                                    {item.MaHang} - {item.TenHang}
                                  </p>
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
                                  <p className="truncate">
                                    {item.MaHang} - {item.TenHang}
                                  </p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end ">
                    <Select
                      showSearch
                      allowClear
                      size="small"
                      placeholder="Lọc Kho"
                      value={selectedMaKho}
                      onChange={(value) => setSelectedMaKho(value)}
                      style={{
                        width: '160px',
                      }}
                    >
                      {khoHangNXT?.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.MaKho} title={item.TenKho} className="py-8">
                            <p> {item.ThongTinKho}</p>
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="NhapXuatTonKho" id="my-table">
                <Table
                  loading={tableLoad}
                  className="setHeight"
                  columns={newTitles}
                  dataSource={filteredHangHoa.filter((item) => (selectedMaKho ? item.MaKho === selectedMaKho : true)).map((item, index) => ({ ...item, key: index }))}
                  size="small"
                  scroll={{
                    x: 3300,
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
                  bordered
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
                              return (
                                <Table.Summary.Cell key={`summary-cell-${index + 1}`} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                  {isNumericColumn ? (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                        maximumFractionDigits: dataThongSo.SOLESOLUONG,
                                      })}
                                    </Text>
                                  ) : column.dataIndex == 'STT' ? (
                                    <Text className="text-center" strong>
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

export default NhapXuatTonKho
