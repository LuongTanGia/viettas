/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Table, Select, InputNumber } from 'antd'
import BtnAction from './BtnAction'

const { Option } = Select

const EditTable = ({ param, handleEditData, yourMaHangOptions, yourTenHangOptions, columnTable, columName }) => {
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
      const index = newData.findIndex((item) => item.STT === row.STT)

      if (index !== -1) {
        const item = newData[index]

        newData.splice(index, 1, {
          ...item,
          ...row,
          STT: index + 1,
        })

        const updatedRow = newData[index]

        if (updatedRow && updatedRow.SoLuong !== undefined && updatedRow.DonGia !== undefined) {
          updatedRow.TienHang = updatedRow.SoLuong * updatedRow.DonGia
          updatedRow.TienThue = (updatedRow.TienHang * updatedRow.TyLeThue) / 100
          updatedRow.ThanhTien = updatedRow.TienHang + ((updatedRow.TienHang || 0) * (updatedRow.TyLeThue || 0)) / 100
          updatedRow.TienCKTT = (updatedRow.ThanhTien * updatedRow.TyLeCKTT) / 100
          updatedRow.TongCong = updatedRow.TienCKTT + updatedRow.ThanhTien

          console.log('handleSave - newData:', newData)
          handleEditData(newData)
          return newData
        } else {
          console.error('SoLuong or DonGia is undefined in updatedRow:', updatedRow)
        }
      } else {
        console.error('Row not found in data.')
      }

      return prevDataSource // Trả về dữ liệu không thay đổi nếu không tìm thấy hàng.
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

        if (dataIndex === 'MaHang' || dataIndex === 'TenHang') {
          const optionsArray = dataIndex === 'MaHang' ? yourMaHangOptions : yourTenHangOptions

          const selectedOption = optionsArray.find((option) => option[dataIndex] === values[dataIndex]) || {}
          const GiaBan = selectedOption.GiaBan
          const updatedRow = {
            ...record,
            ...values,
            TenHang: selectedOption.TenHang || 0,
            MaHang: selectedOption.MaHang || 0,
            DonGia: GiaBan,
            SoLuong: record.SoLuong || values.SoLuong || 1,
            DVT: selectedOption.DVT || undefined,
          }
          console.log(updatedRow)
          handleSave(updatedRow)
        } else {
          handleSave({
            ...record,
            ...values,
          })
        }
        console.log(dataSource)
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children
    if (editable) {
      const isSelect = dataIndex === 'MaHang' || dataIndex === 'TenHang'

      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `không để trống ${title}`,
            },
          ]}
          initialValue={record[dataIndex]}
        >
          {isSelect ? (
            <Select ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: '100%' }} showSearch>
              {dataIndex === 'MaHang'
                ? yourMaHangOptions?.map((option) => (
                    <Option key={option.MaHang} value={option.MaHang}>
                      {`${option.MaHang} - ${option.TenHang}`}
                    </Option>
                  ))
                : yourTenHangOptions?.map((option) => (
                    <Option key={option.TenHang} value={option.TenHang}>
                      {`${option.MaHang} - ${option.TenHang}`}
                    </Option>
                  ))}
            </Select>
          ) : dataIndex === 'SoLuong' ? (
            <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={1} />
          ) : (
            <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} max={100} min={0} />
          )}
        </Form.Item>
      ) : (
        <div
          style={{
            paddingRight: 24,
            color: record[dataIndex] === 0 ? 'rgba(0, 0, 0, 0.25)' : 'inherit',
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

  const formatVND = (value) => {
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const listColumns = columnTable ? columnTable : []

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
    if (item === 'DVT') {
      return {
        title: item,
        width: 200,
        dataIndex: item,
        key: item,
        render: (text) => <div>{text}</div>,
        sorter: (a, b) => a[item] - b[item],
      }
    }
    if (item === 'TenHang') {
      return {
        title: item,
        width: 300,
        dataIndex: item,
        editable: true,
        key: item,
      }
    }
    if (item === 'TienHang' || item === 'TienThue' || item === 'ThanhTien' || item === 'TienCKTT' || item === 'TongCong' || item === 'DonGia') {
      return {
        title: item,
        width: 200,
        dataIndex: item,
        key: item,
        render: (text) =>
          text !== 0 ? (
            formatVND(text)
          ) : (
            <div
              style={{
                color: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              {formatVND(text) || 0}
            </div>
          ),
        sorter: (a, b) => a[item] - b[item],
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
      title: '',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (dataSource.length >= 1 ? <BtnAction handleDelete={() => handleDelete(record.MaHang)} record={record} typeTable={'detail'} /> : null),
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
        className={'h150'}
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
