import { Table, Tooltip } from "antd";
import { FaSearch } from "react-icons/fa";
import { TfiMoreAlt } from "react-icons/tfi";
import { useState, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import categoryAPI from "../../../../API/linkAPI";
import { useSearch } from "../../../../hooks_T/Search";
import { MdEdit, MdDelete, MdPrint } from "react-icons/md";
import NCKXem from "../../../../components_T/Modal/DuLieu/DuLieuTrongKho/PhieuNCK/NCKXem";

const PhieuNhapDieuChinh = () => {
  const TokenAccess = localStorage.getItem("TKN");
  const [dataNDC, setDataNDC] = useState("");
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataNDC);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isShowOption, setIsShowOption] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isDataKhoDC, setIsDataKhoDC] = useState("");

  useEffect(() => {
    getDataNDC();
  }, []);
  const getDataNDC = async () => {
    try {
      const response = await categoryAPI.GetDataNDC({}, TokenAccess);
      if (response.data.DataError == 0) {
        console.log(response.data.DataResults);

        setDataNDC(response.data.DataResults);
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
      render: (text) => <span className="flex ">{text}</span>,
    },
    {
      title: "Ngày chứng từ",
      dataIndex: "NgayCTu",
      key: "NgayCTu",
      width: 120,
      align: "center",
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
      render: (text) => (
        <span className="flex justify-end">{roundNumber(text)}</span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "GhiChu",
      key: "GhiChu",
      align: "center",
      render: (text) => <span className="flex justify-start">{text}</span>,
    },
    {
      title: "Người tạo",
      dataIndex: "NguoiTao",
      key: "NguoiTao",
      align: "center",
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
                className="p-1.5 border-2 rounded-md  cursor-pointer  bg-slate-50 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400  hover:text-slate-50 "
                title="Sửa"
              >
                <MdEdit />
              </div>
              <div
                className="p-1.5 border-2 rounded-md cursor-pointer  bg-slate-50 text-purple-500 hover:border-purple-500 hover:bg-purple-500  hover:text-slate-50 "
                title="In Mã Vạch"
              >
                <MdPrint />
              </div>
              <div
                className="p-1.5 border-2 rounded-md cursor-pointer  bg-slate-50 text-red-500 hover:border-red-500 hover:bg-red-500  hover:text-slate-50 "
                title="Xóa"
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
          <div className="flex justify-between ">
            <div
              className="cursor-pointer hover:bg-slate-200 items-center rounded-full px-2 py-1.5 "
              onClick={() => setIsShowOption(!isShowOption)}
              title="Chức năng khác"
            >
              <TfiMoreAlt
                className={`duration-300 rotate-${isShowOption ? "0" : "90"}`}
              />
            </div>
            {isShowOption && (
              <div className="flex flex-col gap-4 bg-slate-100 p-4 absolute top-0 right-[2%] rounded-lg z-10 duration-500 shadow-custom ">
                <div className="px-3 py-2 bg-blue-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-blue-600">
                  <div> Thêm Sản Phẩm</div>
                  <div>
                    <IoMdAddCircleOutline className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}
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
        {isShowModal && (
          <NCKXem close={() => setIsShowModal(false)} data={isDataKhoDC} />
        )}
      </div>
    </>
  );
};

export default PhieuNhapDieuChinh;
