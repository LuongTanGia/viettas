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
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'

import logo from '../assets/VTS-iSale.ico'
import { Table, Select, Tooltip, Checkbox, FloatButton } from 'antd'
const { Option } = Select

const { TiPrinter, MdFilterAlt, IoMdAddCircle } = icons

const Modals = ({ close, actionType, dataThongTin, dataKhoHang, dataDoiTuong, dataRecord, data, controlDate, dataThongSo, loading, setHightLight, namePage, typePage }) => {
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

  const [formEdit, setFormEdit] = useState({ ...dataThongTin })

  const [formPrint, setFormPrint] = useState({
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
      if (selectedKhoHang && isLoading) {
        handleAddInList()
      }
    }
  }, [selectedKhoHang, isLoading])

  useEffect(() => {
    if (dataThongTin !== null) setFormEdit(dataThongTin)
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
      render: (text) => <div className="text-start">{text}</div>,
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      align: 'center',
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
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
    },
    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      align: 'center',
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
      align: 'center',
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
      align: 'center',
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
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
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
      align: 'center',
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

  useEffect(() => {
    // if (dataDoiTuong && actionType === 'create') handleDoiTuongFocus(dataDoiTuong[0].Ma)
    if (dataDoiTuong && typePage === 'PMH' && actionType === 'create') {
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
    if (actionType !== 'create') {
      setSelectedSctBD('Chọn số chứng từ')
      setSelectedSctKT('Chọn số chứng từ')
    }
  }, [newData, actionType])

  const handleAddInList = async () => {
    try {
      console.log('get HH')
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'PMH') {
        const response = await apis.ListHelperHH(tokenLogin, selectedKhoHang)
        if (response.data && response.data.DataError === 0) {
          setDataHangHoa(response.data.DataResults)
          setIsLoading(false)
        } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
          setIsLoading(false)
        } else if (response.data.DataError === -107 || response.data.DataError === -108) {
          await RETOKEN()
          handleAddInList()
        } else {
          setIsLoading(false)
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.ListHelperHHNTR(tokenLogin, selectedKhoHang)
        if (response.data && response.data.DataError === 0) {
          setDataHangHoa(response.data.DataResults)
          setIsLoading(false)
        } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
          setIsLoading(false)
        } else if (response.data.DataError === -107 || response.data.DataError === -108) {
          await RETOKEN()
          handleAddInList()
        } else {
          setIsLoading(false)
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
      setIsLoading(false)
    }
  }

  const handleAddRow = (newRow) => {
    let dataNewRow
    setSelectedRowData((prevData) => {
      if (prevData.some((item) => item.MaHang === newRow.MaHang))
        dataNewRow = prevData.map((item) => {
          if (item.MaHang === newRow.MaHang) {
            // return {
            //   ...item,
            //   SoLuong: ++item.SoLuong,
            // }
            toast.warning('Hàng hóa đã tồn tại ở bảng chi tiết', {
              autoClose: 1000,
            })
          }
          return item
        })
      else {
        dataNewRow = [...prevData, { ...newRow, DVTDF: newRow.DVT, TyLeCKTT: 0, TienCKTT: 0 }]
        toast.success('Chọn hàng hóa thành công', {
          autoClose: 1000,
        })
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
        TenDoiTuong: selectedDoiTuongInfo.Ten,
        DiaChi: selectedDoiTuongInfo.DiaChi,
      })
    }

    if (actionType === 'edit' && selectedValue !== 'NCVL') {
      setFormEdit({
        ...formEdit,
        TenDoiTuong: selectedDoiTuongInfo.Ten,
        DiaChi: selectedDoiTuongInfo.DiaChi,
      })
      // console.log('first1', formEdit)
    } else if (actionType === 'edit' && selectedValue === 'NCVL') {
      setFormEdit({
        ...formEdit,
      })
      // console.log('first2', formEdit)
    }
  }

  const handleCreateAndClose = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const dataAddSTT = selectedRowData.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (typePage === 'PMH') {
        const response = await apis.ThemPMH(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)

        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          const soChungTu = response.data.DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          close()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.ThemNTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)

        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          const soChungTu = response.data.DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          close()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const dataAddSTT = selectedRowData.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (typePage === 'PMH') {
        const response = await apis.ThemPMH(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
        if (response.data && response.data.DataError === 0) {
          const soChungTu = response.data.DataResults[0].SoChungTu

          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setSelectedDoiTuong(dataDoiTuong[0].Ma)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
          setSelectedKhoHang(dataKhoHang[0].MaKho)
          setSelectedRowData([])
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleCreate()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.ThemNTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
        if (response.data && response.data.DataError === 0) {
          const soChungTu = response.data.DataResults[0].SoChungTu

          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setSelectedDoiTuong(dataDoiTuong[0].Ma)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
          setSelectedKhoHang(dataKhoHang[0].MaKho)
          setSelectedRowData([])
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleCreate()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleEdit = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const dataAddSTT = selectedRowData.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (typePage === 'PMH') {
        const response = await apis.SuaPMH(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)

        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)

          close()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.SuaNTR(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)

        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)

          close()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      // close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'PMH') {
        const response = await apis.XoaPMH(tokenLogin, dataRecord.SoChungTu)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
        close()
      }
      if (typePage === 'NTR') {
        const response = await apis.XoaNTR(tokenLogin, dataRecord.SoChungTu)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
        close()
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      if (typePage === 'PMH') {
        const response = await apis.InPMH(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrint()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.InNTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrint()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrintOnLy = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'PMH') {
        const response = await apis.SuaPMH(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: selectedRowData }, selectedDoiTuong, selectedKhoHang)
        if (response.data && response.data.DataError === 0) {
          loading()
          setHightLight(dataRecord.SoChungTu)
          setSelectedRowData([])
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.SuaNTR(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: selectedRowData }, selectedDoiTuong, selectedKhoHang)
        if (response.data && response.data.DataError === 0) {
          loading()
          setHightLight(dataRecord.SoChungTu)
          setSelectedRowData([])
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }

      // close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrintWareHouse = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      if (typePage === 'PMH') {
        const response = await apis.InPK(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrintWareHouse()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.InPKNTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrintWareHouse()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePay = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      if (typePage === 'PMH') {
        const response = await apis.LapPhieuChi(tokenLogin, dataRecord.SoChungTu)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          close()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePay()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.LapPhieuChiNTR(tokenLogin, dataRecord.SoChungTu)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          close()
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(response.data.DataErrorDescription)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePay()
        } else {
          toast.error(response.data.DataErrorDescription)
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

  // const handleLien = (checkboxName) => {
  //   setCheckboxValues((prevValues) => ({
  //     ...prevValues,
  //     [checkboxName]: !prevValues[checkboxName],
  //   }))
  // }

  const handleTienMat = () => {
    setFormCreate((prevFormPMH) => {
      return {
        ...prevFormPMH,
        TTTienMat: !prevFormPMH.TTTienMat,
      }
    })
  }

  const handleFilterPrint = () => {
    const ngayBD = dayjs(formPrint.NgayBatDau)
    const ngayKT = dayjs(formPrint.NgayKetThuc)
    // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
    const filteredData = data.filter((item) => {
      const itemDate = dayjs(item.NgayCTu)

      if (ngayBD.isValid() && ngayKT.isValid()) {
        return itemDate >= ngayBD && itemDate <= ngayKT
      }
    })
    setNewData(filteredData)
  }

  const handleEditData = (data) => {
    setSelectedRowData(data)
  }
  const handleChangLoading = (newLoading) => {
    setIsLoading(newLoading)
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        {(actionType === 'delete' || actionType === 'pay') && (
          <div className=" flex justify-between items-center ">
            <label>
              {`${actionType === 'delete' ? 'Bạn có chắc muốn xóa phiếu' : 'Bạn có chắc muốn lập phiếu chi'}`}
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
                      className="DatePicker_PMH max-w-[154px]"
                      format="DD/MM/YYYY"
                      maxDate={dayjs(controlDate.NgayKetThuc)}
                      defaultValue={dayjs(controlDate.NgayBatDau)}
                      onChange={(newDate) => {
                        setFormPrint({
                          ...formPrint,
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
                      onBlur={handleFilterPrint}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFilterPrint()
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-x-5 items-center ">
                    <label htmlFor="">Đến</label>
                    <DateField
                      className="DatePicker_PMH max-w-[154px]"
                      format="DD/MM/YYYY"
                      minDate={dayjs(controlDate.NgayBatDau)}
                      defaultValue={dayjs(controlDate.NgayKetThuc)}
                      onChange={(newDate) => {
                        setFormPrint({
                          ...formPrint,
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
                      onBlur={handleFilterPrint}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFilterPrint()
                        }
                      }}
                    />
                  </div>
                </div>
                {actionType === 'print' ? (
                  <div className="flex  mt-4 ">
                    <div className="flex ">
                      <label className="pr-[23px]">Số chứng từ</label>

                      <Select size="small" showSearch optionFilterProp="children" onChange={(value) => setSelectedSctBD(value)} style={{ width: '154px' }} value={selectedSctBD}>
                        {newData?.map((item) => (
                          <Option key={item.SoChungTu} value={item.SoChungTu}>
                            {item.SoChungTu}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex ">
                      <label className="pl-[18px] pr-[18px]">Đến</label>

                      <Select size="small" showSearch optionFilterProp="children" onChange={(value) => setSelectedSctKT(value)} style={{ width: '154px' }} value={selectedSctKT}>
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
                      <label className="pr-[22px]">Số chứng từ</label>

                      <Select
                        size="small"
                        showSearch
                        optionFilterProp="children"
                        style={{ width: '154px' }}
                        value={selectedSctBD}
                        dropdownMatchSelectWidth={false}
                        onChange={(value) => setSelectedSctBD(value)}
                      >
                        {newData?.map((item) => (
                          <Option key={item.SoChungTu} value={item.SoChungTu}>
                            {`${item.SoChungTu}_GV`}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex ">
                      <label className="pl-[16px] pr-[18px]">Đến</label>

                      <Select
                        size="small"
                        showSearch
                        optionFilterProp="children"
                        onChange={(value) => setSelectedSctKT(value)}
                        style={{ width: '154px' }}
                        value={selectedSctKT}
                        dropdownMatchSelectWidth={false}
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
                <ActionButton color={'slate-50'} title={'Xác nhận'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />
              ) : (
                <ActionButton color={'slate-50'} title={'Xác nhận'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrintWareHouse} />
              )}
              <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          </div>
        )}

        {actionType === 'view' && (
          <div className=" w-[90vw] h-[600px] ">
            <div className="flex gap-2">
              <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
              <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
            </div>
            <div className="border w-full h-[90%] rounded-sm text-sm">
              <div className="flex  md:gap-0 lg:gap-1 pl-1">
                {/* thong tin phieu */}
                <div className="w-[62%]">
                  <div className="flex p-1  ">
                    <div className=" flex items-center ">
                      <label className="md:w-[107px] lg:w-[110px] pr-1">Số C.từ</label>
                      <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.SoChungTu} />
                    </div>
                    {/* DatePicker */}
                    <div className="flex md:px-1 lg:px-4 items-center">
                      <label className="pr-1 lg:pr-[30px] lg:pl-[8px]">Ngày</label>
                      <DatePicker className="DatePicker_PMH" format="DD/MM/YYYY" value={dayjs(dataThongTin?.NgayCTu)} disabled />
                    </div>
                  </div>
                  <div className="p-1 flex justify-between items-center">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>
                    <Select
                      disabled
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                      value={`${dataThongTin.MaDoiTuong}- ${dataThongTin.TenDoiTuong}`}
                      readOnly
                    ></Select>
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Tên</label>
                    <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" value={dataThongTin?.TenDoiTuong} />
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" value={dataThongTin?.DiaChi} />
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
                            value={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
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
                  <input disabled type="are" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" value={dataThongTin?.GhiChu} />
                </div>
              </div>
              {/* table */}
              <div className="py-4">
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
                  Bảng
                  Tổng
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
                          <Table.Summary.Cell className="text-center  "></Table.Summary.Cell>
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
            {/* button */}
            <div className="flex justify-between items-center pt-3">
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
                      <DatePicker
                        // className="DatePicker_PMH "
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
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      onChange={(value) => handleDoiTuongFocus(value)}
                      style={{ width: '100%' }}
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
                      type="text"
                      className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] h-[24px] ${
                        (typePage === 'PMH' && selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]') ||
                        (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                      }`}
                      value={
                        typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                          ? formCreate.TenDoiTuong
                          : typePage === 'PMH' && selectedDoiTuong === 'NCVL'
                            ? formCreate.TenDoiTuong
                            : doiTuongInfo.Ten
                      }
                      onChange={(e) =>
                        setFormCreate({
                          ...formCreate,
                          TenDoiTuong: e.target.value,
                        })
                      }
                      disabled={(typePage === 'PMH' && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
                    />
                  </div>
                  <div className="flex  items-center p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input
                      type="text"
                      className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] h-[24px] ${
                        (typePage === 'PMH' && selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]') ||
                        (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                      }`}
                      value={
                        typePage === 'PMH' && selectedDoiTuong === 'NCVL'
                          ? formCreate.DiaChi
                          : typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                            ? formCreate.DiaChi
                            : doiTuongInfo.DiaChi
                      }
                      onChange={(e) =>
                        setFormCreate({
                          ...formCreate,
                          DiaChi: e.target.value,
                        })
                      }
                      disabled={(typePage === 'PMH' && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
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
                  tableName="MuaHang"
                  param={selectedRowData}
                  handleEditData={handleEditData}
                  ColumnTable={columnName}
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
                    handleCreate(), setIsShowModalOnlyPrint(true)
                  }}
                />
                {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                  <ActionButton
                    color={'slate-50'}
                    title={'In phiếu kho'}
                    background={'purple-500'}
                    bg_hover={'white'}
                    color_hover={'purple-500'}
                    handleAction={() => {
                      handleCreate(), setIsShowModalOnlyPrintWareHouse(true)
                    }}
                  />
                )}
              </div>

              <div className="flex justify-end items-center gap-3  pt-3">
                {/* <button
                  onClick={handleCreate}
                  className="active:scale-[.98] active:duration-75   border-2 border-bg-main text-slate-50 text-text-main font-bold  bg-bg-main hover:bg-white hover:text-bg-main  rounded-md px-2 py-1  w-[80px] "
                >
                  Lưu
                </button> */}
                <ActionButton color={'slate-50'} title={'Lưu'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
                <ActionButton color={'slate-50'} title={'Lưu & đóng'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreateAndClose} />

                <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          </div>
        )}
        {actionType === 'edit' && (
          <div className=" w-[90vw] h-[600px] ">
            <div className="flex gap-2">
              <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
              <label className="text-blue-700 font-semibold uppercase pb-1">sửa - phiếu mua hàng</label>
            </div>
            <div className=" border w-full h-[89%] rounded-sm text-sm">
              <div className="flex  md:gap-0 lg:gap-1 pl-1 ">
                {/* thong tin phieu */}
                <div className="w-[62%] ">
                  <div className="flex p-1  ">
                    <div className=" flex items-center ">
                      <label className="md:w-[106px] lg:w-[110px] pr-1">Số C.từ</label>
                      <input
                        readOnly
                        type="text"
                        className="w-full border border-gray-300 outline-none  px-2   bg-[#fafafa] rounded-[4px] h-[24px]"
                        value={dataThongTin?.SoChungTu}
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
                      <DatePicker
                        className="DatePicker_PMH "
                        format="DD/MM/YYYY"
                        defaultValue={dayjs(dataThongTin.NgayCTu)}
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
                    <Select showSearch size="small" optionFilterProp="children" onChange={(value) => handleDoiTuongFocus(value)} style={{ width: '100%' }} value={selectedDoiTuong}>
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
                      type="text"
                      className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] h-[24px] ${
                        (typePage === 'PMH' && selectedDoiTuong === 'NCVL') || (typePage === 'NTR' && selectedDoiTuong === 'KHVL' && 'hover:border-[#4897e6]')
                      }`}
                      value={
                        typePage === 'PMH' && selectedDoiTuong === 'NCVL'
                          ? formEdit.TenDoiTuong
                          : typePage === 'NTR' && selectedDoiTuong === 'KHVL'
                            ? formEdit.TenDoiTuong
                            : doiTuongInfo.Ten
                      }
                      onChange={(e) =>
                        setFormEdit({
                          ...formEdit,
                          TenDoiTuong: e.target.value,
                        })
                      }
                      disabled={(typePage === 'PMH' && selectedDoiTuong !== 'NCVL') || (typePage === 'NTR' && selectedDoiTuong !== 'KHVL')}
                    />
                  </div>
                  <div className="flex  items-center  p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input
                      type="text"
                      className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] h-[24px] ${selectedDoiTuong === 'NCVL' && 'hover:border-[#4897e6]'}`}
                      value={selectedDoiTuong === 'NCVL' ? formEdit.DiaChi : doiTuongInfo.DiaChi}
                      onChange={(e) =>
                        setFormEdit({
                          ...formEdit,
                          DiaChi: e.target.value,
                        })
                      }
                      disabled={selectedDoiTuong !== 'NCVL'}
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
                        <Tooltip title={dataThongTin?.NguoiTao} color="blue">
                          <input disabled value={dataThongTin?.NguoiTao} type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" />
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
                            value={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
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

                  <Select showSearch size="small" optionFilterProp="children" onChange={(value) => setSelectedKhoHang(value)} style={{ width: '100%' }} value={selectedKhoHang}>
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
                    defaultValue={dataThongTin.GhiChu}
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
                    handlePrintOnLy(dataRecord)
                    setIsShowModalOnlyPrint(true)
                  }}
                />
                {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                  <ActionButton
                    color={'slate-50'}
                    title={'In phiếu kho'}
                    background={'purple-500'}
                    bg_hover={'white'}
                    color_hover={'purple-500'}
                    handleAction={() => {
                      handlePrintOnLy(dataRecord)
                      setIsShowModalOnlyPrintWareHouse(true)
                    }}
                  />
                )}
              </div>
              <div className="flex justify-end items-center gap-x-3  pt-3">
                <ActionButton
                  color={'slate-50'}
                  title={'Lưu & đóng'}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleEdit(dataRecord)}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          </div>
        )}
        {actionType === 'delete' ? (
          <div className="flex justify-end mt-4 gap-2">
            <ActionButton color={'slate-50'} title={'Xác nhận'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={() => handleDelete(dataRecord)} />

            <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
          </div>
        ) : (
          actionType === 'pay' && (
            <div className="flex justify-end mt-4 gap-2">
              <ActionButton color={'slate-50'} title={'Xác nhận'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={() => handlePay(dataRecord)} />
              <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
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
          close={() => setIsShowModalOnlyPrint(false)}
          dataThongTin={dataThongTin}
          data={data}
          actionType={actionType}
          close2={() => close()}
          SctCreate={SctCreate}
        />
      )}
      {isShowModalOnlyPrintWareHouse && (
        <ModalOnlyPrintWareHouse
          typePage={typePage}
          close={() => setIsShowModalOnlyPrintWareHouse(false)}
          dataThongTin={dataThongTin}
          data={data}
          controlDate={controlDate}
          actionType={actionType}
          close2={() => close()}
          SctCreate={SctCreate}
        />
      )}
    </div>
  )
}

export default Modals
