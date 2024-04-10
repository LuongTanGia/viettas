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
import { TbEye } from 'react-icons/tb'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, exportToExcel } from '../../action/Actions'
import ActionButton from '../../components/util/Button/ActionButton'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsCongNoDauVao } from '../../components/util/Table/ColumnName'
import { useNavigate } from 'react-router-dom'
import { DateField } from '@mui/x-date-pickers'
const CongNoDauRa = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataCNDR, setDataCNDR] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataCNDR)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const showOption = useRef(null)
  const [nhomDoiTuongCNDR, setnhomDoiTuongCNDR] = useState([])
  const [khoanNgayFrom, setKhoanNgayFrom] = useState([])
  const [khoanNgayTo, setKhoanNgayTo] = useState([])
  const [selectedNhomFrom, setSelectedNhomFrom] = useState(null)
  const [selectedNhomTo, setSelectedNhomTo] = useState(null)
  const [selectedNhomList, setSelectedNhomList] = useState([])
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
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataCNDR ? dataCNDR[0] : [] || []).filter((key) => key)
    setOptions(key)
  }, [selectVisible])

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
    const ListNhomDoiTuongCNDR = async () => {
      try {
        const response = await categoryAPI.ListNhomDoiTuong_CNDR(TokenAccess)
        if (response.data.DataError == 0) {
          setnhomDoiTuongCNDR(response.data.DataResults)
          setIsLoading(true)
        } else {
          setnhomDoiTuongCNDR([])
          console.log(response.data)
          setIsLoading(true)
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      ListNhomDoiTuongCNDR()
    }
  }, [isLoading])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('TruyVan_CongNoDauRa', TokenAccess)
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
    const getDataCNDRFirst = async () => {
      try {
        if (isLoading === true) {
          setTableLoad(true)
          const response = await categoryAPI.CNDRTongHop(
            dateData == {}
              ? {}
              : {
                  NgayBatDau: dateData.NgayBatDau,
                  NgayKetThuc: dateData.NgayKetThuc,
                },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            setDataCNDR(response.data.DataResults)
            setIsLoading(true)
            setTableLoad(false)
          } else {
            setDataCNDR([])
            console.log(response.data)
            setTableLoad(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDataCNDRFirst()
  }, [searchHangHoa, isLoading])

  useEffect(() => {
    setKhoanNgayFrom(dayjs(dateData?.NgayBatDau))
    setKhoanNgayTo(dayjs(dateData?.NgayKetThuc))
  }, [dateData?.NgayBatDau, dateData?.NgayKetThuc])

  const getDataCNDR = async () => {
    try {
      const response = await categoryAPI.CNDRTongHop(
        {
          NgayBatDau: dateData.NgayBatDau,
          NgayKetThuc: dateData.NgayKetThuc,
          CodeValue1From: selectedNhomFrom,
          CodeValue1To: selectedNhomTo,
          CodeValue1List: selectedNhomList.join(', '),
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        setDataCNDR(response.data.DataResults)
        setTableLoad(false)
      } else if (response.data.DataError == -104) {
        setDataCNDR([])
        setTableLoad(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleFilterDS = () => {
    setTableLoad(true)
    if (!tableLoad) {
      getDataCNDR()
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
      with: 10,
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã Nhà C.Cấp',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      fixed: 'left',
      width: 140,
      align: 'center',
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      render: (text) => (
        <span className=" flex item-start">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      fixed: 'left',
      align: 'center',
      width: 180,
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
      title: 'Địa chỉ',
      dataIndex: 'DiaChiDoiTuong',
      key: 'DiaChiDoiTuong',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DiaChiDoiTuong.localeCompare(b.DiaChiDoiTuong),
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
      title: 'Số dư đầu',
      dataIndex: 'SoDuDK',
      key: 'SoDuDK',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoDuDK - b.SoDuDK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Bán hàng',
      dataIndex: 'PhatSinhNo_PBS',
      key: 'PhatSinhNo_PBS',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.PhatSinhNo_PBS - b.PhatSinhNo_PBS,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Điều chỉnh',
      dataIndex: 'PhatSinhNo_DC',
      key: 'PhatSinhNo_DC',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.PhatSinhNo_DC - b.PhatSinhNo_DC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Chi hàng trả',
      dataIndex: 'PhatSinhNo_Chi_NTR',
      key: 'PhatSinhNo_Chi_NTR',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.PhatSinhNo_Chi_NTR - b.PhatSinhNo_Chi_NTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'PhatSinhNo',
      key: 'PhatSinhNo',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.PhatSinhNo - b.PhatSinhNo,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Thu công nợ',
      dataIndex: 'ThanhToan_Thu_PBS',
      key: 'ThanhToan_Thu_PBS',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.ThanhToan_Thu_PBS - b.ThanhToan_Thu_PBS,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Điều chỉnh',
      dataIndex: 'ThanhToan_DC',
      key: 'ThanhToan_DC',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.ThanhToan_DC - b.ThanhToan_DC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trả hàng',
      dataIndex: 'ThanhToan_NTR',
      key: 'ThanhToan_NTR',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.ThanhToan_NTR - b.ThanhToan_NTR,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'ThanhToan',
      key: 'ThanhToan',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.ThanhToan - b.ThanhToan,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Số dư cuối',
      dataIndex: 'SoDuCK',
      key: 'SoDuCK',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoDuCK - b.SoDuCK,
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
      title: 'Mã Nhà C.Cấp',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      fixed: 'left',
      width: 140,
      align: 'center',
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      render: (text) => (
        <span className=" flex item-start">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      fixed: 'left',
      align: 'center',
      width: 180,
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
      title: 'Địa chỉ',
      dataIndex: 'DiaChiDoiTuong',
      key: 'DiaChiDoiTuong',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DiaChiDoiTuong.localeCompare(b.DiaChiDoiTuong),
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
      title: 'Số dư đầu',
      dataIndex: 'SoDuDK',
      key: 'SoDuDK',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoDuDK - b.SoDuDK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Phát sinh, tăng nợ',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Bán hàng',
          dataIndex: 'PhatSinhNo_PBS',
          key: 'PhatSinhNo_PBS',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.PhatSinhNo_PBS - b.PhatSinhNo_PBS,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Điều chỉnh',
          dataIndex: 'PhatSinhNo_DC',
          key: 'PhatSinhNo_DC',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.PhatSinhNo_DC - b.PhatSinhNo_DC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Chi hàng trả',
          dataIndex: 'PhatSinhNo_Chi_NTR',
          key: 'PhatSinhNo_Chi_NTR',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.PhatSinhNo_Chi_NTR - b.PhatSinhNo_Chi_NTR,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Tổng',
          dataIndex: 'PhatSinhNo',
          key: 'PhatSinhNo',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.PhatSinhNo - b.PhatSinhNo,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Thanh toán, giảm nợ',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Thu công nợ',
          dataIndex: 'ThanhToan_Thu_PBS',
          key: 'ThanhToan_Thu_PBS',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.ThanhToan_Thu_PBS - b.ThanhToan_Thu_PBS,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Điều chỉnh',
          dataIndex: 'ThanhToan_DC',
          key: 'ThanhToan_DC',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.ThanhToan_DC - b.ThanhToan_DC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trả hàng',
          dataIndex: 'ThanhToan_NTR',
          key: 'ThanhToan_NTR',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.ThanhToan_NTR - b.ThanhToan_NTR,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Tổng',
          dataIndex: 'ThanhToan',
          key: 'ThanhToan',
          align: 'center',
          width: 120,
          showSorterTooltip: false,
          sorter: (a, b) => a.ThanhToan - b.ThanhToan,
          render: (text) => (
            <div className={`flex justify-end w-full h-full px-2 ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Số dư cuối',
      dataIndex: 'SoDuCK',
      key: 'SoDuCK',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoDuCK - b.SoDuCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
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
                      <h1 className="text-lg font-bold text-black-600 uppercase">Công Nợ Khách Hàng</h1>
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
                                <Row className="flex">
                                  {options && options.length > 0 ? (
                                    options?.map((item, index) => (
                                      <Col span={10} key={(item, index)}>
                                        <Checkbox value={item} checked={true}>
                                          {nameColumsCongNoDauVao[item]}
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
                      </div>
                    </div>
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
                            if (
                              selectedNhomTo !== null &&
                              nhomDoiTuongCNDR.findIndex((item) => item.Ma === value) > nhomDoiTuongCNDR.findIndex((item) => item.Ma === selectedNhomTo)
                            ) {
                              setSelectedNhomTo(value)
                            }
                          }}
                          style={{
                            width: '12vw',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {nhomDoiTuongCNDR?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomDoiTuong}>
                                <p className="truncate">{item.ThongTinNhomDoiTuong}</p>
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
                            if (
                              selectedNhomFrom !== null &&
                              nhomDoiTuongCNDR.findIndex((item) => item.Ma === value) < nhomDoiTuongCNDR.findIndex((item) => item.Ma === selectedNhomFrom)
                            ) {
                              setSelectedNhomFrom(value)
                            }
                            selectedNhomFrom == null ? setSelectedNhomFrom(value) : ''
                          }}
                          style={{
                            width: '12vw',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {nhomDoiTuongCNDR?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomDoiTuong}>
                                <p className="truncate">{item.ThongTinNhomDoiTuong}</p>
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
                          {nhomDoiTuongCNDR?.map((item) => {
                            return (
                              <Select.Option key={item.Ma} value={item.Ma} title={item.ThongTinNhomDoiTuong}>
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
              <div className="CongNo" id="my-table">
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
                                <Table.Summary.Cell
                                  index={index}
                                  key={`summary-cell-${index + 1}`}
                                  align={isNumericColumn ? 'right' : 'left'}
                                  className="text-end font-bold  bg-[#f1f1f1]"
                                >
                                  {isNumericColumn ? (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                        maximumFractionDigits: dataThongSo.SOLESOLUONG,
                                      })}
                                    </Text>
                                  ) : column.dataIndex == 'STT' ? (
                                    <Text className="text-center flex justify-center" strong>
                                      {dataCNDR?.length}
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

export default CongNoDauRa