/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useSearch } from '../../hooks_T/Search'
import { Checkbox, Table, Tooltip } from 'antd'
import HangHoaModals from '../../components_T/Modal/DanhMuc/HangHoa/HangHoaModals'
import categoryAPI from '../../API/linkAPI'
import moment from 'moment'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { MdEdit, MdDelete, MdOutlineGroupAdd } from 'react-icons/md'
import { TfiMoreAlt } from 'react-icons/tfi'
import { GrStatusUnknown } from 'react-icons/gr'
import { CiBarcode } from 'react-icons/ci'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { RETOKEN } from '../../action/Actions'

const HangHoa = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataHangHoa, setDataHangHoa] = useState()
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataHangHoa)
  const [isMaHang, setIsMaHang] = useState()
  const [isShowModal, setIsShowModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [isShowOption, setIsShowOption] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [pageSize, setPageSize] = useState('10')
  const [page, setPage] = useState('1')

  const getListHangHoa = async () => {
    try {
      const response = await categoryAPI.HangHoa(TokenAccess)
      if (response.data.DataError === 0) {
        setDataHangHoa(response.data.DataResults)
        setIsLoading(true)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getListHangHoa()
      } else {
        setIsLoading(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getListHangHoa()
  }, [getListHangHoa, isLoading])

  const handleCreate = () => {
    setActionType('create')
    setIsShowModal(true)
    getListHangHoa()
    setIsMaHang([])
  }
  const handleDelete = (record) => {
    setActionType('delete')
    setIsShowModal(true)
    setIsMaHang(record)
    getListHangHoa()
  }
  const handleView = (record) => {
    setActionType('view')
    setIsMaHang(record)
    setIsShowModal(true)
  }
  const handleUpdate = (record) => {
    setActionType('edit')
    setIsMaHang(record)
    setIsShowModal(true)
  }
  const handleStatusMany = () => {
    if (selectedRowKeys.length > 0) {
      setActionType('statusMany')
      setIsShowModal(true)
      setIsMaHang(selectedRowKeys)
    } else {
      toast.warning('Vui Lòng Chọn Mã Hàng Muốn Đổi')
    }
  }
  const handleGroupMany = () => {
    if (selectedRowKeys.length > 0) {
      setActionType('groupMany')
      setIsShowModal(true)
      setIsMaHang(selectedRowKeys)
    } else {
      toast.warning('Vui Lòng Chọn Mã Hàng Muốn Đổi')
    }
  }
  const handlePrintBar = () => {
    setActionType('print')
    setIsShowModal(true)
  }
  const handlePrintABarcode = async (record) => {
    try {
      if (record) {
        const response = await categoryAPI.InMaVach(
          {
            CodeValue2From: record.MaHang,
            CodeValue2To: record.MaHang,
            SoTem: 1,
          },
          TokenAccess,
        )
        if (response.data.DataError === 0) {
          const decodedData = atob(response.data.DataResults)
          const arrayBuffer = new ArrayBuffer(decodedData.length)
          const uint8Array = new Uint8Array(arrayBuffer)
          for (let i = 0; i < decodedData.length; i++) {
            uint8Array[i] = decodedData.charCodeAt(i)
          }
          const blob = new Blob([arrayBuffer], {
            type: 'application/pdf',
          })
          const dataUrl = URL.createObjectURL(blob)
          const newWindow = window.open(dataUrl, '_blank')
          newWindow.onload = function () {
            newWindow.print()
          }
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrintABarcode()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      } else {
        const response = await categoryAPI.InMaVach(
          {
            CodeValue2List: selectedRowKeys.map((key) => key.toString()).join(','),
            SoTem: 1,
          },
          TokenAccess,
        )
        if (response.data.DataError === 0) {
          const decodedData = atob(response.data.DataResults)
          const arrayBuffer = new ArrayBuffer(decodedData.length)
          const uint8Array = new Uint8Array(arrayBuffer)
          for (let i = 0; i < decodedData.length; i++) {
            uint8Array[i] = decodedData.charCodeAt(i)
          }
          const blob = new Blob([arrayBuffer], {
            type: 'application/pdf',
          })
          const dataUrl = URL.createObjectURL(blob)
          const newWindow = window.open(dataUrl, '_blank')
          newWindow.onload = function () {
            newWindow.print()
          }
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handlePrintABarcode()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value)
  }
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN')
  }
  const handleRowClick = (record) => {
    const isSelected = selectedRowKeys.includes(record.key)
    const newSelectedRowKeys = isSelected ? selectedRowKeys.filter((key) => key !== record.key) : [...selectedRowKeys, record.key]
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const titles = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      fixed: 'left',
      width: 50,
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
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      fixed: 'left',
      width: 220,
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
      title: 'Tên nhóm',
      dataIndex: 'TenNhom',
      key: 'TenNhom',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TenNhom.localeCompare(b.TenNhom),
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
      title: 'Đơn vị tính',
      dataIndex: 'DVTKho',
      key: 'DVTKho',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVTKho.localeCompare(b.DVTKho),
    },
    {
      title: 'Quy đổi Đơn vị tính',
      dataIndex: 'DienGiaiDVTQuyDoi',
      key: 'DienGiaiDVTQuyDoi',
      align: 'center',
      sorter: (a, b) => a.DienGiaiDVTQuyDoi - b.DienGiaiDVTQuyDoi,
      render: (text) => <span className="flex text-start">{text}</span>,
    },
    {
      title: 'Mã vạch',
      dataIndex: 'MaVach',
      key: 'MaVach',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.MaVach - b.MaVach,
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 100,
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
      width: 100,
      sorter: (a, b) => {
        const valueA = a.TonKho ? 1 : 0
        const valueB = b.TonKho ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className=" justify-center" id={`TonKho_${record.key}`} checked={text} />,
    },
    {
      title: 'Giá bán lẻ',
      dataIndex: 'GiaBanLe',
      key: 'GiaBanLe',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.GiaBanLe - b.GiaBanLe,
      render: (text) => <span className={`flex justify-end  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''}`}>{formatCurrency(text)}</span>,
    },
    {
      title: 'Bảng số giá',
      dataIndex: 'BangGiaSi',
      key: 'BangGiaSi',
      width: 120,
      sorter: (a, b) => a.BangGiaSi - b.BangGiaSi,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>{formatCurrency(text)}</span>
      ),
    },
    {
      title: 'Giá sỉ thấp',
      dataIndex: 'BangGiaSi_Min',
      key: 'BangGiaSi_Min',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.BangGiaSi_Min - b.BangGiaSi_Min,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>{formatCurrency(text)}</span>
      ),
    },
    {
      title: 'Giá sỉ cao',
      dataIndex: 'BangGiaSi_Max',
      key: 'BangGiaSi_Max',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.BangGiaSi_Max - b.BangGiaSi_Max,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>{formatCurrency(text)}</span>
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
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss.SS'),
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      sorter: (a, b) => a.NguoiSuaCuoi.localeCompare(b.NguoiSuaCuoi),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => {
        if (text) {
          return moment(text).format('DD/MM/YYYY HH:mm:ss.SS')
        } else {
          return ''
        }
      },
    },
    {
      title: 'Ngưng dùng',
      dataIndex: 'NA',
      key: 'NA',
      width: 120,
      align: 'center',
      sorter: (a, b) => {
        const valueA = a.NA ? 1 : 0
        const valueB = b.NA ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className="justify-center" id={`NA_${record.key}`} checked={text} />,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (record) => {
        return (
          <>
            {/* <div className="flex gap-2 items-center justify-center">
              <div
                className="p-1.5 rounded-md border-2 cursor-pointer  hover:bg-slate-50 hover:text-yellow-400 border-yellow-400  bg-yellow-400  text-slate-50 "
                title="Sửa"
                onClick={() => handleUpdate(record)}
              >
                <MdEdit />
              </div>
              <div
                className="p-1.5 border-2 rounded-md cursor-pointer  hover:bg-slate-50 hover:text-purple-500  border-purple-500  bg-purple-500  text-slate-50 "
                title="In Mã Vạch"
                onClick={() => handlePrintABarcode(record)}
              >
                <CiBarcode />
              </div>
              <div
                className="p-1.5 border-2 rounded-md cursor-pointer  hover:bg-slate-50 hover:text-red-500  border-red-500  bg-red-500   text-slate-50 "
                title="Xóa"
                onClick={() => handleDelete(record)}
              >
                <MdDelete />
              </div>
            </div> */}
            <div className=" flex gap-1 items-center justify-center ">
              <div
                disabled="true"
                onClick={() => handleUpdate(record)}
                title="Sửa"
                className={`p-[3px] border rounded-md text-slate-50 ${
                  record.TTTienMat ? 'bg-gray-400 cursor-not-allowed' : 'border-blue-500 bg-blue-500 hover:bg-white hover:text-blue-500 cursor-pointer'
                }`}
              >
                <MdEdit size={16} />
              </div>
              <div
                onClick={() => handlePrintABarcode(record)}
                title="Sửa"
                className="p-[3px] border rounded-md text-slate-50 border-purple-500 bg-purple-500 hover:bg-white hover:text-purple-500 cursor-pointer"
              >
                <CiBarcode size={16} />
              </div>

              <div
                onClick={() => handleDelete(record)}
                title="Xóa"
                className="p-[3px]  border  border-red-500 rounded-md text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
              >
                <MdDelete size={16} />
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
        <SimpleBackdrop />
      ) : (
        <>
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between gap-2 relative">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black uppercase">Hàng Hóa</h1>
                  <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
                <div className="flex relative ">
                  {isShowSearch && (
                    <div className={`flex absolute left-[9rem] -top-8 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                      <input
                        type="text"
                        placeholder="Nhập ký tự bạn cần tìm"
                        onChange={handleSearch}
                        className={'px-2 py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                  <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                </div>
                {isShowOption && (
                  <div className="absolute flex flex-col gap-4 bg-slate-100 p-3  top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
                    <div
                      className="justify-center px-3 py-2 bg-purple-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-purple-600"
                      onClick={() => handlePrintBar()}
                    >
                      <div> In Mã Vạch</div>
                      <div>
                        <CiBarcode className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end ">
              <div className="flex gap-2">
                <div
                  className="px-2 py-1 rounded font-bold flex gap-1 items-center cursor-pointer border-2 hover:text-slate-50 hover:bg-blue-600 bg-slate-50 text-blue-600"
                  onClick={() => handleCreate()}
                >
                  <div> Thêm Sản Phẩm</div>
                  <div>
                    <IoMdAddCircleOutline className="w-6 h-6" />
                  </div>
                </div>
                <div
                  className="px-2 py-1 rounded font-bold flex gap-1 items-center cursor-pointer border-2 hover:text-slate-50 hover:bg-green-600 bg-slate-50 text-green-600"
                  onClick={() => handleStatusMany()}
                >
                  <div> Đổi Trạng Thái </div>
                  <div>
                    <GrStatusUnknown className="w-6 h-6" />
                  </div>
                </div>
                <div
                  className="px-2 py-1 rounded font-bold flex gap-1 items-center border-2 cursor-pointer hover:text-slate-50 hover:bg-orange-600 bg-slate-50 text-orange-600"
                  onClick={() => handleGroupMany()}
                >
                  <div> Đổi Nhóm Hàng </div>
                  <div>
                    <MdOutlineGroupAdd className="w-6 h-6" />
                  </div>
                </div>
                <div
                  className="px-2 py-1  rounded font-bold flex gap-1 items-center cursor-pointer border-2 bg-slate-50 text-purple-600  hover:bg-purple-600 hover:text-slate-50"
                  onClick={() => handlePrintABarcode()}
                >
                  <div> In Mã Vạch </div>
                  <div>
                    <CiBarcode className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  showSizeChanger: true,
                  onChange: (selectedKeys) => {
                    setSelectedRowKeys(selectedKeys)
                  },
                }}
                rowKey={(record) => record.MaHang}
                onRow={(record) => ({
                  onClick: () => {
                    handleRowClick(record)
                    const selected = selectedRowKeys.includes(record.MaHang)
                    if (selected) {
                      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.MaHang))
                    } else {
                      setSelectedRowKeys([...selectedRowKeys, record.MaHang])
                    }
                  },
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                className="table_DMHangHoa"
                columns={titles}
                dataSource={filteredHangHoa}
                size="small"
                scroll={{
                  x: 3000,
                  y: 400,
                }}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  onChange: (page, pageSize) => {
                    setPage(page), setPageSize(pageSize)
                  },
                }}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '24px',
                }}
              />
            </div>
          </div>
          <div>{isShowModal && <HangHoaModals type={actionType} close={() => setIsShowModal(false)} getMaHang={isMaHang} getDataHangHoa={dataHangHoa} />}</div>
        </>
      )}
    </>
  )
}

export default HangHoa
