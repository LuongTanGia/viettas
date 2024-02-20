import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input } from 'antd'
import moment from 'moment'
import icons from '../../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../../apis'
import { Modals } from '../../../components_K'
import ActionButton from '../../../components/util/Button/ActionButton'
import dayjs from 'dayjs'
import { RETOKEN, formatPrice, formatQuantity } from '../../../action/Actions'
import SimpleBackdrop from '../../../components/util/Loading/LoadingPage'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'
import { useSearch } from '../../../components_K/myComponents/useSearch'
import HighlightedCell from '../../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography
const { IoAddCircleOutline, TiPrinter, MdDelete, GiPayMoney, BsSearch, TfiMoreAlt, MdEdit, FaEyeSlash, RiFileExcel2Fill, CgCloseO } = icons
const PhieuNTR = () => {
  const navigate = useNavigate()
  const optionContainerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [isLoadingEdit, setIsLoadingEdit] = useState(true)
  const [tableLoad, setTableLoad] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])
  const [dataThongTin, setDataThongTin] = useState([])
  const [dataThongTinSua, setDataThongTinSua] = useState([])
  const [dataRecord, setDataRecord] = useState(null)
  const [dataKhoHang, setDataKhoHang] = useState(null)
  const [dataDoiTuong, setDataDoiTuong] = useState(null)
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [actionType, setActionType] = useState('')
  const [formKhoanNgay, setFormKhoanNgay] = useState([])
  const [setSearchPNTR, filteredPNTR, searchPNTR] = useSearch(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [prevdateValue, setPrevDateValue] = useState({})
  const [doneNTR, setDoneNTR] = useState(null)
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [lastSearchTime, setLastSearchTime] = useState(0)
  const [isShowNotify, setIsShowNotify] = useState(false)

  // bỏ focus option thì hidden
  useEffect(() => {
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

  // hide Columns
  useEffect(() => {
    setNewColumns(columns)
    // Lấy thông tin từ local storage sau khi đăng nhập
    const storedHiddenColumns = localStorage.getItem('hidenColumnPMH')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hidenColumnPMH')))
      setNewColumns(JSON.parse(localStorage.getItem('hidenColumnPMH')))
    }
  }, [confirmed])

  // get helper
  useEffect(() => {
    setIsLoadingModal(true)
    setIsLoadingEdit(true)
    const fetchData = async () => {
      try {
        console.log('get helper')

        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'create' || actionType === 'edit') {
          console.log('get helper  KH,DT')
          const responseKH = await apis.ListHelperKhoHangNTR(tokenLogin)
          if (responseKH.data && responseKH.data.DataError === 0) {
            setDataKhoHang(responseKH.data.DataResults)
            setIsLoadingModal(false)
          } else if (responseKH.data.DataError === -1 || responseKH.data.DataError === -2 || responseKH.data.DataError === -3) {
            toast.warning(responseKH.data.DataErrorDescription)
            setIsLoadingModal(false)
          } else if (responseKH.data.DataError === -107 || responseKH.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseKH.data.DataErrorDescription)
            setIsLoadingModal(false)
          }
          const responseDT = await apis.ListHelperDoiTuongNTR(tokenLogin)
          if (responseDT.data && responseDT.data.DataError === 0) {
            setDataDoiTuong(responseDT.data.DataResults)
            setIsLoadingModal(false)
          } else if (responseDT.data && responseDT.data.DataError === -103) {
            toast.error(responseDT.data.DataErrorDescription)
            setIsLoadingModal(false)
          } else if (responseDT.data && responseDT.data.DataError === -104) {
            toast.error(responseDT.data.DataErrorDescription)
            setIsLoadingModal(false)
          } else if (responseDT.data.DataError === -1 || responseDT.data.DataError === -2 || responseDT.data.DataError === -3) {
            toast.warning(responseDT.data.DataErrorDescription)
            setIsLoadingModal(false)
          } else if (responseDT.data.DataError === -107 || responseDT.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseDT.data.DataErrorDescription)
            setIsLoadingModal(false)
          }
        }
        if (actionType === 'view') {
          console.log('get helper tt')
          const responseTT = await apis.ThongTinNTR(tokenLogin, dataRecord.SoChungTu)
          if (responseTT.data && responseTT.data.DataError === 0) {
            setDataThongTin(responseTT.data.DataResult)
            setIsLoadingModal(false)
          } else if (responseTT.data.DataError === -1 || responseTT.data.DataError === -2 || responseTT.data.DataError === -3) {
            toast.warning(responseTT.data.DataErrorDescription)
            setIsLoadingModal(false)
          } else if (responseTT.data.DataError === -107 || responseTT.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseTT.data.DataErrorDescription)
            setIsLoadingModal(false)
          }
        }
        if (actionType === 'edit') {
          console.log('get helper tt sua')
          const responseTTS = await apis.ThongTinSuaNTR(tokenLogin, dataRecord.SoChungTu)
          if (responseTTS.data && responseTTS.data.DataError === 0) {
            setDataThongTinSua(responseTTS.data.DataResult)
            setIsLoadingModal(false)
            setIsLoadingEdit(false)
          } else if (responseTTS.data.DataError === -1 || responseTTS.data.DataError === -2 || responseTTS.data.DataError === -3) {
            toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{responseTTS.data.DataErrorDescription}</div>)
            setIsLoadingModal(false)
            setIsShowModal(false)
            setIsLoadingEdit(false)
          } else if (responseTTS.data.DataError === -107 || responseTTS.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            setIsLoadingModal(false)
            setIsShowModal(false)
            setIsLoadingEdit(false)
            toast.error(responseTTS.data.DataErrorDescription)
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        setIsLoadingModal(false)
        setIsShowModal(false)
        setIsLoadingEdit(false)
        // toast.error('Lấy data thất bại. Vui lòng thử lại sau.')
      }
    }

    if (isShowModal) {
      fetchData()
    }
  }, [isShowModal])

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

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        console.log('đi')
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'DuLieu_NTR')

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

  //get DSPMH
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.VIEW) {
      getDSPNTR()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  const getDSPNTR = async () => {
    try {
      console.log('get ds PMH')
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DanhSachNTR(tokenLogin, formKhoanNgay)
      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSPNTR()
        // setTableLoad(false)
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(response.data.DataErrorDescription)
        setTableLoad(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setData([])
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
          <HighlightedCell text={text} search={searchPNTR} />
        </div>
      ),
    },
    {
      title: 'Ngày Chứng Từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchPNTR} />,
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
          <HighlightedCell text={text} search={searchPNTR} />
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
          <HighlightedCell text={text} search={searchPNTR} />
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
              <HighlightedCell text={text} search={searchPNTR} />
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
          <HighlightedCell text={text} search={searchPNTR} />
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
          <HighlightedCell text={text} search={searchPNTR} />
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
          <HighlightedCell text={text} search={searchPNTR} />
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
          <HighlightedCell text={text} search={searchPNTR} />
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
          <HighlightedCell text={formatQuantity(text, dataThongSo?.SOLESOLUONG)} search={searchPNTR} />
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
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchPNTR} />
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
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchPNTR} />
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
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchPNTR} />
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
          <HighlightedCell text={text} search={searchPNTR} />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY hh:mm:ss')} search={searchPNTR} />,
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
          <HighlightedCell text={text} search={searchPNTR} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null} search={searchPNTR} />,
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
          <HighlightedCell text={text} search={searchPNTR} />
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
                onClick={() => (dataQuyenHan?.EDIT ? handleEdit(record) : '')}
                title="Sửa"
                className={`p-[3px] border-2 rounded-md text-slate-50 ${
                  dataQuyenHan?.EDIT ? 'border-yellow-500 bg-yellow-500 hover:bg-white hover:text-yellow-500 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                } `}
              >
                <MdEdit size={16} />
              </div>

              <div
                onClick={() => (dataQuyenHan?.DEL ? handleDelete(record) : '')}
                title="Xóa"
                className={`p-[3px] border-2 rounded-md text-slate-50 ${
                  dataQuyenHan?.DEL ? 'border-red-500 bg-red-500 hover:bg-white hover:text-red-500 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                } `}
              >
                <MdDelete size={16} />
              </div>
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

  const newColumnsHide = columns.filter((item) => !newColumns.includes(item.dataIndex))

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
    if (record.TTTienMat === true) {
      toast.error('Phiếu mua hàng đã được lập phiếu chi! Không thể sửa.', {
        autoClose: 1500,
      })
    } else {
      setActionType('edit')
      setDataRecord(record)
      setDataThongTinSua(record)
      setIsShowModal(true)
    }
  }

  const handleCreate = (record) => {
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
    const currentTime = new Date().getTime()
    if (currentTime - lastSearchTime >= 1000 && formKhoanNgay !== prevdateValue) {
      setTableLoad(true)
      setLastSearchTime(currentTime)
    }
  }

  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formKhoanNgay.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
      })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formKhoanNgay.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, cập nhật ngày bắt đầu
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayKetThuc: endDate,
      })
    }
  }

  const handlePay = (record) => {
    if (record.TTTienMat) return
    setActionType('pay')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleSearch = (e) => {
    const currentTime = new Date().getTime()
    if (currentTime - lastSearchTime >= 1000 && e !== prevSearchValue) {
      setTableLoad(true)
      setSearchPNTR(e)
      setLastSearchTime(currentTime)
    }
  }

  return (
    <>
      {dataQuyenHan?.VIEW === false ? (
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
                          navigate('/')
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
          {isLoading ? (
            <SimpleBackdrop />
          ) : (
            <div className="w-auto">
              <div className="relative text-lg flex justify-between items-center mb-1">
                <div className="flex items-center gap-x-4 font-bold">
                  <h1 className="text-xl uppercase">Phiếu nhập hàng bán trả lại </h1>
                  <div>
                    <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                  </div>
                </div>
                <div className="flex  ">
                  {isShowSearch && (
                    <div className={`flex absolute left-[23rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
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
                  <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                    <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                  </div>
                  {isShowOption && (
                    <div className=" absolute flex flex-col gap-2 bg-slate-100 p-3  top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
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
              <div className="flex justify-between items-center px-4 ">
                <div className="flex gap-3">
                  {/* DatePicker */}
                  <div className="flex gap-x-2 items-center">
                    <label htmlFor="">Ngày</label>
                    <DateField
                      className="DatePicker_PMH max-w-[110px]"
                      format="DD/MM/YYYY"
                      value={dayjs(formKhoanNgay.NgayBatDau)}
                      // maxDate={dayjs(formKhoanNgay.NgayKetThuc)}
                      onChange={(newDate) => {
                        setFormKhoanNgay({
                          ...formKhoanNgay,
                          NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                        })
                      }}
                      onBlur={() => {
                        handleStartDateChange(formKhoanNgay.NgayBatDau)
                        handleFilterDS()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleStartDateChange(formKhoanNgay.NgayBatDau)

                          setPrevDateValue(formKhoanNgay)
                          handleFilterDS()
                        }
                      }}
                      onFocus={() => setPrevDateValue(formKhoanNgay)}
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
                      className="DatePicker_PMH max-w-[110px]"
                      format="DD/MM/YYYY"
                      // minDate={dayjs(formKhoanNgay.NgayBatDau)}
                      value={dayjs(formKhoanNgay.NgayKetThuc)}
                      onChange={(newDate) => {
                        setFormKhoanNgay({
                          ...formKhoanNgay,
                          NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                        })
                      }}
                      onBlur={() => {
                        handleEndDateChange(formKhoanNgay.NgayKetThuc)
                        handleFilterDS()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEndDateChange(formKhoanNgay.NgayKetThuc)
                          setPrevDateValue(formKhoanNgay)
                          handleFilterDS()
                        }
                      }}
                      onFocus={() => setPrevDateValue(formKhoanNgay)}
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

                  {/* <ActionButton
                color={'slate-50'}
                title={'Lọc'}
                icon={<MdFilterAlt size={20} />}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                handleAction={handleFilterDS}
              /> */}
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton
                    color={'slate-50'}
                    title={'Thêm phiếu'}
                    icon={<IoAddCircleOutline size={20} />}
                    bg_hover={!dataQuyenHan?.ADD ? '' : 'white'}
                    background={!dataQuyenHan?.ADD ? 'gray-400' : 'bg-main'}
                    color_hover={!dataQuyenHan?.ADD ? '' : 'bg-main'}
                    handleAction={() => (!dataQuyenHan?.ADD ? '' : handleCreate())}
                    quyenHan={dataQuyenHan?.ADD}
                  />
                </div>
              </div>

              <div id="my-table" className="relative px-2 py-1 ">
                <Table
                  loading={tableLoad}
                  className="table_pmh setHeight"
                  // rowSelection={rowSelection}
                  columns={newColumnsHide}
                  dataSource={filteredPNTR}
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
                  rowClassName={(record) => (record.SoChungTu === doneNTR ? 'highlighted-row' : '')}
                  // Bảng Tổng
                  summary={() => {
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row>
                          {newColumnsHide
                            .filter((column) => column.render)
                            .map((column) => {
                              const isNumericColumn = typeof filteredPNTR[0]?.[column.dataIndex] === 'number'

                              return (
                                <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                  {isNumericColumn ? (
                                    column.dataIndex === 'TongTienHang' || column.dataIndex === 'TongTienThue' || column.dataIndex === 'TongThanhTien' ? (
                                      <Text strong>
                                        {Number(filteredPNTR.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                          minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                          maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                        })}
                                      </Text>
                                    ) : column.dataIndex === 'TongSoLuong' ? (
                                      <Text strong>
                                        {Number(filteredPNTR.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                          minimumFractionDigits: dataThongSo?.SOLESOLUONG,
                                          maximumFractionDigits: dataThongSo?.SOLESOLUONG,
                                        })}
                                      </Text>
                                    ) : (
                                      <Text strong>
                                        {Number(filteredPNTR.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0,
                                        })}
                                      </Text>
                                    )
                                  ) : column.dataIndex === 'TTTienMat' ? (
                                    <Text className="text-center" strong>
                                      {Object.values(data).filter((value) => value.TTTienMat).length}
                                    </Text>
                                  ) : column.dataIndex === 'STT' ? (
                                    <Text className="text-center" strong>
                                      {data.length}
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
                <Modals
                  namePage={'Phiếu nhập hàng bán trả'}
                  typePage={'NTR'}
                  close={() => setIsShowModal(false)}
                  actionType={actionType}
                  dataRecord={dataRecord}
                  dataThongTin={dataThongTin}
                  dataThongTinSua={dataThongTinSua}
                  dataKhoHang={dataKhoHang}
                  dataDoiTuong={dataDoiTuong}
                  data={data}
                  isLoadingModal={isLoadingModal}
                  isLoadingEdit={isLoadingEdit}
                  controlDate={formKhoanNgay}
                  dataThongSo={dataThongSo}
                  loading={() => setTableLoad(true)}
                  setHightLight={setDoneNTR}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default PhieuNTR