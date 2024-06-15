import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input, Select } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import { ModalTL, PermissionView } from '../../components_K'
import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN, addRowClass, formatCurrency } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearchHH } from '../../components_K/myComponents/useSearchHH'
import { Segmented } from 'antd'
const { Option } = Select
const { Text } = Typography
const { IoAddCircleOutline, TiPrinter, MdDelete, BsSearch, TfiMoreAlt, MdEdit, FaEyeSlash, RiFileExcel2Fill, MdFilterAlt, BsWrenchAdjustableCircle } = icons
const GBL = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)

  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [showFull, setShowFull] = useState('Hiện hành')
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])
  const [dataFull, setDataFull] = useState([])
  const [dataThongTin, setDataThongTin] = useState({})
  const [dataRecord, setDataRecord] = useState(null)
  const [dataHangHoa, setDataHangHoa] = useState(null)
  const [dataMaHang, setDataMaHang] = useState([])
  const [dataNhomGia, setDataNhomGia] = useState([])
  const [actionType, setActionType] = useState('')
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchGBL, filteredGBL, searchGBL] = useSearchHH(showFull === 'Hiện hành' ? data : dataFull)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [hasCalledApis, setHasCalledApis] = useState(false)
  const [valueList, setValueList] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [isChanging, setIsChanging] = useState(false)
  const [doneGBL, setDoneGBL] = useState([])

  const [formFilter, setFormFilter] = useState({
    CodeValue1From: null,
    CodeValue1To: null,
  })

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

  // hide Columns
  useEffect(() => {
    setNewColumns(columns)
    // Lấy thông tin từ local storage sau khi đăng nhập
    const storedHiddenColumns = localStorage.getItem('hiddenColumnGBL')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hiddenColumnGBL')))
      setNewColumns(JSON.parse(localStorage.getItem('hiddenColumnGBL')))
    }
  }, [confirmed])

  // data DS adjustPrice
  useEffect(() => {
    const selectedRowObjs = selectedRowKeys.map((key) => {
      const [Ma] = key.split('/')
      return { Ma }
    })
    setDataMaHang(selectedRowObjs)
  }, [selectedRowKeys])

  // default showFull
  useEffect(() => {
    if (formFilter.CodeValue1From === undefined || formFilter.CodeValue1To === undefined) {
      setFormFilter({ CodeValue1From: null, CodeValue1To: null })
    }
  }, [formFilter])

  // get helper
  useEffect(() => {
    setIsLoadingModal(true)
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'create' || actionType === 'print' || actionType === 'import') {
          const responseKH = await apis.ListHelperHHGBL(tokenLogin)
          if (responseKH.data && responseKH.data.DataError === 0) {
            setDataHangHoa(responseKH.data.DataResults)
            setIsLoadingModal(false)
          } else if (responseKH.data.DataError === -1 || responseKH.data.DataError === -2 || responseKH.data.DataError === -3) {
            toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{responseKH.data.DataErrorDescription}</div>, { autoClose: 2000 })
            setIsLoadingModal(false)
          } else if (responseKH.data.DataError === -107 || responseKH.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseKH.data.DataErrorDescription, { autoClose: 2000 })
            setIsLoadingModal(false)
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        setIsLoadingModal(false)
      }
    }
    if (isShowModal) {
      fetchData()
    }
  }, [isShowModal])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        console.log('get helper  KH,DT')
        const response = await apis.ListHelperNhomGiaGBL(tokenLogin)
        if (response.data && response.data.DataError === 0) {
          setDataNhomGia(response.data.DataResults)
        } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if (response.data.DataError === -107 || response.data.DataError === -108) {
          await RETOKEN()
          fetchData()
        } else {
          toast.error(response.data.DataErrorDescription, { autoClose: 2000 })
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
      }
    }
    fetchData()
  }, [])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'ThietLap_GiaLe')

        if (response.data && response.data.DataError === 0) {
          setDataQuyenHan(response.data)
        }
        // else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        //   toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        // }
        else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getChucNangQuyenHan()
        }
        // else {
        //   toast.error(response.data.DataErrorDescription)
        // }
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

  //get DSGBL
  useEffect(() => {
    const callApis = () => {
      if (dataQuyenHan?.VIEW && !hasCalledApis) {
        getDSandDSFull()
        setHasCalledApis(true)
      } else if (tableLoad && dataQuyenHan?.VIEW) {
        if (showFull === 'Tất cả') {
          getDSFullGBL()
        } else {
          getDSGBL()
        }
      }
    }

    callApis()

    // if (tableLoad && dataQuyenHan?.VIEW) {
    //   if (isShowFull) {
    //     getDSFullGBL()
    //   } else {
    //     getDSGBL()
    //   }
    // }
  }, [tableLoad, dataQuyenHan?.VIEW])

  const getDSGBL = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DanhSachGBL(tokenLogin, { ...formFilter, CodeValue1List: valueList.join(',') })

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSGBL()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>, { autoClose: 2000 })
        setTableLoad(false)
      } else {
        setData([])
        setTableLoad(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(false)
    }
  }
  const getDSFullGBL = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachFullGBL(tokenLogin, { ...formFilter, CodeValue1List: valueList.join(',') })

      if (response.data && response.data.DataError === 0) {
        setDataFull(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSFullGBL()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>, { autoClose: 2000 })
        setTableLoad(false)
      } else {
        setDataFull([])
        setTableLoad(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(false)
    }
  }

  const getDSandDSFull = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachGBL(tokenLogin, formFilter)
      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSandDSFull()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>, { autoClose: 2000 })
        setTableLoad(false)
      } else {
        setData([])
        setTableLoad(false)
      }

      const responseFull = await apis.DanhSachFullGBL(tokenLogin, formFilter)

      if (responseFull.data && responseFull.data.DataError === 0) {
        setDataFull(responseFull.data.DataResults)
      } else if ((responseFull.data && responseFull.data.DataError === -107) || (responseFull.data && responseFull.data.DataError === -108)) {
        await RETOKEN()
        getDSandDSFull()
      } else if (
        (responseFull.data && responseFull.data.DataError === -1) ||
        (responseFull.data && responseFull.data.DataError === -2) ||
        (responseFull.data && responseFull.data.DataError === -3)
      ) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{responseFull.data.DataErrorDescription}</div>, { autoClose: 2000 })
      } else {
        toast.error(responseFull.data.DataErrorDescription, { autoClose: 2000 })
        setDataFull([])
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
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
      title: 'Nhóm hàng',
      dataIndex: 'ThongTinNhom',
      key: 'ThongTinNhom',
      width: 250,
      fixed: 'left',
      sorter: (a, b) => a.ThongTinNhom.localeCompare(b.ThongTinNhom),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchGBL} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchGBL} />
        </div>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchGBL} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 100,
      align: 'center',
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchGBL} />
        </div>
      ),
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
    },
    {
      title: 'Mã vạch',
      dataIndex: 'MaVach',
      key: 'MaVach',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchGBL} />
        </div>
      ),

      sorter: (a, b) => {
        return a.MaVach - b.MaVach
      },
      showSorterTooltip: false,
    },
    {
      title: 'Kể từ ngày',
      dataIndex: 'HieuLucTu',
      key: 'HieuLucTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchGBL} />,
      width: 120,
      sorter: (a, b) => {
        const dateA = new Date(a.HieuLucTu)
        const dateB = new Date(b.HieuLucTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Giá bán lẻ',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.DonGia - b.DonGia,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatCurrency(text)} search={searchGBL} />
        </div>
      ),
    },
    {
      title: 'Đã có thuế',
      key: 'CoThue',
      dataIndex: 'CoThue',
      width: 120,
      align: 'center',
      render: (text) => <Checkbox value={text} disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.CoThue ? 1 : 0
        const valueB = b.CoThue ? 1 : 0
        return valueA - valueB
      },
      showSorterTooltip: false,
    },

    {
      title: '% Thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 120,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatCurrency(text)} search={searchGBL} />
        </div>
      ),
      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      showSorterTooltip: false,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY hh:mm:ss')} search={searchGBL} />,
      width: 200,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 250,
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate ">
          <HighlightedCell text={text} search={searchGBL} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null} search={searchGBL} />,
      width: 200,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Người sửa cuối',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      width: 250,
      sorter: (a, b) => {
        const NguoiSuaCuoiA = a.NguoiSuaCuoi || ''
        const NguoiSuaCuoiB = b.NguoiSuaCuoi || ''

        return NguoiSuaCuoiA.localeCompare(NguoiSuaCuoiB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate ">
          <HighlightedCell text={text} search={searchGBL} />
        </div>
      ),
    },

    {
      title: 'Chức năng',
      key: 'ChucNang',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center  ">
              <Tooltip title="Sửa" color="blue">
                <div
                  onClick={() => (dataQuyenHan?.EDIT ? handleEdit(record) : '')}
                  className={`p-[3px] border-2 rounded-md text-slate-50 ${
                    dataQuyenHan?.EDIT ? 'border-yellow-400 bg-yellow-400 hover:bg-white hover:text-yellow-400 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                  } `}
                >
                  <MdEdit size={16} />
                </div>
              </Tooltip>
              <Tooltip title="Xóa" color="blue">
                <div
                  onClick={() => (dataQuyenHan?.DEL ? handleDelete(record) : '')}
                  className={`p-[3px] border-2 rounded-md text-slate-50 ${
                    dataQuyenHan?.DEL ? 'border-red-500 bg-red-500 hover:bg-white hover:text-red-500 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                  } `}
                >
                  <MdDelete size={16} />
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

  const handleView = (record) => {
    setActionType('view')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleEdit = (record) => {
    setActionType('edit')
    setDataRecord(record)
    setDataThongTin(record)
    setIsShowModal(true)
  }

  const handleCreate = () => {
    setActionType('create')
    setIsShowModal(true)
  }
  const handlePrint = () => {
    setActionType('print')
    setIsShowModal(true)
  }
  const handleAdjustPrice = () => {
    if (!selectedRowKeys.length > 0) {
      toast.warning('Hãy chọn mã hàng để điều chỉnh giá !', {
        autoClose: 1500,
      })
      return
    } else {
      setActionType('adjustPrice')
      setIsShowModal(true)
    }
  }
  const handleImport = () => {
    setActionType('import')
    setIsShowModal(true)
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchGBL(newSearch)
    }
  }
  const handleFilterDS = () => {
    setTableLoad(true)
  }
  const handleFromChange = (value) => {
    const valueCheck = dataNhomGia?.findIndex((item) => item.Ma === value) > dataNhomGia.findIndex((item) => item.Ma === formFilter?.CodeValue1To)

    if (formFilter.CodeValue1To === null || valueCheck) {
      setFormFilter({ CodeValue1From: value, CodeValue1To: value })
    } else {
      setFormFilter({ ...formFilter, CodeValue1From: value })
    }
  }
  const handleToChange = (value) => {
    const valueCheck = dataNhomGia?.findIndex((item) => item.Ma === value) < dataNhomGia.findIndex((item) => item.Ma === formFilter?.CodeValue1From)

    if (formFilter.CodeValue1From === null || valueCheck) {
      setFormFilter({ CodeValue1From: value, CodeValue1To: value })
    } else {
      setFormFilter({ ...formFilter, CodeValue1To: value })
    }
  }

  const handleRowClick = (record) => {
    setDoneGBL([])
    const selectedKey = `${record.MaHang}/${record.HieuLucTu}`
    const isSelected = selectedRowKeys.includes(selectedKey)
    const newSelectedRowKeys = isSelected ? selectedRowKeys.filter((key) => key !== selectedKey) : [...selectedRowKeys, selectedKey]
    setSelectedRowKeys(newSelectedRowKeys)
  }

  return (
    <>
      {dataQuyenHan?.VIEW === false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          <div className="w-auto">
            <div className="relative text-lg flex justify-between items-center mb-1">
              <div className="flex items-center gap-x-4 font-bold">
                <h1 className="text-xl uppercase">Bảng giá bán lẻ</h1>
                <div>
                  <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
              </div>
              <div className="flex  ">
                {isShowSearch && (
                  <div className={`flex absolute left-[14rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
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
                        onClick={handlePrint}
                        className="flex items-center py-1 px-2 rounded-md border-2 border-purple-500  text-slate-50 text-base bg-purple-500 hover:bg-white hover:text-purple-500 "
                      >
                        <div className="pr-1">
                          <TiPrinter size={20} />
                        </div>
                        <div>In bảng giá</div>
                      </button>
                      <button
                        onClick={handleImport}
                        className="flex items-center py-1 px-2 rounded-md text-slate-50 text-base border-2
                           border-green-500  bg-green-500 hover:bg-white hover:text-green-500"
                      >
                        <div className="pr-1">
                          <RiFileExcel2Fill size={20} />
                        </div>
                        <div>Import</div>
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
                              width: '470px',
                              background: 'white',
                              padding: 10,
                              borderRadius: 10,
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            }}
                            className="flex flex-col"
                            defaultValue={checkedList}
                            onChange={(value) => {
                              setCheckedList(value)
                              localStorage.setItem('hiddenColumnGBL', JSON.stringify(value))
                            }}
                          >
                            <Row>
                              {options.map((item) => (
                                <Col span={8} key={item.value}>
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
            <div className="flex justify-between items-center px-2 pb-1">
              <div className="flex flex-col gap-1 ">
                <div className="flex  gap-1">
                  <div className="flex gap-1 items-center">
                    <div className="w-[42px] text-end">Nhóm</div>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      size="small"
                      allowClear
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1From}
                      onChange={handleFromChange}
                      style={{
                        width: '12vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                      optionLabelProp="value"
                    >
                      {dataNhomGia?.map((item) => (
                        <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className=" text-center">Đến</div>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      allowClear
                      size="small"
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1To}
                      onChange={handleToChange}
                      style={{
                        width: '12vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                      optionLabelProp="value"
                    >
                      {dataNhomGia?.map((item) => (
                        <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="">
                    <Tooltip title="Xem dữ liệu" color="blue">
                      <div>
                        <ActionButton
                          title={''}
                          handleAction={handleFilterDS}
                          icon={<MdFilterAlt size={14} />}
                          color={'slate-50'}
                          background={'bg-main'}
                          color_hover={'bg-main'}
                          bg_hover={'white'}
                          isModal={true}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex gap-1 ">
                  <div className="w-[42px] text-end">Chọn</div>
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    maxTagCount="responsive"
                    optionFilterProp="children"
                    size="small"
                    placeholder="Chọn nhóm"
                    value={valueList}
                    onChange={(value) => setValueList(value)}
                    className="md:w-[30vw] lg:w-[50vw] truncate"
                    maxTagPlaceholder={(omittedValues) => (
                      <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                        <span>+{omittedValues?.length}...</span>
                      </Tooltip>
                    )}
                  >
                    {dataNhomGia?.map((item) => (
                      <Option key={item.Ma} value={item.Ma}>
                        <p className="truncate">
                          {item.Ma} - {item.Ten}
                        </p>
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Segmented
                  options={['Hiện hành', 'Tất cả']}
                  value={showFull}
                  onChange={(value) => {
                    if (!isChanging) {
                      setIsChanging(true)
                      setShowFull(value)
                      setTableLoad(true)
                      setTimeout(() => {
                        setIsChanging(false)
                      }, 1000)
                    }
                  }}
                />
                <ActionButton
                  color={'slate-50'}
                  title={'Điều chỉnh giá'}
                  icon={<BsWrenchAdjustableCircle size={20} />}
                  bg_hover={'white'}
                  background={'bg-main'}
                  color_hover={'bg-main'}
                  handleAction={handleAdjustPrice}
                  isModal={true}
                />
                <ActionButton
                  color={'slate-50'}
                  title={'Thêm'}
                  icon={<IoAddCircleOutline size={20} />}
                  bg_hover={!dataQuyenHan?.ADD ? '' : 'white'}
                  background={!dataQuyenHan?.ADD ? 'gray-400' : 'bg-main'}
                  color_hover={!dataQuyenHan?.ADD ? '' : 'bg-main'}
                  handleAction={() => (!dataQuyenHan?.ADD ? '' : handleCreate())}
                  isPermission={dataQuyenHan?.ADD}
                  isModal={true}
                />
              </div>
            </div>

            <div id="my-table" className="relative px-2 py-1 ">
              <Table
                loading={tableLoad}
                className="GBL"
                columns={newColumnsHide}
                dataSource={filteredGBL}
                size="small"
                rowSelection={{
                  selectedRowKeys,
                  onChange: (selectedKeys) => {
                    setSelectedRowKeys(selectedKeys)
                  },
                }}
                scroll={{
                  x: 1500,
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
                rowClassName={(record, index) => (`${record.MaHang}/${record.HieuLucTu}` === doneGBL ? 'highlighted-row' : addRowClass(record, index))}
                rowKey={(record) => `${record.MaHang}/${record.HieuLucTu}`}
                onRow={(record) => ({
                  onClick: () => {
                    handleRowClick(record)
                  },
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                // Bảng Tổng
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} key="summary-cell-0" className=""></Table.Summary.Cell>
                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column, index) => {
                            const isNumericColumn = typeof filteredGBL[0]?.[column.dataIndex] === 'number'
                            return (
                              <Table.Summary.Cell
                                index={index + 1}
                                key={`summary-cell-${index}`}
                                align={isNumericColumn ? 'right' : 'left'}
                                className="text-end font-bold  bg-[#f1f1f1] "
                              >
                                {column.dataIndex === 'STT' ? (
                                  <Text className="text-center flex justify-center text-white" strong>
                                    {showFull === 'Hiện hành' ? data.length : dataFull.length}
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
              <ModalTL
                namePage={'Bảng Giá Bán Lẻ'}
                typePage={'GBL'}
                close={() => setIsShowModal(false)}
                actionType={actionType}
                dataRecord={dataRecord}
                dataThongTin={dataThongTin}
                dataHangHoa={dataHangHoa}
                dataMaHang={dataMaHang}
                data={dataFull}
                dataNhomGia={dataNhomGia}
                isLoadingModal={isLoadingModal}
                dataThongSo={dataThongSo}
                loading={() => setTableLoad(true)}
                setHightLight={setDoneGBL}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default GBL
