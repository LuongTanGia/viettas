/* eslint-disable react/prop-types */

// import ActionButton from '../components/util/Button/ActionButton'
// import { Checkbox, Tooltip } from 'antd'
import { Checkbox, InputNumber, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { RETOKEN, base64ToPDF, formatPrice } from '../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import ModalImport from './ModalImport'

const { Option } = Select

const ModalTL = ({ actionType, typePage, namePage, close, dataRecord, dataThongSo, dataHangHoa, dataDoiTuong, dataNhomGia, loading, formDEL, setHightLight, dataMaHang }) => {
  const [value1List, setValue1List] = useState([])
  const [value2List, setValue2List] = useState([])
  const [errors, setErrors] = useState({
    MaHang: '',
    DonGia: '',
  })
  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')
  const defaultFormCreate = {
    MaHang: '',
    HieuLucTu: ngayHieuLuc,
    DonGia: 0,
    CoThue: false,
    TyLeThue: 0,
  }

  const defaultFormCreateGKH = {
    MaDoiTuong: '',
    HieuLucTu: ngayHieuLuc,
    NhomGia: '',
    GhiChu: '',
  }

  const [formCreate, setFormCreate] = useState(typePage === 'GBL' ? defaultFormCreate : defaultFormCreateGKH)

  const defaultFormEdit = {
    Ma: dataRecord?.MaHang,
    HieuLuc: dayjs(dataRecord?.HieuLucTu).format('YYYY-MM-DD'),
    Data: {
      DonGia: dataRecord?.DonGia,
      CoThue: dataRecord?.CoThue,
      TyLeThue: dataRecord?.TyLeThue,
    },
  }

  const defaultFormEditGKH = {
    Ma: dataRecord?.MaDoiTuong,
    HieuLuc: dayjs(dataRecord?.HieuLucTu).format('YYYY-MM-DD'),
    Data: {
      NhomGia: dataRecord?.NhomGia,
      GhiChu: dataRecord?.GhiChu,
    },
  }
  const [formEdit, setFormEdit] = useState(typePage === 'GBL' ? defaultFormEdit : defaultFormEditGKH)

  const [formAdjustPrice, setFormAdjustPrice] = useState({
    GiaTriTinh: 'OLDVALUE',
    ToanTu: '',
    LoaiGiaTri: 'TYLE',
    GiaTri: 0,
    HieuLucTu: ngayHieuLuc,
    DanhSachMa: dataMaHang,
  })

  const [formPrint, setFormPrint] = useState({
    CodeValue1From: null,
    CodeValue1To: null,
    CodeValue1List: null,
    CodeValue2From: null,
    CodeValue2To: null,
    CodeValue2List: null,
    NgayHieuLuc: ngayHieuLuc,
  })

  //  set value default
  useEffect(() => {
    if (formAdjustPrice?.GiaTriTinh === 'OLDVALUE') {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '+' })
    } else {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: null })
    }
  }, [formAdjustPrice.GiaTriTinh])

  useEffect(() => {
    if (typePage === 'GKH') {
      if (dataDoiTuong && dataNhomGia && actionType === 'create') {
        setFormCreate({ ...formCreate, MaDoiTuong: dataDoiTuong[0]?.Ma, NhomGia: dataNhomGia[0]?.Ma })
      }
    }
  }, [dataDoiTuong, dataNhomGia, dataRecord])

  useEffect(() => {
    if (formPrint.CodeValue1From === undefined || formPrint.CodeValue1To === undefined) {
      setFormPrint({ ...formPrint, CodeValue1From: null, CodeValue1To: null })
    }
    if (formPrint.CodeValue2From === undefined || formPrint.CodeValue2To === undefined) {
      setFormPrint({ ...formPrint, CodeValue2From: null, CodeValue2To: null })
    }
  }, [formPrint])

  //////////////////////////////////////////////
  const handleCreateAndClose = async () => {
    if (typePage === 'GBL') {
      if (formCreate?.DonGia === null || formCreate?.DonGia === 0 || !formCreate?.MaHang?.trim()) {
        setErrors({
          ...errors,
          MaHang: formCreate?.MaHang?.trim() ? '' : 'Mã hàng không được để trống',
          DonGia: formCreate?.DonGia === null ? null : formCreate?.DonGia === 0 && 0,
        })
        return
      }
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.ThemGBL(tokenLogin, formCreate)
          break
        case 'GKH':
          response = await apis.ThemGKH(tokenLogin, formCreate)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(`${typePage === 'GKH' ? `${formCreate.MaDoiTuong}/${formCreate.HieuLucTu}T00:00:00` : `${formCreate.MaHang}/${formCreate.HieuLucTu}T00:00:00`}`)
          loading()
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleCreateAndClose()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleCreate = async () => {
    if (typePage === 'GBL') {
      if (formCreate?.DonGia === null || formCreate?.DonGia === 0 || !formCreate?.MaHang?.trim()) {
        setErrors({
          ...errors,
          MaHang: formCreate?.MaHang?.trim() ? '' : 'Mã hàng không được để trống',
          DonGia: formCreate?.DonGia === null ? null : formCreate?.DonGia === 0 && 0,
        })
        return
      }
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.ThemGBL(tokenLogin, formCreate)
          break
        case 'GKH':
          response = await apis.ThemGKH(tokenLogin, formCreate)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(`${typePage === 'GKH' ? `${formCreate.MaDoiTuong}/${formCreate.HieuLucTu}T00:00:00` : `${formCreate.MaHang}/${formCreate.HieuLucTu}T00:00:00`}`)
          loading()
          setFormCreate(typePage === 'GKH' ? defaultFormCreateGKH : defaultFormCreate)
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleCreate()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleEdit = async () => {
    if (typePage === 'GBL') {
      if (formEdit?.DonGia === null || formEdit?.DonGia === 0) {
        setErrors({
          ...errors,
          DonGia: formEdit?.DonGia === null ? null : formEdit?.DonGia === 0 && 0,
        })
        return
      }
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.SuaGBL(tokenLogin, formEdit)
          break
        case 'GKH':
          response = await apis.SuaGKH(tokenLogin, formEdit)
          break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          setHightLight(`${formEdit.Ma}/${formEdit.HieuLuc}`)
          loading()
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleEdit()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.XoaGBL(tokenLogin, dataRecord.MaHang, dataRecord.HieuLucTu)
          break
        case 'GKH':
          response = await apis.XoaGKH(tokenLogin, dataRecord.MaDoiTuong, dataRecord.HieuLucTu)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDeleteDS = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.XoaDSGKH(tokenLogin, formDEL)
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDeleteDS()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }
  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.InGBL(tokenLogin, { ...formPrint, CodeValue1List: value1List.join(','), CodeValue2List: value2List.join(',') })
      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          base64ToPDF(DataResults)
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handlePrint()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleAdjustPrice = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DieuChinhGBL(tokenLogin, formAdjustPrice)
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          // const soChungTu = response.data.DataResults.map((obj) => `${obj.Ma}/${obj.HieuLuc}`)
          // setHightLight(soChungTu)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleAdjustPrice()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleFromChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1From: value })
    if (formPrint.CodeValue1To === null || value > formPrint.CodeValue1To) {
      setFormPrint({ ...formPrint, CodeValue1From: value, CodeValue1To: value })
    }
  }
  const handleToChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1To: value })
    if (formPrint.CodeValue1From === null || value < formPrint.CodeValue1From) {
      setFormPrint({ ...formPrint, CodeValue1From: value, CodeValue1To: value })
    }
  }

  const handle2FromChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue2From: value })
    if (formPrint.CodeValue2To === null || value > formPrint.CodeValue2To) {
      setFormPrint({ ...formPrint, CodeValue2From: value, CodeValue2To: value })
    }
  }
  const handle2ToChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue2To: value })
    if (formPrint.CodeValue2From === null || value < formPrint.CodeValue2From) {
      setFormPrint({ ...formPrint, CodeValue2From: value, CodeValue2To: value })
    }
  }

  console.log('formEdit', formEdit)
  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'delete' && (
            <div className=" items-center ">
              <label>
                Bạn có chắc muốn xóa
                <span className="font-bold mx-1"> {typePage === 'GBL' ? dataRecord.MaHang : dataRecord.MaDoiTuong}</span>
                không ?
              </label>
              <div className="flex justify-end mt-4 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleDelete(dataRecord)}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'deleteds' && (
            <div className=" items-center ">
              <label>
                Bạn có chắc muốn xóa tổng cộng
                <span className="font-bold mx-1">{formDEL.DanhSachMaHieuLuc.length}</span>
                dòng dữ liệu không ?
              </label>
              <div className="flex justify-end mt-4 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={handleDeleteDS}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'print' && (
            <div className="h-[306px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">In - {namePage} </label>
              </div>

              <div className="border-2 my-1 ">
                <div className="p-4 flex flex-col gap-3 ">
                  {/* DatePicker */}
                  <div className=" flex  items-center gap-2 ">
                    <label htmlFor="" className="w-[90px] text-end">
                      Ngày
                    </label>
                    <DateField
                      className="DatePicker_PMH max-w-[154px]"
                      format="DD/MM/YYYY"
                      value={dayjs(formPrint.ngayHieuLuc)}
                      onChange={(newDate) => {
                        setFormPrint({
                          ...formPrint,
                          ngayHieuLuc: dayjs(newDate).format('YYYY-MM-DD'),
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
                  <div className="flex  ">
                    <div className="flex gap-2 ">
                      <label className="w-[90px] text-end">Nhóm</label>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        allowClear
                        size="small"
                        placeholder="Chọn nhóm"
                        value={formPrint.CodeValue1From}
                        onChange={handleFromChange}
                        style={{
                          width: '170px',
                          textOverflow: 'ellipsis',
                        }}
                        popupMatchSelectWidth={false}
                      >
                        {dataNhomGia?.map((item) => (
                          <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                            {item.Ma} - {item.Ten}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <label className="w-[50px]  text-end">Đến</label>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        allowClear
                        size="small"
                        placeholder="Chọn nhóm"
                        value={formPrint.CodeValue1To}
                        onChange={handleToChange}
                        style={{
                          width: '170px',
                          textOverflow: 'ellipsis',
                        }}
                        popupMatchSelectWidth={false}
                      >
                        {dataNhomGia?.map((item) => (
                          <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                            {item.Ma} - {item.Ten}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="">
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Chọn nhóm"
                      size="small"
                      value={value1List}
                      onChange={(value) => setValue1List(value)}
                      className="w-full truncate"
                      maxTagCount="responsive"
                      optionFilterProp="children"
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                          <span>+{omittedValues?.length}...</span>
                        </Tooltip>
                      )}
                    >
                      {dataNhomGia?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          <p>
                            {item.Ma} - {item.Ten}
                          </p>
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex  ">
                    <div className="flex gap-2 ">
                      <label className="w-[90px] text-end">Hàng hóa</label>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        allowClear
                        size="small"
                        placeholder="Chọn hàng hóa"
                        value={formPrint.CodeValue2From}
                        onChange={handle2FromChange}
                        style={{
                          width: '170px',
                          textOverflow: 'ellipsis',
                        }}
                        popupMatchSelectWidth={false}
                      >
                        {dataHangHoa?.map((item) => (
                          <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                            {item.MaHang} - {item.TenHang}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <label className="w-[50px]  text-end">Đến</label>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        allowClear
                        size="small"
                        placeholder="Chọn hàng hóa"
                        value={formPrint.CodeValue2To}
                        onChange={handle2ToChange}
                        style={{
                          width: '170px',
                          textOverflow: 'ellipsis',
                        }}
                        popupMatchSelectWidth={false}
                      >
                        {dataHangHoa?.map((item) => (
                          <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                            {item.MaHang} - {item.TenHang}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="">
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Chọn nhóm"
                      size="small"
                      value={value2List}
                      onChange={(value) => setValue2List(value)}
                      className="w-full truncate"
                      maxTagCount="responsive"
                      optionFilterProp="children"
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                          <span>+{omittedValues?.length}...</span>
                        </Tooltip>
                      )}
                    >
                      {dataHangHoa?.map((item) => (
                        <Option key={item.MaHang} value={item.MaHang}>
                          <p>
                            {item.MaHang} - {item.TenHang}
                          </p>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1 gap-2">
                <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'adjustPrice' && (
            <div className="w-[700px] h-[160px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Điều chỉnh giá - {namePage}</label>
              </div>
              <div className="border w-full h-[60%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-3 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1">
                        <label className="required  min-w-[70px] text-sm flex justify-end">Hiệu lực từ</label>
                        <DateField
                          className="DatePicker_PMH  max-w-[115px]"
                          format="DD/MM/YYYY"
                          value={dayjs(formAdjustPrice?.HieuLucTu)}
                          onChange={(newDate) => {
                            setFormAdjustPrice({
                              ...formAdjustPrice,
                              HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                      <div className="flex  gap-2 items-center">
                        <div className="flex items-center gap-1">
                          <label className=" whitespace-nowrap  min-w-[74px] text-sm flex justify-end">Trị giá tính</label>
                          <Select
                            className="w-[140px] truncate"
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={(value) =>
                              setFormAdjustPrice({
                                ...formAdjustPrice,
                                GiaTriTinh: value,
                              })
                            }
                            value={formAdjustPrice.GiaTriTinh}
                          >
                            <Option value="OLDVALUE">Từ giá trị cũ</Option>
                            <Option value="NEWVALUE">Thay giá trị mới</Option>
                          </Select>
                        </div>
                        <div className="flex items-center gap-1">
                          <label className=" whitespace-nowrap   text-sm flex justify-end">Toán tử</label>
                          {formAdjustPrice.GiaTriTinh === 'OLDVALUE' ? (
                            <Select
                              className="w-[50px] truncate"
                              showSearch
                              size="small"
                              onChange={(value) =>
                                setFormAdjustPrice({
                                  ...formAdjustPrice,
                                  ToanTu: value,
                                })
                              }
                              value={formAdjustPrice.ToanTu}
                            >
                              <Option value="+">+</Option>
                              <Option value="-">-</Option>
                              <Option value="*">*</Option>
                              <Option value="/">/</Option>
                            </Select>
                          ) : (
                            <Select
                              className="w-[50px] truncate"
                              showSearch
                              size="small"
                              onChange={(value) =>
                                setFormAdjustPrice({
                                  ...formAdjustPrice,
                                  ToanTu: value,
                                })
                              }
                              value={formAdjustPrice.ToanTu}
                            >
                              <Option value={null}>=</Option>
                            </Select>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <label className=" whitespace-nowrap   text-sm flex justify-end">Loại</label>
                          <Select
                            className="w-[100px] truncate"
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={(value) =>
                              setFormAdjustPrice({
                                ...formAdjustPrice,
                                LoaiGiaTri: value,
                              })
                            }
                            value={formAdjustPrice.LoaiGiaTri}
                          >
                            <Option value="TYLE">Tỷ lệ %</Option>
                            <Option value="HANGSO">Hằng số</Option>
                          </Select>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label className=" text-sm flex justify-end">Giá trị</label>
                          {formAdjustPrice.LoaiGiaTri === 'TYLE' ? (
                            <InputNumber
                              className="w-[100%]"
                              size="small"
                              min={0}
                              max={100}
                              value={formAdjustPrice.GiaTri}
                              formatter={(value) => `${value}`}
                              parser={(value) => {
                                const parsedValue = parseFloat(value)
                                return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLETYLE))
                              }}
                              onChange={(e) =>
                                setFormAdjustPrice({
                                  ...formAdjustPrice,
                                  GiaTri: e,
                                })
                              }
                            />
                          ) : (
                            <InputNumber
                              className="w-[100%]"
                              size="small"
                              min={0}
                              max={999999999999}
                              value={formAdjustPrice.GiaTri}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => {
                                const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLEDONGIA))
                              }}
                              onChange={(e) =>
                                setFormAdjustPrice({
                                  ...formAdjustPrice,
                                  GiaTri: e,
                                })
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="flex justify-end items-center pt-[14px]  gap-x-2">
                <button
                  onClick={handleAdjustPrice}
                  className="flex items-center  py-1 px-2  rounded-md  border-2 border-blue-500 text-slate-50 text-text-main font-bold  bg-blue-500 hover:bg-white hover:text-blue-500"
                >
                  <div className="pr-1">{/* <TiPrinter size={20} /> */}</div>
                  <div>Xử lý</div>
                </button>

                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
          {actionType === 'view' && (
            <div className={`w-[700px] ${typePage === 'GBL' ? 'h-[260px]' : 'h-[300px]'}`}>
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
              </div>
              <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      {typePage === 'GBL' && (
                        <>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                            <input
                              type="text"
                              value={`${dataRecord?.MaHang}-${dataRecord?.TenHang} (${dataRecord?.DVT}) `}
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                              disabled
                            />
                          </div>
                          <div className="grid grid-cols-2  gap-2 items-center">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                              <DateField
                                className="DatePicker_PMH  max-w-[115px]"
                                format="DD/MM/YYYY"
                                value={dayjs(dataRecord?.HieuLucTu)}
                                disabled
                                sx={{
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
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Giá bán lẻ</label>
                              <input
                                type="text"
                                value={formatPrice(dataRecord?.DonGia, dataThongSo.SOLEDONGIA) || ''}
                                className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate text-end"
                                disabled
                              />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={dataRecord?.CoThue}>
                                Đã có thuế
                              </Checkbox>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="  min-w-[90px] text-sm flex justify-end">% Thuế</label>
                              <input
                                type="text"
                                value={formatPrice(dataRecord?.TyLeThue, dataThongSo.SOLETYLE) || ''}
                                className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate  text-end"
                                disabled
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {typePage === 'GKH' && (
                        <>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                            <input
                              type="text"
                              value={`${dataRecord?.MaDoiTuong}-${dataRecord?.TenDoiTuong}`}
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                              disabled
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="required  min-w-[90px] text-sm flex justify-end">Hiệu lực từ</label>
                            <DateField
                              className="DatePicker_PMH  max-w-[115px]"
                              format="DD/MM/YYYY"
                              value={dayjs(dataRecord?.HieuLucTu)}
                              disabled
                              sx={{
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
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                            <input
                              type="text"
                              value={dataRecord?.ThongTinNhomGia}
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none "
                              disabled
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                            <input
                              type="text"
                              value={dataRecord?.GhiChu}
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300   outline-none "
                              disabled
                            />
                          </div>
                        </>
                      )}
                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px] ">Người tạo</label>
                            <Tooltip title={dataRecord?.NguoiTao} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NguoiTao}
                                className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <Tooltip title={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')}
                                className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px]">Sửa cuối</label>
                            <Tooltip title={dataRecord?.NguoiSuaCuoi} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NguoiSuaCuoi}
                                className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
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
                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
          {actionType === 'create' && (
            <div className={`w-[700px] ${typePage === 'GBL' ? 'h-[260px]' : 'h-[300px]'}`}>
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage}</label>
              </div>
              <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      {typePage === 'GBL' && (
                        <>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                            <Select
                              className="w-full truncate"
                              status={errors.MaHang ? 'error' : ''}
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              onChange={(value) => {
                                setFormCreate({
                                  ...formCreate,
                                  MaHang: value,
                                }),
                                  setErrors({ ...errors, MaHang: '' })
                              }}
                              value={formCreate.MaHang}
                            >
                              {dataHangHoa?.map((item) => (
                                <Option key={item.MaHang} value={item.MaHang}>
                                  {item.MaHang}- {item.TenHang} ({item.DVT})
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="grid grid-cols-2  gap-2 items-center">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                              <DateField
                                className="DatePicker_PMH  max-w-[115px]"
                                format="DD/MM/YYYY"
                                defaultValue={dayjs()}
                                onChange={(newDate) => {
                                  setFormCreate({
                                    ...formCreate,
                                    HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Giá bán lẻ</label>
                              <InputNumber
                                className={`w-[100%]   
                                       ${errors.DonGia === 0 || errors.DonGia === null ? 'border-red-500' : ''} `}
                                placeholder={errors.DonGia}
                                size="small"
                                min={0}
                                max={999999999999}
                                value={formCreate.DonGia}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => {
                                  const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                  return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLEDONGIA))
                                }}
                                onChange={(e) => {
                                  setFormCreate({
                                    ...formCreate,
                                    DonGia: e,
                                  }),
                                    setErrors({ ...errors, DonGia: e })
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={formCreate?.CoThue}>
                                Đã có thuế
                              </Checkbox>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="  min-w-[90px] text-sm flex justify-end">% Thuế</label>
                              <InputNumber
                                className="w-[100%]"
                                size="small"
                                min={0}
                                max={100}
                                value={formCreate.TyLeThue}
                                formatter={(value) => `${value}`}
                                parser={(value) => {
                                  const parsedValue = parseFloat(value)
                                  return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLETYLE))
                                }}
                                onChange={(e) => {
                                  const tyLeThue = e

                                  setFormCreate({
                                    ...formCreate,
                                    TyLeThue: tyLeThue,
                                    CoThue: tyLeThue > 0,
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {typePage === 'GKH' && (
                        <>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                            <Select
                              className="w-full truncate"
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              onChange={(value) =>
                                setFormCreate({
                                  ...formCreate,
                                  MaDoiTuong: value,
                                })
                              }
                              value={formCreate.MaDoiTuong}
                            >
                              {dataDoiTuong?.map((item) => (
                                <Option key={item.Ma} value={item.Ma}>
                                  {item.Ma}- {item.Ten}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="required  min-w-[90px] text-sm flex justify-end">Hiệu lực từ</label>
                            <DateField
                              className="DatePicker_PMH  max-w-[115px]"
                              format="DD/MM/YYYY"
                              value={dayjs(formCreate.HieuLucTu)}
                              onChange={(newDate) => {
                                setFormCreate({
                                  ...formCreate,
                                  HieuLucTu: dayjs(newDate).format('YYYY-MM-DD'),
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
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                            <Select
                              className="w-full truncate"
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              onChange={(value) =>
                                setFormCreate({
                                  ...formCreate,
                                  NhomGia: value,
                                })
                              }
                              value={formCreate.NhomGia}
                            >
                              {dataNhomGia?.map((item) => (
                                <Option key={item.Ma} value={item.Ma}>
                                  {item.Ma}- {item.Ten}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                            <input
                              type="text"
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 hover:border-hover-border-color outline-none "
                              value={formCreate.GhiChu}
                              onChange={(e) =>
                                setFormCreate({
                                  ...formCreate,
                                  GhiChu: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px] ">Người tạo</label>
                            <input
                              disabled
                              type="text"
                              className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px]">Sửa cuối</label>

                            <input
                              disabled
                              type="text"
                              className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                            />
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <input disabled type="text" className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="flex justify-end items-center pt-[10px] ">
                <div className="flex gap-2">
                  <ActionButton color={'slate-50'} title={'Lưu'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
                  <ActionButton
                    color={'slate-50'}
                    title={'Lưu & đóng'}
                    isModal={true}
                    background={'bg-main'}
                    bg_hover={'white'}
                    color_hover={'bg-main'}
                    handleAction={handleCreateAndClose}
                  />
                  <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
                </div>
              </div>
            </div>
          )}
          {actionType === 'edit' && (
            <div className={`w-[700px] ${typePage === 'GBL' ? 'h-[260px]' : 'h-[300px]'}`}>
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Sửa - {namePage}</label>
              </div>
              <div className="border w-full h-[78%] rounded-[4px]-sm text-sm">
                <div className="flex flex-col px-2 ">
                  <div className=" py-2 px-2 gap-2  grid grid-cols-1">
                    <div className="flex flex-col gap-2">
                      {typePage === 'GBL' && (
                        <>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Hàng hóa</label>
                            <Select
                              disabled
                              className="w-full truncate "
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              value={`${dataRecord?.MaHang}-${dataRecord?.TenHang} (${dataRecord?.DVT}) `}
                            ></Select>
                          </div>
                          <div className="grid grid-cols-2  gap-2 items-center">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Kể từ ngày</label>
                              <DateField
                                className="DatePicker_PMH max-w-[115px]"
                                format="DD/MM/YYYY"
                                value={dayjs(formEdit?.HieuLuc)}
                                sx={{
                                  '& .MuiButtonBase-root': {
                                    padding: '4px',
                                  },
                                  '& .MuiSvgIcon-root': {
                                    width: '18px',
                                    height: '18px',
                                  },
                                }}
                                readOnly
                              />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="required  min-w-[90px] text-sm flex justify-end">Giá bán lẻ</label>
                              <InputNumber
                                className={`w-[100%]   
                                       ${errors.DonGia === 0 || errors.DonGia === null ? 'border-red-500' : ''} `}
                                placeholder={errors.DonGia}
                                size="small"
                                min={0}
                                max={999999999999}
                                value={formEdit.Data.DonGia}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => {
                                  const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                  return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLEDONGIA))
                                }}
                                onChange={(e) => {
                                  setFormEdit({
                                    ...formEdit,
                                    Data: {
                                      ...formEdit.Data,
                                      DonGia: e,
                                    },
                                  })
                                  setErrors({ ...errors, DonGia: e })
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Checkbox className="min-w-[192px] text-sm flex justify-end " checked={formEdit?.Data.CoThue}>
                                Đã có thuế
                              </Checkbox>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <label className="  min-w-[90px] text-sm flex justify-end">% Thuế</label>
                              <InputNumber
                                className="w-[100%]"
                                size="small"
                                min={0}
                                max={100}
                                value={formEdit.Data.TyLeThue}
                                formatter={(value) => `${value}`}
                                parser={(value) => {
                                  const parsedValue = parseFloat(value)
                                  return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(dataThongSo.SOLETYLE))
                                }}
                                onChange={(e) => {
                                  const tyLeThue = e
                                  setFormEdit({
                                    ...formEdit,
                                    Data: {
                                      ...formEdit.Data,
                                      TyLeThue: tyLeThue,
                                      CoThue: tyLeThue > 0,
                                    },
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {typePage === 'GKH' && (
                        <>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Khách hàng</label>
                            <Select className="w-full truncate" showSearch size="small" optionFilterProp="children" value={formEdit.Ma} disabled></Select>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className="required  min-w-[90px] text-sm flex justify-end">Hiệu lực từ</label>
                            <DateField
                              className="DatePicker_PMH  max-w-[115px] bg-[#fafafa] "
                              format="DD/MM/YYYY"
                              value={dayjs(formEdit?.HieuLuc)}
                              sx={{
                                '& .MuiButtonBase-root': {
                                  padding: '4px',
                                },
                                '& .MuiSvgIcon-root': {
                                  width: '18px',
                                  height: '18px',
                                },
                              }}
                              disabled
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap required min-w-[90px] text-sm flex justify-end">Nhóm giá</label>
                            <Select
                              className="w-full truncate"
                              showSearch
                              size="small"
                              optionFilterProp="children"
                              onChange={(value) =>
                                setFormEdit({
                                  ...formEdit,
                                  Data: {
                                    ...formEdit.Data,
                                    NhomGia: value,
                                  },
                                })
                              }
                              value={formEdit.Data.NhomGia}
                            >
                              {dataNhomGia?.map((item) => (
                                <Option key={item.Ma} value={item.Ma}>
                                  {item.Ma} - {item.Ten}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-1">
                            <label className=" whitespace-nowrap  min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                            <input
                              type="text"
                              className="h-[24px] px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 hover:border-hover-border-color outline-none "
                              value={formEdit.Data.GhiChu}
                              onChange={(e) =>
                                setFormEdit({
                                  ...formEdit,
                                  Data: {
                                    ...formEdit.Data,
                                    GhiChu: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                      {/* thong tin */}
                      <div className="grid grid-cols-1 mt-2 gap-2 px-2 py-2.5 rounded-[4px] border-black-200 ml-[95px] relative border-[1px] border-gray-300 ">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px] ">Người tạo</label>
                            <Tooltip title={dataRecord?.NguoiTao} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NguoiTao}
                                className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <label className=" text-sm">Lúc</label>
                            <Tooltip title={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dayjs(dataRecord?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss')}
                                className="px-2 rounded-[4px] w-full resize-none border-[1px] border-gray-300 outline-none text-center truncate"
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <label className=" text-sm min-w-[70px]">Sửa cuối</label>
                            <Tooltip title={dataRecord?.NguoiSuaCuoi} color="blue">
                              <input
                                disabled
                                type="text"
                                value={dataRecord?.NguoiSuaCuoi}
                                className="h-[24px] w-[20vw] lg:w-[18vw] md:w-[15vw] px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
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
                <div className="flex gap-2">
                  <ActionButton
                    color={'slate-50'}
                    title={'Lưu & đóng'}
                    isModal={true}
                    background={'bg-main'}
                    bg_hover={'white'}
                    color_hover={'bg-main'}
                    handleAction={handleEdit}
                  />
                  <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {actionType === 'import' && <ModalImport typePage={typePage} namePage={namePage} close={close} dataHangHoa={dataHangHoa} loading={loading}></ModalImport>}
    </>
  )
}

export default ModalTL
