/* eslint-disable react/prop-types */
import { Table, Typography, Select } from 'antd'
import './table.css'

import BtnAction from './BtnAction'
import { useState } from 'react'
const { Text } = Typography
// eslint-disable-next-line react/prop-types
function Tables({ param, columName, height, handleView, handleEdit, typeTable, handleAddData }) {
  const [hiden, setHiden] = useState([])

  // eslint-disable-next-line react/prop-types
  const DataColumns = param ? param[0] : []
  const keysOnly = Object.keys(DataColumns || [])
  const listColumns = keysOnly?.filter((value) => !hiden.includes(value))
  const newColumns = listColumns.map((item) => ({
    title: columName[item] || item,
    width: 200,
    dataIndex: item,
    key: item,
  }))
  const columns = [
    ...newColumns,
    typeTable !== 'listHelper'
      ? {
          title: 'Action',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: (record) => <BtnAction handleView={handleView} record={record} handleEdit={handleEdit} />,
        }
      : {},
  ]
  // eslint-disable-next-line react/prop-types
  const data = param?.map((record) => ({
    ...record,
  }))

  const onRowClick = (record) => {
    return {
      onDoubleClick: () => {
        typeTable === 'listHelper' ? handleAddData(record) : handleView(record)
      },
    }
  }
  const options = []
  for (let i = 0; i < keysOnly.length; i++) {
    options.push({
      value: keysOnly[i],
      label: columName[keysOnly[i]] || keysOnly[i],
    })
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`)
    setHiden(value)
  }

  return (
    <>
      <Select
        mode="tags"
        style={{
          width: '100%',
        }}
        placeholder="Chọn Cột Muốn Ẩn"
        onChange={handleChange}
        options={options}
      />
      <Table
        className={height}
        // loading={true}
        columns={columns}
        dataSource={data}
        pagination={typeTable !== 'listHelper' ? true : false}
        bordered
        onRow={(record) => ({
          ...onRowClick(record),
        })}
        scroll={{
          x: 1500,
          y: 300,
        }}
        size="small"
        summary={(pageData) => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                {columns.length > 2
                  ? columns.map((column) => {
                      const isNumericColumn = typeof data[0][column.dataIndex] === 'number'

                      return (
                        <Table.Summary.Cell key={column.key}>
                          {isNumericColumn ? <Text strong>{pageData.reduce((total, item) => total + item[column.dataIndex], 0)}</Text> : null}
                        </Table.Summary.Cell>
                      )
                    })
                  : null}
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </>
  )
}

export default Tables

// /* eslint-disable react/prop-types */
// import { Table, Typography, Select } from "antd";
// import "./table.css";
// import BtnAction from "./BtnAction";
// import { useRef, useState, useEffect } from "react";

// const { Text } = Typography;

// function Tables({ param, columName, height, handleView }) {
//     const [hiden, setHiden] = useState([]);
//     const resizableDivRef = useRef(null);
//     const [resizing, setResizing] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [startWidth, setStartWidth] = useState(0);

//     useEffect(() => {
//         const doDrag = (e) => {
//             if (resizing) {
//                 e.preventDefault();
//                 const newWidth = startWidth + e.clientX - startX;
//                 resizableDivRef.current.style.width = `${newWidth}px`;
//             }
//         };

//         const stopDrag = () => {
//             setResizing(false);
//         };

//         if (resizing) {
//             document.addEventListener("mousemove", doDrag);
//             document.addEventListener("mouseup", stopDrag);
//         }

//         return () => {
//             document.removeEventListener("mousemove", doDrag);
//             document.removeEventListener("mouseup", stopDrag);
//         };
//     }, [resizing, startWidth, startX]);

//     const startResizing = (e) => {
//         e.preventDefault();
//         setResizing(true);
//         setStartX(e.clientX);
//         setStartWidth(resizableDivRef.current.clientWidth);
//     };

//     const DataColumns = param ? param[0] : [];
//     const keysOnly = Object.keys(DataColumns);
//     const listColumns = keysOnly?.filter((value) => !hiden.includes(value));
//     const newColumns = listColumns.map((item) => ({
//         title: columName[item] || item,
//         dataIndex: item,
//         key: item,

//         onHeaderCell: (column) => ({
//             width: column.width,
//             onResize: (value) => {
//                 setStartWidth(value.size.width);
//             },
//             onMouseDown: (e) => {
//                 startResizing(e);
//             },
//         }),
//     }));

//     const columns = [
//         ...newColumns,
//         {
//             title: "Action",
//             key: "operation",
//             fixed: "right",
//             width: 100,
//             render: (record) => (
//                 <BtnAction handleView={handleView} record={record} />
//             ),
//             onHeaderCell: (column) => ({
//                 width: column.width,
//                 onResize: (value) => {
//                     setStartWidth(value.size.width);
//                 },
//             }),
//         },
//     ];

//     const data = param;

//     const options = keysOnly.map((item) => ({
//         value: item,
//         label: columName[item] || item,
//     }));

//     const handleChange = (value) => {
//         setHiden(value);
//     };

//     return (
//         <>
//             <Select
//                 mode="tags"
//                 style={{
//                     width: "100%",
//                 }}
//                 placeholder="Chọn Cột Muốn Ẩn"
//                 onChange={handleChange}
//                 options={options}
//             />
//             <Table
//                 className={height}
//                 columns={columns}
//                 dataSource={data}
//                 bordered
//                 scroll={{
//                     x: 1500,
//                     y: 300,
//                 }}
//                 size="small"
//             />
//         </>
//     );
// }

// export default Tables;
