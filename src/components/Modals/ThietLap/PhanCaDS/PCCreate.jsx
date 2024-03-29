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
const PCCreate = ({ close, loadingData, setTargetRow, maNguoiDung }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataUser, setDataUser] = useState(null)
  const [dataQuay, setDataQuay] = useState(null)
  const [dataCa, setDataCa] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [DateFrom, setDateFrom] = useState(dayjs(new Date()))
  const innitProduct = {
    SoQuay: 0,
    MaNguoiDung: '',
    HieuLucTu: null,
    MaCa: '',
    GhiChu: '',
  }

  const [PCForm, setPCForm] = useState(() => {
    return innitProduct
  })
  const [errors, setErrors] = useState({
    MaNguoiDung: '',
    SoQuay: '',
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

  useEffect(() => {
    const getListHelperQuay = async () => {
      try {
        const response = await categoryAPI.ListHelperPC_QuayTinhTien(TokenAccess)
        if (response.data.DataError == 0) {
          setDataQuay(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelperQuay()
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
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHelperCa()
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
    if (!PCForm?.MaNguoiDung?.trim() || !PCForm?.SoQuay) {
      setErrors({
        MaNguoiDung: PCForm?.MaNguoiDung?.trim() ? null : 'Người dùng không được trống',
        SoQuay: PCForm?.SoQuay ? null : 'Quầy không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.ThemPhanCa({ ...PCForm, HieuLucTu: dayjs(DateFrom).format('YYYY-MM-DDTHH:mm:ss') }, TokenAccess)
      if (response.data.DataError == 0) {
        isSave ? setPCForm([]) : close()
        loadingData()
        toast.success('Tạo thành công', { autoClose: 1000 })
        setTargetRow(PCForm?.MaNguoiDung)
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
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
              <div className="flex flex-col gap-2 py-1 px-2 md:w-[85vw] lg:w-[65vw] xl:w-[50vw] 2xl:w-[40vw]">
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
                  <div className="flex items-center ml-[15px] ">
                    <div className="flex items-center gap-1 w-full">
                      <label className="required whitespace-nowrap text-sm">Kể từ ngày</label>
                      <DateField
                        className="DatePicker_NXTKho max-w-[130px] "
                        format="DD/MM/YYYY"
                        value={DateFrom || null}
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
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Quầy</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        required
                        className="text-end"
                        size="small"
                        status={errors.SoQuay ? 'error' : ''}
                        placeholder={errors?.SoQuay ? errors?.SoQuay : ''}
                        value={PCForm?.SoQuay || undefined}
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
                    <div className="flex items-center gap-1 w-[90%]">
                      <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ca</label>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        required
                        size="small"
                        value={PCForm?.MaCa || undefined}
                        onChange={(value) => {
                          setPCForm({
                            ...PCForm,
                            MaCa: value,
                          })
                        }}
                      >
                        {dataCa &&
                          dataCa.map((item, index) => (
                            <Select.Option key={index} value={item.Ma}>
                              {item.ThongTinCaLamViec}
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
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate" readOnly />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input type="text" className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate" readOnly />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate" readOnly />
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <input className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate" readOnly />
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
                    title={'Lưu & Đóng'}
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
