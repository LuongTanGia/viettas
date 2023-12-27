/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Table, Typography, Select, Form, Input, InputNumber, Popconfirm, Checkbox, Space, Button, Tooltip } from 'antd'
import './table.css'
import BtnAction from './BtnAction'
import { useEffect, useState } from 'react'
import { FcServices } from 'react-icons/fc'
import dayjs from 'dayjs'

const { Text } = Typography
const getInputNode = (inputType, record, dataIndex, text, typeTable, form, onChange) => {
  switch (inputType) {
    case 'number':
      return <InputNumber value={text} onChange={(value) => onChange && onChange(dataIndex, value)} />
    case 'checkbox':
      const checked = text // Giữ giá trị hiện tại
      const inputNode = <Checkbox checked={checked} onChange={(e) => onChange && onChange(dataIndex, e.target.checked)} />
      return inputNode
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

function Tables({ param, columName, height, handleView, handleEdit, typeTable, handleAddData, handleDelete, handleChangePhieuThu }) {
  const [pageSize, setPageSize] = useState('20')
  const [page, setPage] = useState('1')
  const [hiden, setHiden] = useState([])
  const DataColumns = param ? param[0] : []

  const keysOnly = Object.keys(DataColumns || []).filter((key) => key !== 'MaSoThue')

  const ThongSo = JSON.parse(localStorage.getItem('ThongSo'))

  const listColumns = keysOnly?.filter((value) => !hiden.includes(value))
  const newColumns = listColumns.map((item, index) => {
    if (item === 'DiaChi') {
      return {
        title: columName[item] || item,
        width: 200,
        dataIndex: item,
        key: index,
        sorter: (a, b) => a.DiaChi.localeCompare(b.DiaChi),
        showSorterTooltip: false,
        align: 'center',

        ellipsis: {
          showTitle: false,
        },
        render: (address) => (
          <Tooltip placement="topLeft" title={address}>
            {address}
          </Tooltip>
        ),
      }
    }
    if (item === 'NgayCTu' || item === 'DaoHan') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        key: index,
        align: 'center',
        sorter: (a, b) => dayjs(a[item]).unix() - dayjs(b[item]).unix(),
        showSorterTooltip: false,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? dayjs(text).format('DD/MM/YYYY') : ''}</div>,
      }
    }
    if (item === 'NgayTao' || item === 'NgaySuaCuoi') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        key: index,
        align: 'center',
        sorter: (a, b) => {
          const dateA = new Date(a[item])
          const dateB = new Date(b[item])

          if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return dateA.getTime() - dateB.getTime()
          } else if (!isNaN(dateA.getTime())) {
            return -1
          } else if (!isNaN(dateB.getTime())) {
            return 1
          } else {
            return 0
          }
        },
        showSorterTooltip: false,
        ellipsis: {
          showTitle: false,
        },
        render: (address) => (
          <Tooltip placement="topLeft" title={address}>
            {address}
          </Tooltip>
        ),
      }
    }
    if (item === 'NguoiSuaCuoi' || item === 'NguoiTao') {
      return {
        title: columName[item] || item,
        width: 150,
        dataIndex: item,
        key: index,

        sorter: (a, b) => a[item]?.toString().localeCompare(b[item]?.toString()),
        showSorterTooltip: false,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (address) => (
          <Tooltip placement="topLeft" title={address}>
            {address}
          </Tooltip>
        ),
      }
    }
    const isTienColumn = item.includes('Tien') && item !== 'TTTienMat'
    const isTienColumn2 = item.includes('TongTongCong')
    const isSoluong = item.includes('TyLeCKTT')
    const isTongSoLuong = item.includes('TongSoLuong')

    const isNumericColumn = isTienColumn || item.includes('Gia') || item.includes('Thue') || item.includes('TyLeCKTT') //TyLeCKTT

    return {
      title: columName[item] || item,
      width: item === 'DiaChi' ? 250 : item === 'NguoiTao' ? 250 : item === 'NguoiSuaCuoi' ? 250 : item === 'TTTienMat' ? 100 : 150 || 100,
      dataIndex: item,
      editable: true,

      align: 'center',
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
      showSorterTooltip: false,
      render: (text, record) => {
        if (item === 'TTTienMat' || item === 'LapRap' || item === 'TonKho') {
          return (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <Checkbox checked={text} onChange={(e) => handleCheckboxChange(e.target.checked, record)} />
            </div>
          )
        }

        const formattedValue =
          isTienColumn || isTienColumn2
            ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOTIEN, maximumFractionDigits: ThongSo.SOLESOTIEN })
            : isSoluong
              ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLETYLE, maximumFractionDigits: ThongSo.SOLETYLE })
              : isTongSoLuong
                ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOLUONG, maximumFractionDigits: ThongSo.SOLESOLUONG })
                : text
        return (
          <div
            style={{
              textAlign: isNumericColumn ? 'right' : isSoluong ? 'right' : item.includes('Tong') ? 'right' : item === 'SoLuongTon' ? 'right' : item === 'DVT' ? 'center' : 'left',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
            }}
          >
            {formattedValue}
          </div>
        )
      },
    }
  })

  const columns = [
    ...newColumns,

    typeTable !== 'listHelper'
      ? {
          title: 'Action',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: (record) => <BtnAction handleView={handleView} record={record} handleEdit={handleEdit} handleDelete={handleDelete} handleChangePhieuThu={handleChangePhieuThu} />,
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
  // const formatVND = (value) => {
  //   return Number(value).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })
  // }
  const originData = param?.map((record, index) => ({
    key: index,
    ...record,
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

  const onRowClick = (record) => {
    return {
      onDoubleClick: () => {
        typeTable === 'listHelper' ? handleAddData({ ...record, SoLuong: 1, DonGia: record.GiaBan, TyLeCKTT: 0, TienHang: 0, ThanhTien: 0 }) : handleView(record)
      },
      onClick: () => {
        onSelectChange([record.key], [record])
      },
    }
  }
  const [selectVisible, setSelectVisible] = useState(false)
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
  const handleToggleSelect = () => {
    setSelectVisible(!selectVisible)
  }

  // select checkbox
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedMaHangs, setSelectedMaHangs] = useState([])

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys)
    const maHangs = selectedRows.map((record) => record.SoChungTu)
    const filteredMaHangs = maHangs.filter((maHang) => maHang !== null && maHang !== undefined)
    setSelectedMaHangs(filteredMaHangs)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <>
      <Button onClick={handleToggleSelect} className="mr-4 ">
        Ẩn/hiện cột
      </Button>
      {selectVisible && (
        <Select
          mode="tags"
          style={{ width: 500 }}
          placeholder="Chọn Cột Muốn Ẩn"
          onChange={handleChange}
          options={options}
          optionRender={(option) => <Space>{option.data.label}</Space>}
          value={hiden}
        />
      )}

      <Form form={form} component={false}>
        <Table
          rowSelection={rowSelection}
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
            position: 'bottom',
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            },
          }}
          bordered
          onRow={(record) => ({
            ...onRowClick(record),
          })}
          scroll={{
            y: 240,
            // x: true,
          }}
          scrollToFirstRowOnChange
          size="small"
          // summary={(pageData) => {
          //   return (
          //     <Table.Summary fixed="bottom">
          //       <Table.Summary.Row>
          //         <Table.Summary.Cell></Table.Summary.Cell>
          //         {columns
          //           .filter((column) => column.render)
          //           .map((column) => {
          //             const isNumericColumn = typeof data[0]?.[column.dataIndex] === 'number'

          //             return (
          //               <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'}>
          //                 {isNumericColumn ? (
          //                   <Text strong>
          //                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
          //                       pageData.reduce((total, item) => total + (item[column.dataIndex] || 0), 0),
          //                     )}
          //                   </Text>
          //                 ) : null}
          //               </Table.Summary.Cell>
          //             )
          //           })}
          //       </Table.Summary.Row>
          //     </Table.Summary>
          //   )
          // }}
        />
      </Form>
    </>
  )
}

export default Tables
