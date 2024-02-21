/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import moment from 'moment'
import { toast } from 'react-toastify'
import { CgCloseO } from 'react-icons/cg'
import { CiBarcode } from 'react-icons/ci'
import { TfiMoreAlt } from 'react-icons/tfi'
import { GrStatusUnknown } from 'react-icons/gr'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import { MdEdit, MdDelete, MdOutlineGroupAdd } from 'react-icons/md'
import categoryAPI from '../../API/linkAPI'
import { useSearch } from '../../components/hooks/Search'
import ActionButton from '../../components/util/Button/ActionButton'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsHangHoa } from '../../components/util/Table/ColumnName'
import { RETOKEN, base64ToPDF, exportToExcel } from '../../action/Actions'
import HangHoaModals from '../../components/Modals/DanhMuc/HangHoa/HangHoaModals'

const HangHoa = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataHangHoa, setDataHangHoa] = useState()
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataHangHoa)
  const [isMaHang, setIsMaHang] = useState()
  const [actionType, setActionType] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const showOption = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [targetRow, setTargetRow] = useState([])
  const [dataCRUD, setDataCRUD] = useState()
  // Ẩn cột
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setcheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()

  useEffect(() => {
    const getListHangHoa = async () => {
      try {
        setTableLoad(true)
        const response = await categoryAPI.HangHoa(TokenAccess)
        if (response.data.DataError === 0) {
          setDataHangHoa(response.data.DataResults)
          setTableLoad(false)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHangHoa()
        } else {
          setDataHangHoa([])
          setTableLoad(false)
          setIsLoading(true)
        }
      } catch (error) {
        console.log(error)
        setTableLoad(false)
      }
    }
    getListHangHoa()
  }, [searchHangHoa, targetRow])

  useEffect(() => {
    if (dataCRUD?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataCRUD])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('DanhMuc_HangHoa', TokenAccess)
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
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setcheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataHangHoa ? dataHangHoa[0] : {}).filter(
      (key) => key !== 'CoThue' && key !== 'TyLeThue' && key !== 'Nhom' && key !== 'TyLeQuyDoi' && key !== 'DienGiaiHangHoa' && key !== 'DVTQuyDoi',
    )
    setOptions(key)
  }, [selectVisible])

  const handleLoading = () => {
    setTableLoad(true)
  }
  const handleCreate = () => {
    setActionType('create')
    setIsShowModal(true)
    setIsMaHang([])
  }
  const handleDelete = (record) => {
    setActionType('delete')
    setIsShowModal(true)
    setIsMaHang(record)
  }
  const handleView = (record) => {
    setActionType('view')
    setIsMaHang(record)
    setIsShowModal(true)
  }
  const handleUpdate = (record) => {
    setActionType('edit')
    setIsMaHang(record)
    setIsShowModal(true)
  }
  const handleStatusMany = () => {
    if (selectedRowKeys.length > 0) {
      setActionType('statusMany')
      setIsShowModal(true)
      setIsMaHang(selectedRowKeys)
    } else {
      toast.warning('Vui Lòng Chọn Mã Hàng Muốn Đổi', { autoClose: 1000 })
    }
  }
  const handleGroupMany = () => {
    if (selectedRowKeys.length > 0) {
      setActionType('groupMany')
      setIsShowModal(true)
      setIsMaHang(selectedRowKeys)
    } else {
      toast.warning('Vui Lòng Chọn Mã Hàng Muốn Đổi', { autoClose: 1000 })
    }
  }
  const handlePrintBar = () => {
    setActionType('print')
    setIsShowModal(true)
  }
  const handlePrintABarcode = async (record) => {
    try {
      if (record) {
        const response = await categoryAPI.InMaVach(
          {
            CodeValue2From: record.MaHang,
            CodeValue2To: record.MaHang,
            SoTem: 1,
          },
          TokenAccess,
        )
        if (response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrintABarcode()
        } else {
          toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
        }
      } else {
        const response = await categoryAPI.InMaVach(
          {
            CodeValue2List: selectedRowKeys.map((key) => key.toString()).join(','),
            SoTem: 1,
          },
          TokenAccess,
        )
        if (response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrintABarcode()
        } else {
          toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSearch = (event) => {
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchHangHoa(event.target.value)
    }, 300)
  }
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US')
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
  const handleRowClick = (record) => {
    const isSelected = selectedRowKeys.includes(record.key)
    const newSelectedRowKeys = isSelected ? selectedRowKeys.filter((key) => key !== record.key) : [...selectedRowKeys, record.key]
    setSelectedRowKeys(newSelectedRowKeys)
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
      width: 220,
      align: 'center',
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
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'TenNhom',
      key: 'TenNhom',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TenNhom.localeCompare(b.TenNhom),
      showSorterTooltip: false,
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVTKho',
      key: 'DVTKho',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVTKho.localeCompare(b.DVTKho),
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Quy đổi Đơn vị tính',
      dataIndex: 'DienGiaiDVTQuyDoi',
      key: 'DienGiaiDVTQuyDoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.DienGiaiDVTQuyDoi - b.DienGiaiDVTQuyDoi,
      render: (text) => (
        <span className="flex text-start">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Mã vạch',
      dataIndex: 'MaVach',
      key: 'MaVach',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.MaVach - b.MaVach,
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 100,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.LapRap ? 1 : 0
        const valueB = b.LapRap ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className="justify-center" id={`LapRap_${record.key}`} checked={text} />,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'TonKho',
      key: 'TonKho',
      align: 'center',
      width: 100,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.TonKho ? 1 : 0
        const valueB = b.TonKho ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className=" justify-center" id={`TonKho_${record.key}`} checked={text} />,
    },
    {
      title: 'Giá bán lẻ',
      dataIndex: 'GiaBanLe',
      key: 'GiaBanLe',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.GiaBanLe - b.GiaBanLe,
      render: (text) => (
        <span className={`flex justify-end  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLEDONGIA)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Số bảng giá',
      dataIndex: 'BangGiaSi',
      key: 'BangGiaSi',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.BangGiaSi - b.BangGiaSi,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatCurrency(text)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Giá sỉ thấp',
      dataIndex: 'BangGiaSi_Min',
      key: 'BangGiaSi_Min',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.BangGiaSi_Min - b.BangGiaSi_Min,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLEDONGIA)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Giá sỉ cao',
      dataIndex: 'BangGiaSi_Max',
      key: 'BangGiaSi_Max',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.BangGiaSi_Max - b.BangGiaSi_Max,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLEDONGIA)} search={searchHangHoa} />
        </span>
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
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss.SS')} search={searchHangHoa} />,
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      ellipsis: 'true',
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => {
        if (text) {
          return <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss.SS')} search={searchHangHoa} />
        } else {
          return ''
        }
      },
    },
    {
      title: 'Ngưng dùng',
      dataIndex: 'NA',
      key: 'NA',
      width: 120,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.NA ? 1 : 0
        const valueB = b.NA ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className="justify-center" id={`NA_${record.key}`} checked={text} />,
    },
    {
      title: ' ',
      key: 'operation',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center ">
              <div
                onClick={() => (dataCRUD?.EDIT == false ? '' : handleUpdate(record))}
                title="Sửa"
                className={`${
                  dataCRUD?.EDIT == false ? 'border-gray-400 bg-gray-400  hover:text-gray-500' : 'border-yellow-400 bg-yellow-400 hover:text-yellow-400'
                } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
              >
                <MdEdit />
              </div>
              <div
                onClick={() => handlePrintABarcode(record)}
                title="In"
                className="p-[4px] border-2 rounded text-slate-50 border-purple-500 bg-purple-500 hover:bg-white hover:text-purple-500 cursor-pointer"
              >
                <CiBarcode />
              </div>
              <div
                onClick={() => (dataCRUD?.DEL == false ? '' : handleDelete(record))}
                title="Xóa"
                className={`${
                  dataCRUD?.DEL == false ? 'border-gray-400 bg-gray-400 hover:text-gray-500' : 'border-red-500 bg-red-500 hover:text-red-500'
                } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
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
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between gap-2 relative">
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 mt-1">
                      <h1 className="text-xl font-black uppercase">Hàng Hóa</h1>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
                    <div className="flex">
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
                  <div className="flex justify-between" ref={showOption}>
                    <div
                      className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  "
                      onClick={() => setIsShowOption(!isShowOption)}
                      title="Chức năng khác"
                    >
                      <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                    </div>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-200 p-3 top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom">
                        <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                          <ActionButton
                            handleAction={() => handlePrintBar()}
                            title={'In Theo Số Tem'}
                            icon={<CiBarcode className="w-6 h-6" />}
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
                                  width: '470px',
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
                                        {nameColumsHangHoa[item]}
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
                <div className="flex justify-end ">
                  <div className="flex gap-2">
                    <ActionButton
                      handleAction={() => (dataCRUD?.ADD == false ? '' : handleCreate())}
                      title={'Thêm Sản Phẩm'}
                      icon={<IoMdAddCircleOutline className="w-6 h-6" />}
                      color={'slate-50'}
                      background={dataCRUD?.ADD == false ? 'gray-400' : 'blue-500'}
                      color_hover={dataCRUD?.ADD == false ? 'gray-500' : 'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => handleStatusMany()}
                      title={'Đổi Trạng Thái'}
                      icon={<GrStatusUnknown className="w-6 h-6" />}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => handleGroupMany()}
                      title={'Đổi Nhóm Hàng'}
                      icon={<MdOutlineGroupAdd className="w-6 h-6" />}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => handlePrintABarcode()}
                      title={'In Mã Vạch '}
                      icon={<CiBarcode className="w-6 h-6" />}
                      color={'slate-50'}
                      background={'purple-500'}
                      color_hover={'purple-500'}
                      bg_hover={'slate-50'}
                    />
                  </div>
                </div>
                <div id="my-table">
                  <Table
                    loading={tableLoad}
                    bordered
                    rowSelection={{
                      selectedRowKeys,
                      showSizeChanger: true,
                      onChange: (selectedKeys) => {
                        setSelectedRowKeys(selectedKeys)
                      },
                    }}
                    rowKey={(record) => record.MaHang}
                    onRow={(record) => ({
                      onClick: () => {
                        handleRowClick(record)
                        const selected = selectedRowKeys.includes(record.MaHang)
                        if (selected) {
                          setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.MaHang))
                        } else {
                          setSelectedRowKeys([...selectedRowKeys, record.MaHang])
                        }
                      },
                      onDoubleClick: () => handleView(record),
                    })}
                    rowClassName={(record) => (record.MaHang === targetRow ? 'highlighted-row' : '')}
                    className="setHeight"
                    columns={newTitles}
                    dataSource={filteredHangHoa.map((item, index) => ({
                      ...item,
                      modifiedIndex: index + 1,
                    }))}
                    size="small"
                    scroll={{
                      x: 3000,
                      y: 400,
                    }}
                    pagination={{
                      defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                      showSizeChanger: true,
                      pageSizeOptions: ['50', '100', '1000'],
                      onShowSizeChange: (current, size) => {
                        localStorage.setItem('pageSize', size)
                      },
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '24px',
                    }}
                    summary={() => {
                      return (
                        <Table.Summary fixed="bottom">
                          <Table.Summary.Row>
                            <Table.Summary.Cell className="bg-gray-100"></Table.Summary.Cell>
                            {newTitles
                              .filter((column) => column.render)
                              .map((column, index) => {
                                const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] === 'number'
                                return (
                                  <Table.Summary.Cell key={`summary-cell-${index + 1}`} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                    {isNumericColumn ? (
                                      column.dataIndex === 'GiaBanLe' || column.dataIndex === 'BangGiaSi_Min' || column.dataIndex === 'BangGiaSi_Max' ? (
                                        <Text strong>
                                          {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo.SOLEDONGIA,
                                            maximumFractionDigits: dataThongSo.SOLEDONGIA,
                                          })}
                                        </Text>
                                      ) : (
                                        <Text strong>
                                          {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          })}
                                        </Text>
                                      )
                                    ) : column.dataIndex == 'STT' ? (
                                      <Text className="text-center" strong>
                                        {dataHangHoa?.length}
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
              <div>
                {isShowModal && (
                  <HangHoaModals
                    type={actionType}
                    close={() => setIsShowModal(false)}
                    getMaHang={isMaHang}
                    getDataHangHoa={dataHangHoa}
                    loadingData={() => handleLoading()}
                    setTargetRow={setTargetRow}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default HangHoa
