/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react'
import icons from '../untils/icons'
import * as apis from '../apis'
import { Table } from 'antd'
import moment from 'moment'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import ModalHH from './ModalHH'
import { toast } from 'react-toastify'
import TableEdit from '../components/util/Table/EditTable'
import { nameColumsPhieuMuaHang } from '../components/util/Table/ColumnName'
import { CreateRow, EditRow } from '.'
import { RETOKEN, base64ToPDF, formatPrice, formatQuantity, roundNumber } from '../action/Actions'

import ModalOnlyPrint from './ModalOnlyPrint'
import ModalOnlyPrintWareHouse from './ModalOnlyPrintWareHouse'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import TextField from '@mui/material/TextField'
// import Autocomplete from '@mui/material/Autocomplete'
import { Select } from 'antd'
import { number } from 'prop-types'
// import { create } from '@mui/material/styles/createTransitions'
const { Option } = Select

const { TiPrinter } = icons

const Modals = ({ close, actionType, dataThongTin, dataKhoHang, dataDoiTuong, dataRecord, dataPMH, controlDate, isLoadingModel, dataThongSo }) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false)
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [isShowModalOnlyPrintWareHouse, setIsShowModalOnlyPrintWareHouse] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState(null)
  const [selectedKhoHang, setSelectedKhoHang] = useState()
  const [selectedRowData, setSelectedRowData] = useState([])
  const [selectedDoiTuong, setSelectedDoiTuong] = useState()
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [newDataPMH, setNewDataPMH] = useState(dataPMH)
  const currentRowData = useCallback(
    (mahang) => {
      return selectedRowData.map((item) => item.MaHang).filter((item) => item !== '' && item !== mahang)
    },
    [selectedRowData],
  )

  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes(''), [selectedRowData])

  const startDate = dayjs(controlDate.NgayBatDau).format('YYYY-MM-DDTHH:mm:ss')
  const endDate = dayjs(controlDate.NgayKetThuc).format('YYYY-MM-DDTHH:mm:ss')
  const ngayChungTu = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  const daoHan = dayjs().format('YYYY-MM-DDTHH:mm:ss')

  const [formPMH, setFormPMH] = useState({
    NgayCTu: ngayChungTu,
    DaoHan: daoHan,
    TenDoiTuong: '',
    DiaChi: '',
    MaSoThue: '',
    TTTienMat: false,
    GhiChu: null,
    DataDetails: [],
  })

  const [formPMHEdit, setFormPMHEdit] = useState()

  const [formPrint, setFormPrint] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  })

  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  })

  useEffect(() => {
    handleAddInList()
  }, [selectedKhoHang])

  useEffect(() => {
    if (dataThongTin !== null) setFormPMHEdit(dataThongTin)
    console.log('dataThongTin1', dataThongTin)
  }, [dataThongTin, dataThongTin.DataDetails])

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
      sorter: true,
      editable: true,
      align: 'center',
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 150,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
    },
    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
      align: 'end',

      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      render: (text) => <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>{text}</div>,
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TienThue',
      key: 'TienThue',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
      align: 'end',
      fixed: 'right',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.ThanhTien - b.ThanhTien,
    },
  ]
  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong', 'DonGia', 'TienHang', 'TyLeThue', 'TienThue', 'ThanhTien']

  const title = ['STT', 'Mã hàng', 'Tên hàng', 'DVT', 'Số lượng', 'Đơn giá', 'Tiền hàng', '% Thuế', 'Tiền thuế', 'Thành tiền', '']

  useEffect(() => {
    if (dataDoiTuong && actionType === 'create') handleDoiTuongFocus(dataDoiTuong[0].Ma)
    if ((dataDoiTuong && dataThongTin && actionType === 'edit') || (dataDoiTuong && dataThongTin && actionType === 'view')) {
      handleDoiTuongFocus(dataThongTin.MaDoiTuong)

      if (dataThongTin?.DataDetails) {
        setSelectedRowData([...dataThongTin.DataDetails])
      }
    }
  }, [dataDoiTuong, dataThongTin])

  useEffect(() => {
    if (dataKhoHang && dataThongTin && actionType === 'edit') {
      setSelectedKhoHang(dataThongTin.MaKho)
    } else if (dataKhoHang && dataThongTin && actionType !== 'edit') {
      setSelectedKhoHang(dataKhoHang[0].MaKho)
    }
  }, [dataKhoHang, dataThongTin])

  useEffect(() => {
    if (dataPMH) setSelectedSctBD(dataPMH[0].SoChungTu)
    if (dataPMH) setSelectedSctKT(dataPMH[0].SoChungTu)
  }, [dataPMH])

  useEffect(() => {
    setFormPMH((prevFormPMH) => ({
      ...prevFormPMH,
      DataDetails: selectedRowData.map((item, index) => {
        // Đảm bảo rằng item.DonGia là một chuỗi hợp lệ
        const donGiaString = item.DonGia && typeof item.DonGia === 'string' ? item.DonGia : '0'

        // Loại bỏ dấu phẩy và chuyển đổi thành số
        const donGiaNumber = parseFloat(donGiaString.replace(/,/g, '')) || 0

        const tienHang = Number(item.SoLuong) * Number(donGiaNumber)
        const tienThue = Number(tienHang) * (Number(item.TyLeThue) / 100)
        const thanhTien = Number(tienHang) + Number(tienThue)
        const tongCong = Number(thanhTien)

        return {
          STT: index + 1,
          MaHang: item.MaHang,
          TenHang: item.TenHang,
          DVT: item.DVT,
          SoLuong: item.SoLuong,
          DonGia: donGiaNumber,
          TienHang: tienHang,
          TyLeThue: Number(item.TyLeThue),
          TienThue: tienThue,
          ThanhTien: thanhTien,
          TyLeCKTT: 0,
          TienCKTT: 0,
          TongCong: tongCong,
        }
      }),
    }))

    setFormPMHEdit((prevFormPMHEdit) => ({
      ...prevFormPMHEdit,
      DataDetails: selectedRowData.map((item, index) => {
        // Đảm bảo rằng item.DonGia là một chuỗi hợp lệ
        const donGiaString = item.DonGia && typeof item.DonGia === 'string' ? item.DonGia : String(item.DonGia)
        // Loại bỏ dấu phẩy và chuyển đổi thành số
        const donGiaNumber = parseFloat(donGiaString.replace(/,/g, '')) || 0

        const tienHang = Number(item.SoLuong) * Number(donGiaNumber)
        const tienThue = Number(tienHang) * (Number(item.TyLeThue) / 100)
        const thanhTien = Number(tienHang) + Number(tienThue)
        const tongCong = Number(thanhTien)
        return {
          ...item,
          STT: index + 1,
          MaHang: item.MaHang,
          TenHang: item.TenHang,
          DVT: item.DVT,
          SoLuong: item.SoLuong,
          DonGia: donGiaNumber,
          TienHang: tienHang,
          TyLeThue: Number(item.TyLeThue),
          TienThue: tienThue,
          ThanhTien: thanhTien,
          TongCong: tongCong,
        }
      }),
    }))
  }, [selectedRowData, dataThongTin])

  const handleAddInList = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.ListHelperHH(tokenLogin, selectedKhoHang)

      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        setDataHangHoa(response.data.DataResults)
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
          }
          return item
        })
      else dataNewRow = [...prevData, { ...newRow, DVTDefault: newRow.DVT }]
      return dataNewRow
    })

    setFormPMHEdit((prev) => ({ ...prev, DataDetails: dataNewRow }))
  }

  const handleAddEmptyRow = () => {
    if (selectedRowData.map((item) => item.MaHang).includes('')) return

    let emptyRow = {
      SoChungTu: '',
      MaHang: '',
      TenHang: '',
      DVT: '',
      SoLuong: 1,
      DonGia: 0,
      TyLeThue: 0,
      TienThue: 0,
      ThanhTien: 0,
    }

    setSelectedRowData((prevData) => [...prevData, emptyRow])
    setFormPMHEdit((prev) => ({ ...prev, DataDetails: emptyRow }))
  }

  const handleDeleteRow = (index) => {
    const updatedRows = [...selectedRowData]
    updatedRows.splice(index, 1)
    setSelectedRowData(updatedRows)
    setFormPMHEdit((prev) => ({ ...prev, DataDetails: updatedRows }))
  }

  const handleDoiTuongFocus = (selectedValue) => {
    setSelectedDoiTuong(selectedValue)

    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })
    if (actionType === 'create') {
      setFormPMH({
        ...formPMH,
        TenDoiTuong: selectedDoiTuongInfo.Ten,
        DiaChi: selectedDoiTuongInfo.DiaChi,
      })
    }
    if (actionType === 'edit') {
      setFormPMHEdit({
        ...formPMHEdit,
        TenDoiTuong: selectedDoiTuongInfo.Ten,
        DiaChi: selectedDoiTuongInfo.DiaChi,
      })
    }

    // if (actionType === 'edit' && selectedValue !== 'NCVL') {
    //   setFormPMHEdit({
    //     ...formPMHEdit,
    //     TenDoiTuong: selectedDoiTuongInfo.Ten,
    //     DiaChi: selectedDoiTuongInfo.DiaChi,
    //   })
    //   // console.log('first1', formPMHEdit)
    // } else if (actionType === 'edit' && selectedValue === 'NCVL') {
    //   setFormPMHEdit({
    //     ...formPMHEdit,
    //   })
    //   // console.log('first2', formPMHEdit)
    // }
  }

  const handleCreate = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.ThemPMH(tokenLogin, formPMH, selectedDoiTuong, selectedKhoHang)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        window.location.reload()
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleCreate()
      } else {
        // toast.error(response.data.DataErrorDescription)
        console.log(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleEdit = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.SuaPMH(tokenLogin, dataRecord.SoChungTu, formPMHEdit, selectedDoiTuong, selectedKhoHang)

      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        window.location.reload()
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        // toast.warning(response.data.DataErrorDescription)
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleEdit()
      } else {
        toast.error(response.data.DataErrorDescription)
        // console.log(response.data.DataErrorDescription)
      }

      // close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.XoaPMH(tokenLogin, dataRecord.SoChungTu)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        window.location.reload()
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleDelete()
      } else {
        // toast.error(response.data.DataErrorDescription)
        console.log(response.data.DataErrorDescription)
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      const response = await apis.InPMH(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults)
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePrint()
      } else {
        // toast.error(response.data.DataErrorDescription)
        console.log(response.data.DataErrorDescription)
      }

      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrintWareHouse = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()

      const response = await apis.InPK(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults)
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePrintWareHouse()
      } else {
        // toast.error(response.data.DataErrorDescription)
        console.log(response.data.DataErrorDescription)
      }

      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePay = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.LapPhieuChi(tokenLogin, dataRecord.SoChungTu)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        window.location.reload()
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePay()
      } else {
        // toast.error(response.data.DataErrorDescription)
        console.log(response.data.DataErrorDescription)
      }
      close()
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

  const handleLien = (checkboxName) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkboxName]: !prevValues[checkboxName],
    }))
  }

  const handleTienMat = () => {
    setFormPMH({ ...formPMH, TTTienMat: !formPMH.TTTienMat })
  }

  const handleFilterPrint = () => {
    const ngayBD = dayjs(formPrint.NgayBatDau)
    const ngayKT = dayjs(formPrint.NgayKetThuc)
    // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
    const filteredData = dataPMH.filter((item) => {
      const itemDate = dayjs(item.NgayCTu)

      if (ngayBD.isValid() && ngayKT.isValid()) {
        return itemDate >= ngayBD && itemDate <= ngayKT
      }
    })
    setNewDataPMH(filteredData)
  }

  const handleEditData = (data) => {
    setSelectedRowData(data)
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-4 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        {actionType === 'delete' && (
          <div className=" flex justify-between items-center ">
            <label>
              Bạn có chắc muốn xóa phiếu
              <span className="font-bold mx-1"> {dataRecord.SoChungTu}</span>
              không ?
            </label>
            <div></div>
          </div>
        )}
        {actionType === 'pay' && (
          <div className=" flex justify-between items-center ">
            <label>
              Bạn có chắc muốn lập phiếu chi
              <span className="font-bold mx-1"> {dataRecord.SoChungTu}</span>
              không ?
            </label>
            <div></div>
          </div>
        )}
        {actionType === 'print' && (
          <div className="">
            <div className="pb-2 text-text-title font-bold">In phiếu mua hàng</div>
            <div className="flex justify-center items-center  gap-3 pl-[74px]">
              {/* DatePicker */}
              <div className="flex gap-x-5 items-center">
                <label htmlFor="">Ngày</label>
                <DatePicker
                  className="DatePicker_PMH"
                  format="DD/MM/YYYY"
                  value={dayjs(controlDate.NgayBatDau)}
                  onChange={(newDate) => {
                    setFormPrint({
                      ...formPrint,
                      NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                    })
                  }}
                />
              </div>
              <div className="flex gap-x-5 items-center ">
                <label htmlFor="">Đến</label>
                <DatePicker
                  className="DatePicker_PMH"
                  format="DD/MM/YYYY"
                  value={dayjs(controlDate.NgayKetThuc)}
                  onChange={(newDate) => {
                    setFormPrint({
                      ...formPrint,
                      NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                    })
                  }}
                />
              </div>

              <button
                className="flex items-center mx-2 py-1 px-2  rounded-md   border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main"
                onClick={handleFilterPrint}
              >
                Lọc
              </button>
            </div>
            <div className="flex  mt-4 ">
              <div className="flex ">
                <label className="px-4">Số chứng từ</label>

                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctBD}
                  onChange={(e) => setSelectedSctBD(e.target.value)}
                  onClick={(e) => setSelectedSctBD(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex ">
                <label className="px-4">Đến</label>

                <select
                  className=" bg-white border outline-none border-gray-300 "
                  value={selectedSctKT}
                  onChange={(e) => setSelectedSctKT(e.target.value)}
                  onClick={(e) => setSelectedSctKT(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* liên */}
            <div className="flex justify-center items-center gap-6 mt-4">
              <div>
                <input id="lien1" type="checkbox" checked={checkboxValues.checkbox1} onChange={() => handleLien('checkbox1')} />
                <label htmlFor="lien1">Liên 1</label>
              </div>

              <div>
                <input id="lien2" type="checkbox" checked={checkboxValues.checkbox2} onChange={() => handleLien('checkbox2')} />
                <label htmlFor="lien2">Liên 2</label>
              </div>

              <div>
                <input id="lien3" type="checkbox" checked={checkboxValues.checkbox3} onChange={() => handleLien('checkbox3')} />
                <label htmlFor="lien3">Liên 3</label>
              </div>
            </div>
          </div>
        )}
        {actionType === 'printWareHouse' && (
          <div className=" ">
            <div className="pb-2 text-text-title font-bold">In phiếu kho</div>
            <div className="flex justify-center items-center  gap-3 pl-[74px]">
              {/* DatePicker */}
              <div className="flex gap-x-5 items-center">
                <label htmlFor="">Ngày</label>
                <DatePicker
                  className="DatePicker_PMH"
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(controlDate.NgayBatDau)}
                  onChange={(newDate) => {
                    setFormPrint({
                      ...formPrint,
                      NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                    })
                  }}
                />
              </div>
              <div className="flex gap-x-5 items-center ">
                <label htmlFor="">Đến</label>
                <DatePicker
                  className="DatePicker_PMH"
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(controlDate.NgayKetThuc)}
                  onChange={(newDate) => {
                    setFormPrint({
                      ...formPrint,
                      NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                    })
                  }}
                />
              </div>

              <button
                className="flex items-center mx-2 py-1 px-2 rounded-md   border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main"
                onClick={handleFilterPrint}
              >
                Lọc
              </button>
            </div>
            <div className="flex  mt-4 ">
              <div className="flex ">
                <label className="px-4">Số chứng từ</label>
                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctBD}
                  onChange={(e) => setSelectedSctBD(e.target.value)}
                  onClick={(e) => setSelectedSctBD(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex ">
                <label className="px-4">Đến</label>
                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctKT}
                  onChange={(e) => setSelectedSctKT(e.target.value)}
                  onClick={(e) => setSelectedSctKT(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* liên */}
            <div className="flex justify-center items-center gap-6 mt-4">
              <div>
                <input id="lien1" type="checkbox" checked={checkboxValues.checkbox1} onChange={() => handleLien('checkbox1')} />
                <label htmlFor="lien1">Liên 1</label>
              </div>

              <div>
                <input id="lien2" type="checkbox" checked={checkboxValues.checkbox2} onChange={() => handleLien('checkbox2')} />
                <label htmlFor="lien2">Liên 2</label>
              </div>
            </div>
          </div>
        )}
        {actionType === 'view' && (
          <div className=" w-[90vw] h-[600px] ">
            <label className="font-bold pb-1">Xem thông tin - phiếu mua hàng</label>
            <div className="border w-full h-[90%] rounded-sm text-sm">
              <div className="flex gap-3">
                {/* thong tin phieu */}
                <div className="w-[60%]">
                  <div className="flex p-1 justify-between ">
                    <div className=" flex items-center gap-2">
                      <label className="">Số chứng từ</label>
                      <input type="text" className=" border border-gray-300 outline-none  px-2" value={dataThongTin?.SoChungTu} />
                    </div>
                    {/* DatePicker */}
                    <div className="flex gap-x-2 items-center">
                      <label className="pr-3">Ngày</label>
                      <DatePicker className="DatePicker_PMH" format="DD/MM/YYYY" value={dayjs(dataThongTin?.NgayCTu)} />
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <label className="pr-3">Đáo Hạn</label>
                      <DatePicker className="DatePicker_PMH" format="DD/MM/YYYY" value={dayjs(dataThongTin?.DaoHan)} />
                    </div>
                  </div>
                  <div className="p-1 flex justify-between items-center">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>
                    <Select showSearch size="small" optionFilterProp="children" style={{ width: '100%' }} value={selectedDoiTuong} disabled>
                      {dataDoiTuong?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Tên</label>
                    <input type="text" className="w-full border border-gray-300 outline-none px-2 " value={dataThongTin?.TenDoiTuong} />
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input type="text" className="w-full border border-gray-300 outline-none px-2 " value={dataThongTin?.DiaChi} />
                  </div>
                  <div className="flex items-center  w-full">
                    <div className="p-1 flex  items-center w-1/2">
                      <label form="khohang" className="w-[94px]">
                        Kho hàng
                      </label>
                      <select className=" bg-white border w-full  border-gray-300 hover:border-gray-500 ">
                        <option value="ThongTinKho">
                          {dataThongTin?.MaKho} - {dataThongTin?.TenKho}
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center p-1 w-1/2">
                      <label className="w-[86px]">Ghi chú</label>
                      <input type="text" className="w-full border border-gray-300 outline-none px-2 " value={dataThongTin?.GhiChu} />
                    </div>
                  </div>
                </div>

                {/* thong tin cap nhat */}
                <div className="w-[40%] py-1 box_content">
                  <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                  <div className=" rounded-md w-[98%] h-[80%] box_capnhat">
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Người tạo</label>
                        <input type="text" className=" border border-gray-300 outline-none px-2" value={dataThongTin?.NguoiTao} readOnly />
                      </div>
                      <div className="flex items-center p-1 ">
                        <label className="">Lúc</label>
                        <input
                          readOnly
                          type="text"
                          className="border border-gray-300 outline-none "
                          value={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Sửa cuối</label>
                        <input readOnly type="text" className=" border border-gray-300 outline-none px-2 " value={dataThongTin?.NguoiSuaCuoi} />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input
                          readOnly
                          type="text"
                          className="w-full border border-gray-300 outline-none px-2 "
                          value={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* table */}
              <div className="p-4">
                <Table
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
                  Bảng
                  Tổng
                  summary={(pageData) => {
                    let totalThanhTien = 0
                    let totalTienHang = 0
                    let totalSoLuong = 0
                    let totalDonGia = 0
                    let totalTienThue = 0

                    pageData.forEach(({ ThanhTien, TienHang, SoLuong, DonGia, TienThue }) => {
                      totalDonGia += DonGia
                      totalTienHang += TienHang
                      totalSoLuong += SoLuong
                      totalThanhTien += ThanhTien
                      totalTienThue += TienThue
                    })
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row className="text-end font-bold">
                          <Table.Summary.Cell index={0} className="text-center ">
                            {pageData.length}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={2}></Table.Summary.Cell>
                          <Table.Summary.Cell index={3}></Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>{formatQuantity(totalSoLuong, dataThongSo?.SOLESOLUONG)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={5}>{formatPrice(totalDonGia, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={6}>{formatPrice(totalTienHang, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={7}></Table.Summary.Cell>
                          <Table.Summary.Cell index={8}>{formatPrice(totalTienThue, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={9}>{formatPrice(totalThanhTien, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }}
                ></Table>
              </div>
            </div>
            {/* button */}
            <div className="flex justify-between items-center pt-3">
              <div className="flex gap-x-3   ">
                <button
                  onClick={() => setIsShowModalOnlyPrint(true)}
                  className="flex items-center  py-1 px-2  rounded-md  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main"
                >
                  <div className="pr-1">
                    <TiPrinter size={20} />
                  </div>
                  <div>In phiếu</div>
                </button>
                <button
                  onClick={() => setIsShowModalOnlyPrintWareHouse(true)}
                  className="flex items-center  py-1 px-2  rounded-md  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main"
                >
                  <div className="pr-1">
                    <TiPrinter size={20} />
                  </div>
                  <div>In phiếu kho</div>
                </button>
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
            <label className="font-bold ">Thêm thông tin - phiếu mua hàng</label>
            <div className="border w-full h-[90%] rounded-sm text-sm">
              <div className="flex gap-4  ">
                {/* thong tin phieu */}
                <div className="w-[60%]">
                  <div className="flex p-1 justify-between">
                    <div className="flex items-center ">
                      <label className="pr-2">Số chứng từ</label>
                      <input readOnly type="text" className=" border border-gray-300 outline-none  px-2 cursor-not-allowed  bg-gray-200" />
                    </div>
                    {/* DatePicker */}
                    <div className="flex gap-x-2 items-center">
                      <label className="pr-3">Ngày</label>
                      <DatePicker
                        className="DatePicker_PMH"
                        format="DD/MM/YYYY"
                        defaultValue={dayjs()}
                        onChange={(newDate) => {
                          setFormPMH({
                            ...formPMH,
                            NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                          })
                        }}
                      />
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <label className="pr-3">Đáo Hạn</label>
                      <DatePicker
                        className="DatePicker_PMH"
                        format="DD/MM/YYYY"
                        defaultValue={dayjs()}
                        onChange={(newDate) => {
                          setFormPMH({
                            ...formPMH,
                            DaoHan: newDate ? dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss') : null,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-1 flex  ">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>

                    <Select showSearch size="small" optionFilterProp="children" onChange={(value) => handleDoiTuongFocus(value)} style={{ width: '100%' }} value={selectedDoiTuong}>
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
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={selectedDoiTuong === 'NCVL' ? formPMH.TenDoiTuong : doiTuongInfo.Ten}
                      onChange={(e) =>
                        setFormPMH({
                          ...formPMH,
                          TenDoiTuong: e.target.value,
                        })
                      }
                      disabled={selectedDoiTuong !== 'NCVL'}
                    />
                  </div>
                  <div className="flex gap-3 items-center p-1">
                    <label className="w-[86px]">Địa chỉ {formPMH.MaDoiTuong}</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={selectedDoiTuong === 'NCVL' ? formPMH.DiaChi : doiTuongInfo.DiaChi}
                      onChange={(e) =>
                        setFormPMH({
                          ...formPMH,
                          DiaChi: e.target.value,
                        })
                      }
                      disabled={selectedDoiTuong !== 'NCVL'}
                    />
                    <label htmlFor="lapphieuchi" className="w-[116px]">
                      Lập phiếu chi
                    </label>
                    <input
                      id="lapphieuchi"
                      type="checkbox"
                      className="border border-blue-500 rounded-md px-4 py-2
                  hover:bg-blue-500 hover:text-white"
                      checked={formPMH.TTTienMat}
                      onChange={handleTienMat}
                    />
                  </div>
                  <div className="flex items-center  w-full">
                    <div className="p-1 flex  items-center w-1/2">
                      <label form="khohang" className="w-[94px]">
                        Kho hàng
                      </label>

                      <Select showSearch size="small" optionFilterProp="children" onChange={(value) => setSelectedKhoHang(value)} style={{ width: '100%' }} value={selectedKhoHang}>
                        {dataKhoHang?.map((item) => (
                          <Option key={item.MaKho} value={item.MaKho}>
                            {item.ThongTinKho}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center p-1 w-1/2 ">
                      <label className="w-[86px]">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 outline-none px-2 "
                        value={formPMH.GhiChu}
                        onChange={(e) =>
                          setFormPMH({
                            ...formPMH,
                            GhiChu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* thong tin cap nhat */}
                <div className="w-[40%] py-1 box_content">
                  <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                  <div className="-2 rounded-md w-[98%] h-[80%] box_capnhat">
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Người tạo</label>
                        <input type="text" className="   outline-none px-2" readOnly />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input readOnly type="text" className="w-full   outline-none px-2 " />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Sửa cuối</label>
                        <input readOnly type="text" className="   outline-none px-2 " />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input readOnly type="text" className="w-full   outline-none px-2 " />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-3  pr-3">
                <button
                  disabled={isAdd}
                  onClick={handleAddEmptyRow}
                  className={`border border-blue-500 rounded-md px-2 py-1 ${isAdd ? 'cursor-not-allowed text-slate-400' : 'hover:bg-blue-500 hover:text-white'}`}
                >
                  Thêm hàng mới
                </button>
                <button onClick={() => setIsShowModalHH(true)} className="border border-blue-500 rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white">
                  chọn từ danh sách
                </button>
              </div>
              {/* table */}
              {/* <div className="max-w-[98%]  max-h-[50%] mx-auto bg-white  rounded-md my-3 overflow-y-auto ">
                <table className="min-w-full min-h-full bg-white border border-gray-300 text-text-main">
                  <thead>
                    <tr>
                      {title.map((item) => (
                        <th key={item} className="py-1 px-2 border text-center">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRowData.map((item, index) => (
                      <CreateRow
                        key={item.SoChungTu}
                        index={index}
                        item={item}
                        dataHangHoa={dataHangHoa}
                        handleDeleteRow={handleDeleteRow}
                        setRowData={setSelectedRowData}
                        currentRowData={currentRowData(item.MaHang)}
                        dataThongSo={dataThongSo}
                      />
                    ))}
                  </tbody>
                </table>
              </div> */}
              <TableEdit
                className="table_cre"
                param={selectedRowData}
                handleEditData={handleEditData}
                ColumnTable={columnName}
                columName={nameColumsPhieuMuaHang}
                yourMaHangOptions={dataHangHoa}
                yourTenHangOptions={dataHangHoa}
              />
            </div>
            {/* button  */}
            <div className="flex justify-between items-center">
              <div className="flex gap-x-3 py-2">
                {/* <button
                  onClick={() => setIsShowModalOnlyPrint(true)}
                  className="flex items-center  py-1 px-2  rounded-md border-dashed border border-gray-500  text-sm hover:text-sky-500  hover:border-sky-500 "
                >
                  <div className="pr-1">
                    <TiPrinter size={20} />
                  </div>
                  <div>In phiếu</div>
                  
                </button>
                <button
                  onClick={() => setIsShowModalOnlyPrintWareHouse(true)}
                  className="flex items-center  py-1 px-2  rounded-md border-dashed border border-gray-500  text-sm hover:text-sky-500  hover:border-sky-500 "
                >
                  <div className="pr-1">
                    <TiPrinter size={20} />
                  </div>
                  <div>In phiếu kho</div>
                </button> */}
              </div>
              <div className="flex justify-end items-center gap-3  pt-3">
                <button
                  onClick={handleCreate}
                  className="active:scale-[.98] active:duration-75   border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main  rounded-md px-2 py-1  w-[80px] "
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75  border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500 rounded-md px-2 py-1 w-[80px] "
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {actionType === 'edit' && isLoadingModel ? (
          <div className=" w-[90vw] h-[600px] ">
            <label className="font-bold ">Sửa thông tin - phiếu mua hàng</label>
            <div className=" border w-full h-[90%] rounded-sm text-sm">
              <div className="flex gap-4">
                {/* thong tin phieu */}
                <div className="w-[60%] ">
                  <div className="flex p-1  justify-between">
                    <div className=" flex items-center ">
                      <label className="pr-2">Số chứng từ</label>
                      <input
                        readOnly
                        type="text"
                        className=" border border-gray-300 outline-none  px-2  bg-gray-200"
                        value={dataThongTin?.SoChungTu}
                        onChange={(e) =>
                          setFormPMHEdit({
                            ...formPMHEdit,
                            SoChungTu: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* DatePicker */}
                    <div className="flex gap-x-2 items-center ">
                      <label className="pr-3">Ngày</label>
                      <DatePicker
                        className="DatePicker_PMH"
                        format="DD/MM/YYYY"
                        defaultValue={dayjs(dataThongTin?.NgayCTu)}
                        onChange={(newDate) => {
                          setFormPMHEdit({
                            ...formPMHEdit,
                            NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                          })
                        }}
                      />
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <label className="pr-3">Đáo Hạn</label>
                      <DatePicker
                        className="DatePicker_PMH"
                        format="DD/MM/YYYY"
                        defaultValue={dayjs(dataThongTin?.DaoHan)}
                        onChange={(newDate) => {
                          setFormPMHEdit({
                            ...formPMHEdit,
                            DaoHan: newDate ? dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss') : null,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-1 flex ">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>
                    <Select showSearch size="small" optionFilterProp="children" onChange={(value) => handleDoiTuongFocus(value)} style={{ width: '100%' }} value={selectedDoiTuong}>
                      {dataDoiTuong?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                    {/* <select className=" bg-white border w-full  outline-none border-gray-300  " value={selectedDoiTuong} onChange={(e) => handleDoiTuongFocus(e.target.value)}>
                      {dataDoiTuong?.map((item) => (
                        <option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </option>
                      ))}
                    </select> */}
                  </div>
                  <div className="flex items-center   p-1">
                    <label className="w-[86px]">Tên</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={selectedDoiTuong === 'NCVL' ? formPMHEdit.TenDoiTuong : doiTuongInfo.Ten}
                      onChange={(e) =>
                        setFormPMHEdit({
                          ...formPMHEdit,
                          TenDoiTuong: e.target.value,
                        })
                      }
                      disabled={selectedDoiTuong !== 'NCVL'}
                    />
                  </div>
                  <div className="flex items-center  p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input
                      type="text"
                      className=" w-full border border-gray-300 outline-none px-2 "
                      value={selectedDoiTuong === 'NCVL' ? formPMHEdit.DiaChi : doiTuongInfo.DiaChi}
                      onChange={(e) =>
                        setFormPMHEdit({
                          ...formPMHEdit,
                          DiaChi: e.target.value,
                        })
                      }
                      disabled={selectedDoiTuong !== 'NCVL'}
                    />
                  </div>
                  <div className="flex items-center w-full  ">
                    <div className="p-1 flex  items-center w-1/2 ">
                      <label form="khohang" className="w-[94px]">
                        Kho hàng
                      </label>

                      <Select showSearch size="small" optionFilterProp="children" onChange={(value) => setSelectedKhoHang(value)} style={{ width: '100%' }} value={selectedKhoHang}>
                        {dataKhoHang?.map((item) => (
                          <Option key={item.MaKho} value={item.MaKho}>
                            {item.ThongTinKho}
                          </Option>
                        ))}
                      </Select>
                      {/* <select
                        className=" bg-white border  w-full border-gray-300 hover:border-gray-500 "
                        onChange={(e) => setSelectedKhoHang(e.target.value)}
                        value={selectedKhoHang}
                      >
                        {dataKhoHang?.map((item) => (
                          <option key={item.MaKho} value={item.MaKho}>
                            {item.MaKho} - {item.TenKho}
                          </option>
                        ))}
                      </select> */}
                    </div>
                    <div className="flex items-center p-1  w-1/2">
                      <label className="w-[86px]">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 outline-none px-2 "
                        defaultValue={dataThongTin.GhiChu}
                        onChange={(e) =>
                          setFormPMHEdit({
                            ...formPMHEdit,
                            GhiChu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* thong tin cap nhat */}
                <div className="w-[40%] py-1 box_content">
                  <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                  <div className="-2 rounded-md w-[98%] h-[80%] box_capnhat">
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Người tạo</label>
                        <input type="text" className="   outline-none px-2" readOnly />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input readOnly type="text" className="w-full   outline-none px-2 " />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Sửa cuối</label>
                        <input readOnly type="text" className="   outline-none px-2 " />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input readOnly type="text" className="w-full   outline-none px-2 " />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-3 pr-3">
                <button
                  disabled={isAdd}
                  onClick={handleAddEmptyRow}
                  className={`border border-blue-500 rounded-md px-2 py-1 ${isAdd ? 'cursor-not-allowed text-slate-400' : 'hover:bg-blue-500 hover:text-white'}`}
                >
                  Thêm hàng mới
                </button>
                <button onClick={() => setIsShowModalHH(true)} className="border border-blue-500 rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white">
                  chọn từ danh sách
                </button>
              </div>
              {/* table */}
              <div className="  max-w-[98%]  max-h-[50%] mx-auto bg-white  rounded-md my-3 overflow-y-auto ">
                <table className=" min-w-full min-h-full bg-white border border-gray-300 text-text-main">
                  <thead>
                    <tr>
                      {title.map((item, index) => (
                        <th key={index} className="py-1 px-2 border text-center">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="">
                    {selectedRowData.map((item, index) => (
                      <EditRow
                        key={item.MaHang}
                        index={index}
                        item={item}
                        dataHangHoa={dataHangHoa}
                        handleDeleteRow={handleDeleteRow}
                        setRowData={setSelectedRowData}
                        currentRowData={currentRowData(item.MaHang)}
                      />
                    ))}
                  </tbody>
                  {/* <tfoot className="">
                    <tr>
                      <th className="py-2 px-4 border text-center"></th>
                      <th className="py-2 px-4 border text-center"></th>
                      <th className="py-2 px-4 border text-center"></th>
                      <th className="py-2 px-4 border text-center"></th>
                      <th className="py-1 px-3 border text-end">{tongSoLuong.toFixed(1)}</th>
                      <th className="py-1 px-2 border text-end">{tongDonGia.toLocaleString()}</th>
                      <th className="py-2 px-4 border text-end">{tongTienHang.toLocaleString()}</th>
                      <th className="py-2 px-4 border text-center">{tongTyLeThue}</th>
                      <th className="py-2 px-4 border text-end">{tongTienThue.toLocaleString()}</th>
                      <th className="py-2 px-4 border text-end">{tongThanhTien.toLocaleString()}</th>
                      <th className="py-2 px-4 border text-center"></th>
                    </tr>
                  </tfoot> */}
                </table>
              </div>
              {/* <Table dataSource={selectedRowData} columns={columns} />; */}
            </div>

            {/* button  */}
            <div className="flex justify-between items-center">
              <div className="flex gap-x-3 pt-3">
                <button
                  onClick={() => setIsShowModalOnlyPrint(true)}
                  className="flex items-center  py-1 px-2  rounded-md  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main "
                >
                  <div className="pr-1">
                    <TiPrinter size={20} />
                  </div>
                  <div>In phiếu</div>
                </button>
                <button
                  onClick={() => setIsShowModalOnlyPrintWareHouse(true)}
                  className="flex items-center  py-1 px-2  rounded-md  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main "
                >
                  <div className="pr-1">
                    <TiPrinter size={20} />
                  </div>
                  <div>In phiếu kho</div>
                </button>
              </div>
              <div className="flex justify-end items-center gap-x-3  pt-3">
                <button
                  onClick={() => handleEdit(dataRecord)}
                  className="active:scale-[.98] active:duration-75  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75  border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500 rounded-md px-2 py-1 w-[80px] hover:opacity-80"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {actionType === 'delete' ? (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => handleDelete(dataRecord)}
              className="active:scale-[.98] active:duration-75 red-500 border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
            >
              Xác nhận
            </button>
            <button
              onClick={() => close()}
              className="active:scale-[.98] active:duration-75  border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500 rounded-md px-2 py-1 w-[80px] "
            >
              Đóng
            </button>
          </div>
        ) : actionType === 'print' ? (
          <div className="flex justify-end mt-5 gap-2">
            <button
              onClick={handlePrint}
              className="active:scale-[.98] active:duration-75  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
            >
              Xác nhận
            </button>
            <button
              onClick={() => close()}
              className="active:scale-[.98] active:duration-75  border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500 rounded-md px-2 py-1 w-[80px] "
            >
              Đóng
            </button>
          </div>
        ) : actionType === 'printWareHouse' ? (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={handlePrintWareHouse}
              className="active:scale-[.98] active:duration-75  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
            >
              Xác nhận
            </button>
            <button
              onClick={() => close()}
              className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
            >
              Đóng
            </button>
          </div>
        ) : (
          actionType === 'pay' && (
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => handlePay(dataRecord)}
                className="active:scale-[.98] active:duration-75  border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main rounded-md px-2 py-1  w-[80px] "
              >
                Xác nhận
              </button>
              <button
                onClick={() => close()}
                className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
              >
                Đóng
              </button>
            </div>
          )
        )}
      </div>

      {isShowModalHH && <ModalHH close={() => setIsShowModalHH(false)} data={dataHangHoa} onRowCreate={handleAddRow} />}

      {isShowModalOnlyPrint && <ModalOnlyPrint close={() => setIsShowModalOnlyPrint(false)} dataThongTin={dataThongTin} dataPMH={dataPMH} />}

      {isShowModalOnlyPrintWareHouse && <ModalOnlyPrintWareHouse close={() => setIsShowModalOnlyPrintWareHouse(false)} dataThongTin={dataThongTin} dataPMH={dataPMH} />}
    </div>
  )
}

export default Modals
