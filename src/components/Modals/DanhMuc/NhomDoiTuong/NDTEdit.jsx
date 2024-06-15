/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Input, Tooltip } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import ActionButton from '../../../util/Button/ActionButton'
const NDTEdit = ({ close, loadingData, setTargetRow, dataNDT }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const innitProduct = {
    Ma: '',
    Ten: '',
    GhiChu: '',
  }
  const [NDTForm, setNDTForm] = useState(() => {
    return dataNDT ? { ...dataNDT } : innitProduct
  })
  const [errors, setErrors] = useState({
    Ten: '',
  })

  useEffect(() => {
    setTargetRow()
  }, [])

  const handleEdit = async () => {
    if (!NDTForm?.Ten?.trim()) {
      setErrors({
        Ten: NDTForm?.Ten?.trim() ? null : 'Tên không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.SuaNhomDoiTuong({ Ma: dataNDT?.Ma, Data: { ...NDTForm, Ten: NDTForm?.Ten?.trim(), GhiChu: NDTForm?.GhiChu?.trim() } }, TokenAccess)
      if (response.data.DataError == 0) {
        close()
        loadingData()
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setTargetRow(dataNDT?.Ma)
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
          <div className="flex flex-col gap-2 py-1 px-2 md:w-[80vw] lg:w-[60vw] xl:w-[45vw]">
            <div className="flex gap-2">
              <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
              <p className="text-blue-700 font-semibold uppercase">Sửa - Nhóm Đối Tượng</p>
            </div>
            <div className="flex flex-col gap-2 border-1 border-gray-400 px-3 py-2.5">
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap required min-w-[50px] text-sm flex justify-end">Mã</label>
                <input disabled required size="small" className="px-2 w-[30%] resize-none rounded-[3px] border outline-none text-sm truncate" value={NDTForm?.Ma} />
              </div>
              <div className="flex items-center gap-1">
                <label className=" whitespace-nowrap required min-w-[50px] text-sm flex justify-end">Tên</label>
                <Input
                  required
                  size="small"
                  placeholder={errors.Ten && errors.Ten}
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
                <label className=" whitespace-nowrap  min-w-[50px] text-sm flex justify-end">Ghi chú</label>
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
              <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[55px] relative border-[0.125rem]">
                <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                <div className="flex gap-2 justify-center">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <label className=" text-sm">Người tạo</label>
                    <Tooltip title={dataNDT?.NguoiTao} color="blue">
                      <input
                        value={dataNDT?.NguoiTao || ''}
                        className="2xl:w-[20vw] xl:w-[15vw] lg:w-[20vw] md:w-[24vw] px-2 rounded-[3px] resize-none border outline-none text-sm truncate"
                        disabled
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Lúc</label>
                    <Tooltip title={moment(dataNDT?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                      <input
                        value={moment(dataNDT?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                        type="text"
                        className="px-2 rounded-[3px] w-full resize-none border outline-none text-sm truncate text-center"
                        disabled
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Người sửa</label>
                    <Tooltip title={dataNDT?.NguoiSuaCuoi} color="blue">
                      <input
                        value={dataNDT?.NguoiSuaCuoi || ''}
                        className="2xl:w-[20vw] xl:w-[15vw] lg:w-[20vw] md:w-[24vw] px-2 rounded-[3px] resize-none border outline-none text-sm truncate"
                        disabled
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className=" text-sm">Lúc</label>
                    <Tooltip title={dataNDT?.NgaySuaCuoi ? moment(dataNDT?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                      <input
                        value={dataNDT?.NgaySuaCuoi ? moment(dataNDT?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                        className="px-2 rounded-[3px] w-full resize-none border outline-none text-sm truncate text-center"
                        disabled
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end ">
              <ActionButton
                handleAction={() => handleEdit()}
                title={'Xác nhận'}
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

export default NDTEdit
