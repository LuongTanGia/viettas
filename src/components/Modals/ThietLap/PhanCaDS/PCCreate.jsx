/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Input, Select } from 'antd'
import { DateField } from '@mui/x-date-pickers'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
const PCCreate = ({ close, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataUser, setDataUser] = useState(null)
  const [dataQuay, setDataQuay] = useState(null)
  const [dataCa, setDataCa] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [DateFrom, setDateFrom] = useState(dayjs(new Date()))

  const innitProduct = {
    SoQuay: null,
    MaNguoiDung: '',
    HieuLucTu: null,
    MaCa: null,
    GhiChu: '',
  }
  const [PCForm, setPCForm] = useState(() => {
    return innitProduct
  })
  const [errors, setErrors] = useState({
    MaNguoiDung: '',
    SoQuay: null,
    MaCa: null,
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const getListHelper = async () => {
      try {
        const response = await categoryAPI.ListHelperPC_NguoiDung(TokenAccess)
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

  // useEffect(() => {
  //   const filteredUsers = dataUser?.filter((item) => {
  //     return maNguoiDung.some((user) => user.MaNguoiDung === item.Ma)
  //   })
  //   const filteredMaUsers1 = maNguoiDung?.filter((item) => item?.HieuLucTu).map((item) => item.HieuLucTu)
  //   const isMatched = filteredMaUsers1.includes(PCForm?.HieuLucTu == null ? dayjs(DateFrom).format('YYYY-MM-DDTHH:mm:ss') : PCForm?.HieuLucTu)
  //   console.log(isMatched)
  // }, [maNguoiDung, PCForm, DateFrom])

  useEffect(() => {
    const getListHelperQuay = async () => {
      try {
        const response = await categoryAPI.ListHelperPC_QuayTinhTien(TokenAccess)
        if (response.data.DataError == 0) {
          setDataQuay(response.data.DataResults)
          setIsLoading(true)
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelperQuay()
    }
  }, [isLoading])

  useEffect(() => {
    const getListHelperCa = async () => {
      try {
        const response = await categoryAPI.ListHelperPC_CaLamViec(TokenAccess)
        if (response.data.DataError == 0) {
          setDataCa(response.data.DataResults)
          setIsLoading(true)
        }
      } catch (error) {
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getListHelperCa()
    }
  }, [isLoading])

  const handleCreate = async (isSave = true) => {
    if (!PCForm?.MaNguoiDung?.trim()) {
      setErrors({
        MaNguoiDung: PCForm?.MaNguoiDung?.trim() ? null : 'Người dùng không được trống',
      })
      return
    }
    let shouldSetError = false
    if (!PCForm?.SoQuay && !PCForm?.MaCa) {
      shouldSetError = false
    } else if (!PCForm?.SoQuay || !PCForm?.MaCa) {
      shouldSetError = true
    }
    if (shouldSetError) {
      setErrors({
        SoQuay: !PCForm?.MaCa ? null : PCForm?.SoQuay ? null : 'Quầy không được trống',
        MaCa: !PCForm?.SoQuay ? null : PCForm?.MaCa ? null : 'Ca không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.ThemPhanCa({ ...PCForm, HieuLucTu: dayjs(DateFrom).format('YYYY-MM-DD') }, TokenAccess)
      if (response.data.DataError == 0) {
        isSave ? setPCForm([]) : close()
        loadingData()
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setTargetRow(PCForm?.MaNguoiDung)
      } else {
        toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
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
                  <p className="text-blue-700 font-semibold uppercase">Thêm - Phân Ca</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Người dùng</label>
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      required
                      size="small"
                      status={errors.MaNguoiDung ? 'error' : ''}
                      placeholder={errors?.MaNguoiDung ? errors?.MaNguoiDung : ''}
                      value={PCForm?.MaNguoiDung || undefined}
                      onChange={(value) => {
                        setPCForm({
                          ...PCForm,
                          MaNguoiDung: value,
                        })
                        setErrors({ ...errors, MaNguoiDung: '' })
                      }}
                      optionFilterProp="children"
                      popupMatchSelectWidth={false}
                    >
                      {dataUser &&
                        dataUser.map((item, index) => (
                          <Select.Option key={index} value={item.Ma}>
                            {item.Ma} - {item.Ten}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  <div className="flex items-center ml-[15px]">
                    <div className="flex items-center gap-1 w-full">
                      <label className="required whitespace-nowrap text-sm">Kể từ ngày</label>
                      <DateField
                        className="DatePicker_NXTKho max-w-[130px] "
                        format="DD/MM/YYYY"
                        value={DateFrom}
                        onChange={(values) => {
                          setPCForm({ ...PCForm, HieuLucTu: dayjs(setDateFrom(values)).format('YYYY-MM-DD') })
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
                    <div className="flex items-center gap-1 w-full">
                      <label className="whitespace-nowrap required min-w-[90px] text-sm flex justify-end ">Quầy</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        className="text-end truncate 2xl:max-w-[8rem] xl:max-w-[7rem] md:max-w-[6rem]"
                        size="small"
                        status={errors.SoQuay ? 'error' : ''}
                        placeholder={errors?.SoQuay ? errors?.SoQuay : ''}
                        value={PCForm?.SoQuay}
                        onChange={(value) => {
                          setPCForm({
                            ...PCForm,
                            SoQuay: value,
                          })
                          setErrors({ ...errors, SoQuay: '' })
                        }}
                      >
                        {dataQuay &&
                          dataQuay.map((item, index) => (
                            <Select.Option key={index} value={item.Quay}>
                              {item.Quay}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-1 w-[80%]">
                      <label className="required whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ca</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        size="small"
                        className="truncate xl:max-w-[7rem] md:max-w-[6rem]"
                        status={errors.MaCa ? 'error' : ''}
                        placeholder={errors?.MaCa ? errors?.MaCa : ''}
                        value={PCForm?.MaCa}
                        onChange={(value) => {
                          setPCForm({
                            ...PCForm,
                            MaCa: value,
                          })
                          setErrors({ ...errors, MaCa: '' })
                        }}
                        optionFilterProp="children"
                        popupMatchSelectWidth={false}
                      >
                        {dataCa &&
                          dataCa.map((item, index) => (
                            <Select.Option key={index} value={item.Ma}>
                              {item.Ma} - {item.Ten}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <Input
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={PCForm?.GhiChu}
                      onChange={(e) => {
                        setPCForm({
                          ...PCForm,
                          GhiChu: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-2 justify-center">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded-[3px] resize-none border outline-none text-sm truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input type="text" className="px-2 rounded-[3px] w-full resize-none border outline-none text-sm truncate" disabled />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded-[3px]  resize-none border outline-none text-sm truncate" disabled />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input className="px-2 rounded-[3px] w-full resize-none border outline-none text-sm truncate" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <ActionButton
                    handleAction={() => handleCreate(true)}
                    title={'Lưu'}
                    isModal={true}
                    color={'slate-50'}
                    background={'blue-500'}
                    color_hover={'blue-500'}
                    bg_hover={'white'}
                  />
                  <ActionButton
                    handleAction={() => handleCreate(false)}
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
        </>
      )}
    </>
  )
}

export default PCCreate
