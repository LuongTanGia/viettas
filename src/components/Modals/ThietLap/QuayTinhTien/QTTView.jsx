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
import { FaEyeSlash, FaEye } from 'react-icons/fa'

const QTTView = ({ close, dataQTT }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataQTTView, setdataQTTView] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    const handleView = async () => {
      try {
        const response = await categoryAPI.InfoQuayTinhTien(dataQTT?.Quay, TokenAccess)
        if (response.data.DataError == 0) {
          setdataQTTView(response.data.DataResult)
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

  console.log(dataQTTView)
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
                  <p className="text-blue-700 font-semibold uppercase">Thông tin - Quầy tính tiền</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Quầy</label>
                      <input type="text" value={dataQTTView?.Quay || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate text-end" readOnly />
                    </div>
                    <div className="flex items-center">
                      <Checkbox checked={dataQTTView?.CungServer} className="text-sm whitespace-nowrap">
                        Cùng mạng
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox checked={dataQTTView?.CungHeThong} className="text-sm whitespace-nowrap">
                        Cùng máy
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox checked={dataQTTView?.NA} className="text-sm whitespace-nowrap">
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Tên máy tính</label>
                    <input type="text" value={dataQTTView?.TenMayTinh || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap required min-w-[90px] text-sm flex justify-end">SQL trạm</label>
                    <input type="text" value={dataQTTView?.SQLServer || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="flex">
                    <div className="flex items-center gap-1 w-[100%]">
                      <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">SQL user</label>
                      <input type="text" value={dataQTTView?.SQLUser || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                    </div>
                    <div className="flex items-center gap-1 w-[100%]">
                      <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">SQL pass</label>
                      <input
                        type={isShow ? 'text' : 'password'}
                        value={dataQTTView?.SQLPassword || ''}
                        className="relative px-2 w-full resize-none rounded border outline-none text-sm truncate"
                        readOnly
                      />
                      <div className="absolute right-10 text-gray-400 hover:text-blue-500 cursor-pointer" onClick={() => setIsShow(!isShow)}>
                        {isShow ? <FaEye /> : <FaEyeSlash />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Dữ liệu</label>
                    <input type="text" value={dataQTTView?.SQLDatabase || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="flex items-center gap-1 w-[100%]">
                    <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Kho</label>
                    <input
                      type="text"
                      value={`${dataQTTView?.MaKho || ''} - ${dataQTTView?.TenKho || ''}`}
                      className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-12 ml-[100px]">
                    <div className="flex items-center">
                      <Checkbox disabled checked={false} className="text-sm whitespace-nowrap">
                        Bán lẻ
                      </Checkbox>
                    </div>
                    <div className="flex items-center">
                      <Checkbox checked={dataQTTView?.Loai == 1 ? true : true} className="text-sm whitespace-nowrap">
                        Terminal
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                    <input
                      type="text"
                      value={dataQTTView?.NhomGia || dataQTTView?.TenNhomGia ? `${dataQTTView?.NhomGia || ''} - ${dataQTTView?.TenNhomGia || ''}` : ''}
                      className="px-2 w-full resize-none rounded border outline-none text-sm truncate"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <input type="text" value={dataQTTView?.GhiChu || ''} className="px-2 w-full resize-none rounded border outline-none text-sm truncate" readOnly />
                  </div>
                  <div className="grid grid-cols-1 mt-1 gap-2 px-2 py-2.5 rounded border-black-200 ml-[95px] relative border-[0.125rem]">
                    <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <label className=" text-sm">Người tạo</label>
                        <Tooltip title={dataQTTView?.NguoiTao} color="blue">
                          <input
                            value={dataQTTView?.NguoiTao || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={moment(dataQTTView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                          <input
                            type="text"
                            value={moment(dataQTTView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                            className="px-2 rounded w-full resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Người sửa</label>
                        <Tooltip title={dataQTTView?.NguoiSuaCuoi} color="blue">
                          <input
                            value={dataQTTView?.NguoiSuaCuoi || ''}
                            className="2xl:w-[17vw] lg:w-[18vw] md:w-[24vw] px-2 rounded  resize-none border outline-none text-[1rem] truncate"
                            readOnly
                          />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <label className=" text-sm">Lúc</label>
                        <Tooltip title={dataQTTView?.NgaySuaCuoi ? moment(dataQTTView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            value={dataQTTView?.NgaySuaCuoi ? moment(dataQTTView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
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

export default QTTView
