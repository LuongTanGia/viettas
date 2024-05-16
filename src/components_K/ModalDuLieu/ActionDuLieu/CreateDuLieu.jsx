/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import * as apis from '../../../apis'
import dayjs from 'dayjs'
import icons from '../../../untils/icons'
import { RETOKEN } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers/DateField'
import logo from '../../../assets/VTS-iSale.ico'
import { Tooltip, Spin, Checkbox, Select, FloatButton } from 'antd'
import { toast } from 'react-toastify'
import ActionButton from '../../../components/util/Button/ActionButton'
import ModalHH from '../../ModalHH'
import ModalOnlyPrintWareHouse from '../../ModalOnlyPrintWareHouse'
import ModalOnlyPrint from '../../ModalOnlyPrint'
import TableEdit from '../../../components/util/Table/EditTable'
import { nameColumsPhieuMuaHang } from '../../../components/util/Table/ColumnName'

const { Option } = Select

const { IoMdAddCircle } = icons

const CreateDuLieu = ({ actionType, typePage, namePage, data, dataThongSo, dataDoiTuong, dataKhoHang, controlDate, isLoadingModal, loading, setHightLight, close }) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false)
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [isShowModalOnlyPrintWareHouse, setIsShowModalOnlyPrintWareHouse] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dataHangHoa, setDataHangHoa] = useState([])
  const [selectedKhoHang, setSelectedKhoHang] = useState()
  const [SctCreate, setSctCreate] = useState(null)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [selectedDoiTuong, setSelectedDoiTuong] = useState()
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [errors, setErrors] = useState({
    DoiTuong: null,
    Ten: '',
    DiaChi: '',
  })

  const ngayChungTu = dayjs().format('YYYY-MM-DD')

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
  const [formCreateTT, setFormCreateTT] = useState({})

  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng'), [selectedRowData])

  const handleKeyDown = (event) => {
    if (event.key === 'F9') {
      setIsShowModalHH(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // set default Value
  useEffect(() => {
    if ((typePage === 'PMH' || typePage === 'XTR') && dataDoiTuong) {
      const ncvlDoiTuong = dataDoiTuong.find((item) => item.Ma === 'NCVL')
      const defaultMa = ncvlDoiTuong?.Ma || dataDoiTuong[0]?.Ma || ''
      handleDoiTuongFocus(defaultMa)
    }
    if (dataDoiTuong && typePage === 'NTR') {
      const ncvlDoiTuong = dataDoiTuong.find((item) => item.Ma === 'KHVL')
      const defaultMa = ncvlDoiTuong?.Ma || dataDoiTuong[0]?.Ma || ''
      handleDoiTuongFocus(defaultMa)
    }
  }, [dataDoiTuong])

  useEffect(() => {
    if (dataKhoHang) {
      setSelectedKhoHang(dataKhoHang[0].MaKho)
      setIsLoading(true)
    }
  }, [dataKhoHang])

  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong', 'DonGia', 'TienHang', 'TyLeThue', 'TienThue', 'ThanhTien']

  useEffect(() => {
    if (selectedKhoHang) {
      handleAddInList()
    }
  }, [selectedKhoHang])

  const handleAddInList = async () => {
    try {
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
  }

  const handleDoiTuongFocus = (selectedValue) => {
    setSelectedDoiTuong(selectedValue)
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })

    setFormCreate({
      ...formCreate,
      TenDoiTuong: selectedDoiTuongInfo?.Ten,
      DiaChi: selectedDoiTuongInfo?.DiaChi,
    })
    setErrors({ Ten: '', DiaChi: '' })
  }

  const handleCreateAndClose = async () => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
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
          response = await apis.ThemPMH(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await apis.ThemNTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await apis.ThemXTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
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
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
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
          response = await apis.ThemPMH(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await apis.ThemNTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await apis.ThemXTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
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

  const handlePrintInCreate = async (typePrint) => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
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
          response = await apis.ThemPMH(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await apis.ThemNTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await apis.ThemXTR(tokenLogin, { ...formCreate, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          const soChungTu = DataResults[0].SoChungTu
          loading()
          setHightLight(soChungTu)
          setSctCreate(soChungTu)
          setFormCreate(defaultFormCreate)
          setSelectedDoiTuong(null)
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
          setSelectedKhoHang(dataKhoHang[0].MaKho)
          setSelectedRowData([])
          if (typePrint === 'print') {
            setIsShowModalOnlyPrint(true)
          } else if (typePrint === 'print2') {
            setIsShowModalOnlyPrintWareHouse(true)
          }
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

  const handleTienMat = () => {
    setFormCreate((prevFormPMH) => {
      return {
        ...prevFormPMH,
        TTTienMat: !prevFormPMH.TTTienMat,
      }
    })
  }

  const handleEditData = (data) => {
    setSelectedRowData(data)
  }

  const handleChangLoading = (newLoading) => {
    setIsLoading(newLoading)
  }

  const handleValidation = () => {
    let errors = {}

    if (!selectedDoiTuong?.trim() || formCreate?.NgayCTu === 'Invalid Date') {
      errors.DoiTuong = selectedDoiTuong?.trim() ? null : 'Đối tượng không được để trống'
      errors.NgayCTu = 'Ngày không được để trống'
      return errors
    }

    if (selectedDoiTuong === 'NCVL' || selectedDoiTuong === 'KHVL') {
      if (!formCreate?.TenDoiTuong?.trim() || !formCreate?.DiaChi?.trim()) {
        errors.Ten = formCreate?.TenDoiTuong?.trim() ? '' : 'Tên đối tượng không được để trống'
        errors.DiaChi = formCreate?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống'
        return errors
      }
    }

    if (selectedRowData.length <= 0) {
      errors.Table = 'Chi tiết phiếu không được để trống'
      toast.warning('Chi tiết phiếu không được để trống!')
      return errors
    }

    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) {
      errors.MaHang = 'Mã hàng không được để trống !'
      toast.warning('Mã hàng không được để trống !')
      return errors
    }

    return errors
  }

  return (
    <>
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px] ">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage ? namePage : 'Phiếu ?'}</label>
          </div>

          <Spin spinning={isLoadingModal}>
            <div className="border-1 border-gray-400 w-full h-[89%] rounded-sm text-sm">
              <div className="flex  md:gap-0 lg:gap-1 pl-1 ">
                {/* thong tin phieu */}
                <div className="w-[62%]">
                  <div className="flex p-1  ">
                    <div className="flex items-center ">
                      <label className="min-w-[78px] max-w-[78px] pr-1">Số C.từ</label>
                      <input readOnly type="text" className="md:w-[50px] lg:w-full border border-gray-300 outline-none bg-[#fafafa] rounded-[4px] h-[24px]" />
                    </div>
                    {/* DatePicker */}
                    <div className="flex md:px-1 lg:px-4 items-center text-center">
                      <label className="pr-1 lg:pr-[30px] lg:pl-[8px]">Ngày</label>
                      <DateField
                        className="max-w-[132px] min-w-[132px]"
                        format="DD/MM/YYYY"
                        value={dayjs(formCreate?.NgayCTu)}
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
                          '& .MuiInputBase-input': {
                            // fontSize: '15px',
                            display: 'flex',
                            alignItems: 'end',
                            textAlign: 'center',
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
                    <label form="doituong" className="min-w-[78px]  max-w-[78px]">
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
                    <label className="min-w-[78px]  max-w-[78px]">Tên</label>
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
                    <label className="min-w-[78px]  max-w-[78px] ">Địa chỉ</label>
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
                  <label form="khohang" className="min-w-[78px] max-w-[78px]">
                    Kho hàng
                  </label>
                  <Select
                    className="w-[160px]"
                    showSearch
                    size="small"
                    optionFilterProp="children"
                    onChange={(value) => setSelectedKhoHang(value)}
                    value={selectedKhoHang}
                    popupMatchSelectWidth={false}
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
                  title={isAdd ? 'Vui lòng chọn hàng hóa hoặc F9 để chọn từ danh sách' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách.'}
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
                handleAction={() => handlePrintInCreate('print')}
                isModal={true}
              />
              {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                <ActionButton
                  color={'slate-50'}
                  title={'In phiếu kho'}
                  background={'purple-500'}
                  bg_hover={'white'}
                  color_hover={'purple-500'}
                  handleAction={() => handlePrintInCreate('print2')}
                  isModal={true}
                />
              )}
            </div>

            <div className="flex justify-end items-center gap-3  pt-3">
              <ActionButton color={'slate-50'} title={'Lưu'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
              <ActionButton
                color={'slate-50'}
                title={'Lưu & đóng'}
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
          dataThongTin={formCreateTT}
          data={data}
          actionType={actionType}
          close2={close}
          SctCreate={SctCreate}
        />
      )}
      {isShowModalOnlyPrintWareHouse && (
        <ModalOnlyPrintWareHouse
          typePage={typePage}
          namePage={namePage}
          close={() => setIsShowModalOnlyPrintWareHouse(false)}
          dataThongTin={formCreateTT}
          data={data}
          actionType={actionType}
          close2={close}
          SctCreate={SctCreate}
        />
      )}
    </>
  )
}

export default CreateDuLieu
