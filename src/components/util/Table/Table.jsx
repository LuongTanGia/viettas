import { useState } from "react";
import { Table, Modal, Input, Space, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { dataDSHHSelector } from "../../../redux/selector";

const App = () => {
    const datas = useSelector(dataDSHHSelector);
    const dataHangHoa = datas.DataResults;
    const newData = dataHangHoa.map((item, index) => {
        return { ...item, key: index };
    });
    const data = [...newData];
    const OneHangHoa = dataHangHoa[0];

    const columns_value = Object.keys(OneHangHoa);

    const columns_hanghoa = columns_value.map((item) => ({
        title: item,
        dataIndex: item,
        sorter: (a, b) => a[item].length - b[item].length,
    }));
    const onChange = (pagination, filters, sorter, extra) => {
        console.log("params", pagination, filters, sorter, extra);
    };

    const columns = [
        ...columns_hanghoa,
        {
            key: "action",
            title: "Actions",
            render: (record) => {
                return (
                    <>
                        <div className="flex">
                            <EditOutlined
                                style={{ color: "black" }}
                                onClick={() => Edit(record)}
                            />
                            <DeleteOutlined
                                style={{ color: "red" }}
                                onClick={() => Delete(record)}
                            />
                            <EditOutlined
                                style={{ color: "green" }}
                                onClick={() => View(record)}
                            />
                        </div>
                    </>
                );
            },
        },
    ];
    const [checkStrictly] = useState(false);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };
    const [visible, setVisible] = useState(false);
    const [SearchInput, setSearchInput] = useState("");

    const Edit = (e) => {
        setVisible(true);
        setEdit(e);
    };
    const View = (e) => {
        setVisible(true);
        setEdit(e);
    };
    const ResetEditing = () => {
        setVisible(false);
    };
    const [edit, setEdit] = useState(null);
    const [Data, setData] = useState(data);
    const [filterData, setFilterData] = useState();

    const Delete = (record) => {
        Modal.confirm({
            title: "Are you sure you want to delete this",
            onOk: () => {
                setData((pre) => {
                    return pre.filter(
                        (person) => person.MaVach != record.MaVach
                    );
                });
            },
        });
    };
    const handleChange = (value) => {
        setFilterData(value);
        console.log(`selected ${value}`);
    };

    const options = [];
    for (let i = 0; i < columns_value.length; i++) {
        options.push({
            value: columns_value[i],
            label: columns_value[i],
        });
    }
    return (
        <>
            <div className="app">
                <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={options}
                />
                <Space
                    align="center"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    <Input
                        value={SearchInput}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            setSearchInput(inputValue);

                            const filteredData = data.filter((person) =>
                                person[filterData].includes(inputValue)
                            );

                            console.log(filteredData);
                            setData(
                                filteredData.length > 0 ? filteredData : data
                            );
                        }}
                    />
                </Space>
                <Modal
                    title="Edit Details"
                    visible={visible}
                    okText="Save"
                    onCancel={() => /*setVisible(false)*/ ResetEditing()}
                    onOk={() => /*setVisible(false)*/ {
                        setData((pre) => {
                            return pre.map((student) => {
                                if (student.id === edit.id) {
                                    return edit;
                                } else {
                                    return student;
                                }
                            });
                        });
                        ResetEditing();
                    }}
                >
                    <Input
                        value={edit?.Nhom}
                        onChange={(e) => {
                            setEdit((pre) => {
                                return { ...pre, Nhom: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={edit?.TenNhom}
                        onChange={(e) => {
                            setEdit((pre) => {
                                return { ...pre, TenNhom: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={edit?.address}
                        onChange={(e) => {
                            setEdit((pre) => {
                                return { ...pre, address: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={edit?.phone}
                        onChange={(e) => {
                            setEdit((pre) => {
                                return { ...pre, phone: e.target.value };
                            });
                        }}
                    />
                    <Input
                        value={edit?.website}
                        onChange={(e) => {
                            setEdit((pre) => {
                                return { ...pre, website: e.target.value };
                            });
                        }}
                    />
                </Modal>
                <div className="table">
                    <Table
                        dataSource={Data}
                        columns={columns}
                        pagination={true}
                        rowSelection={{ ...rowSelection, checkStrictly }}
                        onChange={onChange}
                    />
                </div>
            </div>
        </>
    );
};

export default App;
