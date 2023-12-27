/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { IoMdClose } from 'react-icons/io'
import categoryAPI from '../../../../API/linkAPI'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import './HangHoaModals.css'
import { Checkbox, Select, Space } from 'antd'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../../components/util/Button/ActionButton'

const HangHoaModals = ({ close, type, getMaHang, getDataHangHoa }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataView, setDataView] = useState({})
  const [nhomHang, setNhomHang] = useState([])
  const [dVTKho, setDVTKho] = useState()
  const [dVTQuyDoi, setDVTQuyDoi] = useState()
  const [HangHoaCT, setHangHoaCT] = useState()
  const [selectedStatus, setSelectedStatus] = useState([])
  const [selectedGroup, setSelectedGroup] = useState([])
  const [selectedBarCodeFrom, setSelectedBarCodeFrom] = useState('')
  const [selectedBarCodeTo, setSelectedBarCodeTo] = useState('')
  const [selectedBarCodeList, setSelectedBarCodeList] = useState([])
  const [selectednhomFrom, setSelectednhomFrom] = useState('')
  const [selectednhomTo, setSelectednhomTo] = useState('')
  const [selectednhomList, setSelectednhomList] = useState([])
  const [lastNumber13Main, setLastNumber13Main] = useState('')
  const [selectedTem, setSelectedTem] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dataThongSo, setDataThongSo] = useState('')
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
    HangHoa_CTs: [{ MaHangChiTiet: '', SoLuong: 1, DVT_CTs: 'Rổng' }],
  }
  const [errors, setErrors] = useState({
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
    HangHoa_CTs: [{ MaHangChiTiet: '', SoLuong: 1, DVT_CTs: 'Rổng' }],
  })
  const [hangHoaForm, setHangHoaForm] = useState(() => {
    return getMaHang ? { ...getMaHang, MaVach: getMaHang?.MaVach, TonKho: true, TyLeQuyDoi: 1 } : initProduct
  })

  useEffect(() => {
    getNhomHang()
    getDVT()
    getHangHoaCT()
    getThongSo()
    handleView()
  }, [type, getMaHang, isLoading, hangHoaForm.Barcodes])

  // functions
  const getNhomHang = async () => {
    try {
      const dataNH = await categoryAPI.ListNhomHang(TokenAccess)
      if (dataNH.data.DataError == 0) {
        setNhomHang(dataNH.data.DataResults)
      } else if ((dataNH.data && dataNH.data.DataError === -107) || (dataNH.data && dataNH.data.DataError === -108)) {
        await RETOKEN()
        getNhomHang()
      } else {
        console.log(dataNH.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getDVT = async () => {
    try {
      const dataDVT = await categoryAPI.ListDVT(TokenAccess)
      if (dataDVT.data.DataError == 0) {
        setDVTQuyDoi(dataDVT.data.DataResults)
        setDVTKho(dataDVT.data.DataResults)
      } else if ((dataDVT.data && dataDVT.data.DataError === -107) || (dataDVT.data && dataDVT.data.DataError === -108)) {
        await RETOKEN()
        getDVT()
      } else {
        console.log(dataDVT.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getHangHoaCT = async () => {
    try {
      const dataHHCT = await categoryAPI.ListHangHoaCT(TokenAccess)
      if (dataHHCT.data.DataError == 0) {
        setHangHoaCT(dataHHCT.data.DataResults)
      } else if ((dataHHCT.data && dataHHCT.data.DataError === -107) || (dataHHCT.data && dataHHCT.data.DataError === -108)) {
        await RETOKEN()
        getHangHoaCT()
      } else {
        console.log(dataHHCT.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
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
  function formatDateTime(inputDate, includeTime = false) {
    const date = new Date(inputDate)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    let formattedDateTime = `${day}/${month}/${year}`
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      formattedDateTime += ` ${hours}:${minutes}:${seconds} `
    }
    return formattedDateTime
  }
  const formatSLSL = (number) => {
    return number.toFixed(Math.max(1, dataThongSo.SOLESOLUONG)).replace(/,/g, '.')
  }
  const formatSLTL = (number) => {
    if (dataView && dataThongSo.SOLETYLE) {
      return (parseFloat(number) || 0).toFixed(Math.max(1, dataThongSo.SOLETYLE)).replace(/,/g, '.')
    }
    return ''
  }
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN')
  }
  // Table Barcode
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
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: [...addBarcode, { MaVach: '', LastNum: 0, NA: false }],
      })
    } else {
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
  const handleChangeHHCT = (index, property, newValue) => {
    if (type == 'create') {
      const newDataList = [...hangHoaForm.HangHoa_CTs]
      if (property == 'MaHangChiTiet') {
        const selectedHangHoa = HangHoaCT.find((item) => item.MaHang === newValue)
        newDataList[index]['DVT_CTs'] = selectedHangHoa?.DVT
      }
      if (property === 'SoLuong') {
        newValue = parseInt(newValue)
      }
      newDataList[index][property] = newValue
      setHangHoaForm({ ...hangHoaForm, HangHoa_CTs: newDataList })
    } else {
      const newDataList = [...dataView.HangHoa_CTs]
      if (property == 'MaHangChiTiet') {
        const selectedHangHoa = HangHoaCT.find((item) => item.MaHang === newValue)
        newDataList[index]['TenHangChiTiet'] = selectedHangHoa?.TenHang
        newDataList[index]['DVTChiTiet'] = selectedHangHoa?.DVT
      }
      if (property === 'SoLuong') {
        newValue = parseInt(newValue)
      }
      newDataList[index][property] = newValue
      setDataView({ ...dataView, HangHoa_CTs: newDataList })
    }
  }
  const addHangHoaCT = () => {
    if (type == 'create') {
      const addHHCT = Array.isArray(hangHoaForm.HangHoa_CTs) ? [...hangHoaForm.HangHoa_CTs] : []
      setHangHoaForm({
        ...hangHoaForm,
        HangHoa_CTs: [...addHHCT, { MaHangChiTiet: '', SoLuong: '', DVT_CTs: 'Rổng' }],
      })
    } else {
      const addHHCT = Array.isArray(dataView.HangHoa_CTs) ? [...dataView.HangHoa_CTs] : []
      setDataView({
        ...dataView,
        HangHoa_CTs: [...addHHCT, { MaHangChiTiet: '', TenHangChiTiet: '', SoLuong: 0 }],
      })
    }
  }
  const removeHangHoaCT = (index) => {
    if (type == 'create') {
      const updatedHHCT = [...hangHoaForm.HangHoa_CTs]
      updatedHHCT.splice(index, 1)
      setHangHoaForm({
        ...hangHoaForm,
        HangHoa_CTs: updatedHHCT,
      })
    } else {
      const updatedHHCT = [...dataView.HangHoa_CTs]
      updatedHHCT.splice(index, 1)
      setDataView({
        ...dataView,
        HangHoa_CTs: updatedHHCT,
      })
    }
  }
  // Handle CRUD
  const handleView = async () => {
    try {
      const infoHang = await categoryAPI.InfoHangHoa(getMaHang?.MaHang, TokenAccess)
      if (infoHang.data.DataError == 0) {
        setDataView(infoHang.data.DataResult)
        setIsLoading(true)
      } else if ((infoHang.data && infoHang.data.DataError === -107) || (infoHang.data && infoHang.data.DataError === -108)) {
        await RETOKEN()
        handleView()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleCreate = async (e) => {
    e.preventDefault()
    const errors = {}
    if (
      !hangHoaForm?.Nhom?.trim() ||
      !hangHoaForm?.TenHang?.trim() ||
      !hangHoaForm?.DVTKho?.trim() ||
      !hangHoaForm?.MaVach?.trim() ||
      (dataThongSo.SUDUNG_MAHANGHOATUDONG === false && !hangHoaForm?.MaHang?.trim())
    ) {
      errors.Nhom = '*Nhóm hàng không được để trống'
      errors.TenHang = '*Tên hàng không được để trống'
      errors.DVTKho = '*Đơn vị tính không được để trống'
      errors.MaVach = '*Mã vạch không được để trống'
      dataThongSo.SUDUNG_MAHANGHOATUDONG === false ? (errors.MaHang = '*Mã hàng không được để trống') : ''
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }
    try {
      let modifiedHangHoaForm = {
        ...hangHoaForm,
        MaVach: `${hangHoaForm.MaVach}${lastNumber13Main}`,
      }
      const response = await categoryAPI.ThemHangHoa(modifiedHangHoaForm, TokenAccess)
      if (response.data.DataError === 0) {
        toast.success('Thêm sản phẩm thành công')
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleCreate()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const dataUpdate = await categoryAPI.SuaHangHoa(
        {
          Ma: hangHoaForm.MaHang,
          Data: {
            ...hangHoaForm,
            Barcodes: dataView.Barcodes,
            HangHoa_CTs: dataView.HangHoa_CTs,
          },
        },
        TokenAccess,
      )
      console.log('hanghoa', hangHoaForm)
      console.log('dataview', dataView)
      console.log({ MaVach: `${hangHoaForm.MaVach}` })
      if (dataUpdate.data.DataError == 0) {
        toast.success('Sửa thành công')
      } else if ((dataUpdate.data && dataUpdate.data.DataError === -107) || (dataUpdate.data && dataUpdate.data.DataError === -108)) {
        await RETOKEN()
        handleUpdate()
      } else {
        toast.error(dataUpdate.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDelete = async () => {
    try {
      const dataDel = await categoryAPI.XoaHangHoa(getMaHang?.MaHang, TokenAccess)
      if (dataDel.data.DataError == 0) {
        toast.success('Xóa sản phẩm thành công')
      } else if ((dataDel.data && dataDel.data.DataError === -107) || (dataDel.data && dataDel.data.DataError === -108)) {
        await RETOKEN()
        handleDelete()
      } else {
        toast.error(dataDel.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleStatus = async (e) => {
    e.preventDefault()
    try {
      const response = await categoryAPI.GanTrangThai(
        {
          DanhSachMa: getMaHang?.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedStatus,
        },
        TokenAccess,
      )
      if (response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleStatus()
      }
    } catch (error) {
      console.error('API call failed:', error)
    }
  }
  const handleGroup = async (e) => {
    e.preventDefault()
    try {
      const response = await categoryAPI.GanNhom(
        {
          DanhSachMa: getMaHang?.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedGroup,
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        toast.success('Thay đổi nhóm thành công')
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleGroup()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handlePrintBar = async (e) => {
    e.preventDefault()
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
        const decodedData = atob(response.data.DataResults)
        const arrayBuffer = new ArrayBuffer(decodedData.length)
        const uint8Array = new Uint8Array(arrayBuffer)
        for (let i = 0; i < decodedData.length; i++) {
          uint8Array[i] = decodedData.charCodeAt(i)
        }
        const blob = new Blob([arrayBuffer], {
          type: 'application/pdf',
        })
        const dataUrl = URL.createObjectURL(blob)
        const newWindow = window.open(dataUrl, '_blank')
        newWindow.onload = function () {
          newWindow.print()
        }
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePrintBar()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
      <div onClick={close} className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
        {type == 'view' && (
          <div className={`flex flex-col p-2 ${dataView?.Barcodes?.length > 0 || dataView?.HangHoa_CTs?.length > 0 ? ' min-w-[90rem]' : 'min-w-[50rem]'}`}>
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 uppercase font-semibold">Thông Tin - Hàng Hóa</p>
              </div>
            </div>
            <div className={`border-2 py-3 px-2 gap-4 ${dataView?.Barcodes?.length > 0 || dataView?.HangHoa_CTs?.length > 0 ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
              <div className="flex flex-col gap-4 ">
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                    <label className="required min-w-[110px] flex justify-end">Mã hàng</label>
                    <input type="text" value={dataView?.MaHang || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap ml-4">
                    <Checkbox className="text-base" id="TonKho" checked={dataView?.NA}>
                      Ngưng dùng
                    </Checkbox>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap ml-4">
                    <Checkbox className="text-base" id="TonKho" checked={dataView?.LapRap}>
                      Lắp ráp
                    </Checkbox>
                  </div>
                  <div className="flex items-center gap-1 ">
                    <Checkbox className="text-base" id="TonKho" checked={dataView?.TonKho}>
                      Tồn kho
                    </Checkbox>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <label className=" whitespace-nowrap required min-w-[110px] flex justify-end">Tên hàng</label>
                  <input type="text" value={dataView?.TenHang || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className="required min-w-[110px] flex justify-end">Tên nhóm</label>
                  <input type="text" value={dataView?.TenNhom || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center gap-1 col-span-2">
                    <label className="required whitespace-nowrap min-w-[110px] flex justify-end">Đơn vị tính</label>
                    <input type="text" value={dataView?.DVTKho || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] " readOnly />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label>x</label>
                    <input
                      type="text"
                      value={formatCurrency(formatSLTL(dataView?.TyLeQuyDoi)) || ''}
                      className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] flex text-end"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <label className="required  whitespace-nowrap">Đơn vị quy đổi</label>
                    <input type="text" value={dataView?.DVTQuyDoi || ''} className="px-2  w-full resize-none  border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                    <label className="required min-w-[110px] flex justify-end">Mã vạch</label>
                    <input type="text" value={dataView?.MaVach || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <label className="whitespace-nowrap min-w-[110px] flex justify-end">Diễn giải hàng</label>
                  <input
                    type="text"
                    value={dataView?.DienGiaiHangHoa == null ? 'Trống' : dataView?.DienGiaiHangHoa || ''}
                    className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]"
                    readOnly
                  />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className="min-w-[110px] flex justify-end">Ghi chú</label>
                  <textarea
                    type="text"
                    value={dataView?.GhiChu == null ? 'Trống' : dataView?.GhiChu || ''}
                    className="px-2  w-full resize-none border-[0.125rem] outline-none text-[1rem]"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 p-3  border-black-200 ml-[110px] relative border-[0.125rem]">
                  <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 whitespace-nowrap" title={dataView.NguoiTao}>
                      <label>Người tạo</label>
                      <input type="text" value={dataView?.NguoiTao || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate" readOnly />
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label>Vào lúc</label>
                      <input type="text" value={formatDateTime(dataView?.NgayTao) || ''} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 whitespace-nowrap" title={dataView.NguoiSuaCuoi}>
                      <label>Người sửa</label>
                      <input type="text" value={dataView?.NguoiSuaCuoi || ' '} className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate" readOnly />
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label>Vào lúc</label>
                      <input
                        type="text"
                        value={formatDateTime(dataView?.NgaySuaCuoi, true) || ''}
                        className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {dataView?.Barcodes?.length !== 0 && (
                  <div className="border-[0.125rem]  p-2 rounded-lg m-1 flex flex-col gap-2 max-h-[20rem] overflow-y-auto">
                    <table className="barcodeList ">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th>Ngưng dùng</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {dataView?.Barcodes?.map((barcode, index) => (
                          <tr key={index}>
                            <td>
                              <div className="max-w-[30rem] flex justify-start">
                                <p className="block truncate">{barcode.MaVach}</p>
                              </div>
                            </td>
                            <td>
                              <Checkbox checked={barcode.NA}></Checkbox>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {dataView?.LapRap == true && (
                  <div className="border-[0.125rem] p-2 rounded-lg m-1 flex flex-col gap-2">
                    <div className="text-base text-slate-600 font-bold uppercase flex">Chi Tiết Hàng</div>
                    <div className="max-h-[20rem] overflow-y-auto">
                      <table className="barcodeList max-h-[2rem] overflow-y-auto">
                        <thead>
                          <tr>
                            <th>Tên Hàng</th>
                            <th>ĐVT</th>
                            <th>Số Lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataView?.HangHoa_CTs.map((item) => (
                            <tr key={item.MaHangChiTiet}>
                              <td>
                                <div title={item.TenHangChiTiet} className="flex justify-start">
                                  <p className="block truncate max-w-[25rem]">{item.TenHangChiTiet}</p>
                                </div>
                              </td>
                              <td>{item.DVTChiTiet}</td>
                              <td>
                                <div className="flex justify-end px-4">{formatSLSL(item.SoLuong)}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div onClick={close} className="flex justify-end mt-2">
              <ActionButton title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
            </div>
          </div>
        )}
        {type == 'create' && (
          <div className="flex flex-col min-w-[90rem] p-2">
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">Thêm - Hàng hóa</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 border-2 gap-4 py-3 px-2">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <div className="col-span-3 flex items-center gap-1 relative">
                      <label className="required min-w-[110px] whitespace-nowrap flex justify-end">Mã hàng</label>
                      <input
                        type="text"
                        className="px-2 py-1 rounded border w-full resize-none  outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        name="MaHang"
                        required
                        disabled={dataThongSo && dataThongSo.SUDUNG_MAHANGHOATUDONG === true}
                        value={hangHoaForm?.MaHang || ''}
                        onChange={(e) => {
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                          setErrors({ ...errors, MaHang: '' })
                        }}
                      />
                      {errors.MaHang && <p className="text-red-500 text-xs font-normal absolute -bottom-[18px] left-[7rem] whitespace-nowrap">{errors.MaHang}</p>}
                    </div>
                    <div>
                      <Checkbox
                        id="TonKho"
                        checked={hangHoaForm?.TonKho || ''}
                        disabled={dataThongSo && dataThongSo.SUDUNG_TONKHOHANGLAPRAP === false}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: e.target.checked,
                          })
                        }
                      >
                        Tồn kho
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        id="LapRap"
                        checked={hangHoaForm?.LapRap}
                        disabled={dataThongSo && dataThongSo.SUDUNG_HANGLAPRAP === false}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: !e.target.checked,
                            [e.target.id]: e.target.checked,
                          })
                        }
                      >
                        Lắp ráp
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        id="NA"
                        className="whitespace-nowrap"
                        checked={hangHoaForm?.NA}
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
                  <div className="flex gap-1 items-center relative">
                    <label className="required min-w-[110px] flex justify-end whitespace-nowrap">Tên hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      name="TenHang"
                      required
                      value={hangHoaForm?.TenHang || ''}
                      onChange={(e) => {
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                        setErrors({ ...errors, TenHang: '' })
                      }}
                    />
                    {errors.TenHang && <p className="text-red-500 text-xs font-normal absolute -bottom-[18px] left-[7rem]">{errors.TenHang}</p>}
                  </div>
                  <div className="flex gap-1 items-center col-span-2 relative">
                    <label className="required min-w-[110px] flex justify-end whitespace-nowrap">Nhóm hàng</label>
                    <Select
                      showSearch
                      name="Nhom"
                      required
                      placeholder="Chọn mã hàng"
                      value={hangHoaForm?.Nhom || ''}
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
                    {errors.Nhom && <p className="text-red-500 text-xs font-normal absolute -bottom-[18px] left-[7rem]">{errors.Nhom}</p>}
                  </div>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="flex col-span-2 gap-1 items-center relative">
                      <label className="required min-w-[110px] flex justify-end whitespace-nowrap">Đơn vị tính</label>
                      <Select
                        name="DVTKho"
                        showSearch
                        value={hangHoaForm?.DVTKho || ''}
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
                      {errors.DVTKho && <p className="text-red-500 text-xs font-normal absolute -bottom-[18px] left-[7rem] whitespace-nowrap">{errors.DVTKho}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="font-semibold">x</label>
                      <input
                        type="text"
                        className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis flex text-end"
                        name="TyLeQuyDoi"
                        disabled={dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false}
                        // step="0.0000000001"
                        min={1}
                        value={hangHoaForm?.TyLeQuyDoi || 1}
                        onChange={(e) => {
                          const tyLeQuyDoiValue = e.target.value
                          if (!isNaN(tyLeQuyDoiValue)) {
                            setHangHoaForm({
                              ...hangHoaForm,
                              [e.target.name]: tyLeQuyDoiValue,
                            })
                            if (tyLeQuyDoiValue == 1) {
                              setHangHoaForm((prev) => ({
                                ...prev,
                                DVTQuyDoi: prev.DVTKho,
                              }))
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex col-span-2 items-center gap-1">
                      <label>
                        <p className="whitespace-nowrap required">Đơn vị quy đổi</p>
                      </label>
                      <Select
                        id="DVTQuyDoi"
                        showSearch
                        value={hangHoaForm?.DVTQuyDoi || ''}
                        disabled={dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false}
                        style={{
                          width: '100%',
                        }}
                        onChange={(value) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            DVTQuyDoi: value,
                          })
                        }
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
                      <label className="required min-w-[110px] flex justify-end whitespace-nowrap">Mã vạch</label>
                      <input
                        type="text"
                        required
                        className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        value={hangHoaForm?.MaVach || ''}
                        maxLength={12}
                        minLength={7}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          const numericValue = inputValue.replace(/[^0-9]/g, '')
                          if (numericValue.length <= 12) {
                            setHangHoaForm({
                              ...hangHoaForm,
                              MaVach: numericValue,
                            })
                          }
                          getMaVach13(inputValue).then((getLast) => {
                            setLastNumber13Main(getLast)
                          })
                          setErrors({ ...errors, MaVach: '' })
                        }}
                      />
                      {errors.MaVach && <p className="text-red-500 text-xs font-normal absolute -bottom-[18px] left-[7rem] whitespace-nowrap">{errors.MaVach}</p>}
                    </div>
                    <div className="text-xl font-bold">{lastNumber13Main}</div>
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="min-w-[110px] flex justify-end whitespace-nowrap">Diễn giải hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      name="DienGiaiHangHoa"
                      value={hangHoaForm?.DienGiaiHangHoa || ''}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="min-w-[110px] flex justify-end whitespace-nowrap">Ghi chú</label>
                    <textarea
                      type="text"
                      className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsispx-4  "
                      name="GhiChu"
                      value={hangHoaForm?.GhiChu || ''}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 px-2 py-3 border-black-200 ml-[115px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label>Người tạo</label>
                        <input type="text" className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label>Vào lúc</label>
                        <input type="text" className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem]" disabled />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label>Người sửa</label>
                        <input type="text" className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label>Vào lúc</label>
                        <input type="text" className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem]" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="border-[0.125rem] p-2 rounded-lg m-1 flex flex-col gap-2">
                    <table className="barcodeList ">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th className="w-[9rem]">Ngưng dùng</th>
                          <th className="w-[3rem]"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hangHoaForm?.Barcodes?.map((barcode, index) => (
                          <tr key={index}>
                            <td>
                              <div className="  items-center gap-2">
                                <input
                                  className="w-full resize-none rounded p-1 border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                                  type="text"
                                  value={barcode.MaVach}
                                  maxLength={12}
                                  minLength={7}
                                  onChange={(e) => {
                                    const inputValue = e.target.value
                                    const numericValue = inputValue.replace(/[^0-9]/g, '')
                                    if (numericValue.length <= 12) {
                                      handleBarcodeChange(index, 'MaVach', numericValue)
                                    }
                                  }}
                                />
                                <div className="text-xl font-bold">{barcode.LastNum}</div>
                              </div>
                            </td>
                            <td>
                              <Checkbox checked={barcode.NA} onChange={(e) => handleBarcodeChange(index, 'NA', e.target.checked)}></Checkbox>
                            </td>
                            <td>
                              <div onClick={() => removeBarcode(index)} className="flex justify-center">
                                <IoMdClose className="w-6 h-6 flex justify-center hover:text-red-500" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end">
                      <ActionButton handleAction={addBarcodeRow} title={'Thêm'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
                    </div>
                  </div>
                  {hangHoaForm?.LapRap == true && (
                    <div className="border-[0.125rem] p-2 rounded-lg m-1 flex flex-col gap-2">
                      <table className="barcodeList">
                        <thead>
                          <tr>
                            <th>Tên Hàng</th>
                            <th className="w-[8rem] whitespace-nowrap">ĐVT</th>
                            <th className="w-[10rem] whitespace-nowrap">Số Lượng</th>
                            <th className="w-[3rem]"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {hangHoaForm?.HangHoa_CTs?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="">
                                  <Select
                                    value={item.MaHangChiTiet}
                                    style={{
                                      width: '100%',
                                    }}
                                    onChange={(value) => handleChangeHHCT(index, 'MaHangChiTiet', value)}
                                  >
                                    {HangHoaCT?.map((hangHoa) => (
                                      <>
                                        <Select.Option key={hangHoa.TenHang} value={hangHoa.MaHang} className="flex items-center text-sm">
                                          <p className="text-base text-start">
                                            {hangHoa.MaHang} - {hangHoa.TenHang}
                                          </p>
                                        </Select.Option>
                                      </>
                                    ))}
                                  </Select>
                                </div>
                              </td>
                              <td>{item.DVT_CTs}</td>
                              <td>
                                <input
                                  className="px-2 w-full resize-none  border-[0.125rem] outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis flex text-end"
                                  type="number"
                                  value={item.SoLuong}
                                  min={1}
                                  onChange={(e) => handleChangeHHCT(index, 'SoLuong', e.target.value)}
                                />
                              </td>
                              <td>
                                <div className="flex justify-center">
                                  <IoMdClose className="w-6 h-6 hover:text-red-500 cursor-pointer" onClick={() => removeHangHoaCT()} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex justify-end">
                        <ActionButton handleAction={addHangHoaCT} title={'Thêm'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-2 gap-2">
                <ActionButton handleAction={handleCreate} title={'Xác nhận'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
                <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        )}
        {type == 'edit' && (
          <div className="flex flex-col min-w-[90rem] p-2">
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">Sửa thông tin - Hàng hóa</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 border-2 gap-4 py-3 px-2">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-6 gap-3 items-center justify-center">
                    <div className="col-span-3 flex items-center gap-1">
                      <label className="required min-w-[110px] whitespace-nowrap flex justify-end">Mã hàng</label>
                      <input
                        type="text"
                        className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        name="MaHang"
                        disabled={dataThongSo && dataThongSo.SUDUNG_MAHANGHOATUDONG === true}
                        value={hangHoaForm.MaHang || ''}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 "
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
                        className="py-1.5"
                        id="LapRap"
                        checked={hangHoaForm.LapRap}
                        disabled={(dataThongSo && dataThongSo.SUDUNG_HANGLAPRAP === false) || dataView.DangSuDung === true}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: !e.target.checked || !hangHoaForm.LapRap,
                            [e.target.id]: e.target.checked,
                          })
                        }
                      >
                        Lắp ráp
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 whitespace-nowrap "
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
                  <div className="flex gap-1 items-center">
                    <label className="required min-w-[110px] whitespace-nowrap flex justify-end">Tên hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      name="TenHang"
                      value={hangHoaForm.TenHang || ''}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <label className="required min-w-[110px] whitespace-nowrap flex justify-end">Nhóm hàng</label>
                    <select
                      type="text"
                      name="Nhom"
                      value={hangHoaForm.Nhom}
                      className="px-2  w-full resize-none  border-[0.125rem] outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      onChange={(e) => {
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }}
                      required
                    >
                      <option value="" disabled hidden></option>
                      {nhomHang?.map((item) => (
                        <option key={item.Ma} value={item.Ma}>
                          {item.ThongTinNhomHang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="required min-w-[110px] whitespace-nowrap flex justify-end">Đơn vị tính</label>
                      <select
                        name="DVTKho"
                        value={hangHoaForm.DVTKho || ''}
                        className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled hidden></option>
                        {dVTQuyDoi?.map((item) => (
                          <option key={item.DVT} value={item.DVT}>
                            {item.DVT}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="font-semibold  ">x</label>
                      <input
                        type="text"
                        className="w-full resize-none border-[0.125rem] outline-none text-[1rem] text-end"
                        name="TyLeQuyDoi"
                        value={formatSLTL(hangHoaForm.TyLeQuyDoi) || ''}
                        min={1}
                        step="0.1"
                        disabled={(dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false) || dataView.DangSuDung === true}
                        onChange={(e) => {
                          const tyLeQuyDoiValue = e.target.value
                          if (!isNaN(tyLeQuyDoiValue)) {
                            setHangHoaForm({
                              ...hangHoaForm,
                              [e.target.name]: tyLeQuyDoiValue,
                            })
                            if (tyLeQuyDoiValue < 10) {
                              setHangHoaForm((prev) => ({
                                ...prev,
                                DVTQuyDoi: prev.DVTKho,
                              }))
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex col-span-2 items-center gap-1">
                      <label className=" whitespace-nowrap required">Đơn vị quy đổi</label>
                      <select
                        id="DVTQuyDoi"
                        value={hangHoaForm.DVTQuyDoi || ''}
                        disabled={(dataThongSo && dataThongSo.SUDUNG_QUYDOIDVT === false) || dataView.DangSuDung === true}
                        className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.id]: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled hidden></option>
                        {dVTKho?.map((item) => (
                          <option key={item.DVT} value={item.DVT}>
                            {item.DVT}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="required min-w-[110px] whitespace-nowrap flex justify-end">Mã vạch</label>
                      <input
                        type="text"
                        className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        name="MaVach"
                        value={hangHoaForm.MaVach || ''}
                        maxLength={12}
                        minLength={7}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          const numericValue = inputValue.replace(/[^0-9]/g, '')
                          if (numericValue.length <= 12) {
                            setHangHoaForm({
                              ...hangHoaForm,
                              [e.target.name]: numericValue,
                            })
                            getMaVach13(inputValue).then((getLast) => {
                              setLastNumber13Main(getLast)
                            })
                          }
                        }}
                      />
                    </div>
                    <div className="text-xl font-bold">{lastNumber13Main}</div>
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="min-w-[110px] whitespace-nowrap flex justify-end">Diễn giải hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      name="DienGiaiHangHoa"
                      value={hangHoaForm.DienGiaiHangHoa || ''}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="min-w-[110px] whitespace-nowrap flex justify-end">Ghi chú</label>
                    <textarea
                      type="text"
                      className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      name="GhiChu"
                      value={hangHoaForm.GhiChu || ''}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-3  border-black-200 ml-[115px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap" title={dataView.NguoiTao}>
                        <label>Người tạo</label>
                        <input type="text" className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] block truncate" value={dataView.NguoiTao} disabled />
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label>Vào lúc</label>
                        <input type="text" className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" value={formatDateTime(dataView.NgayTao, true)} disabled />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap" title={dataView.NguoiSuaCuoi}>
                        <label>Người sửa</label>
                        <input type="text" className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate" value={dataView.NguoiSuaCuoi} disabled />
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label>Vào lúc</label>
                        <input
                          type="text"
                          className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]"
                          value={formatDateTime(dataView.NgaySuaCuoi, true)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="border-[0.125rem] p-2 rounded  m-1 flex flex-col gap-2">
                    <table className="barcodeList">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th className="w-[9rem] whitespace-nowrap">Ngưng dùng</th>
                          <th className="w-[3rem]"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView?.Barcodes?.map((item, index) => (
                          <tr key={index}>
                            <>
                              <td>
                                <div className="flex items-center">
                                  <input
                                    className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                                    type="text"
                                    value={item.MaVach}
                                    maxLength={12}
                                    minLength={7}
                                    onChange={(e) => {
                                      const inputValue = e.target.value
                                      const numericValue = inputValue.replace(/[^0-9]/g, '')
                                      if (numericValue.length <= 12) {
                                        handleBarcodeChange(index, 'MaVach', numericValue)
                                      }
                                    }}
                                  />
                                  <div className="text-xl font-bold">{item.LastNum}</div>
                                </div>
                              </td>
                              <td>
                                <Checkbox checked={item.NA} onChange={(e) => handleBarcodeChange(index, 'NA', e.target.checked)}></Checkbox>
                              </td>
                              <td>
                                <div className="flex justify-center" onClick={() => removeBarcode(index)}>
                                  <IoMdClose className="w-6 h-6 hover:text-red-500" />
                                </div>
                              </td>
                            </>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end">
                      <ActionButton handleAction={addBarcodeRow} title={'Thêm'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
                    </div>
                  </div>
                  {hangHoaForm.LapRap == true && (
                    <div className="border-[0.125rem] p-2 rounded m-1 flex flex-col gap-2">
                      <table className="barcodeList">
                        <thead>
                          <tr>
                            <th>Tên Hàng</th>
                            <th className="w-[8rem] whitespace-nowrap">ĐVT</th>
                            <th className="w-[10rem] whitespace-nowrap">Số Lượng</th>
                            <th className="w-[3rem]"></th>
                          </tr>
                        </thead>
                        {dataView?.HangHoa_CTs?.map((item, index) => (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <div className="px-4">
                                  <select
                                    className="px-2 w-full resize-none py-1 rounded border outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                                    value={item.MaHangChiTiet}
                                    onChange={(e) => handleChangeHHCT(index, 'MaHangChiTiet', e.target.value)}
                                  >
                                    <option value="" disabled hidden>
                                      Chọn tên hàng
                                    </option>
                                    {HangHoaCT?.map((hangHoa) => (
                                      <>
                                        <option key={hangHoa.TenHang} value={hangHoa.MaHang} className="flex items-center">
                                          {hangHoa.MaHang} - {hangHoa.TenHang}
                                        </option>
                                      </>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td>{item.DVTChiTiet}</td>
                              <td>
                                <input
                                  className="px-2 w-full resize-none  border-[0.125rem] text-end outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                                  type="number"
                                  value={formatSLSL(item.SoLuong)}
                                  min={1}
                                  onChange={(e) => handleChangeHHCT(index, 'SoLuong', e.target.value)}
                                />
                              </td>
                              <td>
                                <div className="cursor-pointer hover:text-red-500" onClick={removeHangHoaCT}>
                                  X
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                      <div className="flex justify-end">
                        <ActionButton handleAction={addHangHoaCT} title={'Thêm'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <ActionButton handleAction={handleUpdate} title={'Xác nhận'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
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
                <p className="text-red-500 block truncate">{dataView?.TenHang}</p>
                <p className="text-blue-700 uppercase">?</p>
              </div>
              <p className="text-slate-500 text-lg font-light">Thông tin sản phẩm không thể hoàn tác nếu bạn xóa !</p>
            </div>
            <div className="flex gap-2 justify-end">
              <ActionButton handleAction={handleDelete} title={'Xác nhận'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
              <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
            </div>
          </div>
        )}
        {type == 'statusMany' && (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">Đổi nhóm - Hàng Hóa</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center border-2 p-4 gap-2">
                <div className="required whitespace-nowrap">Trạng thái</div>
                <Space wrap>
                  <Select
                    placeholder="Chọn trạng thái"
                    required
                    style={{
                      width: 500,
                    }}
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value)}
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
                <ActionButton handleAction={handleStatus} title={'Xác nhận'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
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
                  placeholder="Chọn Nhóm"
                  filterOption
                  required
                  style={{
                    width: '450px',
                  }}
                  value={selectedGroup}
                  onChange={(value) => setSelectedGroup(value)}
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
                <ActionButton handleAction={handleGroup} title={'Xác nhận'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
                <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        )}
        {type == 'print' && (
          <div className="flex flex-col gap-2 min-w-[25rem] p-2">
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
                    onChange={(value) => setSelectednhomFrom(value)}
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
                    onChange={(value) => setSelectednhomTo(value)}
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
                <div className="col-span-2 flex gap-1 items-center">
                  <div>Gộp Nhóm</div>
                  <Select
                    mode="multiple"
                    maxTagCount={2}
                    filterOption
                    placeholder="Danh sách nhóm"
                    value={selectednhomList}
                    onChange={(value) => setSelectednhomList(value)}
                    style={{
                      width: '390px',
                    }}
                  >
                    {nhomHang?.map((item) => {
                      return (
                        <Select.Option key={item.Ma} value={item.Ma} title={item.ThongTinNhomHang}>
                          <p className="truncate">{item.Ma}</p>
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
                    onChange={(value) => setSelectedBarCodeFrom(value)}
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
                    onChange={(value) => setSelectedBarCodeTo(value)}
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
                <div className="flex items-center gap-1 col-span-2">
                  <div>Gộp Mã</div>
                  <Select
                    mode="multiple"
                    maxTagCount={2}
                    allowClear
                    filterOption
                    placeholder="Chọn mã hàng"
                    value={selectedBarCodeList}
                    onChange={(value) => setSelectedBarCodeList(value)}
                    style={{
                      width: '370px',
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
              </div>
              <div className="gap-1 flex items-center">
                <label className="required whitespace-nowrap">Số tem</label>
                <input
                  type="number"
                  min={1}
                  value={selectedTem || ''}
                  onChange={(e) => setSelectedTem(e.target.value)}
                  className="border-slate-200    px-2 py-1 w-full resize-none rounded-[0.5rem] border-[0.125rem] outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end px-2 gap-2">
              <ActionButton handleAction={handlePrintBar} title={'Xác nhận'} color={'slate-50'} background={'blue-600'} color_hover={'blue-600'} bg_hover={'white'} />
              <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default HangHoaModals
