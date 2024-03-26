/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { MdPrint } from 'react-icons/md'
const { Text } = Typography
import { Table, Tooltip, Typography } from 'antd'
import XSDPrint from './XSDPrint'
import categoryAPI from '../../../../../API/linkAPI'
import logo from '../../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../../action/Actions'
import ActionButton from '../../../../util/Button/ActionButton'
import SimpleBackdrop from '../../../../util/Loading/LoadingPage'

const XSDXem = ({ close, dataXSD }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataXSDView, setDataXSDView] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)

  useEffect(() => {
    const handleView = async () => {
      try {
        const response = await categoryAPI.XSDView(dataXSD?.SoChungTu, TokenAccess)
        if (response.data.DataError == 0) {
          setDataXSDView(response.data.DataResult)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          handleView()
        }
      } catch (error) {
        console.error(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      handleView()
    }
  }, [isLoading])

  const handlePrint = () => {
    setIsShowModal(true)
    setActionType('print')
  }
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
  const title = [
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
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Thông tin - Phiếu Xuất Kho Sử Dụng</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-1 py-2.5">
                  <div className="grid grid-cols-2 items-center gap-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap min-w-[100px] flex justify-end text-sm">Số chứng từ</label>
                          <input type="text" value={dataXSDView?.SoChungTu || ''} className="px-2 w-full resize-none rounded border outline-none text-[1rem] truncate" readOnly />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap text-sm">Ngày C.Từ</label>
                          <input
                            type="text"
                            value={moment(dataXSDView?.NgayCTu)?.format('DD/MM/YYYY') || ''}
                            className="px-2 w-[7rem] rounded resize-none border outline-none text-[1rem] text-center truncate"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="required whitespace-nowrap min-w-[100px] flex justify-end text-sm">Kho hàng</label>
                        <input
                          type="text"
                          value={`${dataXSDView?.MaKho} - ${dataXSDView?.TenKho}` || ''}
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
                          <Tooltip title={dataXSDView?.NguoiTao} color="blue">
                            <input
                              className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border outline-none text-[1rem] overflow-ellipsis truncate"
                              value={dataXSDView?.NguoiTao || ''}
                              readOnly
                            />
                          </Tooltip>
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <Tooltip title={moment(dataXSDView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''} color="blue">
                            <input
                              className="px-2 w-full resize-none rounded border outline-none text-[1rem] truncate"
                              value={moment(dataXSDView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                              readOnly
                            />
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người sửa</label>
                          <Tooltip title={dataXSDView?.NguoiSuaCuoi} color="blue">
                            <input
                              className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border  outline-none text-[1rem] overflow-ellipsis truncate"
                              value={dataXSDView?.NguoiSuaCuoi || ''}
                              readOnly
                            />
                          </Tooltip>
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <Tooltip title={dataXSDView?.NgaySuaCuoi ? moment(dataXSDView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''} color="blue">
                            <input
                              className="px-2 w-full resize-none rounded border outline-none text-[1rem] truncate"
                              value={dataXSDView?.NgaySuaCuoi ? moment(dataXSDView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                              readOnly
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap min-w-[100px] flex justify-end text-sm">Ghi chú</label>
                    <input type="text" value={dataXSDView?.GhiChu || ''} className="px-2 w-[70rem] rounded resize-none border outline-none text-[1rem]" readOnly />
                  </div>
                  <div className="border rounded">
                    <Table
                      className="table_view"
                      columns={title}
                      dataSource={dataXSDView?.DataDetails?.map((item, index) => ({ ...item, key: index }))}
                      size="small"
                      scroll={{
                        x: 1000,
                        y: 300,
                      }}
                      bordered
                      pagination={false}
                      summary={() => {
                        return (
                          <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                              {title
                                .filter((column) => column.render)
                                .map((column, index) => {
                                  const isNumericColumn = typeof dataXSDView?.DataDetails[0]?.[column.dataIndex] === 'number'

                                  return (
                                    <Table.Summary.Cell
                                      index={index}
                                      key={`summary-cell-${index + 1}`}
                                      align={isNumericColumn ? 'right' : 'left'}
                                      className="text-end font-bold  bg-[#f1f1f1]"
                                    >
                                      {isNumericColumn ? (
                                        column.dataIndex === 'SoLuong' ? (
                                          <Text strong>
                                            {Number(dataXSDView?.DataDetails?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                              minimumFractionDigits: dataThongSo?.SOLESOLUONG,
                                              maximumFractionDigits: dataThongSo?.SOLESOLUONG,
                                            })}
                                          </Text>
                                        ) : (
                                          <Text strong>
                                            {Number(dataXSDView?.DataDetails?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 0,
                                            })}
                                          </Text>
                                        )
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
                <div className="flex justify-between">
                  <ActionButton
                    icon={<MdPrint className="w-5 h-5" />}
                    handleAction={handlePrint}
                    title={'In Phiếu'}
                    color={'slate-50'}
                    background={'purple-500'}
                    color_hover={'purple-500'}
                    bg_hover={'white'}
                    isModal={true}
                  />
                  <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                </div>
              </div>
            </div>
          </div>
          <div>{isShowModal && actionType === 'print' ? <XSDPrint close={() => setIsShowModal(false)} dataPrint={dataXSDView} /> : ''}</div>
        </>
      )}
    </>
  )
}

export default XSDXem
