import React, { useState } from "react";
import { Form, DatePicker, Space, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
const { RangePicker } = DatePicker;

const NhomHang = () => {
  const [form] = Form.useForm();
  const [isValidDate, setIsValidDate] = useState();

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

  return (
    <div>
      NhomHang
      <div>
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
                picker="date"
                onKeyDown={handleKeyDown}
                onCalendarChange={handleCalendarChange}
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
    </div>
  );
};

export default NhomHang;
