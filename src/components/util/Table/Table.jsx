import { Table, Typography } from "antd";
import "./table.css";
const { Text } = Typography;
const columns = [
    {
        title: "Full Name",
        width: 100,
        dataIndex: "name",
        key: "name",
        fixed: "left",
    },
    {
        title: "Age",
        width: 100,
        dataIndex: "age",
        key: "age",
        fixed: "left",
    },
    {
        title: "Column 1",
        dataIndex: "address",
        key: "1",
        width: 150,
    },
    {
        title: "Column 2",
        dataIndex: "address",
        key: "2",
        width: 150,
    },
    {
        title: "Column 3",
        dataIndex: "address",
        key: "3",
        width: 150,
    },
    {
        title: "Column 4",
        dataIndex: "address",
        key: "4",
        width: 150,
    },
    {
        title: "Column 5",
        dataIndex: "address",
        key: "5",
        width: 150,
    },
    {
        title: "Số Đếm",
        dataIndex: "SoDem",
        key: "6",
        width: 150,
    },
    {
        title: "Tổng",
        dataIndex: "Tong",
        key: "7",
        width: 150,
    },
    {
        title: "Column 8",
        dataIndex: "address",
        key: "8",
    },
    {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: 100,
        render: () => <a>action</a>,
    },
];
const data = [];
for (let i = 0; i < 5; i++) {
    const age = 32;
    const soDem = Math.floor(Math.random() * 100);
    data.push({
        key: i,
        name: `Edward ${i}`,
        age: age,
        SoDem: soDem,
        address: `London Park no. ${i}`,
        Tong: age + soDem,
    });
}

const App = () => (
    <>
        <Table
            columns={columns}
            dataSource={data}
            // pagination={false}
            bordered
            scroll={{
                x: 1500,
                y: 300,
            }}
            summary={(pageData) => {
                return (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            {/* <Table.Summary.Cell key={columns.key == "age"}>
                                <Text type="danger">{totalBorrow}</Text>
                            </Table.Summary.Cell> */}
                            {columns.map((column) => {
                                const isNumericColumn =
                                    typeof data[0][column.dataIndex] ===
                                    "number";

                                return (
                                    <Table.Summary.Cell key={column.key}>
                                        {isNumericColumn ? (
                                            <Text strong>
                                                {pageData.reduce(
                                                    (total, item) =>
                                                        total +
                                                        item[column.dataIndex],
                                                    0
                                                )}
                                            </Text>
                                        ) : null}
                                    </Table.Summary.Cell>
                                );
                            })}
                        </Table.Summary.Row>
                    </Table.Summary>
                );
            }}
        />

        <br />
    </>
);
export default App;
