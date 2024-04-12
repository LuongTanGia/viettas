/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Empty, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import dayjs from 'dayjs'
import moment from 'moment'
import { TfiMoreAlt } from 'react-icons/tfi'
import { DateField } from '@mui/x-date-pickers'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import categoryAPI from '../../API/linkAPI'
import { RETOKEN, exportToExcel } from '../../action/Actions'
import { useSearch } from '../../components/hooks/Search'
import { nameColumsSoQuy } from '../../components/util/Table/ColumnName'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { PermissionView } from '../../components_K'

const SoQuy = () => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataSoQuy, setDataSoQuy] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataSoQuy)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [khoanNgayFrom, setKhoanNgayFrom] = useState('')
  const [khoanNgayTo, setKhoanNgayTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const showOption = useRef(null)
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()
  const [dateData, setDateData] = useState({})
  const [dateChange, setDateChange] = useState(false)
  const [dataCRUD, setDataCRUD] = useState()

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
    const key = Object?.keys(dataSoQuy[0] || []).filter((key) => key != 'DauKy' && key != 'CuoiKy' && key != 'ID' && key != 'Loai')
    setOptions(key)
  }, [selectVisible])

  useEffect(() => {
    const getTimeSetting = async () => {
      try {
        const response = await categoryAPI.KhoanNgay(TokenAccess)
        if (response.data.DataError == 0) {
          setDateData(response.data)
          setKhoanNgayFrom(dayjs(response.data.NgayBatDau))
          setKhoanNgayTo(dayjs(response.data.NgayKetThuc))
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
    if (!isLoading) {
      getTimeSetting()
    }
  }, [isLoading])

  useEffect(() => {
    setKhoanNgayFrom(dayjs(dateData?.NgayBatDau))
    setKhoanNgayTo(dayjs(dateData?.NgayKetThuc))
  }, [dateData?.NgayBatDau, dateData?.NgayKetThuc])

  useEffect(() => {
    const getDataSoQuy = async () => {
      try {
        if (isLoading == true) {
          setTableLoad(true)
          const response = await categoryAPI.InfoSoQuy(
            dateData == {}
              ? {}
              : {
                  NgayBatDau: dateData.NgayBatDau,
                  NgayKetThuc: dateData.NgayKetThuc,
                },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            setDataSoQuy(response.data.DataResults)
            setTableLoad(false)
          } else if (response.data.DataError == -104) {
            setDataSoQuy([])
            setTableLoad(false)
          } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
            await RETOKEN()
            getDataSoQuy()
          }
        }
      } catch (error) {
        console.log(error)
        setTableLoad(false)
      }
    }
    getDataSoQuy()
  }, [searchHangHoa, dateData?.NgayBatDau, dateData?.NgayKetThuc])

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
    if (dataCRUD?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataCRUD])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('TruyVan_SoQuy', TokenAccess)
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
  }, [isLoading])

  let timerId
  const handleSearch = (event) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
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
      if (
        !dateChange &&
        khoanNgayFrom &&
        khoanNgayTo &&
        typeof khoanNgayFrom.isAfter === 'function' &&
        typeof khoanNgayTo.isAfter === 'function' &&
        khoanNgayFrom.isAfter(khoanNgayTo)
      ) {
        setDateData({
          NgayBatDau: dayjs(khoanNgayFrom).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(khoanNgayFrom).format('YYYY-MM-DD'),
        })

        return
      } else if (dateChange && khoanNgayFrom && khoanNgayTo && khoanNgayFrom.isAfter(khoanNgayTo)) {
        setDateData({
          NgayBatDau: dayjs(khoanNgayTo).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(khoanNgayTo).format('YYYY-MM-DD'),
        })
      } else {
        setDateData({
          NgayBatDau: dayjs(khoanNgayFrom).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(khoanNgayTo).format('YYYY-MM-DD'),
        })
      }
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
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      with: 10,
      width: 50,
      align: 'center',
      fixed: 'left',
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
          <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY') : ''} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => (
        <span className="flex ">
          <HighlightedCell text={text} search={searchHangHoa} />
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
        <Tooltip title={text} color="blue">
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
      title: 'Công nợ',
      dataIndex: 'THUCONGNO',
      key: 'THUCONGNO',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.THUCONGNO - b.THUCONGNO,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trả hàng  ',
      dataIndex: 'THUTRAHANG',
      key: 'THUTRAHANG',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.THUTRAHANG - b.THUTRAHANG,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Khác ',
      dataIndex: 'THUKHAC',
      key: 'THUKHAC',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.THUKHAC - b.THUKHAC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Công nợ',
      dataIndex: 'CHICONGNO',
      key: 'CHICONGNO',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.CHICONGNO - b.CHICONGNO,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Trả hàng',
      dataIndex: 'CHITRAHANG',
      key: 'CHITRAHANG',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.CHITRAHANG - b.CHITRAHANG,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Khác',
      dataIndex: 'CHIKHAC',
      key: 'CHIKHAC',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.CHIKHAC - b.CHIKHAC,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'Còn lại',
      dataIndex: 'ConLai',
      key: 'ConLai',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.ConLai - b.ConLai,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
  ]
  const newTitles = titles?.filter((item) => !hiddenRow?.includes(item.dataIndex))
  const titlesChildren = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      with: 10,
      width: 50,
      align: 'center',
      fixed: 'left',
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
          <HighlightedCell text={text ? moment(text).format('DD/MM/YYYY') : ''} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => (
        <span className="flex ">
          <HighlightedCell text={text} search={searchHangHoa} />
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
        <Tooltip title={text} color="blue">
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
      title: 'Thu',
      align: 'center',
      ellipsis: true,
      children: [
        {
          title: 'Công nợ',
          dataIndex: 'THUCONGNO',
          key: 'THUCONGNO',
          width: 150,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.THUCONGNO - b.THUCONGNO,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trả hàng  ',
          dataIndex: 'THUTRAHANG',
          key: 'THUTRAHANG',
          width: 150,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.THUTRAHANG - b.THUTRAHANG,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Khác ',
          dataIndex: 'THUKHAC',
          key: 'THUKHAC',
          width: 150,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.THUKHAC - b.THUKHAC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Chi',
      ellipsis: true,
      align: 'center',
      children: [
        {
          title: 'Công nợ',
          dataIndex: 'CHICONGNO',
          key: 'CHICONGNO',
          width: 150,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.CHICONGNO - b.CHICONGNO,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Trả hàng',
          dataIndex: 'CHITRAHANG',
          key: 'CHITRAHANG',
          width: 150,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.CHITRAHANG - b.CHITRAHANG,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
            </div>
          ),
        },
        {
          title: 'Khác',
          dataIndex: 'CHIKHAC',
          key: 'CHIKHAC',
          width: 150,
          align: 'center',
          showSorterTooltip: false,
          sorter: (a, b) => a.CHIKHAC - b.CHIKHAC,
          render: (text) => (
            <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
              <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Còn lại',
      dataIndex: 'ConLai',
      key: 'ConLai',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.ConLai - b.ConLai,
      render: (text) => (
        <div className={`flex justify-end w-full h-full  px-2  ${text < 0 ? 'text-red-600 text-sm' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatThapPhan(text, 0)} search={searchHangHoa} />
        </div>
      ),
    },
  ]
  function filterChildren(children) {
    return children?.filter((item) => !hiddenRow?.includes(item.dataIndex))
  }
  const newTitlesChildren = titlesChildren
    .map((item) => {
      if (item.children && item.children.length > 0) {
        item.children = filterChildren(item.children)
        return item
      } else {
        return filterChildren([item])[0] || null
      }
    })
    .filter((item) => item !== null)

  return (
    <>
      {dataCRUD?.VIEW == false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-2 relative">
                  <div className="flex gap-1">
                    <div className="flex items-center gap-2 py-0.5">
                      <h1 className="text-lg font-bold uppercase">Sổ Quỹ Tiền Mặt</h1>
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
                    <Tooltip title="Chức năng khác" color="blue">
                      <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)}>
                        <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                      </div>
                    </Tooltip>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 bg-slate-200 py-3 px-2 items-center top-[12] right-[2.5%] rounded-lg z-10 duration-500 shadow-custom">
                        <div className={`flex ${selectVisible ? '' : 'flex-col'} items-center gap-2`}>
                          <ActionButton
                            handleAction={() => (dataCRUD?.EXCEL == false ? '' : exportToExcel())}
                            title={'Xuất Excel'}
                            isPermission={dataCRUD?.EXCEL}
                            icon={<RiFileExcel2Fill className="w-5 h-5" />}
                            color={'slate-50'}
                            background={dataCRUD?.EXCEL == false ? 'gray-400' : 'green-500'}
                            color_hover={dataCRUD?.EXCEL == false ? 'gray-500' : 'green-500'}
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
                        <div className="flex justify-center">
                          {selectVisible && (
                            <div>
                              <Checkbox.Group
                                style={{
                                  width: '330px',
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
                                  {options && options.length > 0 ? (
                                    options?.map((item, index) => (
                                      <Col span={10} key={(item, index)}>
                                        <Checkbox value={item} checked={true}>
                                          {nameColumsSoQuy[item]}
                                        </Checkbox>
                                      </Col>
                                    ))
                                  ) : (
                                    <Empty className="w-[100%] h-[100%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  )}
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
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="flex items-center gap-1">
                      <label>Từ</label>
                      <DateField
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        // className="DatePicker_NXTKho max-w-[120px]"
                        className=" max-w-[115px]"
                        format="DD/MM/YYYY"
                        value={khoanNgayFrom}
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
                          setKhoanNgayFrom(values)
                          setDateChange(false)
                        }}
                      />
                    </div>
                    <div className=" flex items-center gap-1 ">
                      <label>Đến</label>
                      <DateField
                        onBlur={handleDateChange}
                        onKeyDown={handleKeyDown}
                        className=" max-w-[115px]"
                        format="DD/MM/YYYY"
                        value={khoanNgayTo}
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
                          setKhoanNgayTo(values)
                          setDateChange(true)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div id="my-table" className="TruyVanSoQuy_Child">
                  <Table
                    loading={tableLoad}
                    bordered
                    className="setHeight"
                    columns={newTitlesChildren}
                    dataSource={filteredHangHoa?.map((record, index) => ({ ...record, key: index }))}
                    pagination={{
                      defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                      showSizeChanger: true,
                      pageSizeOptions: ['50', '100', '1000'],
                      onShowSizeChange: (current, size) => {
                        localStorage.setItem('pageSize', size)
                      },
                    }}
                    size="small"
                    scroll={{
                      x: 'max-content',
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
                                const data = filteredHangHoa?.map((record, index) => ({ ...record, key: index }))
                                const isNumericColumn = typeof data[0]?.[column.dataIndex] == 'number'
                                return (
                                  <Table.Summary.Cell
                                    index={index}
                                    key={`summary-cell-${index + 1}`}
                                    align={isNumericColumn ? 'right' : 'left'}
                                    className="text-end font-bold  bg-[#f1f1f1]"
                                  >
                                    {isNumericColumn ? (
                                      <Text strong>
                                        {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                          minimumFractionDigits: dataThongSo.SOLESOTIEN,
                                          maximumFractionDigits: dataThongSo.SOLESOTIEN,
                                        })}
                                      </Text>
                                    ) : column.dataIndex == 'STT' ? (
                                      <Text className="text-center flex justify-center" strong>
                                        {dataSoQuy?.length}
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
            </>
          )}
        </>
      )}
    </>
  )
}

export default SoQuy
