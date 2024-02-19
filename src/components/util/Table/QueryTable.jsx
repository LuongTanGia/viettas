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
import { bool } from 'prop-types'

const { Text } = Typography

function Tables({
  title,
  hiden,
  loadingSearch,
  param,
  columName,
  height,
  handleView,
  handleEdit,
  typeTable,
  handleAddData,
  handleDelete,
  handleChangePhieuThu,
  selectMH,
  textSearch,
}) {
  const [soLuong, setSoLuong] = useState(1)

  const DataColumns = param ? param[0] : []

  const keysOnly =
    typeTable !== 'listHelper'
      ? Object.keys(DataColumns || []).filter((key) => key !== 'MaSoThue')
      : ['MaHang', 'TenHang', 'DVT', 'LapRap', 'TonKho', 'SoLuongTon', 'GiaBan', 'NhomHang']

  const ThongSo = JSON.parse(localStorage.getItem('ThongSo'))

  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    setSearchText(textSearch)
  }, [textSearch])

  const renderHighlightedCell = (text) => {
    if (!searchText || typeof text !== 'string' || !text.toLowerCase().includes(searchText.toLowerCase())) {
      return <div>{text}</div>
    }

    const parts = text.split(new RegExp(`(${searchText})`, 'gi'))
    return (
      <div>
        {parts.map((part, index) => (
          <span key={index} style={part.toLowerCase() === searchText.toLowerCase() ? { background: 'yellow' } : {}}>
            {part}
          </span>
        ))}
      </div>
    )
  }
  keysOnly?.unshift('STT')
  const listColumns = keysOnly?.filter((value) => !hiden?.includes(value))
  const newColumns = listColumns?.map((item, index) => {
    if (item === 'STT') {
      return {
        title: columName[item] || item,
        width: 70,
        dataIndex: 'key',
        key: index,

        showSorterTooltip: false,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record, index) => (
          <Tooltip placement="topLeft" title={index} className="truncate" color="blue">
            {renderHighlightedCell(index + 1)}
          </Tooltip>
        ),
      }
    }

    const isTienColumn = item.includes('ThanhToan') && item !== 'TTTienMat'
    const isTGiaBan = item.includes('SoDusss')
    const isTienColumn2 = item.includes('PhatSinhNo')
    const isTienColumn3 = item.includes('SoDu')

    const isTyLe = item.includes('TyLeCKTT')
    const isTongSoLuong = item.includes('SoDussss')

    const isNumericColumn = isTienColumn || isTienColumn2 || isTienColumn3 //TyLeCKTT

    return {
      title: columName[item] || item,
      responsive: ['lg'],
      width: 170,
      dataIndex: item,
      editable: true,
      align: 'center',
      sorter: (a, b) => {
        if (typeof a[item] === 'number' && typeof b[item] === 'number' && a[item] !== undefined && b[item] !== undefined) {
          return a[item] - b[item]
        } else {
          const aString = a[item]?.toString() || ''
          const bString = b[item]?.toString() || ''
          return aString.localeCompare(bString) || 0
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
          isTienColumn || isTienColumn2 || isTienColumn3
            ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOTIEN, maximumFractionDigits: ThongSo.SOLESOTIEN })
            : isTyLe
              ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLETYLE, maximumFractionDigits: ThongSo.SOLETYLE })
              : isTongSoLuong
                ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLESOLUONG, maximumFractionDigits: ThongSo.SOLESOLUONG })
                : isTGiaBan
                  ? Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })
                  : text
        return (
          <div
            style={{
              textAlign: isNumericColumn ? 'right' : isTyLe ? 'right' : item.includes('Tong') ? 'right' : item === 'SoLuongTon' ? 'right' : item === 'DVT' ? 'center' : 'left',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
              fontWeight: text < 0 ? 'bold' : '',
            }}
          >
            {renderHighlightedCell(formattedValue)}
          </div>
        )
      },
    }
  })

  const columns = [...newColumns]
  const columns_2 = [
    {
      title: '#',
      dataIndex: 'name',
      key: 'name',
      width: 70,
      fixed: 'left',
      align: 'center',
      render: (text, record, index) => (
        <Tooltip placement="topLeft" title={index} className="truncate" color="blue">
          {renderHighlightedCell(index + 1)}
        </Tooltip>
      ),
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },

    {
      title: 'Mã Kh.Hàng',
      dataIndex: 'MaDoiTuong',
      key: 'TenDoiTuong',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (text) => {
        return (
          <div
            style={{
              textAlign: 'left',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
              fontWeight: text < 0 ? 'bold' : '',
            }}
          >
            {text}
          </div>
        )
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
      width: 200,
      align: 'center',
      render: (text) => {
        return (
          <div
            style={{
              textAlign: 'left',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
              fontWeight: text < 0 ? 'bold' : '',
            }}
          >
            {text}
          </div>
        )
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChiDoiTuong',
      key: 'DiaChiDoiTuong',
      width: 300,
      align: 'center',
      render: (text) => {
        return (
          <div
            style={{
              textAlign: 'left',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
              fontWeight: text < 0 ? 'bold' : '',
            }}
          >
            {text}
          </div>
        )
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Số dư đầu',
      dataIndex: 'SoDuDK',
      key: 'SoDuDK',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.SoDuDK - b.SoDuDK,

      render: (text) => {
        return (
          <div
            style={{
              textAlign: 'right',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
              fontWeight: text < 0 ? 'bold' : '',
            }}
            className=" truncate"
            title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
          >
            {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
          </div>
        )
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Phát sinh, tăng nợ',
      children: [
        {
          title: title === 'DauVao' ? 'Mua hàng' : 'Bán hàng',
          dataIndex: title === 'DauVao' ? 'PhatSinhNo_PMH' : 'PhatSinhNo_PBS',
          key: title === 'DauVao' ? 'PhatSinhNo_PMH' : 'PhatSinhNo_PBS',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.PhatSinhNo_PBS - b.PhatSinhNo_PBS,
        },
        {
          title: 'Điểu chỉnh',
          dataIndex: 'PhatSinhNo_DC',
          key: 'PhatSinhNo_DC',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.PhatSinhNo_DC - b.PhatSinhNo_DC,
        },
        {
          title: title === 'DauVao' ? 'Thu hàng trả' : 'Chi trả hàng',
          dataIndex: title === 'DauVao' ? 'PhatSinhNo_Thu_XTR' : 'PhatSinhNo_Chi_NTR',
          key: title === 'DauVao' ? 'PhatSinhNo_Thu_XTR' : 'PhatSinhNo_Chi_NTR',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.PhatSinhNo_Chi_NTR - b.PhatSinhNo_Chi_NTR,
        },
        {
          title: 'Tổng',
          dataIndex: 'PhatSinhNo',
          key: 'PhatSinhNo',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.PhatSinhNo - b.PhatSinhNo,
        },
      ],
    },
    {
      title: 'Thanh toán, giảm nợ',
      children: [
        {
          title: title === 'DauVao' ? 'Chi công nợ' : 'Thu công nợ',
          dataIndex: title === 'DauVao' ? 'ThanhToan_Chi_PMH' : 'ThanhToan_Thu_PBS',
          key: title === 'DauVao' ? 'ThanhToan_Chi_PMH' : 'ThanhToan_Thu_PBS',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.ThanhToan_Thu_PBS - b.ThanhToan_Thu_PBS,
        },
        {
          title: 'Điểu chỉnh',
          dataIndex: 'ThanhToan_DC',
          key: 'ThanhToan_DC',
          width: 150,
          align: 'center',

          sorter: (a, b) => a.ThanhToan_DC - b.ThanhToan_DC,
          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
        },
        {
          title: title === 'DauVao' ? 'Trả hàng' : 'Trả hàng',
          dataIndex: title === 'DauVao' ? 'ThanhToan_XTR' : 'ThanhToan_NTR',
          key: title === 'DauVao' ? 'ThanhToan_XTR' : 'ThanhToan_NTR',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.ThanhToan_NTR - b.ThanhToan_NTR,
        },
        {
          title: 'Tổng',
          dataIndex: 'ThanhToan',
          key: 'ThanhToan',
          width: 150,
          align: 'center',

          render: (text) => {
            return (
              <div
                style={{
                  textAlign: 'right',
                  opacity: text === 0 ? 0.5 : 1,
                  color: text < 0 ? 'red' : 'black',
                  fontWeight: text < 0 ? 'bold' : '',
                }}
                className=" truncate"
                title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              >
                {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
              </div>
            )
          },
          sorter: (a, b) => a.ThanhToan - b.ThanhToan,
        },
      ],
    },
    {
      title: 'Số dư cuối',
      dataIndex: 'SoDuCK',
      key: 'SoDuCK',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.SoDuCK - b.SoDuCK,

      render: (text) => {
        return (
          <div
            style={{
              textAlign: 'right',
              opacity: text === 0 ? 0.5 : 1,
              color: text < 0 ? 'red' : 'black',
              fontWeight: text < 0 ? 'bold' : '',
            }}
            className=" truncate w-[100%] "
            title={Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
          >
            {Number(text).toLocaleString('en-US', { minimumFractionDigits: ThongSo.SOLEDONGIA, maximumFractionDigits: ThongSo.SOLEDONGIA })}
          </div>
        )
      },
      fixed: 'right',

      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
  ]
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => {
        const cellValue = record[col.dataIndex]
        let inputtype
        if (typeof cellValue === 'number') {
          inputtype = 'number'
        } else if (typeof cellValue === 'boolean' && param !== null) {
          inputtype = 'checkbox'
        } else if (col.dataIndex === 'MaHang' || col.dataIndex === 'DVT') {
          inputtype = 'select'
        } else {
          inputtype = 'text'
        }

        return {
          record,
          inputtype,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }
      },
    }
  })
  const originData = param?.map((record, index) => ({
    key: index,
    ...record,
  }))
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const initialSelectedRowKeys = [selectMH]
  const initialSelectedMaHangs = [selectMH]

  const [selectedRowKeys, setSelectedRowKeys] = useState(initialSelectedRowKeys)
  const [selectedMaHangs, setSelectedMaHangs] = useState(initialSelectedMaHangs)

  useEffect(() => {
    setData(originData)
    const setKey = originData?.filter((item) => initialSelectedRowKeys.includes(item.SoChungTu))

    setSelectedRowKeys(setKey?.map((item) => item.SoChungTu))
    setSelectedRecord(selectMH)
  }, [param, selectMH])
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record) => record.index === editingKey

  const onRowClick = (record) => {
    return {
      onDoubleClick: () => {
        typeTable === 'listHelper'
          ? handleAddData({
              ...record,
              SoLuong: soLuong,
              DonGia: record.GiaBan,
              TyLeCKTT: 0,
              TienHang: record.GiaBan * soLuong,
              ThanhTien: record.GiaBan * soLuong,
              TienCKTT: 0,
              TongCong: record.GiaBan * soLuong,
            })
          : handleView(record)
      },
      onClick: () => {
        onSelectChange([record.key], [record])
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

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    const maHangs = selectedRows.map((record) => record.SoChungTu)
    const filteredMaHangs = maHangs.filter((maHang) => maHang !== null && maHang !== undefined)
    setSelectedMaHangs(filteredMaHangs)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleRowClick = (record) => {
    setSelectedRecord(record.SoChungTu)
  }
  const onChangeInphutSL = (value) => {
    setSoLuong(value)
  }

  return (
    <>
      {/* {typeTable !== 'listHelper' ? null : (
        <div className="pb-2 flex gap-2">
          <Text strong>Nhập số lượng cần thêm vào chi tiết :</Text>
          <InputNumber min={1} max={999} onChange={onChangeInphutSL} size="small" />
        </div>
      )} */}
      <Form form={form} component={false}>
        <Table
          loading={loadingSearch}
          // rowSelection={rowSelection}
          className={height}
          columns={title === 'DauVao' || title === 'DauRa' ? columns_2 : mergedColumns}
          dataSource={data}
          // rowClassName="editable-row"

          bordered
          onRow={(record) => ({
            ...onRowClick(record),
            onClick: () => handleRowClick(record),
          })}
          scroll={{
            y: 300,
            x: 200,
          }}
          scrollToFirstRowOnChange
          size="small"
          summary={
            typeTable !== 'listHelper'
              ? () => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      {/* <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> {data.length + 1}</Table.Summary.Cell> */}
                      {columns
                        .filter((column) => column.render)
                        .map((column, index) => {
                          const isNumericColumn = typeof data[0]?.[column.dataIndex] === 'number'
                          return (
                            <Table.Summary.Cell
                              index={index}
                              key={`summary-cell-${index + 1}`}
                              align={isNumericColumn ? 'right' : 'left'}
                              className="text-end font-bold  bg-[#f1f1f1] truncate"
                            >
                              {isNumericColumn ? (
                                column.dataIndex === 'TongSoLuong' ? (
                                  <Text
                                    strong
                                    className=""
                                    title={Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: ThongSo.SOLESOLUONG,
                                      maximumFractionDigits: ThongSo.SOLESOLUONG,
                                    })}
                                  >
                                    {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: ThongSo.SOLESOLUONG,
                                      maximumFractionDigits: ThongSo.SOLESOLUONG,
                                    })}
                                  </Text>
                                ) : ['SoDuDK', 'PhatSinhNo_PBS', 'PhatSinhNo_Chi_NTR', 'PhatSinhNo', 'ThanhToan_Thu_PBS', 'ThanhToan_NTR', 'ThanhToan', 'SoDuCK'].includes(
                                    column.dataIndex,
                                  ) ? (
                                  <Text
                                    strong
                                    title={Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: ThongSo.SOLESOLUONG,
                                      maximumFractionDigits: ThongSo.SOLESOLUONG,
                                    })}
                                  >
                                    {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: ThongSo.SOLESOTIEN,
                                      maximumFractionDigits: ThongSo.SOLESOTIEN,
                                    })}
                                  </Text>
                                ) : ['TyLeCKTT'].includes(column.dataIndex) ? (
                                  <Text strong>
                                    {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: ThongSo.SOLETYLE,
                                      maximumFractionDigits: ThongSo.SOLETYLE,
                                    })}
                                  </Text>
                                ) : column.dataIndex === 'key' ? (
                                  <Text strong className="text-center">
                                    {data.length}
                                  </Text>
                                ) : (
                                  <Text strong>
                                    {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                      minimumFractionDigits: ThongSo.SOLESOTIEN,
                                      maximumFractionDigits: ThongSo.SOLESOTIEN,
                                    })}
                                  </Text>
                                )
                              ) : column.dataIndex === 'TTTienMat' ? (
                                <Text strong>{Object.values(data).filter((value) => value.TTTienMat).length}</Text>
                              ) : null}
                            </Table.Summary.Cell>
                          )
                        })}
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              : null
          }
          pagination={{
            defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
            showSizeChanger: true,
            pageSizeOptions: ['50', '100', '1000'],
            onShowSizeChange: (current, size) => {
              localStorage.setItem('pageSize', size)
            },
          }}
        />
      </Form>
    </>
  )
}

export default Tables
