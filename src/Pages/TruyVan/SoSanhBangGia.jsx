import { useEffect, useState, useRef } from 'react'
import { Table, Checkbox, Tooltip, Row, Col, Typography, Input, Select } from 'antd'
import moment from 'moment'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'
import ActionButton from '../../components/util/Button/ActionButton'
import { RETOKEN, formatCurrency } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import { exportToExcel } from '../../action/Actions'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearchHH } from '../../components_K/myComponents/useSearchHH'
import { PermissionView } from '../../components_K'
const { Option } = Select
const { Text } = Typography
const { BsSearch, TfiMoreAlt, FaEyeSlash, RiFileExcel2Fill, MdFilterAlt } = icons
const SoSanhBG = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)

  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [data, setData] = useState([])

  // const [dataHangHoa, setDataHangHoa] = useState(null)
  const [dataNhomGia, setDataNhomGia] = useState([])

  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchSoSanhBG, filteredSoSanhBG, searchSoSanhBG] = useSearchHH(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [hideColumns, setHideColumns] = useState(false)
  const [checkedList, setCheckedList] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [newColumns, setNewColumns] = useState([])
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [valueList, setValueList] = useState([])

  const [formFilter, setFormFilter] = useState({
    CodeValue1From: null,
    CodeValue1To: null,
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
    const storedHiddenColumns = localStorage.getItem('hidenColumnSoSanhBG')
    const parsedHiddenColumns = storedHiddenColumns ? JSON.parse(storedHiddenColumns) : null

    // Áp dụng thông tin đã lưu vào checkedList và setConfirmed để ẩn cột
    if (Array.isArray(parsedHiddenColumns) && parsedHiddenColumns.length > 0) {
      setCheckedList(parsedHiddenColumns)
      setConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (confirmed) {
      setCheckedList(JSON.parse(localStorage.getItem('hidenColumnSoSanhBG')))
      setNewColumns(JSON.parse(localStorage.getItem('hidenColumnSoSanhBG')))
    }
  }, [confirmed])

  // get helper

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('get helper')

        const tokenLogin = localStorage.getItem('TKN')

        console.log('get helper  KH,DT')
        const response = await apis.ListHelperNhomGiaSoSanhBG(tokenLogin)
        if (response.data && response.data.DataError === 0) {
          setDataNhomGia(response.data.DataResults)
        } else if (response.data.DataError === -1 || response.data.DataError === -2 || response.data.DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        } else if (response.data.DataError === -107 || response.data.DataError === -108) {
          await RETOKEN()
          fetchData()
        } else {
          toast.error(response.data.DataErrorDescription)
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
      }
    }
    fetchData()
  }, [])
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
  //get DSSoSanhBG
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.VIEW) {
      getDSSoSanhBG()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  // default showFull
  useEffect(() => {
    if (formFilter.CodeValue1From === undefined || formFilter.CodeValue1To === undefined) {
      setFormFilter({ CodeValue1From: null, CodeValue1To: null })
    }
  }, [formFilter])

  const getDSSoSanhBG = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachSoSanhBG(tokenLogin, { ...formFilter, CodeValue1List: valueList.join(',') })

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSSoSanhBG()
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
      title: 'Nhóm hàng',
      dataIndex: 'ThongTinNhom',
      key: 'ThongTinNhom',
      width: 250,
      fixed: 'left',
      sorter: (a, b) => a.ThongTinNhom.localeCompare(b.ThongTinNhom),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchSoSanhBG} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchSoSanhBG} />
        </div>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div className="truncate text-start">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchSoSanhBG} />
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
          <HighlightedCell text={text} search={searchSoSanhBG} />
        </div>
      ),
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
    },
    {
      title: 'Mã vạch',
      dataIndex: 'MaVach',
      key: 'MaVach',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className="truncate text-start">
          <HighlightedCell text={text} search={searchSoSanhBG} />
        </div>
      ),

      sorter: (a, b) => {
        return a.MaVach - b.MaVach
      },
      showSorterTooltip: false,
    },
    {
      title: 'Kể từ ngày',
      dataIndex: 'HieuLucTu',
      key: 'HieuLucTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchSoSanhBG} />,
      width: 120,
      sorter: (a, b) => {
        const dateA = new Date(a.HieuLucTu)
        const dateB = new Date(b.HieuLucTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Giá bán lẻ',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.DonGia - b.DonGia,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatCurrency(text)} search={searchSoSanhBG} />
        </div>
      ),
    },
    {
      title: 'Đã có thuế',
      key: 'CoThue',
      dataIndex: 'CoThue',
      width: 120,
      align: 'center',
      render: (text) => <Checkbox value={text} disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.CoThue ? 1 : 0
        const valueB = b.CoThue ? 1 : 0
        return valueA - valueB
      },
      showSorterTooltip: false,
    },

    {
      title: '% Thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 120,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatCurrency(text)} search={searchSoSanhBG} />
        </div>
      ),
      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      showSorterTooltip: false,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY hh:mm:ss')} search={searchSoSanhBG} />,
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
          <HighlightedCell text={text} search={searchSoSanhBG} />
        </div>
      ),
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null} search={searchSoSanhBG} />,
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
          <HighlightedCell text={text} search={searchSoSanhBG} />
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

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchSoSanhBG(newSearch)
    }
  }
  const handleFilterDS = () => {
    setTableLoad(true)
  }
  const handleFromChange = (value) => {
    setFormFilter({ ...formFilter, CodeValue1From: value })

    if (formFilter.CodeValue1To === null || value > formFilter.CodeValue1To) {
      setFormFilter({ CodeValue1From: value, CodeValue1To: value })
    }
  }
  const handleToChange = (value) => {
    setFormFilter({ ...formFilter, CodeValue1To: value })

    if (formFilter.CodeValue1From === null || value < formFilter.CodeValue1From) {
      setFormFilter({ CodeValue1From: value, CodeValue1To: value })
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
                <h1 className="text-xl uppercase">So sánh các bảng giá</h1>
                <div>
                  <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
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
                <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5" onClick={() => setIsShowOption(!isShowOption)} title="Chức năng khác">
                  <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                </div>
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
                              localStorage.setItem('hidenColumnSoSanhBG', JSON.stringify(value))
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
                <div className="flex  justify-between gap-1">
                  <div className="flex gap-1 items-center">
                    <div className="w-[42px] text-end">Nhóm</div>
                    <Select
                      showSearch
                      size="small"
                      allowClear
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1From}
                      onChange={handleFromChange}
                      style={{
                        width: '12vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                    >
                      {dataNhomGia?.map((item) => (
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
                      size="small"
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1To}
                      onChange={handleToChange}
                      style={{
                        width: '12vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                    >
                      {dataNhomGia?.map((item) => (
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
                      maxTagCount={1}
                      size="small"
                      placeholder="Chọn nhóm"
                      value={valueList}
                      onChange={(value) => setValueList(value)}
                      className="w-[60vw] truncate"
                    >
                      {dataNhomGia?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="flex  justify-between gap-1">
                  <div className="flex gap-1 items-center">
                    <div className="w-[42px] text-end">Nhóm</div>
                    <Select
                      showSearch
                      size="small"
                      allowClear
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1From}
                      onChange={handleFromChange}
                      style={{
                        width: '12vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                    >
                      {dataNhomGia?.map((item) => (
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
                      size="small"
                      placeholder="Chọn nhóm"
                      value={formFilter.CodeValue1To}
                      onChange={handleToChange}
                      style={{
                        width: '12vw',
                        textOverflow: 'ellipsis',
                      }}
                      popupMatchSelectWidth={false}
                    >
                      {dataNhomGia?.map((item) => (
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
                      maxTagCount={1}
                      size="small"
                      placeholder="Chọn nhóm"
                      value={valueList}
                      onChange={(value) => setValueList(value)}
                      className="w-[60vw] truncate"
                    >
                      {dataNhomGia?.map((item) => (
                        <Option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="">
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
                className=" setHeight"
                columns={newColumnsHide}
                dataSource={filteredSoSanhBG}
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
                        <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"></Table.Summary.Cell>
                        {newColumnsHide
                          .filter((column) => column.render)
                          .map((column) => {
                            const isNumericColumn = typeof filteredSoSanhBG[0]?.[column.dataIndex] === 'number'
                            return (
                              <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                {column.dataIndex === 'STT' ? (
                                  <Text className="text-center" strong>
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

export default SoSanhBG
