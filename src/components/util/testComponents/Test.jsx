import { Table, Input } from "antd";
import "./test.css";
const columns = [
    {
        title: "Mã",
        dataIndex: "ma",
        key: "ma",
        width: 100,
        fixed: "left",
        editable: true,
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 100,
        fixed: "left",
        editable: true,
    },

    {
        title: "Tuần 1",
        width: 100,
        editable: true,

        children: [
            {
                title: "10/10",
                dataIndex: "date",
                render: () => (
                    <Input
                        placeholder="date"
                        value={"10/10"}
                        style={{ all: "unset" }}
                        type=""
                    />
                ),
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
        ],
    },
    {
        title: "Tuần 2",
        width: 100,
        editable: true,

        children: [
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
        ],
    },
    {
        title: "Tuần 3",
        width: 100,
        editable: true,

        children: [
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
        ],
    },
    {
        title: "Tuền 4",
        width: 100,
        editable: true,

        children: [
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
        ],
    },
    {
        title: "Tuần 5",
        width: 100,
        editable: true,

        children: [
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
        ],
    },
    {
        title: "Tuần 6",
        width: 100,
        editable: true,

        children: [
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
            {
                title: "10/10",
                dataIndex: "date",
                render: () => <Input placeholder="date" />,
                width: 100,
            },
        ],
    },
];

const data = [
    { name: "Tấn Gia", date: "01/10", ma: "Gia" },
    { name: "Duy Tân", date: "11/10", ma: "Tan" },
    { name: "Hữu Khánh", date: "12/12", ma: "Khanh" },
];

const App = () => (
    <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{
            x: 1500,
            y: 300,
        }}
        rowClassName="editable-row"
    />
);
export default App;
