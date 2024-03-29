/* eslint-disable react/prop-types */
import { Segmented, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import logo from '../assets/VTS-iSale.ico'
import * as apis from '../apis'
import { RETOKEN, formatPrice } from '../action/Actions'
import { DateField } from '@mui/x-date-pickers'
import ActionButton from '../components/util/Button/ActionButton'
import { toast } from 'react-toastify'

import icons from '../untils/icons'
import { useEffect, useState } from 'react'
const { Text } = Typography
// import { toast } from 'react-toastify'
const { GoQuestion } = icons
const ModalTongHopPBL = ({ actionType, typePage, namePage, close, dataRecord, dataThongSo, loading, formSynthetics }) => {
  const [typeData, setTypeData] = useState('Phiếu bán hàng')
  const [isChanging, setIsChanging] = useState(false)
  const [tableLoad, setTableLoad] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [dataThongTin, setDataThongTin] = useState({})
  const formSynthetic = {
    NgayCTu: dataRecord ? dataRecord.NgayCTu : '',
    Quay: dataRecord ? dataRecord.Quay : 0,
    Ca: dataRecord ? dataRecord.Ca : '',
    NhanVien: dataRecord ? dataRecord.NhanVien : '',
  }

  const formDEL = {
    NgayCTu: dataRecord ? dataRecord.NgayCTu : '',
    Quay: dataRecord ? dataRecord.Quay : 0,
    Ca: dataRecord ? dataRecord.Ca : '',
    NhanVien: dataRecord ? dataRecord.NguoiTao : '',
  }

  // get data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        if (actionType === 'view') {
          const response = await apis.ThongTinTongHopPBL(tokenLogin, dataRecord)
          if (response) {
            const { DataError, DataErrorDescription } = response.data
            if (DataError === 0) {
              setDataThongTin(response.data)
              setTableLoad(false)
            } else if (DataError === -107 || DataError === -108) {
              await RETOKEN()
              fetchData()
            } else if (DataError === -1 || DataError === -2 || DataError === -3) {
              toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
              setTableLoad(false)
            } else {
              toast.error(DataErrorDescription)
              setTableLoad(false)
            }
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        setTableLoad(false)
      }
    }

    fetchData()
  }, [typeData])

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
      width: 200,
      fixed: 'left',
      sorter: (a, b) => a.MaDoiTuong.localeCompare(b.MaDoiTuong),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div className="text-start truncate">{text}</div>,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 250,
      sorter: (a, b) => a.TenDoiTuong.localeCompare(b.TenDoiTuong),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div className="text-start truncate">{text}</div>,
    },

    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 200,
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div className="text-start truncate">{text}</div>,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div className="text-start truncate">{text}</div>,
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 150,
      align: 'center',
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
    },

    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo?.SOLESOLUONG)}</div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      showSorterTooltip: false,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo?.SOLESOTIEN)}</div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      showSorterTooltip: false,
    },
    {
      title: 'Tiền hàng',
      dataIndex: 'TienHang',
      key: 'TienHang',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo?.SOLESOTIEN)}</div>
      ),
      sorter: (a, b) => a.TienHang - b.TienHang,
      showSorterTooltip: false,
    },
    {
      title: '% Thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 100,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo?.SOLETYLE)}</div>
      ),
      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      showSorterTooltip: false,
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TienThue',
      key: 'TienThue',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo?.SOLESOTIEN)}</div>
      ),
      sorter: (a, b) => a.TienThue - b.TienThue,
      showSorterTooltip: false,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo?.SOLESOTIEN)}</div>
      ),
      sorter: (a, b) => a.ThanhTien - b.ThanhTien,
      showSorterTooltip: false,
    },

    {
      title: '%CK TH.Toán',
      dataIndex: 'TyLeCKTT',
      key: 'TyLeCKTT',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TyLeCKTT - b.TyLeCKTT,
      showSorterTooltip: false,
      render: (text) => <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo.SOLESOTIEN)}</div>,
    },
    {
      title: 'Tiền CK TH.Toán',
      dataIndex: 'TienCKTT',
      key: 'TienCKTT',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TienCKTT - b.TienCKTT,
      showSorterTooltip: false,
      render: (text) => <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo.SOLESOTIEN)}</div>,
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'TongCong',
      key: 'TongCong',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.TongCong - b.TongCong,
      showSorterTooltip: false,
      render: (text) => <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo.SOLESOTIEN)}</div>,
    },
  ]

  const column2 = [
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
      title: 'Diễn giải',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      align: 'center',
      width: 250,
      sorter: (a, b) => a.GhiChu.localeCompare(b.GhiChu),
      showSorterTooltip: false,
      render: (text) => <div className="text-start truncate">{text}</div>,
    },

    {
      title: typeData === 'Phiếu thu' ? 'Số tiền thu' : 'Số tiền chi',
      dataIndex: 'SoTien',
      key: 'SoTien',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.SoTien - b.SoTien,
      showSorterTooltip: false,
      render: (text) => <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>{formatPrice(text, dataThongSo.SOLESOTIEN)}</div>,
    },
  ]

  const handleLapChungTu = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'TongHopPBL':
          response = await apis.TongHopPBL(tokenLogin, formSynthetic)
          break
        // case 'SDR':
        //   response = await apis.ThemSDR(tokenLogin, formCreate)
        //   break
        default:
          break
      }

      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleLapChungTu()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  const handleSynthetics = async () => {
    setIsLoading(true)
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let allSuccess = true
      for (const obj of formSynthetics.DanhSach) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        let response
        response = await apis.TongHopPBL(tokenLogin, obj)
        if (response) {
          const { DataError } = response

          if (DataError === -1 || DataError === -2 || DataError === -3) {
            allSuccess = false
          } else if (DataError === -107 || DataError === -108) {
            await RETOKEN()
            handleSynthetics()
          } else {
            allSuccess = false
          }
        }
      }
      setIsLoading(false)
      if (allSuccess) {
        toast.success('Xử lý dự liệu thành công')
        loading()
        close()
      } else {
        toast.error('Xử lý dự liệu thất bại')
      }
    } catch (error) {
      console.error('Error while saving data:', error)
      toast.error('Có lỗi xảy ra khi xử lý dữ liệu')
    }
  }

  const handleDelete = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GoChotCa':
          response = await apis.GoChotCa(tokenLogin, formDEL)
          break

        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  let dataSource

  if (typeData === 'Phiếu bán hàng') {
    dataSource = dataThongTin?.DataResults_PBL
  } else if (typeData === 'Phiếu thu') {
    dataSource = dataThongTin?.DataResults_THU
  } else if (typeData === 'Phiếu chi') {
    dataSource = dataThongTin?.DataResults_CHI
  }

  return (
    <>
      <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
        <div className="px-4 pt-4 pb-2 absolute shadow-lg bg-white rounded-md flex flex-col ">
          {actionType === 'view' && (
            <div className="w-[90vw] ">
              <div className="flex gap-2">
                <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
                <label className="text-blue-700 font-semibold uppercase pb-1">{namePage}</label>
              </div>
              <div className="border w-full  rounded-[4px]-sm text-sm ">
                <div className="grid grid-cols-4  gap-2 m-2 pb-[2px]">
                  <div className="flex  items-center gap-1 ">
                    <label className="min-w-[90px] text-sm flex justify-end">Quầy</label>
                    <input
                      value={dataRecord.Quay}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center  gap-2 ">
                    <label className="text-sm ">Ngày</label>
                    <DateField
                      className="w-[135px] bg-[#fafafa]"
                      format="DD/MM/YYYY"
                      value={dayjs(dataRecord?.NgayCTu)}
                      disabled
                      sx={{
                        '& .MuiButtonBase-root': {
                          padding: '4px',
                        },

                        '& .MuiSvgIcon-root': {
                          width: '18px',
                          height: '18px',
                        },
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="w-[30px] text-sm flex justify-end">Ca</label>
                    <input
                      value={dataRecord.Ca}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4  gap-2 m-2">
                  <div className="flex items-center gap-1 ">
                    <label className="min-w-[90px] text-sm flex justify-end whitespace-nowrap">Nhân viên</label>
                    <input
                      value={dataRecord.NhanVien}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <input
                      // value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className=" w-[30px] text-sm flex justify-end">Kho</label>
                    <input
                      // value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <input
                      // value={dataRecord.SoChungTu}
                      type="text"
                      className="h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="min-w-[90px] text-sm flex justify-end whitespace-nowrap">Tổng tiền bán</label>
                    <input
                      value={formatPrice(dataRecord.TongThanhTien, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="text-sm flex justify-end whitespace-nowrap">Thu khác tại quầy</label>
                    <input
                      value={formatPrice(dataRecord.TongThu, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className=" text-sm flex justify-end whitespace-nowrap">Chi khác tại quầy</label>
                    <input
                      value={formatPrice(dataRecord.TongChi, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-1 ">
                    <label className="   text-sm flex justify-end whitespace-nowrap">Số tiền phải nộp</label>
                    <input
                      value={formatPrice(dataRecord.TienPhaiNop, dataThongSo.SOLESOTIEN)}
                      type="text"
                      className="text-end h-[24px] px-2 w-full rounded-[4px] resize-none border-[1px] border-gray-300 outline-none  truncate"
                      disabled
                    />
                  </div>
                </div>

                <Segmented
                  options={['Phiếu bán hàng', 'Phiếu thu', 'Phiếu chi']}
                  value={typeData}
                  onChange={(value) => {
                    if (!isChanging) {
                      setIsChanging(true)
                      setTypeData(value)
                      setTableLoad(true)
                      setTimeout(() => {
                        setIsChanging(false)
                      }, 1000)
                    }
                  }}
                />

                {/* table */}
                <Spin spinning={tableLoad}>
                  <div>
                    <Table
                      className="TongHopPBL_view "
                      columns={typeData === 'Phiếu bán hàng' ? columns : column2}
                      dataSource={dataSource}
                      size="small"
                      scroll={{
                        x: 'max-content',
                        y: 200,
                      }}
                      bordered
                      pagination={false}
                      summary={() => {
                        return !dataSource ? null : (
                          <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                              {columns
                                .filter((column) => column.render)
                                .map((column) => {
                                  const isNumericColumn = typeof dataSource[0]?.[column.dataIndex] === 'number'
                                  return typeData === 'Phiếu bán hàng' ? (
                                    <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                      {column.dataIndex === 'TyLeCKTT' || column.dataIndex === 'TyLeThue' ? (
                                        <Text strong>
                                          {Number(dataSource.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLETYLE,
                                            maximumFractionDigits: dataThongSo?.SOLETYLE,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'SoLuong' ? (
                                        <Text strong>
                                          {Number(dataSource.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOLUONG,
                                            maximumFractionDigits: dataThongSo?.SOLESOLUONG,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'TienHang' ||
                                        column.dataIndex === 'TienThue' ||
                                        column.dataIndex === 'ThanhTien' ||
                                        column.dataIndex === 'TienCKTT' ||
                                        column.dataIndex === 'DonGia' ||
                                        column.dataIndex === 'SoTien' ||
                                        column.dataIndex === 'TongCong' ? (
                                        <Text strong>
                                          {Number(dataSource.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'STT' ? (
                                        <Text strong>{dataSource?.length}</Text>
                                      ) : null}
                                    </Table.Summary.Cell>
                                  ) : (
                                    <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                      {column.dataIndex === 'SoTien' ? (
                                        <Text strong>
                                          {Number(dataSource.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'STT' ? (
                                        <Text strong>{dataSource?.length}</Text>
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
                </Spin>
              </div>
              {/* button */}
              <div className="flex justify-end items-center mt-[10px] gap-2 ">
                <ActionButton
                  color={'slate-50'}
                  title={'Lập chứng từ'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleLapChungTu()}
                />
                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'delete' && (
            <div className=" h-[268px] items-center  ">
              <label className="text-blue-700 font-semibold uppercase pb-1">Kiểm tra dữ liệu</label>
              <div className="flex items-center  border p-3 gap-3">
                <div className="text-bg-main">
                  <GoQuestion size={40}></GoQuestion>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label>Bạn đang gỡ dữ liệu của :</label>
                  <div className="px-4 ">
                    Ngày : <span>{dayjs(dataRecord.NgayCTu).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="px-4">
                    Quầy : <span>{dataRecord.Quay}</span>
                  </div>
                  <div className="px-4">
                    Ca : <span>{dataRecord.Ca}</span>
                  </div>
                  <div className="px-4">
                    Nhân viên : <span>{dataRecord.NguoiTao}</span>
                  </div>
                  <div>Bạn có chắc chắn muốn gỡ dữ liệu này không?</div>
                </div>
              </div>
              <div className="flex justify-end mt-2 gap-2">
                <ActionButton
                  color={'slate-50'}
                  title={'Xác nhận'}
                  isModal={true}
                  background={'bg-main'}
                  bg_hover={'white'}
                  color_hover={'bg-main'}
                  handleAction={() => handleDelete(dataRecord)}
                />

                <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
              </div>
            </div>
          )}
          {actionType === 'synthetics' && (
            <Spin spinning={isLoading} className="p-4">
              <div className="h-[186px]  items-center  ">
                <label className="text-blue-700 font-semibold uppercase pb-1">Kiểm tra dữ liệu</label>
                <div className="flex items-center  border p-3 gap-3">
                  <div className="text-bg-main">
                    <GoQuestion size={40}></GoQuestion>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <label>
                      Bạn đang tổng hợp nhanh <span className="font-bold">{formSynthetics.DanhSach.length}</span> dòng dữ liệu bán lẻ theo quầy :
                    </label>
                    <div>Chỉ những dòng dữ liệu không bị khóa và chưa được xử lý mới có thể tập hợp được </div>
                    <div>Bạn có chắc chắn không?</div>
                  </div>
                </div>
                <div className="flex justify-end mt-2 gap-2">
                  <ActionButton
                    color={'slate-50'}
                    title={'Xác nhận'}
                    isModal={true}
                    background={'bg-main'}
                    bg_hover={'white'}
                    color_hover={'bg-main'}
                    handleAction={() => handleSynthetics()}
                    // handleAction={() => close()}
                  />

                  <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
                </div>
              </div>
            </Spin>
          )}
        </div>
      </div>
    </>
  )
}

export default ModalTongHopPBL
