/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import { TfiMoreAlt } from 'react-icons/tfi'
import { DateField } from '@mui/x-date-pickers'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { CloseSquareFilled } from '@ant-design/icons'
import { MdEdit, MdDelete, MdPrint } from 'react-icons/md'
import categoryAPI from '../../../../API/linkAPI'
import { useSearch } from '../../../../components_T/hooks/Search'
import { RETOKEN, exportToExcel } from '../../../../action/Actions'
import ActionButton from '../../../../components/util/Button/ActionButton'
import HighlightedCell from '../../../../components_T/hooks/HighlightedCell'
import SimpleBackdrop from '../../../../components/util/Loading/LoadingPage'
import NDCXem from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCXem'
import NDCXoa from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCXoa'
import NDCEdit from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCEdit'
import { nameColumsPhieuNhapDieuChinh } from '../../../../components/util/Table/ColumnName'
import NDCPrint from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCPrint'
import NDCCreate from '../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCCreate'

const PhieuNhapDieuChinh = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataNDC, setDataNDC] = useState('')
  const [isDataKhoDC, setIsDataKhoDC] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataNDC)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [khoanNgayFrom, setKhoanNgayFrom] = useState('')
  const [khoanNgayTo, setKhoanNgayTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [actionType, setActionType] = useState('')
  const showOption = useRef(null)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setcheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [dateData, setDateData] = useState({})
  const [targetRow, setTargetRow] = useState(null)

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setcheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataNDC ? dataNDC[0] : []).filter((key) => key)
    setOptions(key)
  }, [selectVisible])

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

  useEffect(() => {
    if (!isLoading) {
      getTimeSetting()
    }
  }, [isLoading])

  useEffect(() => {
    getDataNDC()
  }, [searchHangHoa, isLoading, targetRow, dateData.NgayBatDau, dateData.NgayKetThuc])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOption.current && !showOption.current.contains(event.target)) {
        setIsShowOption(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const getDataNDC = async () => {
    try {
      setTableLoad(true)
      if (isLoading == true) {
        const response = await categoryAPI.GetDataNDC(
          dateData == {}
            ? {}
            : {
                NgayBatDau: dateData.NgayBatDau,
                NgayKetThuc: dateData.NgayKetThuc,
              },
          TokenAccess,
        )
        if (response.data.DataError == 0) {
          setDataNDC(response.data.DataResults)
          setTableLoad(false)
        } else if (response.data.DataError == -104) {
          setDataNDC([])
          setTableLoad(false)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataNDC()
        }
      }
    } catch (error) {
      console.log(error)
      setTableLoad(false)
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
  let timerId
  const handleSearch = (event) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchHangHoa(event.target.value)
    }, 300)
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
    setTableLoad(true)
  }
  const handleHidden = () => {
    setSelectVisible(!selectVisible)
  }
  const onChange = (checkedValues) => {
    setcheckedList(checkedValues)
  }
  const onClickSubmit = () => {
    setTableLoad(true)
    setTimeout(() => {
      setHiddenRow(checkedList)
      setTableLoad(false)
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
    }, 1000)
  }
  const handleDateChange = () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      khoanNgayFrom, khoanNgayTo
      setDateData({
        NgayBatDau: khoanNgayFrom,
        NgayKetThuc: khoanNgayTo,
      })
    }, 300)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
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
  const newTitles = titles.filter((item) => !hiddenRow?.includes(item.dataIndex))

  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-2  relative">
              <div className="flex gap-1 ">
                <div className="flex items-center gap-2 py-0.5">
                  <h1 className="text-lg font-bold uppercase">Phiếu Nhập Kho Điều Chỉnh</h1>
                  <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
                {isShowSearch && (
                  <div className={`flex transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                    <Input
                      allowClear={{
                        clearIcon: <CloseSquareFilled />,
                      }}
                      placeholder="Nhập ký tự bạn cần tìm"
                      onBlur={handleSearch}
                      onPressEnter={handleSearch}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <div className="flex" ref={showOption}>
                <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                  <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                </div>
                {isShowOption && (
                  <div className="absolute flex flex-col gap-2 bg-slate-200 p-3 top-[12] right-[2.5%] rounded-lg z-10 duration-500 shadow-custom">
                    <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                      <ActionButton
                        handleAction={handlePrint}
                        title={'In Phiếu'}
                        icon={<MdPrint className="w-6 h-6" />}
                        color={'slate-50'}
                        background={'purple-500'}
                        color_hover={'purple-500'}
                        bg_hover={'white'}
                      />
                      <ActionButton
                        handleAction={() => exportToExcel()}
                        title={'Xuất Excel'}
                        icon={<RiFileExcel2Fill className="w-5 h-5" />}
                        color={'slate-50'}
                        background={'green-500'}
                        color_hover={'green-500'}
                        bg_hover={'white'}
                      />
                      <ActionButton
                        handleAction={() => handleHidden()}
                        title={'Ẩn Cột'}
                        icon={<FaEyeSlash className="w-5 h-5" />}
                        color={'slate-50'}
                        background={'red-500'}
                        color_hover={'red-500'}
                        bg_hover={'white'}
                      />
                    </div>
                    <div>
                      {selectVisible && (
                        <div>
                          <Checkbox.Group
                            style={{
                              width: '500px',
                              background: 'white',
                              padding: 10,
                              borderRadius: 10,
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            }}
                            className="flex flex-col"
                            defaultValue={checkedList}
                            onChange={onChange}
                          >
                            <Row>
                              {options.map((item) => (
                                <Col span={8} key={item}>
                                  <Checkbox value={item} checked={true}>
                                    {nameColumsPhieuNhapDieuChinh[item]}
                                  </Checkbox>
                                </Col>
                              ))}
                            </Row>
                            <Spin spinning={tableLoad}>
                              <Button className="mt-2 w-full" onClick={onClickSubmit}>
                                Xác Nhận
                              </Button>
                            </Spin>
                          </Checkbox.Group>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between gap-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="flex items-center gap-1">
                    <label>Từ</label>
                    <DateField
                      onBlur={handleDateChange}
                      onKeyDown={handleKeyDown}
                      className="DatePicker_NXTKho min-w-[100px] w-[60%]"
                      format="DD/MM/YYYY"
                      maxDate={dayjs(khoanNgayTo)}
                      defaultValue={dayjs(khoanNgayFrom, 'YYYY-MM-DD')}
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
                      onChange={(values) => {
                        const selectedDate = values ? dayjs(values).format('YYYY-MM-DDTHH:MM:ss') : ''
                        setKhoanNgayFrom(selectedDate)
                      }}
                    />
                  </div>
                  <div className=" flex items-center gap-1 ">
                    <label>Đến</label>
                    <DateField
                      onBlur={handleDateChange}
                      onKeyDown={handleKeyDown}
                      className="DatePicker_NXTKho min-w-[100px] w-[60%]"
                      format="DD/MM/YYYY"
                      minDate={dayjs(khoanNgayFrom)}
                      defaultValue={dayjs(khoanNgayTo, 'YYYY-MM-DD')}
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
                      onChange={(values) => {
                        const selectedDate = values ? dayjs(values).format('YYYY-MM-DDTHH:MM:ss') : ''
                        setKhoanNgayTo(selectedDate)
                      }}
                    />
                  </div>
                </div>
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
              </div>
            </div>
            <div id="my-table">
              <Table
                loading={tableLoad}
                className="table_DMHangHoa setHeight"
                columns={newTitles}
                dataSource={filteredHangHoa}
                pagination={{
                  defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                  showSizeChanger: true,
                  pageSizeOptions: ['50', '100', '1000'],
                  onShowSizeChange: (current, size) => {
                    localStorage.setItem('pageSize', size)
                  },
                }}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                rowClassName={(record) => (record.SoChungTu === targetRow ? 'highlighted-row' : '')}
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
                        {newTitles
                          .filter((column) => column.render)
                          .map((column, index) => {
                            const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] === 'number'

                            return (
                              <Table.Summary.Cell key={`summary-cell-${index + 1}`} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
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
                <NDCCreate close={() => setIsShowModal(false)} loadingData={handleLoading} targetRow={setTargetRow} />
              ) : actionType == 'view' ? (
                <NDCXem close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} />
              ) : actionType == 'edit' ? (
                <NDCEdit close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} loadingData={handleLoading} targetRow={setTargetRow} />
              ) : actionType == 'delete' ? (
                <NDCXoa close={() => setIsShowModal(false)} dataNDC={isDataKhoDC} loadingData={handleLoading} targetRow={setTargetRow} />
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
