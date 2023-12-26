/* eslint-disable react/prop-types */
import { FcCancel } from 'react-icons/fc'
import { FcOk } from 'react-icons/fc'
import { useEffect, useState } from 'react'
import icons from '../../untils/icons'
import { chiTietPBS } from '../../redux/selector'
import './phieubanhang.css'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import TableEdit from '../util/Table/EditTable'
import { DatePicker, Space } from 'antd'
import { DANHSACHDOITUONG, DANHSACHKHOHANG, THEMPHIEUBANHANG, SUAPHIEUBANHANG } from '../../action/Actions'
import API from '../../API/API'
import ListHelper_HangHoa from './ListHelper_HangHoa'
import { toast } from 'react-toastify'
import { Select } from 'antd'

const { Option } = Select
const { IoMdClose } = icons
const { RangePicker } = DatePicker

const initState = {
  NgayCTu: '',
  DaoHan: '',
  MaDoiTuong: '',
  TenDoiTuong: '',
  DiaChi: '',
  MaSoThue: '',
  MaKho: '',
  TTTienMat: false,
  GhiChu: '',
  DataDetails: [],
  SoChungTu: '',
}

// eslint-disable-next-line react/prop-types
function ActionModals({ isShow, handleClose, dataRecord, typeAction }) {
  // yourMaHangOptions, yourTenHangOptions
  const [yourMaHangOptions, setYourMaHangOptions] = useState([])
  const [yourTenHangOptions, setYourTenHangOptions] = useState([])

  const token = window.localStorage.getItem('TKN')
  const [isModalOpen, setIsModalOpen] = useState(isShow)
  const [Dates, setDates] = useState({ NgayCTu: dayjs(new Date()), DaoHan: dayjs(new Date()) })
  const [form, setForm] = useState()
  const [listDoiTuong, setListDoiTuong] = useState([])
  const [listKhoHang, setListKhoHang] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [dataChitiet, setDataChitiet] = useState([])
  const data_chitiet = useSelector(chiTietPBS)

  console.log(Dates)
  useEffect(() => {
    typeAction === 'edit' || typeAction === 'view' ? setForm(data_chitiet.DataResult) : setForm({ ...initState, ...Dates })
    setDataChitiet(form?.DataDetails)
    const loadData = async () => {
      try {
        const result_doituong = await DANHSACHDOITUONG(API.DANHSACHDOITUONG_PBS, token)
        const result_khohang = await DANHSACHKHOHANG(API.DANHSACHKHOHANG_PBS, token)
        setListDoiTuong(result_doituong)
        setListKhoHang(result_khohang)
        setIsModalOpen(isShow)
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
  }, [isShow, dataRecord, token, form?.DataDetails])
  console.log(form, 'Action Form')
  const setSelectDataOption = (data) => {
    setYourMaHangOptions(data)
    setYourTenHangOptions(data)
  }
  const handleClosePopup = () => {
    setShowPopup(false)
  }
  // Action Sửa
  const handleChangeInput_other = (e) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
  }
  const handleChangeInput = (value) => {
    const [MaDoiTuong, TenDoiTuong, DiaChi] = value.split(' - ')
    setForm({ ...form, MaDoiTuong, TenDoiTuong, DiaChi })
  }
  const handleChangeInput_kho = (value) => {
    setForm({ ...form, MaKho: value })
  }
  const onChange = (time, timeString) => {
    setDates({ ...Dates, NgayCTu: timeString[0], DaoHan: timeString[1] })
  }
  const handleAddData = (record) => {
    const isMaHangExists = dataChitiet.some((item) => item.MaHang === record.MaHang)

    if (isMaHangExists) {
      toast.warn('Đã tồn tại mã hàng trong chi tiết !!')
    } else {
      setDataChitiet([...dataChitiet, record])
      toast.success('Thêm thành công !')
    }
  }
  const handleEditData = (data) => {
    setDataChitiet(data)
  }
  const handleSubmit = async () => {
    if (typeAction === 'create') {
      console.log('create', dataChitiet)
      const data = { ...form, ...Dates, DataDetails: dataChitiet }
      await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)
      console.log(data)
    } else if (typeAction === 'edit') {
      console.log('edit', dataChitiet)
      const data = { ...form, DataDetails: dataChitiet }
      await SUAPHIEUBANHANG(API.SUAPHIEUBANHANG, token, { SoChungTu: data.SoChungTu, Data: data })
      console.log(data)
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
                  <div className={`flex box_thongtin ${typeAction == 'create' ? 'create' : typeAction == 'edit' ? 'edit' : ''}`}>
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
                            format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                            defaultValue={data_chitiet ? [dayjs(form?.NgayCTu), dayjs(form?.DaoHan)] : []}
                            onChange={onChange}
                          />
                        </Space>
                      </div>
                      <div className="p-1 flex jjustify-start items-center">
                        <label form="doituong" className="w-[86px]">
                          Đối tượng
                        </label>
                        <Select
                          className="w-[90%] outline-none"
                          value={`${form?.MaDoiTuong} - ${form?.TenDoiTuong} - ${form?.DiaChi}`}
                          disabled={typeAction === 'view' || typeAction === 'edit'}
                          onChange={handleChangeInput}
                          showSearch
                        >
                          {listDoiTuong?.map((item, index) => (
                            <Option value={`${item.Ma} - ${item.Ten} - ${item.DiaChi}`} key={index}>
                              {item?.Ma} {item?.Ten}
                            </Option>
                          ))}
                        </Select>
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
                      <div className="flex items-center p-1 justify-between ">
                        <div className="flex  items-center w-[45%] ">
                          <label form="khohang" className="w-[86px]">
                            Kho hàng
                          </label>
                          {/* <select
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
                          </select> */}
                          <Select
                            className={`w-[70%] hover:-gray-500  ${typeAction === 'edit' ? 'bg-white' : ''} bg-white`}
                            style={{ borderRadius: 6 }}
                            readOnly={typeAction === 'view' ? true : false}
                            onChange={handleChangeInput_kho}
                            value={form?.MaKho}
                            name="MaKho"
                            showSearch
                            disabled={typeAction === 'view' ? true : false}
                          >
                            {listKhoHang?.map((item, index) => (
                              <Option value={item.MaKho} key={index}>
                                {item?.MaKho} {item?.TenKho}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center p-1 w-[45%]">
                          <label className="w-[86px]">Ghi chú</label>
                          <input
                            type="text"
                            name="GhiChu"
                            className={`w-full   outline-none px-2 ${typeAction === 'edit' ? 'bg-white' : ''}`}
                            value={form?.GhiChu}
                            readOnly={typeAction === 'view' ? true : false}
                            onChange={handleChangeInput_other}
                          />
                        </div>
                      </div>
                    </div>
                    {/* thong tin cap nhat */}
                    <div className="w-[40%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className="-2 rounded-md w-[98%] h-[80%] box_capnhat overflow-hidden ">
                        <div className="flex justify-between items-center flex-wrap mt-3 ">
                          <div className="flex items-center p-1  justify-between">
                            <label className="">Người tạo</label>
                            <input type="text" className="w-[170px]    outline-none px-2" value={form?.NguoiTao} readOnly />
                          </div>
                          <div className="flex items-center p-1 w-1/2 flex-wrapjustify-between">
                            <label className="">Lúc</label>
                            <input readOnly type="text" className="w-[170px]   outline-none px-2 " value={form?.NgayTao} />
                          </div>
                        </div>
                        <div className="flex justify-between items-center flex-wrap">
                          <div className="flex items-center p-1  flex-wrap justify-between">
                            <label className="">Sửa cuối</label>
                            <input readOnly type="text" className="w-[170px]    outline-none px-2 " value={form?.NguoiSuaCuoi} />
                          </div>
                          <div className="flex items-center p-1 w-1/2 justify-between">
                            <label className="">Lúc</label>
                            <input readOnly type="text" className="w-[170px] outline-none px-2 " value={form?.NgaySuaCuoi} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pb-0">
                    {data_chitiet ? (
                      <TableEdit param={dataChitiet} handleEditData={handleEditData} yourMaHangOptions={yourMaHangOptions} yourTenHangOptions={yourTenHangOptions} />
                    ) : null}
                  </div>
                  <div className="pr-4 w-full flex justify-end mt-2">
                    <button
                      className=" hover:bg-rose-400 border-1 border-rose-500 p-2  rounded-md text-rose-700 hover:text-white font-medium float-right flex justify-center items-center
            mb-2"
                      onClick={() => handleClose()}
                    >
                      <FcCancel className="mt-1" />
                      <p className="ml-2">Đóng</p>
                    </button>
                    <button
                      className=" hover:bg-green-400 border-1 border-green-500  p-2  rounded-md text-green-400 hover:text-white font-medium float-right flex justify-center items-center
            mb-2 ml-4"
                      onClick={handleSubmit}
                    >
                      <FcOk />
                      <p className="ml-2">Xác Nhận</p>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {showPopup && (
                  <ListHelper_HangHoa data={form} isShowList={showPopup} close={handleClosePopup} handleAddData={handleAddData} setSelectDataOption={setSelectDataOption} />
                )}
              </div>
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
