/* eslint-disable react/prop-types */

import logo from '../../../assets/VTS-iSale.ico'

import { Checkbox, Spin, Table, Tooltip, Typography } from 'antd'
import moment from 'moment'
import { formatPrice, formatQuantity } from '../../../action/Actions'

const { Text } = Typography

const ViewGBS = ({ namePage, data, dataThongTin, dataThongSo, isLoadingModal, loading, close }) => {
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
      fixed: 'left',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div className="text-start">{text}</div>,
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      render: (text) => (
        <div className="text-start truncate">
          <Tooltip title={text} color="blue">
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
    },

    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 150,
      align: 'center',
      showSorterTooltip: false,

      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.DonGia - b.DonGia,
    },
    {
      title: 'Đã có thuế',
      dataIndex: 'CoThue',
      key: 'CoThue',
      width: 110,
      align: 'center',
      showSorterTooltip: false,

      render: (text) => <Checkbox disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.CoThue ? 1 : 0
        const valueB = b.CoThue ? 1 : 0
        return valueA - valueB
      },
    },
    {
      title: '% Thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 150,
      align: 'center',
      showSorterTooltip: false,

      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatQuantity(text, dataThongSo?.SOLETYLE)}
        </div>
      ),
    },
  ]

  return (
    <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className=" w-[90vw] h-[600px]">
        <div className="flex gap-2">
          <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
          <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
        </div>
        <Spin spinning={isLoadingModal}>
          <div className="border-[1px] border-gray-700 w-full h-[90%] rounded-sm text-sm">
            <div className="flex  md:gap-0 lg:gap-1 pl-1">
              {/* thong tin phieu */}
              <div className="w-[62%]  pt-3">
                <div className="flex p-1 gap-2 ">
                  <label className=" w-[120px]  text-end required">Mã bảng giá</label>
                  <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.NhomGia} />
                </div>
                <div className="flex p-1 gap-2 ">
                  <label className=" w-[120px]  text-end required">Tên bảng giá</label>
                  <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.TenNhomGia} />
                </div>
                <div className="flex p-1 gap-2 ">
                  <label className=" w-[120px]  text-end">Ghi chú</label>
                  <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px]" value={dataThongTin?.GhiChu} />
                </div>
              </div>

              {/* thong tin cap nhat */}
              <div className="w-[38%] py-1 box_content">
                <div className="text-center p-1 font-medium text_capnhat">Thông tin cập nhật</div>
                <div className=" rounded-md w-[98%]  box_capnhat px-1 py-3">
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center px-1  ">
                      <label className="md:w-[134px] lg:w-[104px]">Người tạo</label>
                      <Tooltip title={dataThongTin?.NguoiTao} color="blue">
                        <input
                          disabled
                          type="text"
                          className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                          value={dataThongTin?.NguoiTao}
                          readOnly
                        />
                      </Tooltip>
                    </div>

                    <div className="flex items-center p-1">
                      <label className="w-[30px] pr-1">Lúc</label>
                      <Tooltip
                        title={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                        color="blue"
                      >
                        <input
                          disabled
                          type="text"
                          className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate "
                          value={dataThongTin?.NgayTao && moment(dataThongTin.NgayTao).isValid() ? moment(dataThongTin.NgayTao).format('DD/MM/YYYY hh:mm:ss') : ''}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center p-1  ">
                      <label className="md:w-[134px] lg:w-[104px]">Sửa cuối</label>
                      <Tooltip title={dataThongTin?.NguoiSuaCuoi} color="blue">
                        <input
                          disabled
                          type="text"
                          className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]  truncate"
                          value={dataThongTin?.NguoiSuaCuoi}
                        />
                      </Tooltip>
                    </div>
                    <div className="flex items-center p-1 ">
                      <label className="w-[30px] pr-1">Lúc</label>
                      <Tooltip
                        title={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                        color="blue"
                      >
                        <input
                          disabled
                          type="text"
                          className="w-full text-center border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                          value={dataThongTin?.NgaySuaCuoi && moment(dataThongTin.NgaySuaCuoi).isValid() ? moment(dataThongTin.NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') : ''}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* table */}
            <div className="">
              <Table
                loading={loading}
                className="table_view_GBS "
                dataSource={dataThongTin?.NhomGia_CTs}
                columns={columns}
                size="small"
                scroll={{
                  x: 1000,
                  y: 340,
                }}
                pagination={false}
                // Bảng Tổng
                summary={
                  dataThongTin?.NhomGia_CTs === undefined
                    ? null
                    : () => {
                        return (
                          <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0} key="summary-cell-0" className="text-center font-semibold  bg-[#f1f1f1]">
                                {dataThongTin?.NhomGia_CTs?.length}
                              </Table.Summary.Cell>
                              {columns
                                .filter((column) => column.render)
                                .map((column, index) => {
                                  const isNumericColumn = typeof dataThongTin?.NhomGia_CTs[0]?.[column.dataIndex] === 'number'
                                  return (
                                    <Table.Summary.Cell
                                      index={index + 1}
                                      key={`summary-cell-${index}`}
                                      align={isNumericColumn ? 'right' : 'left'}
                                      className="text-end font-bold  bg-[#f1f1f1]"
                                    >
                                      {column.dataIndex === 'DonGia' ? (
                                        <Text strong>
                                          {Number(dataThongTin?.NhomGia_CTs.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'TyLeThue' ? (
                                        <Text strong>
                                          {Number(dataThongTin?.NhomGia_CTs.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLETYLE,
                                            maximumFractionDigits: dataThongSo?.SOLETYLE,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'CoThue' ? (
                                        <Text className="text-center flex justify-center" strong>
                                          {Object.values(data).filter((value) => value.CoThue).length}
                                        </Text>
                                      ) : null}
                                    </Table.Summary.Cell>
                                  )
                                })}
                            </Table.Summary.Row>
                          </Table.Summary>
                        )
                      }
                }
              ></Table>
            </div>
          </div>
        </Spin>
        {/* button */}
        <div className="flex justify-end items-center  pt-3">
          <button
            onClick={() => close()}
            className="active:scale-[.98] active:duration-75 border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500  rounded-md px-2 py-1 w-[80px] "
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewGBS
