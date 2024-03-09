/* eslint-disable react/prop-types */
// import React from 'react'
// import ActionButton from '../components/util/Button/ActionButton'
// import { Checkbox, Tooltip } from 'antd'
import { InputNumber, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { RETOKEN, formatPrice } from '../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import { Spin } from 'antd'
import ModalOnlyPrint from './ModalOnlyPrint'
import SimpleBackdrop from '../components/util/Loading/LoadingPage'
const { Option } = Select

const ModalSDV = ({
  data,
  actionType,
  typePage,
  namePage,
  close,
  dataRecord,
  dataThongSo,
  dataDoiTuong,
  loading,
  setHightLight,
  dataThongTinSua,
  isLoadingModal,
  isLoadingEdit,
}) => {
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)

  const [SctCreate, setSctCreate] = useState(null)
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [errors, setErrors] = useState({
    DoiTuong: null,
    GhiChu: '',
    SoTien: '',
  })

  const ngayChungTu = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  const defaultFormCreate = {
    NgayCTu: ngayChungTu,
    MaDoiTuong: null,
    SoTien: 0,
    GhiChu: '',
  }

  const [formCreate, setFormCreate] = useState(defaultFormCreate)
  const [formEdit, setFormEdit] = useState({ ...dataThongTinSua })

  //  set value default

  useEffect(() => {
    if (dataDoiTuong && actionType === 'edit') {
      handleDoiTuongFocus(dataThongTinSua.MaDoiTuong)
    }
  }, [dataDoiTuong, dataThongTinSua])

  const handleDoiTuongFocus = (selectedValue) => {
    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })
    if (actionType === 'create') {
      setFormCreate({
        ...formCreate,
        MaDoiTuong: selectedValue,
      })
      setErrors({ ...errors, DoiTuong: null })
    }
    if (actionType === 'edit') {
      setFormEdit({
        ...formEdit,
        MaDoiTuong: selectedValue,
      })
      setErrors({ ...errors, DoiTuong: null })
    }
  }

  const handleCreateAndClose = async () => {
    if (!formCreate?.MaDoiTuong?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
      setErrors({
        ...errors,
        DoiTuong: formCreate?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
        GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'SDV':
          response = await apis.ThemSDV(tokenLogin, formCreate)
          break
        case 'SDR':
          response = await apis.ThemSDR(tokenLogin, formCreate)
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
    if (!formCreate?.MaDoiTuong?.trim() || !formCreate?.GhiChu?.trim() || formCreate?.SoTien === null || formCreate?.SoTien === 0) {
      setErrors({
        ...errors,
        DoiTuong: formCreate?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
        GhiChu: formCreate?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formCreate?.SoTien === null ? null : formCreate?.SoTien === 0 && 0,
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'SDV':
          response = await apis.ThemSDV(tokenLogin, formCreate)
          break
        case 'SDR':
          response = await apis.ThemSDR(tokenLogin, formCreate)
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
          setDoiTuongInfo({ Ten: '', DiaChi: '' })
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

  const handleEdit = async (dataRecord) => {
    if (!formEdit?.MaDoiTuong?.trim() || !formEdit?.GhiChu?.trim() || formEdit?.SoTien === null || formEdit?.SoTien === 0) {
      setErrors({
        ...errors,
        DoiTuong: formEdit?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống',
        GhiChu: formEdit?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống',
        SoTien: formEdit?.SoTien === null ? null : formEdit?.SoTien === 0 && 0,
      })
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'SDV':
          response = await apis.SuaSDV(tokenLogin, dataRecord.SoChungTu, formEdit)
          break
        case 'SDR':
          response = await apis.SuaSDR(tokenLogin, dataRecord.SoChungTu, formEdit)
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

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'SDV':
          response = await apis.XoaSDV(tokenLogin, dataRecord.SoChungTu)
          break
        case 'SDR':
          response = await apis.XoaSDR(tokenLogin, dataRecord.SoChungTu)
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
                          <label className="required  min-w-[90px] text-sm flex justify-end">Số chứng từ</label>
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
                            className="DatePicker_PMH  max-w-[110px]"
                            format="DD/MM/YYYY"
                            value={dayjs(dataRecord?.NgayCTu)}
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

                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className="required min-w-[90px] text-sm flex justify-end">{typePage === 'SDV' ? 'Nhà C.Cấp' : 'Khách hàng'}</label>
                        <input
                          type="text"
                          value={`${dataRecord?.MaDoiTuong} - ${dataRecord?.TenDoiTuong}`}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className=" min-w-[90px] text-sm flex justify-end">Tên</label>
                        <input
                          type="text"
                          value={dataRecord?.TenDoiTuong}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap  ">
                        <label className=" min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
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
            <div className="w-[700px] h-[370px]">
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
                            <label className="required  min-w-[90px]  flex justify-end">Số chứng từ</label>
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

                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className="required min-w-[90px] text-sm flex justify-end">{typePage === 'SDV' ? 'Nhà C.Cấp' : 'Khách hàng'} </label>
                          <Select
                            showSearch
                            status={errors.DoiTuong ? 'error' : ''}
                            placeholder={errors.DoiTuong}
                            size="small"
                            optionFilterProp="children"
                            onChange={(value) => handleDoiTuongFocus(value)}
                            style={{ width: '100%' }}
                            value={formCreate.MaDoiTuong}
                          >
                            {dataDoiTuong?.map((item) => (
                              <Option key={item.Ma} value={item.Ma}>
                                {item.Ma} - {item.Ten}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className=" min-w-[90px] text-sm flex justify-end">Tên</label>
                          <input
                            type="text"
                            value={doiTuongInfo.Ten}
                            className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                            disabled
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap  ">
                          <label className=" min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                          <input
                            type="text"
                            value={doiTuongInfo.DiaChi}
                            className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                            disabled
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
                            className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none 
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
              <div className="flex justify-end items-center pt-[10px] ">
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
                              <label className="required  min-w-[90px]  flex justify-end">Số chứng từ</label>
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

                          <div className="flex items-center gap-1 whitespace-nowrap  ">
                            <label className="required min-w-[90px] text-sm flex justify-end">{typePage === 'SDV' ? 'Nhà C.Cấp' : 'Khách hàng'}</label>
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
                            <label className=" min-w-[90px] text-sm flex justify-end">Tên</label>
                            <input
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none"
                              type="text"
                              value={doiTuongInfo.Ten}
                              disabled
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap  ">
                            <label className=" min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                            <input
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none"
                              type="text"
                              value={doiTuongInfo.DiaChi}
                              disabled
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
                              className={`h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none 
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
                  <div className="flex justify-end items-center pt-[10px] ">
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
            dataThongTin={dataRecord}
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

export default ModalSDV
