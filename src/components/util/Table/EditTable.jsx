/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Popconfirm, Table, InputNumber } from 'antd'
import BtnAction from './BtnAction'

const EditTable = ({ param, handleEditData }) => {
  const EditableContext = React.createContext(null)

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const handleSave = (row) => {
    setDataSource((prevDataSource) => {
      const newData = [...prevDataSource]
      const index = newData.findIndex((item) => item.MaHang === row.MaHang)
      const item = newData[index]

      newData.splice(index, 1, {
        ...item,
        ...row,
        STT: index + 1,
      })

      const updatedRow = newData[index]
      updatedRow.TienHang = updatedRow.SoLuong * updatedRow.DonGia

      updatedRow.TienThue = (updatedRow.TienHang * updatedRow.TyLeThue) / 100
      updatedRow.ThanhTien = updatedRow.TienHang + updatedRow.TienThue

      updatedRow.TienCKTT = updatedRow.ThanhTien + updatedRow.TyLeCKTT || 0
      updatedRow.TongCong = updatedRow.ThanhTien

      console.log('handleSave - newData:', newData)
      handleEditData(newData)
      return newData
    })
  }
  const handleInputNumberChange = (value, MaHang, dataIndex) => {
    setDataSource((prevDataSource) => {
      const newData = prevDataSource.map((item) => {
        if (item.MaHang === MaHang) {
          return {
            ...item,
            [dataIndex]: value,
          }
        }
        return item
      })

      handleEditData(newData)
      return newData
    })
  }
  const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)

    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()

        handleSave({
          ...record,
          ...values,
        })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }
    return <td {...restProps}>{childNode}</td>
  }

  const [dataSource, setDataSource] = useState(param)

  useEffect(() => {
    setDataSource(param)
  }, [param])

  const handleDelete = (MaHang) => {
    setDataSource((prevDataSource) => {
      const newData = prevDataSource.filter((item) => item.MaHang !== MaHang)
      console.log('handleDelete - newData:', newData)
      handleEditData(newData)
      console.log(newData)
      return newData
    })
  }

  // const handleSave = (row) => {
  //   setDataSource((prevDataSource) => {
  //     const newData = [...prevDataSource]
  //     const index = newData.findIndex((item) => item.MaHang === row.MaHang)
  //     const item = newData[index]
  //     newData.splice(index, 1, {
  //       ...item,
  //       ...row,
  //     })
  //     console.log('handleSave - newData:', newData)
  //     handleEditData(newData)
  //     return newData
  //   })
  // }

  const listColumns = ['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong', 'DonGia', 'TienHang', 'TyLeThue', 'TienThue', 'ThanhTien', 'TyLeCKTT', 'TienCKTT', 'TongCong']

  const newColumns = listColumns.map((item, index) => {
    if (item === 'STT') {
      return {
        title: item,
        width: 200,
        dataIndex: item,
        key: item,
        render: (text, record, index) => index + 1,
      }
    }
    if (item === 'TienHang') {
      return {
        title: item,
        width: 200,
        dataIndex: item,
        key: item,
      }
    }

    if (item === 'ThanhTien') {
      return {
        title: item,
        width: 200,
        dataIndex: item,
        key: item,
      }
    }
    if (item === 'SoLuong') {
      return {
        title: item,
        width: 200,
        dataIndex: item,
        key: item,
        sorter: (a, b) => a.SoLuong - b.SoLuong,
        render: (text, record) => <InputNumber value={parseInt(text)} onChange={(value) => handleInputNumberChange(value, record.MaHang, item)} />,
      }
    }
    return {
      title: item,
      width: 200,
      dataIndex: item,
      editable: true,
      key: item,
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
    }
  })
  const defcolumns = [
    ...newColumns,
    {
      title: 'operation',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (dataSource.length >= 1 ? <BtnAction handleDelete={() => handleDelete(record.MaHang)} record={record} /> : null),
    },
  ]

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defcolumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        scroll={{
          x: 1500,
          y: true,
        }}
        size="small"
      />
    </div>
  )
}

export default EditTable
