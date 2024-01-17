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

function Tables({ hiden, loadingSearch, param, columName, height, handleView, handleEdit, typeTable, handleAddData, handleDelete, handleChangePhieuThu, selectMH, textSearch }) {
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

  const listColumns = keysOnly?.filter((value) => !hiden?.includes(value))
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
        // fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (address) => (
          <Tooltip placement="topLeft" title={address} className="truncate" color="blue">
            {renderHighlightedCell(address)}
          </Tooltip>
        ),
      }
    }
    if (item === 'NhomHang') {
      return {
        title: columName[item] || item,
        width: 290,
        dataIndex: item,
        key: index,
        sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
        showSorterTooltip: false,
        align: 'center',
        // fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (address) => (
          <Tooltip placement="topLeft" title={address} className=" truncate" color="blue">
            {renderHighlightedCell(address)}
          </Tooltip>
        ),
      }
    }
    if (item === 'TenHang') {
      return {
        title: columName[item] || item,
        width: 250,
        dataIndex: item,

        key: index,
        sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
        showSorterTooltip: false,
        align: 'center',
        // fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (address) => (
          <Tooltip placement="topLeft" title={address} className=" truncate" color="blue">
            {address}
          </Tooltip>
        ),
      }
    }
    // if (item === 'LapRap' || item === 'TonKho') {
    //   return {
    //     title: columName[item] || item,
    //     width: 100,
    //     dataIndex: item,
    //     key: index,
    //     sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
    //     showSorterTooltip: false,
    //     align: 'center',
    //     // fixed: 'left',
    //     ellipsis: {
    //       showTitle: false,
    //     },
    //     render: (address) => (
    //       <Tooltip placement="topLeft" title={address}>
    //         {address}
    //       </Tooltip>
    //     ),
    //   }
    // }
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
        render: (text) => <div style={{ textAlign: 'center' }}>{renderHighlightedCell(text ? dayjs(text).format('DD/MM/YYYY') : '')}</div>,
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
        render: (value) => (
          <Tooltip placement="topLeft" title={value} className=" truncate" color="blue">
            {renderHighlightedCell(value ? dayjs(value).format('DD/MM/YYYY hh:mm:ss') : '')}
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
          <Tooltip placement="topLeft" title={address} className=" truncate" color="blue">
            {renderHighlightedCell(address)}
          </Tooltip>
        ),
      }
    }
    const isTienColumn = item.includes('Tien') && item !== 'TTTienMat'
    const isTGiaBan = item.includes('GiaBan')
    const isTienColumn2 = item.includes('TongTongCong')
    const isTyLe = item.includes('TyLeCKTT')
    const isTongSoLuong = item.includes('SoLuong')

    const isNumericColumn = isTienColumn || item.includes('Gia') || item.includes('Thue') || item.includes('TyLeCKTT') //TyLeCKTT

    return {
      title: columName[item] || item,
      width:
        item === 'DiaChi'
          ? 250
          : item === 'NguoiTao'
            ? 250
            : item === 'NguoiSuaCuoi'
              ? 250
              : item === 'TTTienMat'
                ? 100
                : item === 'TonKho' || item === 'LapRap'
                  ? 100
                  : 150 || 100,
      dataIndex: item,
      editable: true,
      align: 'center',
      sorter: (a, b) => {
        const keywords = ['Tong', 'Gia', 'Tien', 'TLCK', 'So', 'Thue']
        const soCT = ['SoChungTu']
        const includesKeyword = soCT.some((keyword) => item.includes(keyword))
        const soCT_includes = keywords.some((keyword) => item.includes(keyword))
        if (soCT_includes && a[item] !== undefined && b[item] !== undefined) {
          return parseInt(a[item].split('.')[1]) - parseInt(b[item].split('.')[1])
        }
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
        if (typeof cellValue === 'number') {
          inputType = 'number'
        } else if (typeof cellValue === 'boolean' && param !== null) {
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
        {typeTable !== 'listHelper' ? (
          <Table
            loading={loadingSearch}
            // rowSelection={rowSelection}
            className={height}
            columns={mergedColumns}
            dataSource={data}
            // rowClassName="editable-row"

            rowClassName={(record) => {
              if (record.SoChungTu === selectedRecord) {
                return 'highlight-row'
              }
              return ''
            }}
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
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row>
                        {/* <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> {data.length + 1}</Table.Summary.Cell> */}
                        {columns
                          .filter((column) => column.render)
                          .map((column) => {
                            const isNumericColumn = typeof data[0]?.[column.dataIndex] === 'number'

                            return (
                              <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                {isNumericColumn ? (
                                  // Use conditional rendering based on column.dataIndex
                                  column.dataIndex === 'TongSoLuong' ? (
                                    <Text strong>
                                      {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: ThongSo.SOLESOLUONG,
                                        maximumFractionDigits: ThongSo.SOLESOLUONG,
                                      })}
                                    </Text>
                                  ) : ['TongTienHang', 'TongTienThue', 'TongThanhTien', 'TongTienCKTT', 'TongTongCong'].includes(column.dataIndex) ? (
                                    <Text strong>
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
                                  ) : (
                                    <Text strong>
                                      {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      })}
                                    </Text>
                                  )
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
        ) : (
          <Table
            loading={loadingSearch}
            className={height}
            columns={mergedColumns}
            dataSource={data}
            bordered
            onRow={(record) => ({
              ...onRowClick(record),
            })}
            scroll={{
              y: 300,
              x: 200,
            }}
            scrollToFirstRowOnChange
            size="small"
            summary={
              typeTable !== 'listHelper'
                ? () => {
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row>
                          {/* <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"></Table.Summary.Cell> */}
                          {columns
                            .filter((column) => column.render)
                            .map((column) => {
                              const isNumericColumn = typeof data[0]?.[column.dataIndex] === 'number'

                              return (
                                <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                  {isNumericColumn ? (
                                    <Text strong>
                                      {Number(data.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
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
                  }
                : null
            }
            pagination={{
              defaultPageSize: 50,
              showSizeChanger: true,
              pageSizeOptions: ['50', '100', '1000'],
              onShowSizeChange: (current, size) => {
                console.log(size, current, '???')
              },
            }}
          />
        )}
      </Form>
    </>
  )
}

export default Tables
