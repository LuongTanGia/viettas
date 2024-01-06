/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import moment from 'moment'
import logo from '../../../../../assets/VTS-iSale.ico'
import categoryAPI from '../../../../../API/linkAPI'
import { RETOKEN } from '../../../../../action/Actions'
import ActionButton from '../../../../../components/util/Button/ActionButton'

const NCKXem = ({ close, dataNDC }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataNDCView, setDataNDCView] = useState('')
  const [dataThongSo, setDataThongSo] = useState('')

  useEffect(() => {
    handleView()
    getThongSo()
  }, [])
  const getThongSo = async () => {
    try {
      const response = await categoryAPI.ThongSo(TokenAccess)
      if (response.data.DataError == 0) {
        setDataThongSo(response.data.DataResult)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getThongSo()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleView = async () => {
    try {
      const repsonse = await categoryAPI.NDCView(dataNDC?.SoChungTu, TokenAccess)
      if (repsonse.data.DataError == 0) {
        setDataNDCView(repsonse.data.DataResult)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
      <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white p-2 rounded shadow-custom overflow-hidden">
        <div className="flex flex-col gap-2 p-2 max-w-[70rem] ">
          <div className="flex gap-2">
            <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
            <p className="text-blue-700 font-semibold uppercase">Thông tin - Phiếu Nhập Điều Chỉnh</p>
          </div>
          <div className="flex flex-col gap-2 border-2 px-1 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <label className="required whitespace-nowrap min-w-[100px] flex justify-end">Số chứng từ</label>
                    <input type="text" value={dataNDCView?.SoChungTu || ''} className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="required whitespace-nowrap">Ngày chứng từ</label>
                    <input
                      type="text"
                      value={moment(dataNDCView?.NgayCTu)?.format('DD/MM/YYYY') || ''}
                      className="px-2 w-[8rem] rounded resize-none border-[0.125rem] outline-none text-[1rem] text-center"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <label className="required whitespace-nowrap min-w-[100px] flex justify-end">Kho hàng</label>
                  <input
                    type="text"
                    value={`${dataNDCView?.MaKho} - ${dataNDCView?.TenKho}` || ''}
                    className="px-2 w-full rounded resize-none border-[0.125rem] outline-none text-[1rem]"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 border-2 px-2 py-2.5 border-black-200 rounded relative">
                <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                <div className="flex gap-1">
                  <div className="flex gap-1 items-center">
                    <label className="whitespace-nowrap">Người tạo</label>
                    <input
                      className="px-2 w-[16rem] resize-none rounded border-[0.125rem] outline-none text-[1rem] overflow-ellipsis"
                      value={dataNDCView?.NguoiTao || ''}
                      readOnly
                      title={dataNDCView?.NguoiTao || ''}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label>Lúc</label>
                    <input
                      className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]"
                      value={moment(dataNDCView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex gap-1 items-center">
                    <label className="whitespace-nowrap">Người sửa</label>
                    <input
                      className="px-2 w-[16rem] resize-none rounded border-[0.125rem] outline-none text-[1rem] overflow-ellipsis"
                      value={dataNDCView?.NguoiSuaCuoi || ''}
                      readOnly
                      title={dataNDCView?.NguoiSuaCuoi || ''}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label>Lúc</label>
                    <input
                      className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]"
                      value={dataNDCView?.NgaySuaCuoi ? moment(dataNDCView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <label className="whitespace-nowrap min-w-[100px] flex justify-end">Ghi chú</label>
              <input type="text" value={dataNDCView?.GhiChu || ''} className="px-2 w-[70rem] rounded resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
            </div>
            <div>
              <div className=" p-2 rounded border-2 m-1 flex flex-col gap-2 max-h-[20rem] overflow-y-auto">
                <table className="barcodeList ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã hàng</th>
                      <th>Tên hàng</th>
                      <th>ĐVT</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {dataNDCView?.DataDetails?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex justify-center">{item.STT}</div>
                        </td>
                        <td>
                          <div>{item.MaHang}</div>
                        </td>
                        <td>
                          <div>
                            <p className="block truncate">{item.TenHang}</p>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center">{item.DVT}</div>
                        </td>
                        <td>
                          <div className="flex justify-end">{formatThapPhan(item.SoLuong, dataThongSo.SOLESOLUONG)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end ">
            <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NCKXem
