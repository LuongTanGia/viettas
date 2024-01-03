/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { IoMdClose } from 'react-icons/io'
import { Checkbox, Table, Tooltip, Select, InputNumber } from 'antd'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import logo from '../../../../../assets/VTS-iSale.ico'
import categoryAPI from '../../../../../API/linkAPI'
import { RETOKEN } from '../../../../../action/Actions'
import { useSearch } from '../../../../hooks/Search'
import ActionButton from '../../../../../components/util/Button/ActionButton'
import './style/NDCCreate.css'

const NDCCreate = ({ close, loadingData }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataKhoHang, setDataKhoHang] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState('')
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataHangHoa)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [valueDate, setValueDate] = useState(dayjs(new Date()))
  const [dataThongSo, setDataThongSo] = useState('')
  const innitProduct = {
    SoChungTu: '',
    NgayCTu: '',
    SoThamChieu: '',
    MaKho: '',
    MaKho_Nhan: '',
    GhiChu: '',
    DataDetails: [
      {
        STT: 0,
        MaHang: '',
        SoLuong: 0,
        DonGia: 0,
        TienHang: 0,
        MaHangLR: '',
      },
    ],
  }
  const [NDCForm, setNDCForm] = useState(() => {
    return innitProduct
  })
  const getDataKhoHangNDC = async () => {
    try {
      const response = await categoryAPI.ListKhoHangNDC(TokenAccess)
      if (response.data.DataError == 0) {
        setDataKhoHang(response.data.DataResults)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataKhoHangNDC()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getDataHangHoaNDC = async () => {
    try {
      const response = await categoryAPI.ListHangHoaNDC(TokenAccess)
      if (response.data.DataError == 0) {
        setDataHangHoa(response.data.DataResults)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataHangHoaNDC()
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDataKhoHangNDC()
    getDataHangHoaNDC()
    getThongSo()
    const handleKeyDown = (event) => {
      if (event.keyCode === 120) {
        setIsShowModal(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShowModal])

  useEffect(() => {
    setNDCForm((prev) => ({
      ...prev,
      DataDetails: selectedRowData.map((item, index) => {
        return {
          STT: index + 1,
          MaHang: item.MaHang,
          TenHang: item.TenHang,
          DVT: item.DVT,
          SoLuong: item.SoLuong,
          TienHang: 0,
          DonGia: item.DonGia,
          MaHangLR: '',
        }
      }),
    }))
  }, [selectedRowData])

  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value)
  }
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN')
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  const getThongSo = async () => {
    try {
      const response = await categoryAPI.ThongSo(TokenAccess)
      if (response.data.DataError == 0) {
        setDataThongSo(response.data.DataResult)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getThongSo()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleChoose = (dataRow) => {
    const defaultValues = {
      SoLuong: 1,
      TienHang: 0,
      MaHangLR: null,
    }
    const newRow = { ...dataRow, ...defaultValues }
    const existMaHang = selectedRowData.some((item) => item.MaHang === newRow.MaHang)
    if (!existMaHang) {
      handleAddRow(newRow)
      toast.success('Chọn hàng hóa thành công', {
        autoClose: 1000,
      })
    } else {
      toast.warning('Hàng hóa đã được chọn', { autoClose: 1000 })
    }
  }
  const handleAddRow = (newRow) => {
    setSelectedRowData([...selectedRowData, newRow])
  }
  const handleCreate = async (e, isSave = true) => {
    e.preventDefault()
    try {
      const response = await categoryAPI.NDCCreate({ ...NDCForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss') }, TokenAccess)
      if (response.data.DataError == 0) {
        loadingData()
        isSave ? '' : close()
        toast.success('Tạo thành công')
      } else {
        console.log(NDCForm)
        toast.error('Tạo thất bại')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleChange = (index, key, newValue) => {
    const newDataList = [...NDCForm.DataDetails]
    if (key === 'SoLuong') {
      newValue = parseFloat(newValue)
    }
    if (key == 'TenHang') {
      const selectedHangHoa = dataHangHoa.find((item) => item.MaHang === newValue)
      newDataList[index]['DonGia'] = selectedHangHoa?.DonGia
      newDataList[index]['MaHang'] = selectedHangHoa?.MaHang
    }
    newDataList[index][key] = newValue
    setSelectedRowData(newDataList)
    setNDCForm({ ...NDCForm, DataDetails: newDataList })
  }
  const addHangHoaCT = () => {
    const addHHCT = Array.isArray(NDCForm.DataDetails) ? [...NDCForm.DataDetails] : []
    setSelectedRowData([...addHHCT, { MaHang: '', TenHang: '', DonGia: 0, SoLuong: 1 }])
  }
  const removeRow = (index) => {
    const updatedBarcodes = [...NDCForm.DataDetails]
    updatedBarcodes.splice(index, 1)
    setSelectedRowData(updatedBarcodes)
    setNDCForm({
      ...NDCForm,
      DataDetails: updatedBarcodes,
    })
  }
  const title = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      fixed: 'left',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      fixed: 'left',
      width: 150,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'start',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      fixed: 'left',
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              textAlign: 'start',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      showSorterTooltip: false,
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.LapRap ? 1 : 0
        const valueB = b.LapRap ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className="justify-center" id={`LapRap_${record.key}`} checked={text} />,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'TonKho',
      key: 'TonKho',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.TonKho ? 1 : 0
        const valueB = b.TonKho ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className=" justify-center" id={`TonKho_${record.key}`} checked={text} />,
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'SoLuongTon',
      key: 'SoLuongTon',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTon - b.SoLuongTon,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>{formatCurrency(text)}</span>
      ),
    },
  ]
  return (
    <>
      <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
        <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
          <div className="flex flex-col gap-2 p-2 max-w-[70rem]">
            <div className="flex gap-2">
              <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
              <p className="text-blue-700 font-semibold uppercase">Thêm - Phiếu Nhập Điều Chỉnh</p>
            </div>
            <div className="flex flex-col gap-2 border-2 p-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <label className="required whitespace-nowrap min-w-[110px] flex justify-end">Số chứng từ</label>
                      <input
                        type="text"
                        className="px-2 w-full resize-none rounded border outline-none text-[1rem]"
                        name="SoChungTu"
                        value={NDCForm?.SoChungTu || ''}
                        onChange={(e) =>
                          setNDCForm({
                            ...NDCForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="required whitespace-nowrap">Ngày c.từ</label>
                      <DatePicker
                        className="DatePicker_NDCKho"
                        format="DD/MM/YYYY"
                        value={valueDate}
                        onChange={(values) => {
                          setNDCForm({ ...NDCForm, NgayCTu: dayjs(setValueDate(values)).format('YYYY-MM-DDTHH:mm:ss') })
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="required whitespace-nowrap min-w-[110px] flex justify-end">Kho hàng</label>
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      size="small"
                      value={NDCForm?.MaKho || ''}
                      onChange={(value) => {
                        setNDCForm({
                          ...NDCForm,
                          MaKho: value,
                        })
                      }}
                    >
                      {dataKhoHang &&
                        dataKhoHang?.map((item) => (
                          <Select.Option key={item.MaKho} value={item.MaKho}>
                            {item.ThongTinKho}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 px-4 border-2 py-3 border-black-200 rounded relative">
                  <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                  <div className="flex gap-1 items-center">
                    <label className="whitespace-nowrap">Người tạo</label>
                    <input className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label>Lúc</label>
                    <input className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label className="whitespace-nowrap">Người sửa</label>
                    <input className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label>Lúc</label>
                    <input className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <label className="whitespace-nowrap min-w-[110px] flex justify-end">Ghi chú</label>
                <input
                  type="text"
                  className="px-2 w-[70rem] resize-none rounded border outline-none text-[1rem]"
                  name="GhiChu"
                  value={NDCForm?.GhiChu || ''}
                  onChange={(e) =>
                    setNDCForm({
                      ...NDCForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
              <div className="border-2 p-2 rounded m-1 flex flex-col gap-2 max-h-[20rem] overflow-y-auto">
                <div className="flex justify-center text-xs text-blue-700 font-bold">Nhấn F9 để chọn mã hàng từ danh sách</div>
                <div className="flex gap-2 items-center">
                  <table className="barcodeList ">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th className="w-[10rem]">Mã hàng</th>
                        <th className="w-[22rem]">Tên hàng</th>
                        <th>Đơn giá</th>
                        <th className="w-[12rem]">Số lượng</th>
                        <th className="w-[3rem]"></th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {selectedRowData?.map((item, index) => (
                        <tr key={item.MaHang}>
                          <td>
                            <div className="flex justify-center">{index + 1}</div>
                          </td>
                          <td>
                            <div className="flex justify-center">{item.MaHang}</div>
                          </td>
                          <td>
                            <div>
                              <Select
                                className="max-w-[22rem]"
                                showSearch
                                size="small"
                                value={item.TenHang}
                                style={{
                                  width: '100%',
                                }}
                                onChange={(value) => handleChange(index, 'TenHang', value)}
                              >
                                {dataHangHoa?.map((hangHoa) => (
                                  <>
                                    <Select.Option key={hangHoa.TenHang} value={hangHoa.MaHang} className="flex items-center max-w-[25rem]">
                                      <p className="text-start truncate">{hangHoa.TenHang}</p>
                                    </Select.Option>
                                  </>
                                ))}
                              </Select>
                            </div>
                          </td>
                          <td>
                            <div className="flex justify-end">{formatThapPhan(item.DonGia, dataThongSo.SOLEDONGIA)}</div>
                          </td>
                          <td>
                            <div className="inputNDC flex justify-end">
                              <InputNumber
                                value={item.SoLuong}
                                min={1}
                                max={999999999999}
                                size="small"
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => {
                                  const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                  return isNaN(parsedValue) ? null : parsedValue.toFixed(dataThongSo.SOLESOLUONG)
                                }}
                                onChange={(value) => handleChange(index, 'SoLuong', value)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="flex justify-center">
                              <IoMdClose className="hover:text-red-600 w-6 h-6" onClick={() => removeRow(index)} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <ActionButton handleAction={addHangHoaCT} title={'Thêm'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <ActionButton handleAction={handleCreate} title={'Lưu'} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
              <ActionButton
                handleAction={(e) => handleCreate(e, false)}
                title={'Lưu & Đóng'}
                color={'slate-50'}
                background={'blue-500'}
                color_hover={'blue-500'}
                bg_hover={'white'}
              />
              <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
            </div>
          </div>
        </div>
      </div>
      <div>
        {isShowModal && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[80rem] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden z-10">
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase">Danh Sách Hàng Hóa - Phiếu Nhập Điều Chỉnh</p>
              </div>
              <div className="border-2">
                <div className=" p-2 rounded m-1 flex flex-col gap-2 max-h-[35rem]  ">
                  <div className="flex w-[20rem] overflow-hidden  relative ">
                    <FaSearch className="absolute left-[0.5rem] top-2.5 hover:text-red-400 cursor-pointer" />
                    <input
                      type="text"
                      placeholder="Nhập ký tự bạn cần tìm"
                      onChange={handleSearch}
                      className="px-[2rem] py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] outline-none text-[1rem]  "
                    />
                  </div>
                  <Table
                    className="table_DLPhieuNDC"
                    columns={title}
                    dataSource={filteredHangHoa}
                    onRow={(record) => ({
                      onDoubleClick: () => {
                        handleChoose(record)
                      },
                    })}
                    size="small"
                    scroll={{
                      x: 900,
                      y: 400,
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '24px',
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <ActionButton handleAction={() => setIsShowModal(false)} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NDCCreate
