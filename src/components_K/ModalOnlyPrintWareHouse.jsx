/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { base64ToPDF } from '../action/Actions'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'
import { RETOKEN } from '../action/Actions'
import ActionButton from '../components/util/Button/ActionButton'
import logo from '../assets/VTS-iSale.ico'
import { Select } from 'antd'
import { Checkbox } from 'antd'
const { Option } = Select
import * as apis from '../apis'

const ModalOnlyPrintWareHouse = ({ close, dataThongTin, data, actionType, close2, SctCreate, typePage, namePage }) => {
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [newData, setNewData] = useState()

  const startDate = dayjs(dataThongTin?.NgayCTu).format('YYYY-MM-DD')
  const endDate = dayjs(dataThongTin?.NgayCTu).format('YYYY-MM-DD')

  const dataByDate = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.NgayCTu)
      const ngaybt = new Date(startDate)
      const ngaykt = new Date(endDate)

      return itemDate >= ngaybt && itemDate <= ngaykt
    })
  }, [data, startDate, endDate])

  useEffect(() => {
    setNewData(dataByDate)
  }, [dataByDate])

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
    // if (dataThongTin && actionType !== 'create') {
    //   setSelectedSctBD(dataThongTin.SoChungTu)
    //   setSelectedSctKT(dataThongTin.SoChungTu)
    // }
    if (actionType == 'create') {
      setSelectedSctBD(SctCreate)
      setSelectedSctKT(SctCreate)
    }
  }, [dataThongTin, SctCreate])

  useEffect(() => {
    if (newData && actionType !== 'create') {
      setSelectedSctBD(dataThongTin.SoChungTu)
      setSelectedSctKT(dataThongTin.SoChungTu)
    }
    if (newData?.length <= 0 && actionType !== 'create') {
      setSelectedSctBD('Chọn mã hàng')
      setSelectedSctKT('Chọn mã hàng')
    }
  }, [newData])

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2

    return total
  }

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
      setNewData(filteredData)
    }

    handleFilterPrint()
  }, [formPrintFilter])

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

  const handleOnlyPrintWareHouse = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      if (typePage === 'PMH') {
        const response = await apis.InPK(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrintWareHouse()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'NTR') {
        const response = await apis.InPKNTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrintWareHouse()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'XTR') {
        const response = await apis.InPKXTR(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrintWareHouse()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
      if (typePage === 'PBL') {
        const response = await apis.InPKPBL(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
        // Kiểm tra call api thành công
        if (response.data && response.data.DataError === 0) {
          base64ToPDF(response.data.DataResults)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleOnlyPrintWareHouse()
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(response.data.DataErrorDescription)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }

      // close()
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
            <label className="text-blue-700 font-semibold uppercase pb-1">In - {namePage} (Kho)</label>
          </div>
          <div className="border-2 my-1">
            <div className="p-4">
              <div className="flex justify-center items-center  gap-3 pl-[52px] ">
                {/* DatePicker */}
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="">Ngày</label>
                  <DateField
                    className="DatePicker_PMH max-w-[170px]"
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
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="">Đến</label>
                  <DateField
                    className="DatePicker_PMH max-w-[170px]"
                    format="DD/MM/YYYY"
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
              <div className="flex  mt-4">
                <div className="flex ">
                  <label className="pr-[22px]">Số chứng từ</label>

                  <Select
                    size="small"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '170px' }}
                    value={selectedSctBD}
                    onChange={handleSctBDChange}
                    popupMatchSelectWidth={false}
                  >
                    {newData?.map((item) => (
                      <Option key={item.SoChungTu} value={item.SoChungTu}>
                        {`${item.SoChungTu}_GV`}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="flex ">
                  <label className="pl-[18px] pr-[18px]">Đến</label>

                  <Select
                    size="small"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '170px' }}
                    value={selectedSctKT}
                    onChange={handleSctKTChange}
                    popupMatchSelectWidth={false}
                  >
                    {newData?.map((item) => (
                      <Option key={item.SoChungTu} value={item.SoChungTu}>
                        {`${item.SoChungTu}_GV`}
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
                  handleOnlyPrintWareHouse(), close2()
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
              <ActionButton
                color={'slate-50'}
                title={'Xác nhận'}
                isModal={true}
                background={'bg-main'}
                bg_hover={'white'}
                color_hover={'bg-main'}
                handleAction={handleOnlyPrintWareHouse}
              />
              <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalOnlyPrintWareHouse
