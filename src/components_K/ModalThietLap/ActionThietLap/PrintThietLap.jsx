/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import logo from '../../../assets/VTS-iSale.ico'
import * as apis from '../../../apis'
import { RETOKEN, base64ToPDF } from '../../../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import { Select, Tooltip } from 'antd'

const { Option } = Select
const PrintThietLap = ({ namePage, dataNhomGia, dataHangHoa, close }) => {
  const [value1List, setValue1List] = useState([])
  const [value2List, setValue2List] = useState([])

  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')
  const [formPrint, setFormPrint] = useState({
    CodeValue1From: null,
    CodeValue1To: null,
    CodeValue1List: null,
    CodeValue2From: null,
    CodeValue2To: null,
    CodeValue2List: null,
    NgayHieuLuc: ngayHieuLuc,
  })

  useEffect(() => {
    if (formPrint.CodeValue1From === undefined || formPrint.CodeValue1To === undefined) {
      setFormPrint({ ...formPrint, CodeValue1From: null, CodeValue1To: null })
    }
    if (formPrint.CodeValue2From === undefined || formPrint.CodeValue2To === undefined) {
      setFormPrint({ ...formPrint, CodeValue2From: null, CodeValue2To: null })
    }
  }, [formPrint])

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.InGBL(tokenLogin, { ...formPrint, CodeValue1List: value1List.join(','), CodeValue2List: value2List.join(',') })
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
    if (formPrint.CodeValue1To === null || value > formPrint.CodeValue1To) {
      setFormPrint({ ...formPrint, CodeValue1From: value, CodeValue1To: value })
    }
  }

  const handleToChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1To: value })
    if (formPrint.CodeValue1From === null || value < formPrint.CodeValue1From) {
      setFormPrint({ ...formPrint, CodeValue1From: value, CodeValue1To: value })
    }
  }

  const handle2FromChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue2From: value })
    if (formPrint.CodeValue2To === null || value > formPrint.CodeValue2To) {
      setFormPrint({ ...formPrint, CodeValue2From: value, CodeValue2To: value })
    }
  }

  const handle2ToChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue2To: value })
    if (formPrint.CodeValue2From === null || value < formPrint.CodeValue2From) {
      setFormPrint({ ...formPrint, CodeValue2From: value, CodeValue2To: value })
    }
  }

  return (
    <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className="h-[306px]">
        <div className="flex gap-2">
          <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
          <label className="text-blue-700 font-semibold uppercase pb-1">In - {namePage} </label>
        </div>

        <div className="border-1 border-gray-400 my-1 ">
          <div className="p-4 flex flex-col gap-3 ">
            {/* DatePicker */}
            <div className=" flex  items-center gap-2 ">
              <label htmlFor="" className="w-[90px] text-end">
                Ngày
              </label>
              <DateField
                className="DatePicker_PMH max-w-[154px]"
                format="DD/MM/YYYY"
                value={dayjs(formPrint.ngayHieuLuc)}
                onChange={(newDate) => {
                  setFormPrint({
                    ...formPrint,
                    ngayHieuLuc: dayjs(newDate).format('YYYY-MM-DD'),
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
            <div className="flex  ">
              <div className="flex gap-2 ">
                <label className="w-[90px] text-end">Nhóm</label>
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  size="small"
                  placeholder="Chọn nhóm"
                  value={formPrint.CodeValue1From}
                  onChange={handleFromChange}
                  style={{
                    width: '170px',
                    textOverflow: 'ellipsis',
                  }}
                  popupMatchSelectWidth={false}
                >
                  {dataNhomGia?.map((item) => (
                    <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                      {item.Ma} - {item.Ten}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <label className="w-[50px]  text-end">Đến</label>
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  size="small"
                  placeholder="Chọn nhóm"
                  value={formPrint.CodeValue1To}
                  onChange={handleToChange}
                  style={{
                    width: '170px',
                    textOverflow: 'ellipsis',
                  }}
                  popupMatchSelectWidth={false}
                >
                  {dataNhomGia?.map((item) => (
                    <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                      {item.Ma} - {item.Ten}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="">
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn nhóm"
                size="small"
                value={value1List}
                onChange={(value) => setValue1List(value)}
                className="w-full truncate"
                maxTagCount="responsive"
                optionFilterProp="children"
                maxTagPlaceholder={(omittedValues) => (
                  <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                    <span>+{omittedValues?.length}...</span>
                  </Tooltip>
                )}
              >
                {dataNhomGia?.map((item) => (
                  <Option key={item.Ma} value={item.Ma}>
                    <p>
                      {item.Ma} - {item.Ten}
                    </p>
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex  ">
              <div className="flex gap-2 ">
                <label className="w-[90px] text-end">Hàng hóa</label>
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  size="small"
                  placeholder="Chọn hàng hóa"
                  value={formPrint.CodeValue2From}
                  onChange={handle2FromChange}
                  style={{
                    width: '170px',
                    textOverflow: 'ellipsis',
                  }}
                  popupMatchSelectWidth={false}
                >
                  {dataHangHoa?.map((item) => (
                    <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                      {item.MaHang} - {item.TenHang}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <label className="w-[50px]  text-end">Đến</label>
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  size="small"
                  placeholder="Chọn hàng hóa"
                  value={formPrint.CodeValue2To}
                  onChange={handle2ToChange}
                  style={{
                    width: '170px',
                    textOverflow: 'ellipsis',
                  }}
                  popupMatchSelectWidth={false}
                >
                  {dataHangHoa?.map((item) => (
                    <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                      {item.MaHang} - {item.TenHang}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="">
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn nhóm"
                size="small"
                value={value2List}
                onChange={(value) => setValue2List(value)}
                className="w-full truncate"
                maxTagCount="responsive"
                optionFilterProp="children"
                maxTagPlaceholder={(omittedValues) => (
                  <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                    <span>+{omittedValues?.length}...</span>
                  </Tooltip>
                )}
              >
                {dataHangHoa?.map((item) => (
                  <Option key={item.MaHang} value={item.MaHang}>
                    <p>
                      {item.MaHang} - {item.TenHang}
                    </p>
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1 gap-2">
          <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />

          <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
        </div>
      </div>
    </div>
  )
}

export default PrintThietLap
