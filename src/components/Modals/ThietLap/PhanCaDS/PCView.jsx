/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { Tooltip } from 'antd'
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../action/Actions'
import ActionButton from '../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../util/Loading/LoadingPage'
const PCView = ({ close, dataPC }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataPCView, setDataPCView] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleView = async () => {
      try {
        const response = await categoryAPI.InfoPhanCa({ MaNguoiDung: dataPC.MaNguoiDung, HieuLuc: dataPC.HieuLucTu }, TokenAccess)
        if (response.data.DataError == 0) {
          setDataPCView(response.data.DataResult)
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
  console.log(dataPCView)
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
                  <p className="text-blue-700 font-semibold uppercase">Thông tin - Phân Ca</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Người dùng</label>
                    <input type="text" value={dataPCView?.MaNguoiDung || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="flex items-center ml-[15px] ">
                    <div className="flex items-center gap-1 w-full">
                      <label className="required whitespace-nowrap text-sm">Kể từ ngày</label>
                      <input
                        type="text"
                        value={moment(dataPCView?.HieuLucTu)?.format('DD/MM/YYYY') || ''}
                        className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Quầy</label>
                      <input type="text" value={dataPCView?.SoQuay || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                    </div>
                    <div className="flex items-center gap-1 w-[90%]">
                      <label className=" whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ca</label>
                      <input
                        type="text"
                        value={`${dataPCView?.MaCa || ''} - ${dataPCView?.TenCa || ''}`}
                        className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <input type="text" value={dataPCView?.GhiChu || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <Tooltip title={dataPCView?.NguoiTao} color="blue">
                          <input
                            value={dataPCView?.NguoiTao || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataPCView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            type="text"
                            value={moment(dataPCView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <Tooltip title={dataPCView?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataPCView?.NguoiSuaCuoi || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataPCView?.NgaySuaCuoi ? moment(dataPCView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataPCView?.NgaySuaCuoi ? moment(dataPCView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
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

export default PCView
