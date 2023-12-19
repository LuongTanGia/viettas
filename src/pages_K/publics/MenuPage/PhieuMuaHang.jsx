import { useEffect, useState } from 'react'
import { Table, Checkbox, Typography } from 'antd'
const { Text } = Typography

import moment from 'moment'

import icons from '../../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../../apis'
import { NumericFormat } from 'react-number-format'
import { Modals } from '../../../components_K'
import dayjs from 'dayjs'
import { RETOKEN, formatPrice, formatQuantity, roundNumber } from '../../../action/Actions'
import SimpleBackdrop from '../../../components/util/Loading/LoadingPage'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const { IoAddCircleOutline, TiPrinter, FaRegEdit, MdDelete, GiPayMoney, BsSearch } = icons
const PhieuMuaHang = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPopup, setIsLoadingPopup] = useState(false)

  const [data, setData] = useState(null)
  const [dataThongTin, setDataThongTin] = useState([])
  const [dataRecord, setDataRecord] = useState(null)

  const [dataKhoHang, setDataKhoHang] = useState(null)
  const [dataDoiTuong, setDataDoiTuong] = useState(null)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)

  const [tableLoad, setTableLoad] = useState(false)

  const [actionType, setActionType] = useState('')
  const [formKhoanNgay, setFormKhoanNgay] = useState([])
  const [dataThongSo, setDataThongSo] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')

        const responseKH = await apis.ListHelperKhoHang(tokenLogin)
        if (responseKH.data && responseKH.data.DataError === 0) {
          setDataKhoHang(responseKH.data.DataResults)
          if (actionType === 'create') {
            const responseDT = await apis.ListHelperDoiTuong(tokenLogin)
            if (responseDT.data && responseDT.data.DataError === 0) {
              setDataDoiTuong(responseDT.data.DataResults)
            }
          } else if (actionType === 'view' || actionType === 'edit') {
            const responseTT = await apis.ThongTinPMH(tokenLogin, dataRecord.SoChungTu)
            if (responseTT.data && responseTT.data.DataError === 0) {
              setDataThongTin(responseTT.data.DataResult)
              setIsLoadingPopup(true)
            }
            if (actionType === 'edit') {
              const responseDT = await apis.ListHelperDoiTuong(tokenLogin)
              if (responseDT.data && responseDT.data.DataError === 0) {
                setDataDoiTuong(responseDT.data.DataResults)
              }
            }
          }
        }
      } catch (error) {
        console.error('Lấy data thất bại', error)
        toast.error('Lấy data thất bại. Vui lòng thử lại sau.')
        setIsLoadingPopup(true)
      }
    }

    if (dataRecord && isShowModal) {
      fetchData()
    }
  }, [dataRecord, isShowModal])

  useEffect(() => {
    getKhoanNgay()
    getThongSo()
    getDSPMH()
  }, [])

  const getKhoanNgay = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.KhoanNgay(tokenLogin)

      if (response.data && response.data.DataError === 0) {
        setFormKhoanNgay(response.data)
        setIsLoading(true)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getKhoanNgay()
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setIsLoading(true)
    }
  }

  const getThongSo = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.ThongSo(tokenLogin)

      if (response.data && response.data.DataError === 0) {
        setDataThongSo(response.data.DataResult)
        setIsLoading(true)
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(response.data.DataErrorDescription)
      } else {
        await RETOKEN()
        getThongSo()
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setIsLoading(true)
    }
  }

  const getDSPMH = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachPMH(tokenLogin, formKhoanNgay)

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults)
        setTableLoad(true)
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription)
        setData(response.data.DataResults)
        setTableLoad(true)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSPMH()
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(true)
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
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Số Chứng Từ',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
    },
    {
      title: 'Ngày Chứng Từ',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      width: 150,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
    },
    {
      title: 'Mã Đối Tượng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 150,
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 300,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChi',
      key: 'DiaChi',
      width: 300,
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'MaSoThue',
      key: 'MaSoThue',
      width: 150,
    },
    {
      title: 'Mã kho',
      dataIndex: 'MaKho',
      key: 'MaKho',
      width: 150,
    },
    {
      title: 'Thông tin kho',
      dataIndex: 'ThongTinKho',
      key: 'ThongTinKho',
      width: 150,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      width: 150,
    },
    {
      title: 'Tổng mặt hàng',
      dataIndex: 'TongMatHang',
      key: 'TongMatHang',
      width: 150,
      align: 'end',
      sorter: (a, b) => a.TongMatHang - b.TongMatHang,
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      width: 150,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatQuantity(text, dataThongSo?.SOLESOLUONG)}
        </div>
      ),
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      width: 150,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
    },
    {
      title: 'Tổng tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      width: 150,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
    },
    {
      title: 'Tổng thành tiền',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      width: 150,
      align: 'end',
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TongThanhTien - b.TongThanhTien,
    },

    {
      title: 'Phiếu chi',
      dataIndex: 'PhieuChi',
      key: 'PhieuChi',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm:ss'),
      width: 300,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'NguoiTao',
      key: 'NguoiTao',
      width: 300,
    },
    {
      title: 'Ngày sửa cuối',
      dataIndex: 'NgaySuaCuoi',
      key: 'NgaySuaCuoi',
      align: 'center',
      render: (text) => (text ? moment(text).format('DD/MM/YYYY hh:mm:ss') : null),
      width: 300,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi)
        const dateB = new Date(b.NgaySuaCuoi)
        return dateA - dateB
      },
    },
    {
      title: 'Người sửa cuối',
      dataIndex: 'NguoiSuaCuoi',
      key: 'NguoiSuaCuoi',
      width: 300,
    },

    {
      title: 'Tiền mặt',
      key: 'TTTienMat',
      dataIndex: 'TTTienMat',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (text) => <Checkbox value={text} disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.TTTienMat ? 1 : 0
        const valueB = b.TTTienMat ? 1 : 0
        return valueA - valueB
      },
    },
    {
      title: 'Chức năng',
      key: 'operation',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (record) => {
        return (
          <>
            <div className=" flex gap-1 items-center justify-center ">
              {/* <div
                onClick={() => handleView(record)}
                title="Xem"
                className="p-[3px] border border-yellow-500 rounded-md  text-slate-50  bg-yellow-500 hover:bg-white hover:text-yellow-500   cursor-pointer"
              >
                <FaRegEye size={16} />
              </div> */}
              <div
                disabled="true"
                onClick={() => handlePay(record)}
                title="Lập phiếu chi"
                className={`p-[3px] border rounded-md text-slate-50 ${
                  record.TTTienMat ? 'bg-gray-400 cursor-not-allowed' : 'border-blue-500 bg-blue-500 hover:bg-white hover:text-blue-500 cursor-pointer'
                }`}
              >
                <GiPayMoney size={16} />
              </div>
              <div
                onClick={() => handleEdit(record)}
                title="Sửa"
                className="p-[3px] border rounded-md text-slate-50 border-purple-500 bg-purple-500 hover:bg-white hover:text-purple-500 cursor-pointer"
              >
                <FaRegEdit size={16} />
              </div>

              {/* <div
                onClick={() => handleEdit(record)}
                title="Sửa"
                className="p-[3px]  border  border-red-500 rounded-md text-slate-50 bg-blue-500  hover:bg-white hover:text-blue-500  cursor-pointer  "
              >
                <TiPrinter size={16} />
              </div> */}
              <div
                onClick={() => handleDelete(record)}
                title="Xóa"
                className="p-[3px]  border  border-red-500 rounded-md text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
              >
                <MdDelete size={16} />
              </div>
            </div>
          </>
        )
      },
    },
  ]

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
    if (record.TTTienMat === true) {
      toast.error('Phiếu mua hàng đã được lập phiếu chi! Không thể sửa.', {
        autoClose: 1500,
      })
    } else {
      setActionType('edit')
      setDataRecord(record)
      setDataThongTin(record)
      setIsShowModal(true)
    }
  }

  const handleCreate = (record) => {
    setActionType('create')
    setDataRecord(record)
    setIsShowModal(true)
  }
  const handlePrint = (record) => {
    setActionType('print')
    setDataRecord(record)
    setIsShowModal(true)
  }
  const handlePrintWareHouse = (record) => {
    setActionType('printWareHouse')
    setDataRecord(record)
    setIsShowModal(true)
  }
  const handleFilterDS = () => {
    getDSPMH()
    setTableLoad(false)
  }
  const handlePay = (record) => {
    if (record.TTTienMat) return
    setActionType('pay')
    setDataRecord(record)
    setIsShowModal(true)
  }

  if (!isLoading) {
    return <SimpleBackdrop />
  }

  //   selectedRowKeys,
  //   onChange: (selectedKeys) => {
  //     setSelectedRowKeys(selectedKeys);
  //   },
  // };

  // const handleRowClick = (record) => {
  //   const isSelected = selectedRowKeys.includes(record.key);
  //   const newSelectedRowKeys = isSelected
  //     ? selectedRowKeys.filter((key) => key !== record.key)
  //     : [...selectedRowKeys, record.key];
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };
  return (
    <div className="w-auto">
      <div className="text-lg  mx-4 my-2 ">
        <div className="flex items-center gap-x-4 font-bold">
          <label>Phiếu mua hàng </label>
          <div>
            <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
          </div>
        </div>
        <div className="flex relative ">
          {isShowSearch && (
            <div className={`flex absolute left-[11rem] -top-8 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
              <input
                type="text"
                placeholder="Nhập ký tự bạn cần tìm"
                // onChange={handleSearch}
                className={'px-2 py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center px-4 mb-2">
        <div className="flex gap-3">
          {/* DatePicker */}
          <div className="flex gap-x-2 items-center">
            <label htmlFor="">Ngày</label>
            <DatePicker
              className="DatePicker_PMH"
              format="DD/MM/YYYY"
              defaultValue={dayjs(formKhoanNgay.NgayBatDau, 'YYYY-MM-DD')}
              onChange={(newDate) => {
                setFormKhoanNgay({
                  ...formKhoanNgay,
                  NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                })
              }}
            />
          </div>
          <div className="flex gap-x-2 items-center">
            <label htmlFor="">Đến</label>
            <DatePicker
              className="DatePicker_PMH"
              format="DD/MM/YYYY"
              defaultValue={dayjs(formKhoanNgay.NgayKetThuc, 'YYYY-MM-DD')}
              onChange={(newDate) => {
                setFormKhoanNgay({
                  ...formKhoanNgay,
                  NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                })
              }}
            />
          </div>
          <div className=" ">
            <button onClick={handleFilterDS} className="flex items-center py-1 px-2 bg-bg-main rounded-md  text-white text-sm hover:opacity-80">
              Lọc
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCreate} className="flex items-center   py-1 px-2 bg-bg-main rounded-md  text-white text-sm hover:opacity-80">
            <div className="pr-1">
              <IoAddCircleOutline size={20} />
            </div>
            <div>Thêm phiếu</div>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center  py-1 px-2  rounded-md border-dashed border border-gray-500  text-sm hover:text-sky-500  hover:border-sky-500 "
          >
            <div className="pr-1">
              <TiPrinter size={20} />
            </div>
            <div>In phiếu</div>
          </button>
          <button
            onClick={handlePrintWareHouse}
            className="flex items-center  py-1 px-2  rounded-md border-dashed border border-gray-500  text-sm hover:text-sky-500  hover:border-sky-500 "
          >
            <div className="pr-1">
              <TiPrinter size={20} />
            </div>
            <div>In phiếu Kho</div>
          </button>
        </div>
      </div>
      <div className="relative px-2 py-1 ">
        {tableLoad ? (
          <Table
            className="table_pmh"
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            size="small"
            scroll={{
              x: 1500,
              y: 410,
            }}
            bordered
            pagination={false}
            rowKey={(record) => record.SoChungTu}
            onRow={(record) => ({
              // onClick: () => {
              //   handleRowClick(record);
              //   const selected = selectedRowKeys.includes(record.SoChungTu);
              //   if (selected) {
              //     setSelectedRowKeys(
              //       selectedRowKeys.filter((key) => key !== record.SoChungTu)
              //     );
              //   } else {
              //     setSelectedRowKeys([...selectedRowKeys, record.SoChungTu]);
              //   }
              // },
              onDoubleClick: () => {
                handleView(record)
              },
            })}
            // Bảng Tổng
            summary={(pageData) => {
              let totalTongThanhTien = 0
              let totalTongTienThue = 0
              let totalTongTienHang = 0
              let totalTongSoLuong = 0
              let totalTongMatHang = 0

              pageData.forEach(({ TongThanhTien, TongTienThue, TongTienHang, TongSoLuong, TongMatHang }) => {
                totalTongThanhTien += TongThanhTien
                totalTongTienThue += TongTienThue
                totalTongTienHang += TongTienHang
                totalTongSoLuong += TongSoLuong
                totalTongMatHang += TongMatHang
              })
              return (
                <Table.Summary fixed="bottom">
                  <Table.Summary.Row className="text-end font-bold">
                    <Table.Summary.Cell index={0} className="text-center ">
                      {pageData.length}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    <Table.Summary.Cell index={8}></Table.Summary.Cell>
                    <Table.Summary.Cell index={9}></Table.Summary.Cell>
                    <Table.Summary.Cell index={10}>{totalTongMatHang}</Table.Summary.Cell>
                    <Table.Summary.Cell index={11}>{formatQuantity(totalTongSoLuong, dataThongSo?.SOLESOLUONG)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={12}>{formatPrice(totalTongTienHang, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={13}> {formatPrice(totalTongTienThue, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={14}>{formatPrice(totalTongThanhTien, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={15}></Table.Summary.Cell>
                    <Table.Summary.Cell index={16}></Table.Summary.Cell>
                    <Table.Summary.Cell index={17}></Table.Summary.Cell>
                    <Table.Summary.Cell index={18}></Table.Summary.Cell>
                    <Table.Summary.Cell index={19}></Table.Summary.Cell>
                    <Table.Summary.Cell index={20} className="text-center ">
                      {data ? data.reduce((count, item) => count + (item.TTTienMat ? 1 : 0), 0) : null}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          ></Table>
        ) : (
          <SimpleBackdrop />
        )}
      </div>

      {isShowModal && (
        <Modals
          close={() => {
            setIsShowModal(false), setIsLoadingPopup(!isLoadingPopup)
          }}
          actionType={actionType}
          dataRecord={dataRecord}
          dataThongTin={dataThongTin}
          dataKhoHang={dataKhoHang}
          dataDoiTuong={dataDoiTuong}
          dataPMH={data}
          controlDate={formKhoanNgay}
          isLoadingModel={isLoadingPopup}
          dataThongSo={dataThongSo}
        />
      )}
    </div>
  )
}

export default PhieuMuaHang
