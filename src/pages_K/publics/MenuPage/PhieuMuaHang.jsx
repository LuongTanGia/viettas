import { useEffect, useState } from "react";
import { Form, DatePicker, Space, Table, Checkbox, Typography } from "antd";
const { Text } = Typography;
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
const { RangePicker } = DatePicker;
import icons from "../../../untils/icons";
import { toast } from "react-toastify";
import * as apis from "../../../apis";
import { NumericFormat } from "react-number-format";
import { Modals } from "../../../components_K";
import dayjs from "dayjs";
import { keyDown, roundNumber } from "../../../action/Actions";
import SimpleBackdrop from "../../../components/util/Loading/LoadingPage";

const {
  IoAddCircleOutline,
  TiPrinter,
  FaRegEdit,
  MdDelete,
  FaRegEye,
  FaMoneyCheckAlt,
} = icons;
const PhieuMuaHang = () => {
  const [form] = Form.useForm();
  const [isValidDate, setIsValidDate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopup, setIsLoadingPopup] = useState(false);

  const [data, setData] = useState(null);
  const [dataThongTin, setDataThongTin] = useState([]);
  const [dataRecord, setDataRecord] = useState(null);

  const [dataKhoHang, setDataKhoHang] = useState(null);
  const [dataDoiTuong, setDataDoiTuong] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [tableLoad, setTableLoad] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [actionType, setActionType] = useState("");
  const [formKhoanNgay, setFormKhoanNgay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenLogin = localStorage.getItem("TKN");

        const responseKH = await apis.ListHelperKhoHang(tokenLogin);
        if (responseKH.data && responseKH.data.DataError === 0) {
          setDataKhoHang(responseKH.data.DataResults);
          if (actionType === "create") {
            const responseDT = await apis.ListHelperDoiTuong(tokenLogin);
            if (responseDT.data && responseDT.data.DataError === 0) {
              setDataDoiTuong(responseDT.data.DataResults);
            }
          } else if (actionType === "view" || actionType === "edit") {
            const responseTT = await apis.ThongTinPMH(
              tokenLogin,
              dataRecord.SoChungTu
            );
            if (responseTT.data && responseTT.data.DataError === 0) {
              setDataThongTin(responseTT.data.DataResult);
              setIsLoadingPopup(true);
            }
            if (actionType === "edit") {
              const responseDT = await apis.ListHelperDoiTuong(tokenLogin);
              if (responseDT.data && responseDT.data.DataError === 0) {
                setDataDoiTuong(responseDT.data.DataResults);
              }
            }
          }
        }
      } catch (error) {
        console.error("Lấy data thất bại", error);
        toast.error("Lấy data thất bại. Vui lòng thử lại sau.");
        setIsLoadingPopup(true);
      }
    };

    if (dataRecord && isShowModal) {
      fetchData();
    }
  }, [dataRecord, isShowModal]);

  useEffect(() => {
    getKhoanNgay();
    getDSPMH();
  }, []);

  const getKhoanNgay = async () => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const response = await apis.KhoanNgay(tokenLogin);

      if (response.data && response.data.DataError === 0) {
        setFormKhoanNgay(response.data);
        setIsLoading(true);
      }
    } catch (error) {
      console.error("Kiểm tra token thất bại", error);
      setIsLoading(true);
    }
  };

  const getDSPMH = async () => {
    try {
      const tokenLogin = localStorage.getItem("TKN");

      const response = await apis.DanhSachPMH(tokenLogin, formKhoanNgay);

      if (response.data && response.data.DataError === 0) {
        setData(response.data.DataResults);
        setTableLoad(true);
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription);
        setData(response.data.DataResults);
        setTableLoad(true);
      }
    } catch (error) {
      console.error("Kiểm tra token thất bại", error);
      setTableLoad(true);
    }
  };

  const validateDate = (_, value) => {
    const isValid = moment(value, "DD/MM/YYYY", true).isValid();
    setIsValidDate(isValid);

    return isValid
      ? Promise.resolve()
      : Promise.reject("Ngày tháng không hợp lệ");
  };

  const handleCalendarChange = (_, dateString) => {
    form.setFieldsValue({ dateRange: dateString });
    const isValid =
      moment(dateString[0], "DD/MM/YYYY", true).isValid() &&
      moment(dateString[1], "DD/MM/YYYY", true).isValid();

    setIsValidDate(isValid);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: 60,
      hight: 10,
      fixed: "left",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Số Chứng Từ",
      dataIndex: "SoChungTu",
      key: "SoChungTu",
      width: 150,
      fixed: "left",
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
    },
    {
      title: "Ngày Chứng Từ",
      dataIndex: "NgayCTu",
      key: "NgayCTu",
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      width: 150,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu);
        const dateB = new Date(b.NgayCTu);
        return dateA - dateB;
      },
    },
    {
      title: "Mã Đối Tượng",
      dataIndex: "MaDoiTuong",
      key: "MaDoiTuong",
      width: 150,
    },
    {
      title: "Tên đối tượng",
      dataIndex: "TenDoiTuong",
      key: "TenDoiTuong",
      width: 300,
    },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
      key: "DiaChi",
      width: 300,
    },
    {
      title: "Mã số thuế",
      dataIndex: "MaSoThue",
      key: "MaSoThue",
      width: 150,
    },
    {
      title: "Mã kho",
      dataIndex: "MaKho",
      key: "MaKho",
      width: 150,
    },
    {
      title: "Thông tin kho",
      dataIndex: "ThongTinKho",
      key: "ThongTinKho",
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: "GhiChu",
      key: "GhiChu",
      width: 150,
    },
    {
      title: "Tổng mặt hàng",
      dataIndex: "TongMatHang",
      key: "TongMatHang",
      width: 150,
      align: "end",
      sorter: (a, b) => a.TongMatHang - b.TongMatHang,
    },
    {
      title: "Tổng số lượng",
      dataIndex: "TongSoLuong",
      key: "TongSoLuong",
      width: 150,
      align: "end",
      render: (text) => roundNumber(text),
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "TongTienHang",
      key: "TongTienHang",
      width: 150,
      align: "end",
      render: (text) => (
        <NumericFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
    },
    {
      title: "Tổng tiền thuế",
      dataIndex: "TongTienThue",
      key: "TongTienThue",
      width: 150,
      align: "end",
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
    },
    {
      title: "Tổng thành tiền",
      dataIndex: "TongThanhTien",
      key: "TongThanhTien",
      width: 150,
      align: "end",
      render: (text) => (
        <NumericFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
      sorter: (a, b) => a.TongThanhTien - b.TongThanhTien,
    },

    {
      title: "Phiếu chi",
      dataIndex: "PhieuChi",
      key: "PhieuChi",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "NgayTao",
      key: "NgayTao",
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY hh:mm:ss"),
      width: 300,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao);
        const dateB = new Date(b.NgayTao);
        return dateA - dateB;
      },
    },
    {
      title: "Người tạo",
      dataIndex: "NguoiTao",
      key: "NguoiTao",
      width: 300,
    },
    {
      title: "Ngày sửa cuối",
      dataIndex: "NgaySuaCuoi",
      key: "NgaySuaCuoi",
      align: "center",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY hh:mm:ss") : null,
      width: 300,
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi);
        const dateB = new Date(b.NgaySuaCuoi);
        return dateA - dateB;
      },
    },
    {
      title: "Người sửa cuối",
      dataIndex: "NguoiSuaCuoi",
      key: "NguoiSuaCuoi",
      width: 300,
    },

    {
      title: "Tiền mặt",
      key: "TTTienMat",
      dataIndex: "TTTienMat",
      fixed: "right",
      width: 100,
      align: "center",
      render: (text) => <Checkbox disabled={!text} defaultChecked={text} />,
      sorter: (a, b) => {
        const valueA = a.TTTienMat ? 1 : 0;
        const valueB = b.TTTienMat ? 1 : 0;
        return valueA - valueB;
      },
    },
    {
      title: "Chức năng",
      key: "operation",
      fixed: "right",
      width: 120,
      align: "center",
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
                onClick={() => handleEdit(record)}
                title="Sửa"
                className="p-[3px]  border  border-purple-500 rounded-md text-slate-50 bg-purple-500  hover:bg-white hover:text-purple-500  cursor-pointer "
              >
                <FaRegEdit size={16} />
              </div>

              {/* <div
                onClick={() => handleMakeBallot(record)}
                title="In phiếu"
                className="p-[3px] text-blue-500 border  border-blue-500 rounded-md hover:text-white hover:bg-blue-500  "
              >
                <FaMoneyCheckAlt size={16} />
              </div> */}
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
        );
      },
    },
  ];

  const handleDelete = (record) => {
    setActionType("delete");
    setDataRecord(record);
    setIsShowModal(true);
  };

  const handleView = (record) => {
    setActionType("view");

    setDataRecord(record);
    setIsShowModal(true);
  };

  const handleEdit = (record) => {
    if (record.TTTienMat === true) {
      toast.error("Phiếu mua hàng đã được lập phiếu chi! Không thể sửa.");
    } else {
      setActionType("edit");
      setDataRecord(record);
      setDataThongTin(record);
      setIsShowModal(true);
    }
  };

  const handleCreate = (record) => {
    setActionType("create");
    setDataRecord(record);
    setIsShowModal(true);
  };
  const handlePrint = (record) => {
    setActionType("print");
    setDataRecord(record);
    setIsShowModal(true);
  };
  const handlePrintWareHouse = (record) => {
    setActionType("printWareHouse");
    setDataRecord(record);
    setIsShowModal(true);
  };
  const handleFilterDS = () => {
    getDSPMH();
    setTableLoad(false);
  };
  const handleMakeBallot = (record) => {
    setActionType("makeballot");
    setDataRecord(record);
    setIsShowModal(true);
  };

  if (!isLoading) {
    return <SimpleBackdrop />;
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleRowClick = (record) => {
    const isSelected = selectedRowKeys.includes(record.key);
    const newSelectedRowKeys = isSelected
      ? selectedRowKeys.filter((key) => key !== record.key)
      : [...selectedRowKeys, record.key];
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <div className="w-auto">
      <div className="text-lg font-bold mx-4 my-2 "> Phiếu mua hàng</div>
      <div className="flex justify-between items-center px-4">
        {/* date rang */}
        <div className="flex ">
          <div className="">
            <Form form={form}>
              <Form.Item
                name="dateRange"
                label="Ngày Tháng"
                rules={[
                  {
                    validator: validateDate,
                  },
                ]}
              >
                <Space>
                  <RangePicker
                    format="DD/MM/YYYY"
                    // picker="date"
                    onKeyDown={keyDown}
                    onCalendarChange={handleCalendarChange}
                    defaultValue={[
                      dayjs(formKhoanNgay.NgayBatDau, "YYYY-MM-DD"),
                      dayjs(formKhoanNgay.NgayKetThuc, "YYYY-MM-DD"),
                    ]}
                    onChange={(values) => {
                      setFormKhoanNgay({
                        ...formKhoanNgay,
                        NgayBatDau: dayjs(values[0]).format(
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                        NgayKetThuc: dayjs(values[1]).format(
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                      });
                    }}
                  />
                  {isValidDate ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                </Space>
              </Form.Item>
            </Form>
          </div>
          <div className=" px-4 py-1">
            <button
              onClick={handleFilterDS}
              className="flex items-center   py-1 px-2 bg-bg-main rounded-md  text-white text-sm hover:opacity-80"
            >
              Lọc
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreate}
            className="flex items-center   py-1 px-2 bg-bg-main rounded-md  text-white text-sm hover:opacity-80"
          >
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
              onClick: () => {
                handleRowClick(record);
                const selected = selectedRowKeys.includes(record.SoChungTu);
                if (selected) {
                  setSelectedRowKeys(
                    selectedRowKeys.filter((key) => key !== record.SoChungTu)
                  );
                } else {
                  setSelectedRowKeys([...selectedRowKeys, record.SoChungTu]);
                }
              },
              onDoubleClick: () => {
                handleView(record);
              },
            })}
            // Bảng Tổng
            summary={(pageData) => {
              let totalTongThanhTien = 0;
              let totalTongTienThue = 0;
              let totalTongTienHang = 0;
              let totalTongSoLuong = 0;
              let totalTongMatHang = 0;

              pageData.forEach(
                ({
                  TongThanhTien,
                  TongTienThue,
                  TongTienHang,
                  TongSoLuong,
                  TongMatHang,
                }) => {
                  totalTongThanhTien += TongThanhTien;
                  totalTongTienThue += TongTienThue;
                  totalTongTienHang += TongTienHang;
                  totalTongSoLuong += TongSoLuong;
                  totalTongMatHang += TongMatHang;
                }
              );
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
                    <Table.Summary.Cell index={10}>
                      {totalTongMatHang}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={11}>
                      {roundNumber(totalTongSoLuong)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={12}>
                      <NumericFormat
                        value={totalTongTienHang}
                        displayType={"text"}
                        thousandSeparator={true}
                        // suffix={" ₫"}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={13}>
                      {totalTongTienThue}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={14}>
                      <NumericFormat
                        value={totalTongThanhTien}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={15}></Table.Summary.Cell>
                    <Table.Summary.Cell index={16}></Table.Summary.Cell>
                    <Table.Summary.Cell index={17}></Table.Summary.Cell>
                    <Table.Summary.Cell index={18}></Table.Summary.Cell>
                    <Table.Summary.Cell index={19} className="text-center ">
                      {data
                        ? data.reduce(
                            (count, item) => count + (item.TTTienMat ? 1 : 0),
                            0
                          )
                        : null}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={20}></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          ></Table>
        ) : (
          <SimpleBackdrop />
        )}
      </div>

      {isShowModal && (
        <Modals
          close={() => {
            setIsShowModal(false), setIsLoadingPopup(!isLoadingPopup);
          }}
          actionType={actionType}
          dataRecord={dataRecord}
          dataThongTin={dataThongTin}
          dataKhoHang={dataKhoHang}
          dataDoiTuong={dataDoiTuong}
          dataPMH={data}
          controlDate={formKhoanNgay}
          isLoadingModel={isLoadingPopup}
        />
      )}
    </div>
  );
};

export default PhieuMuaHang;
