/* eslint-disable react/prop-types */

// import ActionButton from '../components/util/Button/ActionButton'
// import { Checkbox, Tooltip } from 'antd'
import { Checkbox, FloatButton, Select, Spin, Table, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import icons from '../untils/icons'
import { RETOKEN, base64ToPDF, formatPrice, formatQuantity } from '../action/Actions'

import { useEffect, useMemo, useState } from 'react'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import TableEdit from '../components/util/Table/EditTable'
import { nameColumsGBS } from '../components/util/Table/ColumnName'
import moment from 'moment'
import ModalHHGBS from './ModalHHGBS'
import ModalDieuChinh from './ModalDieuChinh'
import ModalSelectHH from './ModalSelectHH'
import ModalImport from './ModalImport'
const { Text } = Typography
const { Option } = Select
const { IoMdAddCircle } = icons
const ModalGBS = ({ data, actionType, typePage, namePage, close, dataRecord, dataThongSo, dataThongTin, dataHangHoa, loading, isLoadingModal, setHightLight }) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false)
  const [isShowSelectHH, setIsShowSelectHH] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [errors, setErrors] = useState({
    NhomGia: '',
    TenNhomGia: '',
  })
  const ngayHieuLuc = dayjs().format('YYYY-MM-DD')
  const defaultFormCreate = {
    NhomGia: '',
    TenNhomGia: '',
    GhiChu: '',
    NhomGia_CTs: [],
  }
  const [formCreate, setFormCreate] = useState(defaultFormCreate)

  const [formEdit, setFormEdit] = useState({
    Ma: dataThongTin.NhomGia,
    Data: {
      TenNhomGia: dataThongTin.TenNhomGia,
      GhiChu: dataThongTin.GhiChu,
      NhomGia_CTs: [],
    },
  })

  const [formAdjustPrice, setFormAdjustPrice] = useState({
    GiaTriTinh: 'OLDVALUE',
    ToanTu: '',
    LoaiGiaTri: 'TYLE',
    GiaTri: 0,
    HieuLucTu: ngayHieuLuc,
    DanhSachMa: [],
  })

  const [formPrint, setFormPrint] = useState({
    CodeValue1From: data[0].NhomGia,
    CodeValue1To: data[0].NhomGia,
  })

  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng'), [selectedRowData])
  const datafilterHH = useMemo(
    () => (selectedRowData && dataHangHoa ? dataHangHoa.filter((item) => !selectedRowData.some((row) => row.MaHang === item.MaHang)) : dataHangHoa),
    [dataHangHoa, selectedRowData],
  )
  //  show modal HH = F9
  const handleKeyDown = (event) => {
    if (event.key === 'F9') {
      setIsShowModalHH(true)
    }
  }

  useEffect(() => {
    if (actionType === 'create' || actionType === 'edit' || actionType === 'clone') {
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  //  set value default
  useEffect(() => {
    if (data && actionType === 'adjustPrice') {
      filterDSMa(ngayHieuLuc)
    }
  }, [])

  useEffect(() => {
    if (formAdjustPrice?.GiaTriTinh === 'OLDVALUE') {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '+' })
    } else {
      setFormAdjustPrice({ ...formAdjustPrice, ToanTu: '=' })
    }
  }, [formAdjustPrice.GiaTriTinh])

  useEffect(() => {
    if (dataThongTin?.NhomGia_CTs && (actionType === 'edit' || actionType === 'clone')) {
      // setSelectedRowData([...dataThongTin.NhomGia_CTs])
      setSelectedRowData(
        [...dataThongTin.NhomGia_CTs].map((item, index) => ({
          ...item,
          STT: index + 1,
          key: index + 1 + selectedRowData.length + dataHangHoa.length,
        })),
      )
    }
  }, [dataThongTin?.NhomGia_CTs])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      hight: 10,
      fixed: 'left',
      align: 'center',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div className="text-start">{text}</div>,
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      render: (text) => (
        <div className="text-start truncate">
          <Tooltip title={text} color="blue">
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
    },

    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 150,
      align: 'center',
      showSorterTooltip: false,

      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.DonGia - b.DonGia,
    },
    {
      title: 'Đã có thuế',
      dataIndex: 'CoThue',
      key: 'CoThue',
      width: 110,
      align: 'center',
      showSorterTooltip: false,

      render: (text) => <Checkbox disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.CoThue ? 1 : 0
        const valueB = b.CoThue ? 1 : 0
        return valueA - valueB
      },
    },
    {
      title: '% thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 150,
      align: 'center',
      showSorterTooltip: false,

      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatQuantity(text, dataThongSo?.SOLETYLE)}
        </div>
      ),
    },
  ]
  const columnName = ['STT', 'MaHang', 'TenHang', 'DVT', 'DonGia', 'CoThue', 'TyLeThue']

  const handleAddRow = (newRow) => {
    let dataNewRow
    setSelectedRowData((prevData) => {
      if (prevData.some((item) => item.MaHang === newRow.MaHang))
        dataNewRow = prevData.map((item) => {
          // if (item.MaHang === newRow.MaHang) {
          //   console.log('đã tồn tại')
          // }
          return item
        })
      else {
        dataNewRow = [...prevData, newRow]
      }
      return dataNewRow
    })
  }
  const handleAddSelectedRow = (newRow) => {
    // const newRowFiltered = newRow.filter((item) => !selectedRowData.some((row) => row.MaHang === item.MaHang))
    // setSelectedRowData([...selectedRowData, ...newRowFiltered])
    setSelectedRowData([...selectedRowData, ...newRow])
  }

  const handleAddEmptyRow = () => {
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) return

    let emptyRow = {
      MaHang: 'Chọn mã hàng',
      TenHang: 'Chọn tên hàng',
      DonGia: 0,
      CoThue: false,
      TyLeThue: 0,
      key: selectedRowData.length + 1 + dataHangHoa.length,
    }

    setSelectedRowData((prevData) => [...prevData, emptyRow])
  }

  const handleCreateAndClose = async () => {
    if (!formCreate?.NhomGia?.trim() || !formCreate?.TenNhomGia?.trim()) {
      setErrors({
        NhomGia: formCreate?.NhomGia?.trim() ? '' : 'Mã bảng giá không được để trống',
        TenNhomGia: formCreate?.TenNhomGia?.trim() ? '' : 'Tên bảng giá không được để trống',
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.ThemGBS(tokenLogin, { ...formCreate, NhomGia_CTs: selectedRowData })

      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        setHightLight(formCreate.NhomGia)
        loading()
        close()
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleCreateAndClose()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleCreate = async () => {
    if (!formCreate?.NhomGia?.trim() || !formCreate?.TenNhomGia?.trim()) {
      setErrors({
        NhomGia: formCreate?.NhomGia?.trim() ? '' : 'Mã bảng giá không được để trống',
        TenNhomGia: formCreate?.TenNhomGia?.trim() ? '' : 'Tên bảng giá không được để trống',
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.ThemGBS(tokenLogin, { ...formCreate, NhomGia_CTs: selectedRowData })

      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        setHightLight(formCreate.NhomGia)
        loading()
        setFormCreate(defaultFormCreate)
        setSelectedRowData([])
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleCreateAndClose()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleEdit = async () => {
    if (!formEdit?.Data.TenNhomGia?.trim()) {
      setErrors({
        TenNhomGia: formEdit.Data?.TenNhomGia?.trim() ? '' : 'Tên bảng giá không được để trống',
      })
      return
    }

    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.SuaGBS(tokenLogin, { ...formEdit, Data: { ...formEdit.Data, NhomGia_CTs: selectedRowData } })
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        setHightLight(formEdit.Ma)
        loading()
        close()
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleEdit()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.XoaGBS(tokenLogin, dataRecord.NhomGia)
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription)
        loading()
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleDelete()
      } else {
        toast.error(response.data.DataErrorDescription)
      }

      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.InGBS(tokenLogin, formPrint)
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults)
      } else if ((response.data && response.data.DataError === -1) || response.data.DataError === -2 || response.data.DataError === -3) {
        toast.warning(response.data.DataErrorDescription)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handlePrint()
      } else {
        toast.error(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleSelectHH = () => {
    setIsShowSelectHH(true)
  }
  const handleImport = () => {
    setIsShowImport(true)
  }

  const filterDSMa = (date) => {
    const filteredMaHang = data.filter((item) => dayjs(item.HieuLucTu).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')).map((item) => ({ Ma: item.MaHang }))
    setFormAdjustPrice({
      ...formAdjustPrice,
      HieuLucTu: dayjs(date).format('YYYY-MM-DD'),
      DanhSachMa: filteredMaHang,
    })
  }
  const handleChangLoading = (newLoading) => {
    setIsLoading(newLoading)
  }
  const handleEditData = (data) => {
    setSelectedRowData(data)
  }

  const handleFromChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1From: value })

    if (data?.findIndex((item) => item.NhomGia === value) > data?.findIndex((item) => item.NhomGia === formPrint.CodeValue1To)) {
      setFormPrint({ CodeValue1From: value, CodeValue1To: value })
    }
  }
  const handleToChange = (value) => {
    setFormPrint({ ...formPrint, CodeValue1To: value })

    if (data?.findIndex((item) => item.NhomGia === value) < data?.findIndex((item) => item.NhomGia === formPrint.CodeValue1From)) {
      setFormPrint({ CodeValue1From: value, CodeValue1To: value })
    }
  }

  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'delete' && (
            <div className=" items-center ">
              <label>
                Bạn có chắc muốn xóa nhóm giá
                <span className="font-bold mx-1"> {dataRecord.NhomGia}</span>
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
          {actionType === 'print' && (
            <div className="h-[140px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">In - {namePage} </label>
              </div>

              <div className="border-2 my-1 ">
                <div className="p-4 flex flex-col gap-3 ">
                  <div className="flex  ">
                    <div className="flex gap-2 ">
                      <label className="required w-[70px] text-end">Bảng giá</label>
                      <Select size="small" showSearch optionFilterProp="children" className="w-[200px]" value={formPrint.CodeValue1From} onChange={handleFromChange}>
                        {data?.map((item) => (
                          <Option key={item.NhomGia} value={item.NhomGia}>
                            {item.NhomGia}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <label className="required w-[50px]  text-end">Đến</label>
                      <Select size="small" showSearch optionFilterProp="children" className="w-[200px]" value={formPrint.CodeValue1To} onChange={handleToChange}>
                        {data?.map((item) => (
                          <Option key={item.NhomGia} value={item.NhomGia}>
                            {item.NhomGia}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1 gap-2">
                <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handlePrint} />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'view' && (
            <div className=" w-[90vw] h-[600px]">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
              </div>
              <Spin spinning={isLoadingModal}>
                <div className="border w-full h-[90%] rounded-sm text-sm">
                  <div className="flex  md:gap-0 lg:gap-1 pl-1">
                    {/* thong tin phieu */}
                    <div className="w-[62%]  pt-3">
                      <div className="flex p-1 gap-2 ">
                        <label className=" w-[120px]  text-end required">Mã bảng giá</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.NhomGia} />
                      </div>
                      <div className="flex p-1 gap-2 ">
                        <label className=" w-[120px]  text-end required">Tên bảng giá</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.TenNhomGia} />
                      </div>
                      <div className="flex p-1 gap-2 ">
                        <label className=" w-[120px]  text-end">Ghi chú</label>
                        <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.GhiChu} />
                      </div>
                    </div>

                    {/* thong tin cap nhat */}
                    <div className="w-[38%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center px-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                            <Tooltip title={dataThongTin?.NguoiTao} color="blue">
                              <input
                                disabled
                                type="text"
                                className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                value={dataThongTin?.NguoiTao}
                                readOnly
                              />
                            </Tooltip>
                          </div>

                          <div className="flex items-center p-1">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <Tooltip
                              title={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate "
                                value={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                            <Tooltip title={dataThongTin?.NguoiSuaCuoi} color="blue">
                              <input
                                disabled
                                type="text"
                                className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]  truncate"
                                value={dataThongTin?.NguoiSuaCuoi}
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <Tooltip
                              title={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                value={
                                  dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''
                                }
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* table */}
                  <div className="">
                    <Table
                      loading={loading}
                      className="table_view_GBS "
                      dataSource={dataThongTin?.NhomGia_CTs}
                      columns={columns}
                      size="small"
                      scroll={{
                        x: 1000,
                        y: 340,
                      }}
                      bordered
                      pagination={false}
                      // Bảng Tổng
                      summary={
                        dataThongTin?.NhomGia_CTs === undefined
                          ? null
                          : () => {
                              return (
                                <Table.Summary fixed="bottom">
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> {dataThongTin?.NhomGia_CTs?.length}</Table.Summary.Cell>
                                    {columns
                                      .filter((column) => column.render)
                                      .map((column) => {
                                        const isNumericColumn = typeof dataThongTin?.NhomGia_CTs[0]?.[column.dataIndex] === 'number'
                                        return (
                                          <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                            {column.dataIndex === 'DonGia' ? (
                                              <Text strong>
                                                {Number(dataThongTin?.NhomGia_CTs.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                                  minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                                  maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                                })}
                                              </Text>
                                            ) : column.dataIndex === 'TyLeThue' ? (
                                              <Text strong>
                                                {Number(dataThongTin?.NhomGia_CTs.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                                  minimumFractionDigits: dataThongSo?.SOLETYLE,
                                                  maximumFractionDigits: dataThongSo?.SOLETYLE,
                                                })}
                                              </Text>
                                            ) : column.dataIndex === 'CoThue' ? (
                                              <Text className="text-center" strong>
                                                {Object.values(data).filter((value) => value.CoThue).length}
                                              </Text>
                                            ) : null}
                                          </Table.Summary.Cell>
                                        )
                                      })}
                                  </Table.Summary.Row>
                                </Table.Summary>
                              )
                            }
                      }
                    ></Table>
                  </div>
                </div>
              </Spin>
              {/* button */}
              <div className="flex justify-end items-center  pt-3">
                <button
                  onClick={() => close()}
                  className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
          {(actionType === 'create' || actionType === 'clone') && (
            <div className=" w-[90vw] h-[600px] ">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Thêm - {namePage ? namePage : 'Phiếu ?'}</label>
              </div>

              <Spin spinning={isLoadingModal}>
                <div className="border w-full h-[89%] rounded-sm text-sm">
                  <div className="flex md:gap-0 lg:gap-1 pl-1 ">
                    {/* thong tin phieu */}
                    <div className="w-[62%]">
                      <div className="flex flex-col pt-3  ">
                        <div className="flex items-center p-1 gap-2">
                          <label className="required w-[120px] text-end">Mã bảng giá</label>
                          <input
                            placeholder={errors?.NhomGia}
                            type="text"
                            className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]
                             ${errors.NhomGia ? 'border-red-500' : ''}`}
                            value={formCreate.NhomGia}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                NhomGia: e.target.value,
                              }),
                                setErrors({ ...errors, NhomGia: '' })
                            }}
                          />
                        </div>
                        <div className="flex items-center p-1 gap-2">
                          <label className="required w-[120px] text-end">Tên bảng giá</label>
                          <input
                            placeholder={errors?.TenNhomGia}
                            type="text"
                            className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]
                             ${errors.TenNhomGia ? 'border-red-500' : ''}`}
                            value={formCreate.TenNhomGia}
                            onChange={(e) => {
                              setFormCreate({
                                ...formCreate,
                                TenNhomGia: e.target.value,
                              }),
                                setErrors({ ...errors, TenNhomGia: '' })
                            }}
                          />
                        </div>
                        <div className="flex items-center p-1 gap-2">
                          <label className=" w-[120px] text-end">Ghi chú</label>
                          <input
                            type="text"
                            className="w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]"
                            value={formCreate.GhiChu}
                            onChange={(e) =>
                              setFormCreate({
                                ...formCreate,
                                GhiChu: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* thong tin cap nhat */}
                    <div className="w-[38%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                            <input disabled type="text" className=" w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>

                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <input disabled type="text" className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                            <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>
                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <div className=" pb-0  relative mt-1">
                    <Tooltip
                      placement="topLeft"
                      title={isAdd ? 'Vui lòng chọn hàng hóa hoặc F9 để chọn từ danh sách' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách!'}
                      color="blue"
                    >
                      <FloatButton
                        className="absolute z-3 bg-transparent w-[26px] h-[26px]"
                        style={{
                          right: 12,
                          top: 8,
                        }}
                        type={`${isAdd ? 'default' : 'primary'}`}
                        icon={<IoMdAddCircle />}
                        onClick={handleAddEmptyRow}
                      />
                    </Tooltip>
                    <TableEdit
                      typeTable="create"
                      typeAction="create"
                      tableName="GBS"
                      className="table_create_GBS"
                      param={selectedRowData}
                      handleEditData={handleEditData}
                      ColumnTable={columnName}
                      columName={nameColumsGBS}
                      yourMaHangOptions={dataHangHoa}
                      yourTenHangOptions={dataHangHoa}
                    />
                  </div>
                </div>
              </Spin>
              {/* button  */}
              <div className=" flex justify-between items-center">
                <div className=" flex  items-center gap-3  pt-3">
                  <ActionButton
                    color={'slate-50'}
                    title={'Thêm MH chưa có'}
                    background={'bg-main'}
                    bg_hover={'white'}
                    color_hover={'bg-main'}
                    isModal={true}
                    handleAction={handleSelectHH}
                  />

                  <ActionButton color={'slate-50'} title={'Import'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} isModal={true} handleAction={handleImport} />
                </div>
                <div className="flex  items-center gap-3  pt-3">
                  <ActionButton color={'slate-50'} title={'Lưu'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleCreate} />
                  <ActionButton
                    color={'slate-50'}
                    title={'Lưu & Đóng'}
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
            <div className=" w-[90vw] h-[600px] ">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">Sửa - {namePage ? namePage : 'Phiếu ?'}</label>
              </div>

              <Spin spinning={isLoadingModal}>
                <div className="border w-full h-[89%] rounded-sm text-sm">
                  <div className="flex md:gap-0 lg:gap-1 pl-1 ">
                    {/* thong tin phieu */}
                    <div className="w-[62%]">
                      <div className="flex flex-col pt-3  ">
                        <div className="flex items-center p-1 gap-2">
                          <label className="required w-[120px] text-end">Mã bảng giá</label>
                          <input
                            placeholder={errors?.NhomGia}
                            type="text"
                            className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]
                             ${errors.NhomGia ? 'border-red-500' : ''}`}
                            value={formEdit.Ma}
                            disabled
                          />
                        </div>
                        <div className="flex items-center p-1 gap-2">
                          <label className="required w-[120px] text-end">Tên bảng giá</label>
                          <input
                            placeholder={errors?.TenNhomGia}
                            type="text"
                            className={`w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]
                             ${errors.TenNhomGia ? 'border-red-500' : ''}`}
                            value={formEdit.Data.TenNhomGia}
                            onChange={(e) => {
                              setFormEdit({
                                ...formEdit,
                                Data: {
                                  ...formEdit.Data,
                                  TenNhomGia: e.target.value,
                                },
                              }),
                                setErrors({ ...errors, TenNhomGia: '' })
                            }}
                          />
                        </div>
                        <div className="flex items-center p-1 gap-2">
                          <label className=" w-[120px] text-end">Ghi chú</label>
                          <input
                            type="text"
                            className="w-full border-[1px] border-gray-300 outline-none px-2 rounded-[4px] hover:border-[#4897e6] h-[24px]"
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
                      </div>
                    </div>
                    {/* thong tin cap nhat */}
                    <div className="w-[38%] py-1 box_content">
                      <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                      <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center px-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                            <Tooltip title={dataThongTin?.NguoiTao} color="blue">
                              <input
                                disabled
                                type="text"
                                className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                value={dataThongTin?.NguoiTao}
                                readOnly
                              />
                            </Tooltip>
                          </div>

                          <div className="flex items-center p-1">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <Tooltip
                              title={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate "
                                value={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div className="flex items-center p-1  ">
                            <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                            <Tooltip title={dataThongTin?.NguoiSuaCuoi} color="blue">
                              <input
                                disabled
                                type="text"
                                className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]  truncate"
                                value={dataThongTin?.NguoiSuaCuoi}
                              />
                            </Tooltip>
                          </div>
                          <div className="flex items-center p-1 ">
                            <label className="w-[30px] pr-1">Lúc</label>
                            <Tooltip
                              title={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                              color="blue"
                            >
                              <input
                                disabled
                                type="text"
                                className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                                value={
                                  dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''
                                }
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <div className=" pb-0  relative mt-1">
                    <Tooltip
                      placement="topLeft"
                      title={isAdd ? 'Vui lòng chọn hàng hóa hoặc F9 để chọn từ danh sách' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách!'}
                      color="blue"
                    >
                      <FloatButton
                        className="absolute z-3 bg-transparent w-[26px] h-[26px]"
                        style={{
                          right: 12,
                          top: 8,
                        }}
                        type={`${isAdd ? 'default' : 'primary'}`}
                        icon={<IoMdAddCircle />}
                        onClick={handleAddEmptyRow}
                      />
                    </Tooltip>
                    <TableEdit
                      typeTable="edit"
                      // typeAction="edit"
                      tableName="GBS"
                      className="table_create_GBS"
                      param={selectedRowData}
                      handleEditData={handleEditData}
                      ColumnTable={columnName}
                      columName={nameColumsGBS}
                      yourMaHangOptions={dataHangHoa}
                      yourTenHangOptions={dataHangHoa}
                      yourCoThue={selectedRowData.CoThue}
                    />
                  </div>
                </div>
              </Spin>
              {/* button  */}
              <div className="flex justify-end items-center">
                <div className="flex justify-end items-center gap-3  pt-3">
                  <ActionButton
                    color={'slate-50'}
                    title={'Lưu & Đóng'}
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
      {isShowModalHH && (
        <ModalHHGBS
          close={() => setIsShowModalHH(false)}
          data={dataHangHoa}
          onRowCreate={handleAddRow}
          dataThongSo={dataThongSo}
          onChangLoading={handleChangLoading}
          loading={isLoading}
        />
      )}
      {isShowSelectHH && (
        <ModalSelectHH
          close={() => setIsShowSelectHH(false)}
          data={datafilterHH}
          onRowCreate={handleAddSelectedRow}
          dataThongSo={dataThongSo}
          onChangLoading={handleChangLoading}
          loading={isLoading}
        />
      )}
      {actionType === 'adjustPrice' && (
        <ModalDieuChinh
          close={() => close()}
          dataThongSo={dataThongSo}
          loading={isLoading}
          namePage={namePage}
          typePage={typePage}
          dataRecord={dataRecord}
          setHightLight={setHightLight}
        />
      )}
      {isShowImport && <ModalImport close={() => setIsShowImport(false)} namePage={namePage} loading={isLoading} />}
    </>
  )
}

export default ModalGBS
