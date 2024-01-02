/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Tooltip } from 'antd'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FaSearch } from 'react-icons/fa'
import { useSearch } from '../../../../components_T/hooks/Search'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { MdEdit, MdDelete, MdPrint, MdFilterListAlt } from 'react-icons/md'
import categoryAPI from '../../../../API/linkAPI'
import dayjs from 'dayjs'
import { RETOKEN } from '../../../../action/Actions'
import NDCXem from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCXem'
import NDCXoa from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCXoa'
import NDCPrint from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCPrint'
import NDCCreate from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCCreate'
import NDCEdit from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCEdit'

const PhieuNhapDieuChinh = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataNDC, setDataNDC] = useState('')
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataNDC)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isDataKhoDC, setIsDataKhoDC] = useState('')
  const [khoanNgayFrom, setKhoanNgayFrom] = useState('')
  const [khoanNgayTo, setKhoanNgayTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState('')
  const [pageSize, setPageSize] = useState('10')
  const [page, setPage] = useState('1')
  const [dataThongSo, setDataThongSo] = useState('')

  function formatDateTime(inputDate, includeTime = false) {
    const date = new Date(inputDate)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    let formattedDateTime = `${day}/${month}/${year}`
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      formattedDateTime += ` ${hours}:${minutes}:${seconds} `
    }
    return formattedDateTime
  }
  const formatSLSL = (number) => {
    return number.toFixed(Math.max(1, dataThongSo.SOLESOLUONG)).replace(/,/g, '.')
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
  const getDataNDCFirst = async () => {
    try {
      if (isLoading == true) {
        const response = await categoryAPI.GetDataNDC({}, TokenAccess)
        if (response.data.DataError == 0) {
          setDataNDC(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataNDCFirst()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDataNDCFirst()
    getTimeSetting()
    getThongSo()
    getDataNDC()
  }, [isLoading])

  const getDataNDC = async () => {
    try {
      const response = await categoryAPI.GetDataNDC(
        {
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayTo,
        },
        TokenAccess,
      )
      if (response.data.DataError == 0) {
        setDataNDC(response.data.DataResults)
        setIsLoading(true)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDataNDC()
      } else {
        toast.error(response.data.DataErrorDescription)
        setIsLoading(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getTimeSetting = async () => {
    try {
      const response = await categoryAPI.KhoanNgay(TokenAccess)
      if (response.data.DataError == 0) {
        setKhoanNgayFrom(response.data.NgayBatDau)
        setKhoanNgayTo(response.data.NgayKetThuc)
        setIsLoading(true)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getTimeSetting()
      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
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
  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value)
  }
  const handleCreate = () => {
    setIsShowModal(true)
    setActionType('create')
  }
  const handleEdit = (record) => {
    setIsShowModal(true)
    setActionType('edit')
    setIsDataKhoDC(record)
  }
  const handleView = (record) => {
    setIsShowModal(true)
    setIsDataKhoDC(record)
    setActionType('view')
  }
  const handleDelete = (record) => {
    setIsShowModal(true)
    setIsDataKhoDC(record)
    setActionType('delete')
  }
  const handlePrint = () => {
    setIsShowModal(true)
    setActionType('print')
  }
  const titles = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      with: 10,
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      align: 'center',
      fixed: 'left',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => <span className="flex ">{text}</span>,
    },
    {
      title: 'Ngày chứng từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      width: 150,
      align: 'center',
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{formatDateTime(text)}</span>,
    },
    {
      title: 'Thông tin kho',
      dataIndex: 'ThongTinKho',
      key: 'ThongTinKho',
      width: 180,
      align: 'center',
      sorter: (a, b) => a.ThongTinKho.localeCompare(b.ThongTinKho),
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
      title: 'Số mặt hàng',
      dataIndex: 'SoMatHang',
      key: 'SoMatHang',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.SoMatHang - b.SoMatHang,
      render: (text) => <span className="flex justify-end">{formatCurrency(text)}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
      render: (text) => <span className="flex justify-end">{formatThapPhan(text, dataThongSo.SOLESOLUONG)}</span>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      align: 'center',
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              justifyContent: 'start',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      align: 'center',
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{formatDateTime(text, true)}</span>,
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      sorter: (a, b) => {
        if (!a.NguoiSuaCuoi || !b.NguoiSuaCuoi) {
          return null
        }
        return a.NguoiSuaCuoi.localeCompare(b.NguoiSuaCuoi)
      },
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Sửa lúc',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',

      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{formatDateTime(text, true)}</span>,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className="flex gap-2 items-center justify-center">
              <div
                className="p-[3px] border-2 rounded cursor-pointer hover:bg-slate-50 hover:text-yellow-400 border-yellow-400 bg-yellow-400 text-slate-50 "
                title="Sửa"
                onClick={() => handleEdit(record)}
              >
                <MdEdit />
              </div>
              <div
                className="p-[3px] border-2 rounded cursor-pointer hover:bg-slate-50 hover:text-red-500 border-red-500 bg-red-500 text-slate-50 "
                title="Xóa"
                onClick={() => handleDelete(record)}
              >
                <MdDelete />
              </div>
            </div>
          </>
        )
      },
    },
  ]
  return (
    <>
      {!isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between gap-2 relative">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold uppercase">Phiếu Nhập Kho Điều Chỉnh</h1>
                  <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
                <div className="flex relative ">
                  {isShowSearch && (
                    <div className={`flex absolute left-[19rem] -top-8 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                      <input
                        type="text"
                        placeholder="Nhập ký tự bạn cần tìm"
                        onChange={handleSearch}
                        className={'px-2 py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] outline-none text-[1rem] '}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="flex items-center gap-1">
                    <label>Từ</label>
                    <DatePicker
                      className="DatePicker_NXTKho"
                      format="DD/MM/YYYY"
                      maxDate={dayjs(khoanNgayTo)}
                      defaultValue={dayjs(khoanNgayFrom, 'YYYY-MM-DD')}
                      onChange={(values) => {
                        setKhoanNgayFrom(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                      }}
                    />
                  </div>
                  <div className=" flex items-center gap-1 ">
                    <label>-</label>
                    <DatePicker
                      className="DatePicker_NXTKho"
                      format="DD/MM/YYYY"
                      minDate={dayjs(khoanNgayFrom)}
                      defaultValue={dayjs(khoanNgayTo, 'YYYY-MM-DD')}
                      onChange={(values) => {
                        setKhoanNgayTo(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={getDataNDC}
                  className="flex items-center justify-center gap-1 rounded px-2 py-1 font-semibold border-2 text-slate-50 border-blue-500 bg-blue-500 hover:bg-white hover:text-blue-500 whitespace-nowrap"
                >
                  <MdFilterListAlt />
                  <p>Lọc</p>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="px-2 py-1 rounded font-medium flex gap-1 items-center cursor-pointer border-2 bg-blue-500 text-slate-50 border-blue-500 hover:bg-slate-50 hover:text-blue-600"
                  onClick={handleCreate}
                >
                  <div>
                    <IoMdAddCircleOutline className="w-6 h-6" />
                  </div>
                  <p> Thêm Sản Phẩm</p>
                </div>
                <div
                  className="px-2 py-1 rounded font-medium flex gap-1 items-center cursor-pointer border-2 bg-purple-600 text-slate-50 border-purple-600 hover:bg-slate-50 hover:text-purple-600"
                  onClick={handlePrint}
                >
                  <div>
                    <MdPrint className="w-6 h-6" />
                  </div>
                  <div>In Phiếu</div>
                </div>
              </div>
            </div>
            <div>
              <Table
                className="table_DMHangHoa"
                columns={titles}
                dataSource={filteredHangHoa}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  showSizeChanger: true,
                  onChange: (page, pageSize) => {
                    setPage(page), setPageSize(pageSize)
                  },
                }}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                size="small"
                scroll={{
                  x: 1800,
                  y: 400,
                }}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '24px',
                }}
              />
            </div>
          </div>
          <div>
            {isShowModal &&
              (actionType == 'create' ? (
                <NDCCreate close={() => setIsShowModal(false)} />
              ) : actionType == 'view' ? (
                <NDCXem close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} />
              ) : actionType == 'edit' ? (
                <NDCEdit close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} />
              ) : actionType == 'delete' ? (
                <NDCXoa close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} />
              ) : actionType == 'print' ? (
                <NDCPrint close={() => setIsShowModal(false)} />
              ) : null)}
          </div>
        </>
      )}
    </>
  )
}

export default PhieuNhapDieuChinh
