/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN, base64ToPDF } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import { Checkbox, Tooltip } from 'antd'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
const QLView = ({ close, dataQL }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataQLView, setDataQLView] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleView = async () => {
      try {
        const response = await categoryAPI.InfoQuanLy(dataQL?.MaQuanLy, TokenAccess)
        if (response.data.DataError == 0) {
          setDataQLView(response.data.DataResult)
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

  const handlePrint = async () => {
    try {
      const response = await categoryAPI.InTheQuanLy(dataQL?.MaQuanLy, TokenAccess)
      if (response.data.DataError == 0) {
        base64ToPDF(response.data.DataResults)
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
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
              <div className="flex flex-col gap-2 py-1 px-2 md:w-[80vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Thông tin - Quản Lý</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-[60%]">
                      <label className="whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Mã quản lý</label>
                      <input type="text" value={dataQLView?.MaQuanLy || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                    </div>
                    <div className="flex items-center">
                      <Checkbox className="text-sm" checked={dataQLView?.NA}>
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Người dùng</label>
                    <input type="text" value={dataQLView?.TenNguoiDung || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hiệu lực từ</label>
                      <input
                        type="text"
                        value={moment(dataQLView?.TuNgay)?.format('DD/MM/YYYY') || ''}
                        className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ngày hết hạn</label>
                      <input
                        type="text"
                        value={dataQLView?.DenNgay ? moment(dataQLView?.DenNgay).format('DD/MM/YYYY') : '' || ''}
                        className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center">
                      <Checkbox className="text-sm" checked={dataQLView?.KhongKetThuc}>
                        Không kết thúc
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <input type="text" value={dataQLView?.GhiChu || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <Tooltip title={dataQLView?.NguoiTao} color="blue">
                          <input
                            value={dataQLView?.NguoiTao || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataQLView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            type="text"
                            value={moment(dataQLView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <Tooltip title={dataQLView?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataQLView?.NguoiSuaCuoi || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataQLView?.NgaySuaCuoi ? moment(dataQLView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataQLView?.NgaySuaCuoi ? moment(dataQLView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-between">
                  <ActionButton handleAction={handlePrint} title={'In thẻ'} color={'slate-50'} background={'purple-500'} color_hover={'purple-500'} bg_hover={'white'} />
                  <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default QLView
