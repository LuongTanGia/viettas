import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import { ModalGBS, PermissionView } from '../../components_K'
import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN, addRowClass, formatCurrency } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearch } from '../../components_K/myComponents/useSearch'

const { Text } = Typography
const { IoAddCircleOutline, MdDelete, BsSearch, TfiMoreAlt, MdEdit, FaEyeSlash, RiFileExcel2Fill, TiPrinter, FaRegCopy, BsWrenchAdjustableCircle } = icons
const GBS = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)
  const [isLoadingEdit, setIsLoadingEdit] = useState(true)
  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])
  const [dataThongTin, setDataThongTin] = useState({})
  const [dataRecord, setDataRecord] = useState(null)
  const [dataHangHoa, setDataHangHoa] = useState(null)
  const [actionType, setActionType] = useState('')
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchGBS, filteredGBS, searchGBS] = useSearch(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [doneGKH, setDoneGKH] = useState(null)

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
    const storedHiddenColumns = localStorage.getItem('hiddenColumnGBS')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hiddenColumnGBS')))
      setNewColumns(JSON.parse(localStorage.getItem('hiddenColumnGBS')))
    }
  }, [confirmed])

  // get helper
  useEffect(() => {
    setIsLoadingModal(true)
    setIsLoadingEdit(true)
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'create' || actionType === 'edit' || actionType === 'clone') {
          const response = await apis.ListHelperHHGBS(tokenLogin)
          if (response.data && response.data.DataError === 0) {
            setDataHangHoa(response.data.DataResults)
          } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
            toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>, { autoClose: 2000 })
          } else if (response.data.DataError === -107 || response.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(response.data.DataErrorDescription, { autoClose: 2000 })
          }
        }
        if (actionType === 'view' || actionType === 'edit' || actionType === 'clone') {
          const responseTT = await apis.ThongTinGBS(tokenLogin, dataRecord.NhomGia)
          if (responseTT.data && responseTT.data.DataError === 0) {
            setDataThongTin(responseTT.data.DataResult)
          } else if (responseTT.data.DataError === -1 || responseTT.data.DataError === -2 || responseTT.data.DataError === -3) {
            toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{responseTT.data.DataErrorDescription}</div>, { autoClose: 2000 })
          } else if (responseTT.data.DataError === -107 || responseTT.data.DataError === -108) {
            await RETOKEN()
            fetchData()
          } else {
            toast.error(responseTT.data.DataErrorDescription, { autoClose: 2000 })
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        setIsLoadingEdit(false)
      }
      setIsLoadingModal(false)
    }

    if (isShowModal) {
      fetchData()
    }
  }, [isShowModal])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'ThietLap_GiaSi')

        if (response.data && response.data.DataError === 0) {
          setDataQuyenHan(response.data)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getChucNangQuyenHan()
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
  //get DSGBS
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.VIEW) {
      getDSGBS()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  const getDSGBS = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachGBS(tokenLogin)

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSGBS()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>, { autoClose: 2000 })
        setTableLoad(false)
      } else {
        setData([])
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
      title: 'Mã bảng giá',
      dataIndex: 'NhomGia',
      key: 'NhomGia',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.NhomGia.localeCompare(b.NhomGia),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className=" text-start">
          {/* <Tooltip title={text} color="blue" placement="top"> */}
          <span>
            <HighlightedCell text={text} search={searchGBS} />
          </span>
          {/* </Tooltip> */}
        </div>
      ),
    },
    {
      title: 'Tên bảng giá',
      dataIndex: 'TenNhomGia',
      key: 'TenNhomGia',
      width: 250,

      sorter: (a, b) => a.TenNhomGia.localeCompare(b.TenNhomGia),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchGBS} />
        </div>
      ),
    },

    {
      title: 'Tổng mặt hàng',
      dataIndex: 'TongMatHang',
      key: 'TongMatHang',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongMatHang - b.TongMatHang,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatCurrency(text)} search={searchGBS} />
        </div>
      ),
    },
    {
      title: 'Tổng khách hàng',
      dataIndex: 'TongDoiTuong',
      key: 'TongDoiTuong',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongDoiTuong - b.TongDoiTuong,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatCurrency(text)} search={searchGBS} />
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
          <HighlightedCell text={text} search={searchGBS} />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY hh:mm:ss')} search={searchGBS} />,
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
          <HighlightedCell text={text} search={searchGBS} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null} search={searchGBS} />,
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
          <HighlightedCell text={text} search={searchGBS} />
        </div>
      ),
    },

    {
      title: 'Chức năng',
      key: 'ChucNang',
      fixed: 'right',
      width: 130,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center  ">
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
              <Tooltip title="Bản sao" color="blue">
                <div
                  onClick={() => (dataQuyenHan?.ADD ? handleClone(record) : '')}
                  className={`p-[3px] border-2 rounded-md text-slate-50 ${
                    dataQuyenHan?.ADD ? 'border-pink-400 bg-pink-400 hover:bg-white hover:text-pink-400 cursor-pointer' : 'border-gray-400 bg-gray-400 cursor-not-allowed'
                  } `}
                >
                  <FaRegCopy size={16} />
                </div>
              </Tooltip>
              <Tooltip title="Điều chỉnh giá" color="blue">
                <div
                  onClick={() => handleAdjustPrice(record)}
                  className="p-[3px] border-2 rounded-md text-slate-50 border-orange-400 bg-orange-400 hover:bg-white hover:text-orange-400 cursor-pointer
                "
                >
                  <BsWrenchAdjustableCircle size={16} />
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

  const handleClone = (record) => {
    setActionType('clone')
    setDataRecord(record)
    setDataThongTin(record)
    setIsShowModal(true)
  }

  const handleCreate = () => {
    setActionType('create')
    setIsShowModal(true)
  }

  const handlePrint = () => {
    setActionType('print')
    setIsShowModal(true)
  }
  const handleAdjustPrice = (record) => {
    setActionType('adjustPrice')
    setDataRecord(record)

    setIsShowModal(true)
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchGBS(newSearch)
    }
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
                <h1 className="text-xl uppercase">Bảng giá bán sỉ</h1>
                <div>
                  <BsSearch size={18} className="hover:text-red-400 cursor-pointer " onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
              </div>
              <div className="flex  ">
                {isShowSearch && (
                  <div className={`flex absolute left-[14rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
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
                        onClick={handlePrint}
                        className="flex items-center py-1 px-2 rounded-md border-2 border-purple-500  text-slate-50 text-base bg-purple-500 hover:bg-white hover:text-purple-500 "
                      >
                        <div className="pr-1">
                          <TiPrinter size={20} />
                        </div>
                        <div>In bảng giá</div>
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
                              localStorage.setItem('hiddenColumnGBS', JSON.stringify(value))
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
                columns={newColumnsHide}
                dataSource={filteredGBS}
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
                rowClassName={(record, index) => (record.NhomGia === doneGKH ? 'highlighted-row' : addRowClass(record, index))}
                rowKey={(record) => record.NhomGia}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    handleView(record)
                  },
                })}
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column, index) => {
                            const isNumericColumn = typeof filteredGBS[0]?.[column.dataIndex] === 'number'
                            const total = Number(filteredGBS?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0))
                            return (
                              <Table.Summary.Cell
                                index={index}
                                key={`summary-cell-${index + 1}`}
                                align={isNumericColumn ? 'right' : 'left'}
                                className="text-end font-bold bg-[#f1f1f1]"
                              >
                                {column.dataIndex === 'STT' ? (
                                  <Text className="text-center flex justify-center text-white" strong>
                                    {data.length}
                                  </Text>
                                ) : column.dataIndex === 'TongMatHang' || column.dataIndex === 'TongDoiTuong' ? (
                                  <Text strong className={total < 0 ? 'text-red-600 text-sm' : total === 0 ? 'text-gray-300' : 'text-white'}>
                                    {Number(filteredGBS.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    })}
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
              <ModalGBS
                namePage={'Bảng Giá Bán Sỉ'}
                typePage={'GBS'}
                close={() => setIsShowModal(false)}
                actionType={actionType}
                dataRecord={dataRecord}
                dataThongTin={dataThongTin}
                dataHangHoa={dataHangHoa}
                data={data}
                isLoadingModal={isLoadingModal}
                isLoadingEdit={isLoadingEdit}
                dataThongSo={dataThongSo}
                loading={() => setTableLoad(true)}
                setHightLight={setDoneGKH}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default GBS
