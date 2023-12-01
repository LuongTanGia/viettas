import { Form, Modal, Radio } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { authDataSelector } from "../../redux/selector";
import { LOGIN } from "../../action/Actions";
import { useNavigate } from "react-router-dom";
import API from "../../API/API";
import { useState } from "react";
// eslint-disable-next-line react/prop-types
const CollectionCreateForm = ({ open, onCancel }) => {
    const [form] = Form.useForm();
    const navigateTo = useNavigate();
    const DSDL = useSelector(authDataSelector);
    const [RemoteDB, setRemoteDB] = useState();
    const dispatch = useDispatch();
    const handleLogin = async () => {
        await LOGIN(API.DANGNHAP, DSDL.TKN, RemoteDB, dispatch);
        navigateTo("/");
    };
    const handleChangeRadio = (e) => {
        setRemoteDB(e.target.value);
    };

    return (
        <Modal
            open={open}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(() => {
                        handleLogin();
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: "public",
                }}
            >
                <Radio.Group>
                    {DSDL.DataResults?.map((item, index) => (
                        <Radio
                            value={item.RemoteDB}
                            key={index}
                            onChange={handleChangeRadio}
                        >
                            {item.RemoteDB}
                        </Radio>
                    ))}
                </Radio.Group>
            </Form>
        </Modal>
    );
};

export default CollectionCreateForm;
