/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { IoMdClose, IoMdAddCircle } from 'react-icons/io'
import categoryAPI from '../../../../API/linkAPI'
import { toast } from 'react-toastify'
import { useEffect, useState, useCallback } from 'react'
import './HangHoaModals.css'
import moment from 'moment'
import { Checkbox, Select, Space, InputNumber, FloatButton } from 'antd'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../../components/util/Button/ActionButton'

const HangHoaModals = ({ close, type, getMaHang, getDataHangHoa, loadingData, targetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataView, setDataView] = useState({})
  const [nhomHang, setNhomHang] = useState([])
  const [dVTKho, setDVTKho] = useState()
  const [dVTQuyDoi, setDVTQuyDoi] = useState()
  const [HangHoaCT, setHangHoaCT] = useState()
  const [selectedStatus, setSelectedStatus] = useState([])
  const [selectedGroup, setSelectedGroup] = useState([])
  const [selectedBarCodeFrom, setSelectedBarCodeFrom] = useState(null)
  const [selectedBarCodeTo, setSelectedBarCodeTo] = useState(null)
  const [selectedBarCodeList, setSelectedBarCodeList] = useState([])
  const [selectednhomFrom, setSelectednhomFrom] = useState(null)
  const [selectednhomTo, setSelectednhomTo] = useState(null)
  const [selectednhomList, setSelectednhomList] = useState([])
  const [lastNumber13Main, setLastNumber13Main] = useState('')
  const [selectedTem, setSelectedTem] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dataThongSo, setDataThongSo] = useState('')
  // const currentRowData = useCallback(
  //   (mahang) => {
  //     return selectedRowData.map((item) => item.MaHang).filter((item) => item !== '' && item !== mahang)
  //   },
  //   [selectedRowData],
  // )
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
    MaVach: '',
  })
  const [hangHoaForm, setHangHoaForm] = useState(() => {
    return getMaHang ? { ...getMaHang, MaVach: getMaHang?.MaVach } : initProduct
  })
  useEffect(() => {
    getNhomHang()
    getDVT()
    getHangHoaCT()
    getThongSo()
    handleView()
    if (type === 'create') {
      setHangHoaForm({ ...hangHoaForm, TonKho: true, TyLeQuyDoi: 1, HangHoa_CTs: [{ SoLuong: 1, DVT_CTs: '' }] })
    }
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
      const existMaHang = newDataList?.some((item) => item.MaHangChiTiet === newValue)
      if (!existMaHang) {
        newDataList[index][property] = newValue
        setHangHoaForm({ ...hangHoaForm, HangHoa_CTs: newDataList })
      } else {
        toast.warning('Hàng hóa đã được chọn', { autoClose: 1000 })
      }
      if (property === 'SoLuong') {
        newValue = parseFloat(newValue)
      }
    } else {
      const newDataList = [...dataView.HangHoa_CTs]
      if (property === 'MaHangChiTiet') {
        const selectedHangHoa = HangHoaCT.find((item) => item.MaHang === newValue)
        newDataList[index]['TenHangChiTiet'] = selectedHangHoa?.TenHang
        newDataList[index]['DVTChiTiet'] = selectedHangHoa?.DVT
      }
      const existMaHang = newDataList?.some((item) => item.MaHangChiTiet === newValue)
      if (!existMaHang) {
        newDataList[index][property] = newValue
        setDataView({ ...dataView, HangHoa_CTs: newDataList })
      } else {
        toast.warning('Hàng hóa đã được chọn', { autoClose: 1000 })
      }
      if (property === 'SoLuong') {
        newValue = parseFloat(newValue)
      }
    }
  }
  const addHangHoaCT = () => {
    if (type == 'create') {
      const addHHCT = Array.isArray(hangHoaForm.HangHoa_CTs) ? [...hangHoaForm.HangHoa_CTs] : []
      setHangHoaForm({
        ...hangHoaForm,
        HangHoa_CTs: [...addHHCT, { MaHangChiTiet: '', SoLuong: 1, DVT_CTs: '' }],
      })
    } else {
      const addHHCT = Array.isArray(dataView.HangHoa_CTs) ? [...dataView.HangHoa_CTs] : []
      setDataView({
        ...dataView,
        HangHoa_CTs: [...addHHCT, { MaHangChiTiet: '', TenHangChiTiet: '', SoLuong: 1 }],
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
  const handleCreate = async (e, isSave = true) => {
    if (
      !hangHoaForm?.Nhom?.trim() ||
      !hangHoaForm?.TenHang?.trim() ||
      !hangHoaForm?.DVTKho?.trim() ||
      !hangHoaForm?.MaVach?.trim() ||
      (dataThongSo.SUDUNG_MAHANGHOATUDONG ? null : !hangHoaForm?.MaHang?.trim())
    ) {
      setErrors({
        Nhom: hangHoaForm?.Nhom?.trim() ? '' : '*Nhóm không được để trống',
        TenHang: hangHoaForm?.TenHang?.trim() ? '' : '*Tên hàng không được để trống',
        DVTKho: hangHoaForm?.DVTKho?.trim() ? '' : '*ĐVT không được để trống',
        MaVach: hangHoaForm?.MaVach?.trim() ? '' : '*Mã vạch không được để trống',
        MaHang: dataThongSo.SUDUNG_MAHANGHOATUDONG ? null : hangHoaForm?.MaHang?.trim() ? '' : '*Mã hàng không được để trống',
      })
      return
    }
    e.preventDefault()
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
        isSave ? '' : close()
        loadingData()
        toast.success('Thêm sản phẩm thành công', { autoClose: 1000 })
        targetRow(response.data.DataResults[0].Ma)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleCreate()
      } else {
        console.log(hangHoaForm)
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
    }
  }
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
  const handleUpdate = async (e) => {
    // if (
    //   !hangHoaForm?.Nhom?.trim() ||
    //   !hangHoaForm?.TenHang?.trim() ||
    //   !hangHoaForm?.DVTKho?.trim() ||
    //   !hangHoaForm?.MaVach?.trim() ||
    //   (dataThongSo.SUDUNG_MAHANGHOATUDONG ? null : !hangHoaForm?.MaHang?.trim())
    // ) {
    //   setErrors({
    //     Nhom: hangHoaForm?.Nhom?.trim() ? '' : '*Nhóm không được để trống',
    //     TenHang: hangHoaForm?.TenHang?.trim() ? '' : '*Tên hàng không được để trống',
    //     DVTKho: hangHoaForm?.DVTKho?.trim() ? '' : '*Đơn vị tính không được để trống',
    //     MaVach: hangHoaForm?.MaVach?.trim() ? '' : '*Mã vạch không được để trống',
    //     MaHang: dataThongSo.SUDUNG_MAHANGHOATUDONG ? null : hangHoaForm?.MaHang?.trim() ? '' : '*Mã hàng không được để trống',
    //   })
    //   return
    // }
    e.preventDefault()
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
        targetRow(getMaHang)
      } else if ((dataUpdate.data && dataUpdate.data.DataError === -107) || (dataUpdate.data && dataUpdate.data.DataError === -108)) {
        await RETOKEN()
        handleUpdate()
      } else {
        toast.error(dataUpdate.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDelete = async () => {
    try {
      const dataDel = await categoryAPI.XoaHangHoa(getMaHang?.MaHang, TokenAccess)
      if (dataDel.data.DataError == 0) {
        toast.success('Xóa sản phẩm thành công', { autoClose: 1000 })
        setIsLoading(false)
        loadingData()
        close()
      } else if ((dataDel.data && dataDel.data.DataError === -107) || (dataDel.data && dataDel.data.DataError === -108)) {
        await RETOKEN()
        handleDelete()
      } else {
        toast.error(dataDel.data.DataErrorDescription, { autoClose: 1000 })
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
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        loadingData()
        close()
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
        toast.success('Thay đổi nhóm thành công', { autoClose: 1000 })
        loadingData()
        close()
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
        close()
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePrintBar()
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
      <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
        {type == 'view' && (
          <div className={`flex flex-col px-2 ${dataView?.HangHoa_CTs?.length > 0 ? 'w-[95vw]' : 'w-[60vw] lg:w-[55vw] xl:w-[50vw]'}`}>
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
                    <input type="text" value={dataView?.MaHang || ''} className="px-2 w-full rounded resize-none border-[0.125rem] outline-none text-[1rem] truncate" readOnly />
                  </div>
                  <div className="flex items-center ml-[110px] xl:ml-0 gap-2">
                    <div className="flex items-center">
                      <Checkbox className="text-base" id="TonKho" checked={dataView?.TonKho}>
                        Tồn kho
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox className="text-base" id="TonKho" checked={dataView?.LapRap}>
                        Lắp ráp
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox className="text-base" id="TonKho" checked={dataView?.NA}>
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên hàng</label>
                  <input type="text" value={dataView?.TenHang || ''} className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className="required min-w-[90px] text-sm flex justify-end">Tên nhóm</label>
                  <input type="text" value={dataView?.TenNhom || ''} className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center gap-1 col-span-2">
                    <label className="required whitespace-nowrap min-w-[90px] text-sm flex justify-end">Đơn vị tính</label>
                    <input type="text" value={dataView?.DVTKho || ''} className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] " readOnly />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label>x</label>
                    <input
                      type="text"
                      value={formatThapPhan(Number(dataView?.TyLeQuyDoi), dataThongSo?.SOLETYLE) || ''}
                      className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] flex text-end"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <label className="required whitespace-nowrap">Đơn vị quy đổi</label>
                    <input type="text" value={dataView?.DVTQuyDoi || ''} className="px-2 rounded w-full resize-none  border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                    <label className="required min-w-[90px] text-sm flex justify-end">Mã vạch</label>
                    <input type="text" value={dataView?.MaVach || ''} className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                </div>
                <div className="border-[0.125rem] ml-[95px] min-h-[136px] p-2 rounded flex flex-col items-end gap-2">
                  <div className="w-full max-h-[118px] overflow-y-auto">
                    <table className="barcodeList">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th className="w-[10rem]">Ngưng dùng</th>
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
                </div>
                <div className="flex items-center gap-1">
                  <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">Diễn giải hàng</label>
                  <input
                    type="text"
                    value={dataView?.DienGiaiHangHoa == null ? 'Trống' : dataView?.DienGiaiHangHoa || ''}
                    className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                    readOnly
                  />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className="min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                  <textarea
                    type="text"
                    value={dataView?.GhiChu == null ? 'Trống' : dataView?.GhiChu || ''}
                    className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                  <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                  <div className="flex gap-1">
                    <div className="flex items-center gap-1.5 whitespace-nowrap" title={dataView.NguoiTao}>
                      <label className=" text-sm">Người tạo</label>
                      <input
                        title={dataView?.NguoiTao}
                        type="text"
                        value={dataView?.NguoiTao || ''}
                        className={`${
                          hangHoaForm?.LapRap == true ? 'xl:w-[16vw] lg:w-[14vw] md:w-[12vw]' : 'lg:w-[18vw] md:w-[15vw]'
                        } px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate`}
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className=" text-sm">Lúc</label>
                      <input
                        title={dataView?.NgayTao}
                        type="text"
                        value={moment(dataView?.NgayTao)?.format('DD/MM/YYYY') || ''}
                        className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex items-center gap-1 whitespace-nowrap" title={dataView.NguoiSuaCuoi}>
                      <label className=" text-sm">Người sửa</label>
                      <input
                        title={dataView?.NguoiSuaCuoi}
                        type="text"
                        value={dataView?.NguoiSuaCuoi || ' '}
                        className={`${
                          hangHoaForm?.LapRap == true ? 'xl:w-[16vw] lg:w-[14vw] md:w-[12vw]' : ' lg:w-[18vw] md:w-[15vw]'
                        } px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate`}
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className=" text-sm">Lúc</label>
                      <input
                        title={dataView?.NgaySuaCuoi}
                        type="text"
                        value={dataView?.NgaySuaCuoi ? moment(dataView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                        className="px-2 rounded w-full resize-none border-[0.125rem] outline-none text-[1rem] truncate"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                {dataView?.LapRap == true && (
                  <div className="border-[0.125rem] p-2 rounded flex flex-col">
                    <div className="w-full max-h-[525px] overflow-y-auto">
                      <table className="barcodeList">
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
                                <div className="flex justify-end px-4 items-end">{formatThapPhan(Number(item.SoLuong), dataThongSo.SOLESOLUONG)}</div>
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
            <div className="flex justify-end m-2">
              <div onClick={close}>
                <ActionButton title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        )}
        {type == 'create' && (
          <div className={`flex flex-col p-2 ${hangHoaForm?.LapRap == true ? 'w-[95vw]' : 'w-[60vw] lg:w-[55vw] xl:w-[50vw]'}`}>
            <div className="flex items-center justify-between p-1">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">Thêm - Hàng hóa</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-1">
              <div className={`border-2 py-2 px-1 gap-3 ${hangHoaForm?.LapRap == true ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
                <div className="flex flex-col gap-2 p-1 ">
                  <div className="grid grid-cols-1 xl:grid-cols-2 items-center gap-3">
                    <div className="flex items-center gap-1 relative">
                      <label className="required min-w-[90px] text-sm whitespace-nowrap flex justify-end">Mã hàng</label>
                      <input
                        type="text"
                        className={`px-2 rounded border-[1px] w-full resize-none outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis ${
                          dataThongSo && dataThongSo.SUDUNG_MAHANGHOATUDONG === true ? '' : 'hover:border-blue-500'
                        } `}
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
                      {errors.MaHang && <p className="text-red-500 text-xs font-normal absolute bottom-[5px] left-[6.5rem] whitespace-nowrap">{errors.MaHang}</p>}
                    </div>
                    <div className="ml-[110px] xl:ml-0 flex items-center gap-2">
                      <div>
                        <Checkbox
                          id="TonKho"
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
                          id="LapRap"
                          checked={hangHoaForm?.LapRap}
                          disabled={dataThongSo && dataThongSo.SUDUNG_HANGLAPRAP === false}
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
                          id="NA"
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
                  </div>
                  <div className="flex gap-1 items-center relative">
                    <label className="required min-w-[90px] text-sm flex justify-end whitespace-nowrap">Tên hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none rounded border-[1px] outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis hover:border-blue-500"
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
                    {errors.TenHang && <p className="text-red-500 text-[10px] font-normal absolute bottom-[5px] left-[6rem]">{errors.TenHang}</p>}
                  </div>
                  <div className="flex gap-1 items-center col-span-2 relative">
                    <label className="required  min-w-[90px] text-sm flex justify-end whitespace-nowrap">Nhóm hàng</label>
                    <Select
                      showSearch
                      name="Nhom"
                      required
                      size="small"
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
                    {errors.Nhom && <p className="text-red-500 text-[10px] font-normal absolute bottom-[5px] left-[6rem]">{errors.Nhom}</p>}
                  </div>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="flex col-span-2 gap-1 items-center relative">
                      <label className="required  min-w-[90px] text-sm flex justify-end whitespace-nowrap">Đơn vị tính</label>
                      <Select
                        name="DVTKho"
                        showSearch
                        size="small"
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
                      {errors.DVTKho && <p className="text-red-500 text-[10px] font-normal absolute bottom-[5px] left-[6rem] whitespace-nowrap">{errors.DVTKho}</p>}
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
                    <div className="flex col-span-2 items-center gap-1 ">
                      <label>
                        <p className="whitespace-nowrap required">Đơn vị quy đổi</p>
                      </label>
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
                      <label className="required  min-w-[90px] text-sm flex justify-end whitespace-nowrap">Mã vạch</label>
                      <input
                        type="text"
                        required
                        className="px-2 w-full resize-none rounded border-[1px] outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis hover:border-blue-500"
                        value={hangHoaForm?.MaVach ? `${hangHoaForm?.MaVach}${lastNumber13Main}` : ''}
                        maxLength={12}
                        minLength={7}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          const numericValue = inputValue.replace(/[^0-9]/g, '')
                          if (numericValue.length <= 12) {
                            if (numericValue.length === 12) {
                              getMaVach13(numericValue).then((getLast) => {
                                setLastNumber13Main(getLast)
                              })
                            } else {
                              setLastNumber13Main('')
                            }
                            setHangHoaForm({
                              ...hangHoaForm,
                              MaVach: numericValue,
                            })
                          }
                          setErrors({ ...errors, MaVach: '' })
                        }}
                      />
                      {errors.MaVach && <p className="text-red-500 text-[10px] font-normal absolute bottom-[5px] left-[6rem] whitespace-nowrap">{errors.MaVach}</p>}
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
                                  <input
                                    className="w-full resize-none rounded px-2 border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
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
                    </div>
                    <FloatButton
                      type="primary"
                      className={`${
                        hangHoaForm?.Barcodes?.length > 2
                          ? 'HH_Barcode right-[35px] top-[10px]'
                          : hangHoaForm?.LapRap == true
                            ? 'HH_Barcode--LapRap right-[35px] top-[10px]'
                            : ' right-[35px] top-[10px]'
                      } absolute bg-transparent w-[30px] h-[30px]`}
                      icon={<IoMdAddCircle />}
                      onClick={addBarcodeRow}
                      tooltip={<div>Bấm vào đây để thêm hàng !</div>}
                    />
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className=" min-w-[90px] text-sm flex justify-end whitespace-nowrap">Diễn giải hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
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
                    <label className=" min-w-[90px] text-sm flex justify-end whitespace-nowrap">Ghi chú</label>
                    <textarea
                      type="text"
                      className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsispx-4  "
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
                  <div className="grid grid-cols-1 gap-2 mt-1 px-2 py-3 border-black-200 ml-[95px] relative rounded border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <input
                          type="text"
                          className={`${
                            hangHoaForm?.LapRap == true ? 'xl:w-[16vw] lg:w-[14vw] md:w-[10vw]' : 'lg:w-[18vw] md:w-[15vw]'
                          } px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate`}
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input type="text" className="px-2 w-full resize-none rounded border outline-none text-[1rem]" disabled />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <input
                          type="text"
                          className={`${
                            hangHoaForm?.LapRap == true ? 'xl:w-[16vw] lg:w-[14vw] md:w-[10vw]' : 'lg:w-[18vw] md:w-[15vw]'
                          } px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate`}
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input type="text" className="px-2 w-full resize-none rounded border outline-none text-[1rem]" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {hangHoaForm?.LapRap == true && (
                    <div className="border-[0.125rem] min-h-[33.5rem] p-2 rounded flex flex-col gap-2 relative">
                      <div className="w-full max-h-[525px] overflow-y-auto">
                        <table className="barcodeList">
                          <thead>
                            <tr>
                              <th className="whitespace-nowrap">Tên Hàng</th>
                              <th className="w-[6rem] whitespace-nowrap">ĐVT</th>
                              <th className="w-[8rem] whitespace-nowrap">Số Lượng</th>
                              <th className={`${hangHoaForm?.HangHoa_CTs?.length > 11 ? 'w-[3.5rem]' : 'w-[5.5rem]'}`}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {hangHoaForm?.HangHoa_CTs?.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="">
                                    <Select
                                      className="truncate"
                                      showSearch
                                      size="small"
                                      value={item.MaHangChiTiet}
                                      style={{
                                        width: '100%',
                                      }}
                                      onChange={(value) => handleChangeHHCT(index, 'MaHangChiTiet', value)}
                                    >
                                      {HangHoaCT?.map((hangHoa) => (
                                        <>
                                          <Select.Option key={hangHoa.TenHang} value={hangHoa.MaHang} className="flex items-center ">
                                            <p className="text-start truncate">
                                              {hangHoa.MaHang} - {hangHoa.TenHang}
                                            </p>
                                          </Select.Option>
                                        </>
                                      ))}
                                    </Select>
                                  </div>
                                </td>
                                <td>{item.DVT_CTs}</td>
                                <td className="inputHH">
                                  <InputNumber
                                    value={item.SoLuong}
                                    min={1}
                                    max={999999999999}
                                    className=""
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
                                <td>
                                  <div className="flex justify-center">
                                    <IoMdClose className="w-6 h-6 hover:text-red-500 cursor-pointer" onClick={() => removeHangHoaCT(index)} />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <FloatButton
                        type="primary"
                        className={`${
                          hangHoaForm?.HangHoa_CTs?.length > 11 ? 'HH_HHCT right-[35px] top-[10px]' : 'top-[10px] right-[35px]'
                        } absolute bg-transparent w-[30px] h-[30px]`}
                        icon={<IoMdAddCircle />}
                        onClick={addHangHoaCT}
                        tooltip={<div>Bấm vào đây để thêm hàng !</div>}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <ActionButton handleAction={handleCreate} title={'Lưu'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                <ActionButton
                  handleAction={(e) => handleCreate(e, false)}
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
          <div className={`flex flex-col p-2 ${hangHoaForm?.LapRap == true ? 'w-[95vw]' : 'lg:w-[55vw] xl:w-[50vw] md:w-[75vw]'}`}>
            <div className="flex items-center p-1 gap-2">
              <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
              <p className="text-blue-700 font-semibold uppercase">Sửa - Hàng hóa</p>
            </div>
            <div className="flex flex-col gap-2 p-1">
              <div className={`border-2 py-2 px-2 gap-3 ${hangHoaForm?.LapRap == true ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 xl:grid-cols-2  gap-3 items-center justify-center">
                    <div className="flex items-center gap-1">
                      <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Mã hàng</label>
                      <input
                        required
                        type="text"
                        className={`px-2 rounded border-[1px] w-full resize-none outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis ${
                          dataThongSo && dataThongSo.SUDUNG_MAHANGHOATUDONG === true ? '' : 'hover:border-blue-500'
                        } `}
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
                      {errors.MaHang && <p className="text-red-500 text-xs font-normal absolute bottom-[5px] left-[7.5rem] whitespace-nowrap">{errors.MaHang}</p>}
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
                    <input
                      required
                      type="text"
                      className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      name="TenHang"
                      value={hangHoaForm.TenHang || ''}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    {errors.TenHang && <p className="text-red-500 text-xs font-normal absolute bottom-[5px] left-[7.5rem] whitespace-nowrap">{errors.TenHang}</p>}
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Nhóm hàng</label>
                    <Select
                      showSearch
                      size="small"
                      type="text"
                      name="Nhom"
                      value={hangHoaForm.Nhom}
                      style={{
                        width: '100%',
                      }}
                      onChange={(value) => {
                        setHangHoaForm({
                          ...hangHoaForm,
                          Nhom: value,
                        })
                      }}
                      required
                    >
                      {nhomHang?.map((item) => (
                        <Select.Option key={item.Ma} value={item.Ma}>
                          {item.ThongTinNhomHang}
                        </Select.Option>
                      ))}
                    </Select>
                    {errors.Nhom && <p className="text-red-500 text-xs font-normal absolute bottom-[5px] left-[7.5rem] whitespace-nowrap">{errors.Nhom}</p>}
                  </div>
                  <div className={`${hangHoaForm?.LapRap == true ? 'lg:grid-cols-5 md:grid-cols-3' : 'grid grid-cols-5'} grid gap-2 items-center`}>
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="required  min-w-[90px] text-sm whitespace-nowrap flex justify-end">Đơn vị tính</label>
                      <Select
                        showSearch
                        name="DVTKho"
                        size="small"
                        value={hangHoaForm.DVTKho}
                        style={{
                          width: '100%',
                        }}
                        onChange={(value) => {
                          setHangHoaForm({
                            ...hangHoaForm,
                            DVTKho: value,
                          })
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
                      {errors.DVTKho && <p className="text-red-500 text-xs font-normal absolute bottom-[5px] left-[7.5rem] whitespace-nowrap">{errors.DVTKho}</p>}
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
                      <label className=" whitespace-nowrap required">Đơn vị quy đổi</label>
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
                      <input
                        type="text"
                        required
                        className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                        name="MaVach"
                        value={hangHoaForm?.MaVach ? `${hangHoaForm?.MaVach}${lastNumber13Main}` : '' || ''}
                        maxLength={12}
                        minLength={7}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          const numericValue = inputValue.replace(/[^0-9]/g, '')
                          if (numericValue.length <= 12) {
                            if (numericValue.length === 12) {
                              getMaVach13(numericValue).then((getLast) => {
                                setLastNumber13Main(getLast)
                              })
                            } else {
                              setLastNumber13Main('')
                            }
                            setHangHoaForm({
                              ...hangHoaForm,
                              MaVach: numericValue,
                            })
                          }
                          setErrors({ ...errors, MaVach: '' })
                        }}
                      />
                      {errors.MaVach && <p className="text-red-500 text-xs font-normal absolute bottom-[5px] left-[7.5rem] whitespace-nowrap">{errors.MaVach}</p>}
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
                                    <input
                                      className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                                      type="text"
                                      value={item.MaVach || ''}
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
                    </div>
                    <FloatButton
                      type="primary"
                      className={`${
                        dataView?.Barcodes?.length > 2
                          ? 'HH_Barcode right-[35px] top-[10px]'
                          : dataView?.LapRap == true
                            ? 'HH_Barcode--LapRap right-[35px] top-[10px]'
                            : ' right-[35px] top-[10px]'
                      } absolute bg-transparent w-[30px] h-[30px]`}
                      icon={<IoMdAddCircle />}
                      onClick={addBarcodeRow}
                      tooltip={<div>Bấm vào đây để thêm hàng !</div>}
                    />
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className=" min-w-[90px] text-sm whitespace-nowrap flex justify-end">Diễn giải hàng</label>
                    <input
                      type="text"
                      className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
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
                    <label className=" min-w-[90px] text-sm whitespace-nowrap flex justify-end">Ghi chú</label>
                    <textarea
                      type="text"
                      className="px-2 w-full resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
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
                  <div className="grid grid-cols-1 gap-2 px-2 py-3 border-black-200 ml-[95px] mt-1 relative rounded border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 whitespace-nowrap" title={dataView.NguoiTao}>
                        <label className=" text-sm">Người tạo</label>
                        <input
                          type="text"
                          className={`${
                            hangHoaForm?.LapRap == true ? 'xl:w-[16vw] lg:w-[14vw] md:w-[10vw]' : 'lg:w-[16vw] md:w-[15vw]'
                          } px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate`}
                          value={dataView.NguoiTao}
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input
                          type="text"
                          className="px-2 w-full resize-none border rounded outline-none text-[1rem] truncate"
                          value={moment(dataView?.NgayTao).format('DD/MM/YYYY HH:mm:ss ')}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 whitespace-nowrap" title={dataView.NguoiSuaCuoi}>
                        <label className=" text-sm">Người sửa</label>
                        <input
                          type="text"
                          className={`${
                            hangHoaForm?.LapRap == true ? 'xl:w-[16vw] lg:w-[14vw] md:w-[10vw]' : 'lg:w-[16vw] md:w-[15vw]'
                          } px-2 rounded  resize-none border-[0.125rem] outline-none text-[1rem] truncate`}
                          value={dataView.NguoiSuaCuoi}
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input
                          type="text"
                          className="px-2 w-full resize-none border rounded outline-none text-[1rem] truncate"
                          value={dataView?.NgaySuaCuoi ? moment(dataView?.NgaySuaCuoi).format('DD/MM/YYYY HH:mm:ss') : ''}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {hangHoaForm.LapRap == true && (
                    <div className="border-[0.125rem] min-h-[34.5rem] p-2 rounded flex flex-col gap-2 relative">
                      <div className="w-full max-h-[525px] overflow-y-auto ">
                        <table className="barcodeList">
                          <thead>
                            <tr>
                              <th className="whitespace-nowrap">Tên Hàng</th>
                              <th className="w-[8rem] whitespace-nowrap">ĐVT</th>
                              <th className="w-[8rem] whitespace-nowrap">Số Lượng</th>
                              <th className={`${dataView?.HangHoa_CTs?.length > 11 ? 'w-[3.5rem]' : 'w-[5rem]'}`}></th>
                            </tr>
                          </thead>
                          {dataView?.HangHoa_CTs?.map((item, index) => (
                            <tbody key={item.MaHangChiTiet}>
                              <tr>
                                <td>
                                  <div>
                                    <Select
                                      disabled={dataView.DangSuDung == true}
                                      className="max-w-[20rem] truncate"
                                      size="small"
                                      showSearch
                                      value={item.MaHangChiTiet}
                                      style={{
                                        width: '100%',
                                      }}
                                      onChange={(value) => handleChangeHHCT(index, 'MaHangChiTiet', value)}
                                    >
                                      {HangHoaCT?.map((hangHoa) => (
                                        <>
                                          <Select.Option key={hangHoa.TenHang} value={hangHoa.MaHang} className="flex items-center">
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
                                    disabled={dataView.DangSuDung == true}
                                    max={999999999999}
                                    className=""
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
                                <td>
                                  <div className="flex justify-center ">
                                    <IoMdClose className="w-6 h-6 hover:text-red-500 cursor-pointer" onClick={() => removeHangHoaCT(index)} />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </div>
                      <FloatButton
                        type="primary"
                        className={`${
                          dataView?.HangHoa_CTs?.length > 11 ? 'HH_HHCT right-[35px] top-[10px]' : 'HH_HHCT_small top-[10px] right-[32px]'
                        } absolute bg-transparent w-[30px] h-[30px]`}
                        icon={<IoMdAddCircle />}
                        onClick={addHangHoaCT}
                        tooltip={<div>Bấm vào đây để thêm hàng !</div>}
                      />
                    </div>
                  )}
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
                    disabled={selectedBarCodeFrom?.length > 0 || selectedBarCodeTo?.length > 0 || selectedBarCodeList?.length > 0 || selectednhomList?.length > 0}
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
                    disabled={selectedBarCodeFrom?.length > 0 || selectedBarCodeTo?.length > 0 || selectedBarCodeList?.length > 0 || selectednhomList?.length > 0}
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
                <div className="col-span-2 flex gap-1 items-center whitespace-nowrap">
                  <div>Gộp Nhóm</div>
                  <Select
                    mode="multiple"
                    maxTagCount={2}
                    filterOption
                    disabled={
                      selectedBarCodeFrom?.length > 0 ||
                      selectedBarCodeTo?.length > 0 ||
                      selectedBarCodeList?.length > 0 ||
                      selectednhomFrom?.length > 0 ||
                      selectednhomTo?.length > 0
                    }
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
                    disabled={selectednhomFrom?.length > 0 || selectednhomTo?.length > 0 || selectednhomList?.length > 0 || selectedBarCodeList?.length > 0}
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
                    disabled={selectednhomFrom?.length > 0 || selectednhomTo?.length > 0 || selectednhomList?.length > 0 || selectedBarCodeList?.length > 0}
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
                <div className="flex items-center gap-1 col-span-2 whitespace-nowrap">
                  <div>Gộp Mã</div>
                  <Select
                    mode="multiple"
                    maxTagCount={2}
                    allowClear
                    disabled={
                      selectednhomFrom?.length > 0 || selectednhomTo?.length > 0 || selectednhomList?.length > 0 || selectedBarCodeFrom?.length > 0 || selectedBarCodeTo?.length > 0
                    }
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
                <InputNumber
                  min={1}
                  max={999999999999}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={(value) => setSelectedTem(value)}
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
  )
}
export default HangHoaModals
