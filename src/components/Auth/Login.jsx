import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { DANHSACHDULIEU } from "../../action/Actions";
import API from "../../API/API";
import { useDispatch } from "react-redux";
import CollectionCreateForm from "./Popup";

const App = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        User: "",
        Pass: "",
    });
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    const handleAddUser = async () => {
        await DANHSACHDULIEU(API.DANHSACHDULIEU, user, dispatch);
        setOpen(true);
    };

    const [open, setOpen] = useState(false);

    return (
        <div className="loginFrom">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Username!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Username"
                        name="User"
                        onChange={onChangeInput}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Password!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        name="Pass"
                        placeholder="Password"
                        onChange={onChangeInput}
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        onClick={handleAddUser}
                    >
                        Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item>
            </Form>
            <CollectionCreateForm
                open={open}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </div>
    );
};
export default App;
