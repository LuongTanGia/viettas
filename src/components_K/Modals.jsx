/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import icons from "../untils/icons";
import * as apis from "../apis";
import { Table, Form } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import ModalHH from "./ModalHH";
import { toast } from "react-toastify";
import { DatePicker, Space } from "antd";
import { CreateRow, EditRow } from ".";
import { base64ToPDF, keyDown, roundNumber } from "../action/Actions";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ModalOnlyPrint from "./ModalOnlyPrint";
import ModalOnlyPrintWareHouse from "./ModalOnlyPrintWareHouse";

const { RangePicker } = DatePicker;

const { IoMdClose, MdDelete, TiPrinter } = icons;
const Modals = ({
  close,
  actionType,
  dataThongTin,
  dataKhoHang,
  dataDoiTuong,
  dataRecord,
  dataPMH,
  controlDate,
  isLoadingModel,
}) => {
  const [isShowModalHH, setIsShowModalHH] = useState(false);
  const [isShowModalOnlyPrint, setIsShowModalOnlyPrint] = useState(false);
  const [isShowModalOnlyPrintWareHouse, setIsShowModalOnlyPrintWareHouse] =
    useState(false);
  const [form] = Form.useForm();
  const [isValidDate, setIsValidDate] = useState(true);
  const [dataHangHoa, setDataHangHoa] = useState(null);
  const [selectedKhoHang, setSelectedKhoHang] = useState();
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [selectedDoiTuong, setSelectedDoiTuong] = useState();
  const [doiTuongInfo, setDoiTuongInfo] = useState({ Ten: "", DiaChi: "" });
  const [selectedSctBD, setSelectedSctBD] = useState();
  const [selectedSctKT, setSelectedSctKT] = useState();
  const [newDataPMH, setNewDataPMH] = useState(dataPMH);
  const currentRowData = useCallback(
    (mahang) => {
      return selectedRowData
        .map((item) => item.MaHang)
        .filter((item) => item !== "" && item !== mahang);
    },
    [selectedRowData]
  );

  const isAdd = useMemo(
    () => selectedRowData.map((item) => item.MaHang).includes(""),
    [selectedRowData]
  );

  const startDate = dayjs(controlDate.NgayBatDau).format("YYYY-MM-DDTHH:mm:ss");
  const endDate = dayjs(controlDate.NgayKetThuc).format("YYYY-MM-DDTHH:mm:ss");
  const NgayCTu = dayjs().format("YYYY-MM-DDTHH:mm:ss");
  const DaoHan = dayjs().format("YYYY-MM-DDTHH:mm:ss");

  const [formPMH, setFormPMH] = useState({
    NgayCTu: NgayCTu,
    DaoHan: DaoHan,
    TenDoiTuong: "",
    DiaChi: "",
    MaSoThue: "",
    TTTienMat: false,
    GhiChu: null,
    DataDetails: [
      // {
      //   STT: 1,
      //   MaHang: "",
      //   TenHang: "",
      //   DVT: "",
      //   SoLuong: 0,
      //   DonGia: 0,
      //   TienHang: 0,
      //   TyLeThue: 0,
      //   TienThue: 0,
      //   ThanhTien: 0,
      //   TyLeCKTT: 0,
      //   TienCKTT: 0,
      //   TongCong: 0,
      // },
    ],
  });

  const [formPMHEdit, setFormPMHEdit] = useState();
  const [formPrint, setFormPrint] = useState({
    NgayBatDau: startDate,
    NgayKetThuc: endDate,
  });

  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: true,
    checkbox2: false,
    checkbox3: false,
  });

  useEffect(() => {
    handleAddInList();
  }, [selectedKhoHang]);

  useEffect(() => {
    if (dataThongTin !== null) setFormPMHEdit(dataThongTin);
  }, [dataThongTin, dataThongTin.DataDetails]);

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: 60,
      hight: 10,
      fixed: "left",
      align: "center",
    },
    {
      title: "Mã hàng",
      dataIndex: "MaHang",
      key: "MaHang",
      width: 150,
      fixed: "left",
      sorter: true,
      editable: true,
    },
    {
      title: "Tên Hàng",
      dataIndex: "TenHang",
      key: "TenHang",
      width: 150,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "DVT",
      key: "DVT",
      width: 150,
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "SoLuong",
      key: "SoLuong",
      width: 150,
      render: (text) => roundNumber(text),
      align: "end",
    },
    {
      title: "Đơn giá",
      dataIndex: "DonGia",
      key: "DonGia",
      width: 150,
      align: "end",
      render: (text) => (
        <NumericFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    {
      title: "Tiền hàng",
      dataIndex: "TienHang",
      key: "TienHang",
      width: 150,
      align: "end",
      render: (text) => (
        <NumericFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    {
      title: "% thuế",
      dataIndex: "TyLeThue",
      key: "TyLeThue",
      width: 150,
      align: "center",
    },
    {
      title: "Tiền thuế",
      dataIndex: "TienThue",
      key: "TienThue",
      width: 150,
      align: "center",
    },
    {
      title: "Thành tiền",
      dataIndex: "ThanhTien",
      key: "ThanhTien",
      width: 150,
      align: "end",
      fixed: "right",
      render: (text) => (
        <NumericFormat
          value={text}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
  ];

  const title = [
    "STT",
    "Mã hàng",
    "Tên hàng",
    "DVT",
    "Số lượng",
    "Đơn giá",
    "Tiền hàng",
    "% Thuế",
    "Tiền thuế",
    "Thành tiền",
    "",
  ];

  useEffect(() => {
    setFormPMH((prevFormPMH) => ({
      ...prevFormPMH,
      DataDetails: selectedRowData.map((item, index) => {
        // Đảm bảo rằng item.DonGia là một chuỗi hợp lệ
        const donGiaString =
          item.DonGia && typeof item.DonGia === "string" ? item.DonGia : "0";
        // const TyLeThueString =
        //   item.DonGia && typeof item.TyLeThue === "string" ? item.TyLeThue : "0";
        // Loại bỏ dấu phẩy và chuyển đổi thành số
        const donGiaNumber = parseFloat(donGiaString.replace(/,/g, "")) || 0;
        // const ThueNumber = parseFloat(TyLeThueString.replace(/,/g, "")) || 0;

        const tienHang = Number(item.SoLuong) * Number(donGiaNumber);
        const tienThue = Number(tienHang) * (Number(item.TyLeThue) / 100);
        const thanhTien = Number(tienHang) + Number(tienThue);
        const tongCong = Number(thanhTien);

        return {
          STT: index + 1,
          MaHang: item.MaHang,
          TenHang: item.TenHang,
          DVT: item.DVT,
          SoLuong: item.SoLuong,
          DonGia: donGiaNumber,
          TienHang: tienHang,
          TyLeThue: Number(item.TyLeThue),
          TienThue: tienThue,
          ThanhTien: thanhTien,
          TyLeCKTT: 0,
          TienCKTT: 0,
          TongCong: tongCong,
        };
      }),
    }));
  }, [selectedRowData]);

  useEffect(() => {
    if (dataDoiTuong && actionType === "create")
      handleDoiTuongFocus(dataDoiTuong[0].Ma);
    if (dataDoiTuong && dataThongTin && actionType === "edit") {
      handleDoiTuongFocus(dataThongTin.MaDoiTuong);

      if (dataThongTin?.DataDetails) {
        setSelectedRowData([...dataThongTin.DataDetails]);
      }
      // if (dataThongTin?.DataDetails) {
      //   setSelectedRowData([
      //     {
      //       ...dataThongTin.DataDetails,
      //       DVTDefault: dataHangHoa?.DVT,
      //       DVTQuyDoi: dataHangHoa?.DVTQuyDoi,
      //     },
      //   ]);
      // }
    }
  }, [dataDoiTuong, dataThongTin]);

  useEffect(() => {
    if (dataKhoHang && dataThongTin && actionType === "edit") {
      setSelectedKhoHang(dataThongTin.MaKho);
    } else if (dataKhoHang && dataThongTin && actionType !== "edit") {
      setSelectedKhoHang(dataKhoHang[0].MaKho);
    }
  }, [dataKhoHang, dataThongTin]);

  useEffect(() => {
    if (dataPMH) setSelectedSctBD(dataPMH[0].SoChungTu);
    if (dataPMH) setSelectedSctKT(dataPMH[0].SoChungTu);
  }, [dataPMH]);

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

  const handleAddInList = async () => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const response = await apis.ListHelperHH(tokenLogin, selectedKhoHang);

      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        setDataHangHoa(response.data.DataResults);
      }
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handleAddRow = (newRow) => {
    let dataNewRow;
    setSelectedRowData((prevData) => {
      if (prevData.some((item) => item.MaHang === newRow.MaHang))
        dataNewRow = prevData.map((item) => {
          if (item.MaHang === newRow.MaHang) {
            return {
              ...item,
              SoLuong: ++item.SoLuong,
            };
          }
          return item;
        });
      else dataNewRow = [...prevData, { ...newRow, DVTDefault: newRow.DVT }];
      return dataNewRow;
    });

    setFormPMHEdit((prev) => ({ ...prev, DataDetails: dataNewRow }));
  };

  const handleAddEmptyRow = () => {
    if (selectedRowData.map((item) => item.MaHang).includes("")) return;

    let emptyRow = {
      SoChungTu: "",
      MaHang: "",
      TenHang: "",
      DVT: "",
      SoLuong: 1,
      DonGia: 0,
      TyLeThue: 0,
      TienThue: 0,
      ThanhTien: 0,
    };

    setSelectedRowData((prevData) => [...prevData, emptyRow]);
    setFormPMHEdit((prev) => ({ ...prev, DataDetails: emptyRow }));
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...selectedRowData];
    updatedRows.splice(index, 1);
    setSelectedRowData(updatedRows);
    setFormPMHEdit((prev) => ({ ...prev, DataDetails: updatedRows }));
  };

  const handleDoiTuongFocus = (selectedValue) => {
    setSelectedDoiTuong(selectedValue);

    // Tìm thông tin đối tượng tương ứng và cập nhật state
    const selectedDoiTuongInfo = dataDoiTuong.find(
      (item) => item.Ma === selectedValue
    );
    setDoiTuongInfo(selectedDoiTuongInfo || { Ten: "", DiaChi: "" });
    setFormPMH({
      ...formPMH,
      TenDoiTuong: selectedDoiTuongInfo.Ten,
      DiaChi: selectedDoiTuongInfo.DiaChi,
    });
    setFormPMHEdit({
      ...formPMHEdit,
      TenDoiTuong: selectedDoiTuongInfo.Ten,
      DiaChi: selectedDoiTuongInfo.DiaChi,
    });
  };

  const handleCreate = async () => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const response = await apis.ThemPMH(
        tokenLogin,
        formPMH,
        selectedDoiTuong,
        selectedKhoHang
      );
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription);
        window.location.reload();
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription);
      } else if (
        (response.data && response.data.DataError === -1) ||
        response.data.DataError === -2 ||
        response.data.DataError === -3
      ) {
        toast.warning(response.data.DataErrorDescription);
      } else {
        toast.error(response.data.DataErrorDescription);
      }

      close();
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handleEdit = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const response = await apis.SuaPMH(
        tokenLogin,
        dataRecord.SoChungTu,
        formPMHEdit,
        selectedDoiTuong,
        selectedKhoHang
      );

      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription);
        window.location.reload();
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription);
      } else if (
        (response.data && response.data.DataError === -1) ||
        response.data.DataError === -2 ||
        response.data.DataError === -3
      ) {
        toast.warning(response.data.DataErrorDescription);
      } else {
        toast.error(response.data.DataErrorDescription);
      }

      close();
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const response = await apis.XoaPMH(tokenLogin, dataRecord.SoChungTu);
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription);
        window.location.reload();
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription);
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription);
      } else if (
        (response.data && response.data.DataError === -1) ||
        response.data.DataError === -2 ||
        response.data.DataError === -3
      ) {
        toast.warning(response.data.DataErrorDescription);
      } else {
        toast.error(response.data.DataErrorDescription);
      }
      close();
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handlePrint = async () => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const lien = calculateTotal();
      const response = await apis.InPMH(
        tokenLogin,
        formPrint,
        selectedSctBD,
        selectedSctKT,
        lien
      );
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults);
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription);
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription);
      } else if (
        (response.data && response.data.DataError === -1) ||
        response.data.DataError === -2 ||
        response.data.DataError === -3
      ) {
        toast.warning(response.data.DataErrorDescription);
      } else {
        toast.error(response.data.DataErrorDescription);
      }

      close();
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handlePrintWareHouse = async () => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const lien = calculateTotal();

      const response = await apis.InPK(
        tokenLogin,
        formPrint,
        selectedSctBD,
        selectedSctKT,
        lien
      );
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        base64ToPDF(response.data.DataResults);
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription);
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription);
      } else if (
        (response.data && response.data.DataError === -1) ||
        response.data.DataError === -2 ||
        response.data.DataError === -3
      ) {
        toast.warning(response.data.DataErrorDescription);
      } else {
        toast.error(response.data.DataErrorDescription);
      }

      close();
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handlePay = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem("TKN");
      const response = await apis.LapPhieuChi(tokenLogin, dataRecord.SoChungTu);
      // Kiểm tra call api thành công
      if (response.data && response.data.DataError === 0) {
        toast.success(response.data.DataErrorDescription);
        window.location.reload();
      } else if (response.data && response.data.DataError === -104) {
        toast.error(response.data.DataErrorDescription);
      } else if (response.data && response.data.DataError === -103) {
        toast.error(response.data.DataErrorDescription);
      } else if (
        (response.data && response.data.DataError === -1) ||
        response.data.DataError === -2 ||
        response.data.DataError === -3
      ) {
        toast.warning(response.data.DataErrorDescription);
      } else {
        toast.error(response.data.DataErrorDescription);
      }
      close();
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };
  const calculateTotal = () => {
    let total = 0;
    if (checkboxValues.checkbox1) total += 1;
    if (checkboxValues.checkbox2) total += 2;
    if (checkboxValues.checkbox3) total += 4;
    return total;
  };

  const handleLien = (checkboxName) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkboxName]: !prevValues[checkboxName],
    }));
  };

  const handleTienMat = () => {
    setFormPMH({ ...formPMH, TTTienMat: !formPMH.TTTienMat });
  };

  const handleFilterPrint = () => {
    const ngayBD = dayjs(formPrint.NgayBatDau);
    const ngayKT = dayjs(formPrint.NgayKetThuc);
    // Lọc hàng hóa dựa trên ngày bắt đầu và ngày kết thúc
    const filteredData = dataPMH.filter((item) => {
      const itemDate = dayjs(item.NgayCTu);

      if (ngayBD.isValid() && ngayKT.isValid()) {
        return itemDate >= ngayBD && itemDate <= ngayKT;
      }
    });
    setNewDataPMH(filteredData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center zIndex">
      <div className="  m-6 p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        {actionType === "delete" && (
          <div className=" flex justify-between items-center ">
            <label>
              Bạn có chắc muốn xóa phiếu
              <span className="font-bold mx-1"> {dataRecord.SoChungTu}</span>
              không ?
            </label>
            <div></div>
          </div>
        )}

        {actionType === "pay" && (
          <div className=" flex justify-between items-center ">
            <label>
              Bạn có chắc muốn lập phiếu chi
              <span className="font-bold mx-1"> {dataRecord.SoChungTu}</span>
              không ?
            </label>
            <div></div>
          </div>
        )}

        {actionType === "print" && (
          <div className="   ">
            <div className="pb-2">In phiếu mua hàng</div>
            <div className="flex justify-center items-center ">
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
                        dayjs(controlDate.NgayBatDau),
                        dayjs(controlDate.NgayKetThuc),
                      ]}
                      onChange={(values) => {
                        setFormPrint({
                          ...formPrint,
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
              <button
                className="border border-blue-500 rounded-md mb-6  mx-2 px-2 py-1 hover:bg-blue-500 hover:text-white"
                onClick={handleFilterPrint}
              >
                Lọc
              </button>
            </div>
            <div className="flex justify-center  gap-x-4 m-2">
              <div className="flex ">
                <label className="px-2">Số chứng từ</label>
                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctBD}
                  onChange={(e) => setSelectedSctBD(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex ">
                <label className="px-2">Đến</label>
                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctKT}
                  onChange={(e) => setSelectedSctKT(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* liên */}
            <div className="flex justify-center items-center gap-6 mt-4">
              <div>
                <input
                  id="lien1"
                  type="checkbox"
                  checked={checkboxValues.checkbox1}
                  onChange={() => handleLien("checkbox1")}
                />
                <label htmlFor="lien1">Liên 1</label>
              </div>

              <div>
                <input
                  id="lien2"
                  type="checkbox"
                  checked={checkboxValues.checkbox2}
                  onChange={() => handleLien("checkbox2")}
                />
                <label htmlFor="lien2">Liên 2</label>
              </div>

              <div>
                <input
                  id="lien3"
                  type="checkbox"
                  checked={checkboxValues.checkbox3}
                  onChange={() => handleLien("checkbox3")}
                />
                <label htmlFor="lien3">Liên 3</label>
              </div>
            </div>
          </div>
        )}

        {actionType === "printWareHouse" && (
          <div className=" ">
            <div>In phiếu kho</div>
            <div className="flex justify-center items-center gap-4">
              <div className="flex justify-center items-center ">
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
                          dayjs(controlDate.NgayBatDau),
                          dayjs(controlDate.NgayKetThuc),
                        ]}
                        onChange={(values) => {
                          setFormPrint({
                            ...formPrint,
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
                <button
                  className="border border-blue-500 rounded-md mb-6  mx-2 px-2 py-1 hover:bg-blue-500 hover:text-white"
                  onClick={handleFilterPrint}
                >
                  Lọc
                </button>
              </div>
            </div>
            <div className="flex justify-center  gap-x-4 m-2">
              <div className="flex ">
                <label className="px-2">Số chứng từ</label>
                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctBD}
                  onChange={(e) => setSelectedSctBD(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex ">
                <label className="px-2">Đến</label>
                <select
                  className=" bg-white border outline-none border-gray-300  "
                  value={selectedSctKT}
                  onChange={(e) => setSelectedSctKT(e.target.value)}
                >
                  {newDataPMH?.map((item) => (
                    <option key={item.SoChungTu} value={item.SoChungTu}>
                      {item.SoChungTu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* liên */}
            <div className="flex justify-center items-center gap-6">
              <div>
                <input
                  id="lien1"
                  type="checkbox"
                  checked={checkboxValues.checkbox1}
                  onChange={() => handleLien("checkbox1")}
                />
                <label htmlFor="lien1">Liên 1</label>
              </div>

              <div>
                <input
                  id="lien2"
                  type="checkbox"
                  checked={checkboxValues.checkbox2}
                  onChange={() => handleLien("checkbox2")}
                />
                <label htmlFor="lien2">Liên 2</label>
              </div>
            </div>
          </div>
        )}

        {actionType === "view" && (
          <div className=" w-[90vw] h-[600px] ">
            <div className="flex justify-between  items-start pb-1">
              <label className="font-bold ">
                Xem thông tin - phiếu mua hàng
              </label>
              <button
                onClick={() => close()}
                className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="border w-full h-[90%] rounded-sm text-sm">
              <div className="flex">
                {/* thong tin phieu */}
                <div className="w-[60%]">
                  <div className="flex p-1 gap-12 w-full ">
                    <div className=" flex items-center gap-2">
                      <label className="">Số chứng từ</label>
                      <input
                        type="text"
                        className=" border border-gray-300 outline-none  px-2"
                        value={dataThongTin?.SoChungTu}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="">Ngày</label>
                      <input
                        type="text"
                        className="border border-gray-300 outline-none px-2 "
                        value={moment(dataThongTin?.NgayCTu).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="">Đáo hạn</label>
                      <input
                        type="text"
                        className="border border-gray-300 outline-none px-2 "
                        value={moment(dataThongTin?.DaoHan).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </div>
                  </div>
                  <div className="p-1 flex justify-between items-center">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>
                    <select className=" bg-white border w-full outline-none border-gray-300  ">
                      <option value="MaDoiTuong_TenDoiTuong">
                        {dataThongTin?.MaDoiTuong} - {dataThongTin?.TenDoiTuong}
                      </option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Tên</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={dataThongTin?.TenDoiTuong}
                    />
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={dataThongTin?.DiaChi}
                    />
                  </div>
                  <div className="flex items-center  w-full">
                    <div className="p-1 flex  items-center w-1/2">
                      <label form="khohang" className="w-[94px]">
                        Kho hàng
                      </label>
                      <select className=" bg-white border w-full  border-gray-300 hover:border-gray-500 ">
                        <option value="ThongTinKho">
                          {dataThongTin?.MaKho} - {dataThongTin?.TenKho}
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center p-1 w-1/2">
                      <label className="w-[86px]">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 outline-none px-2 "
                        value={dataThongTin?.GhiChu}
                      />
                    </div>
                  </div>
                </div>
                {/* thong tin cap nhat */}
                <div className="w-[40%] py-1">
                  <div className="text-center p-2 font-medium">
                    Thông tin cập nhật
                  </div>
                  <div className="border-2 rounded-md w-[98%] h-[80%] ">
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Người tạo</label>
                        <input
                          type="text"
                          className=" border border-gray-300 outline-none px-2"
                          value={dataThongTin?.NguoiTao}
                        />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 outline-none px-2 "
                          value={
                            dataThongTin?.NgayTao &&
                            moment(dataThongTin.NgayTao).isValid()
                              ? moment(dataThongTin.NgayTao).format(
                                  "DD/MM/YYYY hh:mm:ss"
                                )
                              : ""
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center p-1  ">
                        <label className="">Sửa cuối</label>
                        <input
                          type="text"
                          className=" border border-gray-300 outline-none px-2 "
                          value={dataThongTin?.NguoiSuaCuoi}
                        />
                      </div>
                      <div className="flex items-center p-1 w-1/2">
                        <label className="">Lúc</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 outline-none px-2 "
                          value={
                            dataThongTin?.NgaySuaCuoi &&
                            moment(dataThongTin.NgaySuaCuoi).isValid()
                              ? moment(dataThongTin.NgaySuaCuoi).format(
                                  "DD/MM/YYYY hh:mm:ss"
                                )
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* table */}
              <div className="p-4">
                <Table
                  className="table_view"
                  dataSource={dataThongTin?.DataDetails}
                  columns={columns}
                  size="small"
                  scroll={{
                    x: 1000,
                    y: 220,
                  }}
                  bordered
                  pagination={false}
                  // Bảng Tổng
                  // summary={(pageData) => {
                  //   let totalTongCong = 0;
                  //   let totalThanhTien = 0;
                  //   let totalTienHang = 0;
                  //   let totalSoLuong = 0;
                  //   let totalDonGia = 0;

                  //   pageData.forEach(
                  //     ({ TongCong, ThanhTien, TienHang, SoLuong, DonGia }) => {
                  //       totalDonGia += DonGia;
                  //       totalTienHang += TienHang;
                  //       totalSoLuong += SoLuong;
                  //       totalThanhTien += ThanhTien;
                  //       totalTongCong += TongCong;
                  //     }
                  //   );
                  //   return (
                  //     <Table.Summary fixed="bottom">
                  //       <Table.Summary.Row className="text-end font-bold">
                  //         <Table.Summary.Cell
                  //           index={0}
                  //           className="text-center "
                  //         >
                  //           {pageData.length}
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={2}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={3}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={4}>
                  //           {roundNumber(totalSoLuong)}
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell index={5}>
                  //           <NumericFormat
                  //             value={totalDonGia}
                  //             displayType={"text"}
                  //             thousandSeparator={true}
                  //           />
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell index={6}>
                  //           <NumericFormat
                  //             value={totalTienHang}
                  //             displayType={"text"}
                  //             thousandSeparator={true}
                  //           />
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell index={7}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={8}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={9}>
                  //           <NumericFormat
                  //             value={totalThanhTien}
                  //             displayType={"text"}
                  //             thousandSeparator={true}
                  //           />
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell index={10}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={11}></Table.Summary.Cell>
                  //         <Table.Summary.Cell index={12}>
                  //           <NumericFormat
                  //             value={totalTongCong}
                  //             displayType={"text"}
                  //             thousandSeparator={true}
                  //           />
                  //         </Table.Summary.Cell>
                  //       </Table.Summary.Row>
                  //     </Table.Summary>
                  //   );
                  // }}
                ></Table>
              </div>
            </div>
            {/* button print */}
            <div className="flex gap-x-3 p-2">
              <button
                onClick={() => setIsShowModalOnlyPrint(true)}
                className="flex items-center  py-1 px-2  rounded-md border-dashed border border-gray-500  text-sm hover:text-sky-500  hover:border-sky-500 "
              >
                <div className="pr-1">
                  <TiPrinter size={20} />
                </div>
                <div>In phiếu</div>
              </button>
              <button
                onClick={() => setIsShowModalOnlyPrintWareHouse(true)}
                className="flex items-center  py-1 px-2  rounded-md border-dashed border border-gray-500  text-sm hover:text-sky-500  hover:border-sky-500 "
              >
                <div className="pr-1">
                  <TiPrinter size={20} />
                </div>
                <div>In phiếu kho</div>
              </button>
            </div>
          </div>
        )}

        {actionType === "edit" && isLoadingModel ? (
          <div className=" w-[90vw] h-[600px] ">
            <div className="flex justify-between  items-start pb-1">
              <label className="font-bold ">
                Sửa thông tin - phiếu mua hàng
              </label>
              <button
                onClick={() => close()}
                className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="border w-full h-[96%] rounded-sm text-sm">
              <div className="flex">
                {/* thong tin phieu */}
                <div className="">
                  <div className="flex p-1  gap-x-2">
                    <div className=" flex items-center ">
                      <label className="">Số chứng từ</label>
                      <input
                        readOnly
                        type="text"
                        className=" border border-gray-300 outline-none  px-2  bg-gray-200"
                        value={dataThongTin?.SoChungTu}
                        onChange={(e) =>
                          setFormPMHEdit({
                            ...formPMHEdit,
                            SoChungTu: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Space direction="vertical" size={12}>
                      <RangePicker
                        format="DD/MM/YYYY"
                        defaultValue={[
                          dayjs(dataThongTin.NgayCTu, "YYYY-MM-DD"),
                          dayjs(dataThongTin.DaoHan, "YYYY-MM-DD"),
                        ]}
                        onChange={(values) => {
                          setFormPMHEdit({
                            ...formPMHEdit,
                            NgayCTu: dayjs(values[0]).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            ),
                            DaoHan: dayjs(values[1]).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            ),
                          });
                        }}
                      />
                    </Space>
                  </div>
                  <div className="p-1 flex ">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>

                    <select
                      className=" bg-white border w-full  outline-none border-gray-300  "
                      value={selectedDoiTuong}
                      onChange={(e) => handleDoiTuongFocus(e.target.value)}
                    >
                      {dataDoiTuong?.map((item) => (
                        <option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center   p-1">
                    <label className="w-[86px]">Tên</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={doiTuongInfo.Ten}
                      onChange={(e) =>
                        setFormPMHEdit({
                          ...formPMHEdit,
                          Ten: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center  p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input
                      type="text"
                      className=" w-full border border-gray-300 outline-none px-2 "
                      value={doiTuongInfo.DiaChi}
                      onChange={(e) =>
                        setFormPMHEdit({
                          ...formPMHEdit,
                          DiaChi: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center w-full  ">
                    <div className="p-1 flex  items-center ">
                      <label form="khohang" className="w-[94px]">
                        Kho hàng
                      </label>
                      <select
                        className=" bg-white border  w-full border-gray-300 hover:border-gray-500 "
                        onChange={(e) => setSelectedKhoHang(e.target.value)}
                        value={selectedKhoHang}
                      >
                        {dataKhoHang?.map((item) => (
                          <option key={item.MaKho} value={item.MaKho}>
                            {item.MaKho} - {item.TenKho}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center p-1  w-1/2">
                      <label className="w-[86px]">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 outline-none px-2 "
                        value={dataThongTin?.GhiChu}
                        onChange={(e) =>
                          setFormPMHEdit({
                            ...formPMHEdit,
                            GhiChu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={isAdd}
                  onClick={handleAddEmptyRow}
                  className={`border border-blue-500 rounded-md px-4 py-2 ${
                    isAdd
                      ? "cursor-not-allowed text-slate-400"
                      : "hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Thêm hàng mới
                </button>
                <button
                  onClick={() => setIsShowModalHH(true)}
                  className="border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white"
                >
                  chọn từ danh sách
                </button>
                <button
                  onClick={() => handleEdit(dataRecord)}
                  className="border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white"
                >
                  Lưu thay đổi
                </button>
              </div>
              {/* table */}
              <div className="max-w-[98%]  max-h-[50%] mx-auto bg-white  rounded-md my-3 overflow-y-auto ">
                <table className="min-w-full min-h-full bg-white border border-gray-300 text-text-main">
                  <thead>
                    <tr>
                      {title.map((item) => (
                        <th key={item} className="py-1 px-2 border">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRowData.map((item, index) => (
                      <EditRow
                        key={item.SoChungTu}
                        index={index}
                        item={item}
                        dataHangHoa={dataHangHoa}
                        handleDeleteRow={handleDeleteRow}
                        setRowData={setSelectedRowData}
                        currentRowData={currentRowData(item.MaHang)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {actionType === "create" && (
          <div className=" w-[90vw] h-[600px] ">
            <div className="flex justify-between  items-start pb-1">
              <label className="font-bold ">
                Thêm thông tin - phiếu mua hàng
              </label>
              <button
                onClick={() => close()}
                className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="border w-full h-[96%] rounded-sm text-sm">
              <div className="flex ">
                {/* thong tin phieu */}
                <div className="">
                  <div className="flex p-1 gap-x-2">
                    <div className="flex items-center ">
                      <label className="">Số chứng từ</label>
                      <input
                        readOnly
                        type="text"
                        className=" border border-gray-300 outline-none  px-2 cursor-not-allowed  bg-gray-200"
                      />
                    </div>

                    {/* <Space direction="vertical" size={12}>
                      <RangePicker
                        format="DD/MM/YYYY"
                        defaultValue={[dayjs(), dayjs()]}
                        onChange={(values) => {
                          setFormPMH({
                            ...formPMH,
                            NgayCTu: dayjs(values[0]).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            ),
                            DaoHan: dayjs(values[1]).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            ),
                          });
                        }}
                      />
                    </Space> */}
                  </div>
                  <div className="p-1 flex  ">
                    <label form="doituong" className="w-[86px]">
                      Đối tượng
                    </label>
                    <select
                      className=" bg-white border w-full outline-none border-gray-300  "
                      value={selectedDoiTuong}
                      onChange={(e) => handleDoiTuongFocus(e.target.value)}
                    >
                      {dataDoiTuong?.map((item) => (
                        <option key={item.Ma} value={item.Ma}>
                          {item.Ma} - {item.Ten}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center  p-1">
                    <label className="w-[86px]">Tên</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={doiTuongInfo.Ten}
                      onChange={(e) =>
                        setFormPMH({
                          ...formPMH,
                          Ten: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center p-1">
                    <label className="w-[86px]">Địa chỉ</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 outline-none px-2 "
                      value={doiTuongInfo.DiaChi}
                      onChange={(e) =>
                        setFormPMH({
                          ...formPMH,
                          DiaChi: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center  w-full">
                    <div className="p-1 flex  items-center w-1/2">
                      <label form="khohang" className="w-[94px]">
                        Kho hàng
                      </label>
                      <select
                        className=" bg-white border w-full  border-gray-300 hover:border-gray-500 "
                        onChange={(e) => setSelectedKhoHang(e.target.value)}
                        value={selectedKhoHang}
                      >
                        {dataKhoHang?.map((item) => (
                          <option key={item.MaKho} value={item.MaKho}>
                            {item.ThongTinKho}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center p-1 w-1/2 ">
                      <label className="w-[86px]">Ghi chú</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 outline-none px-2 "
                        value={formPMH.GhiChu}
                        onChange={(e) =>
                          setFormPMH({
                            ...formPMH,
                            GhiChu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center ">
                <div className="px-3">
                  <input
                    id="lapphieuchi"
                    type="checkbox"
                    className="border border-blue-500 rounded-md px-4 py-2
                  hover:bg-blue-500 hover:text-white"
                    checked={formPMH.TTTienMat}
                    onChange={handleTienMat}
                  />
                  <label htmlFor="lapphieuchi">Lập phiếu chi</label>
                </div>

                <button
                  disabled={isAdd}
                  onClick={handleAddEmptyRow}
                  className={`border border-blue-500 rounded-md px-4 py-2 ${
                    isAdd
                      ? "cursor-not-allowed text-slate-400"
                      : "hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Thêm hàng mới
                </button>
                <button
                  onClick={() => setIsShowModalHH(true)}
                  className="border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white"
                >
                  chọn từ danh sách
                </button>
                <button
                  onClick={handleCreate}
                  className="border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white"
                >
                  tạo
                </button>
              </div>
              {/* table */}
              <div className="max-w-[98%]  max-h-[50%] mx-auto bg-white  rounded-md my-3 overflow-y-auto ">
                <table className="min-w-full min-h-full bg-white border border-gray-300 text-text-main">
                  <thead>
                    <tr>
                      {title.map((item) => (
                        <th key={item} className="py-1 px-2 border">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRowData.map((item, index) => (
                      <CreateRow
                        key={item.SoChungTu}
                        index={index}
                        item={item}
                        dataHangHoa={dataHangHoa}
                        handleDeleteRow={handleDeleteRow}
                        setRowData={setSelectedRowData}
                        currentRowData={currentRowData(item.MaHang)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {actionType === "delete" ? (
          <div className="flex justify-end gap-4 p-4">
            <button
              className="border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white "
              onClick={() => handleDelete(dataRecord)}
            >
              Ok
            </button>
            <button
              className="border  px-2 py-1 rounded-md hover:bg-red-500 hover:text-white "
              onClick={() => close()}
            >
              No
            </button>
          </div>
        ) : actionType === "print" ? (
          <div className="flex justify-end gap-4 p-4 ">
            <button
              className="text-blue-500  border border-blue-500 px-2 py-1 rounded-md hover:bg-blue-500 hover:text-white "
              onClick={handlePrint}
            >
              In phiếu
            </button>
            <button
              className=" text-red-500 border border-red-500   px-2 py-1 rounded-md hover:bg-red-500 hover:text-white "
              onClick={() => close()}
            >
              Đóng
            </button>
          </div>
        ) : actionType === "printWareHouse" ? (
          <div className="flex justify-end gap-4 p-4 ">
            <button
              className="text-blue-500  border border-blue-500 px-2 py-1 rounded-md hover:bg-blue-500 hover:text-white "
              onClick={handlePrintWareHouse}
            >
              In phiếu
            </button>
            <button
              className=" text-red-500 border border-red-500   px-2 py-1 rounded-md hover:bg-red-500 hover:text-white "
              onClick={() => close()}
            >
              Đóng
            </button>
          </div>
        ) : (
          actionType === "pay" && (
            <div className="flex justify-end gap-4 p-4">
              <button
                className="border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white "
                onClick={() => handlePay(dataRecord)}
              >
                Ok
              </button>
              <button
                className="border  px-2 py-1 rounded-md hover:bg-red-500 hover:text-white "
                onClick={() => close()}
              >
                No
              </button>
            </div>
          )
        )}
      </div>

      {isShowModalHH && (
        <ModalHH
          close={() => setIsShowModalHH(false)}
          data={dataHangHoa}
          onRowCreate={handleAddRow}
        />
      )}

      {isShowModalOnlyPrint && (
        <ModalOnlyPrint
          close={() => setIsShowModalOnlyPrint(false)}
          dataThongTin={dataThongTin}
          dataPMH={dataPMH}
        />
      )}

      {isShowModalOnlyPrintWareHouse && (
        <ModalOnlyPrintWareHouse
          close={() => setIsShowModalOnlyPrintWareHouse(false)}
          dataThongTin={dataThongTin}
          dataPMH={dataPMH}
        />
      )}
    </div>
  );
};

export default Modals;
