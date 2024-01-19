/* eslint-disable react/prop-types */
import { useState } from 'react'
import logo from '../assets/VTS-iSale.ico'
import icons from '../untils/icons'
import { Table, Checkbox } from 'antd'
import { formatQuantity } from '../action/Actions'
import { useSearchHH } from './myComponents/useSearchHH'
import ActionButton from '../components/util/Button/ActionButton'
import HighlightedCell from '../components_T/hooks/HighlightedCell'

const { BsSearch } = icons
const ModalHH = ({ close, data, onRowCreate, dataThongSo }) => {
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [setSearchPMH, filteredPMH, searchHH] = useSearchHH(data)
  // const [pageSize, setPageSize] = useState(50)

  // const handleRowClick = (dataRow) => {
  //   setSelectedRow(dataRow.MaHang)
  // }

  const dataTable = filteredPMH?.map((record, index) => ({
    key: index,
    ...record,
  }))
  const handleChoose = (dataRow) => {
    const defaultValues = {
      SoLuong: 1,
      DonGia: 0,
      TienHang: 0,
      TyLeThue: 0,
      TienThue: 0,
      ThanhTien: 0,
    }

    const newRow = { ...dataRow, ...defaultValues }

    onRowCreate(newRow)
  }
  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 20,
      hight: 10,
      fixed: 'left',
      align: 'center',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 50,
      fixed: 'left',
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
      fixed: 'left',
      width: 100,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchHH} />
        </div>
      ),
    },
    {
      title: 'DVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 30,
      align: 'center',
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchHH} />
        </div>
      ),
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      width: 30,
      align: 'center',

      render: (text) => <Checkbox value={text} disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.LapRap ? 1 : 0
        const valueB = b.LapRap ? 1 : 0
        return valueA - valueB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Lưu kho',
      dataIndex: 'TonKho',
      key: 'TonKho',
      width: 30,
      align: 'center',

      render: (text) => <Checkbox value={text} disabled={!text} checked={text} />,
      sorter: (a, b) => {
        const valueA = a.LapRap ? 1 : 0
        const valueB = b.LapRap ? 1 : 0
        return valueA - valueB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'SoLuongTon',
      key: 'SoLuongTon',
      width: 50,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatQuantity(text, dataThongSo?.SOLESOLUONG)} search={searchHH} />
        </div>
      ),
      sorter: (a, b) => a.SoLuongTon - b.SoLuongTon,
      showSorterTooltip: false,
    },
    {
      title: 'Nhóm hàng',
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      width: 100,
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchHH} />
        </div>
      ),
    },
  ]

  const handleSearch = (event) => {
    setSearchPMH(event.target.value)
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px] ">
          <div className="flex gap-2 items-center ">
            <img src={logo} alt="logo" className="w-[25px] h-[20px]" />
            <label className="text-blue-700 font-semibold uppercase pb-1">danh sách hàng hóa</label>
            <div>
              <BsSearch size={16} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
            </div>
          </div>
          <div className="flex  ">
            {isShowSearch && (
              <div className={`flex absolute left-[17rem] top-5 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                <input
                  type="text"
                  placeholder="Nhập ký tự bạn cần tìm"
                  onChange={handleSearch}
                  className={'px-2  w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
                />
              </div>
            )}
          </div>
          {/* table */}

          <Table
            className="table_HH"
            columns={columns}
            // dataSource={pageSize === 'All' ? data : data.slice(0, pageSize)}
            dataSource={dataTable}
            size="small"
            scroll={{
              x: 1390,
              y: 410,
            }}
            bordered
            pagination={{
              defaultPageSize: 50,
              showSizeChanger: true,
              pageSizeOptions: ['50', '100', '1000'],
              // onShowSizeChange: (current, size) => {
              //   console.log(size, '???')
              //   // setPageSize(parseInt(size, 10))
              //   // setPageSize(size === 'All' ? -1 : parseInt(size, 10))
              // },
              // // pageSize,
              onShowSizeChange: (current, size) => {
                console.log(size, ':', current, ':')
              },
            }}
            rowKey={(record) => record.MaHang}
            onRow={(record) => ({
              onDoubleClick: () => {
                handleChoose(record)
              },
            })}
          />

          <div className="flex justify-end mt-1 gap-x-2">
            <ActionButton color={'slate-50'} title={'Đóng'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalHH
