/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { Checkbox, Tooltip } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'

const DTView = ({ close, dataDT }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataDTView, setDataDTView] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleView = async () => {
      try {
        const response = await categoryAPI.InfoDoiTuong(dataDT?.Ma, TokenAccess)
        if (response.data.DataError == 0) {
          setDataDTView(response.data.DataResult)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleView()
        }
      } catch (error) {
        console.error(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      handleView()
    }
  }, [isLoading])
  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 py-1 px-2 md:w-[80vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Thông tin - Đối Tượng</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex gap-8 justify-around">
                    <div className="flex items-center ">
                      <Checkbox className="text-sm" checked={dataDTView?.Loai == 1}>
                        Nhà Cung Cấp
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox className="text-sm" checked={dataDTView?.Loai == 2}>
                        Khách Hàng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Nhóm</label>
                    <input
                      type="text"
                      value={`${(dataDTView?.Nhom || '') !== '' || (dataDTView?.TenNhom || '') !== '' ? `${dataDTView?.Nhom || ''} - ${dataDTView?.TenNhom || ''}` : ''}`}
                      className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã</label>
                    <input type="text" value={dataDTView?.Ma || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên</label>
                    <input
                      type="text"
                      value={dataDTView?.Ten || ''}
                      className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                    <input type="text" value={dataDTView?.DiaChi || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Quận huyện</label>
                    <input type="text" value={dataDTView?.QuanHuyen || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Tỉnh thành</label>
                    <input type="text" value={dataDTView?.TinhThanh || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Mã số thuế</label>
                    <input type="text" value={dataDTView?.MST || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Điện thoại</label>
                      <input type="text" value={dataDTView?.DienThoai || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap text-sm flex justify-end">Fax</label>
                      <input type="text" value={dataDTView?.Fax || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Người liên hệ</label>
                    <input type="text" value={dataDTView?.NguoiLienHe || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <input type="text" value={dataDTView?.GhiChu || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" disabled />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <Tooltip title={dataDTView?.NguoiTao} color="blue">
                          <input
                            value={dataDTView?.NguoiTao || ''}
                            className="2xl:w-[17vw] xl:w-[21vw] lg:w-[22vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-sm truncate"
                            disabled
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataDTView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            type="text"
                            value={moment(dataDTView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-sm truncate"
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <Tooltip title={dataDTView?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataDTView?.NguoiSuaCuoi || ''}
                            className="2xl:w-[17vw] xl:w-[21vw] lg:w-[22vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-sm truncate"
                            disabled
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataDTView?.NgaySuaCuoi ? moment(dataDTView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataDTView?.NgaySuaCuoi ? moment(dataDTView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-sm truncate"
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end ">
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

export default DTView
