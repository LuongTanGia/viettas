import { Button, Form, Input, Typography } from "antd";
import { THAYDOIRMATKHAU } from "../../action/Actions";
import API from "../../API/API";

// eslint-disable-next-line react/prop-types
function ChangePass({ isShow, close }) {
    const onFinish = async (values) => {
        const token = localStorage.getItem("TKN");
        console.log("Success:", values);
        await THAYDOIRMATKHAU(API.DOIMATKHAU, values, token);
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        alert("Mật khẩu không trùng khớp !");
    };
    const { Title } = Typography;
    return (
        <>
            {isShow ? (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-20">
                    <div className="w-[600px] m-6 p-6 absolute shadow-lg bg-white rounded-md flex flex-col">
                        <Title level={2}>Thay đổi mật khẩu </Title>
                        <Form
                            name="basic"
                            className="ChangeLogin"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Mật Khẩu Hiện Tại"
                                name="MatKhauHienTai"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập mật khẩu hiện tại !",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Mật Khẩu Mới"
                                name="MatKhauMoi"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập mật khẩu cần thay đổi !",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Xác Mật Khẩu Mới"
                                name="XacMatKhauMoi"
                                dependencies={["MatKhauMoi"]}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Nhập lại mật khẩu cần thay đổi !",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("MatKhauMoi") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "Xác nhận mật khẩu không chính xác !"
                                                )
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button
                                    className="btn"
                                    type="primary"
                                    htmlType=""
                                    onClick={() => {
                                        close();
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="btn"
                                >
                                    Thay đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            ) : null}
        </>
    );
}
export default ChangePass;
