/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Table, Select, InputNumber, Tooltip, Typography } from 'antd'
import BtnAction from './BtnAction'

const { Option } = Select
const { Text } = Typography
const EditTable = ({ param, handleEditData, yourMaHangOptions, yourTenHangOptions, ColumnTable, columName, typeTable, listHP }) => {
  const EditableContext = React.createContext(null)
  const [dataSource, setDataSource] = useState(param)

  useEffect(() => {
    setDataSource(param)
    const updatePrices = () => {
      setDataSource((prevDataSource) => {
        const newData = prevDataSource.map((item) => {
          const matchingHP = listHP?.find((hp) => hp.MaHang === item.MaHang)
          if (matchingHP) {
            return {
              ...item,
              DonGia: matchingHP.GiaBan || 0,
              TienHang: matchingHP.GiaBan * item.SoLuong,
            }
          }

          return item
        })

        // handleEditData(newData)
        return newData
      })
    }

    updatePrices()
  }, [param, listHP])
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
  // Hàm để tùy chỉnh kích thước drop-down
  const dropdownRender = (menu) => {
    return <div style={{ minHeight: '400px', overflowY: 'auto' }}>{menu}</div>
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
          updatedRow.TienHang = (updatedRow.SoLuong * updatedRow.DonGia).toFixed(ThongSo.SOLESOTIEN)
          updatedRow.TienHang = parseFloat(updatedRow.TienHang)
          updatedRow.TienThue = ((updatedRow.TienHang * updatedRow.TyLeThue) / 100).toFixed(ThongSo.SOLESOTIEN)
          updatedRow.TienThue = parseFloat(updatedRow.TienThue)
          updatedRow.ThanhTien = (updatedRow.TienHang + (updatedRow.TienHang * updatedRow.TyLeThue) / 100).toFixed(ThongSo.SOLESOTIEN)
          updatedRow.ThanhTien = parseFloat(updatedRow.ThanhTien)
          updatedRow.TienCKTT = ((updatedRow.ThanhTien * updatedRow.TyLeCKTT) / 100).toFixed(ThongSo.SOLESOTIEN)
          updatedRow.TienCKTT = parseFloat(updatedRow.TienCKTT)
          updatedRow.TongCong = (updatedRow.ThanhTien - updatedRow.TienCKTT).toFixed(ThongSo.SOLESOTIEN)
          updatedRow.TongCong = parseFloat(updatedRow.TongCong)

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
          const optionsArray = dataIndex === 'MaHang' ? listHP : listHP

          const selectedOption = optionsArray.find((option) => option[dataIndex] === values[dataIndex]) || {}

          const GiaBan = selectedOption.GiaBan
          const updatedRow = {
            ...record,
            ...values,
            TenHang: selectedOption.TenHang || '',
            MaHang: selectedOption.MaHang || '',
            DonGia: GiaBan || 0,
            SoLuong: record.SoLuong || values.SoLuong || 1,
            TyLeCKTT: 0,
            TonKho: selectedOption.TonKho || true,
            TienThue: selectedOption.TienThue || undefined,
            DVT: selectedOption.DVT,
            TienHang: selectedOption.DonGia || undefined,
            TyLeThue: 0,
            ThanhTien: selectedOption.DonGia || undefined,
            DVTKho: selectedOption.DVT,
            DVTQuyDoi: selectedOption.DVTQuyDoi,

            // TienCKTT: 0,
            // TongCong: selectedOption.DonGia || undefined,
          }
          //

          handleSave(updatedRow)
        } else {
          handleSave({
            ...record,
            ...values,
          })
        }
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      const isSelect = dataIndex === 'MaHang' || dataIndex === 'TenHang' || dataIndex === 'DVT'

      const listDVT = record.DVTKho !== record.DVTQuyDoi ? [record.DVTKho, record.DVTQuyDoi] : [record.DVTQuyDoi]
      // const listDVT = [record.DVTKho, record.DVTQuyDoi]

      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              // message: `không để trống ${title}`,
            },
          ]}
          initialValue={record[dataIndex]}
        >
          {isSelect ? (
            <Select ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: '100%' }} showSearch dropdownMatchSelectWidth={false} listHeight={310}>
              {dataIndex === 'MaHang'
                ? yourMaHangOptions?.map((option) => (
                    <Option key={option.MaHang} value={option.MaHang}>
                      {`${option.MaHang} - ${option.TenHang}`}
                    </Option>
                  ))
                : dataIndex === 'TenHang'
                  ? yourTenHangOptions?.map((option) => (
                      <Option key={option.TenHang} value={option.TenHang}>
                        {`${option.MaHang} - ${option.TenHang}`}
                      </Option>
                    ))
                  : typeTable !== 'BanHang'
                    ? listDVT.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))
                    : null}
            </Select>
          ) : dataIndex === 'SoLuong' || dataIndex === 'DonGia' ? (
            <InputNumber
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              min={1}
              max={999999999999}
              width={500}
              style={dataIndex !== 'SoLuong' ? { width: 150 } : { width: 100 }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                return isNaN(parsedValue)
                  ? null
                  : dataIndex === 'SoLuong'
                    ? parseFloat(parsedValue.toFixed(ThongSo.SOLESOLUONG))
                    : parseFloat(parsedValue.toFixed(ThongSo.SOLEDONGIA))
              }}
            />
          ) : dataIndex === 'TyLeThue' || dataIndex === 'TyLeCKTT' ? (
            <InputNumber
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              max={100}
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                return isNaN(parsedValue) ? null : parseFloat(parsedValue.toFixed(ThongSo.SOLETYLE))
              }}
            />
          ) : (
            <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} max={100} min={0} style={{ width: '100%' }} />
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

  const handleDelete = (MaHang) => {
    setDataSource((prevDataSource) => {
      const newData = prevDataSource.filter((item) => item.MaHang !== MaHang)

      handleEditData(newData)

      return newData
    })
  }

  const listColumns = ColumnTable ? ColumnTable : []
  const ThongSo = JSON.parse(localStorage.getItem('ThongSo'))
  const newColumns = listColumns.map((item, index) => {
    if (item === 'STT') {
      return {
        title: columName[item] || item,
        width: 80,
        dataIndex: item,
        key: item,
        align: 'center',
        render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
        fixed: 'left',
      }
    }

    if (item === 'MaHang') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        editable: true,
        key: item,
        fixed: 'left',
        align: 'center',
        sorter: (a, b) => a[item].localeCompare(b[item]),
        showSorterTooltip: false,
        render: (text) => <div className="text-start truncate">{text}</div>,
      }
    }
    if (item === 'TenHang') {
      return {
        title: columName[item] || item,
        width: 250,
        dataIndex: item,
        editable: true,
        key: item,
        fixed: 'left',
        align: 'center',
        sorter: (a, b) => a[item].localeCompare(b[item]),
        showSorterTooltip: false,
        render: (text) => <div className="text-start truncate">{text}</div>,
      }
    }

    if (item === 'DVT' && typeTable === 'BanHang') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        // editable: true,
        key: item,
        align: 'center',
        render: (text, record, index) => <div style={{ textAlign: 'center' }}>{text}</div>,
        sorter: (a, b) => a[item].localeCompare(b[item]),
        showSorterTooltip: false,
      }
    }

    if (item === 'SoLuong') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        editable: true,
        key: item,
        align: 'center',

        sorter: (a, b) => a[item] - b[item],
        showSorterTooltip: false,

        render: (text) => (
          <div style={{ textAlign: 'end' }}>
            {text !== undefined ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOLUONG, maximumFractionDigits: ThongSo.SOLESOLUONG }) : ''}
          </div>
        ),
      }
    }
    if (item === 'DonGia') {
      return {
        title: columName[item] || item,
        width: 200,
        dataIndex: item,
        editable: true,
        key: item,

        ellipsis: true,
        render: (text) => (
          <div style={{ textAlign: 'end' }}>
            {text !== undefined ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA }) : ''}
          </div>
        ),
        align: 'center',

        sorter: (a, b) => a[item] - b[item],
        showSorterTooltip: false,
      }
    }
    if (item === 'TyLeThue') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        editable: true,
        key: item,
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'end' }}>
            {text !== undefined ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLETYLE, maximumFractionDigits: ThongSo.SOLETYLE }) : ''}
          </div>
        ),
        sorter: (a, b) => a[item] - b[item],
        showSorterTooltip: false,
      }
    }

    if (item === 'TyLeCKTT') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        editable: true,
        key: item,
        align: 'center',
        sorter: (a, b) => a[item] - b[item],

        showSorterTooltip: false,

        render: (text) => (
          <div style={{ textAlign: 'end' }}>
            {text !== undefined ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLETYLE, maximumFractionDigits: ThongSo.SOLETYLE }) : ''}
          </div>
        ),
      }
    }
    if (item === 'TienHang' || item === 'TienThue' || item === 'ThanhTien' || item === 'TienCKTT' || item === 'TongCong') {
      return {
        title: columName[item] || item,
        width: 200,
        dataIndex: item,
        key: item,

        render: (text) => {
          const formattedValue =
            text !== 0 ? (
              Number(text) > 999999999999 ? (
                <Tooltip placement="topLeft" title={999999999999}>
                  {Number(999999999999).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOTIEN, maximumFractionDigits: ThongSo.SOLESOTIEN })}
                </Tooltip>
              ) : (
                Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOTIEN, maximumFractionDigits: ThongSo.SOLESOTIEN }) || 0
              )
            ) : (
              <div
                style={{
                  color: 'rgba(0, 0, 0, 0.25)',
                }}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOTIEN, maximumFractionDigits: ThongSo.SOLESOTIEN }) || 0}
              </div>
            )

          return <div>{formattedValue}</div>
        },
        align: 'center',
        showSorterTooltip: false,

        sorter: (a, b) => a[item] - b[item],
      }
    }
    return {
      title: columName[item] || item,
      width: 150,
      dataIndex: item,
      editable: true,
      key: item,
      align: 'center',
      showSorterTooltip: false,
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
      width: 30,
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
        loading={dataSource.length !== 0 || typeTable === 'create' ? false : true}
        className={'h250'}
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
        pagination={false}
        summary={(pageData) => {
          return (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row>
                {/* <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"></Table.Summary.Cell> */}

                {columns
                  .filter((column) => column.render)
                  .map((column) => {
                    const isNumericColumn = typeof dataSource[0]?.[column.dataIndex] === 'number'
                    // && column.dataIndex !== 'STT'
                    return (
                      <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'center' : 'center'} className="text-end font-bold  bg-[#f1f1f1] pr-5">
                        {isNumericColumn ? (
                          <Text strong align="center">
                            {Number(pageData.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                              minimumFractionDigits: ThongSo.SOLESOTIEN,
                              maximumFractionDigits: ThongSo.SOLESOTIEN,
                            })}
                          </Text>
                        ) : null}
                      </Table.Summary.Cell>
                    )
                  })}
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </div>
  )
}

export default EditTable
