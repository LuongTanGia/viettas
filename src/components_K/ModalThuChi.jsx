/* eslint-disable react/prop-types */
// import React from 'react'
// import ActionButton from '../components/util/Button/ActionButton'
// import { Checkbox, Tooltip } from 'antd'
import { Checkbox, InputNumber, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { RETOKEN, base64ToPDF, formatPrice } from '../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import { Spin } from 'antd'
import ModalOnlyPrint from './ModalOnlyPrint'
import SimpleBackdrop from '../components/util/Loading/LoadingPage'
const { Option } = Select

const ModalPCT = ({
  data,
  actionType,
  typePage,
  namePage,
  close,
  dataRecord,
  dataThongSo,
  dataHangMuc,
  dataDoiTuong,
  loading,
  setHightLight,
  controlDate,
  dataThongTinSua,
  // dataThongTin,
  isLoadingModal,
  isLoadingEdit,
}) => {
  const [newData, setNewData] = useState(data)
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [SctCreate, setSctCreate] = useState(null)
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [errors, setErrors] = useState({
    Ten: '',
    DiaChi: '',
    GhiChu: '',
    SoTien: '',
    HangMuc: null,
    MaDoiTuong: null,
  })

  const ngayChungTu = dayjs().format('YYYY-MM-DD')
  const defaultFormCreate = {
    NgayCTu: ngayChungTu,
    HangMuc: null,
    MaDoiTuong: null,
    TenDoiTuong: '',
    DiaChi: '',
    SoTien: 0,
    GhiChu: '',
  }

  const [formCreate, setFormCreate] = useState(defaultFormCreate)
  const [formCreateTT, setFormCreateTT] = useState({})

  const [formEdit, setFormEdit] = useState({ ...dataThongTinSua })
  const startDate = dayjs(controlDate.NgayBatDau).format('YYYY-MM-DD')
  const endDate = dayjs(controlDate.NgayKetThuc).format('YYYY-MM-DD')
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

  //  set value default

  useEffect(() => {
    if (dataHangMuc && actionType === 'create') {
      setFormCreate({ ...formCreate, HangMuc: dataHangMuc[1]?.Ma })
    }
    if (dataHangMuc && actionType === 'edit') {
      setFormEdit({ ...formEdit, HangMuc: dataThongTinSua.HangMuc })
    }
  }, [dataHangMuc, dataThongTinSua])

  useEffect(() => {
    if (dataDoiTuong && actionType === 'create') {
      const ncvlDoiTuong = dataDoiTuong.find((item) => item.Ma === 'NCVL')
      const defaultMa = ncvlDoiTuong?.Ma || dataDoiTuong[0]?.Ma || ''
      handleDoiTuongFocus(defaultMa)
    }
    if (dataDoiTuong && actionType === 'edit') {
      handleDoiTuongFocus(dataThongTinSua.MaDoiTuong)
    }
  }, [dataDoiTuong, dataThongTinSua])

  useEffect(() => {
    if (actionType !== 'create') {
      setSelectedSctBD('Chọn số chứng từ')
      setSelectedSctKT('Chọn số chứng từ')
    }
  }, [newData, actionType])

  const handleDoiTuongFocus = (selectedValue) => {
    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })
    if (actionType === 'create') {
      setFormCreate({
        ...formCreate,
        MaDoiTuong: selectedValue,
        TenDoiTuong: selectedDoiTuongInfo?.Ten,
        DiaChi: selectedDoiTuongInfo?.DiaChi,
      })
      setErrors({ ...errors, Ten: '', DiaChi: '', MaDoiTuong: null })
    }

    if ((actionType === 'edit' && selectedValue === 'KHVL') || (actionType === 'edit' && selectedValue === 'NCVL')) {
      setFormEdit({
        ...formEdit,
        MaDoiTuong: selectedValue,
      })
      setErrors({ Ten: '', DiaChi: '' })
    } else {
      setFormEdit({
        ...formEdit,
        MaDoiTuong: selectedValue,
        TenDoiTuong: selectedDoiTuongInfo?.Ten,
        DiaChi: selectedDoiTuongInfo?.DiaChi,
      })
    }
  }

  const handleCreateAndClose = async () => {
    if (!formCreate?.HangMuc?.trim() || !formCreate?.MaDoiTuong?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
      setErrors({
        ...errors,
        HangMuc: formCreate?.HangMuc?.trim() ? null : 'Hạng mục không được để trống',
        MaDoiTuong: formCreate?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
        GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
      })
      return
    }

    if (formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL') {
      if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
        setErrors({
          ...errors,
          Ten: formCreate?.TenDoiTuong?.trim() ? '' : 'Tên không được để trống',
          DiaChi: formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
          GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
          SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
        })
        return
      }
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      if (typePage === 'PCT') {
        const response = await apis.ThemPCT(tokenLogin, formCreate)
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
      if (typePage === 'PTT') {
        const response = await apis.ThemPTT(tokenLogin, formCreate)
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
    if (!formCreate?.HangMuc?.trim() || !formCreate?.MaDoiTuong?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
      setErrors({
        ...errors,
        HangMuc: formCreate?.HangMuc?.trim() ? null : 'Hạng mục không được để trống',
        MaDoiTuong: formCreate?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
        GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
      })
      return
    }
    if (formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL') {
      if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
        setErrors({
          ...errors,
          Ten: formCreate?.TenDoiTuong?.trim() ? '' : 'Tên không được để trống',
          DiaChi: formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
          GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
          SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
        })
        return
      }
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'PCT') {
        const response = await apis.ThemPCT(tokenLogin, formCreate)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          const soChungTu = response.data.DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'PTT') {
        const response = await apis.ThemPTT(tokenLogin, formCreate)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          const soChungTu = response.data.DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
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

  const handleEdit = async (dataRecord) => {
    if (formEdit.MaDoiTuong === 'NCVL' || formEdit.MaDoiTuong === 'KHVL') {
      if (!formEdit?.TenDoiTuong?.trim() || !formEdit?.DiaChi?.trim() || !formEdit?.GhiChu?.trim() || formEdit?.SoTien === null || formEdit?.SoTien === 0) {
        setErrors({
          ...errors,
          Ten: formEdit?.TenDoiTuong?.trim() ? '' : 'Tên không được để trống',
          DiaChi: formEdit?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
          GhiChu: formEdit?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
          SoTien: formEdit?.SoTien === null ? null : formEdit?.SoTien === 0 && 0,
        })
        return
      }
    }
    if (!formEdit?.GhiChu?.trim() || formEdit?.SoTien === null || formEdit?.SoTien === 0) {
      setErrors({
        ...errors,
        GhiChu: formEdit?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formEdit?.SoTien === null ? null : formEdit?.SoTien === 0 && 0,
      })
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'PCT') {
        const response = await apis.SuaPCT(tokenLogin, dataRecord.SoChungTu, formEdit)
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
      if (typePage === 'PTT') {
        const response = await apis.SuaPTT(tokenLogin, dataRecord.SoChungTu, formEdit)
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
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'PCT') {
        const response = await apis.XoaPCT(tokenLogin, dataRecord.SoChungTu)
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
      }
      if (typePage === 'PTT') {
        const response = await apis.XoaPTT(tokenLogin, dataRecord.SoChungTu)
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

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()

      if (typePage === 'PCT') {
        const response = await apis.InPCT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
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
      if (typePage === 'PTT') {
        const response = await apis.InPTT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
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

  const handlePrintInEdit = async () => {
    if (formEdit.MaDoiTuong === 'NCVL' || formEdit.MaDoiTuong === 'KHVL') {
      if (!formEdit?.TenDoiTuong?.trim() || !formEdit?.DiaChi?.trim() || !formEdit?.GhiChu?.trim() || formEdit?.SoTien === null || formEdit?.SoTien === 0) {
        setErrors({
          ...errors,
          Ten: formEdit?.TenDoiTuong?.trim() ? '' : 'Tên không được để trống',
          DiaChi: formEdit?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
          GhiChu: formEdit?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
          SoTien: formEdit?.SoTien === null ? null : formEdit?.SoTien === 0 && 0,
        })
        return
      }
    }
    if (!formEdit?.GhiChu?.trim() || formEdit?.SoTien === null || formEdit?.SoTien === 0) {
      setErrors({
        ...errors,
        GhiChu: formEdit?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formEdit?.SoTien === null ? null : formEdit?.SoTien === 0 && 0,
      })
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')

      if (typePage === 'PCT') {
        const response = await apis.SuaPCT(tokenLogin, dataRecord.SoChungTu, formEdit)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          setIsShowModalOnlyPrint(true)
        } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'PTT') {
        const response = await apis.SuaPTT(tokenLogin, dataRecord.SoChungTu, formEdit)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          setIsShowModalOnlyPrint(true)
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

  const handlePrintInCreate = () => {
    if (formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL') {
      if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
        setErrors({
          ...errors,
          Ten: formCreate?.TenDoiTuong?.trim() ? '' : 'Tên không được để trống',
          DiaChi: formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống',
          GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
          SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
        })
        return
      }
    }
    if (!formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
      setErrors({
        ...errors,
        GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
      })
      return
    }
    setIsShowModalOnlyPrint(true)
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
    const endDate = dayjs(newDate).format('YYYY-MM-DD')

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
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'delete' && (
            <div className=" items-center ">
              <label>
                Bạn có chắc muốn xóa phiếu
                <span className="font-bold mx-1"> {dataRecord.SoChungTu}</span>
                không ?
              </label>
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
            </div>
          )}
          {actionType === 'print' && (
            <div className=" h-[244px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">In - ${namePage} </label>
              </div>

              <div className="border-2 my-1">
                <div className="p-4 ">
                  <div className=" flex justify-center items-center  gap-3 pl-[52px]">
                    {/* DatePicker */}
                    <div className="flex gap-x-5 items-center">
                      <label htmlFor="">Ngày</label>
                      <DateField
                        className="DatePicker_PMH w-[154px]"
                        format="DD/MM/YYYY"
                        // maxDate={dayjs(formPrint.NgayKetThuc)}
                        value={dayjs(formPrint.NgayBatDau)}
                        onChange={(newDate) => {
                          setFormPrint({
                            ...formPrint,
                            NgayBatDau: dayjs(newDate).format('YYYY-MM-DD'),
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
                        className="DatePicker_PMH w-[154px]"
                        format="DD/MM/YYYY"
                        // minDate={dayjs(formPrint.NgayBatDau)}
                        value={dayjs(formPrint.NgayKetThuc)}
                        onChange={(newDate) => {
                          setFormPrint({
                            ...formPrint,
                            NgayKetThuc: dayjs(newDate).format('YYYY-MM-DD'),
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

                  <div className="flex  mt-4 ">
                    <div className="flex ">
                      <label className="pr-[23px]">Số chứng từ</label>

                      <Select size="small" showSearch optionFilterProp="children" style={{ width: '154px' }} value={selectedSctBD} onChange={handleSctBDChange}>
                        {newData?.map((item) => (
                          <Option key={item.SoChungTu} value={item.SoChungTu}>
                            {item.SoChungTu}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex ">
                      <label className="pl-[18px] pr-[18px]">Đến</label>

                      <Select size="small" showSearch optionFilterProp="children" style={{ width: '154px' }} onChange={handleSctKTChange} value={selectedSctKT}>
                        {newData?.map((item) => (
                          <Option key={item.SoChungTu} value={item.SoChungTu}>
                            {item.SoChungTu}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>

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
                <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}

          {actionType === 'view' && (
            <div className="w-[700px] h-[400px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
              </div>
              <div className="border w-full h-[86%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-3  gap-2 items-center">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Số phiếu chi</label>
                          <input
                            value={dataRecord.SoChungTu}
                            type="text"
                            className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                            disabled
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Ngày</label>
                          <DateField
                            className="DatePicker_PMH  w-[110px]"
                            format="DD/MM/YYYY"
                            value={dayjs(dataRecord?.NgayCTu)}
                            disabled
                            sx={{
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
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="  min-w-[90px] text-sm flex justify-end">C.từ góc</label>
                          <input
                            type="text"
                            value={dataRecord?.SoThamChieu || ''}
                            className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hạng mục</label>
                        <input
                          type="text"
                          value={dataRecord?.TenHangMuc}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className="required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                        <input
                          type="text"
                          value={`${dataRecord?.MaDoiTuong} - ${dataRecord?.TenDoiTuong}`}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className="required min-w-[90px] text-sm flex justify-end">Tên</label>
                        <input
                          type="text"
                          value={dataRecord?.TenDoiTuong}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className="required min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                        <input
                          type="text"
                          value={dataRecord?.DiaChi}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className="required min-w-[90px] text-sm flex justify-end">Số tiền</label>
                        <input
                          type="text"
                          value={formatPrice(dataRecord?.SoTien, dataThongSo?.SOLESOTIEN)}
                          className="h-[24px] px-2 rounded-[4px] w-[20%] resize-none border-[1px] border-gray-300 outline-none text-end "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className="min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                        <textarea
                          type="text"
                          value={dataRecord?.GhiChu}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  truncate"
                          disabled
                        />
                      </div>
                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-4 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px] ">Người tạo</label>
                            <Tooltip title={dataRecord?.NguoiTao} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NguoiTao}
                                className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <Tooltip title={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')}
                                className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px]">Sửa cuối</label>
                            <Tooltip title={dataRecord?.NguoiSuaCuoi} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NguoiSuaCuoi}
                                className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <Tooltip
                              title={dataRecord?.NgaySuaCuoi && dayjs(dataRecord.NgaySuaCuoi).isValid() ? dayjs(dataRecord.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NgaySuaCuoi && dayjs(dataRecord.NgaySuaCuoi).isValid() ? dayjs(dataRecord.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                                className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="flex justify-between items-center pt-[10px] ">
                <div className="flex gap-x-3   ">
                  <button
                    onClick={() => setIsShowModalOnlyPrint(true)}
                    className="flex items-center  py-1 px-2  rounded-md  border-2 border-purple-500 text-slate-50 text-text-main font-bold  bg-purple-500 hover:bg-white hover:text-purple-500"
                  >
                    <div className="pr-1">{/* <TiPrinter size={20} /> */}</div>
                    <div>In phiếu</div>
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
            <div className="w-[700px] h-[400px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage} </label>
              </div>

              <Spin spinning={isLoadingModal}>
                <div className="border w-full h-[86%] rounded-[4px]-sm text-sm">
                  <div className="flex flex-col px-2 ">
                    <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="grid grid-cols-3  gap-2 items-center">
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="required  min-w-[90px]  flex justify-end">Số phiếu chi</label>
                            <input type="text" className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300  outline-none  truncate" disabled />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="required  min-w-[90px] text-sm flex justify-end">Ngày</label>
                            <DateField
                              className="DatePicker_PMH"
                              format="DD/MM/YYYY"
                              defaultValue={dayjs()}
                              onChange={(newDate) => {
                                setFormCreate({
                                  ...formCreate,
                                  NgayCTu: dayjs(newDate).format('YYYY-MM-DD'),
                                }),
                                  setFormCreateTT({
                                    ...formCreateTT,
                                    NgayCTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="  min-w-[90px] text-sm flex justify-end">C.từ góc</label>
                            <input type="text" className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate" disabled />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hạng mục</label>
                          <Select
                            status={errors.HangMuc ? 'error' : ''}
                            placeholder={errors.HangMuc}
                            className="w-full"
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={(value) => {
                              setFormCreate({
                                ...formCreate,
                                HangMuc: value,
                              })
                              setErrors({ ...errors, HangMuc: null })
                            }}
                            value={formCreate.HangMuc}
                          >
                            {dataHangMuc?.map((item) => (
                              <Option key={item.Ma} value={item.Ma}>
                                {item.Ten}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className="required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                          <Select
                            status={errors.MaDoiTuong ? 'error' : ''}
                            placeholder={errors.MaDoiTuong}
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={(value) => handleDoiTuongFocus(value)}
                            style={{ width: '100%' }}
                            value={formCreate.MaDoiTuong}
                            // listHeight={280}
                          >
                            {dataDoiTuong?.map((item) => (
                              <Option key={item.Ma} value={item.Ma}>
                                {item.Ma} - {item.Ten}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className="required min-w-[90px] text-sm flex justify-end">Tên</label>
                          <input
                            placeholder={errors?.Ten}
                            type="text"
                            value={formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL' ? formCreate.TenDoiTuong : doiTuongInfo.Ten}
                            className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  hover:border-blue-500
                                       ${(formCreate.MaDoiTuong === 'NCVL' && errors.Ten) || (formCreate.MaDoiTuong === 'KHVL' && errors.Ten) ? 'border-red-500' : ''} `}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                TenDoiTuong: e.target.value,
                              })
                              setErrors({ ...errors, Ten: '' })
                            }}
                            disabled={formCreate.MaDoiTuong !== 'KHVL' && formCreate.MaDoiTuong !== 'NCVL'}
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className="required min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                          <input
                            placeholder={errors?.DiaChi}
                            type="text"
                            value={formCreate.MaDoiTuong === 'NCVL' || formCreate.MaDoiTuong === 'KHVL' ? formCreate.DiaChi : doiTuongInfo.DiaChi}
                            className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  hover:border-blue-500
                                       ${(formCreate.MaDoiTuong === 'NCVL' && errors.DiaChi) || (formCreate.MaDoiTuong === 'KHVL' && errors.DiaChi) ? 'border-red-500' : ''} `}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                DiaChi: e.target.value,
                              })
                              setErrors({ ...errors, DiaChi: '' })
                            }}
                            disabled={formCreate.MaDoiTuong !== 'KHVL' && formCreate.MaDoiTuong !== 'NCVL'}
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className="required min-w-[90px] text-sm flex justify-end">Số tiền </label>
                          <InputNumber
                            className={`w-[20%]   
                                       ${errors.SoTien === 0 || errors.SoTien === null ? 'border-red-500' : ''} `}
                            placeholder={errors.SoTien}
                            size="small"
                            min={0}
                            max={999999999999}
                            value={formCreate.SoTien}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => {
                              const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                              return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLESOTIEN))
                            }}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                SoTien: e,
                              })
                              setErrors({ ...errors, SoTien: e })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                          <textarea
                            placeholder={errors.GhiChu}
                            type="text"
                            value={formCreate.GhiChu}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                GhiChu: e.target.value,
                              })
                              setErrors({ ...errors, GhiChu: '' })
                            }}
                            className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none hover:border-blue-500
                                       ${errors.GhiChu ? 'border-red-500' : ''} `}
                          />
                        </div>
                        {/* thong tin */}
                        <div className="grid grid-cols-1 mt-4 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                          <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                          <div className="flex justify-between ">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <label className=" text-sm min-w-[70px] ">Người tạo</label>
                              <Tooltip color="blue">
                                <input
                                  disabled
                                  type="text"
                                  // value={dataRecord?.NguoiTao}
                                  className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                                />
                              </Tooltip>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <label className=" text-sm">Lúc</label>
                              <Tooltip color="blue">
                                <input
                                  disabled
                                  type="text"
                                  // value={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')}
                                  className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                                />
                              </Tooltip>
                            </div>
                          </div>
                          <div className="flex justify-between ">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <label className=" text-sm min-w-[70px]">Sửa cuối</label>
                              <Tooltip color="blue">
                                <input
                                  disabled
                                  type="text"
                                  className="h-[24px]  lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                                />
                              </Tooltip>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <label className=" text-sm">Lúc</label>
                              <Tooltip color="blue">
                                <input
                                  disabled
                                  type="text"
                                  // value={dataRecord?.NgaySuaCuoi && dayjs(dataRecord.NgaySuaCuoi).isValid() ? dayjs(dataRecord.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                                  className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>

              {/* button */}
              <div className="flex justify-between items-center pt-[10px] ">
                <div className="flex gap-x-3   ">
                  <ActionButton
                    color={'slate-50'}
                    title={'In phiếu'}
                    background={'purple-500'}
                    bg_hover={'white'}
                    color_hover={'purple-500'}
                    handleAction={() => {
                      handleCreate(), handlePrintInCreate()
                    }}
                    isModal={true}
                  />
                </div>
                <div className="flex gap-2">
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
                <div className="w-[700px] h-[400px]">
                  <div className="flex gap-2">
                    <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                    <label className="text-blue-700 font-semibold uppercase pb-1"> Sửa - {namePage} </label>
                  </div>

                  <div className="border w-full h-[86%] rounded-[4px]-sm text-sm">
                    <div className="flex flex-col px-2 ">
                      <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="grid grid-cols-3  gap-2 items-center">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px]  flex justify-end">Số phiếu chi</label>
                              <input
                                value={dataThongTinSua?.SoChungTu}
                                type="text"
                                className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300  outline-none  truncate"
                                disabled
                              />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Ngày</label>
                              <DateField
                                className="DatePicker_PMH"
                                format="DD/MM/YYYY"
                                defaultValue={dayjs(dataThongTinSua?.NgayCTu)}
                                onChange={(newDate) => {
                                  setFormEdit({
                                    ...formEdit,
                                    NgayCTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="  min-w-[90px] text-sm flex justify-end">C.từ góc</label>
                              <input
                                type="text"
                                value={dataThongTinSua?.SoThamChieu || ''}
                                className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hạng mục</label>
                            <Select
                              className="w-full"
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              onChange={(value) =>
                                setFormEdit({
                                  ...formEdit,
                                  HangMuc: value,
                                })
                              }
                              value={formEdit.HangMuc}
                            >
                              {dataHangMuc?.map((item) => (
                                <Option key={item.Ma} value={item.Ma}>
                                  {item.Ten}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap  ">
                            <label className="required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                            <Select
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              onChange={(value) => handleDoiTuongFocus(value)}
                              style={{ width: '100%' }}
                              value={formEdit.MaDoiTuong}
                              // listHeight={280}
                            >
                              {dataDoiTuong?.map((item) => (
                                <Option key={item.Ma} value={item.Ma}>
                                  {item.Ma} - {item.Ten}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap  ">
                            <label className="required min-w-[90px] text-sm flex justify-end">Tên</label>
                            <input
                              className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none hover:border-blue-500
                                             ${(formEdit.MaDoiTuong === 'NCVL' && errors.Ten) || (formEdit.MaDoiTuong === 'KHVL' && errors.Ten) ? 'border-red-500' : ''} `}
                              placeholder={errors?.Ten}
                              type="text"
                              value={formEdit.MaDoiTuong === 'NCVL' || formEdit.MaDoiTuong === 'KHVL' ? formEdit.TenDoiTuong : doiTuongInfo.Ten}
                              onChange={(e) => {
                                setFormEdit({
                                  ...formEdit,
                                  TenDoiTuong: e.target.value,
                                })
                                setErrors({ ...errors, Ten: '' })
                              }}
                              disabled={formEdit.MaDoiTuong !== 'KHVL' && formEdit.MaDoiTuong !== 'NCVL'}
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap  ">
                            <label className="required min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                            <input
                              className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none hover:border-blue-500
                                             ${(formEdit.MaDoiTuong === 'NCVL' && errors.DiaChi) || (formEdit.MaDoiTuong === 'KHVL' && errors.DiaChi) ? 'border-red-500' : ''} `}
                              placeholder={errors?.DiaChi}
                              type="text"
                              value={formEdit.MaDoiTuong === 'NCVL' || formEdit.MaDoiTuong === 'KHVL' ? formEdit.DiaChi : doiTuongInfo.DiaChi}
                              onChange={(e) => {
                                setFormEdit({
                                  ...formEdit,
                                  DiaChi: e.target.value,
                                })
                                setErrors({ ...errors, DiaChi: '' })
                              }}
                              disabled={formEdit.MaDoiTuong !== 'KHVL' && formEdit.MaDoiTuong !== 'NCVL'}
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap  ">
                            <label className="required min-w-[90px] text-sm flex justify-end">Số tiền</label>

                            <InputNumber
                              className={`w-[20%] ${errors.SoTien === 0 || errors.SoTien === null ? 'border-red-500' : ''} `}
                              size="small"
                              min={0}
                              max={999999999999}
                              value={formEdit.SoTien}
                              formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => {
                                const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLESOTIEN))
                              }}
                              onChange={(e) => {
                                setFormEdit({
                                  ...formEdit,
                                  SoTien: e,
                                })
                                setErrors({ ...errors, SoTien: e })
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="required min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                            <textarea
                              placeholder={errors.GhiChu}
                              type="text"
                              value={formEdit.GhiChu}
                              onChange={(e) => {
                                setFormEdit({
                                  ...formEdit,
                                  GhiChu: e.target.value,
                                })
                                setErrors({ ...errors, GhiChu: '' })
                              }}
                              className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none hover:border-blue-500
                                             ${errors.GhiChu ? 'border-red-500' : ''} `}
                            />
                          </div>
                          {/* thong tin */}
                          <div className="grid grid-cols-1 mt-4 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                            <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                            <div className="flex justify-between">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <label className=" text-sm min-w-[70px] ">Người tạo</label>
                                <Tooltip color="blue" title={dataThongTinSua?.NguoiTao}>
                                  <input
                                    disabled
                                    type="text"
                                    value={dataThongTinSua?.NguoiTao}
                                    className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                                  />
                                </Tooltip>
                              </div>
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <label className=" text-sm">Lúc</label>
                                <Tooltip color="blue" title={dayjs(dataThongTinSua?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')}>
                                  <input
                                    disabled
                                    type="text"
                                    value={dayjs(dataThongTinSua?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')}
                                    className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                                  />
                                </Tooltip>
                              </div>
                            </div>
                            <div className="flex justify-between ">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <label className=" text-sm min-w-[70px]">Sửa cuối</label>
                                <Tooltip color="blue">
                                  <input
                                    disabled
                                    value={dataThongTinSua?.NguoiSuaCuoi}
                                    type="text"
                                    className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                                  />
                                </Tooltip>
                              </div>
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <label className=" text-sm">Lúc</label>
                                <Tooltip color="blue">
                                  <input
                                    disabled
                                    type="text"
                                    value={
                                      dataThongTinSua?.NgaySuaCuoi && dayjs(dataThongTinSua.NgaySuaCuoi).isValid()
                                        ? dayjs(dataThongTinSua.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss')
                                        : ''
                                    }
                                    className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* button */}
                  <div className="flex justify-between items-center pt-[10px] ">
                    <div className="flex gap-x-3   ">
                      <ActionButton
                        color={'slate-50'}
                        title={'In phiếu'}
                        background={'purple-500'}
                        bg_hover={'white'}
                        color_hover={'purple-500'}
                        handleAction={() => {
                          handlePrintInEdit(dataRecord)
                        }}
                        isModal={true}
                      />
                    </div>
                    <div className="flex gap-2">
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
        </div>
        {isShowModalOnlyPrint && (
          <ModalOnlyPrint
            typePage={typePage}
            namePage={namePage}
            close={() => setIsShowModalOnlyPrint(false)}
            dataThongTin={actionType === 'edit' ? formEdit : actionType === 'view' ? dataRecord : formCreateTT}
            data={data}
            actionType={actionType}
            close2={() => close()}
            SctCreate={SctCreate}
          />
        )}
      </div>
    </>
  )
}

export default ModalPCT
