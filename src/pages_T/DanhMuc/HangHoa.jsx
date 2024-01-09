/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { useSearch } from '../../components_T/hooks/Search'
import { Checkbox, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
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
import ActionButton from '../../components/util/Button/ActionButton'
import HighlightedCell from '../../components_T/hooks/HighlightedCell'

const HangHoa = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataHangHoa, setDataHangHoa] = useState()
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataHangHoa)
  const [isMaHang, setIsMaHang] = useState()
  const [isShowModal, setIsShowModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [isShowOption, setIsShowOption] = useState(false)
  const showOption = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [dataThongSo, setDataThongSo] = useState('')

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
    getThongSo()
  }, [isLoading])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOption.current && !showOption.current.contains(event.target)) {
        setIsShowOption(false)
        setIsShowSearch(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleLoading = () => {
    setIsLoading(false)
  }
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
      toast.warning('Vui Lòng Chọn Mã Hàng Muốn Đổi', { autoClose: 1000 })
    }
  }
  const handleGroupMany = () => {
    if (selectedRowKeys.length > 0) {
      setActionType('groupMany')
      setIsShowModal(true)
      setIsMaHang(selectedRowKeys)
    } else {
      toast.warning('Vui Lòng Chọn Mã Hàng Muốn Đổi', { autoClose: 1000 })
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
          toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
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
          toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
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
    return Number(value).toLocaleString('en-US')
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
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
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      fixed: 'left',
      width: 220,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
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
            <HighlightedCell text={text} search={searchHangHoa} />
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
      showSorterTooltip: false,
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
            <HighlightedCell text={text} search={searchHangHoa} />
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
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Quy đổi Đơn vị tính',
      dataIndex: 'DienGiaiDVTQuyDoi',
      key: 'DienGiaiDVTQuyDoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.DienGiaiDVTQuyDoi - b.DienGiaiDVTQuyDoi,
      render: (text) => (
        <span className="flex text-start">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Mã vạch',
      dataIndex: 'MaVach',
      key: 'MaVach',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.MaVach - b.MaVach,
      showSorterTooltip: false,
      render: (text) => <HighlightedCell text={text} search={searchHangHoa} />,
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 100,
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
      width: 100,
      showSorterTooltip: false,
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
      showSorterTooltip: false,
      sorter: (a, b) => a.GiaBanLe - b.GiaBanLe,
      render: (text) => (
        <span className={`flex justify-end  ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLEDONGIA)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Bảng số giá',
      dataIndex: 'BangGiaSi',
      key: 'BangGiaSi',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.BangGiaSi - b.BangGiaSi,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatCurrency(text)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Giá sỉ thấp',
      dataIndex: 'BangGiaSi_Min',
      key: 'BangGiaSi_Min',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.BangGiaSi_Min - b.BangGiaSi_Min,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLEDONGIA)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Giá sỉ cao',
      dataIndex: 'BangGiaSi_Max',
      key: 'BangGiaSi_Max',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.BangGiaSi_Max - b.BangGiaSi_Max,
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(Number(text), dataThongSo.SOLEDONGIA)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      align: 'center',
      showSorterTooltip: false,
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
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss.SS')} search={searchHangHoa} />,
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      ellipsis: 'true',
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => {
        if (text) {
          return <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss.SS')} search={searchHangHoa} />
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
      showSorterTooltip: false,
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
            <div className=" flex gap-1 items-center justify-center ">
              <div
                onClick={() => handleUpdate(record)}
                title="Sửa"
                className="p-[4px] border-2 rounded text-slate-50 border-yellow-400 bg-yellow-400 hover:bg-white hover:text-yellow-400 cursor-pointer"
              >
                <MdEdit />
              </div>
              <div
                onClick={() => handlePrintABarcode(record)}
                title="Sửa"
                className="p-[4px] border-2 rounded text-slate-50 border-purple-500 bg-purple-500 hover:bg-white hover:text-purple-500 cursor-pointer"
              >
                <CiBarcode />
              </div>

              <div
                onClick={() => handleDelete(record)}
                title="Xóa"
                className="p-[4px] border-2 border-red-500 rounded text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
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
        <SimpleBackdrop />
      ) : (
        <>
          <div className="flex flex-col gap-1 ">
            <div className="flex justify-between gap-2 relative" ref={showOption}>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black uppercase">Hàng Hóa</h1>
                  <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
                <div className="flex relative ">
                  {isShowSearch && (
                    <div className={`flex absolute left-[9rem] -top-8 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                      <input
                        value={searchHangHoa}
                        type="text"
                        placeholder="Nhập ký tự bạn cần tìm"
                        onChange={handleSearch}
                        className={'px-2 py-1 w-[20rem] border-slate-200 resize-none rounded-[0.5rem] border-[1px] hover:border-blue-500 outline-none text-[1rem] '}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                  <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                </div>
                {isShowOption && (
                  <div className="absolute flex flex-col gap-4 bg-slate-100 p-3 top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
                    <ActionButton
                      handleAction={() => handlePrintBar()}
                      title={'In Theo Số Tem'}
                      icon={<CiBarcode className="w-6 h-6" />}
                      color={'slate-50'}
                      background={'purple-500'}
                      color_hover={'purple-500'}
                      bg_hover={'white'}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end ">
              <div className="flex gap-2">
                <ActionButton
                  handleAction={() => handleCreate()}
                  title={'Thêm Sản Phẩm'}
                  icon={<IoMdAddCircleOutline className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
                <ActionButton
                  handleAction={() => handleStatusMany()}
                  title={'Đổi Trạng Thái'}
                  icon={<GrStatusUnknown className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
                <ActionButton
                  handleAction={() => handleGroupMany()}
                  title={'Đổi Nhóm Hàng'}
                  icon={<MdOutlineGroupAdd className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
                <ActionButton
                  handleAction={() => handlePrintABarcode()}
                  title={'In Mã Vạch '}
                  icon={<CiBarcode className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'purple-500'}
                  color_hover={'purple-500'}
                  bg_hover={'slate-50'}
                />
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
                className="setHeight"
                columns={titles}
                dataSource={filteredHangHoa.map((item, index) => ({
                  ...item,
                  modifiedIndex: index + 1,
                }))}
                size="small"
                scroll={{
                  x: 3000,
                  y: 400,
                }}
                pagination={{ defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '1000'] }}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '24px',
                }}
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        <Table.Summary.Cell className=" bg-gray-100"></Table.Summary.Cell>
                        {titles
                          .filter((column) => column.render)
                          .map((column) => {
                            const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] === 'number'
                            return (
                              <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                {isNumericColumn ? (
                                  column.dataIndex === 'GiaBanLe' || column.dataIndex === 'BangGiaSi_Min' || column.dataIndex === 'BangGiaSi_Max' ? (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLEDONGIA,
                                        maximumFractionDigits: dataThongSo.SOLEDONGIA,
                                      })}
                                    </Text>
                                  ) : (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      })}
                                    </Text>
                                  )
                                ) : null}
                              </Table.Summary.Cell>
                            )
                          })}
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                }}
              />
            </div>
          </div>
          <div>
            {isShowModal && <HangHoaModals type={actionType} close={() => setIsShowModal(false)} getMaHang={isMaHang} getDataHangHoa={dataHangHoa} loadingData={handleLoading} />}
          </div>
        </>
      )}
    </>
  )
}

export default HangHoa
