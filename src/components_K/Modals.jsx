/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import icons from '../untils/icons'
import * as apis from '../apis'
import moment from 'moment'
import dayjs from 'dayjs'
import ModalHH from './ModalHH'
import { toast } from 'react-toastify'
import TableEdit from '../components/util/Table/EditTable'
import ActionButton from '../components/util/Button/ActionButton'
import { nameColumsPhieuMuaHang } from '../components/util/Table/ColumnName'
import { RETOKEN, base64ToPDF, formatPrice, formatQuantity } from '../action/Actions'
import ModalOnlyPrint from './ModalOnlyPrint'
import ModalOnlyPrintWareHouse from './ModalOnlyPrintWareHouse'
import { DateField } from '@mui/x-date-pickers/DateField'
import logo from '../assets/VTS-iSale.ico'
import { Table, Select, Tooltip, Checkbox, FloatButton, Spin } from 'antd'
import SimpleBackdrop from '../components/util/Loading/LoadingPage'
const { Option } = Select

const { TiPrinter, IoMdAddCircle } = icons

const Modals = ({
  close,
  actionType,
  dataThongTin,
  dataThongTinSua,
  dataKhoHang,
  dataDoiTuong,
  dataRecord,
  data,
  controlDate,
  dataThongSo,
  loading,
  setHightLight,
  namePage,
  typePage,
  isLoadingModal,
  isLoadingEdit,
}) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false)
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [isShowModalOnlyPrintWareHouse, setIsShowModalOnlyPrintWareHouse] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState([])
  const [selectedKhoHang, setSelectedKhoHang] = useState()
  const [selectedRowData, setSelectedRowData] = useState([])
  const [selectedDoiTuong, setSelectedDoiTuong] = useState()
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [newData, setNewData] = useState(data)
  const [SctCreate, setSctCreate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState({
    DoiTuong: null,
    Ten: '',
    DiaChi: '',
  })

  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng'), [selectedRowData])
  //  show modal HH = F9
  const handleKeyDown = (event) => {
    if (event.key === 'F9') {
      setIsShowModalHH(true)
    }
  }

  useEffect(() => {
    if (actionType === 'create' || actionType === 'edit') {
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  const startDate = dayjs(controlDate.NgayBatDau).format('YYYY-MM-DDTHH:mm:ss')
  const endDate = dayjs(controlDate.NgayKetThuc).format('YYYY-MM-DDTHH:mm:ss')
  const ngayChungTu = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  // const daoHan = dayjs().format('YYYY-MM-DDTHH:mm:ss')

  const defaultFormCreate = {
    NgayCTu: ngayChungTu,
    TenDoiTuong: '',
    DiaChi: '',
    MaSoThue: '',
    TTTienMat: false,
    GhiChu: '',
    DataDetails: [],
  }

  const [formCreate, setFormCreate] = useState(defaultFormCreate)

  const [formEdit, setFormEdit] = useState({ ...dataThongTinSua })

  const [formPrint, setFormPrint] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  })
  const [formPrintFilter, setFormPrintFilter] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  })
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  })

  // get dsHH
  useEffect(() => {
    if (actionType === 'create' || actionType === 'edit') {
      if (selectedKhoHang) {
        handleAddInList()
      }
    }
  }, [selectedKhoHang])

  useEffect(() => {
    if (dataThongTinSua !== null) setFormEdit(dataThongTinSua)
  }, [dataThongTinSua, dataThongTinSua.DataDetails])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      hight: 10,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      editable: true,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => <div className="text-start">{text}</div>,
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      render: (text) => (
        <div className="text-start truncate">
          <Tooltip title={text} color="blue">
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
    },
    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatQuantity(text, dataThongSo?.SOLESOLUONG)}
        </div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.DonGia - b.DonGia,
    },
    {
      title: 'Tiền hàng',
      dataIndex: 'TienHang',
      key: 'TienHang',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TienHang - b.TienHang,
    },
    {
      title: '% thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatQuantity(text, dataThongSo?.SOLETYLE)}
        </div>
      ),
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TienThue',
      key: 'TienThue',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TienThue - b.TienThue,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      width: 150,
      align: 'center',
      fixed: 'right',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.ThanhTien - b.ThanhTien,
    },
  ]
  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong', 'DonGia', 'TienHang', 'TyLeThue', 'TienThue', 'ThanhTien']

  useEffect(() => {
    if ((typePage === 'PMH' || typePage === 'XTR') && dataDoiTuong && actionType === 'create') {
      // Tìm giá trị có mã là 'NCVL' trong mảng dataDoiTuong
      const ncvlDoiTuong = dataDoiTuong.find((item) => item.Ma === 'NCVL')
      // Sử dụng 'NCVL' nếu có, ngược lại sử dụng mã đầu tiên trong mảng
      const defaultMa = ncvlDoiTuong?.Ma || dataDoiTuong[0]?.Ma || ''
      handleDoiTuongFocus(defaultMa)
    }
    if (dataDoiTuong && typePage === 'NTR' && actionType === 'create') {
      // Tìm giá trị có mã là 'NCVL' trong mảng dataDoiTuong
      const ncvlDoiTuong = dataDoiTuong.find((item) => item.Ma === 'KHVL')
      // Sử dụng 'NCVL' nếu có, ngược lại sử dụng mã đầu tiên trong mảng
      const defaultMa = ncvlDoiTuong?.Ma || dataDoiTuong[0]?.Ma || ''
      handleDoiTuongFocus(defaultMa)
    }

    if ((dataDoiTuong && dataThongTinSua && actionType === 'edit') || (dataDoiTuong && dataThongTinSua && actionType === 'view')) {
      handleDoiTuongFocus(dataThongTinSua.MaDoiTuong)

      if (dataThongTinSua?.DataDetails) {
        setSelectedRowData([...dataThongTinSua.DataDetails])
      }
    }
  }, [dataDoiTuong, dataThongTin, dataThongTinSua])

  useEffect(() => {
    if (dataKhoHang && dataThongTinSua && actionType === 'edit') {
      setSelectedKhoHang(dataThongTinSua.MaKho)
      setIsLoading(true)
    } else if (dataKhoHang && dataThongTin && actionType !== 'edit') {
      setSelectedKhoHang(dataKhoHang[0].MaKho)
      setIsLoading(true)
    }
  }, [dataKhoHang, dataThongTin, dataThongTinSua])

  useEffect(() => {
    if (actionType !== 'create') {
      setSelectedSctBD('Chọn số chứng từ')
      setSelectedSctKT('Chọn số chứng từ')
    }
  }, [newData, actionType])

  const handleAddInList = async () => {
    try {
      console.log('get HH')
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'PMH':
          response = await apis.ListHelperHHPMH(tokenLogin, selectedKhoHang)
          break
        case 'NTR':
          response = await apis.ListHelperHHNTR(tokenLogin, selectedKhoHang)
          break
        case 'XTR':
          response = await apis.ListHelperHHXTR(tokenLogin, selectedKhoHang)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          setDataHangHoa(DataResults)
          setIsLoading(false)
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleAddInList()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleAddRow = (newRow) => {
    let dataNewRow
    setSelectedRowData((prevData) => {
      if (prevData.some((item) => item.MaHang === newRow.MaHang))
        dataNewRow = prevData.map((item) => {
          if (item.MaHang === newRow.MaHang) {
            return {
              ...item,
              SoLuong: ++item.SoLuong,
            }
            // toast.warning('Hàng hóa đã tồn tại ở bảng chi tiết', {
            //   autoClose: 1000,
            // })
          }
          return item
        })
      else {
        dataNewRow = [...prevData, { ...newRow, DVTDF: newRow.DVT, TyLeCKTT: 0, TienCKTT: 0 }]
        // toast.success('Chọn hàng hóa thành công', {
        //   autoClose: 1000,
        // })
      }
      return dataNewRow
    })

    setFormEdit((prev) => ({ ...prev, DataDetails: dataNewRow }))
  }

  const handleAddEmptyRow = () => {
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) return

    let emptyRow = {
      SoChungTu: '',
      MaHang: 'Chọn mã hàng',
      TenHang: 'Chọn tên hàng',
      DVT: '',
      SoLuong: 1,
      DonGia: 0,
      TienHang: 0,
      TyLeThue: 0,
      TienThue: 0,
      ThanhTien: 0,
      TyLeCKTT: 0,
      TienCKTT: 0,
      key: selectedRowData.length + dataHangHoa.length,
    }

    setSelectedRowData((prevData) => [...prevData, emptyRow])
    setFormEdit((prev) => ({ ...prev, DataDetails: emptyRow }))
  }

  const handleDoiTuongFocus = (selectedValue) => {
    setSelectedDoiTuong(selectedValue)

    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })
    if (actionType === 'create') {
      setFormCreate({
        ...formCreate,
        TenDoiTuong: selectedDoiTuongInfo?.Ten,
        DiaChi: selectedDoiTuongInfo?.DiaChi,
      })
      setErrors({ Ten: '', DiaChi: '' })
    }

    if (actionType === 'edit' && selectedValue !== 'NCVL') {
      setFormEdit({
        ...formEdit,
        TenDoiTuong: selectedDoiTuongInfo?.Ten,
        DiaChi: selectedDoiTuongInfo?.DiaChi,
      })
    } else if (actionType === 'edit' && selectedValue === 'NCVL') {
      setFormEdit({
        ...formEdit,
      })
      setErrors({ Ten: '', DiaChi: '' })
    }

    if (typePage === 'NTR') {
      if (actionType === 'edit' && selectedValue !== 'KHVL') {
        setFormEdit({
          ...formEdit,
          TenDoiTuong: selectedDoiTuongInfo?.Ten,
          DiaChi: selectedDoiTuongInfo?.DiaChi,
        })
      } else if (actionType === 'edit' && selectedValue === 'KHVL') {
        setFormEdit({
          ...formEdit,
        })
        setErrors({ Ten: '', DiaChi: '' })
      }
    }
  }

  const handleCreateAndClose = async () => {
    if (!selectedDoiTuong?.trim()) {
      setErrors({
        ...errors,
        DoiTuong: selectedDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
      })
      return
    }
    if (selectedDoiTuong === 'NCVL' || selectedDoiTuong === 'KHVL') {
      if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim()) {
        setErrors({
          Ten: formCreate?.TenDoiTuong?.trim() ? '' : 'Tên đối tượng không được để trống',
          DiaChi: formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
        })
        return
      }
    }
    if (selectedRowData.length <= 0) {
      toast.warning('Bảng chi tiết không được để trống')
      return
    }
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) {
      toast.warning('Mã hàng không được để trống, vui lòng chọn mã hàng!')
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const dataAddSTT = selectedRowData.map((item, index) => ({
        ...item,
        STT: index + 1,
      }))

      let response
      switch (typePage) {
        case 'PMH':
          response = await handleAPICreate(apis.ThemPMH, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await handleAPICreate(apis.ThemNTR, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await handleAPICreate(apis.ThemXTR, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          const soChungTu = DataResults[0].SoChungTu
          toast.success(DataErrorDescription)
          loading()
          setHightLight(soChungTu)
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleCreate = async () => {
    if (!selectedDoiTuong?.trim()) {
      setErrors({
        ...errors,
        DoiTuong: selectedDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
      })
      return
    }

    if (selectedDoiTuong === 'NCVL' || selectedDoiTuong === 'KHVL') {
      if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim()) {
        setErrors({
          Ten: formCreate?.TenDoiTuong?.trim() ? '' : 'Tên đối tượng không được để trống',
          DiaChi: formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
        })
        return
      }
    }

    if (selectedRowData.length <= 0) {
      toast.warning('Chi tiết phiếu không được để trống')
      return
    }
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) {
      toast.warning('Mã hàng không được để trống, vui lòng chọn mã hàng!')
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const dataAddSTT = selectedRowData.map((item, index) => ({
        ...item,
        STT: index + 1,
      }))

      let response
      switch (typePage) {
        case 'PMH':
          response = await handleAPICreate(apis.ThemPMH, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await handleAPICreate(apis.ThemNTR, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await handleAPICreate(apis.ThemXTR, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          const soChungTu = DataResults[0].SoChungTu
          toast.success(DataErrorDescription)
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setSelectedDoiTuong(null)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
          setSelectedKhoHang(dataKhoHang[0].MaKho)
          setSelectedRowData([])
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleCreate()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleAPICreate = async (apiFunc, tokenLogin, formCreate, dataAddSTT, selectedDoiTuong, selectedKhoHang) => {
    try {
      return await apiFunc(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
    } catch (error) {
      console.error('Error while adding data:', error)
      return null
    }
  }

  const handleEdit = async (dataRecord) => {
    if (selectedDoiTuong === 'NCVL' || selectedDoiTuong === 'KHVL') {
      if (!formEdit?.TenDoiTuong?.trim() || !formEdit?.DiaChi?.trim()) {
        setErrors({
          Ten: formEdit?.TenDoiTuong?.trim() ? '' : 'Tên đối tượng không được để trống',
          DiaChi: formEdit?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
        })
        return
      }
    }
    if (selectedRowData.length <= 0) {
      toast.warning('Bảng chi tiết không được để trống')
      return
    }
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) {
      toast.warning('Mã hàng không được để trống, vui lòng chọn mã hàng!')
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const dataAddSTT = selectedRowData.map((item, index) => ({
        ...item,
        STT: index + 1,
      }))

      let response
      switch (typePage) {
        case 'PMH':
          response = await handleAPIEdit(apis.SuaPMH, tokenLogin, dataRecord.SoChungTu, formEdit, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await handleAPIEdit(apis.SuaNTR, tokenLogin, dataRecord.SoChungTu, formEdit, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await handleAPIEdit(apis.SuaXTR, tokenLogin, dataRecord.SoChungTu, formEdit, dataAddSTT, selectedDoiTuong, selectedKhoHang)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleAPIEdit = async (apiFunc, tokenLogin, Sct, form, dataAddSTT, selectedDoiTuong, selectedKhoHang) => {
    try {
      return await apiFunc(tokenLogin, Sct, { ...form, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
    } catch (error) {
      console.error('Error while adding data:', error)
      return null
    }
  }

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'PMH':
          response = await handleAPICreateAndPay(apis.XoaPMH, tokenLogin, dataRecord.SoChungTu)
          break
        case 'NTR':
          response = await handleAPICreateAndPay(apis.XoaNTR, tokenLogin, dataRecord.SoChungTu)
          break
        case 'XTR':
          response = await handleAPICreateAndPay(apis.XoaXTR, tokenLogin, dataRecord.SoChungTu)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }
  const handlePay = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'PMH':
          response = await handleAPICreateAndPay(apis.LapPhieuChi, tokenLogin, dataRecord.SoChungTu)
          break
        case 'NTR':
          response = await handleAPICreateAndPay(apis.LapPhieuChiNTR, tokenLogin, dataRecord.SoChungTu)
          break
        case 'XTR':
          response = await handleAPICreateAndPay(apis.LapPhieuThuXTR, tokenLogin, dataRecord.SoChungTu)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }
  const handleAPICreateAndPay = async (apiFunc, tokenLogin, Sct) => {
    try {
      return await apiFunc(tokenLogin, Sct)
    } catch (error) {
      console.error('Error while adding data:', error)
      return null
    }
  }

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      let response
      switch (actionType) {
        case 'print':
          switch (typePage) {
            case 'PMH':
              response = await handleAPIPrint(apis.InPMH, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            case 'NTR':
              response = await handleAPIPrint(apis.InNTR, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            case 'XTR':
              response = await handleAPIPrint(apis.InXTR, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            case 'PBL':
              response = await handleAPIPrint(apis.InPBL, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            default:
              break
          }
          break
        case 'printWareHouse':
          switch (typePage) {
            case 'PMH':
              response = await handleAPIPrint(apis.InPK, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            case 'NTR':
              response = await handleAPIPrint(apis.InPKNTR, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            case 'XTR':
              response = await handleAPIPrint(apis.InPKXTR, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            case 'PBL':
              response = await handleAPIPrint(apis.InPKPBL, tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
              break
            default:
              break
          }
          break

        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          base64ToPDF(DataResults)
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handlePrint()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleAPIPrint = async (apiFunc, tokenLogin, form, selectedSctBD, selectedSctKT, lien) => {
    try {
      return await apiFunc(tokenLogin, form, selectedSctBD, selectedSctKT, lien)
    } catch (error) {
      console.error('Error while adding data:', error)
      return null
    }
  }

  const handlePrintInEdit = async () => {
    if (selectedDoiTuong === 'NCVL' || selectedDoiTuong === 'KHVL') {
      if (!formEdit?.TenDoiTuong?.trim() || !formEdit?.DiaChi?.trim()) {
        setErrors({
          Ten: formEdit?.TenDoiTuong?.trim() ? '' : 'Tên đối tượng không được để trống',
          DiaChi: formEdit?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
        })
        return
      }
    }
    if (selectedRowData.length <= 0) {
      toast.warning('Bảng chi tiết không được để trống')
      return
    }
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) {
      toast.warning('Mã hàng không được để trống, vui lòng chọn mã hàng!')
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'PMH':
          response = await apis.SuaPMH(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: selectedRowData }, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await apis.SuaNTR(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: selectedRowData }, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await apis.SuaXTR(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: selectedRowData }, selectedDoiTuong, selectedKhoHang)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          loading()
          setHightLight(dataRecord.SoChungTu)
          setSelectedRowData([])
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handlePrintInEdit()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2
    if (checkboxValues.checkbox3) total += 4
    return total
  }

  const handleTienMat = () => {
    setFormCreate((prevFormPMH) => {
      return {
        ...prevFormPMH,
        TTTienMat: !prevFormPMH.TTTienMat,
      }
    })
  }

  useEffect(() => {
    const handleFilterPrint = () => {
      console.log('formPrint', formPrintFilter)
      const ngayBD = dayjs(formPrintFilter.NgayBatDau)
      const ngayKT = dayjs(formPrintFilter.NgayKetThuc)

      // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
      const filteredData = data.filter((item) => {
        const itemDate = dayjs(item.NgayCTu)

        if (ngayBD.isValid() && ngayKT.isValid()) {
          return itemDate >= ngayBD && itemDate <= ngayKT
        }
      })
      setNewData(filteredData)
    }

    handleFilterPrint()
  }, [formPrintFilter?.NgayKetThuc, formPrintFilter?.NgayBatDau])

  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formPrint.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
      setFormPrint({
        ...formPrint,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayBatDau: startDate, NgayKetThuc: startDate })
    } else {
      setFormPrint({
        ...formPrint,
        NgayBatDau: startDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayBatDau: startDate })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formPrint.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, cập nhật ngày bắt đầu
      setFormPrint({
        ...formPrint,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayBatDau: endDate, NgayKetThuc: endDate })
    } else {
      setFormPrint({
        ...formPrint,
        NgayKetThuc: endDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayKetThuc: endDate })
    }
  }

  const handleEditData = (data) => {
    setSelectedRowData(data)
  }
  const handleChangLoading = (newLoading) => {
    setIsLoading(newLoading)
  }
  const handlePrintModal = () => {
    if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim() || selectedRowData.length <= 0) return
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) return

    setIsShowModalOnlyPrint(true)
  }
  const handlePrintWareHouseModal = () => {
    if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim() || selectedRowData.length <= 0) return
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) return

    setIsShowModalOnlyPrintWareHouse(true)
  }
  const handleSctBDChange = (value) => {
    setSelectedSctBD(value)

    if (selectedSctKT !== 'Chọn số chứng từ' && value > selectedSctKT) {
      setSelectedSctKT(value)
    }
  }

  const handleSctKTChange = (value) => {
    setSelectedSctKT(value)

    if (selectedSctBD !== 'Chọn số chứng từ' && value < selectedSctBD) {
      setSelectedSctBD(value)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {(actionType === 'delete' || actionType === 'pay') && (
            <div className=" flex justify-between items-center ">
              <label>
                {`${actionType === 'delete' ? 'Bạn có chắc muốn xóa phiếu' : typePage === 'XTR' ? 'Bạn có chắc muốn lập phiếu thu' : 'Bạn có chắc muốn lập phiếu chi'}`}
                <span className="font-bold mx-1"> {dataRecord.SoChungTu}</span>
                không ?
              </label>
              <div></div>
            </div>
          )}

          {(actionType === 'print' || actionType === 'printWareHouse') && (
            <div className=" h-[244px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">{`${actionType === 'print' ? `In - ${namePage}` : `In - ${namePage} (kho)`}`}</label>
              </div>
              <div className="border-2 my-1">
                <div className="p-4 ">
                  <div className=" flex justify-center items-center  gap-3 pl-[52px]">
                    {/* DatePicker */}
                    <div className="flex gap-x-5 items-center">
                      <label htmlFor="">Ngày</label>
                      <DateField
                        className="DatePicker_PMH max-w-[170px]"
                        format="DD/MM/YYYY"
                        // maxDate={dayjs(controlDate.NgayKetThuc)}
                        value={dayjs(formPrint.NgayBatDau)}
                        onChange={(newDate) => {
                          setFormPrint({
                            ...formPrint,
                            NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                          })
                        }}
                        onBlur={() => {
                          handleStartDateChange(formPrint.NgayBatDau)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleStartDateChange(formPrint.NgayBatDau)
                          }
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
                    <div className="flex gap-x-5 items-center ">
                      <label htmlFor="">Đến</label>
                      <DateField
                        className="DatePicker_PMH max-w-[170px]"
                        format="DD/MM/YYYY"
                        // minDate={dayjs(controlDate.NgayBatDau)}
                        value={dayjs(formPrint.NgayKetThuc)}
                        onChange={(newDate) => {
                          setFormPrint({
                            ...formPrint,
                            NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                          })
                        }}
                        onBlur={() => {
                          handleEndDateChange(formPrint.NgayKetThuc)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleEndDateChange(formPrint.NgayKetThuc)
                          }
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
                  {actionType === 'print' ? (
                    <div className="flex  mt-4 ">
                      <div className="flex ">
                        <label className="pr-[23px]">Số chứng từ</label>

                        <Select size="small" showSearch optionFilterProp="children" style={{ width: '170px' }} onChange={handleSctBDChange} value={selectedSctBD}>
                          {newData?.map((item) => (
                            <Option key={item.SoChungTu} value={item.SoChungTu}>
                              {item.SoChungTu}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex ">
                        <label className="pl-[18px] pr-[18px]">Đến</label>

                        <Select size="small" showSearch optionFilterProp="children" style={{ width: '170px' }} onChange={handleSctKTChange} value={selectedSctKT}>
                          {newData?.map((item) => (
                            <Option key={item.SoChungTu} value={item.SoChungTu}>
                              {item.SoChungTu}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex  mt-4 ">
                      <div className="flex ">
                        <label className="pr-[23px]">Số chứng từ</label>

                        <Select
                          size="small"
                          showSearch
                          optionFilterProp="children"
                          style={{ width: '170px' }}
                          value={selectedSctBD}
                          popupMatchSelectWidth={false}
                          onChange={handleSctBDChange}
                        >
                          {newData?.map((item) => (
                            <Option key={item.SoChungTu} value={item.SoChungTu}>
                              {`${item.SoChungTu}_GV`}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex ">
                        <label className="pl-[18px] pr-[18px]">Đến</label>

                        <Select
                          size="small"
                          showSearch
                          optionFilterProp="children"
                          style={{ width: '170px' }}
                          value={selectedSctKT}
                          onChange={handleSctKTChange}
                          popupMatchSelectWidth={false}
                        >
                          {newData?.map((item) => (
                            <Option key={item.SoChungTu} value={item.SoChungTu}>
                              {`${item.SoChungTu}_GV`}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* liên */}
                  <div className="flex justify-center  gap-6 mt-4">
                    {/*  */}
                    <div>
                      <Checkbox
                        value="checkbox1"
                        checked={checkboxValues.checkbox1}
                        onChange={(e) =>
                          setCheckboxValues((prevValues) => ({
                            ...prevValues,
                            [e.target.value]: !prevValues[e.target.value],
                          }))
                        }
                      >
                        Liên 1
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        value="checkbox2"
                        checked={checkboxValues.checkbox2}
                        onChange={(e) =>
                          setCheckboxValues((prevValues) => ({
                            ...prevValues,
                            [e.target.value]: !prevValues[e.target.value],
                          }))
                        }
                      >
                        Liên 2
                      </Checkbox>
                    </div>
                    {actionType === 'print' && (
                      <div>
                        <Checkbox
                          value="checkbox3"
                          checked={checkboxValues.checkbox3}
                          onChange={(e) =>
                            setCheckboxValues((prevValues) => ({
                              ...prevValues,
                              [e.target.value]: !prevValues[e.target.value],
                            }))
                          }
                        >
                          Liên 3
                        </Checkbox>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2 gap-2">
                {actionType === 'print' ? (
                  <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />
                ) : (
                  <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />
                )}
                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'view' && (
            <div className=" w-[90vw] h-[600px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
              </div>
              <Spin spinning={isLoadingModal}>
                <div className="border w-full h-[90%] rounded-sm text-sm">
                  <div className="flex  md:gap-0 lg:gap-1 pl-1">
                    {/* thong tin phieu */}
                    <div className="w-[62%]">
                      <div className="flex p-1  ">
                        <div className=" flex items-center ">
                          <label className="w-[110px]">Số C.từ</label>
                          <input
                            disabled
                            type="text"
                            className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px] truncate"
                            value={dataThongTin?.SoChungTu}
                          />
                        </div>
                        {/* DatePicker */}
                        <div className="flex md:px-1 lg:px-4 items-center">
                          <label className=" px-3  text-center ">Ngày</label>
                          <DateField
                            className="DatePicker_PMH  max-w-[110px]"
                            format="DD/MM/YYYY"
                            value={dayjs(dataThongTin?.NgayCTu)}
                            disabled
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
                      <div className="p-1 flex justify-between items-center">
                        <label form="doituong" className="w-[86px]">
                          Đối tượng
                        </label>
                        <input
                          disabled
                          type="text"
                          className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                          value={`${dataThongTin.MaDoiTuong}- ${dataThongTin.TenDoiTuong}`}
                        />
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <label className="w-[86px]">Tên</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.TenDoiTuong} />
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <label className="w-[86px]">Địa chỉ</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.DiaChi} />
                      </div>
                    </div>

                    {/* thong tin cap nhat */}
                    <div className="w-[38%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center px-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                            <Tooltip title={dataThongTin?.NguoiTao} color="blue">
                              <input
                                disabled
                                type="text"
                                className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                value={dataThongTin?.NguoiTao}
                                readOnly
                              />
                            </Tooltip>
                          </div>

                          <div className="flex items-center p-1">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <Tooltip
                              title={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate "
                                value={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                            <Tooltip title={dataThongTin?.NguoiSuaCuoi} color="blue">
                              <input
                                disabled
                                type="text"
                                className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]  truncate"
                                value={dataThongTin?.NguoiSuaCuoi}
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <Tooltip
                              title={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                value={
                                  dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''
                                }
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* kho and ghi chu */}
                  <div className="flex gap-3 pl-1 lg:pr-[6px] items-center  w-full">
                    <div className="p-1 flex  items-center md:w-[35%] lg:w-[20%]">
                      <label form="khohang" className="md:w-[104px] lg:w-[110px] ">
                        Kho hàng
                      </label>
                      <select readOnly className="  border w-full  bg-[#fafafa] rounded-[4px] h-[24px]">
                        <option value="ThongTinKho">
                          {dataThongTin?.MaKho} - {dataThongTin?.TenKho}
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center p-1 md:w-[65%] lg:w-[80%]">
                      <label className="w-[70px]">Ghi chú</label>
                      <input disabled type="are" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.GhiChu} />
                    </div>
                  </div>
                  {/* table */}
                  <div className="pt-4">
                    <Table
                      loading={loading}
                      className="table_view"
                      dataSource={dataThongTin?.DataDetails}
                      columns={columns}
                      size="small"
                      scroll={{
                        x: 1000,
                        y: 220,
                      }}
                      bordered
                      pagination={false}
                      summary={(pageData) => {
                        let totalThanhTien = 0
                        let totalTienHang = 0
                        let totalSoLuong = 0
                        let totalDonGia = 0
                        let totalTienThue = 0
                        let totalTyLeThue = 0

                        pageData.forEach(({ ThanhTien, TienHang, SoLuong, DonGia, TienThue, TyLeThue }) => {
                          totalDonGia += DonGia
                          totalTienHang += TienHang
                          totalSoLuong += SoLuong
                          totalThanhTien += ThanhTien
                          totalTienThue += TienThue
                          totalTyLeThue += TyLeThue
                        })
                        return (
                          <Table.Summary fixed="bottom">
                            <Table.Summary.Row className="text-end font-bold bg-[#f1f1f1]">
                              <Table.Summary.Cell className="text-center"></Table.Summary.Cell>
                              <Table.Summary.Cell></Table.Summary.Cell>
                              <Table.Summary.Cell index={2}></Table.Summary.Cell>
                              <Table.Summary.Cell index={3}></Table.Summary.Cell>
                              <Table.Summary.Cell index={4}>{formatQuantity(totalSoLuong, dataThongSo?.SOLESOLUONG)}</Table.Summary.Cell>
                              <Table.Summary.Cell index={5}>{formatPrice(totalDonGia, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                              <Table.Summary.Cell index={6}>{formatPrice(totalTienHang, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                              <Table.Summary.Cell index={7}>{formatQuantity(totalTyLeThue, dataThongSo?.SOLETYLE)}</Table.Summary.Cell>
                              <Table.Summary.Cell index={8}>{formatPrice(totalTienThue, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                              <Table.Summary.Cell>{formatPrice(totalThanhTien, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                            </Table.Summary.Row>
                          </Table.Summary>
                        )
                      }}
                    ></Table>
                  </div>
                </div>
              </Spin>
              {/* button */}
              <div className="flex justify-between items-center  pt-3">
                <div className="flex gap-x-3   ">
                  <button
                    onClick={() => setIsShowModalOnlyPrint(true)}
                    className="flex items-center  py-1 px-2  rounded-md  border-2 border-purple-500 text-slate-50 text-text-main font-bold  bg-purple-500 hover:bg-white hover:text-purple-500"
                  >
                    <div className="pr-1">
                      <TiPrinter size={20} />
                    </div>
                    <div>In phiếu</div>
                  </button>
                  {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                    <button
                      onClick={() => setIsShowModalOnlyPrintWareHouse(true)}
                      className="flex items-center  py-1 px-2  rounded-md  border-2 border-purple-500 text-slate-50 text-text-main font-bold  bg-purple-500 hover:bg-white hover:text-purple-500"
                    >
                      <div className="pr-1">
                        <TiPrinter size={20} />
                      </div>
                      <div>In phiếu kho</div>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
          {actionType === 'create' && (
            <div className=" w-[90vw] h-[600px] ">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage ? namePage : 'Phiếu ?'}</label>
              </div>

              <Spin spinning={isLoadingModal}>
                <div className="border w-full h-[89%] rounded-sm text-sm">
                  <div className="flex md:gap-0 lg:gap-1 pl-1 ">
                    {/* thong tin phieu */}
                    <div className="w-[62%]">
                      <div className="flex p-1  ">
                        <div className="flex items-center ">
                          <label className="md:w-[72px] lg:w-[60%] pr-1">Số C.từ</label>
                          <input readOnly type="text" className="md:w-[50px] lg:w-full border border-gray-300 outline-none bg-[#fafafa] rounded-[4px] h-[24px]" />
                        </div>
                        {/* DatePicker */}
                        <div className="flex md:px-1 lg:px-4 items-center">
                          <label className="pr-1 lg:pr-[30px] lg:pl-[8px]">Ngày</label>
                          <DateField
                            className="DatePicker_PMH max-w-[110px]"
                            format="DD/MM/YYYY"
                            defaultValue={dayjs()}
                            onChange={(newDate) => {
                              setFormCreate({
                                ...formCreate,
                                NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
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

                        <div className="flex  items-center ">
                          <Checkbox className="w-full " checked={formCreate.TTTienMat} onChange={handleTienMat}>
                            Tiền mặt
                          </Checkbox>
                        </div>
                      </div>
                      <div className="p-1 flex  ">
                        <label form="doituong" className="w-[86px]">
                          Đối tượng
                        </label>

                        <Select
                          className="w-full"
                          status={errors.DoiTuong ? 'error' : ''}
                          placeholder={errors.DoiTuong}
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          onChange={(value) => handleDoiTuongFocus(value)}
                          value={selectedDoiTuong}
                          // listHeight={280}
                        >
                          {dataDoiTuong?.map((item) => (
                            <Option key={item.Ma} value={item.Ma}>
                              {item.Ma} - {item.Ten}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex items-center  p-1">
                        <label className="w-[86px]">Tên</label>
                        <input
                          placeholder={errors.Ten}
                          type="text"
                          className={`w-full border-[1px] outline-none px-2 rounded-[4px] h-[24px] border-gray-300
                                     ${
                                       ((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]') ||
                                       (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                                     }
                                     ${(typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && errors.Ten ? 'border-red-500' : ''} 
                                     ${typePage === 'NTR' && selectedDoiTuong === 'KHVL' && errors.Ten ? 'border-red-500' : ''} 
                                      `}
                          value={
                            typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                              ? formCreate.TenDoiTuong
                              : (typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL'
                                ? formCreate.TenDoiTuong
                                : doiTuongInfo.Ten
                          }
                          onChange={(e) => {
                            setFormCreate({
                              ...formCreate,
                              TenDoiTuong: e.target.value,
                            })
                            setErrors({ ...errors, Ten: '' })
                          }}
                          disabled={((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
                        />
                      </div>
                      <div className="flex  items-center p-1">
                        <label className="w-[86px]">Địa chỉ</label>
                        <input
                          placeholder={errors.DiaChi}
                          type="text"
                          className={`w-full border-[1px] outline-none px-2 rounded-[4px] h-[24px] border-gray-300
                                     ${
                                       ((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]') ||
                                       (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                                     }
                                     ${(typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && errors.DiaChi ? 'border-red-500' : ''} 
                                     ${typePage === 'NTR' && selectedDoiTuong === 'KHVL' && errors.DiaChi ? 'border-red-500' : ''} 
                                      `}
                          value={
                            (typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL'
                              ? formCreate.DiaChi
                              : typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                                ? formCreate.DiaChi
                                : doiTuongInfo.DiaChi
                          }
                          onChange={(e) => {
                            setFormCreate({
                              ...formCreate,
                              DiaChi: e.target.value,
                            })
                            setErrors({ ...errors, DiaChi: '' })
                          }}
                          disabled={((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
                        />
                      </div>
                    </div>
                    {/* thong tin cap nhat */}
                    <div className="w-[38%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                            <input disabled type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>

                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <input disabled type="text" className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                            <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>
                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* kho hang and Ghi chu */}
                  <div className="flex gap-3 pl-1 lg:pr-[6px] items-center  w-full">
                    <div className="p-1 flex  items-center ">
                      <label form="khohang" className="md:w-[98px] lg:w-[110px]">
                        Kho hàng
                      </label>

                      <Select className="w-full" showSearch size="small" optionFilterProp="children" onChange={(value) => setSelectedKhoHang(value)} value={selectedKhoHang}>
                        {dataKhoHang?.map((item) => (
                          <Option key={item.MaKho} value={item.MaKho}>
                            {item.ThongTinKho}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center p-1 w-full">
                      <label className="w-[70px]">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]"
                        value={formCreate.GhiChu}
                        onChange={(e) =>
                          setFormCreate({
                            ...formCreate,
                            GhiChu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* table */}
                  <div className=" pb-0  relative mt-1">
                    <Tooltip
                      placement="topLeft"
                      title={isAdd ? 'Vui lòng chọn hàng hóa hoặc F9 để chọn từ danh sách' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách!'}
                      color="blue"
                    >
                      <FloatButton
                        className="absolute z-3 bg-transparent w-[26px] h-[26px]"
                        style={{
                          right: 12,
                          top: 8,
                        }}
                        type={`${isAdd ? 'default' : 'primary'}`}
                        icon={<IoMdAddCircle />}
                        onClick={handleAddEmptyRow}
                      />
                    </Tooltip>
                    <TableEdit
                      typeTable="create"
                      typeAction="create"
                      className="table_cre"
                      tableName={typePage === 'XTR' ? 'BanHang' : ''}
                      param={selectedRowData}
                      handleEditData={handleEditData}
                      ColumnTable={columnName}
                      columName={nameColumsPhieuMuaHang}
                      yourMaHangOptions={dataHangHoa}
                      yourTenHangOptions={dataHangHoa}
                    />
                  </div>
                </div>
              </Spin>
              {/* button  */}
              <div className="flex justify-between items-center">
                <div className="flex gap-x-3 pt-3">
                  <ActionButton
                    color={'slate-50'}
                    title={'In phiếu'}
                    background={'purple-500'}
                    bg_hover={'white'}
                    color_hover={'purple-500'}
                    handleAction={() => {
                      handleCreate(), handlePrintModal()
                    }}
                    isModal={true}
                  />
                  {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                    <ActionButton
                      color={'slate-50'}
                      title={'In phiếu kho'}
                      background={'purple-500'}
                      bg_hover={'white'}
                      color_hover={'purple-500'}
                      handleAction={() => {
                        handleCreate(), handlePrintWareHouseModal()
                      }}
                      isModal={true}
                    />
                  )}
                </div>

                <div className="flex justify-end items-center gap-3  pt-3">
                  <ActionButton color={'slate-50'} title={'Lưu'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
                  <ActionButton
                    color={'slate-50'}
                    title={'Lưu & Đóng'}
                    isModal={true}
                    background={'bg-main'}
                    bg_hover={'white'}
                    color_hover={'bg-main'}
                    handleAction={handleCreateAndClose}
                  />

                  <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
                </div>
              </div>
            </div>
          )}
          {actionType === 'edit' && (
            <>
              {isLoadingEdit ? (
                <SimpleBackdrop />
              ) : (
                <div className=" w-[90vw] h-[600px] ">
                  <div className="flex gap-2">
                    <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                    <label className="text-blue-700 font-semibold uppercase pb-1">sửa - {namePage}</label>
                  </div>

                  <div className=" border w-full h-[89%] rounded-sm text-sm">
                    <div className="flex  md:gap-0 lg:gap-1 pl-1 ">
                      {/* thong tin phieu */}
                      <div className="w-[62%] ">
                        <div className="flex p-1  ">
                          <div className=" flex items-center">
                            <label className="md:w-[106px] lg:w-[110px] pr-1">Số C.từ</label>
                            <input
                              readOnly
                              type="text"
                              className="w-full border border-gray-300 outline-none  px-2   bg-[#fafafa] rounded-[4px] h-[24px]"
                              value={dataThongTinSua?.SoChungTu}
                              onChange={(e) =>
                                setFormEdit({
                                  ...formEdit,
                                  SoChungTu: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* DatePicker */}
                          <div className="flex md:px-1 lg:px-4 items-center">
                            <label className="pr-1 lg:pr-[30px] lg:pl-[8px]">Ngày</label>
                            <DateField
                              className="DatePicker_PMH  max-w-[110px]"
                              format="DD/MM/YYYY"
                              defaultValue={dayjs(dataThongTinSua.NgayCTu)}
                              onChange={(newDate) => {
                                setFormEdit({
                                  ...formEdit,
                                  NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
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
                        </div>
                        <div className="p-1 flex ">
                          <label form="doituong" className="w-[86px]">
                            Đối tượng
                          </label>
                          <Select
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={(value) => handleDoiTuongFocus(value)}
                            style={{ width: '100%' }}
                            value={selectedDoiTuong}
                          >
                            {dataDoiTuong?.map((item) => (
                              <Option key={item.Ma} value={item.Ma}>
                                {item.Ma} - {item.Ten}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center   p-1">
                          <label className="w-[86px]">Tên</label>
                          <input
                            placeholder={errors.Ten}
                            type="text"
                            className={`w-full border-[1px] outline-none px-2 rounded-[4px] h-[24px] border-gray-300
                                       ${
                                         ((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]') ||
                                         (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                                       }
                                       ${(typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && errors.Ten ? 'border-red-500' : ''} 
                                       ${typePage === 'NTR' && selectedDoiTuong === 'KHVL' && errors.Ten ? 'border-red-500' : ''} 
                                        `}
                            value={
                              (typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL'
                                ? formEdit.TenDoiTuong
                                : typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                                  ? formEdit.TenDoiTuong
                                  : doiTuongInfo.Ten
                            }
                            onChange={(e) => {
                              {
                                setFormEdit({
                                  ...formEdit,
                                  TenDoiTuong: e.target.value,
                                })
                                setErrors({ ...errors, Ten: '' })
                              }
                            }}
                            disabled={((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
                          />
                        </div>
                        <div className="flex  items-center  p-1">
                          <label className="w-[86px]">Địa chỉ</label>
                          <input
                            placeholder={errors.DiaChi}
                            type="text"
                            className={`w-full border-[1px] outline-none px-2 rounded-[4px] h-[24px] border-gray-300
                                       ${
                                         ((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]') ||
                                         (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                                       }
                                       ${(typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL' && errors.DiaChi ? 'border-red-500' : ''} 
                                       ${typePage === 'NTR' && selectedDoiTuong === 'KHVL' && errors.DiaChi ? 'border-red-500' : ''} 
                                        `}
                            value={
                              (typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong === 'NCVL'
                                ? formEdit.DiaChi
                                : typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                                  ? formEdit.DiaChi
                                  : doiTuongInfo.DiaChi
                            }
                            onChange={(e) => {
                              {
                                setFormEdit({
                                  ...formEdit,
                                  DiaChi: e.target.value,
                                })
                                setErrors({ ...errors, DiaChi: '' })
                              }
                            }}
                            disabled={((typePage === 'PMH' || typePage === 'XTR') && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
                          />
                        </div>
                      </div>
                      {/* thong tin cap nhat */}
                      <div className="w-[38%] py-1 box_content">
                        <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                        <div className="rounded-md w-[98%]  box_capnhat px-1 py-3">
                          <div className="flex justify-between items-center ">
                            <div className="flex items-center p-1  ">
                              <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                              <Tooltip title={dataThongTinSua?.NguoiTao} color="blue">
                                <input
                                  disabled
                                  value={dataThongTinSua?.NguoiTao}
                                  type="text"
                                  className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                />
                              </Tooltip>
                            </div>

                            <div className="flex items-center p-1">
                              <label className="w-[30px] pr-1">Lúc</label>
                              <Tooltip
                                title={dataThongTinSua?.NgayTao && moment(dataThongTinSua.NgayTao).isValid() ? moment(dataThongTinSua.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                                color="blue"
                              >
                                <input
                                  disabled
                                  value={dataThongTinSua?.NgayTao && moment(dataThongTinSua.NgayTao).isValid() ? moment(dataThongTinSua.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                                  type="text"
                                  className=" w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                />
                              </Tooltip>
                            </div>
                          </div>
                          <div className="flex justify-between items-center ">
                            <div className="flex items-center p-1  ">
                              <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                              <input disabled type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" />
                            </div>
                            <div className="flex items-center p-1 ">
                              <label className="w-[30px] pr-1">Lúc</label>
                              <input disabled type="text" className=" w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* kho hang and ghi chu */}
                    <div className="flex gap-3 pl-1 lg:pr-[6px] items-center  w-full">
                      <div className="p-1 flex  items-center ">
                        <label form="khohang" className="md:w-[100px] lg:w-[110px]">
                          Kho hàng
                        </label>

                        <Select
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          onChange={(value) => setSelectedKhoHang(value)}
                          style={{ width: '100%' }}
                          value={selectedKhoHang}
                        >
                          {dataKhoHang?.map((item) => (
                            <Option key={item.MaKho} value={item.MaKho}>
                              {item.ThongTinKho}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex items-center p-1 w-full">
                        <label className="w-[70px]">Ghi chú</label>
                        <input
                          type="text"
                          className="w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px]  hover:border-[#4897e6] h-[24px]"
                          defaultValue={dataThongTinSua.GhiChu}
                          onChange={(e) =>
                            setFormEdit({
                              ...formEdit,
                              GhiChu: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* table */}
                    <div className=" pb-0  relative mt-1">
                      <Tooltip
                        placement="topLeft"
                        title={isAdd ? 'Vui lòng chọn hàng hóa hoặc F9 để chọn từ danh sách' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách!'}
                        color="blue"
                      >
                        <FloatButton
                          className="absolute z-3 bg-transparent w-[26px] h-[26px]"
                          style={{
                            right: 12,
                            top: 8,
                          }}
                          type={`${isAdd ? 'default' : 'primary'}`}
                          icon={<IoMdAddCircle />}
                          onClick={handleAddEmptyRow}
                        />
                      </Tooltip>
                      <TableEdit
                        param={selectedRowData}
                        handleEditData={handleEditData}
                        ColumnTable={columnName}
                        typeTable={'edit'}
                        tableName={typePage === 'XTR' ? 'BanHang' : ''}
                        columName={nameColumsPhieuMuaHang}
                        yourMaHangOptions={dataHangHoa}
                        yourTenHangOptions={dataHangHoa}
                      />
                    </div>
                  </div>

                  {/* button  */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 pt-3">
                      <ActionButton
                        color={'slate-50'}
                        title={'In phiếu'}
                        background={'purple-500'}
                        bg_hover={'white'}
                        color_hover={'purple-500'}
                        handleAction={() => {
                          handlePrintInEdit(), handlePrintModal()
                        }}
                        isModal={true}
                      />
                      {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                        <ActionButton
                          color={'slate-50'}
                          title={'In phiếu kho'}
                          background={'purple-500'}
                          bg_hover={'white'}
                          color_hover={'purple-500'}
                          handleAction={() => {
                            handlePrintInEdit(), handlePrintWareHouseModal()
                          }}
                          isModal={true}
                        />
                      )}
                    </div>
                    <div className="flex justify-end items-center gap-x-3  pt-3">
                      <ActionButton
                        color={'slate-50'}
                        title={'Lưu & Đóng'}
                        isModal={true}
                        background={'bg-main'}
                        bg_hover={'white'}
                        color_hover={'bg-main'}
                        handleAction={() => handleEdit(dataRecord)}
                      />

                      <ActionButton
                        color={'slate-50'}
                        title={'Đóng'}
                        isModal={true}
                        background={'red-500'}
                        bg_hover={'white'}
                        color_hover={'red-500'}
                        handleAction={() => close()}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {actionType === 'delete' ? (
            <div className="flex justify-end mt-4 gap-2">
              <ActionButton
                color={'slate-50'}
                title={'Xác nhận'}
                isModal={true}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                handleAction={() => handleDelete(dataRecord)}
              />

              <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          ) : (
            actionType === 'pay' && (
              <div className="flex justify-end mt-4 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handlePay(dataRecord)}
                />
                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            )
          )}
        </div>

        {isShowModalHH && (
          <ModalHH
            close={() => setIsShowModalHH(false)}
            data={dataHangHoa}
            onRowCreate={handleAddRow}
            dataThongSo={dataThongSo}
            controlDate={controlDate}
            loading={isLoading}
            onChangLoading={handleChangLoading}
          />
        )}
        {isShowModalOnlyPrint && (
          <ModalOnlyPrint
            typePage={typePage}
            namePage={namePage}
            close={() => setIsShowModalOnlyPrint(false)}
            dataThongTin={actionType === 'edit' ? dataThongTinSua : dataThongTin}
            data={data}
            actionType={actionType}
            close2={() => close()}
            SctCreate={SctCreate}
          />
        )}
        {isShowModalOnlyPrintWareHouse && (
          <ModalOnlyPrintWareHouse
            typePage={typePage}
            namePage={namePage}
            close={() => setIsShowModalOnlyPrintWareHouse(false)}
            dataThongTin={actionType === 'edit' ? dataThongTinSua : dataThongTin}
            data={data}
            controlDate={controlDate}
            actionType={actionType}
            close2={() => close()}
            SctCreate={SctCreate}
          />
        )}
      </div>
    </>
  )
}

export default Modals
