import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Spin, Button, Typography } from 'antd'
import moment from 'moment'
import icons from '../../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../../apis'
import { Modals } from '../../../components_K'
import dayjs from 'dayjs'
import { RETOKEN, formatPrice, formatQuantity } from '../../../action/Actions'
import SimpleBackdrop from '../../../components/util/Loading/LoadingPage'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useSearch } from '../../../components_K/myComponents/useSearch'
import HighlightedCell from '../../../components_T/hooks/HighlightedCell'

const { Text } = Typography
const { IoAddCircleOutline, TiPrinter, MdDelete, GiPayMoney, BsSearch, TfiMoreAlt, MdEdit, MdFilterAlt, FaEyeSlash } = icons
const PhieuMuaHang = () => {
  const optionContainerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tableLoad, setTableLoad] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState(null)
  const [dataThongTin, setDataThongTin] = useState([])
  const [dataRecord, setDataRecord] = useState(null)
  const [dataKhoHang, setDataKhoHang] = useState(null)
  const [dataDoiTuong, setDataDoiTuong] = useState(null)
  const [actionType, setActionType] = useState('')
  const [formKhoanNgay, setFormKhoanNgay] = useState([])
  // const [dataThongSo, setDataThongSo] = useState()
  // const [dataChucNang, setDataChucNang] = useState()
  const [setSearchPMH, filteredPMH, searchPMH] = useSearch(data)
  const [donePMH, setDonePMH] = useState(null)
  const [hideColumns, setHideColumns] = useState(false)
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null

  useEffect(() => {
    console.log('fix')
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

  // get helper
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('get helper')

        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'create' || actionType === 'edit') {
          console.log('get helper  KH,DT')
          const responseKH = await apis.ListHelperKhoHang(tokenLogin)
          if (responseKH.data && responseKH.data.DataError === 0) {
            setDataKhoHang(responseKH.data.DataResults)
          } else if (responseKH.data.DataError === -1 || responseKH.data.DataError === -2 || responseKH.data.DataError === -3) {
            toast.warning(responseKH.data.DataErrorDescription)
          } else if (responseKH.data.DataError === -107 || responseKH.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseKH.data.DataErrorDescription)
          }
          const responseDT = await apis.ListHelperDoiTuong(tokenLogin)
          if (responseDT.data && responseDT.data.DataError === 0) {
            setDataDoiTuong(responseDT.data.DataResults)
          } else if (responseDT.data && responseDT.data.DataError === -103) {
            toast.error(responseDT.data.DataErrorDescription)
          } else if (responseDT.data && responseDT.data.DataError === -104) {
            toast.error(responseDT.data.DataErrorDescription)
          } else if (responseDT.data.DataError === -1 || responseDT.data.DataError === -2 || responseDT.data.DataError === -3) {
            toast.warning(responseDT.data.DataErrorDescription)
          } else if (responseDT.data.DataError === -107 || responseDT.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseDT.data.DataErrorDescription)
          }
        }
        if (actionType === 'view' || actionType === 'edit') {
          console.log('get helper tt')

          const responseTT = await apis.ThongTinPMH(tokenLogin, dataRecord.SoChungTu)
          if (responseTT.data && responseTT.data.DataError === 0) {
            setDataThongTin(responseTT.data.DataResult)
          } else if (responseTT.data.DataError === -1 || responseTT.data.DataError === -2 || responseTT.data.DataError === -3) {
            toast.warning(responseTT.data.DataErrorDescription)
          } else if (responseTT.data.DataError === -107 || responseTT.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseTT.data.DataErrorDescription)
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        // toast.error('Lấy data thất bại. Vui lòng thử lại sau.')
      }
    }

    if (isShowModal) {
      fetchData()
    }
  }, [isShowModal])

  useEffect(() => {
    console.log('fix')
    if (dataThongTin && dataRecord) {
      // Data đã được chuyền vào, dừng loading
      setTableLoad(false)
    }
  }, [dataRecord, dataThongTin])

  // get Khoảng ngày
  useEffect(() => {
    const getKhoanNgay = async () => {
      try {
        console.log('get Khoảng ngày')
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.KhoanNgay(tokenLogin)

        if (response.data && response.data.DataError === 0) {
          setFormKhoanNgay(response.data)
          setIsLoading(false)
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
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

  useEffect(() => {
    if (tableLoad) {
      getDSPMH()
    }
  }, [tableLoad])

  const getDSPMH = async () => {
    try {
      console.log('get ds PMH')
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachPMH(tokenLogin, formKhoanNgay)

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSPMH()
        // setTableLoad(false)
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(response.data.DataErrorDescription)
        setTableLoad(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setTableLoad(false)
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
      title: 'Số Chứng Từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Ngày Chứng Từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchPMH} />,
      width: 150,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },

    {
      title: 'Mã Đối Tượng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 150,
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 200,
      sorter: (a, b) => a.TenDoiTuong.localeCompare(b.TenDoiTuong),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Địa chỉ ',
      dataIndex: 'DiaChi',
      key: 'DiaChi',
      width: 250,
      sorter: (a, b) => {
        const diaChiA = a.DiaChi || ''
        const diaChiB = b.DiaChi || ''

        return diaChiA.localeCompare(diaChiB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue">
            <span>
              <HighlightedCell text={text} search={searchPMH} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'MaSoThue',
      key: 'MaSoThue',
      width: 150,
      sorter: (a, b) => a.MaSoThue - b.MaSoThue,
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Mã kho',
      dataIndex: 'MaKho',
      key: 'MaKho',
      width: 150,
      sorter: (a, b) => a.MaKho.localeCompare(b.MaKho),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Thông tin kho',
      dataIndex: 'ThongTinKho',
      key: 'ThongTinKho',
      width: 150,
      sorter: (a, b) => a.ThongTinKho.localeCompare(b.ThongTinKho),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Ghi chú ',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      width: 200,
      sorter: (a, b) => {
        const GhiChuA = a.GhiChu || ''
        const GhiChuB = b.GhiChu || ''
        return GhiChuA.localeCompare(GhiChuB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Tổng mặt hàng',
      dataIndex: 'TongMatHang',
      key: 'TongMatHang',
      width: 200,
      align: 'end',
      render: (text) => <div className="">{text} </div>,

      sorter: (a, b) => a.TongMatHang - b.TongMatHang,
      showSorterTooltip: false,
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      width: 200,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatQuantity(text, dataThongSo?.SOLESOLUONG)} search={searchPMH} />
        </div>
      ),
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
      showSorterTooltip: false,
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      width: 200,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchPMH} />
        </div>
      ),
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
      showSorterTooltip: false,
    },
    {
      title: 'Tổng tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      width: 200,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchPMH} />
        </div>
      ),
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
      showSorterTooltip: false,
    },
    {
      title: 'Tổng thành tiền',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      width: 200,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchPMH} />
        </div>
      ),
      sorter: (a, b) => a.TongThanhTien - b.TongThanhTien,
      showSorterTooltip: false,
    },

    {
      title: 'Phiếu chi',
      dataIndex: 'PhieuChi',
      key: 'PhieuChi',
      width: 150,
      sorter: (a, b) => {
        const PhieuChiA = a.PhieuChi || ''
        const PhieuChiB = b.PhieuChi || ''
        return PhieuChiA.localeCompare(PhieuChiB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          {' '}
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY hh:mm:ss')} search={searchPMH} />,
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
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null} search={searchPMH} />,
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
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchPMH} />
        </div>
      ),
    },

    {
      title: 'Tiền mặt',
      key: 'TTTienMat',
      dataIndex: 'TTTienMat',
      fixed: 'right',
      width: 100,
      align: 'center',

      render: (text) => <Checkbox value={text} disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.TTTienMat ? 1 : 0
        const valueB = b.TTTienMat ? 1 : 0
        return valueA - valueB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Chức năng',
      key: 'ChucNang',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center  ">
              <div
                onClick={() => handlePay(record)}
                title="Lập phiếu chi"
                className={`p-[3px] rounded-md text-slate-50 ${
                  record.TTTienMat
                    ? 'border-2 border-gray-400 bg-gray-400 cursor-not-allowed'
                    : ' border-2 border-blue-500 bg-blue-500  hover:bg-white hover:text-blue-500 cursor-pointer'
                }`}
              >
                <GiPayMoney size={16} />
              </div>
              <div
                onClick={() => handleEdit(record)}
                title="Sửa"
                className="p-[3px] border-2 rounded-md text-slate-50 border-yellow-500 bg-yellow-500 hover:bg-white hover:text-yellow-500 cursor-pointer"
              >
                <MdEdit size={16} />
              </div>

              <div
                onClick={() => handleDelete(record)}
                title="Xóa"
                className="p-[3px]  border-2  border-red-500 rounded-md text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
              >
                <MdDelete size={16} />
              </div>
            </div>
          </>
        )
      },
    },
  ]
  // const defaultCheckedList = columns.map((item) => item.key)

  const storedHidenColumns = localStorage.getItem('hidenColumnPMH')
  const parsedHidenColumns = storedHidenColumns ? JSON.parse(storedHidenColumns) : null

  const [checkedList, setCheckedList] = useState(Array.isArray(parsedHidenColumns) && parsedHidenColumns.length > 0 ? parsedHidenColumns : [])

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }))
  const newColumns = columns.map((item) => ({
    ...item,
    hidden: checkedList.includes(item.key),
  }))
  const newColumnsHide = newColumns.filter((column) => !column.hidden)

  // *******************************************
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
    if (record.TTTienMat === true) {
      toast.error('Phiếu mua hàng đã được lập phiếu chi! Không thể sửa.', {
        autoClose: 1500,
      })
    } else {
      setActionType('edit')
      setDataRecord(record)
      setDataThongTin(record)
      setIsShowModal(true)
    }
  }

  const handleCreate = (record) => {
    console.log('create')
    setActionType('create')
    setDataRecord(record)
    setIsShowModal(true)
  }
  const handlePrint = (record) => {
    setActionType('print')
    setDataRecord(record)
    setIsShowModal(true)
  }
  const handlePrintWareHouse = (record) => {
    setActionType('printWareHouse')
    setDataRecord(record)
    setIsShowModal(true)
  }
  const handleFilterDS = () => {
    setTableLoad(true)
    if (tableLoad) {
      getDSPMH()
    }
  }
  const handlePay = (record) => {
    if (record.TTTienMat) return
    setActionType('pay')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleSearch = (event) => {
    setSearchPMH(event.target.value)
  }

  return (
    <>
      {isLoading ? (
        <SimpleBackdrop />
      ) : (
        <div className="w-auto">
          <div className="relative text-lg flex justify-between items-center mb-1">
            <div className="flex items-center gap-x-4 font-bold">
              <h1 className="text-xl uppercase">Phiếu mua hàng </h1>
              <div>
                <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
              </div>
            </div>
            <div className="flex  ">
              {isShowSearch && (
                <div className={`flex absolute left-[14rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                  <input
                    type="text"
                    placeholder="Nhập ký tự bạn cần tìm"
                    onChange={handleSearch}
                    className={'px-2  w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
                  />
                </div>
              )}
            </div>
            <div ref={optionContainerRef}>
              <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
              </div>
              {isShowOption && (
                <div className=" absolute flex flex-col gap-2 bg-slate-100 p-3  top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
                  <div className={`flex flex-grow flex-wrap gap-1 ${!hideColumns ? 'flex-col' : ''}`}>
                    <button
                      onClick={handlePrint}
                      className="flex items-center py-1 px-2 rounded-md border-2 border-purple-500  text-slate-50 text-base bg-purple-500 hover:bg-white hover:text-purple-500 "
                    >
                      <div className="pr-1">
                        <TiPrinter size={20} />
                      </div>
                      <div>In phiếu</div>
                    </button>
                    {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                      <button
                        onClick={handlePrintWareHouse}
                        className="flex items-center  py-1 px-2  rounded-md border-2 border-purple-500  text-slate-50 text-base bg-purple-500 hover:bg-white hover:text-purple-500  "
                      >
                        <div className="pr-1">
                          <TiPrinter size={20} />
                        </div>
                        <div>In phiếu kho</div>
                      </button>
                    )}
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
                  <div>
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
                            localStorage.setItem('hidenColumnPMH', JSON.stringify(value))
                          }}
                        >
                          <Row>
                            {options.map((item) => (
                              <Col span={8} key={item.value}>
                                <Checkbox value={item.value}>{item.label}</Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center px-4 ">
            <div className="flex gap-3">
              {/* DatePicker */}
              <div className="flex gap-x-2 items-center">
                <label htmlFor="">Ngày</label>
                <DatePicker
                  className="DatePicker_PMH"
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(formKhoanNgay.NgayBatDau)}
                  maxDate={dayjs(formKhoanNgay.NgayKetThuc)}
                  onChange={(newDate) => {
                    setFormKhoanNgay({
                      ...formKhoanNgay,
                      NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                    })
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
                <DatePicker
                  className="DatePicker_PMH"
                  format="DD/MM/YYYY"
                  minDate={dayjs(formKhoanNgay.NgayBatDau)}
                  defaultValue={dayjs(formKhoanNgay.NgayKetThuc)}
                  onChange={(newDate) => {
                    setFormKhoanNgay({
                      ...formKhoanNgay,
                      NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                    })
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
              <div className=" ">
                <button
                  onClick={handleFilterDS}
                  className="flex items-center gap-x-1 py-[2px] px-2 bg-bg-main rounded-md border-2 border-bg-main  text-slate-50 text-base hover:bg-white hover:text-bg-main"
                >
                  <span>
                    <MdFilterAlt />
                  </span>
                  <span>Lọc</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                className="flex items-center   py-1 px-2 bg-bg-main rounded-md border-2 border-bg-main  text-slate-50 text-base hover:bg-white hover:text-bg-main w-[130px]"
              >
                <div className="pr-1">
                  <IoAddCircleOutline size={20} />
                </div>
                <div>Thêm phiếu</div>
              </button>
            </div>
          </div>

          <div className="relative px-2 py-1 ">
            <Table
              loading={tableLoad}
              className="table_pmh setHeight"
              // rowSelection={rowSelection}
              columns={newColumnsHide}
              // columns={columns}
              dataSource={filteredPMH}
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
              rowKey={(record) => record.SoChungTu}
              onRow={(record) => ({
                onDoubleClick: () => {
                  handleView(record)
                },
              })}
              rowClassName={(record) => (record.SoChungTu === donePMH ? 'highlighted-row' : '')}
              // Bảng Tổng
              summary={() => {
                return (
                  <Table.Summary fixed="bottom">
                    <Table.Summary.Row>
                      {newColumnsHide
                        .filter((column) => column.render)
                        .map((column) => {
                          const isNumericColumn = typeof filteredPMH[0]?.[column.dataIndex] === 'number'

                          return (
                            <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                              {isNumericColumn ? (
                                column.dataIndex === 'TongTienHang' || column.dataIndex === 'TongTienThue' || column.dataIndex === 'TongThanhTien' ? (
                                  <Text strong>
                                    {Number(filteredPMH.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                      maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                    })}
                                  </Text>
                                ) : column.dataIndex === 'TongSoLuong' ? (
                                  <Text strong>
                                    {Number(filteredPMH.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: dataThongSo?.SOLESOLUONG,
                                      maximumFractionDigits: dataThongSo?.SOLESOLUONG,
                                    })}
                                  </Text>
                                ) : (
                                  <Text strong>
                                    {Number(filteredPMH.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
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
            ></Table>
          </div>

          {isShowModal && (
            <Modals
              close={() => setIsShowModal(false)}
              actionType={actionType}
              dataRecord={dataRecord}
              dataThongTin={dataThongTin}
              dataKhoHang={dataKhoHang}
              dataDoiTuong={dataDoiTuong}
              dataPMH={data}
              controlDate={formKhoanNgay}
              dataThongSo={dataThongSo}
              loading={() => setTableLoad(true)}
              setDonePMH={setDonePMH}
            />
          )}
        </div>
      )}
    </>
  )
}

export default PhieuMuaHang
