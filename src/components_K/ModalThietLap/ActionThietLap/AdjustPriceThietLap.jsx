/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import logo from '../../../assets/VTS-iSale.ico'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import { InputNumber, Select } from 'antd'

const { Option } = Select

const AdjustPriceThietLap = ({ namePage, dataMaHang, dataThongSo, loading, close }) => {
  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')

  const [formAdjustPrice, setFormAdjustPrice] = useState({
    GiaTriTinh: 'OLDVALUE',
    ToanTu: '',
    LoaiGiaTri: 'TYLE',
    GiaTri: 0,
    HieuLucTu: ngayHieuLuc,
    DanhSachMa: dataMaHang,
  })

  //  set value default
  useEffect(() => {
    if (formAdjustPrice?.GiaTriTinh === 'OLDVALUE') {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '+' })
    } else {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: null })
    }
  }, [formAdjustPrice.GiaTriTinh])

  const handleAdjustPrice = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DieuChinhGBL(tokenLogin, formAdjustPrice)
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          // const soChungTu = response.data.DataResults.map((obj) => `${obj.Ma}/${obj.HieuLuc}`)
          // setHightLight(soChungTu)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleAdjustPrice()
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
    <div className="w-[700px] h-[160px]">
      <div className="flex gap-2">
        <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
        <label className="text-blue-700 font-semibold uppercase pb-1">Điều chỉnh giá - {namePage}</label>
      </div>
      <div className="border w-full h-[60%] rounded-[4px]-sm text-sm">
        <div className="flex flex-col px-2 ">
          <div className=" py-3 px-2 gap-2  grid grid-cols-1">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1">
                <label className="required  min-w-[70px] text-sm flex justify-end">Hiệu lực từ</label>
                <DateField
                  className="DatePicker_PMH  max-w-[115px]"
                  format="DD/MM/YYYY"
                  value={dayjs(formAdjustPrice?.HieuLucTu)}
                  onChange={(newDate) => {
                    setFormAdjustPrice({
                      ...formAdjustPrice,
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
              <div className="flex  gap-2 items-center">
                <div className="flex items-center gap-1">
                  <label className=" whitespace-nowrap  min-w-[74px] text-sm flex justify-end">Trị giá tính</label>
                  <Select
                    className="w-[140px] truncate"
                    showSearch
                    size="small"
                    optionFilterProp="children"
                    onChange={(value) =>
                      setFormAdjustPrice({
                        ...formAdjustPrice,
                        GiaTriTinh: value,
                      })
                    }
                    value={formAdjustPrice.GiaTriTinh}
                  >
                    <Option value="OLDVALUE">Từ giá trị cũ</Option>
                    <Option value="NEWVALUE">Thay giá trị mới</Option>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <label className=" whitespace-nowrap   text-sm flex justify-end">Toán tử</label>
                  {formAdjustPrice.GiaTriTinh === 'OLDVALUE' ? (
                    <Select
                      className="w-[50px] truncate"
                      showSearch
                      size="small"
                      onChange={(value) =>
                        setFormAdjustPrice({
                          ...formAdjustPrice,
                          ToanTu: value,
                        })
                      }
                      value={formAdjustPrice.ToanTu}
                    >
                      <Option value="+">+</Option>
                      <Option value="-">-</Option>
                      <Option value="*">*</Option>
                      <Option value="/">/</Option>
                    </Select>
                  ) : (
                    <Select
                      className="w-[50px] truncate"
                      showSearch
                      size="small"
                      onChange={(value) =>
                        setFormAdjustPrice({
                          ...formAdjustPrice,
                          ToanTu: value,
                        })
                      }
                      value={formAdjustPrice.ToanTu}
                    >
                      <Option value={null}>=</Option>
                    </Select>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <label className=" whitespace-nowrap   text-sm flex justify-end">Loại</label>
                  <Select
                    className="w-[100px] truncate"
                    showSearch
                    size="small"
                    optionFilterProp="children"
                    onChange={(value) =>
                      setFormAdjustPrice({
                        ...formAdjustPrice,
                        LoaiGiaTri: value,
                      })
                    }
                    value={formAdjustPrice.LoaiGiaTri}
                  >
                    <Option value="TYLE">Tỷ lệ %</Option>
                    <Option value="HANGSO">Hằng số</Option>
                  </Select>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className=" text-sm flex justify-end">Giá trị</label>
                  {formAdjustPrice.LoaiGiaTri === 'TYLE' ? (
                    <InputNumber
                      className="w-[100%]"
                      size="small"
                      min={0}
                      max={100}
                      value={formAdjustPrice.GiaTri}
                      formatter={(value) => `${value}`}
                      parser={(value) => {
                        const parsedValue = parseFloat(value)
                        return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLETYLE))
                      }}
                      onChange={(e) =>
                        setFormAdjustPrice({
                          ...formAdjustPrice,
                          GiaTri: e,
                        })
                      }
                    />
                  ) : (
                    <InputNumber
                      className="w-[100%]"
                      size="small"
                      min={0}
                      max={999999999999}
                      value={formAdjustPrice.GiaTri}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => {
                        const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                        return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLEDONGIA))
                      }}
                      onChange={(e) =>
                        setFormAdjustPrice({
                          ...formAdjustPrice,
                          GiaTri: e,
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* button */}
      <div className="flex justify-end items-center pt-[14px]  gap-x-2">
        <ActionButton color={'slate-50'} title={'Xử lý'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleAdjustPrice} />
        <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
      </div>
    </div>
  )
}

export default AdjustPriceThietLap
