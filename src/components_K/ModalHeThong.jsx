/* eslint-disable react/prop-types */
// import { useEffect, useState } from 'react'

import { DateField } from '@mui/x-date-pickers'
import logo from '../assets/VTS-iSale.ico'
// import icons from '../untils/icons'
import ActionButton from '../components/util/Button/ActionButton'
// import { DateField } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Checkbox, InputNumber, Select } from 'antd'
const { Option } = Select
// const { MdDelete } = icons
const ModalHeThong = ({ close }) => {
  return (
    <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="w-[90vw] h-[600px] ">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">Thông số hệ thống </label>
          </div>
          {/* content */}
          <div className=" flex h-[89%] gap-x-1  border-[2px] rounded-sm text-sm">
            {/* bán sỉ */}
            <div className="relative m-3 w-1/2  border-[2px] border-gray-300 rounded-md">
              <div className="absolute text-center p-1 font-medium top-[-15px] left-1 bg-white ">Các thông số áp dụng cho bán sỉ</div>
              <div className=" rounded-md  px-1 py-3">
                <div className="w-full flex flex-col p-2  gap-2">
                  <label className="font-medium pl-5">
                    Giới hạn cập nhật <hr />
                  </label>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="required w-[140px] text-end">Giới hạn</div>
                    <div className="w-full flex gap-2">
                      <Select
                        className="w-[60%]"
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        // onChange={(value) => (value)}
                        // value={selectedDoiTuong}
                        popupMatchSelectWidth={false}
                      >
                        <Option value="TYLE">Khoản ngày</Option>
                        <Option value="HANGSO">Sau ngày hiện hành</Option>
                        <Option value="A">Trước ngày hiện hành</Option>
                        <Option value="c">Trước và sau ngày hiện hành</Option>
                      </Select>
                      <InputNumber
                        className="w-[140px]"
                        size="small"
                        min={0}
                        max={999999}
                        // value={formAdjustPrice.GiaTri}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => {
                          const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                          return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(0))
                        }}
                        // onChange={(e) =>
                        //   setFormAdjustPrice({
                        //     ...formAdjustPrice,
                        //     GiaTri: e,
                        //   })
                        // }
                      />
                      <Select
                        className="w-[140px]"
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        // onChange={(value) => (value)}
                        // value={selectedDoiTuong}
                        popupMatchSelectWidth={false}
                      >
                        <Option value="Ngay">Ngày</Option>
                        <Option value="Tuan">Tuần</Option>
                        <Option value="tha">Tháng</Option>
                        <Option value="Q">Quý</Option>
                        <Option value="N">Năm</Option>
                      </Select>
                    </div>
                  </div>

                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Từ</div>
                    <div className="w-full flex gap-2">
                      <div className="flex w-[60%] justify-between">
                        <DateField
                          className="DatePicker_PMH max-w-[110px]"
                          format="DD/MM/YYYY"
                          defaultValue={dayjs()}
                          // onChange={(newDate) => {
                          //   setFormCreate({
                          //     ...formCreate,
                          //     NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                          //   })
                          // }}
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
                        <div className="flex gap-2 ">
                          <div className=" text-end">Đến</div>
                          <DateField
                            className="DatePicker_PMH max-w-[110px]"
                            format="DD/MM/YYYY"
                            defaultValue={dayjs()}
                            // onChange={(newDate) => {
                            //   setFormCreate({
                            //     ...formCreate,
                            //     NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                            //   })
                            // }}
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
                      </div>
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="w-full flex flex-col p-2  gap-2">
                  <label className="font-medium pl-5">
                    Các thông số khác <hr />
                  </label>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Kho mặc định</div>

                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      // onChange={(value) => (value)}
                      // value="c"
                      popupMatchSelectWidth={false}
                    >
                      <Option value="TYLE">Khoản ngày</Option>
                      <Option value="HANGSO">Sau ngày hiện hành</Option>
                      <Option value="A">Trước ngày hiện hành</Option>
                      <Option value="c">Trước và sau ngày hiện hành</Option>
                    </Select>
                  </div>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Khách hàng</div>

                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      // onChange={(value) => (value)}
                      // value="c"
                      popupMatchSelectWidth={false}
                    >
                      <Option value="TYLE">Khoản ngày</Option>
                      <Option value="HANGSO">Sau ngày hiện hành</Option>
                      <Option value="A">Trước ngày hiện hành</Option>
                      <Option value="c">Trước và sau ngày hiện hành</Option>
                    </Select>
                  </div>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Nhà C.Cấp</div>
                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      // onChange={(value) => (value)}
                      // value="c"
                      popupMatchSelectWidth={false}
                    >
                      <Option value="TYLE">Khoản ngày</Option>
                      <Option value="HANGSO">Sau ngày hiện hành</Option>
                      <Option value="A">Trước ngày hiện hành</Option>
                      <Option value="c">Trước và sau ngày hiện hành</Option>
                    </Select>
                  </div>
                  <div className="ml-32 flex flex-col  gap-2 ">
                    <Checkbox
                      value="checkbox1"
                      // checked={checkboxValues.checkbox1}
                    >
                      Tự động lấy giá bán lẻ nếu chưa có giá sỉ
                    </Checkbox>
                    <Checkbox
                      value="checkbox1"
                      // checked={checkboxValues.checkbox1}
                    >
                      Cho phép sửa giá bán
                    </Checkbox>
                    <Checkbox
                      value="checkbox1"
                      // checked={checkboxValues.checkbox1}
                    >
                      Hiện số dư công nợ trên phiếu bán sỉ
                    </Checkbox>
                    <Checkbox
                      value="checkbox1"
                      // checked={checkboxValues.checkbox1}
                    >
                      Đơn giá mua hàng sử dụng đơn giá mua gần nhất
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
            {/* quầy tính tiền */}
            <div className=" m-2 border w-1/2  rounded-sm text-sm"></div>
          </div>
          {/* button  */}
          <div className=" flex justify-end items-center">
            <div className="flex  items-center gap-3  pt-3">
              <ActionButton color={'slate-50'} title={'Lưu & đóng'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} isModal={true} />
              <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} isModal={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalHeThong
