import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input, Segmented } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import { ModalTL, PermissionView } from '../../components_K'
import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearchHH } from '../../components_K/myComponents/useSearchHH'

const { Text } = Typography

const { IoAddCircleOutline, IoIosRemoveCircleOutline, MdDelete, BsSearch, TfiMoreAlt, MdEdit, FaEyeSlash, RiFileExcel2Fill } = icons

const BangGiaKH = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)
  const [isLoadingEdit, setIsLoadingEdit] = useState(true)
  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [showFull, setShowFull] = useState('Hiện hành')
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
  const [setSearchGKH, filteredGKH, searchGKH] = useSearchHH(showFull === 'Hiện hành' ? data : dataFull)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [doneGKH, setDoneGKH] = useState(null)
  const [isChanging, setIsChanging] = useState(false)
  const [formDEL, setFormDEL] = useState({
    DanhSachMaHieuLuc: [],
  })

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
    const storedHiddenColumns = localStorage.getItem('hiddenColumnGKH')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hiddenColumnGKH')))
      setNewColumns(JSON.parse(localStorage.getItem('hiddenColumnGKH')))
    }
  }, [confirmed])

  // get helper
  useEffect(() => {
    setIsLoadingModal(true)
    setIsLoadingEdit(true)
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'create') {
          const responseDT = await apis.ListHelperDTGKH(tokenLogin)
          if (responseDT) {
            const { DataError, DataErrorDescription, DataResults } = responseDT.data
            if (DataError === 0) {
              setDataDoiTuong(DataResults)
              setIsLoadingModal(false)
            } else if (DataError === -1 || DataError === -2 || DataError === -3) {
              toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
              setIsLoadingModal(false)
            } else if (DataError === -107 || DataError === -108) {
              await RETOKEN()
              fetchData()
            } else {
              toast.error(DataErrorDescription)
              setIsLoadingModal(false)
            }
          }

          const responseNG = await apis.ListHelperNGGKH(tokenLogin)
          if (responseNG) {
            const { DataError, DataErrorDescription, DataResults } = responseNG.data
            if (DataError === 0) {
              setDataNhomGia(DataResults)
              setIsLoadingModal(false)
            } else if (DataError === -1 || DataError === -2 || DataError === -3) {
              toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
              setIsLoadingModal(false)
            } else if (DataError === -107 || DataError === -108) {
              await RETOKEN()
              fetchData()
            } else {
              toast.error(DataErrorDescription)
              setIsLoadingModal(false)
            }
          }
        }
        if (actionType === 'edit') {
          const responseNG = await apis.ListHelperNGGKH(tokenLogin)
          if (responseNG) {
            const { DataError, DataErrorDescription, DataResults } = responseNG.data
            if (DataError === 0) {
              setDataNhomGia(DataResults)
              setIsLoadingModal(false)
            } else if (DataError === -1 || DataError === -2 || DataError === -3) {
              toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
              setIsLoadingModal(false)
            } else if (DataError === -107 || DataError === -108) {
              await RETOKEN()
              fetchData()
            } else {
              toast.error(DataErrorDescription)
              setIsLoadingModal(false)
            }
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
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'ThietLap_NhomGiaDoiTuong')
        if (response) {
          const { DataError } = response.data
          if (DataError === 0) {
            setDataQuyenHan(response.data)
          } else if (DataError === -107 || DataError === -108) {
            await RETOKEN()
            getChucNangQuyenHan()
          }
        }
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
      if (showFull === 'Tất cả') {
        getDSFullGKH()
      } else {
        getDSGKH()
      }
      setSelectedRowKeys([])
      // getDSFullGKH()
      // getDSGKH()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  // data DS delete
  useEffect(() => {
    const selectedRowObjs = selectedRowKeys.map((key) => {
      const [Ma, HieuLuc] = key.split('/')
      return { Ma, HieuLuc }
    })
    setFormDEL({ ...formDEL, DanhSachMaHieuLuc: selectedRowObjs })
  }, [selectedRowKeys])

  const getDSGKH = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.DanhSachGKH(tokenLogin)

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          setData(DataResults)
          setTableLoad(false)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          getDSGKH()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
          setTableLoad(false)
        } else {
          toast.error(DataErrorDescription)
          setData([])
          setTableLoad(false)
        }
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
      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          setDataFull(DataResults)
          setTableLoad(false)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          getDSGKH()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
          setTableLoad(false)
        } else {
          toast.error(DataErrorDescription)
          setDataFull([])
          setTableLoad(false)
        }
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
        <div className=" text-start">
          {/* <Tooltip title={text} color="blue" placement="top"> */}
          <span>
            <HighlightedCell text={text} search={searchGKH} />
          </span>
          {/* </Tooltip> */}
        </div>
      ),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 250,
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
      title: 'Nhóm giá',
      dataIndex: 'ThongTinNhomGia',
      key: 'ThongTinNhomGia',
      width: 250,

      sorter: (a, b) => a.ThongTinNhomGia.localeCompare(b.ThongTinNhomGia),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className=" text-start">
          {/* <Tooltip title={text} color="blue" placement="top"> */}
          <span>
            <HighlightedCell text={text} search={searchGKH} />
          </span>
          {/* </Tooltip> */}
        </div>
      ),
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
        <div className=" text-start">
          <HighlightedCell text={text} search={searchGKH} />
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
        <div className="truncate ">
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
        <div className="truncate ">
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
            <div className=" flex gap-1 items-center justify-center">
              <Tooltip title="Sửa" color="blue">
                <div
                  onClick={() => (dataQuyenHan?.EDIT ? handleEdit(record) : '')}
                  className={`p-[3px] border-2 rounded-md text-slate-50 ${
                    dataQuyenHan?.EDIT ? 'border-yellow-400 bg-yellow-400 hover:bg-white hover:text-yellow-400 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                  } `}
                >
                  <MdEdit size={16} />
                </div>
              </Tooltip>
              <Tooltip title="Xóa" color="blue">
                <div
                  onClick={() => (dataQuyenHan?.DEL ? handleDelete(record) : '')}
                  className={`p-[3px] border-2 rounded-md text-slate-50 ${
                    dataQuyenHan?.DEL ? 'border-red-500 bg-red-500 hover:bg-white hover:text-red-500 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                  } `}
                >
                  <MdDelete size={16} />
                </div>
              </Tooltip>
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

  const newColumnsHide = columns.filter((item) => {
    if (newColumns && newColumns.length > 0) {
      return !newColumns.includes(item.dataIndex)
    } else {
      return true
    }
  })

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

  const handleCreate = () => {
    setActionType('create')
    setIsShowModal(true)
  }

  const handleDeleteDS = () => {
    if (formDEL.DanhSachMaHieuLuc.length <= 0) {
      toast.warning('Hãy chọn mã khách hàng để xóa', {
        autoClose: 1500,
      })
    } else {
      setActionType('deleteds')
      setIsShowModal(true)
    }
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchGKH(newSearch)
    }
  }

  const handleRowClick = (record) => {
    setDoneGKH(null)
    const selectedKey = `${record.MaDoiTuong}/${record.HieuLucTu}`
    const isSelected = selectedRowKeys.includes(selectedKey)
    const newSelectedRowKeys = isSelected ? selectedRowKeys.filter((key) => key !== selectedKey) : [...selectedRowKeys, selectedKey]
    setSelectedRowKeys(newSelectedRowKeys)
  }

  return (
    <>
      {dataQuyenHan?.VIEW === false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
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
                <Tooltip title="Chức năng khác" color="blue">
                  <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5" onClick={() => setIsShowOption(!isShowOption)}>
                    <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                  </div>
                </Tooltip>
                {isShowOption && (
                  <div className=" absolute flex flex-col gap-2 bg-slate-100 px-3 py-2 items-center top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom ">
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
                    <div className="flex justify-center">
                      {hideColumns && (
                        <div>
                          <Checkbox.Group
                            style={{
                              width: '340px',
                              background: 'white',
                              padding: 10,
                              borderRadius: 10,
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            }}
                            className="flex flex-col"
                            defaultValue={checkedList}
                            onChange={(value) => {
                              setCheckedList(value)
                              localStorage.setItem('hiddenColumnGKH', JSON.stringify(value))
                            }}
                          >
                            <Row className="flex justify-center">
                              {options.map((item) => (
                                <Col span={10} key={item.value}>
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
                <Segmented
                  options={['Hiện hành', 'Tất cả']}
                  value={showFull}
                  onChange={(value) => {
                    if (!isChanging) {
                      setIsChanging(true)
                      setShowFull(value)
                      setTableLoad(true)
                      setTimeout(() => {
                        setIsChanging(false)
                      }, 1000)
                    }
                  }}
                />
                <ActionButton
                  color={'slate-50'}
                  title={'Xóa'}
                  icon={<IoIosRemoveCircleOutline size={20} />}
                  bg_hover={!dataQuyenHan?.DEL ? '' : 'white'}
                  background={!dataQuyenHan?.DEL ? 'gray-400' : 'red-500'}
                  color_hover={!dataQuyenHan?.DEL ? '' : 'red-500'}
                  handleAction={() => (!dataQuyenHan?.DEL ? '' : handleDeleteDS())}
                  isPermission={dataQuyenHan?.DEL}
                  isModal={true}
                />
                <ActionButton
                  color={'slate-50'}
                  title={'Thêm'}
                  icon={<IoAddCircleOutline size={20} />}
                  bg_hover={!dataQuyenHan?.ADD ? '' : 'white'}
                  background={!dataQuyenHan?.ADD ? 'gray-400' : 'bg-main'}
                  color_hover={!dataQuyenHan?.ADD ? '' : 'bg-main'}
                  handleAction={() => (!dataQuyenHan?.ADD ? '' : handleCreate())}
                  isPermission={dataQuyenHan?.ADD}
                  isModal={true}
                />
              </div>
            </div>

            <div id="my-table" className="relative px-2 py-1 ">
              <Table
                loading={tableLoad}
                className="table_pmh setHeight"
                rowSelection={{
                  selectedRowKeys,
                  onChange: (selectedKeys) => {
                    setSelectedRowKeys(selectedKeys)
                  },
                }}
                columns={newColumnsHide}
                dataSource={filteredGKH}
                size="small"
                scroll={{
                  x: 1500,
                  y: 410,
                }}
                // pagination={{
                //   defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                //   showSizeChanger: true,
                //   pageSizeOptions: ['50', '100', '1000'],
                //   onShowSizeChange: (current, size) => {
                //     localStorage.setItem('pageSize', size)
                //   },
                // }}
                pagination={false}
                rowClassName={(record) => (`${record.MaDoiTuong}/${record.HieuLucTu}` === doneGKH ? 'highlighted-row' : '')}
                rowKey={(record) => `${record.MaDoiTuong}/${record.HieuLucTu}`}
                onRow={(record) => ({
                  onClick: () => {
                    handleRowClick(record)
                  },
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                // Bảng Tổng
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} key="summary-cell-0" className=""></Table.Summary.Cell>

                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column, index) => {
                            const isNumericColumn = typeof filteredGKH[0]?.[column.dataIndex] === 'number'

                            return (
                              <Table.Summary.Cell
                                index={index + 1}
                                key={`summary-cell-${index}`}
                                align={isNumericColumn ? 'right' : 'left'}
                                className="text-end font-bold  bg-[#f1f1f1]"
                              >
                                {column.dataIndex === 'STT' ? (
                                  <Text className="text-center flex justify-center text-white" strong>
                                    {showFull === 'Hiện hành' ? data.length : dataFull.length}
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
                formDEL={formDEL}
                setHightLight={setDoneGKH}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default BangGiaKH
