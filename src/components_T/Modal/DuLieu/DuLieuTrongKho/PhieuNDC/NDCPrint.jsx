/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { Select, Checkbox } from 'antd'
import { DateField } from '@mui/x-date-pickers'
import categoryAPI from '../../../../../API/linkAPI'
import logo from '../../../../../assets/VTS-iSale.ico'
import { RETOKEN, base64ToPDF } from '../../../../../action/Actions'
import ActionButton from '../../../../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../../../../components/util/Loading/LoadingPage'

const NDCPrint = ({ close, dataPrint }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [khoanNgayFrom, setKhoanNgayFrom] = useState()
  const [khoanNgayTo, setKhoanNgayTo] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [dataListChungTu, setDataListChungTu] = useState('')
  const [selectedNhomFrom, setSelectedNhomFrom] = useState([])
  const [selectedNhomTo, setSelectedNhomTo] = useState([])
  const [dateData, setDateData] = useState({})
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  })
  const [errors, setErrors] = useState({
    SoChungTuBatDau: '',
    SoChungTuKetThuc: '',
  })

  useEffect(() => {
    const getTimeSetting = async () => {
      try {
        const response = await categoryAPI.KhoanNgay(TokenAccess)
        if (response.data.DataError == 0) {
          setKhoanNgayFrom(dayjs(response.data.NgayBatDau).format('YYYY-MM-DDTHH:mm:ss'))
          setKhoanNgayTo(dayjs(response.data.NgayKetThuc).format('YYYY-MM-DDTHH:mm:ss'))
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
    const getListChungTu = async () => {
      try {
        if (isLoading == true) {
          const response = await categoryAPI.ListChungTuNDC({ NgayBatDau: dateData.NgayBatDau, NgayKetThuc: dateData.NgayKetThuc }, TokenAccess)
          if (response.data.DataError == 0) {
            setDataListChungTu(response.data.DataResults)
            setIsLoading(true)
          } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
            await RETOKEN()
            getListChungTu()
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getListChungTu()
  }, [dateData.NgayBatDau, dateData.NgayKetThuc])

  const calculateTotal = () => {
    let total = 0
    if (checkboxValues.checkbox1) total += 1
    if (checkboxValues.checkbox2) total += 2
    return total
  }
  const handlePrint = async () => {
    if (selectedNhomFrom == [] || selectedNhomTo == []) {
      setErrors({
        SoChungTuBatDau: selectedNhomFrom == [] ? '' : 'Số chứng từ không được trống',
        SoChungTuKetThuc: selectedNhomTo == [] ? '' : 'Số chứng từ không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.NDCPrint(
        dataPrint
          ? {
              NgayBatDau: dayjs(dataPrint.NgayCTu).format('YYYY-MM-DDTHH:mm:ss'),
              NgayKetThuc: dayjs(dataPrint.NgayCTu).format('YYYY-MM-DDTHH:mm:ss'),
              SoChungTuBatDau: dataPrint.SoChungTu,
              SoChungTuKetThuc: dataPrint.SoChungTu,
              SoLien: calculateTotal(),
            }
          : {
              NgayBatDau: khoanNgayFrom,
              NgayKetThuc: khoanNgayTo,
              SoChungTuBatDau: selectedNhomFrom,
              SoChungTuKetThuc: selectedNhomTo,
              SoLien: calculateTotal(),
            },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        base64ToPDF(response.data.DataResults)
      } else {
        toast.error(response.data.DataErrorDescription)
        console.log({
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayTo,
          SoChungTuBatDau: selectedNhomFrom,
          SoChungTuKetThuc: selectedNhomTo,
          SoLien: calculateTotal(),
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDateChange = () => {
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      khoanNgayFrom, khoanNgayTo
      setDateData({
        NgayBatDau: khoanNgayFrom,
        NgayKetThuc: khoanNgayTo,
      })
    }, 300)
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
            <div className="flex flex-col gap-2 p-2 max-w-[60rem]">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">In - Phiếu Nhập Điều Chỉnh</p>
              </div>
              <div className="flex flex-col gap-4 border-2 p-3">
                <div className="flex justify-center">
                  <div className="DatePicker_NDCKho flex justify-center gap-2">
                    <div className="DatePicker_NDCKho flex items-center gap-2">
                      <label>Từ</label>
                      <DateField
                        className="min-w-[100px] w-[60%]"
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        format="DD/MM/YYYY"
                        maxDate={dayjs(khoanNgayTo)}
                        defaultValue={dataPrint ? dayjs(dataPrint.NgayCTu, 'YYYY-MM-DD') : dayjs(khoanNgayFrom, 'YYYY-MM-DD')}
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
                          setKhoanNgayFrom(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                        }}
                      />
                    </div>
                    <div className=" flex items-center gap-2 ">
                      <label>Đến</label>
                      <DateField
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        className="min-w-[100px] w-[60%]"
                        format="DD/MM/YYYY"
                        minDate={dayjs(khoanNgayFrom)}
                        defaultValue={dataPrint ? dayjs(dataPrint.NgayCTu, 'YYYY-MM-DD') : dayjs(khoanNgayTo, 'YYYY-MM-DD')}
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
                          setKhoanNgayTo(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-2 items-center">
                    <div>Số chứng từ</div>
                    <Select
                      allowClear
                      showSearch
                      required
                      status={errors.SoChungTuBatDau ? 'error' : ''}
                      value={dataPrint ? dataPrint.SoChungTu : selectedNhomFrom}
                      placeholder={errors?.SoChungTuBatDau ? errors?.SoChungTuBatDau : 'Chọn nhóm'}
                      onChange={(value) => {
                        setSelectedNhomFrom(value)
                        setErrors({ ...errors, SoChungTuBatDau: '' })
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
                  <div className="flex gap-2 items-center">
                    <div> Tới</div>
                    <Select
                      allowClear
                      showSearch
                      required
                      placeholder={errors?.SoChungTuKetThuc ? errors?.SoChungTuKetThuc : 'Chọn nhóm'}
                      status={errors.SoChungTuKetThuc ? 'error' : ''}
                      value={dataPrint ? dataPrint.SoChungTu : selectedNhomTo}
                      onChange={(value) => {
                        setSelectedNhomTo(value)
                        setErrors({ ...errors, SoChungTuKetThuc: '' })
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
                <ActionButton handleAction={handlePrint} title={'Xác nhận'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} disable />
                <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NDCPrint
