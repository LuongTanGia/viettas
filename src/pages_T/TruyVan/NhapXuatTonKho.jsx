/* eslint-disable react-hooks/exhaustive-deps */
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components_T/hooks/Search'
import { FaSearch } from 'react-icons/fa'
import { useEffect, useState, useRef } from 'react'
import { Table, Select, Tooltip } from 'antd'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MdFilterListAlt } from 'react-icons/md'
import { RETOKEN } from '../../action/Actions'
import ActionButton from '../../components/util/Button/ActionButton'
import HighlightedCell from '../../components_T/hooks/HighlightedCell'

const NhapXuatTonKho = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataNXT, setDataNXT] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataNXT)
  const [isShowSearch, setIsShowSearch] = useState(false)
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
  const [dataThongSo, setDataThongSo] = useState('')
  const showOption = useRef(null)

  useEffect(() => {
    getListNhomHangNXT()
    getListHangHoaNXT()
    getListKhoNXT()
    getTimeSetting()
    getDataNXTFirst()
    getThongSo()
  }, [isLoading])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOption.current && !showOption.current.contains(event.target)) {
        setIsShowSearch(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const getDataNXTFirst = async () => {
    try {
      if (isLoading == true) {
        const response = await categoryAPI.InfoNXTTheoKho(
          {
            NgayBatDau: khoanNgayFrom,
            NgayKetThuc: khoanNgayTo,
          },
          TokenAccess,
        )
        if (response.data.DataError == 0) {
          setDataNXT(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataNXTFirst()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getDataNXT = async (e) => {
    e.preventDefault()
    try {
      const response = await categoryAPI.InfoNXTTheoKho(
        {
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayTo,
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
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setDataNXT(response.data.DataResults)
        setIsLoading(true)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataNXT()
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
        setIsLoading(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getListNhomHangNXT = async () => {
    try {
      const response = await categoryAPI.ListNhomHangNXT(TokenAccess)
      if (response.data.DataError == 0) {
        setNhomHangNXT(response.data.DataResults)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getListNhomHangNXT()
      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getListHangHoaNXT = async () => {
    try {
      const response = await categoryAPI.ListHangHoaNXT(TokenAccess)
      if (response.data.DataError == 0) {
        setHangHoaNXT(response.data.DataResults)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getListHangHoaNXT()
      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getListKhoNXT = async () => {
    try {
      const response = await categoryAPI.ListKhoHangNXT(TokenAccess)
      if (response.data.DataError == 0) {
        setKhoHangNXT(response.data.DataResults)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getListKhoNXT()
      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getTimeSetting = async () => {
    try {
      const response = await categoryAPI.KhoanNgay(TokenAccess)
      if (response.data.DataError == 0) {
        setKhoanNgayFrom(response.data.NgayBatDau)
        setKhoanNgayTo(response.data.NgayKetThuc)
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
  const getThongSo = async () => {
    try {
      const response = await categoryAPI.ThongSo(TokenAccess)
      if (response.data.DataError == 0) {
        setDataThongSo(response.data.DataResult)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getThongSo()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value)
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

  const titles = [
    {
      title: 'STT',
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
        <Tooltip title={text}>
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
        <Tooltip title={text}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Chuyển kho',
      dataIndex: 'SoLuongNhap_NCK',
      key: 'SoLuongTonCK',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTonCK - b.SoLuongTonCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Chuyển kho',
      dataIndex: 'SoLuongXuat_XCK',
      key: 'SoLuongTonCK',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTonCK - b.SoLuongTonCK,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </div>
      ),
    },
  ]

  return (
    <>
      {!isLoading ? (
        <p>Loading</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex relative" ref={showOption}>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-black-600 uppercase">Nhập Xuất Tồn - Theo Kho</h1>
                <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
              </div>
              <div className="flex ">
                {isShowSearch && (
                  <div className={`flex absolute left-[18.5rem] -top-1.5 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                    <input
                      value={searchHangHoa}
                      type="text"
                      placeholder="Nhập tên bạn cần tìm"
                      onChange={handleSearch}
                      className={
                        'px-2 py-1 w-[20rem] border-slate-200 resize-none rounded-[0.5rem] border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis '
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <form className="flex gap-2 justify-center items-center" onSubmit={getDataNXT}>
                <div className="flex flex-col gap-2 justify-end content-end">
                  <div className="flex gap-1">
                    <div className="flex items-center gap-1">
                      <label>Từ</label>
                      <DatePicker
                        showSearch
                        className="DatePicker_NXTKho"
                        format="DD/MM/YYYY"
                        maxDate={dayjs(khoanNgayTo)}
                        defaultValue={dayjs(khoanNgayFrom, 'YYYY-MM-DD')}
                        onChange={(values) => {
                          setKhoanNgayFrom(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                        }}
                      />
                    </div>
                    <div className=" flex items-center gap-1 ">
                      <label>-</label>
                      <DatePicker
                        className="DatePicker_NXTKho"
                        format="DD/MM/YYYY"
                        minDate={dayjs(khoanNgayFrom)}
                        defaultValue={dayjs(khoanNgayTo, 'YYYY-MM-DD')}
                        onChange={(values) => {
                          setKhoanNgayTo(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      showSearch
                      allowClear
                      placeholder="Lọc Kho"
                      value={selectedMaKho}
                      onChange={(value) => setSelectedMaKho(value)}
                      style={{
                        width: '170px',
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
                <div className=" flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                      <div>Từ</div>
                      <Select
                        showSearch
                        allowClear
                        placeholder="Chọn nhóm"
                        value={selectedNhomFrom}
                        disabled={selectedMaFrom?.length > 0 || selectedMaTo?.length > 0 || selectedMaList?.length > 0}
                        onChange={(value) => setSelectedNhomFrom(value)}
                        style={{
                          width: '180px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {nhomHangNXT?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                              <p className="truncate">{item.Ma}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div> Tới</div>
                      <Select
                        showSearch
                        allowClear
                        placeholder="Chọn nhóm"
                        disabled={selectedMaFrom?.length > 0 || selectedMaTo?.length > 0 || selectedMaList?.length > 0}
                        value={selectedNhomTo}
                        onChange={(value) => setSelectedNhomTo(value)}
                        style={{
                          width: '180px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {nhomHangNXT?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                              <p className="truncate">{item.Ma}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div>Gộp</div>
                      <Select
                        mode="multiple"
                        maxTagCount={2}
                        filterOption
                        placeholder="Danh sách nhóm"
                        disabled={selectedMaFrom?.length > 0 || selectedMaTo?.length > 0 || selectedMaList?.length > 0}
                        value={selectedNhomList}
                        onChange={(value) => setSelectedNhomList(value)}
                        style={{
                          width: '380px',
                        }}
                      >
                        {nhomHangNXT?.map((item) => {
                          return (
                            <Select.Option key={item.Ma} value={item.Ma} title={item.ThongTinNhomHang}>
                              <p className="truncate">{item.Ma}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                      <div>Từ</div>
                      <Select
                        allowClear
                        showSearch
                        placeholder="Chọn mã hàng"
                        disabled={selectedNhomFrom?.length > 0 || selectedNhomTo?.length > 0 || selectedNhomList?.length > 0}
                        value={selectedMaFrom}
                        onChange={(value) => setSelectedMaFrom(value)}
                        style={{
                          width: '180px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {hangHoaNXT?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                              <p className="truncate">{item.MaHang}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div>Tới</div>
                      <Select
                        allowClear
                        showSearch
                        disabled={selectedNhomFrom?.length > 0 || selectedNhomTo?.length > 0 || selectedNhomList?.length > 0}
                        placeholder="Chọn mã hàng"
                        value={selectedMaTo}
                        onChange={(value) => setSelectedMaTo(value)}
                        style={{
                          width: '180px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {hangHoaNXT?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                              <p className="truncate">{item.MaHang}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <div>Gộp</div>
                      <Select
                        mode="multiple"
                        maxTagCount={2}
                        allowClear
                        disabled={selectedNhomFrom?.length > 0 || selectedNhomTo?.length > 0 || selectedNhomList?.length > 0}
                        filterOption
                        value={selectedMaList}
                        onChange={(value) => setSelectedMaList(value)}
                        placeholder="Chọn mã hàng"
                        style={{
                          width: '380px',
                        }}
                      >
                        {hangHoaNXT?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                              <p className="truncate">{item.MaHang}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                  </div>
                </div>
                <ActionButton
                  type="submit"
                  title={'Lọc'}
                  icon={<MdFilterListAlt className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
              </form>
            </div>
          </div>
          <div>
            <Table
              className="table_TXNhapXuatTonKho setHeight"
              columns={titles}
              dataSource={filteredHangHoa.filter((item) => (selectedMaKho ? item.MaKho === selectedMaKho : true))}
              size="small"
              scroll={{
                x: 3300,
                y: 300,
              }}
              pagination={{ defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '1000'] }}
              bordered
              style={{
                whiteSpace: 'nowrap',
                fontSize: '24px',
                borderRadius: '10px',
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default NhapXuatTonKho
