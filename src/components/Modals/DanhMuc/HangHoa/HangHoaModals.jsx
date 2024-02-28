/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { IoMdAddCircle } from 'react-icons/io'
import { CloseSquareFilled } from '@ant-design/icons'
import { Checkbox, Select, Space, InputNumber, FloatButton, Input, Tooltip, Table } from 'antd'
import moment from 'moment'
import './HangHoaModals.css'
import { useSearch } from '../../../hooks/Search'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import HighlightedCell from '../../../hooks/HighlightedCell'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
import { RETOKEN, base64ToPDF } from '../../../../action/Actions'
import TextArea from 'antd/es/input/TextArea'

const HangHoaModals = ({ close, type, getMaHang, getDataHangHoa, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataView, setDataView] = useState({})
  const [nhomHang, setNhomHang] = useState([])
  const [dVTKho, setDVTKho] = useState()
  const [dVTQuyDoi, setDVTQuyDoi] = useState()
  const [HangHoaCT, setHangHoaCT] = useState()
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedBarCodeFrom, setSelectedBarCodeFrom] = useState(null)
  const [selectedBarCodeTo, setSelectedBarCodeTo] = useState(null)
  const [selectedBarCodeList, setSelectedBarCodeList] = useState([])
  const [selectednhomFrom, setSelectednhomFrom] = useState(null)
  const [selectednhomTo, setSelectednhomTo] = useState(null)
  const [selectednhomList, setSelectednhomList] = useState([])
  const [lastNumber13Main, setLastNumber13Main] = useState('')
  const [selectedTem, setSelectedTem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(HangHoaCT)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [isShowSearch, setIsShowSearch] = useState(false)

  const initProduct = {
    Nhom: '',
    MaHang: '',
    TenHang: '',
    DVTKho: '',
    DVTQuyDoi: '',
    TyLeQuyDoi: 1,
    MaVach: '',
    DienGiaiHangHoa: '',
    LapRap: false,
    TonKho: true,
    NA: false,
    GhiChu: '',
    Barcodes: [{ MaVach: '', LastNum: 0, NA: false }],
    HangHoa_CTs: [{ MaHangChiTiet: '', SoLuong: 1, DVT: 'Rổng' }],
  }
  const [hangHoaForm, setHangHoaForm] = useState(() => {
    return getMaHang ? { ...getMaHang, MaVach: getMaHang?.MaVach } : initProduct
  })
  const [errors, setErrors] = useState({
    Nhom: '',
    MaHang: '',
    TenHang: '',
    DVTKho: '',
    MaVach: '',
    SoTem: '',
    GiaTriMoi: '',
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    if (type === 'create' || type === 'edit') {
      const handleKeyDown = (event) => {
        if (event.keyCode === 120) {
          setIsShowModal(true)
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isShowModal])

  useEffect(() => {
    if (type === 'create') {
      setHangHoaForm({ ...hangHoaForm, TonKho: true, LapRap: false, TyLeQuyDoi: 1 })
    }
  }, [type, getMaHang, hangHoaForm.Barcodes])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const dataNH = await categoryAPI.ListNhomHang(TokenAccess)
        if (dataNH.data.DataError == 0) {
          setNhomHang(dataNH.data.DataResults)
        }
        const dataDVT = await categoryAPI.ListDVT(TokenAccess)
        if (dataDVT.data.DataError == 0) {
          setDVTQuyDoi(dataDVT.data.DataResults)
          setDVTKho(dataDVT.data.DataResults)
        }
        setIsLoading(true)
      } catch (error) {
        console.log(error)
      }
    }
    if (!isLoading) {
      getListHelper()
    }
  }, [isLoading])

  useEffect(() => {
    const getListHHCT = async () => {
      try {
        setTableLoad(true)
        const dataHHCT = await categoryAPI.ListHangHoaCT(TokenAccess)
        if (dataHHCT.data.DataError == 0) {
          setHangHoaCT(dataHHCT.data.DataResults)
          setTableLoad(false)
        }
      } catch (error) {
        console.log(error)
        setTableLoad(false)
      }
    }
    getListHHCT()
  }, [searchHangHoa])

  useEffect(() => {
    handleView()
  }, [])

  useEffect(() => {
    if (type === 'create' && JSON.stringify(hangHoaForm.HangHoa_CTs) !== JSON.stringify(selectedRowData)) {
      setHangHoaForm((prev) => ({
        ...prev,
        HangHoa_CTs: selectedRowData,
      }))
    } else if (type === 'edit' && JSON.stringify(dataView.HangHoa_CTs) !== JSON.stringify(selectedRowData)) {
      setDataView((prev) => ({
        ...prev,
        HangHoa_CTs: selectedRowData,
      }))
    }
  }, [selectedRowData, type])

  useEffect(() => {
    if (type == 'edit') {
      if (dataView?.HangHoa_CTs) {
        setSelectedRowData([...dataView.HangHoa_CTs])
      }
    }
  }, [dataView])

  // functions
  const getMaVach13 = async (number) => {
    try {
      const response = await categoryAPI.GetBarCode13(
        {
          Ma: number,
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        return response.data.DataResult
      }
      return 0
    } catch (error) {
      console.log(error)
    }
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  const handleSearch = (event) => {
    setTableLoad(true)
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchHangHoa(event.target.value)
    }, 300)
  }
  // Table Barcode
  const isAddBarCode = useMemo(() => hangHoaForm.Barcodes?.map((item) => item.MaVach).includes(''), [hangHoaForm.Barcodes])
  const isAddBarCodeEdit = useMemo(() => dataView.Barcodes?.map((item) => item.MaVach).includes(''), [dataView.Barcodes])

  const handleBarcodeChange = (index, key, value) => {
    if (type == 'create') {
      const updatedBarcodes = [...hangHoaForm.Barcodes]
      if (key == 'MaVach' && value.length == 12) {
        getMaVach13(value).then((getLast) => {
          updatedBarcodes[index]['LastNum'] = getLast
          updatedBarcodes[index][key] = value + getLast
        })
      }
      updatedBarcodes[index][key] = value
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: updatedBarcodes,
      })
    } else {
      const updatedBarcodes = [...dataView.Barcodes]
      if (key == 'MaVach' && value.length == 12) {
        getMaVach13(value).then((getLast) => {
          updatedBarcodes[index]['LastNum'] = getLast
          updatedBarcodes[index][key] = value + getLast
        })
      }
      updatedBarcodes[index][key] = value
      setDataView({
        ...dataView,
        Barcodes: updatedBarcodes,
      })
    }
  }
  const addBarcodeRow = () => {
    const addBarcode = Array.isArray(hangHoaForm.Barcodes) ? [...hangHoaForm.Barcodes] : []
    if (type == 'create') {
      if (hangHoaForm.Barcodes?.map((item) => item.MaVach).includes('')) return
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: [...addBarcode, { MaVach: '', LastNum: 0, NA: false }],
      })
    } else {
      if (dataView.Barcodes?.map((item) => item.MaVach).includes('')) return
      setDataView({
        ...dataView,
        Barcodes: [...dataView.Barcodes, { MaVach: '', NA: false }],
      })
    }
  }
  const removeBarcode = (index) => {
    if (type == 'create') {
      const updatedBarcodes = [...hangHoaForm.Barcodes]
      updatedBarcodes.splice(index, 1)
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: updatedBarcodes,
      })
    } else {
      const updatedBarcodes = [...dataView.Barcodes]
      updatedBarcodes.splice(index, 1)
      setDataView({
        ...dataView,
        Barcodes: updatedBarcodes,
      })
    }
  }
  // Table HHCT
  const isAddHHCT = useMemo(() => selectedRowData.map((item) => item.MaHangChiTiet).includes(''), [selectedRowData])
  const currentRowData = useCallback(
    (maHang) => {
      return selectedRowData?.map((item) => item.MaHangChiTiet).filter((item) => item !== '' && item !== maHang)
    },
    [selectedRowData],
  )
  const handleChangeHHCT = (index, property, newValue) => {
    if (type == 'create') {
      const newDataList = [...hangHoaForm.HangHoa_CTs]
      if (property == 'MaHangChiTiet') {
        const selectedHangHoa = HangHoaCT.find((item) => item.MaHang === newValue)
        newDataList[index]['DVT'] = selectedHangHoa?.DVT
        newDataList[index]['TenHang'] = selectedHangHoa?.TenHang
      }
      const existMaHang = newDataList?.some((item) => item.MaHangChiTiet === newValue)
      if (!existMaHang) {
        newDataList[index][property] = newValue
        setSelectedRowData(newDataList)
        setHangHoaForm({ ...hangHoaForm, HangHoa_CTs: newDataList })
      } else {
        toast.warning('Hàng hóa đã được chọn', { autoClose: 1000 })
      }
      if (property == 'SoLuong') {
        newValue = parseFloat(newValue)
      }
    } else {
      const newDataList = [...dataView.HangHoa_CTs]
      console.log(newDataList)
      console.log(newValue)
      if (property == 'MaHangChiTiet') {
        const selectedHangHoa = HangHoaCT?.find((item) => item.MaHang === newValue)

        newDataList[index]['TenHangChiTiet'] = selectedHangHoa?.TenHang
        newDataList[index]['DVTChiTiet'] = selectedHangHoa?.DVT
      }
      const existMaHang = newDataList?.some((item) => item.MaHangChiTiet === newValue)
      if (!existMaHang) {
        newDataList[index][property] = newValue
        setSelectedRowData(newDataList)
        setDataView({ ...dataView, HangHoa_CTs: newDataList })
      } else {
        toast.warning('Hàng hóa đã được chọn', { autoClose: 1000 })
      }
      if (property == 'SoLuong') {
        newValue = parseFloat(newValue)
      }
    }
  }
  const addHangHoaCT = () => {
    if (selectedRowData?.map((item) => item.MaHangChiTiet).includes('')) return
    if (type == 'create') {
      const addHHCT = Array.isArray(hangHoaForm.HangHoa_CTs) ? [...hangHoaForm.HangHoa_CTs] : []
      setSelectedRowData([...addHHCT, { MaHangChiTiet: '', TenHang: '', SoLuong: 1, DVT: '' }])
    } else {
      const addHHCTEdit = Array.isArray(dataView.HangHoa_CTs) ? [...dataView.HangHoa_CTs] : []
      setSelectedRowData([...addHHCTEdit, { MaHangChiTiet: '', TenHangChiTiet: '', SoLuong: 1, DVTChiTiet: '' }])
    }
  }
  const removeHangHoaCT = (index) => {
    if (type == 'create') {
      const updatedHHCT = [...hangHoaForm.HangHoa_CTs]
      updatedHHCT.splice(index, 1)
      setSelectedRowData(updatedHHCT)
      setHangHoaForm({
        ...hangHoaForm,
        HangHoa_CTs: updatedHHCT,
      })
    } else {
      const updatedHHCT = [...dataView.HangHoa_CTs]
      updatedHHCT.splice(index, 1)
      setSelectedRowData(updatedHHCT)
      setDataView({
        ...dataView,
        HangHoa_CTs: updatedHHCT,
      })
    }
  }
  const handleChoose = (dataRow) => {
    const defaultValues = {
      SoLuong: 1,
      MaHangChiTiet: dataRow.MaHang,
    }
    const newRow = { ...dataRow, ...defaultValues }
    const existMaHang = selectedRowData.some((item) => item.MaHang === newRow.MaHang)
    if (!existMaHang) {
      setSelectedRowData([...selectedRowData, newRow])
      toast.success('Chọn hàng hóa thành công', {
        autoClose: 1000,
      })
    } else {
      const index = selectedRowData.findIndex((item) => item.MaHang === newRow.MaHang)
      const oldQuantity = selectedRowData[index].SoLuong
      selectedRowData[index].SoLuong = oldQuantity + newRow.SoLuong
      type == 'create' ? setHangHoaForm({ ...hangHoaForm, HangHoa_CTs: selectedRowData }) : setDataView({ ...dataView, HangHoa_CTs: selectedRowData })
    }
  }
  // Handle CRUD
  const handleCreate = async (isSave = true) => {
    if (
      !hangHoaForm?.Nhom?.trim() ||
      !hangHoaForm?.TenHang?.trim() ||
      !hangHoaForm?.DVTKho?.trim() ||
      !hangHoaForm?.MaVach?.trim() ||
      (dataThongSo.SUDUNG_MAHANGHOATUDONG ? null : !hangHoaForm?.MaHang?.trim())
    ) {
      setErrors({
        Nhom: hangHoaForm?.Nhom?.trim() ? '' : 'Nhóm không được trống',
        TenHang: hangHoaForm?.TenHang?.trim() ? '' : 'Tên hàng không được trống',
        DVTKho: hangHoaForm?.DVTKho?.trim() ? '' : 'ĐVT không được trống',
        MaVach: hangHoaForm?.MaVach?.trim() ? '' : 'Mã vạch không được trống',
        MaHang: dataThongSo.SUDUNG_MAHANGHOATUDONG ? null : hangHoaForm?.MaHang?.trim() ? '' : 'Mã hàng không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.ThemHangHoa(
        {
          ...hangHoaForm,
          MaVach: `${hangHoaForm.MaVach}${lastNumber13Main}`,
          TyLeQuyDoi: parseFloat(hangHoaForm.TyLeQuyDoi),
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        isSave ? (setHangHoaForm({ TonKho: true, LapRap: false, TyLeQuyDoi: 1 }), setSelectedRowData([])) : close()
        loadingData()
        toast.success('Thêm sản phẩm thành công', { autoClose: 1000 })
        dataThongSo.SUDUNG_MAHANGHOATUDONG ? setTargetRow(response.data.DataResults[0].Ma) : setTargetRow(hangHoaForm?.MaHang)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleCreate()
      } else {
        console.log(hangHoaForm)
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const handleView = async () => {
    try {
      const infoHang = await categoryAPI.InfoHangHoa(getMaHang?.MaHang, TokenAccess)
      if (infoHang.data.DataError == 0) {
        setDataView(infoHang.data.DataResult)
        setIsLoading(true)
        setTableLoad(false)
      } else if ((infoHang.data && infoHang.data.DataError === -107) || (infoHang.data && infoHang.data.DataError === -108)) {
        await RETOKEN()
        handleView()
      }
    } catch (error) {
      console.log(error)
      setTableLoad(false)
    }
  }
  const handleUpdate = async () => {
    if (!hangHoaForm?.Nhom?.trim() || !hangHoaForm?.TenHang?.trim() || !hangHoaForm?.DVTKho?.trim() || !hangHoaForm?.MaVach?.trim()) {
      setErrors({
        Nhom: hangHoaForm?.Nhom?.trim() ? '' : 'Nhóm không được trống',
        TenHang: hangHoaForm?.TenHang?.trim() ? '' : 'Tên hàng không được trống',
        DVTKho: hangHoaForm?.DVTKho?.trim() ? '' : 'Đơn vị tính không được trống',
        MaVach: hangHoaForm?.MaVach?.trim() ? '' : 'Mã vạch không được trống',
      })
      return
    }
    try {
      const dataUpdate = await categoryAPI.SuaHangHoa(
        {
          Ma: hangHoaForm.MaHang,
          Data: {
            ...hangHoaForm,
            Barcodes: dataView.Barcodes,
            HangHoa_CTs: dataView.HangHoa_CTs,
            MaVach: `${hangHoaForm.MaVach}${lastNumber13Main}`,
          },
        },
        TokenAccess,
      )
      if (dataUpdate.data.DataError == 0) {
        toast.success('Sửa thành công', { autoClose: 1000 })
        loadingData()
        close()
        setTargetRow(getMaHang?.MaHang)
      } else if ((dataUpdate.data && dataUpdate.data.DataError === -107) || (dataUpdate.data && dataUpdate.data.DataError === -108)) {
        await RETOKEN()
        handleUpdate()
      } else {
        toast.error(dataUpdate.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const handleDelete = async () => {
    try {
      const dataDel = await categoryAPI.XoaHangHoa(getMaHang?.MaHang, TokenAccess)
      if (dataDel.data.DataError == 0) {
        toast.success('Xóa sản phẩm thành công', { autoClose: 1000 })
        loadingData()
        close()
        setTargetRow([])
      } else if ((dataDel.data && dataDel.data.DataError === -107) || (dataDel.data && dataDel.data.DataError === -108)) {
        await RETOKEN()
        handleDelete()
      } else {
        toast.error(dataDel.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const handleStatus = async () => {
    if (!selectedStatus) {
      setErrors({
        GiaTriMoi: selectedStatus ? '' : 'Trạng thái không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.GanTrangThai(
        {
          DanhSachMa: getMaHang?.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedStatus,
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        loadingData()
        close()
        setTargetRow(getMaHang)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleStatus()
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.error('API call failed:', error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const handleGroup = async () => {
    if (!selectedGroup) {
      setErrors({
        GiaTriMoi: selectedGroup ? '' : 'Nhóm không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.GanNhom(
        {
          DanhSachMa: getMaHang?.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedGroup,
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        toast.success('Thay đổi nhóm thành công', { autoClose: 1000 })
        loadingData()
        close()
        setTargetRow(getMaHang)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleGroup()
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const handlePrintBar = async () => {
    if (!selectedTem) {
      setErrors({
        SoTem: selectedTem ? '' : 'Số tem không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.InMaVach(
        {
          CodeValue1From: selectednhomFrom,
          CodeValue1To: selectednhomTo,
          CodeValue1List: selectednhomList.map((key) => key.toString()).join(','),
          CodeValue2From: selectedBarCodeFrom,
          CodeValue2To: selectedBarCodeTo,
          CodeValue2List: selectedBarCodeList.map((key) => key.toString()).join(','),
          SoTem: selectedTem,
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults)
        close()
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePrintBar()
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const title = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      width: 200,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
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
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
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
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      showSorterTooltip: false,
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 120,
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
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.TonKho ? 1 : 0
        const valueB = b.TonKho ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className=" justify-center" id={`TonKho_${record.key}`} checked={text} />,
    },
  ]
  const titleBarCodeView = [
    {
      title: 'Mã vạch',
      dataIndex: 'MaVach',
      key: 'MaVach',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.MaVach - b.MaVach,
      showSorterTooltip: false,
      render: (text) => <span className="flex justify-start"> {text}</span>,
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
  ]
  const titleHangHoa_CTsView = [
    {
      title: 'Tên hàng',
      dataIndex: 'TenHangChiTiet',
      key: 'TenHangChiTiet',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.TenHangChiTiet.localeCompare(b.TenHangChiTiet),
      showSorterTooltip: false,
      render: (text) => <span className="flex justify-start"> {text}</span>,
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVTChiTiet',
      key: 'DVTChiTiet',
      width: 120,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.DVTChiTiet.localeCompare(b.DVTChiTiet),
      render: (text) => <span className="flex justify-center"> {text}</span>,
    },
    {
      title: 'Số lượng ',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          {formatThapPhan(text, dataThongSo.SOLESOLUONG)}
        </span>
      ),
    },
  ]
  console.log(lastNumber13Main)
  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
              {type == 'view' && (
                <div className={`flex flex-col px-2 ${dataView?.HangHoa_CTs?.length > 0 ? 'xl:w-[95vw] md:w-[100vw]' : 'lg:w-[55vw] xl:w-[50vw] md:w-[75vw]'}`}>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 uppercase font-semibold">Thông Tin - Hàng Hóa</p>
                    </div>
                  </div>
                  <div className={`border-2 py-2 px-2 gap-2 ${dataView?.HangHoa_CTs?.length > 0 ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 items-center">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Mã hàng</label>
                          <input type="text" value={dataView?.MaHang || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                        </div>
                        <div className="flex items-center ml-[110px] xl:ml-0 gap-2">
                          <div className="flex items-center">
                            <Checkbox className="text-sm" checked={dataView?.TonKho}>
                              Tồn kho
                            </Checkbox>
                          </div>
                          <div className="flex items-center">
                            <Checkbox className="text-sm" checked={dataView?.LapRap}>
                              Lắp ráp
                            </Checkbox>
                          </div>
                          <div className="flex items-center">
                            <Checkbox className="text-sm" checked={dataView?.NA}>
                              Ngưng dùng
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên hàng</label>
                        <input type="text" value={dataView?.TenHang || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className="required min-w-[90px] text-sm flex justify-end">Tên nhóm</label>
                        <input type="text" value={dataView?.TenNhom || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="flex items-center gap-1 col-span-2">
                          <label className="required whitespace-nowrap min-w-[90px] text-sm flex justify-end">Đơn vị tính</label>
                          <input type="text" value={dataView?.DVTKho || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                        </div>
                        <div className="flex items-center gap-1 ">
                          <label>x</label>
                          <input
                            type="text"
                            value={formatThapPhan(Number(dataView?.TyLeQuyDoi), dataThongSo?.SOLETYLE) || ''}
                            className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <label className="required whitespace-nowrap text-sm">Đơn vị quy đổi</label>
                          <input type="text" value={dataView?.DVTQuyDoi || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                        </div>
                      </div>
                      <div className="grid grid-cols-3">
                        <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                          <label className="required min-w-[90px] text-sm flex justify-end">Mã vạch</label>
                          <input type="text" value={dataView?.MaVach || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                        </div>
                      </div>
                      <div className="border ml-[95px] rounded flex flex-col items-end gap-2">
                        <div className="w-full ml-[95px]">
                          <Table
                            loading={tableLoad}
                            className="table_viewHH"
                            columns={titleBarCodeView}
                            dataSource={dataView?.Barcodes?.map((item, index) => ({ ...item, key: index }))}
                            size="small"
                            scroll={{
                              x: 500,
                              y: 100,
                            }}
                            bordered
                            pagination={false}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">Diễn giải hàng</label>
                        <input type="text" value={dataView?.DienGiaiHangHoa || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className="min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                        <textarea
                          rows="2"
                          cols="10"
                          type="text"
                          value={dataView?.GhiChu || ''}
                          className="px-2 rounded w-full resize-none border outline-none text-sm truncate"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex gap-1">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm">Người tạo</label>
                            <Tooltip title={dataView?.NguoiTao} color="blue">
                              <input
                                value={dataView?.NguoiTao || ''}
                                className={`${
                                  hangHoaForm?.LapRap == true ? '2xl:w-[18vw] xl:w-[16vw] lg:w-[14vw] md:w-[12vw]' : '2xl:w-[20vw] lg:w-[18vw] md:w-[15vw]'
                                } px-2 rounded resize-none border outline-none text-[1rem] truncate`}
                                readOnly
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <Tooltip title={moment(dataView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                              <input
                                type="text"
                                value={moment(dataView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                                className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                                readOnly
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Người sửa</label>
                            <Tooltip title={dataView?.NguoiSuaCuoi} color="blue">
                              <input
                                value={dataView?.NguoiSuaCuoi || ' '}
                                className={`${
                                  hangHoaForm?.LapRap == true ? '2xl:w-[18vw] xl:w-[16vw] lg:w-[14vw] md:w-[12vw]' : '2xl:w-[20vw] lg:w-[18vw] md:w-[15vw]'
                                } px-2 rounded  resize-none border outline-none text-[1rem] truncate`}
                                readOnly
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <Tooltip title={dataView?.NgaySuaCuoi ? moment(dataView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                              <input
                                value={dataView?.NgaySuaCuoi ? moment(dataView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                                className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                                readOnly
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    {dataView?.LapRap == true && (
                      <div className="w-full border rounded">
                        <Table
                          loading={tableLoad}
                          columns={titleHangHoa_CTsView}
                          dataSource={dataView?.HangHoa_CTs?.map((item, index) => ({ ...item, key: index }))}
                          size="small"
                          scroll={{
                            x: 500,
                            y: 500,
                          }}
                          bordered
                          pagination={false}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end m-2">
                    <div>
                      <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                    </div>
                  </div>
                </div>
              )}
              {type == 'create' && (
                <div className="flex flex-col p-2 xl:w-[95vw] md:w-[100vw]">
                  <div className="flex items-center justify-between p-1">
                    <div className="flex gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Thêm - Hàng hóa</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-1">
                    <div className="border-2 py-2 px-1 gap-1 grid grid-cols-2  min-h-[35rem]">
                      <div className="flex flex-col gap-2 p-1 ">
                        <div className="grid grid-cols-1 xl:grid-cols-2 items-center gap-3">
                          <div className="flex items-center gap-1 relative">
                            <label className="required min-w-[90px] text-sm whitespace-nowrap flex justify-end">Mã hàng</label>
                            <Input
                              placeholder={errors.MaHang && errors.MaHang}
                              size="small"
                              className={`${errors.MaHang ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap`}
                              required
                              disabled={dataThongSo && dataThongSo.SUDUNG_MAHANGHOATUDONG === true}
                              value={hangHoaForm?.MaHang}
                              onChange={(e) => {
                                setHangHoaForm({
                                  ...hangHoaForm,
                                  MaHang: e.target.value,
                                })
                                setErrors({ ...errors, MaHang: '' })
                              }}
                            />
                          </div>
                          <div className="ml-[110px] xl:ml-0 flex items-center gap-2">
                            <div>
                              <Checkbox
                                checked={hangHoaForm?.TonKho || ''}
                                disabled={dataThongSo && dataThongSo.SUDUNG_TONKHOHANGLAPRAP === false}
                                onChange={(e) =>
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    TonKho: e.target.checked || !hangHoaForm.LapRap,
                                  })
                                }
                              >
                                Tồn kho
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                checked={hangHoaForm?.LapRap}
                                disabled={dataThongSo && dataThongSo.SUDUNG_HANGLAPRAP === false}
                                onChange={(e) =>
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    TonKho: !e.target.checked,
                                    TyLeQuyDoi: 1,
                                    DVTQuyDoi: hangHoaForm.DVTKho,
                                    LapRap: e.target.checked,
                                  })
                                }
                              >
                                Lắp ráp
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                checked={hangHoaForm?.NA}
                                onChange={(e) =>
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    NA: e.target.checked,
                                  })
                                }
                              >
                                Ngưng dùng
                              </Checkbox>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center relative">
                          <label className="required min-w-[90px] text-sm flex justify-end whitespace-nowrap">Tên hàng</label>
                          <Input
                            placeholder={errors.TenHang && errors.TenHang}
                            size="small"
                            className={`${errors.TenHang ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                            required
                            value={hangHoaForm?.TenHang}
                            onChange={(e) => {
                              setHangHoaForm({
                                ...hangHoaForm,
                                TenHang: e.target.value,
                              })
                              setErrors({ ...errors, TenHang: '' })
                            }}
                          />
                        </div>
                        <div className="flex gap-1 items-center col-span-2 relative">
                          <label className="required  min-w-[90px] text-sm flex justify-end whitespace-nowrap">Nhóm hàng</label>
                          <Select
                            showSearch
                            required
                            size="small"
                            value={hangHoaForm?.Nhom}
                            placeholder={errors?.Nhom ? errors?.Nhom : ''}
                            status={errors.Nhom ? 'error' : ''}
                            onChange={(value) => {
                              setHangHoaForm({
                                ...hangHoaForm,
                                Nhom: value,
                              })
                              setErrors({ ...errors, Nhom: '' })
                            }}
                            style={{
                              width: '100%',
                            }}
                          >
                            {nhomHang?.map((item, index) => {
                              return (
                                <Select.Option key={index} value={item.Ma} title={item.Ma}>
                                  <p className="truncate text-sm">{item.ThongTinNhomHang}</p>
                                </Select.Option>
                              )
                            })}
                          </Select>
                        </div>
                        <div className={`${hangHoaForm?.LapRap == true ? 'lg:grid-cols-5 md:grid-cols-3' : 'grid grid-cols-5'} grid gap-2 items-center`}>
                          <div className="flex col-span-2 gap-1 items-center relative">
                            <label className="required  min-w-[90px] text-sm flex justify-end whitespace-nowrap">Đơn vị tính</label>
                            <Select
                              showSearch
                              size="small"
                              value={hangHoaForm?.DVTKho}
                              placeholder={errors?.DVTKho ? errors?.DVTKho : ''}
                              status={errors.DVTKho ? 'error' : ''}
                              onChange={(value) => {
                                setHangHoaForm({
                                  ...hangHoaForm,
                                  DVTKho: value,
                                })
                                setErrors({ ...errors, DVTKho: '' })
                                if (hangHoaForm?.TyLeQuyDoi === 1) {
                                  setHangHoaForm((prev) => ({
                                    ...prev,
                                    DVTQuyDoi: value,
                                  }))
                                }
                              }}
                              style={{
                                width: '100%',
                              }}
                            >
                              {dVTQuyDoi?.map((item) => (
                                <Select.Option key={item.DVT} value={item.DVT}>
                                  <p className="truncate text-sm">{item.DVT}</p>
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                          <div className="inputHH flex items-center gap-1 justify-center">
                            <label className="font-semibold">x</label>
                            <InputNumber
                              value={hangHoaForm?.TyLeQuyDoi || 1}
                              min={1}
                              max={999999999999}
                              className=""
                              size="small"
                              style={{ width: '100%' }}
                              disabled={(dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false) || hangHoaForm.LapRap == true}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => {
                                const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                return isNaN(parsedValue) ? null : parsedValue.toFixed(dataThongSo.SOLETYLE)
                              }}
                              onChange={(value) => {
                                const tyLeQuyDoiValue = value
                                if (!isNaN(tyLeQuyDoiValue)) {
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    TyLeQuyDoi: tyLeQuyDoiValue,
                                  })
                                  if (tyLeQuyDoiValue == 1) {
                                    setHangHoaForm((prev) => ({
                                      ...prev,
                                      DVTQuyDoi: prev.DVTKho,
                                    }))
                                  }
                                  if (tyLeQuyDoiValue !== 1) {
                                    setHangHoaForm((prev) => ({
                                      ...prev,
                                      DVTQuyDoi: !prev.DVTKho,
                                    }))
                                  }
                                }
                              }}
                            />
                          </div>
                          <div className={`${hangHoaForm?.LapRap == true ? ' lg:flex md:hidden' : 'flex'} col-span-2 items-center gap-1`}>
                            <label className="whitespace-nowrap required text-sm">Đơn vị quy đổi</label>
                            <Select
                              id="DVTQuyDoi"
                              showSearch
                              size="small"
                              value={hangHoaForm?.DVTQuyDoi || ''}
                              disabled={(dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false) || hangHoaForm.LapRap == true}
                              style={{
                                width: '100%',
                              }}
                              onChange={(value) => {
                                setHangHoaForm({
                                  ...hangHoaForm,
                                  DVTQuyDoi: value,
                                })
                              }}
                            >
                              <Select.Option value="" disabled hidden></Select.Option>
                              {dVTKho?.map((item) => (
                                <Select.Option key={item.DVT} value={item.DVT}>
                                  <p className="truncate text-sm">{item.DVT}</p>
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="flex col-span-2 gap-1 items-center justify-center relative">
                            <label className="required min-w-[90px] text-sm flex justify-end whitespace-nowrap">Mã vạch</label>
                            <Input
                              placeholder={errors.MaVach && errors.MaVach}
                              required
                              size="small"
                              className={`${errors.MaVach ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap`}
                              value={hangHoaForm?.MaVach?.length == 12 ? `${hangHoaForm?.MaVach}${lastNumber13Main}` : hangHoaForm?.MaVach || ''}
                              maxLength={12}
                              allowClear={{
                                clearIcon: <CloseSquareFilled />,
                              }}
                              onBlur={() => {
                                let timerId
                                clearTimeout(timerId)
                                timerId = setTimeout(() => {
                                  if (hangHoaForm?.MaVach?.length == 12) {
                                    getMaVach13(hangHoaForm.MaVach).then((getLast) => {
                                      setLastNumber13Main(getLast)
                                    })
                                  } else {
                                    setLastNumber13Main('')
                                  }
                                }, 300)
                              }}
                              onChange={(e) => {
                                const inputValue = e.target.value
                                const numericValue = inputValue.replace(/[^0-9]/g, '')
                                if (numericValue.length <= 12) {
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    MaVach: numericValue,
                                  })
                                }
                                setErrors({ ...errors, MaVach: '' })
                              }}
                            />
                          </div>
                        </div>
                        <div className=" border-[0.125rem] ml-[95px] p-2 min-h-[8.5rem] rounded flex gap-2 items-start relative ">
                          <div className="w-full lg:max-h-[125px] md:max-h-[155px] overflow-y-auto">
                            <table className="barcodeList  ">
                              <thead>
                                <tr>
                                  <th className="whitespace-nowrap">Mã vạch</th>
                                  <th className="w-[8rem] whitespace-nowrap">Ngưng dùng</th>
                                  <th className={`${hangHoaForm?.Barcodes?.length > 2 ? 'lg:w-[3.5rem] md:w-[3rem]' : '  w-[5rem]'}`}> </th>
                                </tr>
                              </thead>
                              <tbody>
                                {hangHoaForm?.Barcodes?.map((barcode, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="items-center gap-2">
                                        <Input
                                          className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                                          size="small"
                                          value={barcode.MaVach}
                                          maxLength={12}
                                          onChange={(e) => {
                                            const inputValue = e.target.value
                                            const numericValue = inputValue.replace(/[^0-9]/g, '')
                                            if (numericValue.length <= 12) {
                                              handleBarcodeChange(index, 'MaVach', numericValue)
                                            }
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <Checkbox checked={barcode.NA} onChange={(e) => handleBarcodeChange(index, 'NA', e.target.checked)}></Checkbox>
                                    </td>
                                    <td className="flex justify-center">
                                      <div
                                        onClick={() => removeBarcode(index)}
                                        title="Xóa"
                                        className="p-[3px] w-[fit-content] border-2 border-red-500 rounded text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
                                      >
                                        <MdDelete />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <Tooltip
                            placement="topRight"
                            title={isAddBarCode ? 'Vui lòng nhập mã vạch phụ !' : 'Bấm vào đây để thêm hàng mới!'}
                            color={isAddBarCode ? 'gray' : 'blue'}
                          >
                            <FloatButton
                              type={isAddBarCode ? 'default' : 'primary'}
                              className={`${
                                hangHoaForm?.Barcodes?.length > 2 ? 'HH_Barcode right-[35px] top-[10px]' : 'HH_Barcode--LapRap right-[35px] top-[10px]'
                              } absolute bg-transparent w-[30px] h-[30px]`}
                              icon={<IoMdAddCircle />}
                              onClick={addBarcodeRow}
                            />
                          </Tooltip>
                        </div>
                        <div className="flex col-span-2 gap-1 items-center">
                          <label className=" min-w-[90px] text-sm flex justify-end whitespace-nowrap">Diễn giải hàng</label>
                          <Input
                            className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                            size="small"
                            value={hangHoaForm?.DienGiaiHangHoa || ''}
                            onChange={(e) =>
                              setHangHoaForm({
                                ...hangHoaForm,
                                DienGiaiHangHoa: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex col-span-2 gap-1 items-center">
                          <label className=" min-w-[90px] text-sm flex justify-end whitespace-nowrap">Ghi chú</label>
                          <TextArea
                            rows="2"
                            cols="4"
                            className="text-sm"
                            value={hangHoaForm?.GhiChu || ''}
                            onChange={(e) =>
                              setHangHoaForm({
                                ...hangHoaForm,
                                GhiChu: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-1 px-2 py-3 border-black-200 ml-[95px] relative rounded border-[0.125rem]">
                          <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <label className=" text-sm">Người tạo</label>
                              <input
                                type="text"
                                className="2xl:w-[20vw] xl:w-[18vw] lg:w-[16vw] md:w-[10vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                                readOnly
                              />
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <label className=" text-sm">Lúc</label>
                              <input type="text" className="px-2 w-full resize-none rounded border outline-none text-[1rem]" readOnly />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <label className=" text-sm">Người sửa</label>
                              <input
                                type="text"
                                className="2xl:w-[20vw] xl:w-[18vw] lg:w-[16vw] md:w-[10vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate "
                                readOnly
                              />
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <label className=" text-sm">Lúc</label>
                              <input type="text" className="px-2 w-full resize-none rounded border outline-none text-[1rem]" readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="border-[0.125rem] min-h-[33.5rem] p-2 rounded flex flex-col gap-2 relative">
                          <div className="w-full max-h-[515px] overflow-y-auto">
                            <table className="barcodeList">
                              <thead>
                                <tr>
                                  <th className="w-[20rem] whitespace-nowrap">Tên Hàng</th>
                                  <th className="w-[6rem] whitespace-nowrap">ĐVT</th>
                                  <th className="whitespace-nowrap">Số Lượng</th>
                                  <th className={`${hangHoaForm?.HangHoa_CTs?.length > 11 ? 'w-[3.5rem]' : 'w-[5.5rem]'}`}></th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRowData.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="w-[20rem]">
                                        <Select
                                          showSearch
                                          disabled={hangHoaForm?.LapRap == false}
                                          size="small"
                                          value={`${item.MaHangChiTiet} ${item.TenHang}`}
                                          style={{
                                            width: '100%',
                                          }}
                                          onChange={(value) => handleChangeHHCT(index, 'MaHangChiTiet', value)}
                                        >
                                          {HangHoaCT?.filter((row) => !currentRowData(item.MaHang).includes(row?.MaHang))?.map((hangHoa) => (
                                            <>
                                              <Select.Option key={hangHoa.MaHang} value={hangHoa.MaHang}>
                                                <p className="text-start truncate">
                                                  {hangHoa.MaHang}-{hangHoa.TenHang}
                                                </p>
                                              </Select.Option>
                                            </>
                                          ))}
                                        </Select>
                                      </div>
                                    </td>
                                    <td>{item.DVT}</td>
                                    <td className="inputHH">
                                      <InputNumber
                                        value={item.SoLuong}
                                        min={1}
                                        max={999999999999}
                                        disabled={hangHoaForm.LapRap == false}
                                        size="small"
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => {
                                          const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                          return isNaN(parsedValue) ? null : parsedValue.toFixed(dataThongSo.SOLESOLUONG)
                                        }}
                                        onChange={(value) => handleChangeHHCT(index, 'SoLuong', value)}
                                      />
                                    </td>
                                    <td className="flex justify-center">
                                      <div
                                        onClick={() => removeHangHoaCT(index)}
                                        title="Xóa"
                                        className="p-[3px] w-[fit-content] border-2 border-red-500 rounded text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
                                      >
                                        <MdDelete />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <Tooltip
                            placement="topRight"
                            title={isAddHHCT ? 'Vui lòng chọn tên hàng!' : hangHoaForm.LapRap == false ? '' : 'Bấm vào đây để thêm hàng mới hoặc nhấn F9 để chọn hàng!'}
                            color={isAddHHCT ? 'gray' : 'blue'}
                          >
                            <FloatButton
                              type={isAddHHCT || hangHoaForm.LapRap == false ? 'default' : 'primary'}
                              className={`${
                                hangHoaForm?.HangHoa_CTs?.length > 11 ? 'HH_HHCT right-[37px] top-[10px]' : 'top-[10px] right-[37px]'
                              } absolute bg-transparent w-[30px] h-[30px]`}
                              icon={<IoMdAddCircle />}
                              onClick={hangHoaForm.LapRap == true ? addHangHoaCT : null}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <ActionButton handleAction={handleCreate} title={'Lưu'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                      <ActionButton
                        handleAction={() => handleCreate(false)}
                        title={'Lưu & Đóng'}
                        color={'slate-50'}
                        background={'blue-500'}
                        color_hover={'blue-500'}
                        bg_hover={'white'}
                      />
                      <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                    </div>
                  </div>
                </div>
              )}
              {type == 'edit' && (
                <div className="flex flex-col p-2 xl:w-[95vw] md:w-[100vw]">
                  <div className="flex items-center p-1 gap-2">
                    <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                    <p className="text-blue-700 font-semibold uppercase">Sửa - Hàng hóa</p>
                  </div>
                  <div className="flex flex-col gap-2 p-1">
                    <div className="border-2 py-2 px-2 gap-2 grid grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-center justify-center">
                          <div className="flex items-center gap-1">
                            <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Mã hàng</label>
                            <Input required size="small" className="w-full overflow-hidden whitespace-nowrap" disabled value={hangHoaForm?.MaHang || ''} />
                          </div>
                          <div className="ml-[110px] xl:ml-0 flex items-center gap-2">
                            <div>
                              <Checkbox
                                id="TonKho"
                                checked={hangHoaForm.TonKho}
                                disabled={(dataThongSo && dataThongSo.SUDUNG_TONKHOHANGLAPRAP === false) || dataView.DangSuDung === true}
                                onChange={(e) =>
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    TonKho: e.target.checked || !hangHoaForm.LapRap,
                                  })
                                }
                              >
                                Tồn kho
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                id="LapRap"
                                checked={hangHoaForm.LapRap}
                                disabled={(dataThongSo && dataThongSo.SUDUNG_HANGLAPRAP === false) || dataView.DangSuDung === true}
                                onChange={(e) =>
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    TonKho: !e.target.checked,
                                    TyLeQuyDoi: 1,
                                    DVTQuyDoi: hangHoaForm.DVTKho,
                                    [e.target.id]: e.target.checked,
                                  })
                                }
                              >
                                Lắp ráp
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                className="whitespace-nowrap "
                                id="NA"
                                checked={hangHoaForm.NA}
                                onChange={(e) =>
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    [e.target.id]: e.target.checked,
                                  })
                                }
                              >
                                Ngưng dùng
                              </Checkbox>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Tên hàng</label>
                          <Input
                            required
                            placeholder={errors.TenHang && errors.TenHang}
                            size="small"
                            className={`${errors.TenHang ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                            value={hangHoaForm?.TenHang}
                            onChange={(e) => {
                              setHangHoaForm({
                                ...hangHoaForm,
                                TenHang: e.target.value,
                              })
                              setErrors({ ...errors, TenHang: '' })
                            }}
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-1">
                          <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Nhóm hàng</label>
                          <Select
                            showSearch
                            size="small"
                            value={hangHoaForm.Nhom}
                            placeholder={errors?.Nhom ? errors?.Nhom : ''}
                            status={errors.Nhom ? 'error' : ''}
                            required
                            style={{
                              width: '100%',
                            }}
                            onChange={(value) => {
                              setHangHoaForm({
                                ...hangHoaForm,
                                Nhom: value,
                              })
                              setErrors({ ...errors, Nhom: '' })
                            }}
                          >
                            {nhomHang?.map((item) => (
                              <Select.Option key={item.Ma} value={item.Ma}>
                                {item.ThongTinNhomHang}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                        <div className={`${hangHoaForm?.LapRap == true ? 'lg:grid-cols-5 md:grid-cols-3' : 'grid grid-cols-5'} grid gap-2 items-center`}>
                          <div className="flex col-span-2 gap-1 items-center">
                            <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Đơn vị tính</label>
                            <Select
                              showSearch
                              size="small"
                              placeholder={errors?.DVTKho ? errors?.DVTKho : ''}
                              value={hangHoaForm?.DVTKho}
                              status={errors.DVTKho ? 'error' : ''}
                              style={{
                                width: '100%',
                              }}
                              onChange={(value) => {
                                setHangHoaForm({
                                  ...hangHoaForm,
                                  DVTKho: value,
                                })
                                setErrors({ ...errors, DVTKho: '' })
                                if (hangHoaForm?.TyLeQuyDoi === 1) {
                                  setHangHoaForm((prev) => ({
                                    ...prev,
                                    DVTQuyDoi: value,
                                  }))
                                }
                              }}
                            >
                              {dVTQuyDoi?.map((item) => (
                                <Select.Option key={item.DVT} value={item.DVT}>
                                  {item.DVT}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                          <div className="inputHH flex items-center gap-1">
                            <label className="font-semibold">x</label>
                            <InputNumber
                              name="TyLeQuyDoi"
                              value={hangHoaForm?.TyLeQuyDoi}
                              min={1}
                              max={999999999999}
                              size="small"
                              style={{ width: '100%' }}
                              disabled={(dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false) || dataView.DangSuDung === true || hangHoaForm.LapRap == true}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => {
                                const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                return isNaN(parsedValue) ? null : parsedValue.toFixed(dataThongSo.SOLETYLE)
                              }}
                              onChange={(value) => {
                                const tyLeQuyDoiValue = value
                                if (!isNaN(tyLeQuyDoiValue)) {
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    TyLeQuyDoi: tyLeQuyDoiValue,
                                  })
                                  if (tyLeQuyDoiValue == 1) {
                                    setHangHoaForm((prev) => ({
                                      ...prev,
                                      DVTQuyDoi: prev.DVTKho,
                                    }))
                                  }
                                  if (tyLeQuyDoiValue !== 1) {
                                    setHangHoaForm((prev) => ({
                                      ...prev,
                                      DVTQuyDoi: !prev.DVTKho,
                                    }))
                                  }
                                }
                              }}
                            />
                          </div>
                          <div className={`${hangHoaForm?.LapRap == true ? ' lg:flex md:hidden' : 'flex'} col-span-2 items-center gap-1`}>
                            <label className=" whitespace-nowrap required text-sm">Đơn vị quy đổi</label>
                            <Select
                              size="small"
                              id="DVTQuyDoi"
                              value={hangHoaForm.DVTQuyDoi}
                              disabled={(dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false) || dataView.DangSuDung === true || hangHoaForm.LapRap == true}
                              style={{
                                width: '100%',
                              }}
                              onChange={(value) => {
                                setHangHoaForm({
                                  ...hangHoaForm,
                                  DVTQuyDoi: value,
                                })
                              }}
                            >
                              {dVTKho?.map((item) => (
                                <Select.Option key={item.DVT} value={item.DVT}>
                                  {item.DVT}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="flex col-span-2 gap-1 items-center">
                            <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Mã vạch</label>
                            <Input
                              placeholder={errors.MaVach && errors.MaVach}
                              required
                              size="small"
                              className={`${errors.MaVach ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap`}
                              value={hangHoaForm?.MaVach?.length == 12 ? `${hangHoaForm?.MaVach}${lastNumber13Main}` : hangHoaForm?.MaVach || ''}
                              maxLength={12}
                              allowClear={{
                                clearIcon: <CloseSquareFilled />,
                              }}
                              onBlur={() => {
                                let timerId
                                clearTimeout(timerId)
                                timerId = setTimeout(() => {
                                  if (hangHoaForm?.MaVach?.length == 12) {
                                    getMaVach13(hangHoaForm.MaVach).then((getLast) => {
                                      setLastNumber13Main(getLast)
                                    })
                                  } else {
                                    setLastNumber13Main('')
                                  }
                                }, 300)
                              }}
                              onChange={(e) => {
                                const inputValue = e.target.value
                                const numericValue = inputValue.replace(/[^0-9]/g, '')
                                if (numericValue.length <= 12) {
                                  setHangHoaForm({
                                    ...hangHoaForm,
                                    MaVach: numericValue,
                                  })
                                }
                                setErrors({ ...errors, MaVach: '' })
                              }}
                            />
                          </div>
                        </div>
                        <div className=" border-[0.125rem] ml-[95px] p-2 min-h-[8.5rem] rounded flex gap-2 items-start relative ">
                          <div className="w-full  lg:max-h-[125px] md:max-h-[155px] overflow-y-auto">
                            <table className="barcodeList">
                              <thead>
                                <tr>
                                  <th className="whitespace-nowrap">Mã vạch</th>
                                  <th className="w-[8rem] whitespace-nowrap">Ngưng dùng</th>
                                  <th className={`${dataView?.Barcodes?.length > 2 ? 'lg:w-[3.5rem] md:w-[3rem]' : '  w-[5rem]'}`}> </th>
                                </tr>
                              </thead>
                              <tbody>
                                {dataView?.Barcodes?.map((item, index) => (
                                  <tr key={index}>
                                    <>
                                      <td>
                                        <div className="flex items-center">
                                          <Input
                                            className="w-fulloverflow-hidden whitespace-nowrap overflow-ellipsis"
                                            size="small"
                                            value={item?.MaVach}
                                            maxLength={12}
                                            onChange={(e) => {
                                              const inputValue = e.target.value
                                              const numericValue = inputValue.replace(/[^0-9]/g, '')
                                              if (numericValue.length <= 12) {
                                                handleBarcodeChange(index, 'MaVach', numericValue)
                                              }
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <Checkbox checked={item.NA} onChange={(e) => handleBarcodeChange(index, 'NA', e.target.checked)}></Checkbox>
                                      </td>
                                      <td className="flex justify-center">
                                        <div
                                          onClick={() => removeBarcode(index)}
                                          title="Xóa"
                                          className="p-[3px] w-[fit-content] border-2 border-red-500 rounded text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
                                        >
                                          <MdDelete />
                                        </div>
                                      </td>
                                    </>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <Tooltip
                            placement="topRight"
                            title={isAddBarCodeEdit ? 'Vui lòng nhập mã hàng phụ!' : 'Bấm vào đây để thêm hàng mới!'}
                            color={isAddBarCodeEdit ? 'gray' : 'blue'}
                          >
                            <FloatButton
                              type={isAddBarCodeEdit ? 'default' : 'primary'}
                              className={`${
                                hangHoaForm?.Barcodes?.length > 2 ? 'HH_Barcode right-[35px] top-[10px]' : 'HH_Barcode--LapRap right-[35px] top-[10px]'
                              } absolute bg-transparent w-[30px] h-[30px]`}
                              icon={<IoMdAddCircle />}
                              onClick={addBarcodeRow}
                            />
                          </Tooltip>
                        </div>
                        <div className="flex col-span-2 gap-1 items-center">
                          <label className=" min-w-[90px] text-sm whitespace-nowrap flex justify-end">Diễn giải hàng</label>
                          <Input
                            className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                            size="small"
                            value={hangHoaForm?.DienGiaiHangHoa || ''}
                            onChange={(e) =>
                              setHangHoaForm({
                                ...hangHoaForm,
                                DienGiaiHangHoa: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex col-span-2 gap-1 items-center">
                          <label className=" min-w-[90px] text-sm whitespace-nowrap flex justify-end">Ghi chú</label>
                          <TextArea
                            rows="2"
                            cols="4"
                            className="text-sm"
                            value={hangHoaForm?.GhiChu || ''}
                            onChange={(e) =>
                              setHangHoaForm({
                                ...hangHoaForm,
                                GhiChu: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2 px-2 py-3 border-black-200 ml-[95px] mt-1 relative rounded border-[0.125rem]">
                          <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className=" text-sm">Người tạo</label>
                              <Tooltip title={dataView?.NguoiTao} color="blue">
                                <input
                                  type="text"
                                  className="2xl:w-[20vw] xl:w-[18vw] lg:w-[16vw] md:w-[10vw] px-2 rounded resize-none border outline-none text-[1rem] truncate"
                                  value={dataView.NguoiTao || ''}
                                  readOnly
                                />
                              </Tooltip>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className=" text-sm">Lúc</label>
                              <Tooltip title={moment(dataView?.NgayTao).format('DD/MM/YYYY HH:mm:ss ')} color="blue">
                                <input
                                  type="text"
                                  className="px-2 w-full resize-none border rounded outline-none text-[1rem] truncate"
                                  value={moment(dataView?.NgayTao).format('DD/MM/YYYY HH:mm:ss ') || ''}
                                  readOnly
                                />
                              </Tooltip>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 whitespace-nowrap" title={dataView.NguoiSuaCuoi}>
                              <label className=" text-sm">Người sửa</label>
                              <Tooltip title={dataView?.NguoiSuaCuoi} color="blue">
                                <input
                                  type="text"
                                  className="2xl:w-[20vw] xl:w-[18vw] lg:w-[16vw] md:w-[10vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                                  value={dataView.NguoiSuaCuoi || ''}
                                  readOnly
                                />
                              </Tooltip>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className=" text-sm">Lúc</label>
                              <Tooltip title={dataView?.NgaySuaCuoi ? moment(dataView?.NgaySuaCuoi).format('DD/MM/YYYY HH:mm:ss ') : ''} color="blue">
                                <input
                                  type="text"
                                  className="px-2 w-full resize-none border rounded outline-none text-[1rem] truncate"
                                  value={dataView?.NgaySuaCuoi ? moment(dataView?.NgaySuaCuoi).format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                                  readOnly
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="border-[0.125rem] min-h-[33.5rem] p-2 rounded flex flex-col gap-2 relative">
                          <div className="w-full max-h-[515px] overflow-y-auto ">
                            <table className="barcodeList">
                              <thead>
                                <tr>
                                  <th className="w-[20rem] whitespace-nowrap">Tên Hàng</th>
                                  <th className="w-[6rem] whitespace-nowrap">ĐVT</th>
                                  <th className="whitespace-nowrap">Số Lượng</th>
                                  <th className={`${dataView?.HangHoa_CTs?.length > 11 ? 'w-[3.5rem]' : 'w-[5rem]'}`}></th>
                                </tr>
                              </thead>
                              {selectedRowData.map((item, index) => (
                                <tbody key={index}>
                                  <tr>
                                    <td>
                                      <div className="w-[20rem]">
                                        <Select
                                          disabled={dataView.DangSuDung == true || hangHoaForm.LapRap == false}
                                          className="max-w-[20rem] truncate"
                                          size="small"
                                          showSearch
                                          value={`${item.MaHangChiTiet} ${item.TenHangChiTiet}`}
                                          style={{
                                            width: '100%',
                                          }}
                                          onChange={(value) => handleChangeHHCT(index, 'MaHangChiTiet', value)}
                                        >
                                          {HangHoaCT?.filter((row) => !currentRowData(item.MaHang).includes(row?.MaHang))?.map((hangHoa, index) => (
                                            <>
                                              <Select.Option key={index} value={hangHoa.MaHang} className="flex items-center">
                                                <p className="text-start truncate">
                                                  {hangHoa.MaHang} - {hangHoa.TenHang}
                                                </p>
                                              </Select.Option>
                                            </>
                                          ))}
                                        </Select>
                                      </div>
                                    </td>
                                    <td>{item.DVTChiTiet}</td>
                                    <td className="inputHH">
                                      <InputNumber
                                        value={item.SoLuong}
                                        min={1}
                                        disabled={dataView.DangSuDung == true || hangHoaForm.LapRap == false}
                                        max={999999999999}
                                        size="small"
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => {
                                          const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                          return isNaN(parsedValue) ? null : parsedValue.toFixed(dataThongSo.SOLESOLUONG)
                                        }}
                                        onChange={(value) => handleChangeHHCT(index, 'SoLuong', value)}
                                      />
                                    </td>
                                    <td className="flex justify-center">
                                      <div
                                        onClick={() => removeHangHoaCT(index)}
                                        title="Xóa"
                                        className="p-[3px] w-[fit-content] border-2 border-red-500 rounded text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
                                      >
                                        <MdDelete />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                            </table>
                          </div>
                          <Tooltip
                            placement="topRight"
                            title={isAddHHCT ? 'Vui lòng chọn tên hàng!' : hangHoaForm.LapRap == false ? '' : 'Bấm vào đây để thêm hàng mới hoặc nhấn F9 để chọn hàng!'}
                            color={isAddHHCT ? 'gray' : 'blue'}
                          >
                            <FloatButton
                              type={isAddHHCT || hangHoaForm.LapRap == false ? 'default' : 'primary'}
                              className={`${
                                dataView?.HangHoa_CTs?.length > 11 ? 'HH_HHCT right-[35px] top-[10px]' : 'HH_HHCT_small top-[10px] right-[32px]'
                              } absolute bg-transparent w-[30px] h-[30px]`}
                              icon={<IoMdAddCircle />}
                              onClick={hangHoaForm.LapRap == true ? addHangHoaCT : null}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <ActionButton handleAction={handleUpdate} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                      <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                    </div>
                  </div>
                </div>
              )}
              {type == 'delete' && (
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Xóa dữ liệu - Hàng Hóa</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-2 p-3 font-bold text-lg">
                    <div className="flex gap-1">
                      <p className="text-blue-700 uppercase">Bạn có chắc muốn xóa</p>
                      <p className="text-red-500 block truncate">{getMaHang?.TenHang}</p>
                      <p className="text-blue-700 uppercase">?</p>
                    </div>
                    <p className="text-slate-500 text-lg font-light">Thông tin sản phẩm không thể hoàn tác nếu bạn xóa !</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <ActionButton handleAction={handleDelete} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                    <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              )}
              {type == 'statusMany' && (
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Đổi trạng thái - Hàng Hóa</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center border-2 p-4 gap-2">
                      <div className="required whitespace-nowrap">Trạng thái</div>
                      <Space wrap>
                        <Select
                          placeholder={errors?.GiaTriMoi ? errors?.GiaTriMoi : 'Chọn trạng thái'}
                          status={errors.GiaTriMoi ? 'error' : ''}
                          required
                          style={{
                            width: 500,
                          }}
                          value={selectedStatus || undefined}
                          onChange={(value) => {
                            setSelectedStatus(value)
                            setErrors({ ...errors, GiaTriMoi: '' })
                          }}
                          options={[
                            {
                              value: '1',
                              label: 'Sử dụng',
                            },
                            {
                              value: '0',
                              label: 'Ngưng sử dụng',
                            },
                            {
                              value: '2',
                              label: 'Ngược trạng thái',
                            },
                          ]}
                        />
                      </Space>
                    </div>
                    <div className="flex justify-end gap-2">
                      <ActionButton handleAction={handleStatus} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                      <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                    </div>
                  </div>
                </div>
              )}
              {type == 'groupMany' && (
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Đổi nhóm - Hàng Hóa</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <div className="flex gap-2 items-center border-2 p-4">
                      <div className="required whitespace-nowrap">Chọn nhóm</div>
                      <Select
                        placeholder={errors?.GiaTriMoi ? errors?.GiaTriMoi : 'Chọn nhóm'}
                        status={errors.GiaTriMoi ? 'error' : ''}
                        filterOption
                        required
                        style={{
                          width: '450px',
                        }}
                        value={selectedGroup || undefined}
                        onChange={(value) => {
                          setSelectedGroup(value)
                          setErrors({ ...errors, GiaTriMoi: '' })
                        }}
                      >
                        {nhomHang?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.Ma} title={item.Ten}>
                              <p className="truncate"> {item.ThongTinNhomHang}</p>
                            </Select.Option>
                          )
                        })}
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2" type="submit">
                      <ActionButton handleAction={handleGroup} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                      <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                    </div>
                  </div>
                </div>
              )}
              {type == 'print' && (
                <div className="flex flex-col gap-2  lg:w-[50vw] md:w-[60vw] p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">In Mã vạch - Hàng Hóa</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 justify-center items-center border-2 p-4">
                    <div className="grid grid-cols-2 gap-4 px-4 border-2 py-4 border-black-200 rounded-lg relative">
                      <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Theo Nhóm</p>
                      <div className="flex gap-1 items-center">
                        <div>Từ</div>
                        <Select
                          allowClear
                          filterOption
                          placeholder="Chọn nhóm"
                          value={selectednhomFrom}
                          onChange={(value) => {
                            setSelectednhomFrom(value)
                            selectednhomTo == null ? setSelectednhomTo(value) : ''
                            if (selectednhomTo !== null && nhomHang.findIndex((item) => item.Ma === value) > nhomHang.findIndex((item) => item.Ma === selectednhomTo)) {
                              setSelectednhomTo(value)
                            }
                          }}
                          style={{
                            width: '200px',
                          }}
                        >
                          {nhomHang?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                <p className="truncate">{item.Ma}</p>
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div> Tới</div>
                        <Select
                          allowClear
                          filterOption
                          placeholder="Chọn nhóm"
                          value={selectednhomTo}
                          onChange={(value) => {
                            setSelectednhomTo(value)
                            selectednhomFrom == null ? setSelectednhomFrom(value) : ''
                            if (selectednhomFrom !== null && nhomHang.findIndex((item) => item.Ma === value) < nhomHang.findIndex((item) => item.Ma === selectednhomFrom)) {
                              setSelectednhomFrom(value)
                            }
                          }}
                          style={{
                            width: '200px',
                          }}
                        >
                          {nhomHang?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.Ma} title={item.ThongTinNhomHang}>
                                <p className="truncate">{item.Ma}</p>
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </div>
                      <div className="col-span-2 flex gap-1 items-center whitespace-nowrap">
                        <div>Chọn</div>
                        <Select
                          mode="multiple"
                          maxTagCount={2}
                          filterOption
                          allowClear
                          placeholder="Danh sách nhóm"
                          value={selectednhomList}
                          onChange={(value) => setSelectednhomList(value)}
                          style={{
                            width: '390px',
                          }}
                        >
                          {nhomHang?.map((item) => {
                            return (
                              <Select.Option key={item.Ma} value={item.Ma}>
                                <p className="truncate">{item.ThongTinNhomHang}</p>
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 px-4 border-2 py-4 border-black-200 rounded-lg relative">
                      <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Theo Mã</p>
                      <div className="flex gap-1 items-center">
                        <div> Từ</div>
                        <Select
                          allowClear
                          filterOption
                          placeholder="Chọn mã hàng"
                          value={selectedBarCodeFrom}
                          onChange={(value) => {
                            setSelectedBarCodeFrom(value)
                            selectedBarCodeTo == null ? setSelectedBarCodeTo(value) : ''
                            if (
                              selectedBarCodeTo !== null &&
                              getDataHangHoa?.findIndex((item) => item.MaHang === value) > getDataHangHoa?.findIndex((item) => item.MaHang === selectedBarCodeTo)
                            ) {
                              setSelectedBarCodeTo(value)
                            }
                          }}
                          style={{
                            width: '200px',
                          }}
                        >
                          {getDataHangHoa?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                <p className="truncate">{item.MaHang}</p>
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div> Tới</div>
                        <Select
                          allowClear
                          filterOption
                          placeholder="Chọn mã hàng"
                          value={selectedBarCodeTo}
                          onChange={(value) => {
                            setSelectedBarCodeTo(value)
                            selectedBarCodeFrom == null ? setSelectedBarCodeFrom(value) : ''
                            if (
                              selectedBarCodeFrom !== null &&
                              getDataHangHoa?.findIndex((item) => item.MaHang === value) < getDataHangHoa?.findIndex((item) => item.MaHang === selectedBarCodeFrom)
                            ) {
                              setSelectedBarCodeFrom(value)
                            }
                          }}
                          style={{
                            width: '200px',
                          }}
                        >
                          {getDataHangHoa?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.MaHang} title={item.TenHang}>
                                <p className="truncate">{item.MaHang}</p>
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </div>
                      <div className="flex items-center gap-1 col-span-2 whitespace-nowrap">
                        <div>Chọn</div>
                        <Select
                          mode="multiple"
                          maxTagCount={2}
                          allowClear
                          filterOption
                          placeholder="Chọn mã hàng"
                          value={selectedBarCodeList}
                          onChange={(value) => setSelectedBarCodeList(value)}
                          style={{
                            width: '400px',
                          }}
                        >
                          {getDataHangHoa?.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.MaHang}>
                                <p className="truncate">
                                  {item.MaHang}-{item.TenHang}
                                </p>
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </div>
                    </div>
                    <div className="gap-1 flex items-center">
                      <label className="required whitespace-nowrap">Số tem</label>
                      <InputNumber
                        placeholder={errors.SoTem && errors.SoTem}
                        min={1}
                        className={`${errors.SoTem ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap`}
                        max={999999999999}
                        style={{ width: '100%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onChange={(value) => {
                          setSelectedTem(value)
                          setErrors({ ...errors, SoTem: '' })
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end px-2 gap-2">
                    <ActionButton handleAction={handlePrintBar} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                    <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {isShowModal && hangHoaForm.LapRap == true ? (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col  bg-white  p-2 rounded shadow-custom overflow-hidden z-10">
                <div className="flex flex-col gap-2 p-2 justify-between xl:w-[95vw] md:w-[100vw]">
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 py-1">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Danh Sách Hàng Hóa - Hàng Hóa</p>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
                    <div className="flex w-[20rem] overflow-hidden">
                      {isShowSearch && (
                        <Input
                          allowClear={{
                            clearIcon: <CloseSquareFilled />,
                          }}
                          placeholder="Nhập ký tự bạn cần tìm"
                          onBlur={handleSearch}
                          onPressEnter={handleSearch}
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                  <div className="p-2 rounded m-1 flex flex-col gap-2 border-2">
                    <Table
                      loading={tableLoad}
                      className="table_HH"
                      bordered
                      dataSource={filteredHangHoa}
                      columns={title}
                      onRow={(record) => ({
                        onDoubleClick: () => {
                          handleChoose(record)
                        },
                      })}
                      pagination={{
                        defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                        showSizeChanger: true,
                        pageSizeOptions: ['50', '100', '1000'],
                        onShowSizeChange: (current, size) => {
                          localStorage.setItem('pageSize', size)
                        },
                      }}
                      size="small"
                      scroll={{
                        x: 1100,
                        y: 420,
                      }}
                      style={{
                        whiteSpace: 'nowrap',
                        fontSize: '24px',
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-end items-end">
                    <ActionButton handleAction={() => setIsShowModal(false)} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </>
  )
}
export default HangHoaModals
