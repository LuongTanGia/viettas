/* eslint-disable react/prop-types */
import { useState } from 'react'
import logo from '../assets/VTS-iSale.ico'
import icons from '../untils/icons'
import { toast } from 'react-toastify'

import { Table, Checkbox } from 'antd'
import { formatQuantity } from '../action/Actions'
import { useSearchHH } from './myComponents/useSearchHH'
import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils'

const { IoMdClose, BsSearch } = icons
const ModalHH = ({ close, data, onRowCreate, dataThongSo }) => {
  const [selectedRow, setSelectedRow] = useState(null)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [setSearchPMH, filteredPMH] = useSearchHH(data)
  // const [pageSize, setPageSize] = useState(50)

  // const handleRowClick = (dataRow) => {
  //   setSelectedRow(dataRow.MaHang)
  // }

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

    toast.success('Chọn hàng hóa thành công', {
      autoClose: 1000,
    })
  }
  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 20,
      hight: 10,

      align: 'center',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 50,

      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => <div style={{ textAlign: 'start' }}>{text}</div>,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      align: 'center',
      width: 100,
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      showSorterTooltip: false,
      render: (text) => <div style={{ textAlign: 'start' }}>{text}</div>,
    },
    {
      title: 'DVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 30,
      align: 'center',
      render: (text) => text,
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
          {formatQuantity(text, dataThongSo?.SOLESOLUONG)}
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
      render: (text) => <div style={{ textAlign: 'start' }}>{text}</div>,
    },
  ]
  const title = ['STT', 'Mã Hàng', 'Tên Hàng', 'DVT', 'Lắp Ráp', 'Lưu Kho', 'Số Lượng Tồn', 'Nhóm']

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
          {/* <div className="max-w-[98%]  max-h-[90%] mx-auto bg-white  rounded-md my-3 overflow-y-auto text-sm">
            <table className="min-w-full min-h-full bg-white border border-gray-300 text-text-main">
              <thead>
                <tr className="bg-gray-100">
                  {title.map((item) => (
                    <th key={item} className="py-2 px-4 border">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr
                    key={item.MaHang}
                    className={`hover:bg-blue-200  cursor-pointer ${selectedRow === item.MaHang ? 'bg-blue-200 ' : ''}`}
                    // onClick={() => handleRowClick(item)}
                    onDoubleClick={() => handleChoose(item)}
                  >
                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                    <td className="py-2 px-4 border">{item.MaHang}</td>
                    <td className="py-2 px-4 border">{item.TenHang}</td>
                    <td className="py-2 px-4 border">{item.DVT}</td>
                    <td className="py-2 px-4 border text-center">
                      <input type="checkbox" defaultChecked={item.LapRap} />
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <input type="checkbox" defaultChecked={item.TonKho} />
                    </td>
                    <td className={`py-2 px-4 border text-end ${item.SoLuongTon < 0 ? 'text-red-600 font-bold' : ''}`}>{item.SoLuongTon}.0</td>
                    <td className="py-2 px-4 border">{item.NhomHang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <Table
            className="table_HH"
            columns={columns}
            // dataSource={pageSize === 'All' ? data : data.slice(0, pageSize)}
            dataSource={filteredPMH}
            size="small"
            scroll={{
              // x: 1390,
              y: 410,
            }}
            bordered
            pagination={{
              defaultPageSize: 50,
              showSizeChanger: true,
              pageSizeOptions: ['50', '100', '1000'],
              // onShowSizeChange: (current, size) => {
              //   console.log(size, '???')
              //   setPageSize(parseInt(size, 10))
              //   // setPageSize(size === 'All' ? -1 : parseInt(size, 10))
              // },
              // pageSize,
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
            <button
              onClick={() => close()}
              className="active:scale-[.98] active:duration-75  border-2 border-rose-500 text-slate-50 text-text-main font-bold  bg-rose-500 hover:bg-white hover:text-rose-500 rounded-md px-2 py-1 w-[80px] hover:opacity-80"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalHH
