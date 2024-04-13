/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import Logo from '../../assets/VTS-iSale.ico'
import { FloatButton, Checkbox, Tooltip, Input } from 'antd'
import { useEffect, useState, useMemo } from 'react'
// import icons from '../../untils/icons'
import { chiTietPBS } from '../../redux/selector'
import './phieubanhang.css'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import TableEdit from '../util/Table/EditTable'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateField } from '@mui/x-date-pickers/DateField'
import { DANHSACHDOITUONG, DANHSACHKHOHANG, THEMPHIEUBANHANG, SUAPHIEUBANHANG, DANHSACHHANGHOA_PBS } from '../../action/Actions'
import API from '../../API/API'
import ListHelper_HangHoa from './ListHelper_HangHoa'
import { toast } from 'react-toastify'
import { Select } from 'antd'
import ActionButton from '../util/Button/ActionButton'
import { nameColumsPhieuBanHangChiTiet } from '../util/Table/ColumnName'
import { IoMdAddCircle } from 'react-icons/io'
// import { MdPrint } from 'react-icons/md'

const { Option } = Select

const initState = {
  NgayCTu: null,
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
  // const [loadingTable, setloadingTable] = useState(false)
  const token = window.localStorage.getItem('TKN')
  const [isModalOpen, setIsModalOpen] = useState(isShow)
  const [Dates, setDates] = useState({
    NgayCTu: dayjs(new Date()),
    DaoHan: dayjs(new Date()),
  })
  const [errors, setErrors] = useState({
    MaDoiTuong: '',
  })
  const [form, setForm] = useState()
  const [listDoiTuong, setListDoiTuong] = useState([])
  const [listKhoHang, setListKhoHang] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [dataChitiet, setDataChitiet] = useState([])
  const [dataListHP, setDataListHP] = useState([])
  const data_chitiet = useSelector(chiTietPBS)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result_listHp = isShow
          ? await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, {
              ...form,
              NgayCTu: null,
            })
          : null
        const result_doituong = isShow ? await DANHSACHDOITUONG(API.DANHSACHDOITUONG_PBS, token) : null
        const result_khohang = isShow ? await DANHSACHKHOHANG(API.DANHSACHKHOHANG_PBS, token) : null
        setDataListHP(result_listHp)
        setListDoiTuong(result_doituong)
        setListKhoHang(result_khohang)
        typeAction === 'create' ? setForm({ ...initState, MaKho: result_khohang?.length > 0 ? result_khohang[0]?.MaKho : '' }) : ''
        setIsModalOpen(isShow)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    loadData()
  }, [isShow, typeAction])

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
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [form])

  const handleClosePopup = () => {
    setShowPopup(false)
  }
  const handleChangeInput = async (value) => {
    const [MaDoiTuong, TenDoiTuong, DiaChi] = value.split(' - ')
    setForm({ ...form, MaDoiTuong, TenDoiTuong, DiaChi })
    setErrors({ ...errors, MaDoiTuong: '' })
    const result_listHp = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, { ...form, MaDoiTuong, TenDoiTuong, DiaChi })
    setDataListHP(result_listHp)
  }
  const handleChangeInput_kho = async (value) => {
    setForm({ ...form, MaKho: value })
    const result_listHp = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, form)
    setDataListHP(result_listHp)
  }
  const handleAddData = (record) => {
    const newRow = { ...record }
    const isMaHangExists = dataChitiet.some((item) => item.MaHang === newRow.MaHang)
    if (isMaHangExists) {
      toast.success('Thêm thành công!', {
        autoClose: 1000,
      })
      const index = dataChitiet.findIndex((item) => item.MaHang === newRow.MaHang)
      const oldQuantity = dataChitiet[index].SoLuong
      dataChitiet[index].SoLuong = oldQuantity + newRow.SoLuong
      setDataChitiet([...dataChitiet])
    } else {
      setDataChitiet([...dataChitiet, newRow])
      toast.success('Thêm thành công !', {
        autoClose: 1000,
      })
    }
  }
  const handleEditData = (data) => {
    setDataChitiet(data)
  }
  const handleSubmit = async (actionType) => {
    if (typeAction === 'create') {
      if (!form?.MaDoiTuong?.trim()) {
        setErrors({
          MaDoiTuong: form?.MaDoiTuong?.trim() ? null : 'Đối tượng không được trống',
        })
        return
      }
      const newData = dataChitiet?.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (newData?.length > 0) {
        const data = { ...form, ...Dates, NgayCTu: Dates.NgayCTu.format('YYYY-MM-DD'), DataDetails: newData }
        const res = await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)
        const dateCT = { ...form, ...Dates, NgayCTu: Dates.NgayCTu.format('YYYY-MM-DD') }
        if (res.DataError == 0) {
          actionType === 'print'
            ? handleShowPrint_action(dateCT.NgayCTu, res.DataResults[0]?.SoChungTu)
            : actionType === 'printKho'
              ? handleShowPrint_kho_action(dateCT.NgayCTu, res.DataResults[0]?.SoChungTu)
              : toast.success(res.DataErrorDescription, { autoClose: 1000 })
          setMaHang(res.DataResults[0]?.SoChungTu)
          setForm({ ...initState, MaKho: listKhoHang?.length > 0 ? listKhoHang[0]?.MaKho : '' })
          setDataChitiet([])
        } else {
          toast.error(res.DataErrorDescription, { autoClose: 2000 })
        }
      } else {
        toast.warning('Chi tiết hàng không được để trống', { autoClose: 1000 })
      }
    }
  }
  const handleSubmitAndClose = async () => {
    if (typeAction === 'create') {
      if (!form?.MaDoiTuong?.trim()) {
        setErrors({
          MaDoiTuong: form?.MaDoiTuong?.trim() ? null : 'Đối tượng không được trống',
        })
        return
      }
      const newData = dataChitiet?.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (newData?.length > 0) {
        const data = { ...form, ...Dates, NgayCTu: Dates.NgayCTu.format('YYYY-MM-DD'), DataDetails: newData }
        const res = await THEMPHIEUBANHANG(API.THEMPHIEUBANHANG, token, data)
        if (res[0]?.SoChungTu) {
          setMaHang(res[0]?.SoChungTu)
          handleClose()
        }
      } else {
        toast.warning('Chi tiết hàng không được để trống', { autoClose: 1000 })
      }
    } else if (typeAction === 'edit') {
      const newData = dataChitiet.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (newData?.length > 0) {
        const data = { ...form, DataDetails: newData }
        const res = await SUAPHIEUBANHANG(API.SUAPHIEUBANHANG, token, { SoChungTu: data.SoChungTu, Data: data })
        setMaHang(data.SoChungTu)
        if (res.DataError === 0) {
          handleClose()
        }
      } else {
        toast.warning('Chi tiết hàng không được để trống', { autoClose: 1000 })
      }
    }
  }
  const Print = async () => {
    handleShowPrint_action(form?.NgayCTu, form?.SoChungTu)
  }
  const Print_kho = async () => {
    handleShowPrint_kho_action(form?.NgayCTu, form?.SoChungTu)
  }
  const isAdd = useMemo(() => dataChitiet?.map((item) => item.MaHang).includes('Chọn mã hàng'), [dataChitiet])

  const addRecord = () => {
    setDataChitiet([
      ...dataChitiet,
      {
        DonGia: 0,
        GiaBan: 0,
        MaHang: 'Chọn mã hàng',
        SoLuong: 1,
        TenHang: 'Chọn mã hàng',
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
  }

  return (
    <>
      {isModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10 ">
          <div className=" p-2 absolute shadow-lg bg-white rounded-md flex flex-col gap-2">
            <div className="flex flex-col gap-2 p-1 xl:w-[80vw] lg:w-[90vw] md:w-[98vw]">
              <div className="flex gap-2">
                <img src={Logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 uppercase font-semibold">{`${typeAction === 'view' ? 'Thông Tin' : typeAction === 'edit' ? 'Sửa' : 'Thêm'} - Phiếu Bán Hàng`}</p>
              </div>
              <div className="w-full h-[90%] flex flex-col border-2 px-1 gap-2 py-2.5 text-sm">
                <div className={`grid lg:grid-cols-5 md:grid-cols-7 gap-1 box_thongtin ${typeAction == 'create' ? 'create' : typeAction == 'edit' ? 'edit' : ''}`}>
                  <div className="flex flex-col lg:col-span-3 md:col-span-4 gap-2">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm required whitespace-nowrap min-w-[70px] flex justify-end">Số C.từ</label>
                        <input
                          readOnly
                          type="text"
                          value={form?.SoChungTu}
                          className={`${typeAction == 'create' ? 'md:w-[100px]' : 'md:w-[120px]'} lg:w-full  border border-gray-300 outline-none px-2 rounded-[3px] resize-none`}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <label className="min-w-[40px] flex justify-end">Ngày</label>
                        {typeAction === 'view' ? (
                          <input
                            readOnly
                            type="text"
                            value={dayjs(form?.NgayCTu).format('DD/MM/YYYY')}
                            className="px-2 resize-none rounded-[3px] border outline-none text-center text-sm w-[120px]"
                          />
                        ) : (
                          <DateField
                            className="max-w-[115px] text-sm"
                            format="DD/MM/YYYY"
                            value={typeAction === 'create' ? Dates.NgayCTu : dayjs(form?.NgayCTu)}
                            onChange={(newDate) => {
                              setDates({
                                ...Dates,
                                NgayCTu: dayjs(newDate),
                              })
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                            }}
                          />
                        )}
                      </div>
                      {typeAction === 'create' ? (
                        <div className="flex items-center ">
                          <Checkbox
                            className="text-sm whitespace-nowrap lg:min-w-[120px] flex justify-end"
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
                    <div className="flex items-center gap-1">
                      <label form="doituong" className="text-sm whitespace-nowrap min-w-[70px] flex justify-end">
                        Đối tượng
                      </label>
                      {typeAction === 'view' ? (
                        <input
                          type="text"
                          className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm"
                          value={`${form?.MaDoiTuong} - ${form?.TenDoiTuong}`}
                          readOnly={true}
                          disabled
                        />
                      ) : (
                        <Select
                          size="small"
                          className="w-full outline-none truncate"
                          placeholder={errors.MaDoiTuong ? errors.MaDoiTuong : ''}
                          status={errors.MaDoiTuong ? 'error' : ''}
                          value={form?.MaDoiTuong !== '' ? `${form?.MaDoiTuong} - ${form?.TenDoiTuong}` : null}
                          onChange={handleChangeInput}
                          showSearch
                          optionFilterProp="children"
                        >
                          {listDoiTuong?.map((item, index) => (
                            <Option value={`${item.Ma} - ${item.Ten} - ${item.DiaChi}`} key={index}>
                              {item?.Ma} - {item?.Ten}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="text-sm whitespace-nowrap min-w-[70px] flex justify-end">Tên</label>
                      <input
                        type="text"
                        className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm"
                        value={form?.TenDoiTuong}
                        name="TenDoiTuong"
                        readOnly={typeAction === 'view' || typeAction === 'edit' ? true : false}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:col-span-2 md:col-span-3 px-2 border-2 py-2 border-black-200 rounded relative">
                    <div className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</div>
                    <div className="flex gap-1">
                      <div className="flex items-center ">
                        <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                        <Tooltip title={form?.NguoiTao} color="blue">
                          <input type="text" className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm truncate" value={form?.NguoiTao} readOnly />
                        </Tooltip>
                      </div>
                      <div className="flex items-center">
                        <label className="w-[30px] pr-1">Lúc</label>
                        <Tooltip title={form?.NgayTao ? dayjs(form?.NgayTao).format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            readOnly
                            type="text"
                            className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm truncate"
                            value={form?.NgayTao ? dayjs(form?.NgayTao).format('DD/MM/YYYY HH:mm:ss') : ''}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex items-center">
                        <label className="md:w-[134px] lg:w-[104px]">Người sửa</label>
                        <Tooltip title={form?.NguoiSuaCuoi} color="blue">
                          <input readOnly type="text" className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm truncate" value={form?.NguoiSuaCuoi} />
                        </Tooltip>
                      </div>
                      <div className="flex items-center">
                        <label className="w-[30px] pr-1">Lúc</label>
                        <Tooltip title={form?.NgaySuaCuoi ? dayjs(form?.NgaySuaCuoi).format('DD/MM/YYYY HH:mm:ss') : ''} color="blue">
                          <input
                            readOnly
                            type="text"
                            className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm truncate"
                            value={form?.NgaySuaCuoi ? dayjs(form?.NgaySuaCuoi).format('DD/MM/YYYY HH:mm:ss') : ''}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-sm whitespace-nowrap min-w-[70px] flex justify-end">Địa chỉ</label>
                  {typeAction === 'view' ? (
                    <input type="text" className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm" value={form?.DiaChi} name="DiaChi" readOnly disabled />
                  ) : (
                    <Input
                      size="small"
                      className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                      value={form?.DiaChi}
                      onChange={handleChangeInput}
                      readOnly
                      disabled
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 ">
                    <label form="khohang" className="whitespace-nowrap required min-w-[70px] flex justify-end">
                      Kho hàng
                    </label>
                    {typeAction === 'view' ? (
                      <input type="text" className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm" value={form?.MaKho} name="DiaChi" readOnly disabled />
                    ) : (
                      <Select
                        className="min-w-[150px]"
                        size="small"
                        readOnly={typeAction === 'view' ? true : false}
                        onChange={handleChangeInput_kho}
                        value={form?.MaKho || undefined}
                        showSearch
                        optionFilterProp="children"
                        disabled={typeAction === 'view' ? true : false}
                      >
                        {listKhoHang?.map((item, index) => (
                          <Option value={item.MaKho} key={index}>
                            {item?.MaKho} - {item?.TenKho}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                  <div className="flex items-center gap-1 w-full">
                    <label className="whitespace-nowrap flex justify-end text-sm">Ghi chú</label>
                    {typeAction === 'view' ? (
                      <input type="text" className="px-2 w-full rounded-[3px] resize-none border outline-none text-sm" value={form?.GhiChu} readOnly disabled />
                    ) : (
                      <Input
                        size="small"
                        className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                        value={form?.GhiChu}
                        onChange={(e) => {
                          setForm({ ...form, GhiChu: e.target.value })
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="pb-0 relative">
                  {typeAction !== 'view' ? (
                    <Tooltip
                      title={isAdd ? 'Vui lòng chọn tên hàng.' : 'Bấm vào đây để thêm hàng hoặc F9 để chọn từ danh sách.'}
                      placement="topLeft"
                      color={isAdd ? 'gray' : 'blue'}
                    >
                      <FloatButton
                        className="z-3 absolute w-[30px] h-[30px]"
                        style={{
                          right: 5,
                          top: 4,
                        }}
                        type={isAdd ? 'default' : 'primary'}
                        icon={<IoMdAddCircle />}
                        onClick={addRecord}
                      />
                    </Tooltip>
                  ) : null}
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
                  // icon={<MdPrint className="w-6 h-6" />}
                  color={'slate-50'}
                  title={'In Phiếu'}
                  background={'purple-500'}
                  bg_hover={'white'}
                  color_hover={'purple-500'}
                  handleAction={() => (typeAction == 'view' ? Print() : handleSubmit('print'))}
                  isModal={true}
                />
                <ActionButton
                  // icon={<MdPrint className="w-6 h-6" />}
                  color={'slate-50'}
                  title={'In Phiếu Kho'}
                  background={'purple-500'}
                  bg_hover={'white'}
                  color_hover={'purple-500'}
                  handleAction={() => (typeAction == 'view' ? Print_kho() : handleSubmit('printKho'))}
                  isModal={true}
                />
              </div>
              <div className="w-full flex justify-end  gap-2">
                {typeAction === 'edit' || typeAction === 'view' ? null : (
                  <ActionButton
                    color={'slate-50'}
                    background={'blue-500'}
                    bg_hover={'white'}
                    color_hover={'blue-500'}
                    title={'Lưu'}
                    isModal={true}
                    handleAction={() => handleSubmit(null)}
                  />
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
      ) : null}
    </>
  )
}

export default ActionModals
