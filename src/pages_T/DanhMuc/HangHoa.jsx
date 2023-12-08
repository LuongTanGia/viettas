/* eslint-disable react-hooks/exhaustive-deps */
import categoryAPI from "../../API/linkAPI";
import { useSearch } from "../../hooks_T/Search";
import HangHoaModals from "../../components_T/Modal/HangHoaModals";
import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import moment from "moment";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdEdit, MdDelete, MdCancel, MdOutlineGroupAdd } from "react-icons/md";
import { TfiMoreAlt } from "react-icons/tfi";
import { GrStatusUnknown } from "react-icons/gr";
import { CiBarcode } from "react-icons/ci";

const HangHoa = () => {
  const TokenAccess = localStorage.getItem("TKN");
  const [dataHangHoa, setDataHangHoa] = useState();
  const [setSearchHangHoa, filteredHangHoa] = useSearch(dataHangHoa);
  const [isMaHang, setIsMaHang] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isShowOption, setIsShowOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getListHangHoa = async () => {
    try {
      const response = await categoryAPI.HangHoa(TokenAccess);
      if (response.data.DataError === 0) {
        setDataHangHoa(response.data.DataResults);
        setIsLoading(true);
      } else {
        console.log(response);
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListHangHoa();
  }, [getListHangHoa, isLoading]);

  const handleCreate = () => {
    setActionType("create");
    setIsShowModal(true);
    getListHangHoa();
    setIsMaHang([]);
  };
  const handleDelete = (record) => {
    setActionType("delete");
    setIsShowModal(true);
    setIsMaHang(record);
    getListHangHoa();
  };
  const handleView = (record) => {
    setActionType("view");
    setIsMaHang(record);
    setIsShowModal(true);
  };
  const handleUpdate = (record) => {
    setActionType("edit");
    setIsMaHang(record);
    setIsShowModal(true);
  };
  const handleStatus = () => {
    setActionType("status");
    setIsShowModal(true);
  };
  const handleGroup = () => {
    setActionType("group");
    setIsShowModal(true);
  };
  const handlePrintBar = () => {
    setActionType("print");
    setIsShowModal(true);
  };
  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value);
  };
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN");
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
      width: 200,
      render: (text, record) => (
        <Tooltip title={text}>
          <div
            className="hover:text-blue-600"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
            onClick={() => handleView(record)}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngưng dùng",
      dataIndex: "NA",
      key: "NA",
      fixed: "left",
      width: 100,
      align: "center",
      render: (text) => (
        <span className="flex justify-center items-center gap-2">
          {text == true ? (
            <FaCheckCircle style={{ color: "green" }} title="Ngưng sử dụng" />
          ) : (
            <MdCancel style={{ color: "red" }} title="Còn sử dụng" />
          )}
        </span>
      ),
    },
    {
      title: "Tên nhóm",
      dataIndex: "TenNhom",
      key: "TenNhom",
      align: "center",
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Đơn vị tính",
      dataIndex: "DVTKho",
      key: "DVTKho",
      align: "center",
      width: 100,
    },
    {
      title: "Quy đổi",
      dataIndex: "TyLeQuyDoi",
      key: "TyLeQuyDoi",
      align: "center",
      width: 100,
      render: (text) => (
        <span className="flex justify-end">{formatCurrency(text)}</span>
      ),
    },
    {
      title: "Quy đổi Đơn vị tính",
      dataIndex: "DienGiaiDVTQuyDoi",
      key: "DienGiaiDVTQuyDoi",
      align: "center",
    },
    {
      title: "Mã vạch",
      dataIndex: "MaVach",
      key: "MaVach",
      align: "center",
      width: 150,
    },
    {
      title: "Lắp ráp",
      dataIndex: "LapRap",
      key: "LapRap",
      align: "center",
      width: 100,
      render: (text) => (
        <span className="flex justify-center">
          {text == true ? (
            <FaCheckCircle style={{ color: "green" }} />
          ) : (
            <MdCancel style={{ color: "red" }} />
          )}
        </span>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "TonKho",
      key: "TonKho",
      align: "center",
      width: 100,
      render: (text) => (
        <span className="flex justify-center">
          {text == true ? (
            <FaCheckCircle style={{ color: "green", width: "100%" }} />
          ) : (
            <MdCancel style={{ color: "red", width: "100%" }} />
          )}
        </span>
      ),
    },
    {
      title: "Giá bán lẻ",
      dataIndex: "GiaBanLe",
      key: "GiaBanLe",
      align: "center",
      width: 120,
      render: (text) => (
        <span className="flex justify-end">{formatCurrency(text)}</span>
      ),
    },
    {
      title: "Bảng số giá",
      dataIndex: "BangGiaSi",
      key: "BangGiaSi",
      width: 120,
      align: "center",
      render: (text) => (
        <span className="flex justify-end">{formatCurrency(text)}</span>
      ),
    },
    {
      title: "Giá sỉ thấp",
      dataIndex: "BangGiaSi_Min",
      key: "BangGiaSi_Min",
      width: 150,

      align: "center",
      render: (text) => (
        <span className="flex justify-end">{formatCurrency(text)}</span>
      ),
    },
    {
      title: "Giá sỉ cao",
      dataIndex: "BangGiaSi_Max",
      key: "BangGiaSi_Max",
      width: 150,

      align: "center",
      render: (text) => (
        <span className="flex justify-end">{formatCurrency(text)}</span>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "NguoiTao",
      key: "NguoiTao",
      align: "center",
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss.SS"),
    },
    {
      title: "Người sửa",
      dataIndex: "NguoiSuaCuoi",
      key: "NguoiSuaCuoi",
      align: "center",
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày sửa",
      dataIndex: "NgaySuaCuoi",
      key: "NgaySuaCuoi",
      align: "center",
      render: (text) => {
        if (text) {
          return moment(text).format("DD/MM/YYYY HH:mm:ss.SS");
        } else {
          return ""; // hoặc giá trị mặc định khác nếu bạn muốn
        }
      },
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
                className="p-2 bg-yellow-400 rounded-md text-slate-50 cursor-pointer shadow-custom hover:bg-white hover:text-yellow-400"
                title="Sửa"
                onClick={() => handleUpdate(record)}
              >
                <MdEdit />
              </div>
              <div
                className="p-2 bg-red-500 rounded-md text-slate-50 cursor-pointer  shadow-custom hover:bg-white hover:text-red-500 "
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
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col py-2 px-4 gap-1 ">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-gray-600 uppercase">
                Hàng Hóa
              </h1>
              <div className="flex justify-between relative">
                <div className="flex relative">
                  <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3" />
                  <input
                    type="text"
                    placeholder="Nhập tên bạn cần tìm"
                    onChange={handleSearch}
                    className="px-8 py-1 w-[20rem] border-slate-200"
                  />
                </div>
                <div>
                  <div
                    className="p-2 bg-gray-200 rounded-lg cursor-pointer shadow-custom"
                    onClick={() => setIsShowOption(!isShowOption)}
                  >
                    <p>
                      <TfiMoreAlt
                        className={`duration-300 rotate-${
                          isShowOption ? "90" : "0"
                        }`}
                      />
                    </p>
                  </div>
                  {isShowOption && (
                    <div className="flex flex-col gap-4 bg-slate-100 p-4 absolute top-0 right-[3%] rounded-lg z-10 duration-500 shadow-custom ">
                      <div
                        className="px-3 py-2 bg-blue-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-blue-600"
                        onClick={() => handleCreate()}
                      >
                        <div> Thêm Sản Phẩm</div>
                        <div>
                          <IoMdAddCircleOutline className="w-6 h-6" />
                        </div>
                      </div>
                      <div
                        className="justify-center px-3 py-2 bg-green-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-green-600"
                        onClick={() => handleStatus()}
                      >
                        <div> Đổi Trạng Thái </div>
                        <div>
                          <GrStatusUnknown className="w-6 h-6" />
                        </div>
                      </div>
                      <div
                        className="justify-center px-3 py-2 bg-orange-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-2 items-center cursor-pointer hover:bg-white hover:text-orange-600"
                        onClick={() => handleGroup()}
                      >
                        <div> Đổi Nhóm Hàng</div>
                        <div>
                          <MdOutlineGroupAdd className="w-6 h-6" />
                        </div>
                      </div>
                      <div
                        className="justify-center px-3 py-2 bg-purple-600 rounded-lg font-semibold text-slate-50 shadow-custom flex gap-1 items-center cursor-pointer hover:bg-white hover:text-purple-600"
                        onClick={() => handlePrintBar()}
                      >
                        <div> In Mã Vạch</div>
                        <div>
                          <CiBarcode className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="z-0">
              <Table
                className="table_DMHangHoa"
                columns={titles}
                dataSource={filteredHangHoa}
                size="small"
                scroll={{
                  x: 3000,
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
              <HangHoaModals
                type={actionType}
                close={() => setIsShowModal(false)}
                getMaHang={isMaHang}
                getDataHangHoa={dataHangHoa}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default HangHoa;
