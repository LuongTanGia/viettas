/* eslint-disable react/prop-types */
import { useState } from 'react'
import dayjs from 'dayjs'
import logo from '../../../assets/VTS-iSale.ico'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import { Checkbox, InputNumber, Select, Spin, Tooltip } from 'antd'

const { Option } = Select

const EditThietLap = ({ typePage, namePage, dataRecord, dataThongSo, dataNhomGia, setHightLight, isLoadingModal, loading, close }) => {
  const [errors, setErrors] = useState({
    MaHang: '',
    DonGia: '',
  })

  const defaultFormEdit = {
    Ma: dataRecord?.MaHang,
    HieuLuc: dayjs(dataRecord?.HieuLucTu).format('YYYY-MM-DD'),
    Data: {
      DonGia: dataRecord?.DonGia,
      CoThue: dataRecord?.CoThue,
      TyLeThue: dataRecord?.TyLeThue,
    },
  }

  const defaultFormEditGKH = {
    Ma: dataRecord?.MaDoiTuong,
    HieuLuc: dayjs(dataRecord?.HieuLucTu).format('YYYY-MM-DD'),
    Data: {
      NhomGia: dataRecord?.NhomGia,
      GhiChu: dataRecord?.GhiChu,
    },
  }
  const [formEdit, setFormEdit] = useState(typePage === 'GBL' ? defaultFormEdit : defaultFormEditGKH)

  const handleEdit = async () => {
    if (typePage === 'GBL') {
      if (formEdit?.DonGia === null || formEdit?.DonGia === 0) {
        setErrors({
          ...errors,
          DonGia: formEdit?.DonGia === null ? null : formEdit?.DonGia === 0 && 0,
        })
        return
      }
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.SuaGBL(tokenLogin, formEdit)
          break
        case 'GKH':
          response = await apis.SuaGKH(tokenLogin, formEdit)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(`${formEdit.Ma}/${formEdit.HieuLuc}`)
          loading()
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

  return (
    <div className={`w-[700px] ${typePage === 'GBL' ? 'h-[260px]' : 'h-[300px]'}`}>
      <div className="flex gap-2">
        <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
        <label className="text-blue-700 font-semibold uppercase pb-1">Sửa - {namePage}</label>
      </div>
      {/* <Spin spinning={`${typePage === 'GKH' ? isLoadingModal : false}`}> */}
      <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
        <div className="flex flex-col px-2 ">
          <div className=" py-2 px-2 gap-2  grid grid-cols-1">
            <div className="flex flex-col gap-2">
              {typePage === 'GBL' && (
                <>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                    <Select
                      disabled
                      className="w-full truncate "
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      value={`${dataRecord?.MaHang}-${dataRecord?.TenHang} (${dataRecord?.DVT}) `}
                    ></Select>
                  </div>
                  <div className="grid grid-cols-2  gap-2 items-center">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                      <DateField
                        className="DatePicker_PMH max-w-[115px]"
                        format="DD/MM/YYYY"
                        value={dayjs(formEdit?.HieuLuc)}
                        sx={{
                          '& .MuiButtonBase-root': {
                            padding: '4px',
                          },
                          '& .MuiSvgIcon-root': {
                            width: '18px',
                            height: '18px',
                          },
                        }}
                        readOnly
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
                      <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={formEdit?.Data.CoThue}>
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
                        formatter={(value) => `${value}`}
                        parser={(value) => {
                          const parsedValue = parseFloat(value)
                          return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLETYLE))
                        }}
                        onChange={(e) => {
                          const tyLeThue = e
                          setFormEdit({
                            ...formEdit,
                            Data: {
                              ...formEdit.Data,
                              TyLeThue: tyLeThue,
                              CoThue: tyLeThue > 0,
                            },
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
                    <Select className="w-full truncate" showSearch size="small" optionFilterProp="children" value={formEdit.Ma} disabled></Select>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className="required  min-w-[90px] text-sm flex justify-end">Hiệu lực từ</label>
                    <DateField
                      className="DatePicker_PMH  max-w-[115px] bg-[#fafafa] "
                      format="DD/MM/YYYY"
                      value={dayjs(formEdit?.HieuLuc)}
                      sx={{
                        '& .MuiButtonBase-root': {
                          padding: '4px',
                        },
                        '& .MuiSvgIcon-root': {
                          width: '18px',
                          height: '18px',
                        },
                      }}
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                    <Select
                      className="w-full truncate"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      onChange={(value) =>
                        setFormEdit({
                          ...formEdit,
                          Data: {
                            ...formEdit.Data,
                            NhomGia: value,
                          },
                        })
                      }
                      value={formEdit.Data.NhomGia}
                    >
                      {dataNhomGia?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <input
                      type="text"
                      className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 hover:border-hover-border-color outline-none "
                      value={formEdit.Data.GhiChu}
                      onChange={(e) =>
                        setFormEdit({
                          ...formEdit,
                          Data: {
                            ...formEdit.Data,
                            GhiChu: e.target.value,
                          },
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
      {/* </Spin> */}

      {/* button */}
      <div className="flex justify-end items-center pt-[10px] ">
        <div className="flex gap-2">
          <ActionButton color={'slate-50'} title={'Lưu & đóng'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleEdit} />
          <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
        </div>
      </div>
    </div>
  )
}

export default EditThietLap
