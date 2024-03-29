/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Checkbox, Input } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import ActionButton from '../../../util/Button/ActionButton'
const NHCreate = ({ close, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const innitProduct = {
    MaNhom: '',
    TenNhom: '',
    GhiChu: '',
    NA: false,
  }
  const [NHForm, setNHForm] = useState(() => {
    return innitProduct
  })
  const [errors, setErrors] = useState({
    MaNhom: '',
    TenNhom: '',
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  const handleCreate = async (isSave = true) => {
    if (!NHForm?.MaNhom?.trim() || !NHForm?.TenNhom?.trim()) {
      setErrors({
        MaNhom: NHForm?.MaNhom?.trim() ? null : 'Mã không được trống',
        TenNhom: NHForm?.TenNhom?.trim() ? null : 'Tên không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.ThemNhomHang({ ...NHForm }, TokenAccess)
      if (response.data.DataError == 0) {
        isSave ? setNHForm([]) : close()
        loadingData()
        toast.success('Tạo thành công', { autoClose: 1000 })
        setTargetRow(NHForm?.MaNhom)
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  return (
    <>
      <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
        <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
          <div className="flex flex-col gap-2 py-1 px-2 md:w-[85vw] lg:w-[65vw] xl:w-[50vw] 2xl:w-[40vw]">
            <div className="flex gap-2">
              <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
              <p className="text-blue-700 font-semibold uppercase">Thêm - Nhóm Hàng</p>
            </div>
            <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
              <div className="flex items-center gap-2 ">
                <div className="flex items-center gap-1 w-[60%]">
                  <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã</label>
                  <Input
                    required
                    placeholder={errors.MaNhom && errors.MaNhom}
                    size="small"
                    className={`${errors.MaNhom ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                    value={NHForm?.MaNhom}
                    onChange={(e) => {
                      setNHForm({
                        ...NHForm,
                        MaNhom: e.target.value,
                      })
                      setErrors({ ...errors, MaNhom: '' })
                    }}
                  />
                </div>
                <div className="whitespace-nowrap">
                  <Checkbox
                    checked={NHForm?.NA}
                    onChange={(e) =>
                      setNHForm({
                        ...NHForm,
                        NA: e.target.checked,
                      })
                    }
                  >
                    Ngưng dùng
                  </Checkbox>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên</label>
                <Input
                  required
                  placeholder={errors?.TenNhom && errors?.TenNhom}
                  size="small"
                  className={`${errors?.TenNhom ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                  value={NHForm?.TenNhom}
                  onChange={(e) => {
                    setNHForm({
                      ...NHForm,
                      TenNhom: e.target.value,
                    })
                    setErrors({ ...errors, TenNhom: '' })
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                <Input
                  required
                  size="small"
                  className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                  value={NHForm?.GhiChu}
                  onChange={(e) => {
                    setNHForm({
                      ...NHForm,
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
                    <input className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate" readOnly />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Lúc</label>
                    <input className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate" readOnly />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end ">
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
  )
}

export default NHCreate
