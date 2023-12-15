/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Table, Typography, Select, Form, Input, InputNumber, Popconfirm, Checkbox } from 'antd'
import './table.css'
import BtnAction from './BtnAction'
import { useEffect, useState } from 'react'

const { Text } = Typography

const getInputNode = (inputType, record, dataIndex, text, typeTable, form, onChange) => {
  switch (inputType) {
    case 'number':
      return <InputNumber value={text} onChange={(value) => onChange && onChange(dataIndex, value)} />
    case 'checkbox':
      return <Checkbox checked={text} onChange={(e) => onChange && onChange(dataIndex, e.target.checked)} />
    case 'select':
      const options = getSelectOptions(dataIndex)
      return (
        <Select value={text} onChange={(value) => onChange && onChange(dataIndex, value)}>
          {options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      )
    default:
      // For any other input type, return a default Input with the provided text
      return <Input value={text} onChange={(e) => onChange && onChange(dataIndex, e.target.value)} />
  }
}

const getSelectOptions = (dataIndex) => {
  if (dataIndex === 'MaHang') {
    return [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ]
  } else if (dataIndex === 'DVT') {
    return [
      { value: 'kg', label: 'Kilogram' },
      { value: 'g', label: 'Gram' },
    ]
  }
  return []
}
const handleInputChange = (dataIndex, value, record) => {
  const newData = [...data]
  const index = newData.findIndex((item) => record.key === item.key)
  if (index > -1) {
    newData[index][dataIndex] = value
    setData(newData)
    form.setFieldsValue({
      [dataIndex]: value,
    })
  }
}
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, form, ...restProps }) => {
  const inputValue = record ? record[dataIndex] : undefined
  const inputNode = getInputNode(inputType, record, dataIndex, inputValue, 'edit', form)

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

function Tables({ param, columName, height, handleView, handleEdit, typeTable, handleAddData }) {
  const getInputType = (cellValue, dataIndex) => {
    if (dataIndex === 'MaHang' || dataIndex === 'DVT') {
      return 'select'
    } else if (typeof cellValue === 'number') {
      return 'number'
    } else if (typeof cellValue === 'boolean') {
      return 'checkbox'
    } else {
      return 'text'
    }
  }
  const [hiden, setHiden] = useState([])
  const DataColumns = param ? param[0] : []
  const keysOnly = Object.keys(DataColumns || [])
  const listColumns = keysOnly?.filter((value) => !hiden.includes(value))
  const newColumns = listColumns.map((item, index) => ({
    title: columName[item] || item,
    width: 200,
    dataIndex: item,
    editable: true,
    sorter: (a, b) => {
      const keywords = ['Tong', 'Gia', 'Tien', 'TLCK', 'So', 'Thue']
      const includesKeyword = keywords.some((keyword) => item.includes(keyword))

      if (includesKeyword && a[item] !== undefined && b[item] !== undefined) {
        return Number(a[item]) - Number(b[item])
      } else if (includesKeyword && a[item] !== undefined) {
        return -1
      } else if (includesKeyword && b[item] !== undefined) {
        return 1
      } else {
        return a[item]?.toString().localeCompare(b[item]?.toString()) || 0
      }
    },

    render:
      typeTable === 'edit'
        ? (text, record) => {
            const inputType = getInputType(text, item)
            const inputNode = getInputNode(inputType, record, item, text, typeTable, form, (dataIndex, value) => handleInputChange(dataIndex, value, record))
            return typeTable === 'edit' && (item === 'TTTienMat' || item === 'LapRap' || item === 'TonKho') ? (
              <Form.Item
                name={item}
                style={{
                  margin: 0,
                }}
              >
                {inputNode}
              </Form.Item>
            ) : (
              inputNode
            )
          }
        : item === 'TTTienMat' || item === 'LapRap' || item === 'TonKho'
          ? (text, record) => {
              const inputType = getInputType(text, item)
              const inputNode = getInputNode(inputType, record, item, text, typeTable)
              return inputNode
            }
          : null,
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
    typeTable !== 'listHelper'
      ? {
          title: 'operation',
          dataIndex: 'operation',
          width: 100,
          fixed: 'right',
          render: (_, record, index) => {
            const editable = isEditing(record)
            return editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(index)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(index)}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                Edit
              </Typography.Link>
            )
          },
        }
      : {},
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => {
        const cellValue = record[col.dataIndex]
        let inputType

        // Determine the input type based on the data type
        if (typeof cellValue === 'number') {
          inputType = 'number'
        } else if (typeof cellValue === 'boolean') {
          inputType = 'checkbox'
        } else if (col.dataIndex === 'MaHang' || col.dataIndex === 'DVT') {
          inputType = 'select'
        } else {
          inputType = 'text'
        }

        return {
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }
      },
    }
  })

  const originData = param?.map((record, index) => ({
    ...record,
    index,
  }))
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  useEffect(() => {
    setData(originData)
  }, [param])
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record) => record.index === editingKey
  const edit = (record) => {
    form.setFieldsValue({
      SoChungTu: '',
      MaDoiTuong: '',
      DiaChi: '',
      ...record,
    })
    setEditingKey(record.index)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (index) => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      setData(newData)
      setEditingKey('')
      console.log(newData)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const onRowClick = (record) => {
    return {
      onDoubleClick: () => {
        handleAddData(record)
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
          columns={mergedColumns}
          dataSource={data}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
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
                        const isNumericColumn = typeof data[0]?.[column.dataIndex] === 'number'

                        return (
                          <Table.Summary.Cell key={column.key}>
                            {isNumericColumn ? <Text strong>{pageData.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)}</Text> : null}
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
