/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { DatePicker, Space, Form } from "antd";
import icons from "../untils/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { base64ToPDF, keyDown } from "../action/Actions";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import * as apis from "../apis";

const { RangePicker } = DatePicker;
const { IoMdClose } = icons;

const ModalOnlyPrintWareHouse = ({ close, dataThongTin, dataPMH }) => {
  const [isValidDate, setIsValidDate] = useState(true);
  const [form] = Form.useForm();
  const [selectedSctBD, setSelectedSctBD] = useState();
  const [selectedSctKT, setSelectedSctKT] = useState();
  const [newDataPMH, setNewDataPMH] = useState();

  const startDate = dayjs(dataThongTin.NgayCTu).format("YYYY-MM-DDTHH:mm:ss");
  const endDate = dayjs(dataThongTin.DaoHan).format("YYYY-MM-DDTHH:mm:ss");

  const dataPMHByDate = useMemo(() => {
    return dataPMH.filter((item) => {
      const itemDate = new Date(item.NgayCTu);
      const ngaybt = new Date(startDate);
      const ngaykt = new Date(endDate);

      return itemDate >= ngaybt && itemDate <= ngaykt;
    });
  }, [dataPMH, startDate, endDate]);

  useEffect(() => {
    setNewDataPMH(dataPMHByDate);
  }, [dataPMHByDate]);

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
    if (dataPMHByDate) setSelectedSctBD(dataPMHByDate[0].SoChungTu);
    if (dataPMHByDate) setSelectedSctKT(dataPMHByDate[0].SoChungTu);
  }, [dataPMH, dataPMHByDate]);

  const calculateTotal = () => {
    let total = 0;
    if (checkboxValues.checkbox1) total += 1;
    if (checkboxValues.checkbox2) total += 2;
    if (checkboxValues.checkbox3) total += 4;
    return total;
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

  const handleLien = (checkboxName) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkboxName]: !prevValues[checkboxName],
    }));
  };

  const handleOnlyPrintWareHouse = async () => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="   ">
          <div className=" pb-2 ">In phiếu kho hàng</div>
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
                      dayjs(dataThongTin?.NgayCTu),
                      dayjs(dataThongTin?.DaoHan),
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
          </div>
          <div className="flex justify-end p-2 gap-x-2 ">
            <button
              onClick={handleOnlyPrintWareHouse}
              className="text-blue-500  border border-blue-500 px-2 py-1 rounded-md hover:bg-blue-500 hover:text-white "
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
        </div>
      </div>
    </div>
  );
};

export default ModalOnlyPrintWareHouse;
