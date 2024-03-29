import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input, Segmented } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'

import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN, formatCurrency, formatPrice } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearch } from '../../components_K/myComponents/useSearch'
import { ModalTongHopPBL, PermissionView } from '../../components_K'

const { Text } = Typography
const { FaFileMedical, BsSearch, TfiMoreAlt, FaEyeSlash, RiFileExcel2Fill } = icons
const TongHopPBL = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)

  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])

  const [dataRecord, setDataRecord] = useState(null)
  const [actionType, setActionType] = useState('')
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchTongHopPBL, filteredTongHopPBL, searchTongHopPBL] = useSearch(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [doneTongHopPBL, setDoneTongHopPBL] = useState(null)
  const [formSynthetics, setFormSynthetics] = useState({ DanhSach: [] })

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
    const storedHiddenColumns = localStorage.getItem('hidenColumnTongHopPBL')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hidenColumnTongHopPBL')))
      setNewColumns(JSON.parse(localStorage.getItem('hidenColumnTongHopPBL')))
    }
  }, [confirmed])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'XuLy_TongHopPhieuBanLe')

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
    if (dataQuyenHan?.RUN == false) {
      setIsShowNotify(true)
    }
  }, [dataQuyenHan])

  //get DSTongHopPBL
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.RUN) {
      getDSTongHopPBL()
    }
  }, [tableLoad, dataQuyenHan?.RUN])

  const getDSTongHopPBL = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DSTongHopPBL(tokenLogin)

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSTongHopPBL()
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
      title: 'Quầy',
      dataIndex: 'Quay',
      key: 'Quay',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.Quay - b.Quay,
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate ">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={formatCurrency(text)} search={searchTongHopPBL} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchTongHopPBL} />,
      width: 150,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },

    {
      title: 'Ca',
      dataIndex: 'Ca',
      key: 'Ca',
      align: 'center',
      width: 80,
      sorter: (a, b) => a.Ca.localeCompare(b.Ca),
      showSorterTooltip: false,
      render: (text) => (
        <div className="truncate ">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchTongHopPBL} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'NhanVien',
      key: 'NhanVien',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className="text-start">
          <HighlightedCell text={text} search={searchTongHopPBL} />
        </div>
      ),
      sorter: (a, b) => a.NhanVien.localeCompare(b.NhanVien),
      showSorterTooltip: false,
    },

    {
      title: 'Tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongThanhTien - b.TongThanhTien,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Tiền CK TH.Toán',
      dataIndex: 'TongTienCKTT',
      key: 'TongTienCKTT',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTienCKTT - b.TongTienCKTT,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Tổng tiền bán',
      dataIndex: 'TongTongCong',
      key: 'TongTongCong',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongTongCong - b.TongTongCong,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Tổng tiền thu',
      dataIndex: 'TongThu',
      key: 'TongThu',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongThu - b.TongThu,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Tổng tiền chi',
      dataIndex: 'TongChi',
      key: 'TongChi',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongChi - b.TongChi,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
    },
    {
      title: 'Tiền phải nộp',
      dataIndex: 'TienPhaiNop',
      key: 'TienPhaiNop',
      width: 150,
      fixed: 'right',
      align: 'center',
      sorter: (a, b) => a.TienPhaiNop - b.TienPhaiNop,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchTongHopPBL} />
        </div>
      ),
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

  const handleView = (record) => {
    setActionType('view')
    setDataRecord(record)
    setIsShowModal(true)
  }

  // data DS delete
  useEffect(() => {
    const selectedRowObjs = selectedRowKeys.map((key) => {
      const [NgayCTu, NhanVien, Ca, Quay] = key.split('/')
      return { NgayCTu, Quay: parseInt(Quay), Ca, NhanVien }
    })
    setFormSynthetics({ ...formSynthetics, DanhSach: selectedRowObjs })
  }, [selectedRowKeys])

  const handleSynthetics = () => {
    if (formSynthetics.DanhSach.length <= 0) {
      toast.warning('Hãy chọn các dữ liệu để tổng hợp nhanh!', {
        autoClose: 1500,
      })
    } else {
      setActionType('synthetics')
      setIsShowModal(true)
    }
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchTongHopPBL(newSearch)
    }
  }

  const handleRowClick = (record) => {
    const selectedKey = `${record.NgayCTu}/${record.NhanVien}/${record.Ca}/${record.Quay}`
    const isSelected = selectedRowKeys.includes(selectedKey)
    const newSelectedRowKeys = isSelected ? selectedRowKeys.filter((key) => key !== selectedKey) : [...selectedRowKeys, selectedKey]
    setSelectedRowKeys(newSelectedRowKeys)
  }

  return (
    <>
      {dataQuyenHan?.RUN === false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          <div className="w-auto">
            <div className="relative text-lg flex justify-between items-center mb-1">
              <div className="flex items-center gap-x-4 font-bold">
                <h1 className="text-xl uppercase">Tổng hợp dữ liệu bán lẻ từ các quầy</h1>
                <div>
                  <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
              </div>
              <div className="flex  ">
                {isShowSearch && (
                  <div
                    className={`flex absolute left-[28.4rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'md:w-[12rem] lg:w-[20rem]' : 'w-0'} overflow-hidden`}
                  >
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
                              localStorage.setItem('hidenColumnTongHopPBL', JSON.stringify(value))
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
                  title={'Tổng hợp nhanh'}
                  icon={<FaFileMedical size={20} />}
                  bg_hover={'white'}
                  background={'bg-main'}
                  color_hover={'bg-main'}
                  handleAction={() => handleSynthetics()}
                  isModal={true}
                />
              </div>
            </div>

            <div id="my-table" className="relative px-2 py-1 ">
              <Table
                loading={tableLoad}
                className="TongHopPBL"
                rowSelection={{
                  selectedRowKeys,
                  onChange: (selectedKeys) => {
                    setSelectedRowKeys(selectedKeys)
                  },
                }}
                columns={newColumnsHide}
                dataSource={filteredTongHopPBL}
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
                rowClassName={(record) => (`${record.NgayCTu}/${record.NhanVien}/${record.Ca}/${record.Quay}` === doneTongHopPBL ? 'highlighted-row' : '')}
                rowKey={(record) => `${record.NgayCTu}/${record.NhanVien}/${record.Ca}/${record.Quay}`}
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
                        <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"></Table.Summary.Cell>
                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column, index) => {
                            const isNumericColumn = typeof filteredTongHopPBL[0]?.[column.dataIndex] === 'number'

                            return (
                              <Table.Summary.Cell
                                index={index + 1}
                                key={`summary-cell-${index + 1}`}
                                align={isNumericColumn ? 'right' : 'left'}
                                className="text-end font-bold  bg-[#f1f1f1]"
                              >
                                {column.dataIndex === 'TyLeCKTT' ? (
                                  <Text strong>
                                    {Number(filteredTongHopPBL.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: dataThongSo?.SOLETYLE,
                                      maximumFractionDigits: dataThongSo?.SOLETYLE,
                                    })}
                                  </Text>
                                ) : column.dataIndex === 'TongTienHang' ||
                                  column.dataIndex === 'TongTienThue' ||
                                  column.dataIndex === 'TongThanhTien' ||
                                  column.dataIndex === 'TongTienCKTT' ||
                                  column.dataIndex === 'TongTongCong' ||
                                  column.dataIndex === 'TongThu' ||
                                  column.dataIndex === 'TienPhaiNop' ||
                                  column.dataIndex === 'TongChi' ? (
                                  <Text strong>
                                    {Number(filteredTongHopPBL.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                      maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                    })}
                                  </Text>
                                ) : column.dataIndex === 'STT' ? (
                                  <Text className="text-center flex justify-center" strong>
                                    {data.length}
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
              <ModalTongHopPBL
                namePage={'Tổng hợp dữ liệu bán lẻ từ các quầy'}
                typePage={'TongHopPBL'}
                close={() => setIsShowModal(false)}
                actionType={actionType}
                dataRecord={dataRecord}
                formSynthetics={formSynthetics}
                dataThongSo={dataThongSo}
                loading={() => setTableLoad(true)}
                setHightLight={setDoneTongHopPBL}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default TongHopPBL
