/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
// import { MdPrint } from 'react-icons/md'
import { Checkbox, Input, Select } from 'antd'
import { DateField } from '@mui/x-date-pickers'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN, base64ToPDF } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
const QLCreate = ({ close, loadingData, setTargetRow, maNguoiDung }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataUser, setDataUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [DateFrom, setDateFrom] = useState(dayjs(new Date()))
  const [DateTo, setDateTo] = useState(null)
  const [dateChange, setDateChange] = useState(false)
  const innitProduct = {
    MaQuanLy: '',
    MaNguoiDung: '',
    TuNgay: null,
    DenNgay: null,
    KhongKetThuc: true,
    NA: false,
    GhiChu: '',
  }

  const [QLForm, setQLForm] = useState(() => {
    return innitProduct
  })
  const [errors, setErrors] = useState({
    MaQuanLy: '',
    MaNguoiDung: '',
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const response = await categoryAPI.ListHelper_NguoiDung(TokenAccess)
        if (response.data.DataError == 0) {
          setDataUser(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelper()
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelper()
    }
  }, [isLoading])

  const handleDateChange = () => {
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!dateChange && DateTo !== null && DateFrom && DateTo && typeof DateFrom.isAfter === 'function' && typeof DateTo.isAfter === 'function' && DateFrom.isAfter(DateTo)) {
        setQLForm({ ...QLForm, TuNgay: dayjs(DateFrom).format('YYYY-MM-DD'), DenNgay: dayjs(DateFrom).format('YYYY-MM-DD') })
        return
      } else if (dateChange && DateTo !== null && DateFrom && DateTo && DateFrom.isAfter(DateTo)) {
        setQLForm({ ...QLForm, TuNgay: dayjs(DateTo).format('YYYY-MM-DD'), DenNgay: dayjs(DateTo).format('YYYY-MM-DD') })
      } else {
        setQLForm({ ...QLForm, TuNgay: dayjs(DateFrom).format('YYYY-MM-DD'), DenNgay: dayjs(DateTo).format('YYYY-MM-DD') })
      }
    }, 300)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }
  const handleCreate = async (isSave = true, isPrint = true) => {
    if ((dataThongSo?.ALLOW_MAQUANLYTUDONG ? null : !QLForm?.MaQuanLy?.trim()) || !QLForm?.MaNguoiDung?.trim()) {
      setErrors({
        MaQuanLy: dataThongSo.ALLOW_MAQUANLYTUDONG ? null : QLForm?.MaQuanLy?.trim() ? null : 'Mã không được trống',
        MaNguoiDung: QLForm?.MaNguoiDung?.trim() ? null : 'Người dùng không được trống',
      })
      return
    }
    console.log({ ...QLForm })
    try {
      const response = await categoryAPI.ThemQuanLy({ ...QLForm, TuNgay: dayjs(DateFrom).format('YYYY-MM-DD') }, TokenAccess)
      if (response.data.DataError == 0) {
        isPrint
          ? (dataThongSo.ALLOW_MAQUANLYTUDONG ? handlePrint(response.data.DataResults[0].Ma) : handlePrint(), setQLForm({ KhongKetThuc: true }))
          : isSave
            ? (setQLForm({ KhongKetThuc: true }), toast.success(response.data.DataErrorDescription, { autoClose: 1000 }))
            : (close(), toast.success(response.data.DataErrorDescription, { autoClose: 1000 }))
        loadingData()
        dataThongSo.ALLOW_MAQUANLYTUDONG ? setTargetRow(response.data.DataResults[0].Ma) : setTargetRow(QLForm?.MaQuanLy)
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
    }
  }
  const handlePrint = async (maQuanLy) => {
    try {
      const response = await categoryAPI.InTheQuanLy(maQuanLy ? maQuanLy : QLForm?.MaQuanLy, TokenAccess)
      if (response.data.DataError == 0) {
        base64ToPDF(response.data.DataResults)
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 py-1 px-2 md:w-[80vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[45vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Thêm - Quản Lý</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã quản lý</label>
                      <Input
                        required
                        placeholder={errors?.MaQuanLy && errors?.MaQuanLy}
                        size="small"
                        disabled={dataThongSo && dataThongSo?.ALLOW_MAQUANLYTUDONG === true}
                        className={`${errors?.MaQuanLy ? 'border-red-500' : ''} w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis`}
                        value={QLForm?.MaQuanLy}
                        onChange={(e) => {
                          setQLForm({
                            ...QLForm,
                            MaQuanLy: e.target.value,
                          })
                          setErrors({ ...errors, MaQuanLy: '' })
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={QLForm?.NA}
                        className="text-sm whitespace-nowrap"
                        onChange={(e) =>
                          setQLForm({
                            ...QLForm,
                            NA: e.target.checked,
                          })
                        }
                      >
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Người dùng</label>
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      required
                      size="small"
                      status={errors?.MaNguoiDung ? 'error' : ''}
                      placeholder={errors?.MaNguoiDung ? errors?.MaNguoiDung : ''}
                      value={QLForm?.MaNguoiDung || undefined}
                      onChange={(value) => {
                        setQLForm({
                          ...QLForm,
                          MaNguoiDung: value,
                        })
                        setErrors({ ...errors, MaNguoiDung: '' })
                      }}
                    >
                      {dataUser &&
                        dataUser.map(
                          (item, index) =>
                            !maNguoiDung.includes(item.Ma) && (
                              <Select.Option key={index} value={item.Ma}>
                                {item.ThongTinNguoiDung}
                              </Select.Option>
                            ),
                        )}
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 ml-[15px]">
                    <div className="flex items-center gap-1">
                      <label className="required whitespace-nowrap text-sm">Hiệu lực từ</label>
                      <DateField
                        // className="DatePicker_NXTKho max-w-[130px]"
                        className=" max-w-[115px]"
                        format="DD/MM/YYYY"
                        value={DateFrom}
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        onChange={(values) => {
                          setDateFrom(values)
                          setDateChange(false)
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
                    <div className="flex items-center gap-1">
                      <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ngày hết hạn</label>
                      <DateField
                        // className="DatePicker_NXTKho max-w-[130px]"
                        className=" max-w-[130px]"
                        format="DD/MM/YYYY"
                        value={QLForm.DenNgay}
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        slotProps={{
                          input: {
                            helperText: errors?.DenNgay ? errors?.DenNgay : '',
                          },
                        }}
                        onError={(newError) => setErrors(newError)}
                        onChange={(value) => {
                          setDateTo(value)
                          setDateChange(true)
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
                    <div className="flex items-center">
                      <Checkbox
                        checked={QLForm?.KhongKetThuc}
                        className="text-sm whitespace-nowrap"
                        onChange={(e) =>
                          setQLForm({
                            ...QLForm,
                            KhongKetThuc: e.target.checked,
                          })
                        }
                      >
                        Không kết thúc
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <Input
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={QLForm?.GhiChu}
                      onChange={(e) => {
                        setQLForm({
                          ...QLForm,
                          GhiChu: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input type="text" className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate" disabled />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <ActionButton
                      handleAction={() => handleCreate(true, true)}
                      title={'In thẻ'}
                      // icon={<MdPrint className="w-5 h-5" />}
                      color={'slate-50'}
                      background={'purple-500'}
                      color_hover={'purple-500'}
                      bg_hover={'white'}
                      isModal={true}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <ActionButton
                      handleAction={() => handleCreate(true, false)}
                      title={'Lưu'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => handleCreate(false, false)}
                      title={'Lưu & đóng'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default QLCreate
