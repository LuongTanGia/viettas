/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import icons from '../untils/icons'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { base64ToPDF } from '../action/Actions'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ActionButton from '../components/util/Button/ActionButton'
import { Select } from 'antd'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { Checkbox } from 'antd'
const { Option } = Select
const { MdFilterAlt } = icons

const ModalOnlyPrint = ({ close, dataThongTin, dataPMH, actionType, close2, SctCreate }) => {
  const [selectedSctBD, setSelectedSctBD] = useState()
  const [selectedSctKT, setSelectedSctKT] = useState()
  const [newDataPMH, setNewDataPMH] = useState()
  const startDate = dayjs(dataThongTin.NgayCTu).format('YYYY-MM-DDTHH:mm:ss')
  const endDate = dayjs(dataThongTin.NgayCTu).format('YYYY-MM-DDTHH:mm:ss')

  const dataPMHByDate = useMemo(() => {
    return dataPMH.filter((item) => {
      const itemDate = new Date(item.NgayCTu)
      const ngaybt = new Date(startDate)
      const ngaykt = new Date(endDate)

      return itemDate >= ngaybt && itemDate <= ngaykt
    })
  }, [dataPMH, startDate, endDate])

  useEffect(() => {
    setNewDataPMH(dataPMHByDate)
  }, [dataPMHByDate])

  const [formPrint, setFormPrint] = useState({ NgayBatDau: startDate, NgayKetThuc: endDate })

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

  const handleFilterPrint = () => {
    const ngayBD = dayjs(formPrint.NgayBatDau)
    const ngayKT = dayjs(formPrint.NgayKetThuc)
    // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
    const filteredData = dataPMH.filter((item) => {
      const itemDate = dayjs(item.NgayCTu)

      if (ngayBD.isValid() && ngayKT.isValid()) {
        return itemDate >= ngayBD && itemDate <= ngayKT
      }
    })
    setNewDataPMH(filteredData)
  }

  const handleOnlyPrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const lien = calculateTotal()
      const response = await apis.InPMH(tokenLogin, formPrint, selectedSctBD, selectedSctKT, lien)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults)
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else {
        toast.error(response.data.DataErrorDescription)
      }
      close()
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
            <label className="text-blue-700 font-semibold uppercase pb-1">In - phiếu mua hàng</label>
          </div>
          <div className="border-2 my-1">
            <div className="p-4">
              <div className="flex justify-center items-center  gap-3 pl-[74px] ">
                {/* DatePicker */}
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="">Ngày</label>
                  <DatePicker
                    className="DatePicker_PMH"
                    format="DD/MM/YYYY"
                    maxDate={actionType !== 'create' && dayjs(formPrint.NgayKetThuc)}
                    defaultValue={actionType === 'create' ? dayjs() : dayjs(dataThongTin?.NgayCTu)}
                    onChange={(newDate) => {
                      setFormPrint({
                        ...formPrint,
                        NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
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
                <div className="flex gap-x-5 items-center">
                  <label htmlFor="">Đến</label>
                  <DatePicker
                    className="DatePicker_PMH"
                    format="DD/MM/YYYY"
                    minDate={actionType !== 'create' && dayjs(formPrint.NgayBatDau)}
                    defaultValue={actionType === 'create' ? dayjs() : dayjs(dataThongTin?.NgayCTu)}
                    onChange={(newDate) => {
                      setFormPrint({
                        ...formPrint,
                        NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
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

                <ActionButton
                  color={'slate-50'}
                  title={'Lọc'}
                  icon={<MdFilterAlt size={20} />}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={handleFilterPrint}
                />
              </div>
              <div className="flex  mt-4 ">
                <div className="flex ">
                  <label className="px-[22px]">Số chứng từ</label>

                  <Select size="small" showSearch optionFilterProp="children" onChange={(value) => setSelectedSctBD(value)} style={{ width: '154px' }} value={selectedSctBD}>
                    {newDataPMH?.map((item) => (
                      <Option key={item.SoChungTu} value={item.SoChungTu}>
                        {item.SoChungTu}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="flex ">
                  <label className="px-[16px]">Đến</label>

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
