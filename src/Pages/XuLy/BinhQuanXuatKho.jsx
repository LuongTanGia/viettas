/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Empty, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import moment from 'moment'
import { toast } from 'react-toastify'
import { TfiMoreAlt } from 'react-icons/tfi'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import categoryAPI from '../../API/linkAPI'
import { RETOKEN, addRowClass } from '../../action/Actions'
import { useSearch } from '../../components/hooks/Search'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { PermissionView } from '../../components_K'
import { IoMdSettings } from 'react-icons/io'
import BQXKEdit from '../../components/Modals/XuLy/BQXKEdit'
import { nameColumsBinhQuanXuatKho } from '../../components/util/Table/ColumnName'

const BinhQuanXuatKho = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataGiaXuatKho, setDataGiaXuatKho] = useState('')
  const [dataBinhQuan, setDataBinhQuan] = useState(null)
  const [setSearchGiaXuatKho, filteredGiaXuatKho, searchGiaXuatKho] = useSearch(dataGiaXuatKho)
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataBinhQuan)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoadLeft, setTableLoadLeft] = useState(true)
  const [tableLoadRight, setTableLoadRight] = useState(true)
  const showOption = useRef(null)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [dataCRUD, setDataCRUD] = useState()
  const [isMaHang, setIsMaHang] = useState()
  const [isShowModal, setIsShowModal] = useState(false)
  const [targetRow, setTargetRow] = useState([])
  const [timerId, setTimerId] = useState(null)
  const [isShowList, setIsShowList] = useState(false)

  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    // const key = Object?.keys(dataGiaXuatKho ? dataGiaXuatKho[0] : [] || []).filter((key) => key != 'ThangFormat')
    const key2 = Object?.keys((dataBinhQuan && dataBinhQuan[0]) || []).filter((key) => key != 'Thang' && key != 'ThangFormat')
    // setOptions(key.length > 0 && key2.length > 0 ? [...key, ...key2] : [])
    setOptions(key2.length > 0 ? [...key2] : [])
  }, [selectVisible])

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

  useEffect(() => {
    const getDataGiaXuatKho = async () => {
      try {
        const response = await categoryAPI.BinhQuanXuatKhoList(TokenAccess)
        if (response.data.DataError == 0) {
          setDataGiaXuatKho(response.data.DataResults)
          setTableLoadLeft(false)
          setTableLoadRight(false)
          setIsLoading(true)
        } else if (response.data.DataError == -104) {
          setDataGiaXuatKho([])
          setTableLoadLeft(false)
          setIsLoading(true)
        }
      } catch (error) {
        console.log(error)
        setTableLoadLeft(false)
      }
    }
    getDataGiaXuatKho()
  }, [searchGiaXuatKho, targetRow])

  useEffect(() => {
    if (dataCRUD?.RUN == false) {
      setIsShowNotify(true)
    }
  }, [dataCRUD])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('XuLy_BinhQuanXuatKho', TokenAccess)
        if (response.data.DataError === 0) {
          setDataCRUD(response.data)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataQuyenHan()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    getDataQuyenHan()
  }, [])
  const handleSetting = (record) => {
    setIsMaHang(record)
    setIsShowModal(true)
  }
  const handleDoubleClick = (record) => {
    clearTimeout(timerId)
    if (timerId) {
      toast.warn('Bạn đang thao tác quá nhanh !', { autoClose: 1000 })
    }
    const newTimerId = setTimeout(() => {
      handleView(record)
      setTimerId(null)
    }, 800)
    setTimerId(newTimerId)
    return () => clearTimeout(newTimerId)
  }
  const handleView = async (record) => {
    try {
      if (!record?.DaXuLy && record?.Thang == null) {
        setTableLoadRight(true)
        const response = await categoryAPI.BinhQuanXuatKhoList_HangHoa(TokenAccess)
        if (response.data.DataError === 0) {
          setDataBinhQuan(response.data.DataResults)
          setTableLoadRight(false)
          setIsLoading(true)
          setIsShowList(true)
        }
      }
      if (record?.DaXuLy == true) {
        setTableLoadRight(true)
        const response = await categoryAPI.TinhBinhQuanXuatKhoList(record?.Thang, TokenAccess)
        if (response.data.DataError === 0) {
          setDataBinhQuan(response.data.DataResults)
          setTableLoadRight(false)
          setIsLoading(true)
          setIsShowList(false)
        } else if (response.data && (response.data.DataError === -107 || response.data.DataError === -108)) {
          await RETOKEN()
          await handleView(record)
        } else {
          setDataBinhQuan([])
          setTableLoadRight(false)
          setIsLoading(true)
          setIsShowList(false)
        }
      } else if (record?.DaXuLy == false) {
        setDataBinhQuan([])
        setIsShowList(false)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(true)
    }
  }
  const handleLoading = () => {
    setTableLoadLeft(true)
    setTableLoadRight(true)
  }
  const handleSearch = (event) => {
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchGiaXuatKho(event.target.value)
      setSearchHangHoa(event.target.value)
    }, 300)
  }
  const handleHidden = () => {
    setSelectVisible(!selectVisible)
  }
  const onChange = (checkedValues) => {
    setCheckedList(checkedValues)
  }
  const onClickSubmit = () => {
    setTableLoadLeft(true)
    setTableLoadRight(true)
    setTimeout(() => {
      setHiddenRow(checkedList)
      setTableLoadLeft(false)
      setTableLoadRight(false)
      localStorage.setItem('hiddenColumns', JSON.stringify(checkedList))
    }, 1000)
  }
  const titlesList = [
    {
      title: 'STT',
      dataIndex: 'STT',
      fixed: 'left',
      with: 10,
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        if (record.Thang === null) {
          return '#'
        }
        return index
      },
    },
    {
      title: 'Tháng',
      dataIndex: 'Thang',
      key: 'Thang',
      width: 100,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.Thang)
        const dateB = new Date(b.Thang)
        return dateA - dateB
      },
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={text ? moment(text).format('MM/YYYY') : ''} search={searchGiaXuatKho} />
        </span>
      ),
    },
    {
      title: 'Xử lý',
      dataIndex: 'DaXuLy',
      key: 'DaXuLy',
      align: 'center',
      width: 80,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.DaXuLy ? 1 : 0
        const valueB = b.DaXuLy ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => {
        if (record.Thang === null) {
          return null
        }
        return <Checkbox className=" justify-center" id={`DaXuLy_${record.key}`} checked={text} />
      },
    },
    {
      title: 'Thực hiện',
      dataIndex: 'NguoiThucHien',
      key: 'NguoiThucHien',
      showSorterTooltip: false,
      width: 180,
      align: 'center',
      sorter: (a, b) => (a.NguoiThucHien?.toString() || '').localeCompare(b.NguoiThucHien?.toString() || ''),
      render: (text) => (
        <div className="text-start truncate">
          <HighlightedCell text={text} search={searchGiaXuatKho} />
        </div>
      ),
    },
    {
      title: 'Lúc',
      dataIndex: 'ThoiGianThucHien',
      key: 'ThoiGianThucHien',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.ThoiGianThucHien)
        const dateB = new Date(b.ThoiGianThucHien)
        return dateA - dateB
      },
      render: (text, record) => {
        if (record.Thang === null) {
          return null
        }
        return <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY HH:mm:ss') : ''} search={searchGiaXuatKho} />
      },
    },
    {
      title: ' ',
      key: 'operation',
      fixed: 'right',
      width: 40,
      align: 'center',
      render: (record) => {
        if (record?.Thang === null) {
          return null
        }
        return (
          <>
            <div className=" flex gap-1 items-center justify-center">
              <Tooltip title="Xử lý" color="blue">
                <div
                  onClick={() => handleSetting(record)}
                  className="border-yellow-400 bg-yellow-400 hover:text-yellow-400 p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer"
                >
                  <IoMdSettings className="w-4 h-4" />
                </div>
              </Tooltip>
            </div>
          </>
        )
      },
    },
  ]
  const titlesBinhQuan = [
    {
      title: 'STT',
      dataIndex: 'STT',
      fixed: 'left',
      render: (text, record, index) => index + 1,
      with: 10,
      width: 50,
      align: 'center',
    },
    ...(isShowList == true
      ? [
          {
            title: 'Tháng',
            dataIndex: 'Thang',
            key: 'Thang',
            width: 100,
            align: 'center',
            showSorterTooltip: false,
            sorter: (a, b) => {
              const dateA = new Date(a.Thang)
              const dateB = new Date(b.Thang)
              return dateA - dateB
            },
            render: (text) => (
              <span className="flex justify-center">
                <HighlightedCell text={text ? moment(text).format('MM/YYYY') : ''} search={searchGiaXuatKho} />
              </span>
            ),
          },
        ]
      : []),
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 220,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Nhóm hàng',
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      width: 280,
      align: 'center',
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 180,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      render: (text) => (
        <div className="truncate">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss')} search={searchHangHoa} />,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.DonGia - b.DonGia,
      showSorterTooltip: false,
      render: (text) => (
        <div className="text-end">
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLEDONGIA)} search={searchHangHoa} />,
        </div>
      ),
    },
  ]
  const newTitles = titlesList.filter((item) => !hiddenRow?.includes(item.dataIndex))
  const newTitlesBinhQuan = titlesBinhQuan.filter((item) => !hiddenRow?.includes(item.dataIndex))
  return (
    <>
      {dataCRUD?.RUN == false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center ">
                    <div className="flex items-center gap-2 py-1">
                      <h1 className="text-lg font-bold text-black-600 uppercase">Tính trị giá bình quân xuất kho</h1>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
                    <div className="flex ">
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
                  </div>
                  <div ref={showOption}>
                    <Tooltip title="Chức năng khác" color="blue">
                      <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)}>
                        <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                      </div>
                    </Tooltip>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-200 px-3 py-2 items-center top-16 right-[4.5%] rounded-lg z-10 duration-500 shadow-custom">
                        <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                          <ActionButton
                            handleAction={handleHidden}
                            title={'Ẩn cột'}
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
                                  width: '270px',
                                  background: 'white',
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                  borderRadius: 10,
                                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                  whiteSpace: 'nowrap',
                                }}
                                className="flex flex-col"
                                defaultValue={checkedList}
                                onChange={onChange}
                              >
                                <Row className="ml-[20px]">
                                  {options && options.length > 0 ? (
                                    options?.map((item, index) => (
                                      <Col span={10} key={(item, index)}>
                                        <Checkbox value={item} checked={true}>
                                          {nameColumsBinhQuanXuatKho[item]}
                                        </Checkbox>
                                      </Col>
                                    ))
                                  ) : (
                                    <Empty className="w-[100%] h-[100%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  )}
                                </Row>
                                <Spin spinning={tableLoadLeft || tableLoadRight}>
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
                <div className="flex gap-2" id="my-table">
                  <div className="XuLy_BinhQuan w-[30vw]">
                    <Table
                      loading={tableLoadLeft}
                      className="setHeight"
                      columns={newTitles}
                      dataSource={[{ key: 'empty', Thang: null, fixed: 'top' }, ...filteredGiaXuatKho?.map((record, index) => ({ ...record, key: index }))]}
                      size="small"
                      scroll={{
                        x: 'max-content',
                        y: 300,
                      }}
                      pagination={{
                        defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                        showSizeChanger: true,
                        pageSizeOptions: ['50', '100', '1000'],
                        onShowSizeChange: (current, size) => {
                          localStorage.setItem('pageSize', size)
                        },
                      }}
                      rowClassName={(record, index) => addRowClass(record, index)}
                      onRow={(record) => ({
                        onDoubleClick: () => handleDoubleClick(record),
                      })}
                      scrollToFirstRowOnChange
                      summary={() => {
                        return (
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              {newTitles
                                .filter((column) => column.render)
                                .map((column, index) => {
                                  const isNumericColumn = typeof filteredGiaXuatKho[0]?.[column.dataIndex] == 'number'
                                  return (
                                    <Table.Summary.Cell index={index} key={index} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                      {column.dataIndex == 'STT' ? (
                                        <Text className="text-center flex justify-center" strong>
                                          {dataGiaXuatKho?.length}
                                        </Text>
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
                  <div className="XuLy_BinhQuan w-[67vw]">
                    <Table
                      loading={tableLoadRight}
                      className="setHeight"
                      columns={newTitlesBinhQuan}
                      dataSource={filteredHangHoa.map((item, index) => ({ ...item, key: index }))}
                      size="small"
                      scroll={{
                        y: 300,
                        x: 'max-content',
                      }}
                      rowClassName={(record, index) => addRowClass(record, index)}
                      pagination={{
                        defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                        showSizeChanger: true,
                        pageSizeOptions: ['50', '100', '1000'],
                        onShowSizeChange: (current, size) => {
                          localStorage.setItem('pageSize', size)
                        },
                      }}
                      scrollToFirstRowOnChange
                      summary={() => {
                        return (
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              {newTitlesBinhQuan
                                .filter((column) => column.render)
                                .map((column, index) => {
                                  const isNumericColumn = typeof filteredHangHoa[0]?.[column.dataIndex] == 'number'
                                  return (
                                    <Table.Summary.Cell
                                      index={index}
                                      key={`summary-cell-${index + 1}`}
                                      align={isNumericColumn ? 'right' : 'left'}
                                      className="text-end font-bold  bg-[#f1f1f1]"
                                    >
                                      {column.dataIndex == 'STT' ? (
                                        <Text className="text-center flex justify-center" strong>
                                          {dataBinhQuan?.length}
                                        </Text>
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
              </div>
              <div>
                {isShowModal && (
                  <BQXKEdit close={() => setIsShowModal(false)} dataBQXK={isMaHang} loadingData={handleLoading} setTargetRow={setTargetRow} setDataBinhQuan={setDataBinhQuan} />
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default BinhQuanXuatKho
