/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import logo from '../assets/VTS-iSale.ico'
import icons from '../untils/icons'
import { InputNumber, Select } from 'antd'
import { DateField } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
const { Option } = Select
// const { BsSearch } = icons
const ModalDieuChinh = ({ close, data, namePage, dataThongSo }) => {
  const [formAdjustPrice, setFormAdjustPrice] = useState({
    GiaTriTinh: 'OLDVALUE',
    ToanTu: '',
    LoaiGiaTri: 'TYLE',
    GiaTri: 0,
    NhomGia: null,
  })

  useEffect(() => {
    if (formAdjustPrice?.GiaTriTinh === 'OLDVALUE') {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '+' })
    } else {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '=' })
    }
  }, [formAdjustPrice.GiaTriTinh])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="w-[700px] h-[160px]">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">Điều chỉnh giá - {namePage}</label>
          </div>
          <div className="border w-full h-[60%] rounded-[4px]-sm text-sm">
            <div className="flex flex-col gap-3 ">
              <div className="flex  gap-2 items-center my-[40px]">
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
          {/* button */}
          <div className="flex justify-end items-center pt-[14px]  gap-x-2">
            <button
              // onClick={handleAdjustPrice}
              className="flex items-center  py-1 px-2  rounded-md  border-2 border-blue-500 text-slate-50 text-text-main font-bold  bg-blue-500 hover:bg-white hover:text-blue-500"
            >
              <div className="pr-1">{/* <TiPrinter size={20} /> */}</div>
              <div>Xử lý</div>
            </button>

            <button
              onClick={() => close()}
              className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDieuChinh
