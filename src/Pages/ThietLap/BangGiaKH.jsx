import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import { ModalTL } from '../../components_K'
import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSearchHH } from '../../components_K/myComponents/useSearchHH'

const { Text } = Typography
const { IoAddCircleOutline, MdDelete, BsSearch, TfiMoreAlt, MdEdit, FaEyeSlash, RiFileExcel2Fill, CgCloseO, TiThSmall } = icons
const BangGiaKH = () => {
  const navigate = useNavigate()
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)
  const [isLoadingEdit, setIsLoadingEdit] = useState(true)
  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowFull, setIsShowFull] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])
  const [dataFull, setDataFull] = useState([])
  const [dataThongTin, setDataThongTin] = useState({})

  const [dataRecord, setDataRecord] = useState(null)
  const [dataDoiTuong, setDataDoiTuong] = useState(null)
  const [dataNhomGia, setDataNhomGia] = useState(null)

  const [actionType, setActionType] = useState('')
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchGKH, filteredGKH, searchGKH] = useSearchHH(isShowFull ? dataFull : data)
  const [prevSearchValue, setPrevSearchValue] = useState('')

  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)

  // bỏ focus option thì hidden
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionContainerRef.current && !optionContainerRef.current.contains(event.target)) {
        // Click ngoài phần tử chứa isShowOption, ẩn isShowOption
        setIsShowOption(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isShowOption])

  // hide Columns
  useEffect(() => {
    setNewColumns(columns)
    // Lấy thông tin từ local storage sau khi đăng nhập
    const storedHiddenColumns = localStorage.getItem('hidenColumnGKH')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hidenColumnGKH')))
      setNewColumns(JSON.parse(localStorage.getItem('hidenColumnGKH')))
    }
  }, [confirmed])

  // get helper
  useEffect(() => {
    setIsLoadingModal(true)
    setIsLoadingEdit(true)
    const fetchData = async () => {
      try {
        console.log('get helper')
        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'create' || actionType === 'edit') {
          console.log('get helper  KH,DT')
          const responseDT = await apis.ListHelperDTGKH(tokenLogin)
          if (responseDT.data && responseDT.data.DataError === 0) {
            setDataDoiTuong(responseDT.data.DataResults)
            setIsLoadingModal(false)
          } else if (responseDT.data.DataError === -1 || responseDT.data.DataError === -2 || responseDT.data.DataError === -3) {
            toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{responseDT.data.DataErrorDescription}</div>)
            setIsLoadingModal(false)
          } else if (responseDT.data.DataError === -107 || responseDT.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseDT.data.DataErrorDescription)
            setIsLoadingModal(false)
          }
          const responseNG = await apis.ListHelperNGGKH(tokenLogin)
          if (responseNG.data && responseNG.data.DataError === 0) {
            setDataNhomGia(responseNG.data.DataResults)
            setIsLoadingModal(false)
          } else if (responseNG.data.DataError === -1 || responseNG.data.DataError === -2 || responseNG.data.DataError === -3) {
            toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{responseNG.data.DataErrorDescription}</div>)
            setIsLoadingModal(false)
          } else if (responseNG.data.DataError === -107 || responseNG.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseNG.data.DataErrorDescription)
            setIsLoadingModal(false)
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        setIsLoadingModal(false)
        // setIsShowModal(false)
        setIsLoadingEdit(false)

        // toast.error('Lấy data thất bại. Vui lòng thử lại sau.')
      }
    }

    if (isShowModal) {
      fetchData()
    }
  }, [isShowModal])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        console.log('đi')
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'ThietLap_GiaLe')

        if (response.data && response.data.DataError === 0) {
          setDataQuyenHan(response.data)
        }
        // else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        //   toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        // }
        else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getChucNangQuyenHan()
        }
        // else {
        //   toast.error(response.data.DataErrorDescription)
        // }
      } catch (error) {
        console.error('Kiểm tra token thất bại', error)
      }
    }

    getChucNangQuyenHan()
  }, [])
  useEffect(() => {
    if (dataQuyenHan?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataQuyenHan])
  //get DSGKH
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.VIEW) {
      if (isShowFull) {
        getDSFullGKH()
      } else {
        getDSGKH()
      }
      // getDSFullGKH()
      // getDSGKH()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  const getDSGKH = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachGKH(tokenLogin)

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSGKH()
        // setTableLoad(false)
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        setTableLoad(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setData([])
        setTableLoad(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(false)
    }
  }
  const getDSFullGKH = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachFullGKH(tokenLogin)

      if (response.data && response.data.DataError === 0) {
        setDataFull(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSGKH()
        // setTableLoad(false)
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        setTableLoad(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setDataFull([])
        setTableLoad(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(false)
    }
  }

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
      title: 'Mã khách hàng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchGKH} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 150,

      sorter: (a, b) => a.TenDoiTuong.localeCompare(b.TenDoiTuong),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchGKH} />
        </div>
      ),
    },

    {
      title: 'Hiệu lực từ',
      dataIndex: 'HieuLucTu',
      key: 'HieuLucTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchGKH} />,
      width: 120,
      sorter: (a, b) => {
        const dateA = new Date(a.HieuLucTu)
        const dateB = new Date(b.HieuLucTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Ghi chú ',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      width: 200,
      sorter: (a, b) => {
        const GhiChuA = a.GhiChu || ''
        const GhiChuB = b.GhiChu || ''
        return GhiChuA.localeCompare(GhiChuB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchGKH} />
        </div>
      ),
    },

    {
      title: 'Nhóm giá',
      dataIndex: 'ThongTinNhomGia',
      key: 'ThongTinNhomGia',
      width: 250,

      sorter: (a, b) => a.ThongTinNhomGia.localeCompare(b.ThongTinNhomGia),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchGKH} />
            </span>
          </Tooltip>
        </div>
      ),
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY hh:mm:ss')} search={searchGKH} />,
      width: 200,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 250,
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchGKH} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null} search={searchGKH} />,
      width: 200,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Người sửa cuối',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      width: 250,
      sorter: (a, b) => {
        const NguoiSuaCuoiA = a.NguoiSuaCuoi || ''
        const NguoiSuaCuoiB = b.NguoiSuaCuoi || ''

        return NguoiSuaCuoiA.localeCompare(NguoiSuaCuoiB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchGKH} />
        </div>
      ),
    },

    {
      title: 'Chức năng',
      key: 'ChucNang',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center  ">
              <div
                onClick={() => (dataQuyenHan?.EDIT ? handleEdit(record) : '')}
                title="Sửa"
                className={`p-[3px] border-2 rounded-md text-slate-50 ${
                  dataQuyenHan?.EDIT ? 'border-yellow-500 bg-yellow-500 hover:bg-white hover:text-yellow-500 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                } `}
              >
                <MdEdit size={16} />
              </div>

              <div
                onClick={() => (dataQuyenHan?.DEL ? handleDelete(record) : '')}
                title="Xóa"
                className={`p-[3px] border-2 rounded-md text-slate-50 ${
                  dataQuyenHan?.DEL ? 'border-red-500 bg-red-500 hover:bg-white hover:text-red-500 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                } `}
              >
                <MdDelete size={16} />
              </div>
            </div>
          </>
        )
      },
    },
  ]

  const options = columns.slice(0, -1).map(({ key, title }) => ({
    label: title,
    value: key,
  }))

  const newColumnsHide = columns.filter((item) => !newColumns.includes(item.dataIndex))

  const handleHideColumns = () => {
    setNewColumns(checkedList)
    setConfirmed(true)
  }

  const handleDelete = (record) => {
    setActionType('delete')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleView = (record) => {
    setActionType('view')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleEdit = (record) => {
    setActionType('edit')
    setDataRecord(record)
    setDataThongTin(record)
    setIsShowModal(true)
  }

  const handleCreate = (record) => {
    setActionType('create')
    setDataRecord(record)
    setIsShowModal(true)
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchGKH(newSearch)
    }
  }

  return (
    <>
      {dataQuyenHan?.VIEW === false ? (
        <>
          {isShowNotify && (
            <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
              <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
                <div className="flex flex-col gap-2 p-2 justify-between ">
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <p className="text-blue-700 font-semibold uppercase">Kiểm tra quyền hạn người dùng</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-2 p-3 items-center">
                      <div>
                        <CgCloseO className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="whitespace-nowrap">Bạn không có quyền thực hiện chức năng này!</p>
                        <p className="whitespace-nowrap">
                          Vui lòng liên hệ <span className="font-bold">Người Quản Trị</span> để được cấp quyền
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <ActionButton
                        handleAction={() => {
                          setIsShowNotify(false)
                          navigate('/')
                        }}
                        title={'Đóng'}
                        color={'slate-50'}
                        background={'red-500'}
                        color_hover={'red-500'}
                        bg_hover={'white'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="w-auto">
            <div className="relative text-lg flex justify-between items-center mb-1">
              <div className="flex items-center gap-x-4 font-bold">
                <h1 className="text-xl uppercase">Bảng giá Khách hàng</h1>
                <div>
                  <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
              </div>
              <div className="flex  ">
                {isShowSearch && (
                  <div className={`flex absolute left-[18rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                    <Input
                      allowClear={{
                        clearIcon: <CloseSquareFilled />,
                      }}
                      placeholder="Nhập ký tự bạn cần tìm"
                      onPressEnter={(e) => {
                        setPrevSearchValue(e.target.value)
                        handleSearch(e.target.value)
                      }}
                      onBlur={(e) => handleSearch(e.target.value)}
                      onFocus={(e) => setPrevSearchValue(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div ref={optionContainerRef}>
                <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5" onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                  <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                </div>
                {isShowOption && (
                  <div className=" absolute flex flex-col gap-2 bg-slate-100 p-3  top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
                    <div className={`flex flex-grow flex-wrap gap-1 ${!hideColumns ? 'flex-col' : ''}`}>
                      <button
                        onClick={dataQuyenHan?.EXCEL ? exportToExcel : ''}
                        className={`flex items-center py-1 px-2 rounded-md text-slate-50 text-base border-2 ${
                          dataQuyenHan?.EXCEL ? 'border-green-500  bg-green-500 hover:bg-white hover:text-green-500' : 'bg-gray-400 cursor-not-allowed'
                        } `}
                      >
                        <div className="pr-1">
                          <RiFileExcel2Fill size={20} />
                        </div>
                        <div>Xuất excel</div>
                      </button>

                      <button
                        onClick={() => setHideColumns(!hideColumns)}
                        className="flex items-center py-1 px-2 rounded-md border-2 border-red-500  text-slate-50 text-base bg-red-500 hover:bg-white hover:text-red-500 "
                      >
                        <div className="pr-1">
                          <FaEyeSlash size={20} />
                        </div>
                        <div>Ẩn cột</div>
                      </button>
                    </div>
                    <div>
                      {hideColumns && (
                        <div>
                          <Checkbox.Group
                            style={{
                              width: '470px',
                              background: 'white',
                              padding: 10,
                              borderRadius: 10,
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            }}
                            className="flex flex-col"
                            defaultValue={checkedList}
                            onChange={(value) => {
                              setCheckedList(value)
                              localStorage.setItem('hidenColumnGKH', JSON.stringify(value))
                            }}
                          >
                            <Row>
                              {options.map((item) => (
                                <Col span={8} key={item.value}>
                                  <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                              ))}
                            </Row>

                            <button onClick={handleHideColumns} className="mt-2 w-full border-[1px] border-gray-400 px-1 py-1 rounded-md hover:text-bg-main hover:border-bg-main">
                              Xác Nhận
                            </button>
                          </Checkbox.Group>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end items-center px-3 ">
              <div className="flex items-center gap-2">
                <div
                  className={`cursor-pointer hover:bg-slate-200 rounded-full p-2 ${isShowFull ? 'text-bg-main' : ''} `}
                  onClick={() => {
                    setIsShowFull(!isShowFull), setTableLoad(true)
                  }}
                >
                  <Tooltip title={`${!isShowFull ? ' Bật hiện tất cả' : 'Tắt hiện tất cả'} `} color="blue">
                    <TiThSmall size={20} className=""></TiThSmall>
                  </Tooltip>
                </div>
                <ActionButton
                  color={'slate-50'}
                  title={'Thêm'}
                  icon={<IoAddCircleOutline size={20} />}
                  bg_hover={!dataQuyenHan?.ADD ? '' : 'white'}
                  background={!dataQuyenHan?.ADD ? 'gray-400' : 'bg-main'}
                  color_hover={!dataQuyenHan?.ADD ? '' : 'bg-main'}
                  handleAction={() => (!dataQuyenHan?.ADD ? '' : handleCreate())}
                  quyenHan={dataQuyenHan?.ADD}
                />
              </div>
            </div>

            <div id="my-table" className="relative px-2 py-1 ">
              <Table
                loading={tableLoad}
                className="table_pmh setHeight"
                // rowSelection={rowSelection}
                columns={newColumnsHide}
                dataSource={filteredGKH}
                size="small"
                scroll={{
                  x: 1500,
                  y: 410,
                }}
                bordered
                pagination={{
                  defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                  showSizeChanger: true,
                  pageSizeOptions: ['50', '100', '1000'],
                  onShowSizeChange: (current, size) => {
                    localStorage.setItem('pageSize', size)
                  },
                }}
                rowKey={(record) => record.SoChungTu}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                // Bảng Tổng
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column) => {
                            const isNumericColumn = typeof filteredGKH[0]?.[column.dataIndex] === 'number'

                            return (
                              <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                {column.dataIndex === 'STT' ? (
                                  <Text className="text-center" strong>
                                    {!isShowFull ? data.length : dataFull.length}
                                  </Text>
                                ) : null}
                              </Table.Summary.Cell>
                            )
                          })}
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                }}
              ></Table>
            </div>

            {isShowModal && (
              <ModalTL
                namePage={'Bảng Giá Khách Hàng'}
                typePage={'GKH'}
                close={() => setIsShowModal(false)}
                actionType={actionType}
                dataRecord={dataRecord}
                dataThongTin={dataThongTin}
                dataDoiTuong={dataDoiTuong}
                dataNhomGia={dataNhomGia}
                data={dataFull}
                isLoadingModal={isLoadingModal}
                isLoadingEdit={isLoadingEdit}
                dataThongSo={dataThongSo}
                loading={() => setTableLoad(true)}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default BangGiaKH
