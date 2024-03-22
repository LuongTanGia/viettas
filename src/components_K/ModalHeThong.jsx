/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import * as apis from '../apis'
import { DateField } from '@mui/x-date-pickers'
import logo from '../assets/VTS-iSale.ico'
import ActionButton from '../components/util/Button/ActionButton'
import dayjs from 'dayjs'
import { Checkbox, InputNumber, Select, Spin, Tooltip } from 'antd'
import { TimeField } from '@mui/x-date-pickers/TimeField'
import { RETOKEN } from '../action/Actions'
import { toast } from 'react-toastify'
import ActionCheckBox from '../components/util/CheckBox/ActionCheckBox'

const { Option } = Select

const styleDate = {
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
  '& .MuiButtonBase-root': {
    padding: '4px',
  },
  '& .MuiSvgIcon-root': {
    width: '18px',
    height: '18px',
  },
}

const ModalHeThong = ({ close }) => {
  const [data, setData] = useState([])
  const [dataDateLimit, setDataDateLimit] = useState([])
  const [dataDateType, setDataDateType] = useState([])
  // const [dataNCP, setDataNCP] = useState([])
  // const [dataKho, setDataKho] = useState([])
  // const [dataKH, setDataKH] = useState([])
  // const [dataHMChi, setDataHMChi] = useState([])
  // const [dataHMThu, setDataHMThu] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [formHT, setFormHT] = useState({})

  useEffect(() => {
    if (data) {
      setFormHT(data)
    }
  }, [data])

  // get helper
  useEffect(() => {
    const fetchData = async (apiFunc, setDataFunc) => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apiFunc(tokenLogin)
        if (response.data && response.data.DataError === 0) {
          setDataFunc(response.data.DataResults)
        } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if (response.data.DataError === -107 || response.data.DataError === -108) {
          await RETOKEN()
          fetchData(apiFunc, setDataFunc)
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
      }
    }

    fetchData(apis.ListHelperDateLimitHT, setDataDateLimit)
    fetchData(apis.ListHelperDateTypeHT, setDataDateType)
    // fetchData(apis.ListHelperNCPHT, setDataNCP)
    // fetchData(apis.ListHelperKHHT, setDataKH)
    // fetchData(apis.ListHelpeKhoHT, setDataKho)
    // fetchData(apis.ListHelpeHMChiHT, setDataHMChi)
    // fetchData(apis.ListHelpeHMThuHT, setDataHMThu)
  }, [])

  //get DSPBL
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DSThongSo(tokenLogin)
      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResult)
        setIsLoading(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getData()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        setIsLoading(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setData([])
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setIsLoading(false)
    }
  }

  const handleOverlapTime = (start, end) => {
    return start < end
  }

  const handleDieuChinhTT = async () => {
    if (dayjs(formHT?.DATERANGEMIN).isAfter(dayjs(formHT?.DATERANGEMAX))) {
      toast.warning('ngày bắt đầu không được lớn hơn ngày kết thúc!')
      return
    }

    if (formHT?.Ca1_KetThuc < 1440) {
      if (formHT?.Ca1_BatDau > formHT?.Ca1_KetThuc) {
        toast.warning('Thời gian bắt đầu không được lớn hơn thời gian kết thúc!')
        return
      }
    }
    if (formHT?.Ca2_KetThuc < 1440) {
      if (formHT?.Ca2_BatDau > formHT?.Ca2_KetThuc) {
        toast.warning('Thời gian bắt đầu không được lớn hơn thời gian kết thúc!')
        return
      }
    }
    if (formHT?.Ca3_KetThuc < 1440) {
      if (dayjs(formHT?.Ca3_BatDau).isAfter(dayjs(formHT?.Ca3_KetThuc))) {
        toast.warning('Thời gian bắt đầu không được lớn hơn thời gian kết thúc!')
        return
      }
    }
    if (formHT?.Ca2 && handleOverlapTime(formHT?.Ca2_BatDau, formHT?.Ca1_KetThuc)) {
      toast.warning('Thời gian phân ca trùng nhau!')
      return
    }
    if (formHT?.Ca3 && handleOverlapTime(formHT?.Ca3_BatDau, formHT?.Ca2_KetThuc)) {
      toast.warning('Thời gian phân ca trùng nhau!')
      return
    }

    if (formHT?.Ca2_KetThuc - formHT?.Ca1_BatDau > 1440) {
      toast.warning('Thời gian phân ca không được quá một ngày!')
      return
    }

    if (formHT?.Ca3_KetThuc - formHT?.Ca1_BatDau > 1440) {
      toast.warning('Thời gian phân ca không được quá một ngày!')
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DieuChinhThongSo(tokenLogin, formHT)
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        close()
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleDieuChinhTT()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
    }
  }

  const convertMinutesToHHMM = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `0000-00-00T${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const convertHHMMToMinutes = (time) => {
    const [hours, mins] = time.split(':').map(Number)
    return hours * 60 + mins
  }

  const handleCheckBoxChange = (e, value) => {
    setFormHT({ ...formHT, [value]: e.target.checked })
  }

  console.table(formHT)
  return (
    <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <Spin spinning={isLoading}>
          <div className="w-[90vw] h-[600px] ">
            <div className="flex gap-2">
              <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
              <label className="text-blue-700 font-semibold uppercase pb-1">Thông số hệ thống </label>
            </div>
            {/* content */}

            <div className=" flex h-[89%] gap-x-4 rounded-sm text-sm">
              {/* bán sỉ */}
              <div className="relative mt-3 w-1/2 border-[2px] border-gray-300 rounded-md">
                <div className="absolute text-center p-1 font-medium top-[-20px] left-1 bg-white text-base">Các thông số áp dụng cho bán sỉ</div>
                <div className=" rounded-md  px-1 py-3">
                  <div className="w-full flex flex-col p-2  gap-2">
                    <label className="font-medium pl-5 ">
                      Giới hạn cập nhật <hr />
                    </label>
                    <div className=" flex  items-center p-1 gap-2 ">
                      <div className="required md:w-[190px] lg:w-[140px] text-end ">
                        <span className="md:hidden lg:inline">Giới hạn</span>
                        <span className="md:inline lg:hidden">G.hạn</span>
                      </div>
                      <div className="w-full flex gap-2">
                        <Select
                          className="md:w-[30%] lg:w-[60%]"
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          value={formHT?.DATERANGELIMIT}
                          onChange={(value) => setFormHT({ ...formHT, DATERANGELIMIT: value })}
                          popupMatchSelectWidth={false}
                        >
                          {dataDateLimit?.map((item) => (
                            <Option key={item.Ma} value={item.Ma}>
                              {item.Ten}
                            </Option>
                          ))}
                        </Select>

                        <InputNumber
                          className="w-[20%]"
                          size="small"
                          min={1}
                          max={999999}
                          value={formHT?.DATERANGEVAL}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => {
                            const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                            return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(0))
                          }}
                          onChange={(e) =>
                            setFormHT({
                              ...formHT,
                              DATERANGEVAL: e,
                            })
                          }
                          disabled={formHT?.DATERANGELIMIT === 'M'}
                        />
                        <Select
                          className="w-[20%]"
                          showSearch
                          size="small"
                          optionFilterProp="children"
                          popupMatchSelectWidth={false}
                          value={formHT?.DATERANGETYPE}
                          onChange={(e) =>
                            setFormHT({
                              ...formHT,
                              DATERANGETYPE: e,
                            })
                          }
                          disabled={formHT?.DATERANGELIMIT === 'M'}
                        >
                          {dataDateType.map((item) => (
                            <Option key={item.Ma} value={item.Ma}>
                              {item.Ten}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className=" flex  items-center p-1 gap-2 ">
                      <div className="md:w-[30px] lg:w-[140px] text-end">Từ</div>
                      <div className="w-full flex gap-2">
                        <div className="flex gap-3">
                          <DateField
                            className="DatePicker_PMH max-w-[110px]"
                            format="DD/MM/YYYY"
                            value={dayjs(formHT?.DATERANGEMIN)}
                            maxDate={formHT?.DATERANGEMAX}
                            onChange={(newDate) => {
                              setFormHT({
                                ...formHT,
                                DATERANGEMIN: dayjs(newDate).format('YYYY-MM-DD'),
                              })
                            }}
                            sx={styleDate}
                            disabled={formHT?.DATERANGELIMIT !== 'M'}
                          />
                          <div className="flex gap-2 ">
                            <div className=" text-end">Đến</div>
                            <DateField
                              className="DatePicker_PMH max-w-[110px]"
                              format="DD/MM/YYYY"
                              value={dayjs(formHT?.DATERANGEMAX)}
                              minDate={formHT?.DATERANGEMIN}
                              onChange={(newDate) => {
                                setFormHT({
                                  ...formHT,
                                  DATERANGEMAX: dayjs(newDate).format('YYYY-MM-DD'),
                                })
                              }}
                              sx={styleDate}
                              disabled={formHT?.DATERANGELIMIT !== 'M'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  <div className=" flex flex-col p-2  gap-2">
                    <label className="font-medium pl-5 my-2">
                      Các thông số khác <hr />
                    </label>
                    <div className=" w-full md:ml-0 lg:ml-16 flex flex-col  gap-2  truncate">
                      <ActionCheckBox
                        id="checkboxHT1"
                        label="Tự động lấy giá bán lẻ nếu chưa có giá sỉ"
                        checked={formHT?.SUDUNG_GIALENEUKHONGCOGIASI}
                        onChange={handleCheckBoxChange}
                        value="SUDUNG_GIALENEUKHONGCOGIASI"
                      />
                      <ActionCheckBox id="checkboxHT2" label="Cho phép sửa giá bán" checked={formHT?.ALLOW_SUAGIABAN} onChange={handleCheckBoxChange} value="ALLOW_SUAGIABAN" />
                      <ActionCheckBox
                        id="checkboxHT3"
                        label="Hiện số dư công nợ trên phiếu bán sỉ"
                        checked={formHT?.HIENTHIGIATRICONGNOTRENPHIEUBANSI}
                        onChange={handleCheckBoxChange}
                        value="HIENTHIGIATRICONGNOTRENPHIEUBANSI"
                      />
                      <ActionCheckBox
                        id="checkboxHT4"
                        label="Đơn giá mua hàng sử dụng đơn giá mua gần nhất"
                        checked={formHT?.SUDUNG_GIAMUAGANNHAT}
                        onChange={handleCheckBoxChange}
                        value="SUDUNG_GIAMUAGANNHAT"
                      />
                      {/* <Checkbox checked={formHT?.SUDUNG_CHIETKHAUTHANHTOAN} onChange={(e) => setFormHT({ ...formHT, SUDUNG_CHIETKHAUTHANHTOAN: e.target.checked })}>
                        Sử dụng chiết khấu thanh toán
                      </Checkbox> */}

                      <ActionCheckBox
                        id="checkboxHT5"
                        label="Cho phép sửa chiết khấu thanh toán"
                        checked={formHT?.ALLOW_SUACHIETKHAUTHANHTOAN}
                        onChange={handleCheckBoxChange}
                        value="ALLOW_SUACHIETKHAUTHANHTOAN"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* quầy tính tiền */}
              <div className="relative mt-3 w-1/2 border-[2px] border-gray-300 rounded-md">
                <div className="absolute text-center p-1 font-medium top-[-20px] left-1 bg-white text-base">Các thông số áp dụng cho quầy tính tiền</div>
                <div className=" rounded-md  px-1 py-3">
                  <div className="w-full flex flex-col p-2  gap-2">
                    <label className="font-medium pl-5">
                      Các thông số <hr />
                    </label>
                    <div className=" flex mt-2 md:ml-0 lg:ml-16 flex-col  gap-2 truncate ">
                      <ActionCheckBox
                        id="checkboxHT6"
                        label="Yêu cầu xác nhận của quản lý khi sửa phiếu chi tiền"
                        checked={formHT?.NEED_TERMINAL_CONFIRMSUABILL}
                        onChange={handleCheckBoxChange}
                        value="NEED_TERMINAL_CONFIRMSUABILL"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT7"
                        label="Yêu cầu xác nhận của quản lý khi trả hàng khi tính tiền"
                        checked={formHT?.NEED_TERMINAL_CONFIRMGIAMSOLUONG}
                        onChange={handleCheckBoxChange}
                        value="NEED_TERMINAL_CONFIRMGIAMSOLUONG"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT8"
                        label="Yêu cầu xác nhận của quản lý khi xóa phiếu tính tiền"
                        checked={formHT?.NEED_TERMINAL_CONFIRMXOABILL}
                        onChange={handleCheckBoxChange}
                        value="NEED_TERMINAL_CONFIRMXOABILL"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT9"
                        label="Yêu cầu xác nhận của quản lý khi in lại phiếu tính tiền"
                        checked={formHT?.NEED_TERMINAL_CONFIRMINLAIBILL}
                        onChange={handleCheckBoxChange}
                        value="NEED_TERMINAL_CONFIRMINLAIBILL"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT10"
                        label="Tự cộng số lượng theo mã hàng trên phiếu tính tiền"
                        checked={formHT?.GOPCHITIETTHEOMAHANG}
                        onChange={handleCheckBoxChange}
                        value="GOPCHITIETTHEOMAHANG"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT11"
                        label="Tự động chuyển đổi mã hàng đóng gói theo số lượng"
                        checked={formHT?.ALLOW_XULYCHUYENDOIMAHANGDONGGOI}
                        onChange={handleCheckBoxChange}
                        value="ALLOW_XULYCHUYENDOIMAHANGDONGGOI"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      {/* <Checkbox checked={formHT?.SUDUNG_CHIETKHAUTHANHTOAN_BANLE} onChange={(e) => setFormHT({ ...formHT, SUDUNG_CHIETKHAUTHANHTOAN_BANLE: e.target.checked })}>
                        Quầy bán lẻ sử dụng chiết khấu thanh toán
                      </Checkbox> */}
                      <ActionCheckBox
                        id="checkboxHT12"
                        label="Quầy bán lẻ có thể sửa chiết khấu thanh toán"
                        checked={formHT?.ALLOW_SUACHIETKHAUTHANHTOAN_BANLE}
                        onChange={handleCheckBoxChange}
                        value="ALLOW_SUACHIETKHAUTHANHTOAN_BANLE"
                        disabled={!formHT?.SUDUNG_BANLE || !formHT?.SUDUNG_CHIETKHAUTHANHTOAN_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT13"
                        label="Sử dụng thông tin cửa hàng trên phiếu"
                        checked={formHT?.SUDUNG_THONGTINCUAHANGTRENPHIEU}
                        onChange={handleCheckBoxChange}
                        value="SUDUNG_THONGTINCUAHANGTRENPHIEU"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <ActionCheckBox
                        id="checkboxHT14"
                        label="Quầy bán lẻ phải in phiếu chốt ca"
                        checked={formHT?.NEED_TERMINAL_INPHIEUCHOCA}
                        onChange={handleCheckBoxChange}
                        value="NEED_TERMINAL_INPHIEUCHOCA"
                        disabled={!formHT?.SUDUNG_BANLE}
                      />
                      <div className="flex md:gap-1  lg:gap-3">
                        <Checkbox disabled={!formHT?.SUDUNG_BANLE} checked={formHT?.Ca1}>
                          Ca 1
                        </Checkbox>
                        <div className="flex gap-2 items-center">
                          <label>Từ</label>
                          <TimeField
                            className="w-[70px]"
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
                            format="HH:mm"
                            maxTime={formHT?.Ca1_KetThuc < 1440 ? dayjs(convertMinutesToHHMM(formHT.Ca1_KetThuc)) : undefined}
                            value={dayjs(convertMinutesToHHMM(formHT.Ca1_BatDau))}
                            onChange={(newDate) => {
                              const convertNewDate = convertHHMMToMinutes(dayjs(newDate).format('HH:mm'))
                              setFormHT({ ...formHT, Ca1_BatDau: convertNewDate })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca1}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label>Đến</label>
                          <TimeField
                            className="w-[70px]"
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
                            format="HH:mm"
                            minTime={formHT?.Ca1_KetThuc < 1440 ? dayjs(convertMinutesToHHMM(formHT.Ca1_BatDau)) : undefined}
                            value={dayjs(convertMinutesToHHMM(formHT.Ca1_KetThuc))}
                            onChange={(newDate) => {
                              const convertNewDate = convertHHMMToMinutes(dayjs(newDate).format('HH:mm'))
                              setFormHT({ ...formHT, Ca1_KetThuc: convertNewDate })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca1}
                          />
                        </div>
                        <Tooltip title="Hôm sau" color="blue">
                          <Checkbox
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca1}
                            checked={formHT.Ca1_KetThuc >= 1440 ? true : false}
                            onChange={(e) => {
                              const newValue = e.target.checked ? formHT.Ca1_KetThuc + 1440 : formHT.Ca1_KetThuc - 1440
                              // const newValueCa2KT = formHT?.Ca1 && formHT.Ca2_KetThuc >= 1440 ? formHT.Ca2_KetThuc - 1440 : formHT.Ca2_KetThuc
                              setFormHT({ ...formHT, Ca1_KetThuc: newValue })
                            }}
                          >
                            <span className="md:hidden lg:flex">Hôm sau</span>
                          </Checkbox>
                        </Tooltip>
                      </div>
                      <div className="flex md:gap-1  lg:gap-3">
                        <Checkbox disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca2} checked={formHT?.Ca2}>
                          Ca 2
                        </Checkbox>
                        <div className="flex gap-2 items-center">
                          <label>Từ</label>
                          <TimeField
                            className="w-[70px]"
                            format="HH:mm"
                            maxTime={formHT?.Ca2_KetThuc < 1440 ? dayjs(convertMinutesToHHMM(formHT.Ca2_KetThuc)) : undefined}
                            sx={{
                              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                border: formHT?.Ca1_KetThuc >= 1440 && formHT?.Ca2_KetThuc - formHT?.Ca1_BatDau > 1440 ? '1px solid red' : '',
                              },
                              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                              '& .MuiButtonBase-root': {
                                padding: '4px',
                              },
                              '& .MuiSvgIcon-root': {
                                width: '18px',
                                height: '18px',
                              },
                            }}
                            value={dayjs(convertMinutesToHHMM(formHT.Ca2_BatDau))}
                            onChange={(newDate) => {
                              const convertNewDate = convertHHMMToMinutes(dayjs(newDate).format('HH:mm'))
                              setFormHT({ ...formHT, Ca2_BatDau: convertNewDate })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca2}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label>Đến</label>
                          <TimeField
                            className="w-[70px]"
                            format="HH:mm"
                            minTime={formHT?.Ca2_KetThuc < 1440 ? dayjs(convertMinutesToHHMM(formHT.Ca2_BatDau)) : undefined}
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
                            value={dayjs(convertMinutesToHHMM(formHT.Ca2_KetThuc))}
                            onChange={(newDate) => {
                              const convertNewDate = convertHHMMToMinutes(dayjs(newDate).format('HH:mm'))
                              setFormHT({ ...formHT, Ca2_KetThuc: convertNewDate })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca2}
                          />
                        </div>
                        <Tooltip title="Hôm sau" color="blue">
                          <Checkbox
                            checked={formHT.Ca2_KetThuc >= 1440 ? true : false}
                            onChange={(e) => {
                              const newValue = e.target.checked ? formHT.Ca2_KetThuc + 1440 : formHT.Ca2_KetThuc - 1440

                              // const newValueCa3KT = formHT?.Ca2 && formHT.Ca3_KetThuc >= 1440 ? formHT.Ca3_KetThuc - 1440 : formHT.Ca3_KetThuc

                              setFormHT({ ...formHT, Ca2_KetThuc: newValue })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca2}
                          >
                            <span className="md:hidden lg:flex">Hôm sau</span>
                          </Checkbox>
                        </Tooltip>
                      </div>
                      <div className="flex md:gap-1  lg:gap-3">
                        <Checkbox disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca3} checked={formHT?.Ca3}>
                          Ca 3
                        </Checkbox>
                        <div className="flex gap-2 items-center">
                          <label>Từ</label>
                          <TimeField
                            className="w-[70px]"
                            format="HH:mm"
                            maxTime={formHT?.Ca3_KetThuc < 1440 ? dayjs(convertMinutesToHHMM(formHT.Ca3_KetThuc)) : undefined}
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
                            value={dayjs(convertMinutesToHHMM(formHT.Ca3_BatDau))}
                            onChange={(newDate) => {
                              const convertNewDate = convertHHMMToMinutes(dayjs(newDate).format('HH:mm'))
                              setFormHT({ ...formHT, Ca3_BatDau: convertNewDate })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca3}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label>Đến</label>
                          <TimeField
                            className="w-[70px]"
                            format="HH:mm"
                            maxTime={formHT?.Ca3_KetThuc < 1440 ? dayjs(convertMinutesToHHMM(formHT.Ca3_KetThuc)) : undefined}
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
                            value={dayjs(convertMinutesToHHMM(formHT.Ca3_KetThuc))}
                            onChange={(newDate) => {
                              const convertNewDate = convertHHMMToMinutes(dayjs(newDate).format('HH:mm'))
                              setFormHT({ ...formHT, Ca3_KetThuc: convertNewDate })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca3}
                          />
                        </div>
                        <Tooltip title="Hôm sau" color="blue">
                          <Checkbox
                            checked={formHT.Ca3_KetThuc >= 1440 ? true : false}
                            onChange={(e) => {
                              const newValue = e.target.checked ? formHT.Ca3_KetThuc + 1440 : formHT.Ca3_KetThuc - 1440
                              setFormHT({ ...formHT, Ca3_KetThuc: newValue })
                            }}
                            disabled={!formHT?.SUDUNG_BANLE || !formHT?.Ca3}
                          >
                            <span className="md:hidden lg:flex">Hôm sau</span>
                          </Checkbox>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* button  */}
            <div className=" flex justify-end items-center">
              <div className="flex  items-center gap-3  pt-3">
                <ActionButton
                  color={'slate-50'}
                  title={'Lưu & đóng'}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  isModal={true}
                  handleAction={handleDieuChinhTT}
                />
                <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} isModal={true} />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default ModalHeThong
