/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { Select, Checkbox } from 'antd'
import { DateField } from '@mui/x-date-pickers'
import categoryAPI from '../../../../../API/linkAPI'
import logo from '../../../../../assets/VTS-iSale.ico'
import ActionButton from '../../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../../util/Loading/LoadingPage'
import { RETOKEN, base64ToPDF } from '../../../../../action/Actions'

const HUYPrint = ({ close, dataPrint }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [isLoading, setIsLoading] = useState(false)
  const [dataListChungTu, setDataListChungTu] = useState('')
  const [selectedNhomFrom, setSelectedNhomFrom] = useState(null)
  const [selectedNhomTo, setSelectedNhomTo] = useState(null)
  const [dateData, setDateData] = useState({
    NgayBatDau: null,
    NgayKetThuc: null,
  })
  const [dateChange, setDateChange] = useState(false)
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  })

  useEffect(() => {
    const getTimeSetting = async () => {
      try {
        const response = await categoryAPI.KhoanNgay(TokenAccess)
        if (response.data.DataError == 0) {
          setDateData({
            NgayBatDau: dayjs(dataPrint ? dataPrint.NgayCTu : response.data.NgayBatDau),
            NgayKetThuc: dayjs(dataPrint ? dataPrint.NgayCTu : response.data.NgayKetThuc),
          })
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getTimeSetting()
        } else {
          console.log(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (!isLoading) {
      getTimeSetting()
    }
  }, [isLoading])

  useEffect(() => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (dateData && dateData.NgayBatDau && dateData.NgayKetThuc) {
        getListChungTu()
      }
    }, 800)
  }, [dateData?.NgayBatDau, dateData?.NgayKetThuc, isLoading])

  const getListChungTu = async () => {
    try {
      if (isLoading) {
        const response = await categoryAPI.ListChungTuHUY(
          {
            NgayBatDau: dayjs(dateData?.NgayBatDau).format('YYYY-MM-DD'),
            NgayKetThuc: dayjs(dateData?.NgayKetThuc).format('YYYY-MM-DD'),
          },
          TokenAccess,
        )
        if (response.data.DataError == 0) {
          setDataListChungTu(response.data.DataResults)
          setIsLoading(true)
        } else if (response.data.DataError == -104) {
          setDataListChungTu([])
          setIsLoading(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (dataPrint) {
      if (dataListChungTu?.length == 0) {
        setSelectedNhomTo(null)
        setSelectedNhomFrom(null)
      } else {
        setSelectedNhomTo(dataPrint?.SoChungTu)
        setSelectedNhomFrom(dataPrint?.SoChungTu)
      }
    } else {
      if (dataListChungTu?.length == 0) {
        setSelectedNhomTo(null)
        setSelectedNhomFrom(null)
      }
    }
  }, [dataPrint, dataListChungTu])

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2
    return total
  }
  const handlePrint = async () => {
    try {
      const response = await categoryAPI.HUYPrint(
        {
          NgayBatDau: dateData.NgayBatDau.format('YYYY-MM-DD'),
          NgayKetThuc: dateData.NgayKetThuc.format('YYYY-MM-DD'),
          SoChungTuBatDau: selectedNhomFrom,
          SoChungTuKetThuc: selectedNhomTo,
          SoLien: calculateTotal(),
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        base64ToPDF(response.data.DataResults)
        close()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  let timerId
  const handleDateChange = () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!dateChange && dateData?.NgayBatDau && dateData?.NgayKetThuc && dateData?.NgayBatDau.isAfter(dateData?.NgayKetThuc)) {
        setDateData({
          NgayBatDau: dayjs(dateData?.NgayBatDau),
          NgayKetThuc: dayjs(dateData?.NgayBatDau),
        })
        return
      } else if (dateChange && dateData?.NgayBatDau && dateData?.NgayKetThuc && dateData?.NgayBatDau.isAfter(dateData?.NgayKetThuc)) {
        setDateData({
          NgayBatDau: dayjs(dateData?.NgayKetThuc),
          NgayKetThuc: dayjs(dateData?.NgayKetThuc),
        })
      } else {
        setDateData({
          NgayBatDau: dayjs(dateData?.NgayBatDau),
          NgayKetThuc: dayjs(dateData?.NgayKetThuc),
        })
      }
    }, 800)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }

  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
          <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
            <div className="flex flex-col gap-2 p-2 xl:w-[50vw] lg:w-[70vw] md:w-[95vw]">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">In - Phiếu Xuất Kho Hủy</p>
              </div>
              <div className="flex flex-col items-center gap-4 border-2 py-3">
                <div className="flex justify-center">
                  <div className="DatePicker_HUYKho flex justify-center gap-2">
                    <div className="DatePicker_HUYKho flex items-center gap-2">
                      <label className="ml-[20px]">Từ</label>
                      <DateField
                        className="max-w-[170px]"
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        format="DD/MM/YYYY"
                        value={dateData?.NgayBatDau}
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
                        onChange={(values) => {
                          setDateData({
                            ...dateData,
                            NgayBatDau: dayjs(values),
                          })
                          setDateChange(false)
                        }}
                      />
                    </div>
                    <div className=" flex items-center gap-2 ">
                      <label>Đến</label>
                      <DateField
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        className="max-w-[180px]"
                        format="DD/MM/YYYY"
                        value={dateData?.NgayKetThuc}
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
                        onChange={(values) => {
                          setDateData({
                            ...dateData,
                            NgayKetThuc: dayjs(values),
                          })
                          setDateChange(true)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-2 items-center whitespace-nowrap w-[50%]">
                    <div>Số chứng từ</div>
                    <Select
                      showSearch
                      required
                      size="small"
                      value={selectedNhomFrom}
                      placeholder={'Chọn nhóm'}
                      onChange={(value) => {
                        setSelectedNhomFrom(value)
                        if (
                          selectedNhomTo !== null &&
                          dataListChungTu.findIndex((item) => item.SoChungTu === value) > dataListChungTu.findIndex((item) => item.SoChungTu === selectedNhomTo)
                        ) {
                          setSelectedNhomTo(value)
                        } else {
                          setSelectedNhomTo(value)
                        }
                      }}
                      style={{
                        width: '200px',
                      }}
                    >
                      {dataListChungTu &&
                        dataListChungTu?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.SoChungTu} title={item.SoChungTu}>
                              <p className="truncate">{item.SoChungTu}</p>
                            </Select.Option>
                          )
                        })}
                    </Select>
                  </div>
                  <div className="flex gap-2 items-center w-[40%]">
                    <div>Tới</div>
                    <Select
                      showSearch
                      required
                      size="small"
                      placeholder={'Chọn nhóm'}
                      value={selectedNhomTo}
                      onChange={(value) => {
                        setSelectedNhomTo(value)
                        if (
                          selectedNhomFrom !== null &&
                          dataListChungTu.findIndex((item) => item.SoChungTu === value) < dataListChungTu.findIndex((item) => item.SoChungTu === selectedNhomFrom)
                        ) {
                          setSelectedNhomFrom(value)
                        } else {
                          setSelectedNhomFrom(value)
                        }
                      }}
                      style={{
                        width: '200px',
                      }}
                    >
                      {dataListChungTu &&
                        dataListChungTu?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.SoChungTu} title={item.SoChungTu}>
                              <p className="truncate">{item.SoChungTu}</p>
                            </Select.Option>
                          )
                        })}
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
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
              <div className="flex gap-2 justify-end">
                <ActionButton
                  handleAction={handlePrint}
                  title={'Xác nhận'}
                  isModal={true}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                  disable
                />
                <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HUYPrint
