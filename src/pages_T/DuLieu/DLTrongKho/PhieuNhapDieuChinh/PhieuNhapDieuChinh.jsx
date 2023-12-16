import { Form, DatePicker, Space, Table, Tooltip } from "antd";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IoMdAddCircleOutline, IoMdCloseCircle } from "react-icons/io";
import categoryAPI from "../../../../API/linkAPI";
import { useSearch } from "../../../../hooks_T/Search";
import { MdEdit, MdDelete, MdPrint, MdCheckCircle } from "react-icons/md";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import NDCXem from "../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCXem";
import NDCXoa from "../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNDC/NDCXoa";

const PhieuNhapDieuChinh = () => {
  const TokenAccess = localStorage.getItem("TKN");
  const [dataNDC, setDataNDC] = useState("");
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataNDC);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isDataKhoDC, setIsDataKhoDC] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);
  const [khoanNgayFrom, setKhoanNgayFrom] = useState("");
  const [khoanNgayTo, setKhoanNgayTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const handleKeyDown = (e) => {
    const validKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "/",
      "Backspace",
    ];
    if (!validKeys.includes(e.key)) {
      e.preventDefault();
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
  function formatDateTime(inputDate, includeTime = false) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    let formattedDateTime = `${day}/${month}/${year}`;
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      formattedDateTime += ` ${hours}:${minutes}:${seconds} `;
    }
    return formattedDateTime;
  }
  const roundNumber = (number) => {
    const roundedNumber = Math.round(number * 10) / 10;
    return roundedNumber.toFixed(1);
  };
  const getDataNDCFirst = async () => {
    try {
      if (isLoading == true) {
        const response = await categoryAPI.GetDataNDC({}, TokenAccess);
        if (response.data.DataError == 0) {
          setDataNDC(response.data.DataResults);
          setIsLoading(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataNDCFirst();
    getTimeSetting();
  }, [getDataNDCFirst, isLoading]);

  const getDataNDC = async (e) => {
    e.preventDefault();
    try {
      console.log(khoanNgayFrom, khoanNgayTo);
      const response = await categoryAPI.GetDataNDC(
        {
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayTo,
        },
        TokenAccess
      );
      if (response.data.DataError == 0) {
        console.log(response.data);
        toast.success(response.data.DataErrorDescription);
        setDataNDC(response.data.DataResults);
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTimeSetting = async () => {
    try {
      const response = await categoryAPI.KhoanNgay(TokenAccess);
      if (response.data.DataError == 0) {
        setKhoanNgayFrom(response.data.NgayBatDau);
        setKhoanNgayTo(response.data.NgayKetThuc);
        setIsLoading(true);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value);
  };
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN");
  };
  const handleView = (record) => {
    setIsShowModal(true);
    setIsDataKhoDC(record);
    setActionType("view");
  };
  const handleDelete = (record) => {
    setIsShowModal(true);
    setIsDataKhoDC(record);
    setActionType("delete");
  };
  const titles = [
    {
      title: "STT",
      render: (text, record, index) => index + 1,
      with: 10,
      width: 50,
      align: "center",
      fixed: "left",
    },
    {
      title: "Số chứng từ",
      dataIndex: "SoChungTu",
      key: "SoChungTu",
      width: 150,
      align: "center",
      fixed: "left",
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      render: (text) => <span className="flex ">{text}</span>,
    },
    {
      title: "Ngày chứng từ",
      dataIndex: "NgayCTu",
      key: "NgayCTu",
      width: 120,
      align: "center",
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu);
        const dateB = new Date(b.NgayCTu);
        return dateA - dateB;
      },
      render: (text) => (
        <span className="flex justify-center">{formatDateTime(text)}</span>
      ),
    },
    {
      title: "Thông tin kho",
      dataIndex: "ThongTinKho",
      key: "ThongTinKho",
      width: 180,
      align: "center",
      sorter: (a, b) => a.ThongTinKho.localeCompare(b.ThongTinKho),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              textAlign: "start",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Số mặt hàng",
      dataIndex: "SoMatHang",
      key: "SoMatHang",
      align: "center",
      width: 120,
      sorter: (a, b) => a.SoMatHang - b.SoMatHang,
      render: (text) => (
        <span className="flex justify-end">{formatCurrency(text)}</span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "TongSoLuong",
      key: "TongSoLuong",
      align: "center",
      width: 120,
      sorter: (a, b) => a.TongSoLuong - b.TongSoLuong,
      render: (text) => (
        <span className="flex justify-end">{roundNumber(text)}</span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "GhiChu",
      key: "GhiChu",
      align: "center",
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              justifyContent: "start",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "NguoiTao",
      key: "NguoiTao",
      align: "center",
      sorter: (a, b) => a.NguoiTao.localeCompare(b.NguoiTao),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "NgayTao",
      key: "NgayTao",
      align: "center",
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao);
        const dateB = new Date(b.NgayTao);
        return dateA - dateB;
      },
      render: (text) => (
        <span className="flex justify-center">
          {formatDateTime(text, true)}
        </span>
      ),
    },
    {
      title: "Người sửa",
      dataIndex: "NguoiSuaCuoi",
      key: "NgaySuaCuoi",
      align: "center",
      sorter: (a, b) => a.NgaySuaCuoi.localeCompare(b.NgaySuaCuoi),
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Sửa lúc",
      dataIndex: "NgaySuaCuoi",
      key: "NgaySuaCuoi",
      align: "center",
      sorter: (a, b) => {
        const dateA = new Date(a.NgaySuaCuoi);
        const dateB = new Date(b.NgaySuaCuoi);
        return dateA - dateB;
      },
      render: (text) => (
        <span className="flex justify-center">
          {formatDateTime(text, true)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 120,
      align: "center",
      render: (record) => {
        return (
          <>
            <div className="flex gap-2 items-center justify-center">
              <div
                className="p-1.5 border-2 rounded-md  cursor-pointer  hover:bg-slate-50 hover:text-yellow-400  border-yellow-400 bg-yellow-400 text-slate-50 "
                title="Sửa"
              >
                <MdEdit />
              </div>
              <div
                className="p-1.5 border-2 rounded-md cursor-pointer  hover:bg-slate-50 hover:text-purple-500  border-purple-500  bg-purple-500 text-slate-50 "
                title="In Phiếu"
              >
                <MdPrint />
              </div>
              <div
                className="p-1.5 border-2 rounded-md cursor-pointer  hover:bg-slate-50 hover:text-red-500 hover:border-red-500  bg-red-500 text-slate-50 "
                title="Xóa"
                onClick={() => handleDelete(record)}
              >
                <MdDelete />
              </div>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <>
      {!isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between gap-2 relative">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold uppercase">
                    Phiếu Nhập Kho Điều Chỉnh
                  </h1>
                  <FaSearch
                    className="hover:text-red-400 cursor-pointer"
                    onClick={() => setIsShowSearch(!isShowSearch)}
                  />
                </div>
                <div className="flex relative ">
                  {isShowSearch && (
                    <div
                      className={`flex absolute left-[19rem] -top-8 transition-all linear duration-700 ${
                        isShowSearch ? "w-[20rem]" : "w-0"
                      } overflow-hidden`}
                    >
                      <input
                        type="text"
                        placeholder="Nhập ký tự bạn cần tìm"
                        onChange={handleSearch}
                        className={
                          "px-2 py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] "
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <form
                form={form}
                className="-mb-6"
                onKeyDown={(e) => {
                  if (e.key === "Enter") getDataNDC(e);
                }}
              >
                <Form.Item
                  name="dateRange"
                  rules={[
                    {
                      validator: validateDate,
                    },
                  ]}
                >
                  <Space>
                    <RangePicker
                      format="DD/MM/YYYY"
                      picker="date"
                      onKeyDown={handleKeyDown}
                      onCalendarChange={handleCalendarChange}
                      defaultValue={[
                        dayjs(khoanNgayFrom, "YYYY-MM-DD"),
                        dayjs(khoanNgayTo, "YYYY-MM-DD"),
                      ]}
                      onChange={(values) => {
                        setKhoanNgayFrom(
                          values[0]
                            ? dayjs(values[0]).format("YYYY-MM-DDTHH:mm:ss")
                            : ""
                        );
                        setKhoanNgayTo(
                          values[1]
                            ? dayjs(values[1]).format("YYYY-MM-DDTHH:mm:ss")
                            : ""
                        );
                        // const isValid =
                        //   moment(values[0], "DD/MM/YYYY", true).isValid() &&
                        //   moment(values[1], "DD/MM/YYYY", true).isValid();
                        // setIsValidDate(isValid);
                        console.log(
                          "Selected Date Range:",
                          khoanNgayFrom,
                          khoanNgayTo
                        );
                      }}
                    />
                    {isValidDate ? (
                      <MdCheckCircle
                        style={{
                          color: "green",
                        }}
                      />
                    ) : (
                      <IoMdCloseCircle
                        style={{
                          color: "red",
                        }}
                      />
                    )}
                  </Space>
                </Form.Item>
              </form>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1.5 bg-blue-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-blue-600">
                  <div> Thêm Sản Phẩm</div>
                  <div>
                    <IoMdAddCircleOutline className="w-6 h-6" />
                  </div>
                </div>
                <div className="px-2 py-1.5 bg-purple-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-purple-600">
                  <div>In Phiếu</div>
                  <div>
                    <MdPrint className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Table
                className="table_DMHangHoa"
                columns={titles}
                dataSource={filteredHangHoa}
                onRow={(record) => ({
                  onDoubleClick: () => {
                    handleView(record);
                  },
                })}
                size="small"
                scroll={{
                  x: 1800,
                  y: 400,
                }}
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "24px",
                }}
              />
            </div>
          </div>
          <div>
            {isShowModal &&
              (actionType == "view" ? (
                <NDCXem
                  close={() => setIsShowModal(false)}
                  dataNDC={isDataKhoDC}
                />
              ) : actionType == "delete" ? (
                <NDCXoa
                  close={() => setIsShowModal(false)}
                  dataNDC={isDataKhoDC}
                />
              ) : null)}
          </div>
        </>
      )}
    </>
  );
};

export default PhieuNhapDieuChinh;
