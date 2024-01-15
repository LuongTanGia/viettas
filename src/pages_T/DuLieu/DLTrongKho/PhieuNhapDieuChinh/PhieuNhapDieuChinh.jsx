/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { Input, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FaSearch } from 'react-icons/fa'
import { useSearch } from '../../../../components_T/hooks/Search'
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
import ActionButton from '../../../../components/util/Button/ActionButton'
import HighlightedCell from '../../../../components_T/hooks/HighlightedCell'
import SimpleBackdrop from '../../../../components/util/Loading/LoadingPage'

const PhieuNhapDieuChinh = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const [dataNDC, setDataNDC] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataNDC)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isDataKhoDC, setIsDataKhoDC] = useState('')
  const [khoanNgayFrom, setKhoanNgayFrom] = useState('')
  const [khoanNgayTo, setKhoanNgayTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState('')
  const [dataThongSo, setDataThongSo] = useState('')
  const showOption = useRef(null)

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
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US')
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOption.current && !showOption.current.contains(event.target)) {
        setIsShowSearch(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
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
  const handleLoading = () => {
    setIsLoading(false)
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
      showSorterTooltip: false,
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => (
        <span className="flex ">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Ngày chứng từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={formatDateTime(text)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Thông tin kho',
      dataIndex: 'ThongTinKho',
      key: 'ThongTinKho',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
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
            <HighlightedCell text={text} search={searchHangHoa} />
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
      showSorterTooltip: false,
      sorter: (a, b) => a.SoMatHang - b.SoMatHang,
      render: (text) => (
        <span className="flex justify-end">
          <HighlightedCell text={formatCurrency(text)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
      render: (text) => (
        <span className="flex justify-end">
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => (a.GhiChu?.toString() || '').localeCompare(b.GhiChu?.toString() || ''),
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
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
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
              cursor: 'pointer',
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
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={formatDateTime(text, true)} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),

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
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Sửa lúc',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      showSorterTooltip: false,
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
                className="p-[4px] border-2 rounded cursor-pointer hover:bg-slate-50 hover:text-yellow-400 border-yellow-400 bg-yellow-400 text-slate-50 "
                title="Sửa"
                onClick={() => handleEdit(record)}
              >
                <MdEdit />
              </div>
              <div
                className="p-[4px] border-2 rounded cursor-pointer hover:bg-slate-50 hover:text-red-500 border-red-500 bg-red-500 text-slate-50 "
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
        <SimpleBackdrop />
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-2">
              <div ref={showOption}>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold uppercase">Phiếu Nhập Kho Điều Chỉnh</h1>
                  <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
                <div className="flex relative ">
                  {isShowSearch && (
                    <div className={`flex absolute left-[19rem] -top-8 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                      <Input
                        size="small"
                        value={searchHangHoa}
                        type="text"
                        placeholder="Nhập ký tự bạn cần tìm"
                        onChange={handleSearch}
                        className={'px-2 py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[1px] hover:border-blue-500 outline-none text-[1rem] '}
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
                      sx={{
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                      }}
                      onChange={(values) => {
                        setKhoanNgayTo(values ? dayjs(values).format('YYYY-MM-DDTHH:mm:ss') : '')
                      }}
                    />
                  </div>
                </div>
                <ActionButton
                  handleAction={getDataNDC}
                  title={'Lọc'}
                  icon={<MdFilterListAlt className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
              </div>
              <div className="flex items-center gap-2">
                <ActionButton
                  handleAction={handleCreate}
                  title={'Thêm Sản Phẩm'}
                  icon={<IoMdAddCircleOutline className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
                <ActionButton
                  handleAction={handlePrint}
                  title={'In Phiếu'}
                  icon={<MdPrint className="w-6 h-6" />}
                  color={'slate-50'}
                  background={'purple-500'}
                  color_hover={'purple-500'}
                  bg_hover={'white'}
                />
              </div>
            </div>
            <div>
              <Table
                className="table_DMHangHoa setHeight"
                columns={titles}
                dataSource={filteredHangHoa}
                pagination={{ defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '1000'] }}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                size="small"
                scroll={{
                  x: 2000,
                  y: 400,
                }}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '24px',
                }}
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        {titles
                          .filter((column) => column.render)
                          .map((column) => {
                            const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] === 'number'

                            return (
                              <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                {isNumericColumn ? (
                                  column.dataIndex === 'SoMatHang' ? (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      })}
                                    </Text>
                                  ) : (
                                    <Text strong>
                                      {Number(filteredHangHoa.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                        maximumFractionDigits: dataThongSo.SOLESOLUONG,
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
            {isShowModal &&
              (actionType == 'create' ? (
                <NDCCreate close={() => setIsShowModal(false)} loadingData={handleLoading} />
              ) : actionType == 'view' ? (
                <NDCXem close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} />
              ) : actionType == 'edit' ? (
                <NDCEdit close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} loadingData={handleLoading} />
              ) : actionType == 'delete' ? (
                <NDCXoa close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} loadingData={handleLoading} />
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
