/* eslint-disable react/prop-types */
import { FaCheckCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import categoryAPI from "../../API/linkAPI";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "./HangHoaModals.css";
import { Checkbox, Select, Space } from "antd";

const HangHoaModals = ({ close, type, getMaHang, getDataHangHoa }) => {
  const TokenAccess = localStorage.getItem("TKN");
  const [dataView, setDataView] = useState({});
  const [nhomHang, setNhomHang] = useState([]);
  const [dVTKho, setDVTKho] = useState();
  const [dVTQuyDoi, setDVTQuyDoi] = useState();
  const [HangHoaCT, setHangHoaCT] = useState();
  //   const [DVT, setDVT] = useState("Rổng");
  // const [SoLuong, setSoLuong] = useState("1.0");
  // const [MaHangCT, setMaHangCT] = useState("");
  // const [x, setX] = useState([]);

  const [selectedMaHang, setSelectedMaHang] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBarCodeFrom, setSelectedBarCodeFrom] = useState("");
  const [selectedBarCodeTo, setSelectedBarCodeTo] = useState("");
  const [selectedBarCodeList, setSelectedBarCodeList] = useState([]);
  const [selectednhomFrom, setSelectednhomFrom] = useState("");
  const [selectednhomTo, setSelectednhomTo] = useState("");
  const [selectednhomList, setSelectednhomList] = useState([]);
  const [selectedTem, setSelectedTem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initProduct = {
    Nhom: "",
    TenHang: "",
    DVTKho: "",
    DVTQuyDoi: "",
    TyLeQuyDoi: "",
    MaVach: "",
    DienGiaiHangHoa: "",
    LapRap: false,
    TonKho: true,
    NA: false,
    GhiChu: "",
    Barcodes: [{ MaVach: "", NA: false }],
    HangHoa_CTs: [{ MaHangChiTiet: "", SoLuong: "", DVT_CTs: "Rổng" }],
  };
  const [hangHoaForm, setHangHoaForm] = useState(() => {
    return getMaHang ? getMaHang : initProduct;
  });

  useEffect(() => {
    getNhomHang();
    getDVT();
    getHangHoaCT();
    handleView();
  }, [type, getMaHang, isLoading]);
  const getNhomHang = async () => {
    try {
      const dataNH = await categoryAPI.ListNhomHang(TokenAccess);
      if (dataNH.data.DataError == 0) {
        setNhomHang(dataNH.data.DataResults);
      } else {
        console.log(dataNH.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDVT = async () => {
    try {
      const dataDVT = await categoryAPI.ListDVT(TokenAccess);
      if (dataDVT.data.DataError == 0) {
        setDVTQuyDoi(dataDVT.data.DataResults);
        setDVTKho(dataDVT.data.DataResults);
      } else {
        console.log(dataDVT.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getHangHoaCT = async () => {
    try {
      const dataHHCT = await categoryAPI.ListHangHoaCT(TokenAccess);
      if (dataHHCT.data.DataError == 0) {
        setHangHoaCT(dataHHCT.data.DataResults);
      } else {
        console.log(dataHHCT.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  function formatDateTime(inputDate, includeTime = false) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    let formattedDateTime = `${day}/${month}/${year}`;
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
      formattedDateTime += ` ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    return formattedDateTime;
  }
  const roundNumber = (number) => {
    const roundedNumber = Math.round(number * 10) / 10;
    return roundedNumber.toFixed(1);
  };
  // Table Barcode
  const handleBarcodeChange = (index, key, value) => {
    if (type == "create") {
      const updatedBarcodes = [...hangHoaForm.Barcodes];
      updatedBarcodes[index][key] = value;
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: updatedBarcodes,
      });
    } else {
      const updatedBarcodes = [...dataView.Barcodes];
      updatedBarcodes[index][key] = value;
      setDataView({
        ...dataView,
        Barcodes: updatedBarcodes,
      });
    }
  };
  const addBarcodeRow = () => {
    const addBarcode = Array.isArray(hangHoaForm.Barcodes)
      ? [...hangHoaForm.Barcodes]
      : [];
    if (type == "create") {
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: [...addBarcode, { MaVach: "", NA: false }],
      });
    } else {
      setDataView({
        ...dataView,
        Barcodes: [...dataView.Barcodes, { MaVach: "", NA: false }],
      });
    }
  };
  const removeBarcode = (index) => {
    if (type == "create") {
      const updatedBarcodes = [...hangHoaForm.Barcodes];
      updatedBarcodes.splice(index, 1);
      setHangHoaForm({
        ...hangHoaForm,
        Barcodes: updatedBarcodes,
      });
    } else {
      const updatedBarcodes = [...dataView.Barcodes];
      updatedBarcodes.splice(index, 1);
      setDataView({
        ...dataView,
        Barcodes: updatedBarcodes,
      });
    }
  };

  // Table HHCT
  const handleChangeHHCT = (index, property, newValue) => {
    if (type == "create") {
      const newDataList = [...hangHoaForm.HangHoa_CTs];
      if (property == "MaHangChiTiet") {
        const selectedHangHoa = HangHoaCT.find(
          (item) => item.MaHang === newValue
        );
        newDataList[index]["DVT_CTs"] = selectedHangHoa?.DVT;
      }
      newDataList[index][property] = newValue;
      setHangHoaForm({ ...hangHoaForm, HangHoa_CTs: newDataList });
    } else {
      const newDataList = [...dataView.HangHoa_CTs];
      if (property == "MaHangChiTiet") {
        const selectedHangHoa = HangHoaCT.find(
          (item) => item.MaHang === newValue
        );
        newDataList[index]["TenHangChiTiet"] = selectedHangHoa?.TenHang;
        newDataList[index]["DVTChiTiet"] = selectedHangHoa?.DVT;
      }
      if (property === "SoLuong") {
        newValue = parseInt(newValue);
      }
      newDataList[index][property] = newValue;
      setDataView({ ...dataView, HangHoa_CTs: newDataList });
    }
  };

  const addHangHoaCT = () => {
    if (type == "create") {
      const addHHCT = Array.isArray(hangHoaForm.HangHoa_CTs)
        ? [...hangHoaForm.HangHoa_CTs]
        : [];
      setHangHoaForm({
        ...hangHoaForm,
        HangHoa_CTs: [
          ...addHHCT,
          { MaHangChiTiet: "", SoLuong: "", DVT_CTs: "Rổng" },
        ],
      });
    } else {
      const addHHCT = Array.isArray(dataView.HangHoa_CTs)
        ? [...dataView.HangHoa_CTs]
        : [];
      setDataView({
        ...dataView,
        HangHoa_CTs: [
          ...addHHCT,
          { MaHangChiTiet: "", TenHangChiTiet: "", SoLuong: 0 },
        ],
      });
    }
  };
  const removeHangHoaCT = (index) => {
    if (type == "create") {
      const updatedHHCT = [...hangHoaForm.HangHoa_CTs];
      updatedHHCT.splice(index, 1);
      setHangHoaForm({
        ...hangHoaForm,
        HangHoa_CTs: updatedHHCT,
      });
    } else {
      const updatedHHCT = [...dataView.HangHoa_CTs];
      updatedHHCT.splice(index, 1);
      setDataView({
        ...dataView,
        HangHoa_CTs: updatedHHCT,
      });
    }
  };
  // Handle CRUD
  const handleCreate = async (event) => {
    event.preventDefault();
    console.log(hangHoaForm);

    try {
      const response = await categoryAPI.ThemHangHoa(
        { ...hangHoaForm },
        TokenAccess
      );
      if (response.data.DataError === 0) {
        console.log(response.data.DataResults);
        toast.success("Thêm sản phẩm thành công");
      } else {
        console.log(response.data);
        toast.error(response.data.DataErrorDescription);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleView = async () => {
    try {
      const infoHang = await categoryAPI.InfoHangHoa(
        getMaHang?.MaHang,
        TokenAccess
      );
      if (infoHang.data.DataError == 0) {
        setDataView(infoHang.data.DataResult);
        setIsLoading(true);
      } else {
        console.log(infoHang.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(dataView);
      const dataUpdate = await categoryAPI.SuaHangHoa(
        {
          Ma: hangHoaForm.MaHang,
          Data: {
            ...hangHoaForm,
            Barcodes: dataView.Barcodes,
            HangHoa_CTs: dataView.HangHoa_CTs,
          },
        },
        TokenAccess
      );
      if (dataUpdate.data.DataError == 0) {
        toast.success("Sửa thành công");
        console.log(dataUpdate.data);
      }
      console.log(dataUpdate.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      const dataDel = await categoryAPI.XoaHangHoa(
        getMaHang?.MaHang,
        TokenAccess
      );
      if (dataDel.data.DataError == 0) {
        toast.success("Xóa sản phẩm thành công");
      } else {
        console.log(dataDel.data);
        toast.error(dataDel.data.DataErrorDescription);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await categoryAPI.GanTrangThai(
        {
          DanhSachMa: selectedMaHang.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedStatus,
        },
        TokenAccess
      );
      if (response.data.DataError === 0) {
        console.log({
          DanhSachMa: selectedMaHang.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedStatus,
        });
        console.log(selectedStatus);
        console.log(response.data);
        toast.success(response.data.DataErrorDescription);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  const handleGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await categoryAPI.GanNhom(
        {
          DanhSachMa: selectedMaHang.map((item) => ({ Ma: item })),
          GiaTriMoi: selectedGroup,
        },
        TokenAccess
      );
      if (response.data.DataError == 0) {
        console.log(response.data);
        toast.success("Thay đổi nhóm thành công");
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePrintBar = async (e) => {
    e.preventDefault();
    try {
      const response = await categoryAPI.InMaVach(
        {
          CodeValue1From: selectednhomFrom,
          CodeValue1To: selectednhomTo,
          CodeValue1List: selectednhomList.join(", "),
          CodeValue2From: selectedBarCodeFrom,
          CodeValue2To: selectedBarCodeTo,
          CodeValue2List: selectedBarCodeList.join(", "),
          SoTem: selectedTem,
        },
        TokenAccess
      );
      console.log(selectednhomList.join(", "));
      if (response.data.DataError === 0) {
        const decodedData = atob(response.data.DataResults);
        const arrayBuffer = new ArrayBuffer(decodedData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < decodedData.length; i++) {
          uint8Array[i] = decodedData.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], {
          type: "application/pdf",
        });
        const dataUrl = URL.createObjectURL(blob);
        const newWindow = window.open(dataUrl, "_blank");
        newWindow.onload = function () {
          newWindow.print();
        };
      } else {
        toast.error(response.data.DataErrorDescription);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 zIndex">
      <div
        onClick={close}
        className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden">
        {type == "view" && (
          <div
            className={`flex flex-col ${
              dataView?.Barcodes?.length > 0 ||
              dataView?.HangHoa_CTs?.length > 0
                ? " min-w-[90rem]"
                : "min-w-[50rem]"
            }`}
          >
            <div>
              <div onClick={close} className="flex justify-end  ">
                <IoMdClose className="w-6 h-6 rounded-full border-current hover:bg-slate-200 hover:text-red-500" />
              </div>
              <div className="flex gap-2 justify-center items-center font-semibold text-lg">
                <p className="text-blue-700 uppercase">Thông Tin Sảm Phẩm Mã</p>
                <p className="text-red-700"> {dataView?.MaHang}</p>
                <div>
                  {dataView?.NA !== false ? (
                    <div className="text-red-600" title="Ngưng Sử Dụng">
                      <IoCloseCircle />
                    </div>
                  ) : (
                    <div className="text-green-600" title="Còn Sử Dụng">
                      <FaCheckCircle />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`${
                dataView?.Barcodes?.length > 0 ||
                dataView?.HangHoa_CTs?.length > 0
                  ? "grid grid-cols-2"
                  : "grid grid-cols-1"
              }`}
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-4 gap-2 items-center">
                  <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                    <label className="font-semibold ">Mã hàng</label>
                    <input
                      type="text"
                      value={dataView?.MaHang || ""}
                      className="px-4 py-1 border border-red-700 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap ml-4">
                    <Checkbox
                      className=" text-base font-semibold"
                      id="TonKho"
                      checked={dataView?.LapRap}
                    >
                      Lắp ráp
                    </Checkbox>
                  </div>
                  <div className="flex items-center gap-1 ">
                    <Checkbox
                      className=" text-base font-semibold"
                      id="TonKho"
                      checked={dataView?.TonKho}
                    >
                      Tồn kho
                    </Checkbox>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className="font-semibold ">Mã vạch</label>
                    <input
                      type="text"
                      value={dataView?.MaVach || ""}
                      className="px-4 py-1"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap  ">
                    <label className="font-semibold ">Tên Nhóm</label>
                    <input
                      type="text"
                      value={dataView?.TenNhom || ""}
                      className="px-4 py-1"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className="font-semibold ">Tên hàng</label>
                  <input
                    type="text"
                    value={dataView?.TenHang || ""}
                    className="px-4 py-1"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                    <label className="font-semibold ">Đơn vị tính</label>
                    <input
                      type="text"
                      value={dataView?.DVTKho || ""}
                      className="px-4 py-1"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <label className="font-semibold ">x</label>
                    <input
                      type="text"
                      value={dataView?.TyLeQuyDoi || ""}
                      className="px-4 py-1"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap col-span-2">
                    <label className="font-semibold ">Đơn vị quy đổi</label>
                    <input
                      type="text"
                      value={dataView?.DVTQuyDoi || ""}
                      className="px-4 py-1"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className="font-semibold ">Diễn giải hàng</label>
                  <input
                    type="text"
                    value={
                      dataView?.DienGiaiHangHoa == null
                        ? "Trống"
                        : dataView?.DienGiaiHangHoa || ""
                    }
                    className="px-4 py-1"
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-1 whitespace-nowrap">
                  <label className="font-semibold ">Ghi chú</label>
                  <textarea
                    type="text"
                    value={
                      dataView?.GhiChu == null
                        ? "Trống"
                        : dataView?.GhiChu || ""
                    }
                    className="px-4 py-1"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 px-4 border-2 py-4 border-black-200 rounded-lg relative">
                  <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">
                    Thông tin cập nhật
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className="font-semibold ">Người tạo</label>
                      <input
                        type="text"
                        value={dataView?.NguoiTao || ""}
                        className="px-4 py-1 truncate"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className="font-semibold ">Vào lúc</label>
                      <input
                        type="text"
                        value={formatDateTime(dataView?.NgayTao) || ""}
                        className="px-4 py-1"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className="font-semibold ">Người sửa</label>
                      <input
                        type="text"
                        value={dataView?.NguoiSuaCuoi || ""}
                        className="px-4 py-1 truncate"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <label className="font-semibold ">Vào lúc</label>
                      <input
                        type="text"
                        value={
                          formatDateTime(dataView?.NgaySuaCuoi, true) || ""
                        }
                        className="px-4 py-1"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {dataView?.Barcodes?.length !== 0 && (
                  <div className="shadow-custom p-2 rounded-lg m-1 flex flex-col gap-2 max-h-[20rem] overflow-y-auto">
                    <table className="barcodeList ">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th>Ngưng dùng</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {dataView?.Barcodes?.map((barcode, index) => (
                          <tr key={index}>
                            <td>
                              <div className="max-w-[30rem]">
                                <p className="block truncate">
                                  {barcode.MaVach}
                                </p>
                              </div>
                            </td>
                            <td>
                              <Checkbox checked={barcode.NA}></Checkbox>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {dataView?.LapRap == true && (
                  <div className="shadow-custom p-2 rounded-lg m-1 flex flex-col gap-2">
                    <div className="text-base text-slate-600 font-bold uppercase flex">
                      Chi Tiết Hàng
                    </div>
                    <div className="max-h-[20rem] overflow-y-auto">
                      <table className="barcodeList max-h-[2rem] overflow-y-auto">
                        <thead>
                          <tr>
                            <th>Tên Hàng</th>
                            <th>ĐVT</th>
                            <th>Số Lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataView?.HangHoa_CTs.map((item) => (
                            <tr key={item.MaHangChiTiet}>
                              <td>
                                <div title={item.TenHangChiTiet}>
                                  <p className="block truncate w-[25rem]">
                                    {item.TenHangChiTiet}
                                  </p>
                                </div>
                              </td>
                              <td>{item.DVTChiTiet}</td>
                              <td>
                                <div className="">{item.SoLuong}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {type == "create" && (
          <div className="flex flex-col min-w-[90rem]">
            <div>
              <div>
                <div className="flex justify-end ">
                  <IoMdClose
                    className="w-6 h-6 rounded-full border-current cursor-pointer hover:bg-slate-200 hover:text-red-500"
                    onClick={close}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center font-bold text-xl">
                <p className="text-blue-700">TẠO SẢN PHẨM MỚI</p>
              </div>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-2">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4 p-4">
                  <div className="grid grid-cols-5 gap-4 items-center justify-center">
                    <div className="col-span-2 flex items-center gap-1">
                      <label className="font-semibold flex">
                        <p className="required">Nhóm</p>
                      </label>
                      <select
                        type="text"
                        name="Nhom"
                        value={hangHoaForm.Nhom || ""}
                        className="py-1.5"
                        onChange={(e) => {
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          });
                        }}
                        required
                      >
                        <option value="" disabled hidden></option>
                        {nhomHang?.map((item) => (
                          <option key={item.Ma} value={item.Ma}>
                            {item.ThongTinNhomHang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 font-semibold"
                        id="TonKho"
                        checked={hangHoaForm.TonKho}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: e.target.checked || !hangHoaForm.LapRap,
                          })
                        }
                      >
                        Tồn kho
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 font-semibold"
                        id="LapRap"
                        checked={hangHoaForm.LapRap}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: !e.target.checked || !hangHoaForm.LapRap,
                            [e.target.id]: e.target.checked,
                          })
                        }
                      >
                        Lắp ráp
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 font-semibold"
                        id="NA"
                        checked={hangHoaForm.NA}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.id]: e.target.checked,
                          })
                        }
                      >
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <label className="font-semibold flex">
                      <p className="whitespace-nowrap  required">Tên hàng</p>{" "}
                    </label>
                    <input
                      type="text"
                      className="px-4 py-1"
                      name="TenHang"
                      value={hangHoaForm.TenHang || ""}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="font-semibold flex">
                        <p className="whitespace-nowrap required">
                          Đơn vị tính
                        </p>
                      </label>
                      <select
                        name="DVTKho"
                        value={hangHoaForm.DVTKho || ""}
                        className="py-1.5"
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled hidden></option>
                        {dVTQuyDoi?.map((item) => (
                          <option key={item.DVT} value={item.DVT}>
                            {item.DVT}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="font-semibold flex">
                        <p>x</p>
                      </label>
                      <input
                        type="text"
                        className="px-4 py-1"
                        name="TyLeQuyDoi"
                        value={hangHoaForm.TyLeQuyDoi || ""}
                        onChange={(e) => {
                          const tyLeQuyDoiValue = e.target.value;
                          if (!isNaN(tyLeQuyDoiValue)) {
                            setHangHoaForm({
                              ...hangHoaForm,
                              [e.target.name]: tyLeQuyDoiValue,
                            });
                            if (tyLeQuyDoiValue == 1) {
                              setHangHoaForm((prev) => ({
                                ...prev,
                                DVTQuyDoi: prev.DVTKho,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex col-span-2 items-center gap-1">
                      <label className="font-semibold flex">
                        <p className="whitespace-nowrap required">
                          Đơn vị quy đổi
                        </p>
                      </label>
                      <select
                        id="DVTQuyDoi"
                        value={hangHoaForm.DVTQuyDoi || ""}
                        className="py-1.5"
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.id]: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled hidden></option>
                        {dVTKho?.map((item) => (
                          <option key={item.DVT} value={item.DVT}>
                            {item.DVT}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 ">
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="font-semibold flex">
                        <p className="whitespace-nowrap required">Mã vạch</p>{" "}
                      </label>
                      <input
                        type="text"
                        className="px-4 py-1"
                        name="MaVach"
                        value={hangHoaForm.MaVach || ""}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="font-semibold flex">
                      <p className="whitespace-nowrap">Diễn giải hàng</p>{" "}
                    </label>
                    <input
                      type="text"
                      className="px-4 py-1"
                      name="DienGiaiHangHoa"
                      value={hangHoaForm.DienGiaiHangHoa || ""}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="font-semibold flex">
                      <p className="whitespace-nowrap">Ghi chú</p>{" "}
                    </label>
                    <textarea
                      type="text"
                      className="px-4 py-1"
                      name="GhiChu"
                      value={hangHoaForm.GhiChu || ""}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="shadow-custom p-2 rounded-lg m-1 flex flex-col gap-2">
                    <table className="barcodeList ">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th>Ngưng dùng</th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hangHoaForm?.Barcodes?.map((barcode, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                value={barcode.MaVach}
                                onChange={(e) =>
                                  handleBarcodeChange(
                                    index,
                                    "MaVach",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Checkbox
                                checked={barcode.NA}
                                onChange={(e) =>
                                  handleBarcodeChange(
                                    index,
                                    "NA",
                                    e.target.checked
                                  )
                                }
                              ></Checkbox>
                            </td>
                            <td>
                              <div onClick={() => removeBarcode(index)}>
                                <IoMdClose className="w-6 h-6 hover:text-red-500" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end">
                      <button
                        className="bg-blue-500 rounded-lg py-1 px-2 font-semibold text-slate-50 shadow-custom hover:text-blue-500 hover:bg-white"
                        type="button"
                        onClick={addBarcodeRow}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                  {hangHoaForm.LapRap == true && (
                    <div className="shadow-custom p-2 rounded-lg m-1 flex flex-col gap-2">
                      <table className="barcodeList">
                        <thead>
                          <tr>
                            <th>Tên Hàng</th>
                            <th>ĐVT</th>
                            <th>Số Lượng</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {hangHoaForm?.HangHoa_CTs?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="px-4">
                                  <select
                                    value={item.MaHangChiTiet}
                                    onChange={(e) =>
                                      handleChangeHHCT(
                                        index,
                                        "MaHangChiTiet",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="" disabled hidden>
                                      Chọn tên hàng
                                    </option>
                                    {HangHoaCT?.map((hangHoa) => (
                                      <>
                                        <option
                                          key={hangHoa.TenHang}
                                          value={hangHoa.MaHang}
                                          className="flex items-center"
                                        >
                                          {hangHoa.MaHang} - {hangHoa.TenHang}
                                        </option>
                                      </>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td>{item.DVT_CTs}</td>
                              <td>
                                <input
                                  type="number"
                                  value={roundNumber(item.SoLuong)}
                                  min={1}
                                  onChange={(e) =>
                                    handleChangeHHCT(
                                      index,
                                      "SoLuong",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <div
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    removeHangHoaCT(x.MaHangChiTiet)
                                  }
                                >
                                  X
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex justify-end">
                        <button
                          className="bg-blue-500 rounded-lg py-1 px-2 font-semibold text-slate-50 shadow-custom hover:text-blue-500 hover:bg-white"
                          type="button"
                          onClick={addHangHoaCT}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="bg-blue-500 px-2 py-2 text-slate-50 font-bold shadow-md rounded-md cursor-pointer hover:bg-white hover:text-blue-500"
                  type="submit"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        )}
        {type == "edit" && (
          <div className="flex flex-col min-w-[90rem]">
            <div>
              <div className="flex justify-end">
                <IoMdClose
                  className="w-6 h-6 rounded-full border-current cursor-pointer hover:bg-slate-200 hover:text-red-500"
                  onClick={close}
                />
              </div>
              <div className="flex justify-center items-center font-bold text-xl gap-1">
                <p className="text-blue-700 uppercase">Cập nhật sản phẩm</p>
                <p className="text-red-700 uppercase">{getMaHang?.TenHang}</p>
              </div>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-2">
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4 p-4">
                  <div className="grid grid-cols-5 gap-4 items-center justify-center">
                    <div className="col-span-2 flex items-center gap-1">
                      <label className="font-semibold flex">
                        <p>Nhóm</p> <p className="text-red-500">*</p>
                      </label>
                      <select
                        type="text"
                        name="Nhom"
                        value={hangHoaForm.Nhom}
                        className="py-1.5"
                        onChange={(e) => {
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          });
                        }}
                        required
                      >
                        <option value="" disabled hidden></option>
                        {nhomHang?.map((item) => (
                          <option key={item.Ma} value={item.Ma}>
                            {item.ThongTinNhomHang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 font-semibold"
                        id="TonKho"
                        checked={hangHoaForm.TonKho}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: e.target.checked || !hangHoaForm.LapRap,
                          })
                        }
                      >
                        Tồn kho
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 font-semibold"
                        id="LapRap"
                        checked={hangHoaForm.LapRap}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            TonKho: !e.target.checked || !hangHoaForm.LapRap,
                            [e.target.id]: e.target.checked,
                          })
                        }
                      >
                        Lắp ráp
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        className="py-1.5 font-semibold"
                        id="NA"
                        checked={hangHoaForm.NA}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.id]: e.target.checked,
                          })
                        }
                      >
                        Ngưng dùng
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <label className="font-semibold flex">
                      <p className="whitespace-nowrap">Tên hàng</p>{" "}
                      <p className="text-red-500">*</p>
                    </label>
                    <input
                      type="text"
                      className="px-4 py-1"
                      name="TenHang"
                      value={hangHoaForm.TenHang || ""}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="font-semibold flex">
                        <p className="whitespace-nowrap">Đơn vị tính</p>
                        <p className="text-red-500">*</p>
                      </label>
                      <select
                        name="DVTKho"
                        value={hangHoaForm.DVTKho || ""}
                        className="py-1.5"
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled hidden></option>
                        {dVTQuyDoi?.map((item) => (
                          <option key={item.DVT} value={item.DVT}>
                            {item.DVT}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="font-semibold flex">
                        <p>x</p>
                      </label>
                      <input
                        type="text"
                        className="px-4 py-1"
                        name="TyLeQuyDoi"
                        value={hangHoaForm.TyLeQuyDoi || ""}
                        onChange={(e) => {
                          const tyLeQuyDoiValue = e.target.value;
                          if (!isNaN(tyLeQuyDoiValue)) {
                            setHangHoaForm({
                              ...hangHoaForm,
                              [e.target.name]: tyLeQuyDoiValue,
                            });

                            // Check if TyLeQuyDoi is less than 10
                            if (tyLeQuyDoiValue < 10) {
                              // Update DVTKho value to match DVTQuyDoi
                              setHangHoaForm((prev) => ({
                                ...prev,
                                DVTQuyDoi: prev.DVTKho,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex col-span-2 items-center gap-1">
                      <label className="font-semibold flex">
                        <p className="whitespace-nowrap">Đơn vị quy đổi</p>
                        <p className="text-red-500">*</p>
                      </label>
                      <select
                        id="DVTQuyDoi"
                        value={hangHoaForm.DVTQuyDoi || ""}
                        className="py-1.5"
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.id]: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled hidden></option>
                        {dVTKho?.map((item) => (
                          <option key={item.DVT} value={item.DVT}>
                            {item.DVT}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 ">
                    <div className="flex col-span-2 gap-1 items-center">
                      <label className="font-semibold flex">
                        <p className="whitespace-nowrap">Mã vạch</p>{" "}
                        <p className="text-red-500">*</p>
                      </label>{" "}
                      <input
                        type="text"
                        className="px-4 py-1"
                        name="MaVach"
                        value={hangHoaForm.MaVach || ""}
                        onChange={(e) =>
                          setHangHoaForm({
                            ...hangHoaForm,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="font-semibold flex">
                      <p className="whitespace-nowrap">Diễn giải hàng</p>{" "}
                    </label>
                    <input
                      type="text"
                      className="px-4 py-1"
                      name="DienGiaiHangHoa"
                      value={hangHoaForm.DienGiaiHangHoa || ""}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex col-span-2 gap-1 items-center">
                    <label className="font-semibold flex">
                      <p className="whitespace-nowrap">Ghi chú</p>{" "}
                    </label>
                    <textarea
                      type="text"
                      className="px-4 py-1"
                      name="GhiChu"
                      value={hangHoaForm.GhiChu || ""}
                      onChange={(e) =>
                        setHangHoaForm({
                          ...hangHoaForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="shadow-custom p-2 rounded-lg m-1 flex flex-col gap-2">
                    <table className="barcodeList">
                      <thead>
                        <tr>
                          <th>Mã vạch</th>
                          <th>Ngưng dùng</th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView?.Barcodes?.map((item, index) => (
                          <tr key={index}>
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={item.MaVach}
                                  onChange={(e) =>
                                    handleBarcodeChange(
                                      index,
                                      "MaVach",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <Checkbox
                                  checked={item.NA}
                                  onChange={(e) =>
                                    handleBarcodeChange(
                                      index,
                                      "NA",
                                      e.target.checked
                                    )
                                  }
                                ></Checkbox>
                              </td>
                              <td>
                                <div onClick={() => removeBarcode(index)}>
                                  <IoMdClose className="w-6 h-6 hover:text-red-500" />
                                </div>
                              </td>
                            </>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end">
                      <button
                        className="bg-blue-500 rounded-lg py-1 px-2 font-semibold text-slate-50 shadow-custom hover:text-blue-500 hover:bg-white"
                        type="button"
                        onClick={addBarcodeRow}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                  {hangHoaForm.LapRap == true && (
                    <div className="shadow-custom p-2 rounded-lg m-1 flex flex-col gap-2">
                      <table className="barcodeList">
                        <thead>
                          <tr>
                            <th>Tên Hàng</th>
                            <th>ĐVT</th>
                            <th>Số Lượng</th>
                            <th></th>
                          </tr>
                        </thead>
                        {dataView?.HangHoa_CTs?.map((item, index) => (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <div className="px-4">
                                  <select
                                    value={item.MaHangChiTiet}
                                    onChange={(e) =>
                                      handleChangeHHCT(
                                        index,
                                        "MaHangChiTiet",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="" disabled hidden>
                                      Chọn tên hàng
                                    </option>
                                    {HangHoaCT?.map((hangHoa) => (
                                      <>
                                        <option
                                          key={hangHoa.TenHang}
                                          value={hangHoa.MaHang}
                                          className="flex items-center"
                                        >
                                          {hangHoa.MaHang} - {hangHoa.TenHang}
                                        </option>
                                      </>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td>{item.DVTChiTiet}</td>
                              <td>
                                <input
                                  type="number"
                                  value={roundNumber(item.SoLuong)}
                                  min={1}
                                  onChange={(e) =>
                                    handleChangeHHCT(
                                      index,
                                      "SoLuong",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <div
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={removeHangHoaCT}
                                >
                                  X
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                      <div className="flex justify-end">
                        <button
                          className="bg-blue-500 rounded-lg py-1 px-2 font-semibold text-slate-50 shadow-custom hover:text-blue-500 hover:bg-white"
                          type="button"
                          onClick={addHangHoaCT}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="bg-blue-500 px-2 py-2 text-slate-50 font-bold shadow-md rounded-md cursor-pointer hover:bg-slate-50 hover:text-blue-500"
                  type="submit"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        )}
        {type == "delete" && (
          <div className="flex flex-col justify-between gap-8  ">
            <div>
              <div onClick={close} className="flex justify-end ">
                <IoMdClose className="w-6 h-6 rounded-full border-current hover:bg-slate-200 hover:text-red-500" />
              </div>
              <div className="flex justify-center items-center font-bold text-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    <p className="text-blue-700 uppercase">
                      Bạn có chắc muốn xóa
                    </p>
                    <p className="text-red-600">{getMaHang.TenHang}</p>
                    <p className="text-blue-700 uppercase">?</p>
                  </div>
                  <p className="text-slate-500 text-lg font-light">
                    Thông tin sản phẩm sẽ mất đi nếu bạn xóa !
                  </p>
                </div>
                <div></div>
              </div>
            </div>
            <div className="flex justify-end px-8">
              <div
                className="bg-blue-600 px-6 py-1 text-white rounded-lg font-bold cursor-pointer "
                onClick={handleDelete}
              >
                OK
              </div>
            </div>
          </div>
        )}
        {type == "status" && (
          <div className="flex flex-col gap-2 ">
            <div>
              <div className="flex justify-end ">
                <IoMdClose
                  className="w-6 h-6 rounded-full border-current hover:bg-slate-200 hover:text-red-500"
                  onClick={close}
                />
              </div>
              <div className="flex gap-2 justify-center items-center font-semibold text-lg">
                <p className="text-blue-700">Đổi Trạng Thái</p>
              </div>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleStatus}>
              <div className="flex justify-center items-center gap-4">
                <div className="col-span-2">
                  <div className="required">Chọn mã hàng</div>
                  <Select
                    mode="multiple"
                    maxTagCount={2}
                    allowClear
                    filterOption
                    placeholder="Chọn mã hàng"
                    value={selectedMaHang}
                    onChange={(value) => setSelectedMaHang(value)}
                    style={{
                      width: "350px",
                    }}
                  >
                    {getDataHangHoa?.map((item, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={item.MaHang}
                          title={item.TenHang}
                        >
                          <p> {item.MaHang}</p>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <div className="required">Trạng thái</div>
                  <Space wrap>
                    <Select
                      placeholder="Chọn trạng thái"
                      required
                      style={{
                        width: 170,
                      }}
                      value={selectedStatus}
                      onChange={(value) => setSelectedStatus(value)}
                      options={[
                        {
                          value: "1",
                          label: "Sử dụng",
                        },
                        {
                          value: "0",
                          label: "Ngưng sử dụng",
                        },
                        {
                          value: "2",
                          label: "Ngược trạng thái",
                        },
                      ]}
                    />
                  </Space>
                </div>
              </div>
              <div className="flex justify-end " type="submit">
                <button className="bg-blue-600 px-2 py-2 font-medium rounded-lg text-white shadow-custom   z-50">
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        )}
        {type == "group" && (
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex justify-end ">
                <IoMdClose
                  className="w-6 h-6 rounded-full border-current hover:bg-slate-200 hover:text-red-500"
                  onClick={close}
                />
              </div>
              <div className="flex gap-2 justify-center items-center font-semibold text-lg">
                <p className="text-blue-700">Đổi Nhóm</p>
              </div>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleGroup}>
              <div className="flex justify-center items-center gap-2">
                <div className="col-span-2">
                  <div className="required">Chọn mã hàng</div>
                  <Select
                    mode="multiple"
                    maxTagCount={2}
                    allowClear
                    filterOption
                    placeholder="Chọn mã hàng"
                    value={selectedMaHang}
                    onChange={(value) => setSelectedMaHang(value)}
                    style={{
                      width: "350px",
                    }}
                  >
                    {getDataHangHoa?.map((item, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={item.MaHang}
                          title={item.TenHang}
                        >
                          <p> {item.MaHang}</p>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <div className="required">Chọn Nhóm</div>
                  <Select
                    placeholder="Chọn Nhóm"
                    filterOption
                    required
                    style={{
                      width: 250,
                    }}
                    value={selectedGroup}
                    onChange={(value) => setSelectedGroup(value)}
                  >
                    {nhomHang?.map((item, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={item.Ma}
                          title={item.Ten}
                        >
                          <p className="truncate"> {item.ThongTinNhomHang}</p>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="flex justify-end " type="submit">
                <button className="bg-blue-600 px-2 py-2 font-medium rounded-lg text-white shadow-custom   z-50">
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        )}
        {type == "print" && (
          <div className="flex flex-col gap-4 min-w-[25rem]">
            <div>
              <div className="flex justify-end ">
                <IoMdClose
                  className="w-6 h-6 rounded-full border-current hover:bg-slate-200 hover:text-red-500"
                  onClick={close}
                />
              </div>
              <div className="flex gap-2 justify-center items-center font-semibold text-lg">
                <p className="text-blue-700 text-xl font-semibold">
                  In Mã Vạch
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center ">
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
                    value={selectednhomFrom}
                    onChange={(value) => setSelectednhomFrom(value)}
                    style={{
                      width: "200px",
                    }}
                  >
                    {nhomHang?.map((item, index) => {
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
                    value={selectednhomTo}
                    onChange={(value) => setSelectednhomTo(value)}
                    style={{
                      width: "200px",
                    }}
                  >
                    {nhomHang?.map((item, index) => {
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
                    value={selectednhomList}
                    onChange={(value) => setSelectednhomList(value)}
                    style={{
                      width: "390px",
                    }}
                  >
                    {nhomHang?.map((item) => {
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
                    value={selectedBarCodeFrom}
                    onChange={(value) => setSelectedBarCodeFrom(value)}
                    style={{
                      width: "200px",
                    }}
                  >
                    {getDataHangHoa?.map((item, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={item.MaHang}
                          title={item.TenHang}
                        >
                          <p className="truncate">{item.MaHang}</p>
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
                    value={selectedBarCodeTo}
                    onChange={(value) => setSelectedBarCodeTo(value)}
                    style={{
                      width: "200px",
                    }}
                  >
                    {getDataHangHoa?.map((item, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={item.MaHang}
                          title={item.TenHang}
                        >
                          <p className="truncate">{item.MaHang}</p>
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
                    placeholder="Chọn mã hàng"
                    value={selectedBarCodeList}
                    onChange={(value) => setSelectedBarCodeList(value)}
                    style={{
                      width: "370px",
                    }}
                  >
                    {getDataHangHoa?.map((item, index) => {
                      return (
                        <Select.Option
                          key={index}
                          value={item.MaHang}
                          title={item.TenHang}
                        >
                          <p className="truncate">{item.MaHang}</p>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="gap-1 flex items-center">
                <label className="required">Số tem</label>
                <input
                  type="number"
                  min={1}
                  value={selectedTem || ""}
                  onChange={(e) => setSelectedTem(e.target.value)}
                  className="border-slate-200 py-1 px-2 w-24"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end px-2">
              <button
                className="bg-blue-600 p-2 font-medium rounded-lg text-white shadow-custom z-50"
                onClick={handlePrintBar}
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HangHoaModals;
