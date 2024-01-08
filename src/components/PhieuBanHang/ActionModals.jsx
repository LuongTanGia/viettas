/* eslint-disable react/prop-types */
import Logo from '../../assets/VTS-iSale.ico'
import { FloatButton, Checkbox } from 'antd'
import { useEffect, useState } from 'react'
// import icons from '../../untils/icons'
import { chiTietPBS } from '../../redux/selector'
import './phieubanhang.css'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import TableEdit from '../util/Table/EditTable'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DANHSACHDOITUONG, DANHSACHKHOHANG, THEMPHIEUBANHANG, SUAPHIEUBANHANG, DANHSACHHANGHOA_PBS } from '../../action/Actions'
import API from '../../API/API'
import ListHelper_HangHoa from './ListHelper_HangHoa'
import { toast } from 'react-toastify'
import { Select } from 'antd'
import ActionButton from '../util/Button/ActionButton'
import { nameColumsPhieuBanHangChiTiet } from '../util/Table/ColumnName'
import { IoMdAddCircle } from 'react-icons/io'

const { Option } = Select

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
function ActionModals({ isShow, handleClose, dataRecord, typeAction, setMaHang }) {
  // yourMaHangOptions, yourTenHangOptions
  // const [yourMaHangOptions, setYourMaHangOptions] = useState([])
  // const [yourTenHangOptions, setYourTenHangOptions] = useState([])

  const token = window.localStorage.getItem('TKN')
  const [isModalOpen, setIsModalOpen] = useState(isShow)
  const [Dates, setDates] = useState({ NgayCTu: dayjs(new Date()), DaoHan: dayjs(new Date()) })
  const [form, setForm] = useState()
  const [listDoiTuong, setListDoiTuong] = useState([])
  const [listKhoHang, setListKhoHang] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [dataChitiet, setDataChitiet] = useState([])
  const [dataListHP, setDataListHP] = useState([])

  const data_chitiet = useSelector(chiTietPBS)

  useEffect(() => {
    typeAction === 'edit' || typeAction === 'view' ? setForm(data_chitiet.DataResult) : setForm({ ...initState, ...Dates })
    setDataChitiet(form?.DataDetails)
    const loadData = async () => {
      try {
        const result_listHp = typeAction !== '' ? await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, form) : null
        const result_doituong = await DANHSACHDOITUONG(API.DANHSACHDOITUONG_PBS, token)
        const result_khohang = await DANHSACHKHOHANG(API.DANHSACHKHOHANG_PBS, token)
        setDataListHP(result_listHp)
        // setSelectDataOption(result_listHp)
        setListDoiTuong(result_doituong)
        setListKhoHang(result_khohang)
        setIsModalOpen(isShow)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    loadData()

    const handleKeyDown = (event) => {
      if (event.key === 'F9') {
        setShowPopup(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShow, dataRecord, token, form?.DataDetails])

  // const setSelectDataOption = (data) => {
  //   setYourMaHangOptions(data)
  //   setYourTenHangOptions(data)
  // }
  const handleClosePopup = () => {
    setShowPopup(false)
  }
  const handleShowPopup = () => {
    setShowPopup(true)
  }
  // Action Sửa
  const handleChangeInput_other = (e) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
  }
  const handleChangeInput = async (value) => {
    const [MaDoiTuong, TenDoiTuong, DiaChi] = value.split(' - ')
    setForm({ ...form, MaDoiTuong, TenDoiTuong, DiaChi })
    const result_listHp = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, form)
    setDataListHP(result_listHp)
    // setSelectDataOption(result_listHp)
  }
  const handleChangeInput_kho = async (value) => {
    setForm({ ...form, MaKho: value })
    const result_listHp = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, form)
    setDataListHP(result_listHp)
    // setSelectDataOption(result_listHp)
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
      const data = { ...form, ...Dates, DataDetails: dataChitiet }
      const res = await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)
      console.log(res)
      setMaHang(res[0]?.SoChungTu)
      if (res[0]?.SoChungTu) {
        setForm(initState)
        setDataChitiet([])
      }
    } else if (typeAction === 'edit') {
      const data = { ...form, DataDetails: dataChitiet }
      const res = await SUAPHIEUBANHANG(API.SUAPHIEUBANHANG, token, { SoChungTu: data.SoChungTu, Data: data })

      setMaHang(data.SoChungTu)
      if (res.DataError === 0) {
        console.log('sua')
      }
    }
  }
  const handleSubmitAndClose = async () => {
    if (typeAction === 'create') {
      const data = { ...form, ...Dates, DataDetails: dataChitiet }
      const res = await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)
      console.log(res)
      setMaHang(res[0]?.SoChungTu)
      if (res[0]?.SoChungTu) {
        handleClose()
      }
    } else if (typeAction === 'edit') {
      const data = { ...form, DataDetails: dataChitiet }
      const res = await SUAPHIEUBANHANG(API.SUAPHIEUBANHANG, token, { SoChungTu: data.SoChungTu, Data: data })

      setMaHang(data.SoChungTu)
      if (res.DataError === 0) {
        handleClose()
      }
    }
  }

  return (
    <>
      {isModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10 ">
          <div className="m-6 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
            <div className=" w-[90vw] h-[600px] ">
              <div className="flex gap-2">
                <img src={Logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 uppercase font-semibold">{`${typeAction === 'view' ? 'Thông Tin' : typeAction === 'edit' ? 'Sửa' : 'Thêm'} - Phiếu Bán Hàng`}</p>
              </div>
              <div className=" w-full h-[90%] rounded-sm text-sm border border-gray-300">
                <div className={`flex box_thongtin ${typeAction == 'create' ? 'create' : typeAction == 'edit' ? 'edit' : ''}`}>
                  {/* thong tin phieu */}
                  <div className="w-[60%] box_content_left">
                    <div className="flex p-1 gap-12 w-full justify-between">
                      <div className=" flex items-center ">
                        <label className="w-[86px]">Số chứng từ</label>
                        <input disabled type="text" className=" outline-none px-2 sochungtu" value={form?.SoChungTu} readOnly />
                      </div>
                      <div className="flex justify-center items-center">
                        {typeAction === 'create' ? (
                          <>
                            <Checkbox
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  TTTienMat: e.target.checked ? true : false,
                                })
                              }
                            >
                              Lập phiếu thu
                            </Checkbox>
                            {/* <label className="mr-2 ml-2">Lập phiếu thu</label>
                            <input
                              type="checkbox"
                              className="outline-none px-2 "
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  TTTienMat: e.target.checked ? true : false,
                                })
                              }
                            /> */}
                          </>
                        ) : null}
                      </div>
                      <div className="flex gap-2 max-h-[100px]">
                        <div className="flex items-center max-h-[100px]">
                          <label htmlFor="" className="w-[86px]">
                            Ngày C.Từ
                          </label>
                          <DatePicker
                            className="DatePicker_PMH max-h-[100px]"
                            format="DD/MM/YYYY"
                            defaultValue={typeAction === 'create' ? Dates.NgayCTu : dayjs(form?.NgayCTu)}
                            onChange={(newDate) => {
                              setDates({
                                ...Dates,
                                NgayCTu: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                              })
                            }}
                          />
                        </div>
                        {/* <div className="flex gap-x-2 items-center max-h-[100px]">
                          <label htmlFor="" className="w-[86px]">
                            Ngày Đ.Hạn
                          </label>
                          <DatePicker
                            className="DatePicker_PMH max-h-[100px]"
                            format="DD/MM/YYYY"
                            defaultValue={typeAction === 'create' ? Dates.DaoHan : dayjs(form.DaoHan)}
                            onChange={(newDate) => {
                              setDates({
                                ...Dates,
                                DaoHan: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                              })
                            }}
                          />
                        </div> */}
                      </div>
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
                        disabled
                      />
                    </div>
                    <div className="flex items-center p-1 justify-start">
                      <label className="w-[86px]">Địa chỉ</label>
                      <input
                        type="text"
                        className="w-[90%] outline-none px-2"
                        value={form?.DiaChi}
                        name="DiaChi"
                        readOnly={typeAction === 'view' || typeAction === 'edit' ? true : false}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                    <div className="flex items-center p-1 justify-between ">
                      <div className="flex  items-center w-[45%] ">
                        <label form="khohang" className="w-[86px]">
                          Kho hàng
                        </label>

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
                      <div className="flex items-center  w-[45%]">
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
                          <input readOnly type="text" className="w-[170px]   outline-none px-2 text-center" value={dayjs(form?.NgayTao).format('DD/MM/YYYY hh:mm:ss')} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center flex-wrap">
                        <div className="flex items-center p-1  flex-wrap justify-between">
                          <label className="">Sửa cuối</label>
                          <input readOnly type="text" className="w-[170px]    outline-none px-2 " value={form?.NguoiSuaCuoi} />
                        </div>
                        <div className="flex items-center p-1 w-1/2 justify-between">
                          <label className="">Lúc</label>
                          <input
                            readOnly
                            type="text"
                            className="w-[170px] outline-none px-2  text-center"
                            value={dayjs(form?.NgaySuaCuoi || new Date()).format('DD/MM/YYYY hh:mm:ss')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" pb-0  relative">
                  <FloatButton
                    className="z-3 absolute w-[30px] h-[30px] "
                    style={{
                      right: 5,
                      top: 4,
                    }}
                    type="primary"
                    icon={<IoMdAddCircle />}
                    onClick={handleShowPopup}
                    tooltip={<div>Bấm vào đây để thêm hàng hoặc F9 để chọn từ danh sách !</div>}
                  />
                  {data_chitiet ? (
                    <TableEdit
                      listHP={dataListHP}
                      typeTable={'create'}
                      param={dataChitiet}
                      columName={nameColumsPhieuBanHangChiTiet}
                      handleEditData={handleEditData}
                      yourMaHangOptions={dataListHP}
                      yourTenHangOptions={dataListHP}
                      ColumnTable={['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong', 'DonGia', 'TienHang', 'TyLeThue', 'TienThue', 'ThanhTien', 'TyLeCKTT', 'TienCKTT', 'TongCong']}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              {showPopup && form.MaDoiTuong !== '' && form.MaKho !== '' ? (
                <ListHelper_HangHoa
                  data={form.MaDoiTuong !== '' && form.MaKho !== '' ? dataListHP : []}
                  isShowList={showPopup}
                  close={handleClosePopup}
                  handleAddData={handleAddData}
                />
              ) : null}
            </div>
            <div className=" w-full flex justify-end  gap-2 ">
              {typeAction === 'edit' || typeAction === 'view' ? null : (
                <ActionButton color={'slate-50'} background={'blue-500'} bg_hover={'white'} color_hover={'blue-500'} title={'Lưu'} handleAction={handleSubmit} />
              )}
              {typeAction === 'view' ? null : (
                <ActionButton color={'slate-50'} background={'blue-500'} bg_hover={'white'} color_hover={'blue-500'} title={'Lưu & Đóng'} handleAction={handleSubmitAndClose} />
              )}
              <ActionButton color={'slate-50'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} title={'Đóng'} handleAction={handleClose} />
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
