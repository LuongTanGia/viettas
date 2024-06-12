/* eslint-disable react/prop-types */
import { useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { formatPrice, formatQuantity } from '../../../action/Actions'
import logo from '../../../assets/VTS-iSale.ico'
import { Table, Tooltip, Spin } from 'antd'
import ModalOnlyPrintWareHouse from '../../ModalOnlyPrintWareHouse'
import ModalOnlyPrint from '../../ModalOnlyPrint'
import ActionButton from '../../../components/util/Button/ActionButton'

const ViewDuLieu = ({ actionType, typePage, namePage, data, dataThongTin, dataThongSo, controlDate, isLoadingModal, loading, close }) => {
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false)
  const [isShowModalOnlyPrintWareHouse, setIsShowModalOnlyPrintWareHouse] = useState(false)

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      hight: 10,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      editable: true,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => <div className="text-start">{text}</div>,
    },
    {
      title: 'Tên hàng',
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
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatQuantity(text, dataThongSo?.SOLESOLUONG)}
        </div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
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
      title: 'Tiền hàng',
      dataIndex: 'TienHang',
      key: 'TienHang',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TienHang - b.TienHang,
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
    {
      title: 'Tiền thuế',
      dataIndex: 'TienThue',
      key: 'TienThue',
      width: 150,
      align: 'center',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.TienThue - b.TienThue,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      width: 150,
      align: 'center',
      fixed: 'right',
      showSorterTooltip: false,
      render: (text) => (
        <div className={`flex justify-end w-full h-full   ${text < 0 ? 'text-red-600 text-base' : text === 0 ? 'text-gray-300' : ''} `}>
          {formatPrice(text, dataThongSo?.SOLESOTIEN)}
        </div>
      ),
      sorter: (a, b) => a.ThanhTien - b.ThanhTien,
    },
  ]

  return (
    <>
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px]">
          <div className="flex gap-2">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">thông tin - {namePage}</label>
          </div>
          <Spin spinning={isLoadingModal}>
            <div className="border-1 border-gray-400 w-full h-[90%] rounded-sm text-sm">
              <div className="flex  md:gap-0 lg:gap-1 pl-1">
                {/* thong tin phieu */}
                <div className="w-[62%]">
                  <div className="flex p-1  ">
                    <div className=" flex items-center ">
                      <label className="w-[110px]">Số C.từ</label>
                      <input disabled type="text" className="w-full border border-gray-300 outline-none  px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.SoChungTu} />
                    </div>
                    {/* DatePicker */}
                    <div className="flex md:px-1 lg:px-4 items-center">
                      <label className=" px-3  text-center ">Ngày</label>
                      <input
                        type="text"
                        disabled
                        value={dayjs(dataThongTin?.NgayCTu).format('DD/MM/YYYY')}
                        className="h-[24px] px-2 rounded-[4px] w-[132px] resize-none border-[1px] border-gray-300 outline-none text-center  "
                      />
                    </div>
                  </div>
                  <div className="p-1 flex justify-between items-center">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>
                    <input
                      disabled
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate"
                      value={`${dataThongTin?.MaDoiTuong}- ${dataThongTin?.TenDoiTuong}`}
                    />
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Tên</label>
                    <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.TenDoiTuong} />
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input disabled type="text" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.DiaChi} />
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
                            value={dataThongTin?.NguoiTao || ''}
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
                        <Tooltip title={dataThongTin?.NguoiSuaCuoi || ''} color="blue">
                          <input
                            disabled
                            type="text"
                            className="w-full  border border-gray-300 outline-none px-2 rounded-[4px] h-[24px]  truncate"
                            value={dataThongTin?.NguoiSuaCuoi || ''}
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
              {/* kho and ghi chu */}
              <div className="flex gap-3 pl-1 lg:pr-[6px] items-center  w-full">
                <div className="p-1 flex  items-center md:w-[35%] lg:w-[20%]">
                  <label form="khohang" className="md:w-[104px] lg:w-[110px] ">
                    Kho hàng
                  </label>
                  <select disabled className="  border w-full  bg-[#fafafa] rounded-[4px] h-[24px]">
                    <option key={dataThongTin?.MaKho} value="ThongTinKho">
                      {dataThongTin?.MaKho} - {dataThongTin?.TenKho}
                    </option>
                  </select>
                </div>
                <div className="flex items-center p-1 md:w-[65%] lg:w-[80%]">
                  <label className="w-[70px]">Ghi chú</label>
                  <input disabled type="are" className="w-full border border-gray-300 outline-none px-2 rounded-[4px] h-[24px] truncate" value={dataThongTin?.GhiChu || ''} />
                </div>
              </div>
              {/* table */}
              <div className="pt-4">
                <Table
                  loading={loading}
                  className="table_view"
                  dataSource={dataThongTin?.DataDetails}
                  columns={columns}
                  size="small"
                  scroll={{
                    x: 1000,
                    y: 220,
                  }}
                  pagination={false}
                  summary={(pageData) => {
                    let totalThanhTien = 0
                    let totalTienHang = 0
                    let totalSoLuong = 0
                    let totalDonGia = 0
                    let totalTienThue = 0
                    let totalTyLeThue = 0

                    pageData.forEach(({ ThanhTien, TienHang, SoLuong, DonGia, TienThue, TyLeThue }) => {
                      totalDonGia += DonGia
                      totalTienHang += TienHang
                      totalSoLuong += SoLuong
                      totalThanhTien += ThanhTien
                      totalTienThue += TienThue
                      totalTyLeThue += TyLeThue
                    })
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row className="text-end font-bold bg-[#f1f1f1]">
                          <Table.Summary.Cell index={0} className="text-center">
                            {dataThongTin?.DataDetails?.length}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={2}></Table.Summary.Cell>
                          <Table.Summary.Cell index={3}></Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>{formatQuantity(totalSoLuong, dataThongSo?.SOLESOLUONG)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={5}>{formatPrice(totalDonGia, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={6}>{formatPrice(totalTienHang, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={7}>{formatQuantity(totalTyLeThue, dataThongSo?.SOLETYLE)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={8}>{formatPrice(totalTienThue, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                          <Table.Summary.Cell index={9}>{formatPrice(totalThanhTien, dataThongSo?.SOLESOTIEN)}</Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }}
                ></Table>
              </div>
            </div>
          </Spin>
          {/* button */}
          <div className="flex justify-between items-center  pt-[10px]">
            <div className="flex gap-x-3   ">
              <ActionButton
                color={'slate-50'}
                title={'In phiếu'}
                isModal={true}
                background={'purple-500'}
                bg_hover={'white'}
                color_hover={'purple-500'}
                handleAction={() => setIsShowModalOnlyPrint(true)}
              />
              {dataThongSo?.ALLOW_INPHIEUKHO_DAUVAODAURA === true && (
                <ActionButton
                  color={'slate-50'}
                  title={'In phiếu kho'}
                  isModal={true}
                  background={'purple-500'}
                  bg_hover={'white'}
                  color_hover={'purple-500'}
                  handleAction={() => setIsShowModalOnlyPrintWareHouse(true)}
                />
              )}
            </div>
            <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
          </div>
        </div>
      </div>
      {isShowModalOnlyPrint && (
        <ModalOnlyPrint
          typePage={typePage}
          namePage={namePage}
          close={() => setIsShowModalOnlyPrint(false)}
          dataThongTin={dataThongTin}
          data={data}
          actionType={actionType}
          close2={() => close()}
        />
      )}
      {isShowModalOnlyPrintWareHouse && (
        <ModalOnlyPrintWareHouse
          typePage={typePage}
          namePage={namePage}
          close={() => setIsShowModalOnlyPrintWareHouse(false)}
          dataThongTin={dataThongTin}
          data={data}
          controlDate={controlDate}
          actionType={actionType}
          close2={() => close()}
        />
      )}
    </>
  )
}

export default ViewDuLieu
