/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import logo from '../../../../../assets/VTS-iSale.ico'
import { useEffect, useState } from 'react'
import categoryAPI from '../../../../../API/linkAPI'
import { RETOKEN } from '../../../../../action/Actions'
import './style/NDCCreate.css'
import { Checkbox, Table, Tooltip } from 'antd'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { IoMdClose } from 'react-icons/io'
import { useSearch } from '../../../../hooks/Search'

const NDCCreate = ({ close }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataKhoHang, setDataKhoHang] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState('')
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataHangHoa)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [valueDate, setValueDate] = useState(dayjs(new Date()))

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
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDataKhoHangNDC()
    getDataHangHoaNDC()
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
  const handleChange = (index, key, newValue) => {
    const newDataList = [...NDCForm.DataDetails]
    if (key === 'SoLuong') {
      newValue = parseInt(newValue)
    }
    newDataList[index][key] = newValue
    setSelectedRowData(newDataList)
    setNDCForm({ ...NDCForm, DataDetails: newDataList })
  }
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN')
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
  const handleCreate = async (e) => {
    e.preventDefault()
    console.log({ ...NDCForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss') })
    try {
      const response = await categoryAPI.NDCCreate({ ...NDCForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss') }, TokenAccess)
      if (response.data.DataError == 0) {
        toast.success('Tạo thành công')
      } else {
        console.log(NDCForm)
        toast.error('Tạo thất bại')
      }
    } catch (error) {
      console.log(error)
    }
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
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'NhomHang',
      key: 'NhomHang',

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
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVTKho.localeCompare(b.DVTKho),
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 120,
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
        <div onClick={close} className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
          <form className="flex flex-col gap-2 p-2 max-w-[70rem]" onSubmit={handleCreate}>
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
                        className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]"
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
                    <select
                      type="text"
                      name="MaKho"
                      value={NDCForm?.MaKho || ''}
                      className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis"
                      onChange={(e) => {
                        setNDCForm({
                          ...NDCForm,
                          [e.target.name]: e.target.value,
                        })
                      }}
                    >
                      <option value="" disabled hidden></option>
                      {dataKhoHang &&
                        dataKhoHang?.map((item) => (
                          <option key={item.MaKho} value={item.MaKho}>
                            {item.ThongTinKho}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 px-4 border-2 py-3 border-black-200 rounded relative">
                  <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                  <div className="flex gap-1 items-center">
                    <label className="whitespace-nowrap">Người tạo</label>
                    <input className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label>Lúc</label>
                    <input className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label className="whitespace-nowrap">Người sửa</label>
                    <input className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="flex gap-1 items-center">
                    <label>Lúc</label>
                    <input className="px-2 w-full resize-none border-[0.125rem] outline-none text-[1rem]" readOnly />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <label className="whitespace-nowrap min-w-[110px] flex justify-end">Ghi chú</label>
                <input
                  type="text"
                  className="px-2 w-[70rem] resize-none border-[0.125rem] outline-none text-[1rem]"
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
                <table className="barcodeList ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã hàng</th>
                      <th>Tên hàng</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {/* {NDCForm.DataDetails.map((item,index) => )} */}

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
                            <p className="block truncate">{item.TenHang}</p>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-end">{formatCurrency(item.DonGia)}</div>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <input
                              className="px-2 w-full resize-none border-[0.125rem]   outline-none text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis flex justify-end"
                              type="number"
                              defaultValue={item.SoLuong}
                              min={1}
                              onChange={(e) => handleChange(index, 'SoLuong', e.target.value)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center">
                            <IoMdClose className="hover:text-red-600" onClick={() => removeRow(index)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="rounded px-2 py-1.5 font-bold w-[100px] text-slate-50 bg-red-500 border-2 border-red-500 hover:text-red-500 hover:bg-white" onClick={close}>
                Đóng
              </button>
              <button className="rounded px-2 py-1.5 font-bold w-[100px] text-slate-50 bg-blue-600 border-2 border-blue-600 hover:text-blue-600 hover:bg-white" type="submit">
                Xác nhận
              </button>
            </div>
          </form>
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
                <button
                  className="rounded px-2 py-1.5 font-bold w-[100px] text-slate-50 bg-red-500 border-2 border-red-500 hover:text-red-500 hover:bg-white"
                  onClick={() => setIsShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NDCCreate
