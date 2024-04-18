/* eslint-disable react/prop-types */

import dayjs from 'dayjs'
import ActionButton from '../../../components/util/Button/ActionButton'
import logo from '../../../assets/VTS-iSale.ico'
import { DateField } from '@mui/x-date-pickers'
import { formatPrice } from '../../../action/Actions'
import { Tooltip } from 'antd'

const ViewSDV = ({ namePage, dataRecord, dataThongSo, typePage, close }) => {
  return (
    <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className="w-[700px] h-[400px]">
        <div className="flex gap-2">
          <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
          <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
        </div>
        <div className="border w-full h-[86%] rounded-[4px]-sm text-sm">
          <div className="flex flex-col px-2 ">
            <div className=" py-2 px-2 gap-2  grid grid-cols-1">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3  gap-2 items-center">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className="required  min-w-[90px] text-sm flex justify-end">Số chứng từ</label>
                    <input
                      value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className="required  min-w-[90px] text-sm flex justify-end">Ngày</label>
                    <input
                      type="text"
                      disabled
                      value={dayjs(dataRecord?.NgayCTu).format('DD/MM/YYYY')}
                      className="h-[24px] px-2 rounded-[4px] w-[115px] resize-none border-[1px] border-gray-300 outline-none text-center  "
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className="required min-w-[90px] text-sm flex justify-end">{typePage === 'SDV' ? 'Nhà C.Cấp' : 'Khách hàng'}</label>
                  <input
                    type="text"
                    value={`${dataRecord?.MaDoiTuong} - ${dataRecord?.TenDoiTuong}`}
                    className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                    disabled
                  />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className=" min-w-[90px] text-sm flex justify-end">Tên</label>
                  <input
                    type="text"
                    value={dataRecord?.TenDoiTuong || ''}
                    className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                    disabled
                  />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className=" min-w-[90px] text-sm flex justify-end">Địa chỉ</label>
                  <input
                    type="text"
                    value={dataRecord?.DiaChi || ''}
                    className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                    disabled
                  />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap  ">
                  <label className="required min-w-[90px] text-sm flex justify-end">Số tiền</label>
                  <input
                    type="text"
                    value={formatPrice(dataRecord?.SoTien, dataThongSo?.SOLESOTIEN)}
                    className="h-[24px] px-2 rounded-[4px] w-[20%] resize-none border-[1px] border-gray-300 outline-none text-end "
                    disabled
                  />
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className="min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                  <textarea
                    type="text"
                    value={dataRecord?.GhiChu}
                    className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none  truncate"
                    disabled
                  />
                </div>
                {/* thong tin */}
                <div className="grid grid-cols-1 mt-4 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                  <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                  <div className="flex justify-between ">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label className=" text-sm min-w-[64px] ">Người tạo</label>
                      <Tooltip title={dataRecord?.NguoiTao} color="blue">
                        <input
                          disabled
                          type="text"
                          value={dataRecord?.NguoiTao || ''}
                          className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                        />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label className=" text-sm">Lúc</label>
                      <Tooltip title={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                        <input
                          disabled
                          type="text"
                          value={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                          className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex justify-between text-end ">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label className=" text-sm min-w-[64px]">Sửa cuối</label>
                      <Tooltip title={dataRecord?.NguoiSuaCuoi} color="blue">
                        <input
                          disabled
                          type="text"
                          value={dataRecord?.NguoiSuaCuoi || ''}
                          className="h-[24px] w-[270px]  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                        />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <label className=" text-sm">Lúc</label>
                      <Tooltip
                        title={dataRecord?.NgaySuaCuoi && dayjs(dataRecord.NgaySuaCuoi).isValid() ? dayjs(dataRecord.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                        color="blue"
                      >
                        <input
                          disabled
                          type="text"
                          value={dataRecord?.NgaySuaCuoi && dayjs(dataRecord.NgaySuaCuoi).isValid() ? dayjs(dataRecord.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                          className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* button */}
        <div className="flex justify-end items-center pt-[10px] ">
          <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
        </div>
      </div>
    </div>
  )
}

export default ViewSDV
