/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import logo from '../../../assets/VTS-iSale.ico'
import { DateField } from '@mui/x-date-pickers'
import ActionButton from '../../../components/util/Button/ActionButton'
import * as apis from '../../../apis'
import { RETOKEN, base64ToPDF } from '../../../action/Actions'
import { toast } from 'react-toastify'
import { Checkbox, Select } from 'antd'
const { Option } = Select

const PrintThuChi = ({ namePage, typePage, actionType, data, controlDate, close }) => {
  const [newData, setNewData] = useState(data)
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const startDate = dayjs(controlDate?.NgayBatDau).format('YYYY-MM-DD')
  const endDate = dayjs(controlDate?.NgayKetThuc).format('YYYY-MM-DD')
  const [formPrint, setFormPrint] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  })
  const [formPrintFilter, setFormPrintFilter] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  })
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  })

  useEffect(() => {
    setSelectedSctBD('Chọn số chứng từ')
    setSelectedSctKT('Chọn số chứng từ')
  }, [newData, actionType])

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2
    if (checkboxValues.checkbox3) total += 4
    return total
  }

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()

      let response
      switch (typePage) {
        case 'PCT':
          response = await apis.InPCT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        case 'PTT':
          response = await apis.InPTT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break

        default:
          break
      }
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

  useEffect(() => {
    const handleFilterPrint = () => {
      const ngayBD = dayjs(formPrintFilter.NgayBatDau)
      const ngayKT = dayjs(formPrintFilter.NgayKetThuc)

      // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
      const filteredData = data.filter((item) => {
        const itemDate = dayjs(item.NgayCTu)

        if (ngayBD.isValid() && ngayKT.isValid()) {
          return itemDate >= ngayBD && itemDate <= ngayKT
        }
      })
      setNewData(filteredData)
    }

    handleFilterPrint()
  }, [formPrintFilter?.NgayKetThuc, formPrintFilter?.NgayBatDau])

  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formPrint.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
      setFormPrint({
        ...formPrint,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayBatDau: startDate, NgayKetThuc: startDate })
    } else {
      setFormPrint({
        ...formPrint,
        NgayBatDau: startDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayBatDau: startDate })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formPrint.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DD')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, cập nhật ngày bắt đầu
      setFormPrint({
        ...formPrint,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayBatDau: endDate, NgayKetThuc: endDate })
    } else {
      setFormPrint({
        ...formPrint,
        NgayKetThuc: endDate,
      })
      setFormPrintFilter({ ...formPrintFilter, NgayKetThuc: endDate })
    }
  }

  const handleSctBDChange = (value) => {
    setSelectedSctBD(value)

    if (selectedSctKT !== 'Chọn số chứng từ' && value > selectedSctKT) {
      setSelectedSctKT(value)
    }
  }

  const handleSctKTChange = (value) => {
    setSelectedSctKT(value)

    if (selectedSctBD !== 'Chọn số chứng từ' && value < selectedSctBD) {
      setSelectedSctBD(value)
    }
  }

  return (
    <div className=" h-[244px]">
      <div className="flex gap-2">
        <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
        <label className="text-blue-700 font-semibold uppercase pb-1">In - ${namePage} </label>
      </div>

      <div className="border-2 my-1">
        <div className="p-4 ">
          <div className=" flex justify-center items-center  gap-3 pl-[52px]">
            {/* DatePicker */}
            <div className="flex gap-x-5 items-center">
              <label htmlFor="">Ngày</label>
              <DateField
                className="DatePicker_PMH max-w-[154px]"
                format="DD/MM/YYYY"
                // maxDate={dayjs(formPrint.NgayKetThuc)}
                value={dayjs(formPrint.NgayBatDau)}
                onChange={(newDate) => {
                  setFormPrint({
                    ...formPrint,
                    NgayBatDau: dayjs(newDate).format('YYYY-MM-DD'),
                  })
                }}
                onBlur={() => {
                  handleStartDateChange(formPrint.NgayBatDau)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleStartDateChange(formPrint.NgayBatDau)
                  }
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
            <div className="flex gap-x-5 items-center ">
              <label htmlFor="">Đến</label>
              <DateField
                className="DatePicker_PMH max-w-[154px]"
                format="DD/MM/YYYY"
                // minDate={dayjs(formPrint.NgayBatDau)}
                value={dayjs(formPrint.NgayKetThuc)}
                onChange={(newDate) => {
                  setFormPrint({
                    ...formPrint,
                    NgayKetThuc: dayjs(newDate).format('YYYY-MM-DD'),
                  })
                }}
                onBlur={() => {
                  handleEndDateChange(formPrint.NgayKetThuc)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEndDateChange(formPrint.NgayKetThuc)
                  }
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

          <div className="flex  mt-4 ">
            <div className="flex ">
              <label className="pr-[23px]">Số chứng từ</label>

              <Select size="small" showSearch optionFilterProp="children" style={{ width: '154px' }} value={selectedSctBD} onChange={handleSctBDChange}>
                {newData?.map((item) => (
                  <Option key={item.SoChungTu} value={item.SoChungTu}>
                    {item.SoChungTu}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex ">
              <label className="pl-[18px] pr-[18px]">Đến</label>

              <Select size="small" showSearch optionFilterProp="children" style={{ width: '154px' }} onChange={handleSctKTChange} value={selectedSctKT}>
                {newData?.map((item) => (
                  <Option key={item.SoChungTu} value={item.SoChungTu}>
                    {item.SoChungTu}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* liên */}
          <div className="flex justify-center  gap-6 mt-4">
            {/*  */}
            <div>
              <Checkbox
                value="checkbox1"
                checked={checkboxValues.checkbox1}
                onChange={(e) =>
                  setCheckboxValues((prevValues) => ({
                    ...prevValues,
                    [e.target.value]: !prevValues[e.target.value],
                  }))
                }
              >
                Liên 1
              </Checkbox>
            </div>
            <div>
              <Checkbox
                value="checkbox2"
                checked={checkboxValues.checkbox2}
                onChange={(e) =>
                  setCheckboxValues((prevValues) => ({
                    ...prevValues,
                    [e.target.value]: !prevValues[e.target.value],
                  }))
                }
              >
                Liên 2
              </Checkbox>
            </div>
            {actionType === 'print' && (
              <div>
                <Checkbox
                  value="checkbox3"
                  checked={checkboxValues.checkbox3}
                  onChange={(e) =>
                    setCheckboxValues((prevValues) => ({
                      ...prevValues,
                      [e.target.value]: !prevValues[e.target.value],
                    }))
                  }
                >
                  Liên 3
                </Checkbox>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 gap-2">
        <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />

        <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
      </div>
    </div>
  )
}

export default PrintThuChi
