/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { FaSearch } from 'react-icons/fa'
import { Table, Tooltip } from 'antd'
import categoryAPI from '../../../../../API/linkAPI'
import logo from '../../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../../action/Actions'
import ActionButton from '../../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../../util/Loading/LoadingPage'
import { useSearch } from '../../../../hooks/Search'
import { toast } from 'react-toastify'

const NCKConfirm = ({ close, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataNCKUnconfirm, setDataNCKUnconfirm] = useState('')
  const [dataXCKView, setDataXCKView] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataNCKUnconfirm)

  useEffect(() => {
    const listUnconfirmed = async () => {
      try {
        const response = await categoryAPI.ListChuaDuyetNCK(TokenAccess)
        if (response.data.DataError == 0) {
          setDataNCKUnconfirm(response.data.DataResults)
          setIsLoading(true)
          setTableLoad(false)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          listUnconfirmed()
        } else {
          setDataNCKUnconfirm([])
          setIsLoading(true)
          setTableLoad(false)
        }
      } catch (error) {
        console.error(error)
        setIsLoading(true)
      }
    }
    if (tableLoad || !isLoading) {
      listUnconfirmed()
    }
  }, [isLoading, tableLoad])

  useEffect(() => {
    setTargetRow([])
  }, [])

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
  const handleSearch = (event) => {
    setTableLoad(true)
    setSearchHangHoa(event.target.value)
  }
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

  const handleView = async (record) => {
    setIsShowModal(true)
    try {
      const response = await categoryAPI.XCKView(record.SoChungTu, TokenAccess)
      if (response.data.DataError == 0) {
        setDataXCKView(response.data.DataResult)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleView()
      }
    } catch (error) {
      console.error(error)
      setIsLoading(true)
      setTableLoad(false)
    }
  }
  const handleConfirm = async () => {
    try {
      const response = await categoryAPI.DuyetPhieuNCK(dataXCKView?.SoChungTu, TokenAccess)
      if (response.data.DataError == 0) {
        loadingData()
        setTableLoad(true)
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setTargetRow(response.data.DataResults[0].SoChungTu)
        setIsShowModal(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        handleView()
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }

  const title = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      showSorterTooltip: false,
      fixed: 'left',
      align: 'center',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => <span className="flex justify-center"> {text}</span>,
    },
    {
      title: 'Ngày chứng từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      width: 150,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{formatDateTime(text)}</span>,
    },
    {
      title: 'Kho chuyển',
      dataIndex: 'MaKho',
      key: 'MaKho',
      showSorterTooltip: false,
      align: 'center',
      width: 120,
      sorter: (a, b) => a.MaKho.localeCompare(b.MaKho),
      render: (text) => <span className="flex justify-center"> {text}</span>,
    },
    {
      title: 'Số mặt hàng ',
      dataIndex: 'CountLine',
      key: 'CountLine',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.CountLine - b.CountLine,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          {formatThapPhan(text, dataThongSo.SOLESOLUONG)}
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
              display: 'flex',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              justifyContent: 'start',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      width: 200,
      key: 'NguoiTao',
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
              cursor: 'pointer',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      width: 180,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{formatDateTime(text, true)}</span>,
    },
    {
      title: 'Người sửa',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      align: 'center',
      width: 200,
      showSorterTooltip: false,
      sorter: (a, b) => (a.NguoiSuaCuoi?.toString() || '').localeCompare(b.NguoiSuaCuoi?.toString() || ''),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Sửa lúc',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      width: 180,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
      render: (text) => <span className="flex justify-center">{text ? formatDateTime(text, true) : ''}</span>,
    },
  ]
  const titleXDC = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      render: (text) => <span className="flex justify-center"> {text}</span>,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
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
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      showSorterTooltip: false,
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      render: (text) => <span className="flex justify-center"> {text}</span>,
    },
    {
      title: 'Số lượng ',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          {formatThapPhan(text, dataThongSo.SOLESOLUONG)}
        </span>
      ),
    },
  ]
  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 py-1 px-2 xl:w-[80vw] lg:w-[90vw] md:w-[95vw] ">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-2 items-center">
                    <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                    <p className="text-blue-700 font-semibold uppercase py-1">Danh Sách Chưa Duyệt</p>
                    <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                  </div>
                  <div className="flex w-[20rem] overflow-hidden">
                    {isShowSearch && (
                      <input
                        type="text"
                        value={searchHangHoa}
                        placeholder="Nhập ký tự bạn cần tìm"
                        onChange={handleSearch}
                        className="px-2 py-0.5 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[1px] hover:border-blue-500 outline-none text-[1rem]  "
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 border rounded px-1 py-2.5">
                  <Table
                    loading={tableLoad}
                    className="table_view"
                    columns={title}
                    dataSource={filteredHangHoa?.map((item, index) => ({ ...item, key: index }))}
                    size="small"
                    scroll={{
                      x: 1800,
                      y: 300,
                    }}
                    bordered
                    onRow={(record) => ({
                      onDoubleClick: () => {
                        handleView(record)
                      },
                    })}
                    pagination={false}
                  ></Table>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="flex gap-2 justify-end ">
                    <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {isShowModal ? (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col xl:w-[87vw] lg:w-[95vw] md:w-[95vw] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden z-10">
                <div className="flex flex-col gap-2 p-2 ">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 py-1">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Thông tin xác nhận- Phiếu Xuất Chuyển Kho</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-2 px-1 py-2.5">
                    <div className="grid grid-cols-2 items-center gap-2">
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1">
                            <label className="required whitespace-nowrap min-w-[100px] flex justify-end text-sm">Số chứng từ</label>
                            <input type="text" value={dataXCKView?.SoChungTu || ''} className="px-2 w-full resize-none rounded border outline-none text-[1rem] truncate" readOnly />
                          </div>
                          <div className="flex items-center gap-1">
                            <label className="required whitespace-nowrap text-sm">Ngày C.Từ</label>
                            <input
                              type="text"
                              value={moment(dataXCKView?.NgayCTu)?.format('DD/MM/YYYY') || ''}
                              className="px-2 w-[7rem] rounded resize-none border outline-none text-[1rem] text-center truncate"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap min-w-[100px] flex justify-end text-sm">Kho hàng</label>
                          <input
                            type="text"
                            value={`${dataXCKView?.MaKho} - ${dataXCKView?.TenKho}` || ''}
                            className="px-2 w-full rounded resize-none border outline-none text-[1rem]"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 border-2 px-2 py-2.5 border-black-200 rounded relative">
                        <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                        <div className="flex gap-1">
                          <div className="flex gap-1 items-center">
                            <label className="whitespace-nowrap text-sm">Người tạo</label>
                            <Tooltip title={dataXCKView?.NguoiTao} color="blue">
                              <input
                                className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border outline-none text-[1rem] overflow-ellipsis truncate"
                                value={dataXCKView?.NguoiTao || ''}
                                readOnly
                              />
                            </Tooltip>
                          </div>
                          <div className="flex gap-1 items-center">
                            <label className="text-sm">Lúc</label>
                            <Tooltip title={moment(dataXCKView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''} color="blue">
                              <input
                                className="px-2 w-full resize-none rounded border outline-none text-[1rem] truncate"
                                value={moment(dataXCKView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                                readOnly
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex gap-1 items-center">
                            <label className="whitespace-nowrap text-sm">Người sửa</label>
                            <Tooltip title={dataXCKView?.NguoiSuaCuoi} color="blue">
                              <input
                                className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border  outline-none text-[1rem] overflow-ellipsis truncate"
                                value={dataXCKView?.NguoiSuaCuoi || ''}
                                readOnly
                              />
                            </Tooltip>
                          </div>
                          <div className="flex gap-1 items-center">
                            <label className="text-sm">Lúc</label>
                            <Tooltip title={dataXCKView?.NgaySuaCuoi ? moment(dataXCKView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''} color="blue">
                              <input
                                className="px-2 w-full resize-none rounded border outline-none text-[1rem] truncate"
                                value={dataXCKView?.NgaySuaCuoi ? moment(dataXCKView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                                readOnly
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="whitespace-nowrap min-w-[100px] flex justify-end text-sm">Ghi chú</label>
                      <input type="text" value={dataXCKView?.GhiChu || ''} className="px-2 w-[70rem] rounded resize-none border outline-none text-[1rem]" readOnly />
                    </div>
                    <div className="border rounded">
                      <Table
                        className="table_view"
                        columns={titleXDC}
                        dataSource={dataXCKView?.DataDetails?.map((item, index) => ({ ...item, key: index }))}
                        size="small"
                        scroll={{
                          x: 1000,
                          y: 300,
                        }}
                        bordered
                        pagination={false}
                        // summary={() => {
                        //   return (
                        //     <Table.Summary fixed="bottom">
                        //       <Table.Summary.Row>
                        //         {titleXDC
                        //           .filter((column) => column.render)
                        //           .map((column, index) => {
                        //             const isNumericColumn = typeof dataXCKView?.DataDetails[0]?.[column.dataIndex] === 'number'
                        //             return (
                        //               <Table.Summary.Cell index={index} key={`summary-cell-${index + 1}`} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                        //                 {isNumericColumn ? (
                        //                   column.dataIndex === 'SoLuong' ? (
                        //                     <Text strong>
                        //                       {Number(dataXCKView?.DataDetails?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                        //                         minimumFractionDigits: dataThongSo?.SOLESOLUONG,
                        //                         maximumFractionDigits: dataThongSo?.SOLESOLUONG,
                        //                       })}
                        //                     </Text>
                        //                   ) : (
                        //                     <Text strong>
                        //                       {Number(dataXCKView?.DataDetails?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                        //                         minimumFractionDigits: 0,
                        //                         maximumFractionDigits: 0,
                        //                       })}
                        //                     </Text>
                        //                   )
                        //                 ) : null}
                        //               </Table.Summary.Cell>
                        //             )
                        //           })}
                        //       </Table.Summary.Row>
                        //     </Table.Summary>
                        //   )
                        // }}
                      ></Table>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end ">
                    <ActionButton
                      handleAction={handleConfirm}
                      title={'Xác nhận'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                    />
                    <ActionButton
                      handleAction={() => setIsShowModal(false)}
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
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </>
  )
}

export default NCKConfirm
