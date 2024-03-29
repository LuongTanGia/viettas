/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Button, Checkbox, Col, Empty, Input, Row, Spin, Table, Tooltip, Typography } from 'antd'
const { Text } = Typography
import moment from 'moment'
import { CgCloseO } from 'react-icons/cg'
import { TfiMoreAlt } from 'react-icons/tfi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { FaSearch, FaEyeSlash } from 'react-icons/fa'
import { CloseSquareFilled } from '@ant-design/icons'
import { MdEdit, MdDelete } from 'react-icons/md'
import { useSearch } from '../../components/hooks/Search'
import { RETOKEN, exportToExcel } from '../../action/Actions'
import categoryAPI from '../../API/linkAPI'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import ActionButton from '../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import { nameColumsHangMucThu } from '../../components/util/Table/ColumnName'
import HMTCreate from '../../components/Modals/DanhMuc/HangMucThu/HMTCreate'
import HMTView from '../../components/Modals/DanhMuc/HangMucThu/HMTView'
import HMTEdit from '../../components/Modals/DanhMuc/HangMucThu/HMTEdit'
import HMTDelete from '../../components/Modals/DanhMuc/HangMucThu/HMTDelete'
const HangMucThu = () => {
  const navigate = useNavigate()
  const TokenAccess = localStorage.getItem('TKN')
  const [dataHangMucThu, setDataHangMucThu] = useState()
  const [setSearchHangMucThu, filteredHangMucThu, searchHangMucThu] = useSearch(dataHangMucThu)
  const [isMaHang, setIsMaHang] = useState()
  const [actionType, setActionType] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const showOption = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [targetRow, setTargetRow] = useState([])
  const [dataCRUD, setDataCRUD] = useState()
  const [hiddenRow, setHiddenRow] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [selectVisible, setSelectVisible] = useState(false)
  const [options, setOptions] = useState()

  useEffect(() => {
    setHiddenRow(JSON.parse(localStorage.getItem('hiddenColumns')))
    setCheckedList(JSON.parse(localStorage.getItem('hiddenColumns')))
    const key = Object.keys(dataHangMucThu ? dataHangMucThu[0] : [] || []).filter((key) => key)
    setOptions(key)
  }, [selectVisible])

  useEffect(() => {
    const getListHangMucThu = async () => {
      try {
        setTableLoad(true)
        const response = await categoryAPI.HangMucThu(TokenAccess)
        if (response.data.DataError === 0) {
          setDataHangMucThu(response.data.DataResults)
          setTableLoad(false)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getListHangMucThu()
        } else {
          setDataHangMucThu([])
          setTableLoad(false)
          setIsLoading(true)
        }
      } catch (error) {
        console.log(error)
        setTableLoad(false)
      }
    }
    getListHangMucThu()
  }, [searchHangMucThu, targetRow])

  useEffect(() => {
    if (dataCRUD?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataCRUD])

  useEffect(() => {
    const getDataQuyenHan = async () => {
      try {
        const response = await categoryAPI.QuyenHan('DanhMuc_HangMucThu', TokenAccess)
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

  const handleLoading = () => {
    setTableLoad(true)
  }
  const handleSearch = (event) => {
    let timerId
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      setSearchHangMucThu(event.target.value)
    }, 300)
  }
  const handleCreate = () => {
    setActionType('create')
    setIsShowModal(true)
    setIsMaHang([])
  }
  const handleDelete = (record) => {
    setActionType('delete')
    setIsShowModal(true)
    setIsMaHang(record)
  }
  const handleView = (record) => {
    setActionType('view')
    setIsMaHang(record)
    setIsShowModal(true)
  }
  const handleUpdate = (record) => {
    setActionType('edit')
    setIsMaHang(record)
    setIsShowModal(true)
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
  const titles = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (text, record, index) => index + 1,
      fixed: 'left',
      width: 50,
      align: 'center',
    },
    {
      title: 'Mã',
      dataIndex: 'Ma',
      key: 'Ma',
      fixed: 'left',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.Ma.localeCompare(b.Ma),
      showSorterTooltip: false,
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchHangMucThu} />
        </div>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'Ten',
      key: 'Ten',
      width: 220,
      align: 'center',
      sorter: (a, b) => a.Ten.localeCompare(b.Ten),
      showSorterTooltip: false,
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangMucThu} />
          </div>
        </Tooltip>
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
              display: 'flex',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              justifyContent: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangMucThu} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 250,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <HighlightedCell text={text} search={searchHangMucThu} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      width: 200,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss.SS')} search={searchHangMucThu} />,
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      width: 250,
      ellipsis: 'true',
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <HighlightedCell text={text} search={searchHangMucThu} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      width: 200,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => {
        if (text) {
          return <HighlightedCell text={moment(text).format('DD/MM/YYYY HH:mm:ss.SS')} search={searchHangMucThu} />
        } else {
          return ''
        }
      },
    },
    {
      title: ' ',
      key: 'operation',
      fixed: 'right',
      width: 80,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center ">
              <Tooltip title="Sửa" color="blue">
                <div
                  onClick={() => (dataCRUD?.EDIT == false ? '' : handleUpdate(record))}
                  className={`${
                    dataCRUD?.EDIT == false ? 'border-gray-400 bg-gray-400  hover:text-gray-500' : 'border-yellow-400 bg-yellow-400 hover:text-yellow-400'
                  } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
                >
                  <MdEdit />
                </div>
              </Tooltip>
              <Tooltip title="Xóa" color="blue">
                <div
                  onClick={() => (dataCRUD?.DEL == false ? '' : handleDelete(record))}
                  className={`${
                    dataCRUD?.DEL == false ? 'border-gray-400 bg-gray-400 hover:text-gray-500' : 'border-red-500 bg-red-500 hover:text-red-500'
                  } ' p-[4px] border-2 rounded text-slate-50 hover:bg-white cursor-pointer'`}
                >
                  <MdDelete />
                </div>
              </Tooltip>
            </div>
          </>
        )
      },
    },
  ]
  const newTitles = titles.filter((item) => !hiddenRow?.includes(item.dataIndex))

  return (
    <>
      {dataCRUD?.VIEW == false ? (
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
                          navigate(-1)
                        }}
                        title={'Đóng'}
                        isModal={true}
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
          {!isLoading ? (
            <SimpleBackdrop />
          ) : (
            <>
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between gap-2 relative">
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 mt-1">
                      <h1 className="text-xl font-black uppercase">Hạng Mục Thu Tiền</h1>
                      <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                    </div>
                    <div className="flex">
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
                  <div className="flex justify-between" ref={showOption}>
                    <Tooltip title="Chức năng khác" color="blue">
                      <div className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5  " onClick={() => setIsShowOption(!isShowOption)}>
                        <TfiMoreAlt className={`duration-300 rotate-${isShowOption ? '0' : '90'}`} />
                      </div>
                    </Tooltip>
                    {isShowOption && (
                      <div className="absolute flex flex-col gap-2 items-center bg-slate-200 py-3 px-2 top-0 right-[2.5%] rounded-lg z-10 duration-500 shadow-custom">
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
                                  width: '340px',
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
                                          {nameColumsHangMucThu[item]}
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
                <div className="flex justify-end ">
                  <div className="flex gap-2">
                    <ActionButton
                      handleAction={() => (dataCRUD?.ADD == false ? '' : handleCreate())}
                      title={'Thêm Hạng Mục'}
                      icon={<IoMdAddCircleOutline className="w-6 h-6" />}
                      color={'slate-50'}
                      background={dataCRUD?.ADD == false ? 'gray-400' : 'blue-500'}
                      color_hover={dataCRUD?.ADD == false ? 'gray-500' : 'blue-500'}
                      bg_hover={'white'}
                      isPermission={dataCRUD?.ADD}
                    />
                  </div>
                </div>
                <div id="my-table">
                  <Table
                    loading={tableLoad}
                    bordered
                    onRow={(record) => ({
                      onDoubleClick: () => {
                        handleView(record)
                      },
                    })}
                    rowClassName={(record) => (record.Ma == targetRow ? 'highlighted-row' : '')}
                    className="setHeight"
                    columns={newTitles}
                    dataSource={filteredHangMucThu.map((item, index) => ({
                      ...item,
                      key: index,
                    }))}
                    size="small"
                    scroll={{
                      x: 1800,
                      y: 400,
                    }}
                    pagination={{
                      defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                      showSizeChanger: true,
                      pageSizeOptions: ['50', '100', '1000'],
                      onShowSizeChange: (current, size) => {
                        localStorage.setItem('pageSize', size)
                      },
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
                                const isNumericColumn = typeof filteredHangMucThu[0]?.[column.dataIndex] === 'number'
                                return (
                                  <Table.Summary.Cell
                                    index={index}
                                    key={`summary-cell-${index + 1}`}
                                    align={isNumericColumn ? 'right' : 'left'}
                                    className="text-end font-bold  bg-[#f1f1f1]"
                                  >
                                    {column.dataIndex == 'STT' ? (
                                      <Text className="text-center flex justify-center" strong>
                                        {dataHangMucThu?.length}
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
              <div>
                {isShowModal &&
                  (actionType == 'create' ? (
                    <HMTCreate close={() => setIsShowModal(false)} loadingData={handleLoading} setTargetRow={setTargetRow} />
                  ) : actionType == 'view' ? (
                    <HMTView close={() => setIsShowModal(false)} dataHMT={isMaHang} />
                  ) : actionType == 'edit' ? (
                    <HMTEdit close={() => setIsShowModal(false)} dataHMT={isMaHang} loadingData={handleLoading} setTargetRow={setTargetRow} />
                  ) : actionType == 'delete' ? (
                    <HMTDelete close={() => setIsShowModal(false)} dataHMT={isMaHang} loadingData={handleLoading} setTargetRow={setTargetRow} />
                  ) : null)}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default HangMucThu
