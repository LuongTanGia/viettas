/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { Select, Tooltip, Typography, Checkbox, Row, Button, Col, Spin, Input, Empty, Table, Segmented } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import { TbEye } from 'react-icons/tb'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { CloseSquareFilled } from '@ant-design/icons'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, addRowClass, exportToExcel } from '../../action/Actions'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsDSBHKHO } from '../../components/util/Table/ColumnName'
import { DateField } from '@mui/x-date-pickers'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { PermissionView } from '../../components_K'
const DoanhSoBanHangKho = () => {
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
  const [checkedList, setCheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [tableLoad, setTableLoad] = useState(true)
  const [dataCRUD, setDataCRUD] = useState()
  const [dateData, setDateData] = useState({})
  const [dateChange, setDateChange] = useState(false)
  const [dataKhoHang, setDataKhoHang] = useState(null)
  const [check, setCheck] = useState('Tiền hàng')
  const [valueCheck, setValueCheck] = useState(null)

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
    selectedMaFrom == null ? setSelectedMaTo(null) : ''
    selectedNhomFrom == null ? setSelectedNhomTo(null) : ''
  }, [selectedMaFrom, selectedNhomFrom])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('TruyVan_DoanhSoBanHangKhoHang', TokenAccess)
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
        } else {
          setNhomHangNXT([])
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
          setHangHoaNXT([])
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
          setKhoanNgayFrom(dayjs(response.data.NgayBatDau))
          setKhoanNgayTo(dayjs(response.data.NgayKetThuc))
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
    const getDataNXTFirst = async () => {
      try {
        if (isLoading == true) {
          setTableLoad(true)
          const response = await categoryAPI.InfoDSBHKHO(
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
          } else if ((response.data && response.data.DataError == -107) || (response.data && response.data.DataError == -108)) {
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
      }
    }
    getDataNXTFirst()
  }, [searchHangHoa, isLoading])

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const ColKey = filteredHangHoa && filteredHangHoa[0] && Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_`))
    const key = Object.keys(dataNXT[0] || []).filter((key) => !ColKey.includes(key))
    setOptions(key)
  }, [selectVisible])

  const getDataNXT = async () => {
    try {
      const response = await categoryAPI.InfoDSBHKHO(
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
  useEffect(() => {
    const getListKhoNXT = async () => {
      try {
        const response = await categoryAPI.ListKhoHangNXT(TokenAccess)
        if (response.data.DataError == 0) {
          setDataKhoHang(response.data.DataResults)
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
      getListKhoNXT()
    }
  }, [isLoading])

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
  useEffect(() => {
    if (check) {
      if (check == 'Tiền hàng') {
        setValueCheck('TienHang')
      } else if (check == 'Tiền ttimerIdhuế') {
        setValueCheck('TienThue')
      } else if (check == 'Thành tiền') {
        setValueCheck('ThanhTien')
      } else if (check == 'Chiết khấu') {
        setValueCheck('ChietKhau')
      } else if (check == 'Tổng cộng') {
        setValueCheck('TongCong')
      }
    }
  }, [check])

  const dynamicColumns = () => {
    const maKho = dataKhoHang && dataKhoHang.map((item) => item.MaKho)
    return filteredHangHoa && filteredHangHoa?.length > 0
      ? maKho.reduce((columns, ma) => {
          const leColKey = Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_${ma}_Le_`))
          const siColKey = Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_${ma}_Si_`))
          const tienColKey =
            filteredHangHoa &&
            filteredHangHoa[0] &&
            Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_${ma}_`) && item.includes(valueCheck))
          columns.push(
            ...tienColKey
              .filter((key) => leColKey.includes(key))
              .map((colKey) => ({
                title: `Lẻ`,
                dataIndex: colKey,
                key: colKey,
                width: 100,
                align: 'center',
                render: (text) => (
                  <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
                    <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
                  </div>
                ),
                sorter: (a, b) => a[colKey] - b[colKey],
                showSorterTooltip: false,
              })),
            ...tienColKey
              .filter((key) => siColKey.includes(key))
              .map((colKey) => ({
                title: `Sỉ`,
                dataIndex: colKey,
                key: colKey,
                width: 100,
                align: 'center',
                render: (text) => (
                  <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
                    <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
                  </div>
                ),
                sorter: (a, b) => a[colKey] - b[colKey],
                showSorterTooltip: false,
              })),
            ...tienColKey
              .filter((key) => !siColKey.includes(key) && !leColKey.includes(key))
              .map((colKey) => ({
                title: `${check}`,
                dataIndex: colKey,
                key: colKey,
                width: 100,
                ellipsis: true,
                align: 'center',
                render: (text) => (
                  <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
                    <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
                  </div>
                ),
                sorter: (a, b) => a[colKey] - b[colKey],
                showSorterTooltip: false,
              })),
          )
          return columns
        }, [])
      : []
  }
  const dynamicColumnsChildren = () => {
    const maKho = dataKhoHang && dataKhoHang.map((item) => item.MaKho)
    const tenKho = dataKhoHang && dataKhoHang.map((item) => item.TenKho)
    return filteredHangHoa && filteredHangHoa?.length > 0
      ? maKho.reduce((columns, ma) => {
          const leColKey = Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_${ma}_Le_`))
          const siColKey = Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_${ma}_Si_`))
          const tienColKey =
            filteredHangHoa &&
            filteredHangHoa[0] &&
            Object.keys(filteredHangHoa[0]).filter((item) => typeof item == 'string' && item.includes(`Col_${ma}_`) && item.includes(valueCheck))
          const tenKhoMatch = tenKho[maKho.indexOf(ma)]
          columns.push({
            title: `${tenKhoMatch}`,
            ellipsis: true,
            children: [
              ...tienColKey
                .filter((key) => leColKey.includes(key))
                .map((colKey) => ({
                  title: `Lẻ`,
                  dataIndex: colKey,
                  key: colKey,
                  width: 120,
                  align: 'center',
                  render: (text) => (
                    <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
                      <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
                    </div>
                  ),
                  sorter: (a, b) => a[colKey] - b[colKey],
                  showSorterTooltip: false,
                })),
              ...tienColKey
                .filter((key) => siColKey.includes(key))
                .map((colKey) => ({
                  title: `Sỉ`,
                  dataIndex: colKey,
                  key: colKey,
                  width: 120,
                  align: 'center',
                  render: (text) => (
                    <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
                      <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
                    </div>
                  ),
                  sorter: (a, b) => a[colKey] - b[colKey],
                  showSorterTooltip: false,
                })),
              ...tienColKey
                .filter((key) => !siColKey.includes(key) && !leColKey.includes(key))
                .map((colKey) => ({
                  title: `${check}`,
                  dataIndex: colKey,
                  key: colKey,
                  width: 120,
                  align: 'center',
                  render: (text) => (
                    <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
                      <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
                    </div>
                  ),
                  sorter: (a, b) => a[colKey] - b[colKey],
                  showSorterTooltip: false,
                })),
            ],
          })
          return columns
        }, [])
      : []
  }
  const lastCols = () => {
    const lastColumns =
      filteredHangHoa && filteredHangHoa[0] && Object.keys(filteredHangHoa[0]).filter((item) => typeof item === 'string' && !item.startsWith(`Col_`) && item.includes(valueCheck))
    return lastColumns
      ? lastColumns.map((colKey) => ({
          title: `${colKey.includes('Le_') ? 'Lẻ' : colKey.includes('Si_') ? 'Sỉ' : check}`,
          dataIndex: colKey,
          key: colKey,
          width: 120,
          fixed: 'right',
          align: 'center',
          render: (text) => (
            <div className={`text-end ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoa} />
            </div>
          ),
          sorter: (a, b) => a[colKey] - b[colKey],
          showSorterTooltip: false,
        }))
      : []
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
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      fixed: 'left',
      width: 100,
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
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
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
    ...dynamicColumns(),
    ...lastCols(),
  ]
  const titlesChildren = [
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
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      fixed: 'left',
      width: 100,
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
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
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
    ...dynamicColumnsChildren(),
    ...lastCols(),
  ]
  const newTitles = titlesChildren.filter((item) => !hiddenRow?.includes(item.dataIndex))
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
                      <h1 className="text-lg font-bold text-black-600 uppercase">Doanh số bán hàng (Kho Hàng)</h1>
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
                                          {nameColumsDSBHKHO[item]}
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
                            // className="DatePicker_NXTKho  max-w-[120px]"
                            className=" max-w-[115px]"
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
                            className=" max-w-[115px]"
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
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <Segmented
                            options={['Tiền hàng', 'Tiền thuế', 'Thành tiền', 'Chiết khấu', 'Tổng cộng']}
                            value={check}
                            onChange={(value) => {
                              setCheck(value)
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
                            className="md:w-[30vw] lg:w-[40vw] xl:w-[50vw] "
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
                                  {item.MaHang} - {item.TenHang}
                                  <br />
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
              <div className="TruyVan_Child" id="my-table">
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
                  // pagination={{
                  //   defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                  //   showSizeChanger: true,
                  //   pageSizeOptions: ['50', '100', '1000'],
                  //   onShowSizeChange: (current, size) => {
                  //     localStorage.setItem('pageSize', size)
                  //   },
                  // }}
                  pagination={false}
                  scrollToFirstRowOnChange
                  rowClassName={(record, index) => addRowClass(record, index)}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '24px',
                  }}
                  summary={() => {
                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          {titles
                            .filter((column) => column.render)
                            .map((column, index) => {
                              const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] == 'number'
                              const total = Number(filteredHangHoa?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0))

                              return (
                                <Table.Summary.Cell
                                  index={index}
                                  key={`summary-cell-${index + 1}`}
                                  align={isNumericColumn ? 'right' : 'left'}
                                  className="text-end font-bold  bg-[#f1f1f1]"
                                >
                                  {isNumericColumn ? (
                                    <Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : 'text-white'}>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLESOTIEN,
                                        maximumFractionDigits: dataThongSo.SOLESOTIEN,
                                      })}
                                    </Text>
                                  ) : column.dataIndex == 'STT' ? (
                                    <Text className="text-center flex justify-center text-white" strong>
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

export default DoanhSoBanHangKho
