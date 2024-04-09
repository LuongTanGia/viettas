/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import logo from '../assets/VTS-iSale.ico'
import { InputNumber, Select } from 'antd'
import { toast } from 'react-toastify'
import * as apis from '../apis'
import { RETOKEN } from '../action/Actions'
import ActionButton from '../components/util/Button/ActionButton'
const { Option } = Select
// const { BsSearch } = icons
const ModalDieuChinh = ({ close, namePage, dataThongSo, typePage, dataRecord, setHightLight }) => {
  const [formAdjustPrice, setFormAdjustPrice] = useState({
    GiaTriTinh: 'OLDVALUE',
    ToanTu: '+',
    LoaiGiaTri: 'TYLE',
    GiaTri: 0,
    NhomGia: dataRecord?.NhomGia,
  })
  // default value
  useEffect(() => {
    if (formAdjustPrice?.GiaTriTinh === 'OLDVALUE') {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '+' })
    } else {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: null })
    }
  }, [formAdjustPrice.GiaTriTinh])

  ///////////////////////////////////
  const handleAdjustPrice = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBS':
          response = await apis.DieuChinhGBS(tokenLogin, formAdjustPrice)
          break
        // case 'NTR':
        //   response = await apis.SuaNTR(tokenLogin)
        //   break

        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          // loading()
          setHightLight(formAdjustPrice.NhomGia)
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleAdjustPrice()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className=" m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
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
            <ActionButton color={'slate-50'} title={'Xử lý'} bg_hover={'white'} background={'bg-main'} color_hover={'bg-main'} handleAction={handleAdjustPrice} isModal={true} />
            <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} isModal={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDieuChinh
