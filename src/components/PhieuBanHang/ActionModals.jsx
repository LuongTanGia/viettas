/* eslint-disable react/prop-types */
import Logo from '../../assets/VTS-iSale.ico'
import { FloatButton, Checkbox } from 'antd'
import { useEffect, useState } from 'react'
// import icons from '../../untils/icons'
import { chiTietPBS } from '../../redux/selector'
import './phieubanhang.css'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import TableEdit from '../util/Table/EditTable'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'

import { DANHSACHDOITUONG, DANHSACHKHOHANG, THEMPHIEUBANHANG, SUAPHIEUBANHANG, DANHSACHHANGHOA_PBS, THONGTINPHIEU } from '../../action/Actions'
import API from '../../API/API'
import ListHelper_HangHoa from './ListHelper_HangHoa'
import { toast } from 'react-toastify'
import { Select } from 'antd'
import ActionButton from '../util/Button/ActionButton'
import { nameColumsPhieuBanHangChiTiet } from '../util/Table/ColumnName'
import { IoMdAddCircle } from 'react-icons/io'
import { MdPrint } from 'react-icons/md'

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
function ActionModals({ isShow, handleClose, dataRecord, typeAction, setMaHang, handleShowPrint_action, handleShowPrint_kho_action }) {
  // yourMaHangOptions, yourTenHangOptions
  // const [yourMaHangOptions, setYourMaHangOptions] = useState([])
  // const [yourTenHangOptions, setYourTenHangOptions] = useState([])
  const dispatch = useDispatch()

  const token = window.localStorage.getItem('TKN')
  const [isModalOpen, setIsModalOpen] = useState(isShow)
  const [Dates, setDates] = useState({ NgayCTu: dayjs(new Date()), DaoHan: dayjs(new Date()) })
  const [form, setForm] = useState()
  const [listDoiTuong, setListDoiTuong] = useState([])
  const [listKhoHang, setListKhoHang] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  // const [loadingTable, setloadingTable] = useState(false)

  const [dataChitiet, setDataChitiet] = useState([])
  const [dataListHP, setDataListHP] = useState([])

  const data_chitiet = useSelector(chiTietPBS)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result_listHp = isShow ? await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, form) : null
        const result_doituong = isShow ? await DANHSACHDOITUONG(API.DANHSACHDOITUONG_PBS, token) : null
        const result_khohang = isShow ? await DANHSACHKHOHANG(API.DANHSACHKHOHANG_PBS, token) : null
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
  }, [isShow])
  useEffect(() => {
    typeAction === 'edit' || typeAction === 'view' ? setForm(data_chitiet.DataResult) : setForm({ ...initState, ...Dates })
    setDataChitiet(form?.DataDetails)
  }, [dataRecord, form?.DataDetails])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F9') {
        if (form?.MaDoiTuong !== '' && form?.MaKho !== '') {
          setShowPopup(true)
        } else {
          toast.info('Nhập đối tượng mua hàng !')
        }
        console.log(form)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [form])

  // const setSelectDataOption = (data) => {
  //   setYourMaHangOptions(data)
  //   setYourTenHangOptions(data)
  // }
  const handleClosePopup = () => {
    setShowPopup(false)
  }
  // const handleShowPopup = () => {
  //   setShowPopup(true)
  // }
  // Action Sửa
  const handleChangeInput_other = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }
  const handleChangeInput = async (value) => {
    const [MaDoiTuong, TenDoiTuong, DiaChi] = value.split(' - ')
    setForm({ ...form, MaDoiTuong, TenDoiTuong, DiaChi })

    const result_listHp = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, { ...form, MaDoiTuong, TenDoiTuong, DiaChi })
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
      const newData = dataChitiet.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      const data = { ...form, ...Dates, DataDetails: newData }
      const res = await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)

      setMaHang(res[0]?.SoChungTu)
      if (res[0]?.SoChungTu) {
        setForm(initState)
        setDataChitiet([])
      }
    } else if (typeAction === 'edit') {
      const newData = dataChitiet.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      const data = { ...form, DataDetails: newData }
      const res = await SUAPHIEUBANHANG(API.SUAPHIEUBANHANG, token, { SoChungTu: data.SoChungTu, Data: data })
      setMaHang(data.SoChungTu)
      if (res.DataError === 0) {
        console.log('sua')
      }
    }
  }
  const handleSubmitAndClose = async () => {
    if (typeAction === 'create') {
      const newData = dataChitiet.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      const data = { ...form, ...Dates, DataDetails: newData }
      const res = await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)
      console.log(res)
      setMaHang(res[0]?.SoChungTu)
      if (res[0]?.SoChungTu) {
        handleClose()
      }
    } else if (typeAction === 'edit') {
      const newData = dataChitiet.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      const data = { ...form, DataDetails: newData }
      const res = await SUAPHIEUBANHANG(API.SUAPHIEUBANHANG, token, { SoChungTu: data.SoChungTu, Data: data })
      console.log(data)
      setMaHang(data.SoChungTu)
      if (res.DataError === 0) {
        handleClose()
      }
    }
  }
  const Print = async () => {
    if (typeAction === 'view') {
      handleShowPrint_action(form?.NgayCTu, form?.SoChungTu)
    } else {
      handleSubmit()
      handleShowPrint_action(form?.NgayCTu, form?.SoChungTu)

      const x = await THONGTINPHIEU(API.CHITIETPBS, token, form?.SoChungTu, dispatch)
      setForm(x.DataResult)
    }
  }

  const Print_kho = async () => {
    if (typeAction === 'view') {
      handleShowPrint_kho_action(form?.NgayCTu, form?.SoChungTu)
    } else {
      handleSubmit()

      handleShowPrint_kho_action(form?.NgayCTu, form?.SoChungTu)

      const x = await THONGTINPHIEU(API.CHITIETPBS, token, form?.SoChungTu, dispatch)
      setForm(x.DataResult)
    }
  }
  const addRecord = () => {
    setDataChitiet([
      ...dataChitiet,
      {
        DonGia: 0,
        GiaBan: 0,

        MaHang: 'Chọn mã',

        SoLuong: 1,

        TenHang: 'Chọn tên',
        ThanhTien: 0,
        TienCKTT: 0,
        TienHang: 0,
        TienThue: 0,

        TongCong: 133000,
        TyLeCKTT: 0,
        TyLeThue: 0,
        key: dataListHP.length + dataChitiet.length,
      },
    ])
    console.log(dataChitiet)
  }

  return (
    <>
      {isModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10 ">
          <div className=" p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
            <div className=" w-[90vw] h-[600px] ">
              <div className="flex gap-2">
                <img src={Logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 uppercase font-semibold">{`${typeAction === 'view' ? 'Thông Tin' : typeAction === 'edit' ? 'Sửa' : 'Thêm'} - Phiếu Bán Hàng`}</p>
              </div>
              <div className=" w-full h-[90%] rounded-sm text-sm border border-gray-300">
                <div className={`flex  md:gap-0 lg:gap-1 pl-1 box_thongtin ${typeAction == 'create' ? 'create' : typeAction == 'edit' ? 'edit' : ''}`}>
                  {/* thong tin phieu */}
                  <div className="w-[62%]">
                    <div className="flex p-1">
                      <div className=" flex items-center  ">
                        <label className="md:w-[114px] lg:w-[110px]  pr-1">Số C.từ</label>
                        <input readOnly type="text" value={form?.SoChungTu} className=" w-full border border-gray-300 outline-none  px-2   bg-[#fafafa] rounded-[4px] h-[24px]" />
                      </div>
                      <div className="flex justify-center items-center"></div>

                      <div className="flex  md:px-1 lg:px-4 items-center ">
                        <label htmlFor="" className="pr-1 lg:pr-[30px] lg:pl-[8px]">
                          Ngày
                        </label>
                        <DateField
                          className="DatePicker_PMH max-h-[100px]"
                          format="DD/MM/YYYY"
                          defaultValue={typeAction === 'create' ? Dates.NgayCTu : dayjs(form?.NgayCTu)}
                          onChange={(newDate) => {
                            setDates({
                              ...Dates,
                              NgayCTu: dayjs(newDate).format('YYYY-MM-DD'),
                            })
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                          }}
                        />
                      </div>
                      {typeAction === 'create' ? (
                        <div className="flex items-center w-[200px]">
                          <Checkbox
                            className=" w-full"
                            onChange={(e) =>
                              setForm({
                                ...form,
                                TTTienMat: e.target.checked ? true : false,
                              })
                            }
                          >
                            Tiền Mặt
                          </Checkbox>
                        </div>
                      ) : null}
                    </div>
                    <div className="p-1 flex ">
                      <label form="doituong" className="w-[86px]">
                        Đối tượng
                      </label>
                      <Select
                        className="w-full outline-none"
                        value={`${form?.MaDoiTuong} - ${form?.TenDoiTuong} - ${form?.DiaChi}`}
                        disabled={typeAction === 'view'}
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
                    <div className="flex items-center  p-1">
                      <label className="w-[86px]">Tên</label>
                      <input
                        type="text"
                        className="w-full   outline-none px-2 "
                        value={form?.TenDoiTuong}
                        name="TenDoiTuong"
                        readOnly={typeAction === 'view' || typeAction === 'edit' ? true : false}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                    <div className="flex  items-center p-1">
                      <label className="w-[86px]">Địa chỉ</label>
                      <input
                        type="text"
                        className="w-full outline-none px-2"
                        value={form?.DiaChi}
                        name="DiaChi"
                        readOnly={typeAction === 'view' || typeAction === 'edit' ? true : false}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                  </div>
                  {/* thong tin cap nhat */}
                  <div className="w-[38%] py-1 box_content">
                    <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                    <div className="rounded-md w-[98%]  box_capnhat px-1 py-3 ">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center p-1 ">
                          <label className="md:w-[134px] lg:w-[104px] ">Người tạo</label>
                          <input type="text" className="w-full   outline-none px-2 truncate" value={form?.NguoiTao} readOnly title={form?.NguoiTao} />
                        </div>
                        <div className="flex items-center p-1">
                          <label className="w-[30px] pr-1">Lúc</label>
                          <input
                            readOnly
                            type="text"
                            className="w-full   outline-none px-2  text-center"
                            value={form?.NgayTao ? dayjs(form?.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center p-1 ">
                          <label className="md:w-[134px] lg:w-[104px] ">Sửa cuối</label>
                          <input readOnly type="text" className="w-full outline-none px-2 truncate" value={form?.NguoiSuaCuoi} title={form?.NguoiSuaCuoi} />
                        </div>
                        <div className="flex items-center p-1">
                          <label className="w-[30px] pr-1">Lúc</label>
                          <input
                            readOnly
                            type="text"
                            className="w-full outline-none px-2 text-center"
                            value={form?.NgaySuaCuo ? dayjs(form?.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* kho and ghi chu */}
                <div className="flex gap-3 pl-1 lg:pr-[6px] items-center  w-full">
                  <div className="p-1 flex  items-center ">
                    <label form="khohang" className="md:w-[106px] lg:w-[116px]">
                      Kho hàng
                    </label>

                    <Select
                      className={`  hover:-gray-500  ${typeAction === 'edit' ? 'bg-white' : ''} bg-white`}
                      style={{ width: '100%' }}
                      size="small"
                      readOnly={typeAction === 'view' ? true : false}
                      onChange={handleChangeInput_kho}
                      value={form?.MaKho || 'Chọn kho hàng'}
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
                  <div className="flex items-center p-1 w-full">
                    <label className="w-[70px]">Ghi chú</label>
                    <input
                      type="text"
                      name="GhiChu"
                      className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px] ${typeAction === 'edit' ? 'bg-white' : ''}`}
                      value={form?.GhiChu}
                      readOnly={typeAction === 'view' ? true : false}
                      onChange={handleChangeInput_other}
                    />
                  </div>
                </div>
                <div className=" pb-0  relative">
                  <FloatButton
                    className="z-3 absolute w-[30px] h-[30px]"
                    style={{
                      right: 5,
                      top: 4,
                    }}
                    type="primary"
                    icon={<IoMdAddCircle />}
                    onClick={addRecord}
                    tooltip={<div>Bấm vào đây để thêm hàng hoặc F9 để chọn từ danh sách !</div>}
                  />
                  {data_chitiet ? (
                    <TableEdit
                      listHP={dataListHP}
                      typeTable={'create'}
                      typeAction={typeAction}
                      tableName={'BanHang'}
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
              {form?.MaDoiTuong !== '' && form?.MaKho !== '' ? (
                showPopup ? (
                  <ListHelper_HangHoa
                    data={form?.MaDoiTuong !== '' && form?.MaKho !== '' ? dataListHP : []}
                    isShowList={showPopup}
                    close={handleClosePopup}
                    handleAddData={handleAddData}
                    form={form}
                  />
                ) : null
              ) : null}
            </div>
            <div className=" w-full flex justify-between  gap-2 ">
              <div className="w-full flex justify-start  gap-2">
                <ActionButton
                  icon={<MdPrint className="w-6 h-6" />}
                  color={'slate-50'}
                  title={'In Phiếu'}
                  background={'purple-500'}
                  bg_hover={'white'}
                  color_hover={'purple-500'}
                  handleAction={Print}
                  isModal={true}
                />
                <ActionButton
                  icon={<MdPrint className="w-6 h-6" />}
                  color={'slate-50'}
                  title={'In Phiếu Kho'}
                  background={'purple-500'}
                  bg_hover={'white'}
                  color_hover={'purple-500'}
                  handleAction={Print_kho}
                  isModal={true}
                />
              </div>
              <div className="w-full flex justify-end  gap-2">
                {typeAction === 'edit' || typeAction === 'view' ? null : (
                  <ActionButton color={'slate-50'} background={'blue-500'} bg_hover={'white'} color_hover={'blue-500'} title={'Lưu'} isModal={true} handleAction={handleSubmit} />
                )}
                {typeAction === 'view' ? null : (
                  <ActionButton
                    color={'slate-50'}
                    background={'blue-500'}
                    bg_hover={'white'}
                    color_hover={'blue-500'}
                    title={'Lưu & đóng'}
                    isModal={true}
                    handleAction={handleSubmitAndClose}
                  />
                )}
                <ActionButton color={'slate-50'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} title={'Đóng'} isModal={true} handleAction={handleClose} />
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
