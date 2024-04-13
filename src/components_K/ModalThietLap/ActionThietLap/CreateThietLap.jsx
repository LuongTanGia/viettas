/* eslint-disable react/prop-types */
import { Checkbox, InputNumber, Select, Spin } from 'antd'
import dayjs from 'dayjs'
import logo from '../../../assets/VTS-iSale.ico'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import { useState } from 'react'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'

const { Option } = Select

const CreateThietLap = ({ typePage, namePage, dataThongSo, dataHangHoa, dataNhomGia, dataDoiTuong, setHightLight, isLoadingModal, loading, close }) => {
  const [errors, setErrors] = useState({
    MaHang: '',
    DonGia: '',
    MaDoiTuong: '',
    NhomGia: '',
  })
  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')
  const defaultFormCreate = {
    MaHang: null,
    HieuLucTu: ngayHieuLuc,
    DonGia: 0,
    CoThue: false,
    TyLeThue: 0,
  }

  const defaultFormCreateGKH = {
    MaDoiTuong: null,
    HieuLucTu: ngayHieuLuc,
    NhomGia: null,
    GhiChu: '',
  }

  const [formCreate, setFormCreate] = useState(typePage === 'GBL' ? defaultFormCreate : defaultFormCreateGKH)

  // useEffect(() => {
  //   if (typePage === 'GKH') {
  //     if (dataDoiTuong && dataNhomGia) {
  //       setFormCreate({ ...formCreate, MaDoiTuong: dataDoiTuong[0]?.Ma, NhomGia: dataNhomGia[0]?.Ma })
  //     }
  //   }
  // }, [dataDoiTuong, dataNhomGia, dataRecord])

  const handleCreateAndClose = async () => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.ThemGBL(tokenLogin, formCreate)
          break
        case 'GKH':
          response = await apis.ThemGKH(tokenLogin, formCreate)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(`${typePage === 'GKH' ? `${formCreate.MaDoiTuong}/${formCreate.HieuLucTu}T00:00:00` : `${formCreate.MaHang}/${formCreate.HieuLucTu}T00:00:00`}`)
          loading()
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
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.ThemGBL(tokenLogin, formCreate)
          break
        case 'GKH':
          response = await apis.ThemGKH(tokenLogin, formCreate)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(`${typePage === 'GKH' ? `${formCreate.MaDoiTuong}/${formCreate.HieuLucTu}T00:00:00` : `${formCreate.MaHang}/${formCreate.HieuLucTu}T00:00:00`}`)
          loading()
          setFormCreate(typePage === 'GKH' ? defaultFormCreateGKH : defaultFormCreate)
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

  const handleValidation = () => {
    let errors = {}

    if (typePage === 'GBL') {
      if (formCreate?.DonGia === null || formCreate?.DonGia === 0 || !formCreate?.MaHang?.trim()) {
        errors.MaHang = formCreate?.MaHang?.trim() ? '' : 'Mã hàng không được để trống'
        errors.DonGia = formCreate?.DonGia === null ? null : formCreate?.DonGia === 0 && 0

        return errors
      }
    }
    if (typePage === 'GKH') {
      if (!formCreate?.MaDoiTuong?.trim() || !formCreate?.NhomGia?.trim()) {
        errors.MaDoiTuong = formCreate?.MaDoiTuong?.trim() ? '' : 'Mã khách hàng không được để trống'
        errors.NhomGia = formCreate?.NhomGia?.trim() ? '' : 'Mã nhóm giá không được để trống'

        return errors
      }
    }

    return errors
  }

  return (
    <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className={`w-[700px] ${typePage === 'GBL' ? 'h-[260px]' : 'h-[300px]'}`}>
        <div className="flex gap-2">
          <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
          <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage}</label>
        </div>
        <Spin spinning={isLoadingModal}>
          <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
            <div className="flex flex-col px-2 ">
              <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                <div className="flex flex-col gap-2">
                  {typePage === 'GBL' && (
                    <>
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                        <Select
                          className="w-full truncate"
                          status={errors.MaHang ? 'error' : ''}
                          placeholder={errors.MaHang}
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          onChange={(value) => {
                            setFormCreate({
                              ...formCreate,
                              MaHang: value,
                            }),
                              setErrors({ ...errors, MaHang: '' })
                          }}
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
                            className="DatePicker_PMH  max-w-[115px]"
                            format="DD/MM/YYYY"
                            defaultValue={dayjs()}
                            onChange={(newDate) => {
                              setFormCreate({
                                ...formCreate,
                                HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                              }),
                                setErrors({ ...errors, DonGia: e })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={formCreate?.CoThue}>
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
                            formatter={(value) => `${value}`}
                            parser={(value) => {
                              const parsedValue = parseFloat(value)
                              return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLETYLE))
                            }}
                            onChange={(e) => {
                              const tyLeThue = e

                              setFormCreate({
                                ...formCreate,
                                TyLeThue: tyLeThue,
                                CoThue: tyLeThue > 0,
                              })
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {typePage === 'GKH' && (
                    <>
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                        <Select
                          className="w-full truncate"
                          showSearch
                          status={errors.MaDoiTuong ? 'error' : ''}
                          placeholder={errors.MaDoiTuong}
                          size="small"
                          optionFilterProp="children"
                          onChange={(value) => {
                            setFormCreate({
                              ...formCreate,
                              MaDoiTuong: value,
                            })
                            setErrors({ ...errors, MaDoiTuong: '' })
                          }}
                          value={formCreate.MaDoiTuong}
                        >
                          {dataDoiTuong?.map((item) => (
                            <Option key={item.Ma} value={item.Ma}>
                              {item.Ma}- {item.Ten}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className="required  min-w-[90px] text-sm flex justify-end">Hiệu lực từ</label>
                        <DateField
                          className="DatePicker_PMH  max-w-[115px]"
                          format="DD/MM/YYYY"
                          value={dayjs(formCreate.HieuLucTu)}
                          onChange={(newDate) => {
                            setFormCreate({
                              ...formCreate,
                              HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                        <Select
                          className="w-full truncate"
                          status={errors.NhomGia ? 'error' : ''}
                          placeholder={errors.NhomGia}
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          onChange={(value) => {
                            setFormCreate({
                              ...formCreate,
                              NhomGia: value,
                            })
                            setErrors({ ...errors, NhomGia: '' })
                          }}
                          value={formCreate.NhomGia}
                        >
                          {dataNhomGia?.map((item) => (
                            <Option key={item.Ma} value={item.Ma}>
                              {item.Ma}- {item.Ten}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                        <input
                          type="text"
                          className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 hover:border-hover-border-color outline-none "
                          value={formCreate.GhiChu}
                          onChange={(e) =>
                            setFormCreate({
                              ...formCreate,
                              GhiChu: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* thong tin */}
                  <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex justify-between ">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <label className=" text-sm min-w-[64px] ">Người tạo</label>
                        <input disabled type="text" className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate" />
                      </div>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
                      </div>
                    </div>
                    <div className="flex justify-between text-end">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <label className=" text-sm min-w-[64px]">Sửa cuối</label>

                        <input disabled type="text" className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate" />
                      </div>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
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
  )
}

export default CreateThietLap
