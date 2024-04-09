/* eslint-disable react/prop-types */
import { useState } from 'react'
import * as apis from '../../../apis'
import logo from '../../../assets/VTS-iSale.ico'
import ActionButton from '../../../components/util/Button/ActionButton'
import { Select } from 'antd'
import { RETOKEN, base64ToPDF } from '../../../action/Actions'
import { toast } from 'react-toastify'
const { Option } = Select

const PrintGBS = ({ namePage, data, close }) => {
  const [formPrint, setFormPrint] = useState({
    CodeValue1From: data[0].NhomGia,
    CodeValue1To: data[0].NhomGia,
  })

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.InGBS(tokenLogin, formPrint)
      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          base64ToPDF(DataResults)
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handlePrint()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleFromChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1From: value })

    if (data?.findIndex((item) => item.NhomGia === value) > data?.findIndex((item) => item.NhomGia === formPrint.CodeValue1To)) {
      setFormPrint({ CodeValue1From: value, CodeValue1To: value })
    }
  }
  const handleToChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1To: value })

    if (data?.findIndex((item) => item.NhomGia === value) < data?.findIndex((item) => item.NhomGia === formPrint.CodeValue1From)) {
      setFormPrint({ CodeValue1From: value, CodeValue1To: value })
    }
  }
  return (
    <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className="h-[140px]">
        <div className="flex gap-2">
          <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
          <label className="text-blue-700 font-semibold uppercase pb-1">In - {namePage} </label>
        </div>

        <div className="border-2 my-1 ">
          <div className="p-4 flex flex-col gap-3 ">
            <div className="flex  ">
              <div className="flex gap-2 ">
                <label className="required w-[70px] text-end">Bảng giá</label>
                <Select size="small" showSearch optionFilterProp="children" className="w-[200px]" value={formPrint.CodeValue1From} onChange={handleFromChange}>
                  {data?.map((item) => (
                    <Option key={item.NhomGia} value={item.NhomGia}>
                      {item.NhomGia}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <label className="required w-[50px]  text-end">Đến</label>
                <Select size="small" showSearch optionFilterProp="children" className="w-[200px]" value={formPrint.CodeValue1To} onChange={handleToChange}>
                  {data?.map((item) => (
                    <Option key={item.NhomGia} value={item.NhomGia}>
                      {item.NhomGia}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 gap-2">
          <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />

          <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
        </div>
      </div>
    </div>
  )
}

export default PrintGBS
