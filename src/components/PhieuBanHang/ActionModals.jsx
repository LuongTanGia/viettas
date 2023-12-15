/* eslint-disable react/prop-types */
import { FcCancel } from 'react-icons/fc'
import { FcOk } from 'react-icons/fc'
import { useEffect, useState } from 'react'
import icons from '../../untils/icons'
import { chiTietPBS } from '../../redux/selector'
import './phieumuahang.css'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import Tables from '../util/Table/Table'
import { DatePicker, Space } from 'antd'
import { DANHSACHDOITUONG, DANHSACHKHOHANG } from '../../action/Actions'
import API from '../../API/API'
import ListHelper_HangHoa from './ListHelper_HangHoa'
import { toast } from 'react-toastify'

const { IoMdClose } = icons
const { RangePicker } = DatePicker

const initState = {
  NgayCTu: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
  DaoHan: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
  MaDoiTuong: '',
  TenDoiTuong: '',
  DiaChi: '',
  MaSoThue: '',
  MaKho: '',
  TTTienMat: true,
  GhiChu: '',
  DataDetails: [],
  SoChungTu: '',
}

// eslint-disable-next-line react/prop-types
function ActionModals({ isShow, handleClose, dataRecord, typeAction }) {
  const token = window.localStorage.getItem('TKN')
  const [isModalOpen, setIsModalOpen] = useState(isShow)
  const [Date, setDate] = useState({ NgayCTu: '', DaoHan: '' })
  const [form, setForm] = useState()
  const [listDoiTuong, setListDoiTuong] = useState([])
  const [listKhoHang, setListKhoHang] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const data_chitiet = useSelector(chiTietPBS)
  console.log(data_chitiet.DataResult)
  useEffect(() => {
    typeAction === 'edit' || typeAction === 'view' ? setForm(data_chitiet.DataResult) : setForm(initState)
    setIsModalOpen(isShow)

    const loadData = async () => {
      try {
        const result_doituong = await DANHSACHDOITUONG(API.DANHSACHDOITUONG_PBS, token)
        const result_khohang = await DANHSACHKHOHANG(API.DANHSACHKHOHANG_PBS, token)
        setListDoiTuong(result_doituong)
        setListKhoHang(result_khohang)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    loadData()

    //showList hàng hóa
    const handleKeyDown = (event) => {
      if (event.key === 'F9') {
        setShowPopup(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      // window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShow, dataRecord, token])

  const dateFormat = 'YYYY/MM/DD'

  const handleClosePopup = () => {
    setShowPopup(false)
    console.log('he')
  }
  // Action Sửa
  const handleChangeInput = (e) => {
    const { name, value } = e.target
    const [MaDoiTuong, TenDoiTuong, DiaChi] = value.split(' - ')
    setForm({ ...form, [name]: value, MaDoiTuong, TenDoiTuong, DiaChi })
  }
  const handleChangeInput_kho = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }
  const onChange = (time, timeString) => {
    setDate({ ...Date, NgayCTu: timeString[0], DaoHan: timeString[1] })
  }
  const handleAddData = (record) => {
    const isMaHangExists = form.DataDetails.some((item) => item.MaHang === record.MaHang)

    if (isMaHangExists) {
      toast.warn('Đã tồn tại mã hàng trong chi tiết !!')
    } else {
      setForm({ ...form, DataDetails: [...form.DataDetails, record] })
      toast.success('Thêm thành công !')
    }
  }
  return (
    <>
      {isModalOpen ? (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
            <div className="m-6 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
              <div className=" w-[90vw] h-[600px] ">
                <div className="flex justify-between  items-start pb-1">
                  <label className="font-bold ">Xem thông tin - phiếu mua hàng</label>
                  <button onClick={() => handleClose()} className="text-gray-500 p-1  hover: hover:bg-red-600 hover:text-white rounded-full">
                    <IoMdClose />
                  </button>
                </div>
                <div className=" w-full h-[96%] rounded-sm text-sm border border-gray-300">
                  <div className={`flex box_thongtin ${typeAction == 'create' ? 'create' : ''}`}>
                    {/* thong tin phieu */}
                    <div className="w-[60%] box_content_left">
                      <div className="flex p-1 gap-12 w-full justify-between">
                        <div className=" flex items-center ">
                          <label className="w-[86px]">Số chứng từ</label>
                          <input type="text" className=" outline-none px-2 sochungtu" value={form?.SoChungTu} readOnly />
                        </div>
                        <Space direction="vertical" size={12}>
                          <RangePicker
                            className={typeAction === 'edit' ? 'date_edit' : ''}
                            style={
                              typeAction === 'edit'
                                ? {
                                    background: 'white',
                                  }
                                : {}
                            }
                            disabled={typeAction === 'view' ? true : false}
                            size="large"
                            format="DD/MM/YYYY"
                            defaultValue={data_chitiet ? [dayjs(form?.NgayCTu, dateFormat), dayjs(form?.DaoHan, dateFormat)] : []}
                            onChange={onChange}
                          />
                        </Space>
                      </div>
                      <div className="p-1 flex jjustify-start items-center">
                        <label form="doituong" className="w-[86px]">
                          Đối tượng
                        </label>
                        <select
                          className="w-[90%] outline-none"
                          value={`${form?.MaDoiTuong} - ${form?.TenDoiTuong} - ${form?.DiaChi}`}
                          disabled={typeAction === 'view' || typeAction === 'edit'}
                          onChange={handleChangeInput}
                        >
                          {listDoiTuong?.map((item, index) => (
                            <option value={`${item.Ma} - ${item.Ten} - ${item.DiaChi}`} key={index}>
                              {item?.Ma} {item?.Ten}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center justify-start p-1">
                        <label className="w-[86px]">Tên</label>
                        <input
                          type="text"
                          className="w-[90%]   outline-none px-2 "
                          value={form?.TenDoiTuong}
                          name="TenDoiTuong"
                          readOnly={typeAction === 'view' || typeAction === 'edit' ? true : false}
                          onChange={handleChangeInput}
                        />
                      </div>
                      <div className="flex items-center p-1 justify-start">
                        <label className="w-[86px]">Địa chỉ</label>
                        <input
                          type="text"
                          className="w-[75%] outline-none px-2"
                          value={form?.DiaChi}
                          name="DiaChi"
                          readOnly={typeAction === 'view' || typeAction === 'edit' ? true : false}
                          onChange={handleChangeInput}
                        />
                        {typeAction === 'create' ? (
                          <>
                            <label className="mr-2 ml-2">Lập phiếu thu</label>
                            <input type="checkbox" className="outline-none px-2 " />
                          </>
                        ) : null}
                      </div>
                      <div className="flex items-center p-1 justify-between">
                        <div className="flex  items-center w-[45%] ">
                          <label form="khohang" className="w-[86px]">
                            Kho hàng
                          </label>
                          <select
                            className={`w-[70%] hover:-gray-500  ${typeAction === 'edit' ? 'bg-white' : ''}`}
                            readOnly={typeAction === 'view' ? true : false}
                            onChange={handleChangeInput_kho}
                            value={form?.MaKho}
                            name="MaKho"
                          >
                            {listKhoHang.map((item, index) => (
                              <option value={item.MaKho} key={index}>
                                {item?.MaKho} {item?.TenKho}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center p-1 w-[45%]">
                          <label className="w-[86px]">Ghi chú</label>
                          <input
                            type="text"
                            name="GhiChu"
                            className={`w-full   outline-none px-2 ${typeAction === 'edit' ? 'bg-white' : ''}`}
                            value={form?.GhiChu}
                            readOnly={typeAction === 'view' ? true : false}
                            onChange={handleChangeInput}
                          />
                        </div>
                      </div>
                    </div>
                    {/* thong tin cap nhat */}
                    <div className="w-[40%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className="-2 rounded-md w-[98%] h-[80%] box_capnhat">
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="">Người tạo</label>
                            <input type="text" className="   outline-none px-2" value={form?.NguoiTao} readOnly />
                          </div>
                          <div className="flex items-center p-1 w-1/2">
                            <label className="">Lúc</label>
                            <input readOnly type="text" className="w-full   outline-none px-2 " value={form?.NgayTao} />
                          </div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="">Sửa cuối</label>
                            <input readOnly type="text" className="   outline-none px-2 " value={form?.NguoiSuaCuoi} />
                          </div>
                          <div className="flex items-center p-1 w-1/2">
                            <label className="">Lúc</label>
                            <input readOnly type="text" className="w-full   outline-none px-2 " value={form?.NgaySuaCuoi} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pb-0">{data_chitiet ? <Tables param={form?.DataDetails} columName={''} height={'h150'} typeTable={'edit'} /> : null}</div>
                  <div className="pr-4 w-full flex justify-end mt-2">
                    <button
                      className=" hover:bg-rose-400 border-1 border-rose-500 p-2  rounded-md text-rose-700 hover:text-white font-medium float-right flex justify-center items-center
            mb-2"
                      onClick={() => handleClose()}
                    >
                      <FcCancel className="mt-1" />
                      <p className="ml-2">Hủy</p>
                    </button>
                    <button
                      className=" hover:bg-green-400 border-1 border-green-500  p-2  rounded-md text-green-400 hover:text-white font-medium float-right flex justify-center items-center
            mb-2 ml-4"
                    >
                      <FcOk />
                      <p className="ml-2">Xác Nhận</p>
                    </button>
                  </div>
                </div>
              </div>
              <div>{showPopup && <ListHelper_HangHoa data={form} isShowList={showPopup} close={handleClosePopup} handleAddData={handleAddData} />}</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ActionModals
