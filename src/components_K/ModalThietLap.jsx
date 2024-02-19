/* eslint-disable react/prop-types */

// import ActionButton from '../components/util/Button/ActionButton'
// import { Checkbox, Tooltip } from 'antd'
import { Checkbox, InputNumber, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { RETOKEN, formatPrice } from '../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'

const { Option } = Select

const ModalTL = ({ actionType, typePage, namePage, close, dataRecord, dataThongSo, dataHangHoa, loading }) => {
  const [errors, setErrors] = useState({
    DonGia: '',
  })
  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')
  const defaultFormCreate = {
    MaHang: '',
    HieuLucTu: ngayHieuLuc,
    DonGia: 0,
    CoThue: false,
    TyLeThue: 0,
  }

  const [formCreate, setFormCreate] = useState(defaultFormCreate)
  const [formEdit, setFormEdit] = useState({
    Ma: dataRecord?.MaHang,
    HieuLuc: dataRecord?.HieuLucTu,
    Data: {
      MaHang: dataRecord?.MaHang,
      HieuLucTu: dataRecord?.HieuLucTu,
      DonGia: dataRecord?.DonGia,
      CoThue: dataRecord?.CoThue,
      TyLeThue: dataRecord?.TyLeThue,
    },
  })

  //  set value default

  useEffect(() => {
    if (dataHangHoa && actionType === 'create') {
      setFormCreate({ ...formCreate, MaHang: dataHangHoa[0]?.MaHang })
    }
    if (dataHangHoa && actionType === 'edit') {
      setFormEdit({ ...formEdit, MaHang: dataRecord.MaHang })
    }
  }, [dataHangHoa, dataRecord])

  const handleCreateAndClose = async () => {
    if (formCreate?.DonGia === null || formCreate?.DonGia === 0) {
      setErrors({
        ...errors,
        DonGia: formCreate?.DonGia === null ? null : formCreate?.DonGia === 0 && 0,
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      if (typePage === 'GBL') {
        const response = await apis.ThemGBL(tokenLogin, formCreate)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
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
    if (formCreate?.DonGia === null || formCreate?.DonGia === 0) {
      setErrors({
        ...errors,
        DonGia: formCreate?.DonGia === null ? null : formCreate?.DonGia === 0 && 0,
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      if (typePage === 'GBL') {
        const response = await apis.ThemGBL(tokenLogin, formCreate)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
          setFormCreate(defaultFormCreate)
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
  const handleEdit = async () => {
    if (formEdit?.DonGia === null || formEdit?.DonGia === 0) {
      setErrors({
        ...errors,
        DonGia: formEdit?.DonGia === null ? null : formEdit?.DonGia === 0 && 0,
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      if (typePage === 'GBL') {
        const response = await apis.SuaGBL(tokenLogin, formEdit)
        if (response.data && response.data.DataError === 0) {
          toast.success(response.data.DataErrorDescription)
          loading()
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

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      if (typePage === 'GBL') {
        const response = await apis.XoaGBL(tokenLogin, dataRecord.MaHang, dataRecord.HieuLucTu)
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

  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'delete' && (
            <div className=" items-center ">
              <label>
                Bạn có chắc muốn xóa mã hàng
                <span className="font-bold mx-1"> {dataRecord.MaHang}</span>
                không ?
              </label>
              <div className="flex justify-end mt-4 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleDelete(dataRecord)}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}

          {actionType === 'view' && (
            <div className="w-[700px] h-[260px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
              </div>
              <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                        <input
                          type="text"
                          value={`${dataRecord?.MaHang}-${dataRecord?.TenHang} (${dataRecord?.DVT}) `}
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-2  gap-2 items-center">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                          <DateField
                            className="DatePicker_PMH  max-w-[110px]"
                            format="DD/MM/YYYY"
                            value={dayjs(dataRecord?.HieuLucTu)}
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
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Giá bán lẻ</label>
                          <input
                            type="text"
                            value={formatPrice(dataRecord?.DonGia, dataThongSo.SOLEDONGIA) || ''}
                            className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate text-end"
                            disabled
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={dataRecord?.CoThue}>
                            Đã có thuế
                          </Checkbox>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="  min-w-[90px] text-sm flex justify-end">% Thuế</label>
                          <input
                            type="text"
                            value={formatPrice(dataRecord?.TyLeThue, dataThongSo.SOLETYLE) || ''}
                            className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate  text-end"
                            disabled
                          />
                        </div>
                      </div>

                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
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
            <div className="w-[700px] h-[260px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage}</label>
              </div>
              <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                        <Select
                          className="w-full truncate"
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          onChange={(value) =>
                            setFormCreate({
                              ...formCreate,
                              MaHang: value,
                            })
                          }
                          value={formCreate.MaHang}
                        >
                          {dataHangHoa?.map((item) => (
                            <Option key={item.MaHang} value={item.MaHang}>
                              {item.MaHang}- {item.TenHang} ({item.DVT})
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="grid grid-cols-2  gap-2 items-center">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                          <DateField
                            className="DatePicker_PMH  max-w-[110px]"
                            format="DD/MM/YYYY"
                            defaultValue={dayjs()}
                            onChange={(newDate) => {
                              setFormCreate({
                                ...formCreate,
                                HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
                              })
                            }}
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
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Giá bán lẻ</label>
                          <InputNumber
                            className={`w-[100%]   
                                       ${errors.DonGia === 0 || errors.DonGia === null ? 'border-red-500' : ''} `}
                            placeholder={errors.DonGia}
                            size="small"
                            min={0}
                            max={999999999999}
                            value={formCreate.DonGia}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => {
                              const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                              return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLEDONGIA))
                            }}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                DonGia: e,
                              })
                              setErrors({ ...errors, DonGia: e })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={dataRecord?.CoThue}>
                            Đã có thuế
                          </Checkbox>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="  min-w-[90px] text-sm flex justify-end">% Thuế</label>
                          <InputNumber
                            className="w-[100%]"
                            size="small"
                            min={0}
                            max={100}
                            value={formCreate.TyLeThue}
                            onChange={(e) =>
                              setFormCreate({
                                ...formCreate,
                                TyLeThue: e,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px] ">Người tạo</label>
                            <input
                              disabled
                              type="text"
                              className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px]">Sửa cuối</label>

                            <input
                              disabled
                              type="text"
                              className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
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
                  <ActionButton color={'slate-50'} title={'Lưu'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
                  <ActionButton color={'slate-50'} title={'Lưu & đóng'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreateAndClose} />
                  <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
                </div>
              </div>
            </div>
          )}
          {actionType === 'edit' && (
            <div className="w-[700px] h-[260px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Sửa - {namePage}</label>
              </div>
              <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                        <Select
                          className="w-full truncate"
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          value={`${dataRecord?.MaHang}-${dataRecord?.TenHang} (${dataRecord?.DVT}) `}
                          disabled
                        ></Select>
                      </div>
                      <div className="grid grid-cols-2  gap-2 items-center">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                          <DateField
                            className="DatePicker_PMH  max-w-[110px]"
                            format="DD/MM/YYYY"
                            value={dayjs(formEdit.Data.HieuLucTu)}
                            onChange={(newDate) => {
                              setFormCreate({
                                ...formEdit,
                                Data: {
                                  ...formEdit.Data,
                                  HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
                                },
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
                          <label className="required  min-w-[90px] text-sm flex justify-end">Giá bán lẻ</label>
                          <InputNumber
                            className={`w-[100%]   
                                       ${errors.DonGia === 0 || errors.DonGia === null ? 'border-red-500' : ''} `}
                            placeholder={errors.DonGia}
                            size="small"
                            min={0}
                            max={999999999999}
                            value={formEdit.Data.DonGia}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => {
                              const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                              return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLEDONGIA))
                            }}
                            onChange={(e) => {
                              setFormEdit({
                                ...formEdit,
                                Data: {
                                  ...formEdit.Data,
                                  DonGia: e,
                                },
                              })
                              setErrors({ ...errors, DonGia: e })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={dataRecord?.CoThue}>
                            Đã có thuế
                          </Checkbox>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className="  min-w-[90px] text-sm flex justify-end">% Thuế</label>
                          <InputNumber
                            className="w-[100%]"
                            size="small"
                            min={0}
                            max={100}
                            value={formEdit.Data.TyLeThue}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                Data: {
                                  ...formEdit.Data,
                                  TyLeThue: e,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
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
              <div className="flex justify-end items-center pt-[10px] ">
                <div className="flex gap-2">
                  <ActionButton color={'slate-50'} title={'Lưu & đóng'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleEdit} />
                  <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ModalTL
