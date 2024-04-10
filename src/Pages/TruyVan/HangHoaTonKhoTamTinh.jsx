import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input, Select } from 'antd'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN, formatPrice } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearchHH } from '../../components_K/myComponents/useSearchHH'
import { PermissionView } from '../../components_K'

const { Option } = Select
const { Text } = Typography
const { BsSearch, TfiMoreAlt, FaEyeSlash, RiFileExcel2Fill, MdFilterAlt } = icons

const HangHoaTKTT = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)

  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])
  const [dataHangHoa, setDataHangHoa] = useState(null)
  // const [dataKhoHang, setDataKhoHang] = useState([])
  const [dataNhomHang, setDataNhomHang] = useState([])
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchHangHoaTKTT, filteredHangHoaTKTT, searchHangHoaTKTT] = useSearchHH(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [valueList1, setValueList1] = useState([])
  const [valueList2, setValueList2] = useState([])
  const [formFilter, setFormFilter] = useState({
    CodeValue1From: null,
    CodeValue1To: null,
    CodeValue2From: null,
    CodeValue2To: null,
    CodeValue1List: null,
    CodeValue2List: null,
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
    const storedHiddenColumns = localStorage.getItem('hiddenColumnHangHoaTKTT')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hiddenColumnHangHoaTKTT')))
      setNewColumns(JSON.parse(localStorage.getItem('hiddenColumnHangHoaTKTT')))
    }
  }, [confirmed])

  // get helper
  useEffect(() => {
    const fetchData = async (apiFunc, setDataFunc) => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apiFunc(tokenLogin)
        if (response.data && response.data.DataError === 0) {
          setDataFunc(response.data.DataResults)
        } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if (response.data.DataError === -107 || response.data.DataError === -108) {
          await RETOKEN()
          fetchData(apiFunc, setDataFunc) // Thực hiện lại gọi API nếu cần
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
      }
    }

    fetchData(apis.ListHelperNhomHangHangHoaTKTT, setDataNhomHang)
    fetchData(apis.ListHelperHHHangHoaTKTT, setDataHangHoa)
    // fetchData(apis.ListHelperKhoHangHangHoaTKTT, setDataKhoHang)
  }, [])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        console.log('đi')
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'TruyVan_TonKho_TheoKho')

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

  // handle Nhóm undefined
  useEffect(() => {
    if (formFilter.CodeValue1From === undefined || formFilter.CodeValue1To === undefined) {
      setFormFilter({ ...formFilter, CodeValue1From: null, CodeValue1To: null })
    }
    if (formFilter.CodeValue2From === undefined || formFilter.CodeValue2To === undefined) {
      setFormFilter({ ...formFilter, CodeValue2From: null, CodeValue2To: null })
    }
  }, [formFilter])

  //get DSHangHoaTKTT
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.VIEW) {
      getDSHangHoaTKTT()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  const getDSHangHoaTKTT = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachHangHoaTKTT(tokenLogin, { ...formFilter, CodeValue1List: valueList1.join(','), CodeValue2List: valueList2.join(',') })
      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSHangHoaTKTT()
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

  // Extract dynamic columns from the data
  const dynamicColumns =
    filteredHangHoaTKTT && filteredHangHoaTKTT.length > 0
      ? Object.keys(filteredHangHoaTKTT[0])
          .filter((key) => key.startsWith('Col_'))
          .map((colKey) => {
            const columnName = colKey.substring(4) // Extract column name after 'Col_'
            return {
              title: columnName,
              dataIndex: colKey,
              key: colKey,
              width: 150,
              align: 'center',
              render: (text) => (
                <div className={`text-end ${text < 0 ? 'text-red-600  ' : text === 0 ? 'text-gray-300' : ''} `}>
                  <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchHangHoaTKTT} />
                </div>
              ),
              sorter: (a, b) => a[colKey] - b[colKey],
              showSorterTooltip: false,
            }
          })
      : []

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
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchHangHoaTKTT} />
            </span>
          </Tooltip>
        </div>
      ),
    },

    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchHangHoaTKTT} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'DVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 100,
      align: 'center',
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchHangHoaTKTT} />
        </div>
      ),
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
    },
    {
      title: 'Nhóm hàng',
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      width: 200,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchHangHoaTKTT} />
            </span>
          </Tooltip>
        </div>
      ),
      sorter: (a, b) => {
        return a.NhomHang.localeCompare(b.NhomHang)
      },
      showSorterTooltip: false,
    },

    ...dynamicColumns,
    {
      title: 'Tổng cộng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 200,
      align: 'center',
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOLUONG)} search={searchHangHoaTKTT} />
        </div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      showSorterTooltip: false,
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

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchHangHoaTKTT(newSearch)
    }
  }
  const handleFilterDS = () => {
    setTableLoad(true)
  }
  const handleFromChange = (value) => {
    const valueCheck = dataNhomHang?.findIndex((item) => item.Ma === value) > dataNhomHang.findIndex((item) => item.Ma === formFilter?.CodeValue1To)
    if (formFilter.CodeValue1To === null || valueCheck) {
      setFormFilter({ ...formFilter, CodeValue1From: value, CodeValue1To: value })
    } else {
      setFormFilter({ ...formFilter, CodeValue1From: value })
    }
  }
  const handleToChange = (value) => {
    const valueCheck = dataNhomHang?.findIndex((item) => item.Ma === value) < dataNhomHang.findIndex((item) => item.Ma === formFilter?.CodeValue1From)
    if (formFilter.CodeValue1From === null || valueCheck) {
      setFormFilter({ ...formFilter, CodeValue1From: value, CodeValue1To: value })
    } else {
      setFormFilter({ ...formFilter, CodeValue1To: value })
    }
  }

  const handleFrom2Change = (value) => {
    const valueCheck = dataHangHoa?.findIndex((item) => item.MaHang === value) > dataHangHoa.findIndex((item) => item.MaHang === formFilter?.CodeValue2To)
    if (formFilter.CodeValue2To === null || valueCheck) {
      setFormFilter({ ...formFilter, CodeValue2From: value, CodeValue2To: value })
    } else {
      setFormFilter({ ...formFilter, CodeValue2From: value })
    }
  }
  const handleTo2Change = (value) => {
    const valueCheck = dataHangHoa?.findIndex((item) => item.MaHang === value) < dataHangHoa.findIndex((item) => item.MaHang === formFilter?.CodeValue2From)
    if (formFilter.CodeValue2From === null || valueCheck) {
      setFormFilter({ ...formFilter, CodeValue2From: value, CodeValue2To: value })
    } else {
      setFormFilter({ ...formFilter, CodeValue2To: value })
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
                <h1 className="w-full text-xl uppercase truncate">Hàng hóa tồn kho tạm tính toàn hệ thống</h1>
                <div>
                  <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                </div>
              </div>
              <div className="flex  ">
                {isShowSearch && (
                  <div className={`flex absolute left-[33rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'md:w-[10rem] lg:w-[20rem]' : 'w-0'} overflow-hidden`}>
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
                              localStorage.setItem('hiddenColumnHangHoaTKTT', JSON.stringify(value))
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
            <div className="flex  items-center px-2  gap-2">
              <div className="flex flex-col gap-y-2 ">
                <div className="flex  gap-1">
                  <div className="flex gap-1 items-center">
                    <div className="w-[42px] text-end">Nhóm</div>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      size="small"
                      allowClear
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1From}
                      onChange={handleFromChange}
                      style={{
                        width: '14vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                      optionLabelProp="value"
                    >
                      {dataNhomHang?.map((item) => (
                        <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className=" text-center">Đến</div>
                    <Select
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      size="small"
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1To}
                      onChange={handleToChange}
                      style={{
                        width: '14vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                      optionLabelProp="value"
                    >
                      {dataNhomHang?.map((item) => (
                        <Option key={item.Ma} value={item.Ma} title={item.Ten}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex gap-1 ">
                    <div className="w-[42px] text-end">Chọn</div>
                    <Select
                      mode="multiple"
                      allowClear
                      size="small"
                      placeholder="Chọn nhóm"
                      value={valueList1}
                      onChange={(value) => setValueList1(value)}
                      className="md:w-[40vw] lg:w-[50vw] truncate"
                      maxTagCount="responsive"
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                          <span>+{omittedValues?.length}...</span>
                        </Tooltip>
                      )}
                      popupMatchSelectWidth
                    >
                      {dataNhomHang?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          <p>
                            {item.Ma} - {item.Ten}
                          </p>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                {/*  */}
                <div className="flex  justify-between gap-1">
                  <div className="flex gap-1 items-center">
                    <div className="w-[42px] text-end">H.Hóa</div>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      size="small"
                      allowClear
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue2From}
                      onChange={handleFrom2Change}
                      style={{
                        width: '14vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                      optionLabelProp="value"
                    >
                      {dataHangHoa?.map((item) => (
                        <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                          {item.MaHang} - {item.TenHang}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className=" text-center">Đến</div>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      allowClear
                      size="small"
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue2To}
                      onChange={handleTo2Change}
                      style={{
                        width: '14vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                      optionLabelProp="value"
                    >
                      {dataHangHoa?.map((item) => (
                        <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                          {item.MaHang} - {item.TenHang}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex gap-1 ">
                    <div className="w-[42px] text-end">Chọn</div>
                    <Select
                      mode="multiple"
                      showSearch
                      allowClear
                      size="small"
                      placeholder="Chọn nhóm"
                      value={valueList2}
                      onChange={(value) => setValueList2(value)}
                      className="md:w-[40vw] lg:w-[50vw] truncate"
                      maxTagCount="responsive"
                      optionFilterProp="children"
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip title={omittedValues?.map(({ label }) => label)} color="blue">
                          <span>+{omittedValues?.length}...</span>
                        </Tooltip>
                      )}
                      popupMatchSelectWidth
                    >
                      {dataHangHoa?.map((item) => (
                        <Option key={item.MaHang} value={item.MaHang} title={item.TenHang}>
                          <p>
                            {item.MaHang} - {item.TenHang}
                          </p>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <Tooltip title="Xem dữ liệu" color="blue">
                  <div>
                    <ActionButton
                      title={''}
                      handleAction={handleFilterDS}
                      icon={<MdFilterAlt size={20} />}
                      color={'slate-50'}
                      background={'bg-main'}
                      color_hover={'bg-main'}
                      bg_hover={'white'}
                      isModal={true}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div id="my-table" className="relative px-2 py-1 ">
              <Table
                loading={tableLoad}
                className="GBL"
                columns={newColumnsHide}
                dataSource={filteredHangHoaTKTT}
                size="small"
                scroll={{
                  x: 1500,
                  y: 300,
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
                // Bảng Tổng
                summary={() => {
                  return (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column) => {
                            const isNumericColumn = typeof filteredHangHoaTKTT[0]?.[column.dataIndex] === 'number'
                            return (
                              <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                {isNumericColumn ? (
                                  <Text strong>
                                    {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: dataThongSo.SOLESOLUONG,
                                      maximumFractionDigits: dataThongSo.SOLESOLUONG,
                                    })}
                                  </Text>
                                ) : null}
                                {column.dataIndex === 'STT' ? (
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
          </div>
        </>
      )}
    </>
  )
}

export default HangHoaTKTT
