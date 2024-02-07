/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'

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
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [newDataPMH, setNewDataPMH] = useState()
  const startDate = dayjs(dataThongTin?.NgayCTu).format('YYYY-MM-DDTHH:mm:ss')
  const endDate = dayjs(dataThongTin?.NgayCTu).format('YYYY-MM-DDTHH:mm:ss')

  const dataByDate = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.NgayCTu)
      const ngaybt = new Date(startDate)
      const ngaykt = new Date(endDate)

      return itemDate >= ngaybt && itemDate <= ngaykt
    })
  }, [data, startDate, endDate])

  useEffect(() => {
    setNewDataPMH(dataByDate)
  }, [dataByDate])

  const [formPrint, setFormPrint] = useState({ NgayBatDau: startDate, NgayKetThuc: endDate })
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
    if (actionType === 'edit') {
      setFormPrint({ NgayBatDau: startDate, NgayKetThuc: endDate })
    }
    if (actionType === 'create') {
      setFormPrint({ NgayBatDau: dayjs(), NgayKetThuc: dayjs() })
    }
  }, [dataThongTin, actionType])

  useEffect(() => {
    const handleFilterPrint = () => {
      const ngayBD = dayjs(formPrintFilter.NgayBatDau)
      const ngayKT = dayjs(formPrintFilter.NgayKetThuc)
      // console.log('formPrint22222222', formPrint)

      // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
      const filteredData = data.filter((item) => {
        const itemDate = dayjs(item.NgayCTu)

        if (ngayBD.isValid() && ngayKT.isValid()) {
          return itemDate >= ngayBD && itemDate <= ngayKT
        }
      })
      setNewDataPMH(filteredData)
    }

    handleFilterPrint()
  }, [formPrintFilter])

  useEffect(() => {
    if (dataThongTin && actionType !== 'create') {
      setSelectedSctBD(dataThongTin.SoChungTu)
      setSelectedSctKT(dataThongTin.SoChungTu)
    }
    if (actionType == 'create') {
      setSelectedSctBD(SctCreate)
      setSelectedSctKT(SctCreate)
    }
  }, [dataThongTin, SctCreate])

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
    const endDate = dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss')

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

  const handleOnlyPrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      if (typePage === 'PMH') {
        const response = await apis.InPMH(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrint()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.InNTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrint()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'PCT') {
        const response = await apis.InPCT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrint()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'PTT') {
        const response = await apis.InPTT(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrint()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'XTR') {
        const response = await apis.InXTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrint()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
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
              <div className="flex justify-center items-center  gap-3 pl-[52px] ">
                {/* DatePicker */}
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="">Ngày</label>
                  <DateField
                    className="DatePicker_PMH max-w-[154px]"
                    format="DD/MM/YYYY"
                    // maxDate={actionType !== 'create' && dayjs(formPrint.NgayKetThuc)}
                    value={actionType === 'create' ? dayjs() : dayjs(formPrint.NgayBatDau)}
                    onChange={(newDate) => {
                      setFormPrint({
                        ...formPrint,
                        NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
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
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="">Đến</label>
                  <DateField
                    className="DatePicker_PMH max-w-[154px]"
                    format="DD/MM/YYYY"
                    // minDate={actionType !== 'create' && dayjs(formPrint.NgayBatDau)}
                    value={actionType === 'create' ? dayjs() : dayjs(formPrint.NgayKetThuc)}
                    onChange={(newDate) => {
                      setFormPrint({
                        ...formPrint,
                        NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
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

                {/* <ActionButton
                  color={'slate-50'}
                  title={'Lọc'}
                  icon={<MdFilterAlt size={20} />}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={handleFilterPrint}
                /> */}
              </div>
              <div className="flex  mt-4 ">
                <div className="flex ">
                  <label className="pr-[23px]">Số chứng từ</label>

                  <Select size="small" showSearch optionFilterProp="children" onChange={(value) => setSelectedSctBD(value)} style={{ width: '154px' }} value={selectedSctBD}>
                    {newDataPMH?.map((item) => (
                      <Option key={item.SoChungTu} value={item.SoChungTu}>
                        {item.SoChungTu}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="flex ">
                  <label className="pl-[18px] pr-[18px]">Đến</label>

                  <Select size="small" showSearch optionFilterProp="children" onChange={(value) => setSelectedSctKT(value)} style={{ width: '154px' }} value={selectedSctKT}>
                    {newDataPMH?.map((item) => (
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
              <ActionButton color={'slate-50'} title={'Xác nhận'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleOnlyPrint} />
              <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalOnlyPrint
