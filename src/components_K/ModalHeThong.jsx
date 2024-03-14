/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import * as apis from '../apis'
import { DateField } from '@mui/x-date-pickers'
import logo from '../assets/VTS-iSale.ico'
import ActionButton from '../components/util/Button/ActionButton'
import dayjs from 'dayjs'
import { Checkbox, InputNumber, Select } from 'antd'
import { TimeField } from '@mui/x-date-pickers/TimeField'
import { RETOKEN } from '../action/Actions'
import { toast } from 'react-toastify'

const { Option } = Select

const ModalHeThong = ({ close }) => {
  const [data, setData] = useState([])
  const [dataDateLimit, setDataDateLimit] = useState([])
  const [dataDateType, setDataDateType] = useState([])
  const [dataNCP, setDataNCP] = useState([])
  const [dataKho, setDataKho] = useState([])
  const [dataKH, setDataKH] = useState([])
  const [dataHMChi, setDataHMChi] = useState([])
  const [dataHMThu, setDataHMThu] = useState([])

  const ngay = dayjs().format('YYYY-MM-DDTHH:mm:ss')

  const [formHT, setFormHT] = useState({
    ALLOW_SUACHIETKHAUTHANHTOAN_BANLE: true,
    ALLOW_SUAGIABAN: true,
    ALLOW_XULYCHUYENDOIMAHANGDONGGOI: true,
    HANGMUCCHITIENTAIQUAY: 'string',
    HANGMUCTHUTIENTAIQUAY: 'string',
    HIENTHIGIATRICONGNOTRENPHIEUBANSI: true,
    KHACHHANGVL: dataKH[0]?.Ma,
    KHOMACDINH: dataKho[0]?.MaKho,
    NEED_TERMINAL_CONFIRMGIAMSOLUONG: true,
    NEED_TERMINAL_CONFIRMINLAIBILL: true,
    NEED_TERMINAL_CONFIRMSUABILL: true,
    NEED_TERMINAL_CONFIRMXOABILL: true,
    NEED_TERMINAL_INPHIEUCHOCA: true,
    NHACUNGCAPVL: dataNCP[0]?.Ma,
    SOLEDONGIA: 0,
    SOLEDONGIANGOAITE: 0,
    SOLESOLUONG: 0,
    SOLESOTIEN: 0,
    SOLESOTIENNGOAITE: 0,
    SOLETYLE: 0,
    SUDUNG_CHIETKHAUTHANHTOAN_BANLE: true,
    SUDUNG_GIALENEUKHONGCOGIASI: true,
    SUDUNG_GIAMUAGANNHAT: true,
    SUDUNG_THONGTINCUAHANGTRENPHIEU: true,
    GOPCHITIETTHEOMAHANG: true,
    HIENTHIGIATRIKHO: true,
    DATERANGELIMIT: 'R',
    DATERANGEVAL: 1,
    DATERANGETYPE: 'M',
    DATERANGEMIN: ngay,
    DATERANGEMAX: ngay,
    Ca1: true,
    Ca1_BatDau: ngay,
    Ca1_KetThuc: ngay,
    Ca2: true,
    Ca2_BatDau: ngay,
    Ca2_KetThuc: ngay,
    Ca3: false,
    Ca3_BatDau: 0,
    Ca3_KetThuc: 0,
  })

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
    fetchData(apis.ListHelperNCPHT, setDataNCP)
    fetchData(apis.ListHelperKHHT, setDataKH)
    fetchData(apis.ListHelpeKhoHT, setDataKho)
    fetchData(apis.ListHelpeHMChiHT, setDataHMChi)
    fetchData(apis.ListHelpeHMThuHT, setDataHMThu)
  }, [])

  //get DSPBL
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      console.log('first')
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DSThongSo(tokenLogin)
      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResult)
        // setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getData()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        // setTableLoad(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setData([])
        // setTableLoad(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      // setTableLoad(false)
    }
  }

  console.log(data)
  return (
    <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
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
                    <div className="required w-[140px] text-end">Giới hạn</div>
                    <div className="w-full flex gap-2">
                      <Select
                        className="w-[60%]"
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={(value) => setFormHT({ ...formHT, DATERANGELIMIT: value })}
                        value={formHT.DATERANGELIMIT}
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
                        value={formHT.DATERANGEVAL}
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
                      />
                      <Select
                        className="w-[20%]"
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        popupMatchSelectWidth={false}
                        value={formHT.DATERANGETYPE}
                        onChange={(e) =>
                          setFormHT({
                            ...formHT,
                            DATERANGETYPE: e,
                          })
                        }
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
                    <div className="w-[140px] text-end">Từ</div>
                    <div className="w-full flex gap-2">
                      <div className="flex gap-3">
                        <DateField
                          className="DatePicker_PMH max-w-[110px]"
                          format="DD/MM/YYYY"
                          defaultValue={dayjs()}
                          onChange={(newDate) => {
                            setFormHT({
                              ...formHT,
                              DATERANGEMIN: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                            })
                          }}
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
                            onChange={(newDate) => {
                              setFormHT({
                                ...formHT,
                                DATERANGEMAX: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                              })
                            }}
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
                  <label className="font-medium pl-5 my-2">
                    Các thông số khác <hr />
                  </label>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Kho mặc định</div>
                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      popupMatchSelectWidth={false}
                      value={formHT.KHOMACDINH}
                      onChange={(value) => setFormHT({ ...formHT, KHOMACDINH: value })}
                    >
                      {dataKho.map((item) => (
                        <Option key={item.MaKho} value={item.MaKho}>
                          {item.TenKho}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Khách hàng</div>

                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      popupMatchSelectWidth={false}
                      value={formHT.KHACHHANGVL}
                      onChange={(value) => setFormHT({ ...formHT, KHACHHANGVL: value })}
                    >
                      {dataKH.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">Nhà C.Cấp</div>
                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      popupMatchSelectWidth={false}
                      value={formHT.NHACUNGCAPVL}
                      onChange={(value) => setFormHT({ ...formHT, NHACUNGCAPVL: value })}
                    >
                      {dataNCP.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="ml-32 flex flex-col  gap-2 ">
                    <Checkbox checked={formHT.SUDUNG_GIALENEUKHONGCOGIASI} onChange={(e) => setFormHT({ ...formHT, SUDUNG_GIALENEUKHONGCOGIASI: e.target.checked })}>
                      Tự động lấy giá bán lẻ nếu chưa có giá sỉ
                    </Checkbox>
                    <Checkbox checked={formHT.ALLOW_SUAGIABAN} onChange={(e) => setFormHT({ ...formHT, ALLOW_SUAGIABAN: e.target.checked })}>
                      Cho phép sửa giá bán
                    </Checkbox>
                    <Checkbox checked={formHT.HIENTHIGIATRICONGNOTRENPHIEUBANSI} onChange={(e) => setFormHT({ ...formHT, HIENTHIGIATRICONGNOTRENPHIEUBANSI: e.target.checked })}>
                      Hiện số dư công nợ trên phiếu bán sỉ
                    </Checkbox>
                    <Checkbox checked={formHT.SUDUNG_GIAMUAGANNHAT} onChange={(e) => setFormHT({ ...formHT, SUDUNG_GIAMUAGANNHAT: e.target.checked })}>
                      Đơn giá mua hàng sử dụng đơn giá mua gần nhất
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
            {/* quầy tính tiền */}
            <div className="relative mt-3 w-1/2 border-[2px] border-gray-300 rounded-md">
              <div className="absolute text-center p-1 font-medium top-[-20px] left-1 bg-white text-base">Các thông số áp dụng cho quầy tính tiền</div>
              <div className=" rounded-md  px-1 py-3">
                <div className="w-full flex flex-col p-2  gap-2">
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">H.Mục thu quầy</div>
                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      popupMatchSelectWidth={false}
                      value={formHT.HANGMUCTHUTIENTAIQUAY}
                      onChange={(value) => setFormHT({ ...formHT, HANGMUCTHUTIENTAIQUAY: value })}
                    >
                      {dataHMThu.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className=" flex  items-center p-1 gap-2 ">
                    <div className="w-[140px] text-end">H.Mục chi quầy</div>

                    <Select
                      className="w-full"
                      showSearch
                      size="small"
                      optionFilterProp="children"
                      popupMatchSelectWidth={false}
                      value={formHT.HANGMUCCHITIENTAIQUAY}
                      onChange={(value) => setFormHT({ ...formHT, HANGMUCCHITIENTAIQUAY: value })}
                    >
                      {dataHMChi.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="ml-32 flex flex-col  gap-2 ">
                    <Checkbox checked={formHT.NEED_TERMINAL_CONFIRMSUABILL} onChange={(e) => setFormHT({ ...formHT, NEED_TERMINAL_CONFIRMSUABILL: e.target.checked })}>
                      Yêu cầu xác nhận của quản lý khi sửa phiếu chi tiền
                    </Checkbox>
                    <Checkbox checked={formHT.HIENTHIGIATRICONGNOTRENPHIEUBANSI} onChange={(e) => setFormHT({ ...formHT, HIENTHIGIATRICONGNOTRENPHIEUBANSI: e.target.checked })}>
                      Yêu cầu xác nhận của quản lý khi trả hàng khi tính tiền
                    </Checkbox>
                    <Checkbox checked={formHT.NEED_TERMINAL_CONFIRMXOABILL} onChange={(e) => setFormHT({ ...formHT, NEED_TERMINAL_CONFIRMXOABILL: e.target.checked })}>
                      Yêu cầu xác nhận của quản lý khi xóa phiếu tính tiền
                    </Checkbox>
                    <Checkbox checked={formHT.NEED_TERMINAL_CONFIRMINLAIBILL} onChange={(e) => setFormHT({ ...formHT, NEED_TERMINAL_CONFIRMINLAIBILL: e.target.checked })}>
                      Yêu cầu xác nhận của quản lý khi in lại phiếu tính tiền
                    </Checkbox>
                    <Checkbox checked={formHT.NEED_TERMINAL_CONFIRMGIAMSOLUONG} onChange={(e) => setFormHT({ ...formHT, NEED_TERMINAL_CONFIRMGIAMSOLUONG: e.target.checked })}>
                      Tự cộng số lượng theo mã hàng trên phiếu tính tiền
                    </Checkbox>
                    <Checkbox checked={formHT.ALLOW_XULYCHUYENDOIMAHANGDONGGOI} onChange={(e) => setFormHT({ ...formHT, ALLOW_XULYCHUYENDOIMAHANGDONGGOI: e.target.checked })}>
                      Tự động chuyển đổi mã hàng đóng gói theo số lượng
                    </Checkbox>
                    <Checkbox checked={formHT.SUDUNG_CHIETKHAUTHANHTOAN_BANLE} onChange={(e) => setFormHT({ ...formHT, SUDUNG_CHIETKHAUTHANHTOAN_BANLE: e.target.checked })}>
                      Quầy bán lẻ sử dụng chiết khấu thanh toán
                    </Checkbox>
                    <Checkbox checked={formHT.ALLOW_SUACHIETKHAUTHANHTOAN_BANLE} onChange={(e) => setFormHT({ ...formHT, ALLOW_SUACHIETKHAUTHANHTOAN_BANLE: e.target.checked })}>
                      Quầy bán lẻ có thể sửa chiết khấu thanh toán
                    </Checkbox>
                    <Checkbox checked={formHT.SUDUNG_THONGTINCUAHANGTRENPHIEU} onChange={(e) => setFormHT({ ...formHT, SUDUNG_THONGTINCUAHANGTRENPHIEU: e.target.checked })}>
                      Sử dụng thông tin cửa hàng trên phiếu
                    </Checkbox>
                    <Checkbox checked={formHT.NEED_TERMINAL_INPHIEUCHOCA} onChange={(e) => setFormHT({ ...formHT, NEED_TERMINAL_INPHIEUCHOCA: e.target.checked })}>
                      Quầy bán lẻ phải in phiếu chốt ca
                    </Checkbox>
                    <div className="flex gap-3">
                      <Checkbox value={formHT.Ca1} onChange={(value) => setFormHT({ ...formHT, Ca1: value })}>
                        Ca 1
                      </Checkbox>
                      <div className="flex gap-2 items-center">
                        <label>Từ</label>
                        <TimeField
                          className="max-w-[70px]"
                          format="HH:mm"
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
                          value={formHT.Ca1_BatDau}
                          onChange={(value) => setFormHT({ ...formHT, Ca1_BatDau: value })}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label>Đến</label>
                        <TimeField
                          className="max-w-[70px]"
                          format="HH:mm"
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
                          value={formHT.Ca1_KetThuc}
                          onChange={(value) => setFormHT({ ...formHT, Ca1_KetThuc: value })}
                        />
                      </div>
                      <Checkbox
                        value="checkbox1"
                        // checked={checkboxValues.checkbox1}
                      >
                        Hôm sau
                      </Checkbox>
                    </div>
                    <div className="flex gap-3">
                      <Checkbox value={formHT.Ca2} onChange={(value) => setFormHT({ ...formHT, Ca2: value })}>
                        Ca 2
                      </Checkbox>
                      <div className="flex gap-2 items-center">
                        <label>Từ</label>
                        <TimeField
                          className="max-w-[70px]"
                          format="HH:mm"
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
                          value={formHT.Ca2_BatDau}
                          onChange={(value) => setFormHT({ ...formHT, Ca2_BatDau: value })}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label>Đến</label>
                        <TimeField
                          className="max-w-[70px]"
                          format="HH:mm"
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
                          value={formHT.Ca2_KetThuc}
                          onChange={(value) => setFormHT({ ...formHT, Ca2_KetThuc: value })}
                        />
                      </div>
                      <Checkbox
                        value="checkbox1"
                        // checked={checkboxValues.checkbox1}
                      >
                        Hôm sau
                      </Checkbox>
                    </div>
                    <div className="flex gap-3">
                      <Checkbox value={formHT.Ca3} onChange={(value) => setFormHT({ ...formHT, Ca3: value })}>
                        Ca 3
                      </Checkbox>
                      <div className="flex gap-2 items-center">
                        <label>Từ</label>
                        <TimeField
                          className="max-w-[70px]"
                          format="HH:mm"
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
                          value={formHT.Ca3_BatDau}
                          onChange={(value) => setFormHT({ ...formHT, Ca3_BatDau: value })}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label>Đến</label>
                        <TimeField
                          className="max-w-[70px]"
                          format="HH:mm"
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
                          value={formHT.Ca3_KetThuc}
                          onChange={(value) => setFormHT({ ...formHT, Ca3_KetThuc: value })}
                        />
                      </div>
                      <Checkbox
                        value="checkbox1"
                        // checked={checkboxValues.checkbox1}
                      >
                        Hôm sau
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
