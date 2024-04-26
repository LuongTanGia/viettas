/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Input } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import ActionButton from '../../../util/Button/ActionButton'

const NDTCreate = ({ close, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const innitProduct = {
    Ma: '',
    Ten: '',
    GhiChu: '',
  }
  const [NDTForm, setNDTForm] = useState(() => {
    return innitProduct
  })
  const [errors, setErrors] = useState({
    Ma: '',
    Ten: '',
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  const handleCreate = async (isSave = true) => {
    if (!NDTForm?.Ma?.trim() || !NDTForm?.Ten?.trim()) {
      setErrors({
        Ma: NDTForm?.Ma?.trim() ? null : 'Mã không được trống',
        Ten: NDTForm?.Ten?.trim() ? null : 'Tên không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.ThemNhomDoiTuong({ ...NDTForm }, TokenAccess)
      if (response.data.DataError == 0) {
        isSave ? setNDTForm([]) : close()
        loadingData()
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setTargetRow(NDTForm?.Ma)
      } else {
        toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
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
          <div className="flex flex-col gap-2 py-1 px-2 md:w-[80vw] lg:w-[60vw] xl:w-[50vw]">
            <div className="flex gap-2">
              <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
              <p className="text-blue-700 font-semibold uppercase">Thêm - Nhóm Đối Tượng</p>
            </div>
            <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã</label>
                <Input
                  required
                  placeholder={errors.Ma && errors.Ma}
                  size="small"
                  className={`${errors.Ma ? 'border-red-500' : ''} w-[30%] overflow-hidden whitespace-nowrap overflow-ellipsis`}
                  value={NDTForm?.Ma}
                  onChange={(e) => {
                    setNDTForm({
                      ...NDTForm,
                      Ma: e.target.value,
                    })
                    setErrors({ ...errors, Ma: '' })
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên</label>
                <Input
                  required
                  placeholder={errors.Ten && errors.Ten}
                  size="small"
                  className={`${errors.Ten ? 'border-red-500' : ''} w-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                  value={NDTForm?.Ten}
                  onChange={(e) => {
                    setNDTForm({
                      ...NDTForm,
                      Ten: e.target.value,
                    })
                    setErrors({ ...errors, Ten: '' })
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                <Input
                  required
                  size="small"
                  className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                  value={NDTForm?.GhiChu}
                  onChange={(e) => {
                    setNDTForm({
                      ...NDTForm,
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
                    <input className="2xl:w-[20vw] lg:w-[18vw] md:w-[24vw] px-2 rounded-[3px] resize-none border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Lúc</label>
                    <input type="text" className="px-2 rounded-[3px] w-full resize-none border outline-none text-sm truncate" disabled />
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Người sửa</label>
                    <input className="2xl:w-[20vw] lg:w-[18vw] md:w-[24vw] px-2 rounded-[3px]  resize-none border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Lúc</label>
                    <input className="px-2 rounded-[3px] w-full resize-none border outline-none text-sm truncate" disabled />
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
  )
}

export default NDTCreate
