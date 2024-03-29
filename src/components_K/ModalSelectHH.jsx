/* eslint-disable react/prop-types */
import { useState } from 'react'
import logo from '../assets/VTS-iSale.ico'
import icons from '../untils/icons'
import { Table, Input } from 'antd'
import { useSearchHH } from './myComponents/useSearchHH'
import ActionButton from '../components/util/Button/ActionButton'
import HighlightedCell from '../components/hooks/HighlightedCell'
import { CloseSquareFilled } from '@ant-design/icons'

const { BsSearch } = icons
const ModalSelectHH = ({ close, data, onRowCreate, onChangLoading }) => {
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [setSearchHH, filteredHH, searchHH] = useSearchHH(data)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const [lastSearchTime, setLastSearchTime] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowTotal, setSelectedRowTotal] = useState(0)

  const dataTable = filteredHH?.map((record) => ({
    key: record.MaHang,
    ...record,
  }))

  const handleChoose = () => {
    const defaultValues = {
      DonGia: 0,
      CoThue: false,
      TyLeThue: 0,
    }
    const newRow = selectedRows.map((row) => ({
      ...row,
      ...defaultValues,
    }))
    onRowCreate(newRow)
    // toast.success('Chọn hàng hóa thành công', {
    //   autoClose: 1000,
    // })

    close()
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      align: 'center',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 200,
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          {' '}
          <HighlightedCell text={text} search={searchHH} />
        </div>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      align: 'center',
      width: 250,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchHH} />
        </div>
      ),
    },
    // {
    //   title: 'Chọn',
    //   dataIndex: 'Chon',
    //   key: 'Chon',
    //   width: 60,
    //   align: 'center',
    //   render: (text) => <Checkbox value={text} />,

    //   showSorterTooltip: false,
    // },
  ]

  const handleSearch = (e) => {
    const currentTime = new Date().getTime()
    if (currentTime - lastSearchTime >= 1000 && e !== prevSearchValue) {
      setSearchHH(e)
      setLastSearchTime(currentTime)
      // setIsLoading(true)
      onChangLoading(true)
    }
  }
  const handleRowClick = (record) => {
    const selectedKey = record.MaHang
    const isSelected = selectedRowKeys.includes(selectedKey)
    const newSelectedRowKeys = isSelected ? selectedRowKeys.filter((key) => key !== selectedKey) : [...selectedRowKeys, selectedKey]
    setSelectedRowKeys(newSelectedRowKeys)

    const isDataRow = selectedRows.map((item) => item.MaHang).includes(selectedKey)
    let newSelectedRows = [...selectedRows]
    if (isDataRow) {
      newSelectedRows = selectedRows.filter((item) => item.MaHang !== selectedKey)
    } else {
      newSelectedRows.push(record)
    }
    setSelectedRows(newSelectedRows)
    setSelectedRowTotal(newSelectedRows.length)
  }

  const handleSelectAllRows = (selected, selectedRows, changeRows) => {
    const selectedRowKeys = selected ? changeRows.map((row) => row) : []
    setSelectedRows(selectedRowKeys)
    setSelectedRowTotal(selectedRowKeys.length)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className="md:w-[80vw] lg:w-[50vw] h-[600px] ">
          <div className="flex gap-2 items-center ">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">danh sách hàng hóa</label>
            <div>
              <BsSearch size={16} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
            </div>
          </div>
          <div className="flex mt-1 ">
            {isShowSearch && (
              <div className={`flex absolute left-[17rem] top-[18px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                <Input
                  allowClear={{
                    clearIcon: <CloseSquareFilled />,
                  }}
                  placeholder="Nhập ký tự bạn cần tìm"
                  onPressEnter={(e) => {
                    setPrevSearchValue(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  onBlur={(e) => handleSearch(e.target.value)}
                  onFocus={(e) => setPrevSearchValue(e.target.value)}
                />
              </div>
            )}
          </div>
          {/* table */}
          <Table
            // loading={isLoading}
            className="table_HH"
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedKeys) => {
                setSelectedRowKeys(selectedKeys)
              },
              onSelectAll: handleSelectAllRows,
            }}
            dataSource={dataTable}
            size="small"
            scroll={{
              y: 410,
            }}
            pagination={false}
            bordered
            rowKey={(record) => record.MaHang}
            onRow={(record) => ({
              // onDoubleClick: () => {
              //   handleChoose(record)
              // },
              onClick: () => {
                handleRowClick(record)
              },
            })}
            // Bảng Tổng
            summary={
              data === undefined
                ? null
                : () => {
                    return (
                      <Table.Summary fixed="bottom">
                        <Table.Summary.Row>
                          <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> {selectedRowTotal}</Table.Summary.Cell>
                          <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> </Table.Summary.Cell>
                          <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> </Table.Summary.Cell>
                          <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> </Table.Summary.Cell>
                          <Table.Summary.Cell className="text-end font-bold  bg-[#f1f1f1]"> </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }
            }
          />

          <div className="flex justify-end mt-3 gap-x-2">
            <ActionButton color={'slate-50'} title={'Xong'} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleChoose} isModal={true} />
            <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} isModal={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalSelectHH
