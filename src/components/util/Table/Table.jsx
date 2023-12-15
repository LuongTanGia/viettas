/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Table, Typography, Select, Form, Input, InputNumber, Popconfirm } from 'antd'
import './table.css'
import BtnAction from './BtnAction'
import { useState } from 'react'
const { Text } = Typography

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

// eslint-disable-next-line react/prop-types
function Tables({ param, columName, height, handleView, handleEdit, typeTable, handleAddData }) {
  const [hiden, setHiden] = useState([])
  // eslint-disable-next-line react/prop-types
  const DataColumns = param ? param[0] : []
  const keysOnly = Object.keys(DataColumns || [])
  const listColumns = keysOnly?.filter((value) => !hiden.includes(value))
  const newColumns = listColumns.map((item, index) => ({
    title: columName[item] || item,
    width: 200,
    dataIndex: item,
    key: index.toString(),
    editable: true,
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
    {
      title: 'operation',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        console.log(record, 'editRows')
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        )
      },
    },
  ]
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })
  // eslint-disable-next-line react/prop-types
  const originData = param?.map((record, index) => ({
    ...record,
    STT: index + 1,
    key: index.toString(),
  }))
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record) => record.key === editingKey
  const edit = (record) => {
    form.setFieldsValue({
      SoChungTu: '',
      MaDoiTuong: '',
      DiaChi: '',
      ...record,
    })
    setEditingKey(record.key)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
      console.log(newData)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
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
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          className={height}
          // loading={true}
          columns={mergedColumns}
          dataSource={data}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          // pagination={typeTable !== 'listHelper' ? true : false}
          defaultCurrent={10}
          bordered
          onRow={(record) => ({
            ...onRowClick(record),
          })}
          scroll={{
            x: 1500,
            y: true,
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
      </Form>
    </>
  )
}

export default Tables
