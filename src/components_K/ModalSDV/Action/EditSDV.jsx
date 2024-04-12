/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import * as apis from '../../../apis'
import dayjs from 'dayjs'
import ActionButton from '../../../components/util/Button/ActionButton'
import logo from '../../../assets/VTS-iSale.ico'
import { InputNumber, Select, Tooltip } from 'antd'
import { DateField } from '@mui/x-date-pickers'
import { toast } from 'react-toastify'
import { RETOKEN } from '../../../action/Actions'
const { Option } = Select

const EditSDV = ({ namePage, dataRecord, dataThongTinSua, dataDoiTuong, dataThongSo, typePage, close, loading, setHightLight }) => {
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: '', DiaChi: '' })
  const [errors, setErrors] = useState({
    DoiTuong: null,
    GhiChu: '',
    SoTien: '',
  })

  const [formEdit, setFormEdit] = useState({ ...dataThongTinSua })

  //  set value default

  useEffect(() => {
    if (dataDoiTuong) {
      handleDoiTuongFocus(dataThongTinSua.MaDoiTuong)
    }
  }, [dataDoiTuong, dataThongTinSua])

  const handleDoiTuongFocus = (selectedValue) => {
    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find((item) => item.Ma === selectedValue)
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: '', DiaChi: '' })
    setFormEdit({
      ...formEdit,
      MaDoiTuong: selectedValue,
    })
    setErrors({ ...errors, DoiTuong: null })
  }

  const handleEdit = async (dataRecord) => {
    const errors = handleValidation()

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
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

  const handleValidation = () => {
    let errors = {}

    if (!formEdit?.MaDoiTuong?.trim() || !formEdit?.GhiChu?.trim() || formEdit?.SoTien === null || formEdit?.SoTien === 0) {
      errors.DoiTuong = formEdit?.MaDoiTuong?.trim() ? null : 'Đối tượng không được để trống'
      errors.GhiChu = formEdit?.GhiChu?.trim() ? '' : 'Ghi chú không được để trống'
      errors.SoTien = formEdit?.SoTien === null ? null : formEdit?.SoTien === 0 && 0
      return errors
    }
    return errors
  }

  return (
    <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
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
                      className="DatePicker_PMH max-w-[115px]"
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
                  <input className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none" type="text" value={doiTuongInfo.Ten} disabled />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className=" min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                  <input className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none" type="text" value={doiTuongInfo.DiaChi} disabled />
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
                      <label className=" text-sm min-w-[64px] ">Người tạo</label>
                      <Tooltip color="blue" title={dataThongTinSua?.NguoiTao}>
                        <input
                          disabled
                          type="text"
                          value={dataThongTinSua?.NguoiTao}
                          className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                        />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
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
                  <div className="flex justify-between text-end ">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label className=" text-sm min-w-[64px]">Sửa cuối</label>
                      <Tooltip color="blue">
                        <input
                          disabled
                          value={dataThongTinSua?.NguoiSuaCuoi}
                          type="text"
                          className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                        />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label className=" text-sm">Lúc</label>
                      <Tooltip color="blue">
                        <input
                          disabled
                          type="text"
                          value={
                            dataThongTinSua?.NgaySuaCuoi && dayjs(dataThongTinSua.NgaySuaCuoi).isValid() ? dayjs(dataThongTinSua.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''
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
  )
}

export default EditSDV
