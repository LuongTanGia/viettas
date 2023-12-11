/* eslint-disable react-hooks/exhaustive-deps */
import categoryAPI from "../../API/linkAPI";
import { useSearch } from "../../hooks_T/Search";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { Form, DatePicker, Space, Table, Select, Tooltip } from "antd";
import moment from "moment";
import { MdCheckCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const NhapXuatTonKho = () => {
  const TokenAccess = localStorage.getItem("TKN");
  const [dataNXT, setDataNXT] = useState("");
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataNXT);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [nhomHangNXT, setNhomHangNXT] = useState([]);
  const [hangHoaNXT, setHangHoaNXT] = useState([]);
  const [khoHangNXT, setKhoHangNXT] = useState([]);
  const [khoanNgayFrom, setKhoanNgayFrom] = useState("");
  const [khoanNgayTo, setKhoanNgayTo] = useState("");
  const [selectedMaFrom, setSelectedMaFrom] = useState("");
  const [selectedMaTo, setSelectedMaTo] = useState("");
  const [selectedMaList, setSelectedMaList] = useState([]);
  const [selectedNhomFrom, setSelectedNhomFrom] = useState("");
  const [selectedNhomTo, setSelectedNhomTo] = useState("");
  const [selectedNhomList, setSelectedNhomList] = useState([]);
  const [selectedMaKho, setSelectedMaKho] = useState(null);
  const [isValidDate, setIsValidDate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
  const roundNumber = (number) => {
    const roundedNumber = Math.round(number * 10) / 10;
    return roundedNumber.toFixed(1);
  };
  useEffect(() => {
    getListNhomHangNXT();
    getListHangHoaNXT();
    getListKhoNXT();
    getTimeSetting();
    getDataNXTFirst();
  }, [isLoading]);

  const getDataNXTFirst = async () => {
    try {
      if (isLoading == true) {
        const response = await categoryAPI.InfoNXTTheoKho(
          {
            NgayBatDau: khoanNgayFrom,
            NgayKetThuc: khoanNgayTo,
          },
          TokenAccess
        );
        if (response.data.DataError == 0) {
          setDataNXT(response.data.DataResults);
          console.log(response);
          setIsLoading(true);
        } else {
          toast.error(response.data.DataErrorDescription);
          console.log(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDataNXT = async (e) => {
    e.preventDefault();
    try {
      const response = await categoryAPI.InfoNXTTheoKho(
        {
          NgayBatDau: khoanNgayFrom,
          NgayKetThuc: khoanNgayTo,
          CodeValue1From: selectedNhomFrom,
          CodeValue1To: selectedNhomTo,
          CodeValue1List: selectedNhomList.join(", "),
          CodeValue2From: selectedMaFrom,
          CodeValue2To: selectedMaTo,
          CodeValue2List: selectedMaList.join(", "),
        },
        TokenAccess
      );
      console.log(response.data);
      if (response.data.DataError == 0) {
        toast.success(response.data.DataErrorDescription);
        setDataNXT(response.data.DataResults);
        setIsLoading(true);
      } else {
        toast.error(response.data.DataErrorDescription);
        console.log(response.data);
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getListNhomHangNXT = async () => {
    try {
      const response = await categoryAPI.ListNhomHangNXT(TokenAccess);
      if (response.data.DataError == 0) {
        setNhomHangNXT(response.data.DataResults);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getListHangHoaNXT = async () => {
    try {
      const response = await categoryAPI.ListHangHoaNXT(TokenAccess);
      if (response.data.DataError == 0) {
        setHangHoaNXT(response.data.DataResults);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getListKhoNXT = async () => {
    try {
      const response = await categoryAPI.ListKhoHangNXT(TokenAccess);
      if (response.data.DataError == 0) {
        setKhoHangNXT(response.data.DataResults);
      } else {
        console.log(response.data);
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
  const titles = [
    {
      title: "STT",
      render: (text, record, index) => index + 1,
      with: 10,
      fixed: "left",
      width: 50,
      align: "center",
    },
    {
      title: "Mã hàng",
      dataIndex: "MaHang",
      key: "MaHang",
      fixed: "left",
      width: 150,
      align: "center",
    },
    {
      title: "Tên hàng",
      dataIndex: "TenHang",
      key: "TenHang",
      fixed: "left",
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
      title: "Nhóm",
      dataIndex: "TenNhomHang",
      key: "TenNhomHang",
      width: 150,
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
      title: "Tên Kho",
      dataIndex: "TenKho",
      key: "TenKho",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "DVT",
      key: "DVT",
      width: 150,
      align: "center",
    },
    {
      title: "Tồn đầu",
      dataIndex: "SoLuongTonDK",
      key: "SoLuongTonDK",
      width: 150,
      align: "center",
      render: (text) => (
        <div
          className={`flex justify-end w-full h-full  px-2  ${
            text < 0
              ? "text-red-600 text-base font-bold"
              : text === 0
              ? "text-gray-300"
              : ""
          } `}
        >
          {roundNumber(text)}
        </div>
      ),
    },
    {
      title: "Nhập",
      children: [
        {
          title: "Mua hàng",
          dataIndex: "SoLuongNhap_PMH",
          key: "SoLuongNhap_PMH",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Trả hàng",
          dataIndex: "SoLuongNhap_NTR",
          key: "SoLuongNhap_NTR",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Điều chỉnh",
          dataIndex: "SoLuongNhap_NDC",
          key: "SoLuongNhap_NDC",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Tổng nhập",
          dataIndex: "SoLuongNhap",
          key: "SoLuongNhap",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
      ],
    },
    {
      title: "Xuất",
      children: [
        {
          title: "Bán sỉ",
          dataIndex: "SoLuongXuat_PBS",
          key: "SoLuongXuat_PBS",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Bán lẻ",
          dataIndex: "SoLuongXuat_PBL",
          key: "SoLuongXuat_PBL",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Bán lẻ (Quầy)",
          dataIndex: "SoLuongXuat_PBQ",
          key: "SoLuongXuat_PBQ",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Trả hàng",
          dataIndex: "SoLuongXuat_XTR",
          key: "SoLuongXuat_XTR",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Sử dụng",
          dataIndex: "SoLuongXuat_XSD",
          key: "SoLuongXuat_XSD",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Hủy",
          dataIndex: "SoLuongXuat_HUY",
          key: "SoLuongXuat_HUY",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Điều chỉnh",
          dataIndex: "SoLuongXuat_XDC",
          key: "SoLuongXuat_XDC",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Chuyển kho",
          dataIndex: "SoLuongTonCK",
          key: "SoLuongTonCK",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
        {
          title: "Tổng xuất",
          dataIndex: "SoLuongXuat",
          key: "SoLuongXuat",
          width: 150,
          align: "center",
          render: (text) => (
            <div
              className={`flex justify-end w-full h-full  px-2  ${
                text < 0
                  ? "text-red-600 text-base font-bold"
                  : text === 0
                  ? "text-gray-300"
                  : ""
              } `}
            >
              {roundNumber(text)}
            </div>
          ),
        },
      ],
    },
    {
      title: "Tồn Cuối",
      dataIndex: "SoLuongTonCK",
      fixed: "right",
      key: "SoLuongTonCK",
      width: 150,
      align: "center",
      render: (text) => (
        <div
          className={`flex justify-end w-full h-full  px-2  ${
            text < 0
              ? "text-red-600 text-base font-bold"
              : text === 0
              ? "text-gray-300"
              : ""
          } `}
        >
          {roundNumber(text)}
        </div>
      ),
    },
  ];

  return (
    <>
      {!isLoading ? (
        <p className=" ">Loading</p>
      ) : (
        <div className="flex flex-col py-2 px-4 gap-2">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-black-600 uppercase">
                  Nhập Xuất Tồn - Theo Kho
                </h1>
                <FaSearch
                  className="hover:text-red-400 cursor-pointer"
                  onClick={() => setIsShowSearch(!isShowSearch)}
                />
              </div>
              <div className="flex relative ">
                {isShowSearch && (
                  <div
                    className={`flex absolute left-[18.5rem] -top-8 transition-all linear duration-700 ${
                      isShowSearch ? "w-[20rem]" : "w-0"
                    } overflow-hidden`}
                  >
                    <input
                      type="text"
                      placeholder="Nhập tên bạn cần tìm"
                      onChange={handleSearch}
                      className={"px-2 py-1 w-[20rem] border-slate-200  "}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between relative">
              <div form={form} className="-mb-4">
                <Form.Item
                  name="dateRange"
                  label={
                    <span style={{ fontWeight: "bold" }}>Thông tin từ</span>
                  }
                  rules={[
                    {
                      validator: validateDate,
                    },
                  ]}
                >
                  <Space>
                    <RangePicker
                      disabled
                      format="DD/MM/YYYY"
                      picker="date"
                      onKeyDown={handleKeyDown}
                      value={[
                        khoanNgayFrom ? dayjs(khoanNgayFrom) : null,
                        khoanNgayTo ? dayjs(khoanNgayTo) : null,
                      ]}
                      onCalendarChange={handleCalendarChange}
                      defaultValue={[
                        dayjs(khoanNgayFrom, "YYYY-MM-DD"),
                        dayjs(khoanNgayTo, "YYYY-MM-DD"),
                      ]}
                    />
                  </Space>
                </Form.Item>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  allowClear
                  placeholder="Lọc Kho"
                  value={selectedMaKho}
                  onChange={(value) => setSelectedMaKho(value)}
                  style={{
                    width: "150px",
                    color: "red",
                  }}
                >
                  {khoHangNXT?.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={item.MaKho}
                        title={item.TenKho}
                        className="py-8"
                      >
                        <p> {item.TenKho}</p>
                      </Select.Option>
                    );
                  })}
                </Select>
                <div>
                  <div
                    className="flex items-center gap-2 px-2 py-1 bg-blue-600 text-slate-50 rounded-lg cursor-pointer shadow-custom hover:bg-white hover:text-blue-600"
                    onClick={() => setIsShowModal(!isShowModal)}
                  >
                    <p className="text-lg font-medium ">Lọc Hàng</p>
                    <p>
                      <FaFilter
                        className={`duration-300 rotate-${
                          isShowModal ? "90" : "0"
                        }`}
                      />
                    </p>
                  </div>
                  {isShowModal && (
                    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10 ">
                      <div
                        onClick={() => setIsShowModal(false)}
                        className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"
                      ></div>
                      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden ">
                        <form
                          className="flex flex-col gap-4"
                          onSubmit={getDataNXT}
                        >
                          <div>
                            <div className="flex justify-end  ">
                              <IoMdClose
                                onClick={() => setIsShowModal(false)}
                                className="w-6 h-6 rounded-full border-current hover:bg-slate-200 hover:text-red-500"
                              />
                            </div>
                            <div className="flex gap-2 justify-center items-center font-semibold text-lg">
                              <p className="text-blue-700 uppercase">
                                Lọc Thông Tin Hàng
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4 justify-center items-center ">
                            <div className="DaySet -mb-4">
                              <div form={form}>
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
                                            ? dayjs(values[0]).format(
                                                "YYYY-MM-DDTHH:mm:ss"
                                              )
                                            : ""
                                        );
                                        setKhoanNgayTo(
                                          values[1]
                                            ? dayjs(values[1]).format(
                                                "YYYY-MM-DDTHH:mm:ss"
                                              )
                                            : ""
                                        );
                                        const isValid =
                                          moment(
                                            values[0],
                                            "DD/MM/YYYY",
                                            true
                                          ).isValid() &&
                                          moment(
                                            values[1],
                                            "DD/MM/YYYY",
                                            true
                                          ).isValid();
                                        setIsValidDate(isValid);
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
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 px-4 border-2 py-4 border-black-200 rounded-lg relative">
                              <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">
                                Theo Nhóm
                              </p>
                              <div className="flex gap-1 items-center">
                                <div>Từ</div>
                                <Select
                                  allowClear
                                  filterOption
                                  placeholder="Chọn nhóm"
                                  value={selectedNhomFrom}
                                  onChange={(value) =>
                                    setSelectedNhomFrom(value)
                                  }
                                  style={{
                                    width: "200px",
                                  }}
                                >
                                  {nhomHangNXT?.map((item, index) => {
                                    return (
                                      <Select.Option
                                        key={index}
                                        value={item.Ma}
                                        title={item.ThongTinNhomHang}
                                      >
                                        <p className="truncate">{item.Ma}</p>
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </div>
                              <div className="flex gap-1 items-center">
                                <div> Tới</div>
                                <Select
                                  allowClear
                                  filterOption
                                  placeholder="Chọn nhóm"
                                  value={selectedNhomTo}
                                  onChange={(value) => setSelectedNhomTo(value)}
                                  style={{
                                    width: "200px",
                                  }}
                                >
                                  {nhomHangNXT?.map((item, index) => {
                                    return (
                                      <Select.Option
                                        key={index}
                                        value={item.Ma}
                                        title={item.ThongTinNhomHang}
                                      >
                                        <p className="truncate">{item.Ma}</p>
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </div>
                              <div className="col-span-2 flex gap-1 items-center">
                                <div>Gộp Nhóm</div>
                                <Select
                                  mode="multiple"
                                  maxTagCount={2}
                                  filterOption
                                  placeholder="Danh sách nhóm"
                                  value={selectedNhomList}
                                  onChange={(value) =>
                                    setSelectedNhomList(value)
                                  }
                                  style={{
                                    width: "390px",
                                  }}
                                >
                                  {nhomHangNXT?.map((item) => {
                                    return (
                                      <Select.Option
                                        key={item.Ma}
                                        value={item.Ma}
                                        title={item.ThongTinNhomHang}
                                      >
                                        <p className="truncate">{item.Ma}</p>
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 px-4 border-2 py-4 border-black-200 rounded-lg relative">
                              <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">
                                Theo Mã
                              </p>
                              <div className="flex gap-1 items-center">
                                <div> Từ</div>
                                <Select
                                  allowClear
                                  filterOption
                                  placeholder="Chọn mã hàng"
                                  value={selectedMaFrom}
                                  onChange={(value) => setSelectedMaFrom(value)}
                                  style={{
                                    width: "200px",
                                  }}
                                >
                                  {hangHoaNXT?.map((item, index) => {
                                    return (
                                      <Select.Option
                                        key={index}
                                        value={item.MaHang}
                                        title={item.TenHang}
                                      >
                                        <p className="truncate">
                                          {item.MaHang}
                                        </p>
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </div>
                              <div className="flex gap-1 items-center">
                                <div> Tới</div>
                                <Select
                                  allowClear
                                  filterOption
                                  placeholder="Chọn mã hàng"
                                  value={selectedMaTo}
                                  onChange={(value) => setSelectedMaTo(value)}
                                  style={{
                                    width: "200px",
                                  }}
                                >
                                  {hangHoaNXT?.map((item, index) => {
                                    return (
                                      <Select.Option
                                        key={index}
                                        value={item.MaHang}
                                        title={item.TenHang}
                                      >
                                        <p className="truncate">
                                          {item.MaHang}
                                        </p>
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </div>
                              <div className="flex items-center gap-1 col-span-2">
                                <div>Gộp Mã</div>
                                <Select
                                  mode="multiple"
                                  maxTagCount={2}
                                  allowClear
                                  filterOption
                                  value={selectedMaList}
                                  onChange={(value) => setSelectedMaList(value)}
                                  placeholder="Chọn mã hàng"
                                  style={{
                                    width: "370px",
                                  }}
                                >
                                  {hangHoaNXT?.map((item, index) => {
                                    return (
                                      <Select.Option
                                        key={index}
                                        value={item.MaHang}
                                        title={item.TenHang}
                                      >
                                        <p className="truncate">
                                          {item.MaHang}
                                        </p>
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end px-2">
                            <button
                              className="bg-blue-600 p-2 font-medium rounded-lg text-white shadow-custom z-50"
                              type="submit"
                            >
                              Xác nhận
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="z-0">
            <Table
              className="table_TXNhapXuatTonKho"
              columns={titles}
              dataSource={filteredHangHoa.filter((item) =>
                selectedMaKho ? item.MaKho === selectedMaKho : true
              )}
              size="small"
              scroll={{
                x: 3100,
                y: 300,
              }}
              style={{
                whiteSpace: "nowrap",
                fontSize: "24px",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NhapXuatTonKho;
