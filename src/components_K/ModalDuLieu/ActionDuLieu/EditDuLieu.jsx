/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import * as apis from '../../../apis'
import dayjs from 'dayjs'
import icons from '../../../untils/icons'
import { RETOKEN } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers/DateField'
import logo from '../../../assets/VTS-iSale.ico'
import { Tooltip, Select, FloatButton, Spin } from 'antd'
import { toast } from 'react-toastify'
import ActionButton from '../../../components/util/Button/ActionButton'
import ModalHH from '../../ModalHH'
import ModalOnlyPrintWareHouse from '../../ModalOnlyPrintWareHouse'
import ModalOnlyPrint from '../../ModalOnlyPrint'
import TableEdit from '../../../components/util/Table/EditTable'
import { nameColumsPhieuMuaHang } from '../../../components/util/Table/ColumnName'
// import SimpleBackdrop from '../../../components/util/Loading/LoadingPage'
import moment from 'moment'

const { Option } = Select

const { IoMdAddCircle } = icons

const EditDuLieu = ({ actionType, typePage, namePage, data, dataRecord, dataThongTinSua, dataThongSo, dataDoiTuong, dataKhoHang, controlDate, loading, setHightLight, close }) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false)
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [isShowModalOnlyPrintWareHouse, setIsShowModalOnlyPrintWareHouse] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState([])
  const [selectedKhoHang, setSelectedKhoHang] = useState()
  const [selectedRowData, setSelectedRowData] = useState([])
  const [selectedDoiTuong, setSelectedDoiTuong] = useState()
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [typePrint, setTypePrint] = useState('print')

  const [errors, setErrors] = useState({
    DoiTuong: null,
    Ten: '',
    DiaChi: '',
  })

  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng'), [selectedRowData])

  //    show modal HH = F9
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

  const [formEdit, setFormEdit] = useState({ ...dataThongTinSua, NgayCTu: dayjs(dataThongTinSua.NgayCTu).format('YYYY-MM-DD') })

  // get dsHH
  useEffect(() => {
    if (selectedKhoHang) {
      handleAddInList()
    }
  }, [selectedKhoHang])

  useEffect(() => {
    if (dataThongTinSua) setFormEdit({ ...dataThongTinSua, NgayCTu: dayjs(dataThongTinSua.NgayCTu).format('YYYY-MM-DD') })
  }, [dataThongTinSua])

  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong', 'DonGia', 'TienHang', 'TyLeThue', 'TienThue', 'ThanhTien']

  useEffect(() => {
    if (dataDoiTuong && dataThongTinSua) {
      handleDoiTuongFocus(dataThongTinSua.MaDoiTuong)

      if (dataThongTinSua?.DataDetails) {
        setSelectedRowData([...dataThongTinSua.DataDetails])
      }
    }
  }, [dataDoiTuong, dataThongTinSua])

  useEffect(() => {
    if (dataKhoHang && dataThongTinSua) {
      setSelectedKhoHang(dataThongTinSua.MaKho)
      setIsLoading(true)
    }
  }, [dataKhoHang, dataThongTinSua])

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
    // setFormEdit((prev) => ({ ...prev, DataDetails: emptyRow }))
  }

  const handleDoiTuongFocus = (selectedValue) => {
    setSelectedDoiTuong(selectedValue)
    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })

    if (selectedValue !== 'NCVL') {
      setFormEdit({
        ...formEdit,
        TenDoiTuong: selectedDoiTuongInfo?.Ten,
        DiaChi: selectedDoiTuongInfo?.DiaChi,
      })
    } else if (selectedValue === 'NCVL') {
      setFormEdit({
        ...formEdit,
      })
      setErrors({ Ten: '', DiaChi: '' })
    }

    if (typePage === 'NTR') {
      if (selectedValue !== 'KHVL') {
        setFormEdit({
          ...formEdit,
          TenDoiTuong: selectedDoiTuongInfo?.Ten,
          DiaChi: selectedDoiTuongInfo?.DiaChi,
        })
      } else if (selectedValue === 'KHVL') {
        setFormEdit({
          ...formEdit,
        })
        setErrors({ Ten: '', DiaChi: '' })
      }
    }
  }

  const handleEdit = async (dataRecord) => {
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
          response = await apis.SuaPMH(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'NTR':
          response = await apis.SuaNTR(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
          break
        case 'XTR':
          response = await apis.SuaXTR(tokenLogin, dataRecord.SoChungTu, { ...formEdit, DataDetails: dataAddSTT }, selectedDoiTuong, selectedKhoHang)
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
  const handlePrintInEdit = async (dataRecord) => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
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
          if (typePrint === 'print') setIsShowModalOnlyPrint(true)
          else if (typePrint === 'printwarehouse') {
            setIsShowModalOnlyPrintWareHouse(true)
          }
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

  const handleEditData = (data) => {
    setSelectedRowData(data)
  }

  const handleChangLoading = (newLoading) => {
    setIsLoading(newLoading)
  }

  const handleValidation = () => {
    let errors = {}
    // let form
    // if (actionType === 'create') {
    //   form = formCreate
    // } else if (actionType === 'edit') {
    //   form = formEdit
    // }

    if (!selectedDoiTuong?.trim()) {
      errors.DoiTuong = selectedDoiTuong?.trim() ? null : 'Đối tượng không được để trống'
      return errors
    }

    if (selectedDoiTuong === 'NCVL' || selectedDoiTuong === 'KHVL') {
      if (!formEdit?.TenDoiTuong?.trim() || !formEdit?.DiaChi?.trim()) {
        errors.Ten = formEdit?.TenDoiTuong?.trim() ? '' : 'Tên đối tượng không được để trống'
        errors.DiaChi = formEdit?.DiaChi?.trim() ? '' : 'Địa chỉ không được để trống'
        return errors
      }
    }

    if (selectedRowData.length <= 0) {
      errors.Table = 'Chi tiết phiếu không được để trống'
      toast.warning('Chi tiết phiếu không được để trống!')
      return errors
    }

    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) {
      errors.MaHang = 'Mã hàng không được để trống, vui lòng chọn mã hàng!'
      toast.warning('Mã hàng không được để trống, vui lòng chọn mã hàng!')
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
            <label className="text-blue-700 font-semibold uppercase pb-1">sửa - {namePage}</label>
          </div>

          <div className=" border w-full h-[89%] rounded-sm text-sm">
            <div className="flex  md:gap-0 lg:gap-1 pl-1 ">
              {/* thong tin phieu */}
              <div className="w-[62%] ">
                <div className="flex p-1  ">
                  <div className=" flex items-center">
                    <label className="min-w-[78px]  max-w-[78px] pr-1">Số C.từ</label>
                    <input readOnly type="text" className="w-[160px] border border-gray-300 outline-none  px-2   bg-[#fafafa] rounded-[4px] h-[24px]" value={formEdit?.SoChungTu} />
                  </div>

                  {/* DatePicker */}
                  <div className="flex md:px-1 lg:px-4 items-center">
                    <label className="pr-1 lg:pr-[30px] lg:pl-[8px]">Ngày</label>
                    <DateField
                      className="DatePicker_PMH  max-w-[115px]"
                      format="DD/MM/YYYY"
                      value={dayjs(formEdit?.NgayCTu)}
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
                </div>
                <div className="p-1 flex ">
                  <label form="doituong" className="min-w-[78px]  max-w-[78px]">
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
                  <label className="min-w-[78px]  max-w-[78px]">Địa chỉ</label>
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
                      <Tooltip title={formEdit?.NguoiTao} color="blue">
                        <input disabled value={formEdit?.NguoiTao} type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" />
                      </Tooltip>
                    </div>

                    <div className="flex items-center p-1">
                      <label className="w-[30px] pr-1">Lúc</label>
                      <Tooltip title={formEdit?.NgayTao && moment(formEdit.NgayTao).isValid() ? moment(formEdit.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''} color="blue">
                        <input
                          disabled
                          value={formEdit?.NgayTao && moment(formEdit.NgayTao).isValid() ? moment(formEdit.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                          type="text"
                          className=" w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center p-1  ">
                      <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                      <Tooltip title={formEdit?.NguoiSuaCuoi} color="blue">
                        <input disabled value={formEdit?.NguoiSuaCuoi} type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center p-1 ">
                      <label className="w-[30px] pr-1">Lúc</label>
                      <Tooltip
                        title={formEdit?.NgaySuaCuoi && moment(formEdit.NgaySuaCuoi).isValid() ? moment(formEdit.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                        color="blue"
                      >
                        <input
                          disabled
                          value={formEdit?.NgaySuaCuoi && moment(formEdit.NgaySuaCuoi).isValid() ? moment(formEdit.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                          type="text"
                          className=" w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* kho hang and ghi chu */}
            <div className="flex gap-3   items-center  w-full">
              <div className="px-2 py-2 flex  items-center ">
                <label form="khohang" className="min-w-[78px]  max-w-[78px]">
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
              <div className="flex items-center  w-full">
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
                  handlePrintInEdit(dataRecord), setTypePrint('print')
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
                    handlePrintInEdit(dataRecord), setTypePrint('printwarehouses')
                  }}
                  isModal={true}
                />
              )}
            </div>
            <div className="flex justify-end items-center gap-x-3  pt-3">
              <ActionButton
                color={'slate-50'}
                title={'Lưu & đóng'}
                isModal={true}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                handleAction={() => handleEdit(dataRecord)}
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
          dataThongTin={formEdit}
          data={data}
          actionType={actionType}
          close2={close}
        />
      )}
      {isShowModalOnlyPrintWareHouse && (
        <ModalOnlyPrintWareHouse
          typePage={typePage}
          namePage={namePage}
          close={() => setIsShowModalOnlyPrintWareHouse(false)}
          dataThongTin={formEdit}
          data={data}
          controlDate={controlDate}
          actionType={actionType}
          close2={close}
        />
      )}
    </>
  )
}

export default EditDuLieu
