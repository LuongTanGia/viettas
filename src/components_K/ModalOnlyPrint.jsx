/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { base64ToPDF } from '../action/Actions'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'
import ActionButton from '../components/util/Button/ActionButton'
import { Select } from 'antd'
import { RETOKEN } from '../action/Actions'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { Checkbox } from 'antd'
const { Option } = Select
// const { MdFilterAlt } = icons

const ModalOnlyPrint = ({ close, dataThongTin, data, actionType, close2, SctCreate, typePage, namePage }) => {
  const [selectedSctBD, setSelectedSctBD] = useState('')
  const [selectedSctKT, setSelectedSctKT] = useState('')
  const [newData, setNewData] = useState()
  const startDate = dayjs(dataThongTin?.NgayCTu).format('YYYY-MM-DD')
  const endDate = dayjs(dataThongTin?.NgayCTu).format('YYYY-MM-DD')

  const [formPrint, setFormPrint] = useState()

  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  })

  useEffect(() => {
    setFormPrint({ NgayBatDau: startDate, NgayKetThuc: endDate })
  }, [actionType, dataThongTin])

  useEffect(() => {
    const handleFilterPrint = () => {
      const ngayBD = dayjs(formPrint?.NgayBatDau)
      const ngayKT = dayjs(formPrint?.NgayKetThuc)
      const filteredData = data.filter((item) => {
        const itemDate = dayjs(item.NgayCTu)

        if (ngayBD.isValid() && ngayKT.isValid()) {
          return itemDate >= ngayBD && itemDate <= ngayKT
        }
      })
      setNewData(filteredData)
    }
    handleFilterPrint()
  }, [formPrint, data])

  useEffect(() => {
    if (actionType !== 'create' && newData) {
      const foundItem = newData.find((item) => item.SoChungTu === dataThongTin.SoChungTu)
      if (newData.length <= 0) {
        setSelectedSctBD('Chọn số chứng từ')
        setSelectedSctKT('Chọn số chứng từ')
      } else if (foundItem) {
        setSelectedSctBD(foundItem.SoChungTu)
        setSelectedSctKT(foundItem.SoChungTu)
      } else {
        setSelectedSctBD(newData[0].SoChungTu)
        setSelectedSctKT(newData[0].SoChungTu)
      }
    } else {
      setSelectedSctBD(SctCreate)
      setSelectedSctKT(SctCreate)
    }
  }, [newData])

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2
    if (checkboxValues.checkbox3) total += 4
    return total
  }

  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formPrint.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      setFormPrint({
        ...formPrint,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
    } else {
      setFormPrint({
        ...formPrint,
        NgayBatDau: startDate,
      })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formPrint.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DD')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      setFormPrint({
        ...formPrint,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
    } else {
      setFormPrint({
        ...formPrint,
        NgayKetThuc: endDate,
      })
    }
  }

  const handleOnlyPrint = async () => {
    if (selectedSctBD === 'Chọn số chứng từ' || selectedSctKT === 'Chọn số chứng từ') {
      toast.warning('Vui lòng chọn số chứng từ !')
      return
    }
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      let response
      switch (typePage) {
        case 'PMH':
          response = await apis.InPMH(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        case 'NTR':
          response = await apis.InNTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        case 'PCT':
          response = await apis.InPCT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        case 'PTT':
          response = await apis.InPTT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        case 'XTR':
          response = await apis.InXTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        case 'PBL':
          response = await apis.InPBL(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          base64ToPDF(DataResults)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleOnlyPrint()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleSctBDChange = (value) => {
    setSelectedSctBD(value)

    if (selectedSctKT && value > selectedSctKT) {
      setSelectedSctKT(value)
    }
  }

  const handleSctKTChange = (value) => {
    setSelectedSctKT(value)

    if (selectedSctBD && value < selectedSctBD) {
      setSelectedSctBD(value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" h-[244px]  ">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">In - {namePage}</label>
          </div>
          <div className="border-2 my-1">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 ">
                {/* DatePicker */}
                <div className="flex gap-x-2 items-center justify-end">
                  <label htmlFor="" className="required">
                    Ngày
                  </label>
                  <DateField
                    className="DatePicker_PMH max-w-[170px]"
                    format="DD/MM/YYYY"
                    value={dayjs(formPrint?.NgayBatDau)}
                    onChange={(newDate) => {
                      setFormPrint({
                        ...formPrint,
                        NgayBatDau: dayjs(newDate).format('YYYY-MM-DD'),
                      })
                    }}
                    onBlur={() => {
                      handleStartDateChange(formPrint?.NgayBatDau)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleStartDateChange(formPrint?.NgayBatDau)
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
                <div className="flex gap-x-2 items-center">
                  <label htmlFor="" className="required">
                    Đến
                  </label>
                  <DateField
                    className="DatePicker_PMH max-w-[170px]"
                    format="DD/MM/YYYY"
                    value={dayjs(formPrint?.NgayKetThuc)}
                    onChange={(newDate) => {
                      setFormPrint({
                        ...formPrint,
                        NgayKetThuc: dayjs(newDate).format('YYYY-MM-DD'),
                      })
                    }}
                    onBlur={() => {
                      handleEndDateChange(formPrint?.NgayKetThuc)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEndDateChange(formPrint?.NgayKetThuc)
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

                <div className="flex gap-x-2 items-center justify-end">
                  <label className=" required">Số chứng từ</label>

                  <Select size="small" showSearch optionFilterProp="children" style={{ width: '170px' }} value={selectedSctBD} onChange={handleSctBDChange}>
                    {newData?.map((item) => (
                      <Option key={item.SoChungTu} value={item.SoChungTu}>
                        {item.SoChungTu}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="flex gap-x-2 items-center ">
                  <label className=" required">Đến</label>

                  <Select size="small" showSearch optionFilterProp="children" style={{ width: '170px' }} value={selectedSctKT} onChange={handleSctKTChange}>
                    {newData?.map((item) => (
                      <Option key={item.SoChungTu} value={item.SoChungTu}>
                        {item.SoChungTu}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* liên */}
              <div className="flex justify-center items-center gap-6 mt-4">
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
              </div>
            </div>
          </div>
          {actionType === 'edit' ? (
            <div className="flex justify-end pt-2 gap-2">
              <ActionButton
                color={'slate-50'}
                title={'Xác nhận'}
                isModal={true}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                handleAction={() => {
                  handleOnlyPrint(), close2()
                }}
              />

              <ActionButton
                color={'slate-50'}
                title={'Đóng'}
                isModal={true}
                background={'red-500'}
                bg_hover={'white'}
                color_hover={'red-500'}
                handleAction={() => {
                  close(), close2()
                }}
              />
            </div>
          ) : (
            <div className="flex justify-end pt-2 gap-2">
              <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleOnlyPrint} />
              <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalOnlyPrint
