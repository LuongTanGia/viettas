/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
import { MdPrint } from 'react-icons/md'
import { IoMdAddCircle } from 'react-icons/io'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Checkbox, Table, Tooltip, Select, FloatButton, Input } from 'antd'
import dayjs from 'dayjs'
import XSDPrint from './XSDPrint'
import categoryAPI from '../../../../../API/linkAPI'
import { useSearch } from '../../../../hooks/Search'
import logo from '../../../../../assets/VTS-iSale.ico'
import { RETOKEN } from '../../../../../action/Actions'
import EditTable from '../../../../util/Table/EditTable'
import ActionButton from '../../../../util/Button/ActionButton'
import HighlightedCell from '../../../../hooks/HighlightedCell'
import SimpleBackdrop from '../../../../util/Loading/LoadingPage'
import { nameColumsPhieuXuatSuDung } from '../../../../util/Table/ColumnName'

const XSDCreate = ({ close, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [SoCTu, setSoCTu] = useState('')
  const [dataKhoHang, setDataKhoHang] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataHangHoa)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [valueDate, setValueDate] = useState(dayjs(new Date()))
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState('')
  const [isShowSearch, setIsShowSearch] = useState(false)

  const innitProduct = {
    SoChungTu: '',
    NgayCTu: '',
    SoThamChieu: '',
    MaKho: '',
    MaKho_Nhan: '',
    GhiChu: '',
    DataDetails: [
      {
        STT: 0,
        MaHang: '',
        SoLuong: 0,
        DonGia: 0,
        TienHang: 0,
        MaHangLR: '',
      },
    ],
  }
  const [XSDForm, setXSDForm] = useState(() => {
    return innitProduct
  })

  const [errors, setErrors] = useState({
    MaKho: '',
  })

  useEffect(() => {
    setTargetRow([])
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 120) {
        setIsShowModal(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShowModal])

  useEffect(() => {
    const getDataKhoHangXSD = async () => {
      try {
        const response = await categoryAPI.ListKhoHangXSD(TokenAccess)
        if (response.data.DataError == 0) {
          setDataKhoHang(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataKhoHangXSD()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getDataKhoHangXSD()
    }
  }, [isLoading])

  useEffect(() => {
    const getDataHangHoaXSD = async () => {
      try {
        const response = await categoryAPI.ListHangHoaXSD(TokenAccess)
        if (response.data.DataError == 0) {
          setDataHangHoa(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataHangHoaXSD()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getDataHangHoaXSD()
    }
  }, [isLoading])

  const handleSearch = (event) => {
    setSearchHangHoa(event.target.value)
  }
  const formatThapPhan = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }
  const handleEditData = (data) => {
    setSelectedRowData(data)
  }
  const handleChoose = (dataRow) => {
    const defaultValues = {
      SoLuong: 1,
      DonGia: 0,
      TienHang: 0,
      TyLeThue: '',
      TienThue: '',
      ThanhTien: '',
      TyLeCKTT: '',
      TienCKTT: '',
      TonKho: '',
      TyLeQuyDoi: '',
      MaHangLR: '',
    }
    const newRow = { ...dataRow, ...defaultValues }
    const existMaHang = selectedRowData.some((item) => item.MaHang === newRow.MaHang)
    if (!existMaHang) {
      setSelectedRowData([...selectedRowData, newRow])
      toast.success('Chọn hàng hóa thành công', {
        autoClose: 1000,
      })
    } else {
      const index = selectedRowData.findIndex((item) => item.MaHang === newRow.MaHang)
      const oldQuantity = selectedRowData[index].SoLuong
      selectedRowData[index].SoLuong = oldQuantity + newRow.SoLuong
      setXSDForm({ ...XSDForm, DataDetails: selectedRowData })
    }
  }

  const handleCreate = async (isSave = true, isPrint = true) => {
    if (!XSDForm?.MaKho?.trim()) {
      setErrors({
        MaKho: XSDForm?.MaKho.trim() ? '' : 'Kho không được trống',
      })
      return
    }
    try {
      const newData = selectedRowData.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      const response = await categoryAPI.XSDCreate({ ...XSDForm, DataDetails: newData, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss') }, TokenAccess)
      if (response.data.DataError == 0) {
        isPrint
          ? (handlePrint(), setXSDForm([]), setSelectedRowData([]))
          : isSave
            ? (toast.success('Tạo thành công', { autoClose: 1000 }), setXSDForm([]), setSelectedRowData([]))
            : (close(), toast.success('Tạo thành công', { autoClose: 1000 }))
        loadingData()
        setSoCTu(response.data.DataResults[0].SoChungTu)
        setTargetRow(response.data.DataResults[0].SoChungTu)
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  const handlePrint = () => {
    setIsShowModal(true)
    setActionType('print')
  }
  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng'), [selectedRowData])

  const addHangHoaCT = () => {
    if (selectedRowData.map((item) => item.MaHang).includes('Chọn mã hàng')) return
    setSelectedRowData([
      ...selectedRowData,
      {
        MaHang: 'Chọn mã hàng',
        TenHang: 'Chọn mã hàng',
        DVT: '',
        SoLuong: 1,
        DonGia: 0,
        TienHang: 0,
        TyLeThue: '',
        TienThue: '',
        ThanhTien: '',
        TyLeCKTT: '',
        TienCKTT: '',
        TonKho: '',
        TyLeQuyDoi: '',
        MaHangLR: '',
        key: selectedRowData.length + dataHangHoa.length,
      },
    ])
  }
  const title = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'MaHang',
      key: 'MaHang',
      width: 150,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.MaHang.localeCompare(b.MaHang),
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'NhomHang',
      key: 'NhomHang',
      width: 200,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.NhomHang.localeCompare(b.NhomHang),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'TenHang',
      key: 'TenHang',
      width: 250,
      showSorterTooltip: false,
      align: 'center',
      sorter: (a, b) => a.TenHang.localeCompare(b.TenHang),
      render: (text) => (
        <Tooltip title={text} color="blue">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              textAlign: 'start',
            }}
          >
            <HighlightedCell text={text} search={searchHangHoa} />
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DVT',
      key: 'DVT',
      showSorterTooltip: false,
      align: 'center',
      width: 120,
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      render: (text) => (
        <span className="flex justify-center">
          <HighlightedCell text={text} search={searchHangHoa} />
        </span>
      ),
    },
    {
      title: 'Lắp ráp',
      dataIndex: 'LapRap',
      key: 'LapRap',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.LapRap ? 1 : 0
        const valueB = b.LapRap ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className="justify-center" id={`LapRap_${record.key}`} checked={text} />,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'TonKho',
      key: 'TonKho',
      align: 'center',
      width: 120,
      showSorterTooltip: false,
      sorter: (a, b) => {
        const valueA = a.TonKho ? 1 : 0
        const valueB = b.TonKho ? 1 : 0
        return valueA - valueB
      },
      render: (text, record) => <Checkbox className=" justify-center" id={`TonKho_${record.key}`} checked={text} />,
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'SoLuongTon',
      key: 'SoLuongTon',
      width: 150,
      showSorterTooltip: false,
      sorter: (a, b) => a.SoLuongTon - b.SoLuongTon,
      align: 'center',
      render: (text) => (
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
          <HighlightedCell text={formatThapPhan(text, dataThongSo.SOLESOLUONG)} search={searchHangHoa} />
        </span>
      ),
    },
  ]

  return (
    <>
      {!isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 py-1 px-2 xl:w-[80vw] lg:w-[90vw] md:w-[95vw]">
                <div className="flex gap-2">
                  <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                  <p className="text-blue-700 font-semibold uppercase">Thêm - Phiếu Xuất Kho Sử Dụng</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-1 py-2.5">
                  <div className="grid grid-cols-2 items-center gap-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <label className="text-sm  required whitespace-nowrap min-w-[100px] flex justify-end">Số chứng từ</label>
                          <Input disabled size="small" value={XSDForm?.SoChungTu || ''} readOnly />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap text-sm">Ngày c.từ</label>
                          <DatePicker
                            className="DatePicker_XSDKho"
                            format="DD/MM/YYYY"
                            value={valueDate}
                            onChange={(values) => {
                              setXSDForm({ ...XSDForm, NgayCTu: dayjs(setValueDate(values)).format('YYYY-MM-DDTHH:mm:ss') })
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
                              '& .MuiButtonBase-root': {
                                padding: '4px',
                              },
                              '& .MuiSvgIcon-root': {
                                width: '18px',
                                height: '18px',
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="text-sm required whitespace-nowrap min-w-[100px] flex justify-end">Kho hàng</label>
                        <Select
                          style={{ width: '100%' }}
                          showSearch
                          required
                          size="small"
                          value={XSDForm?.MaKho || undefined}
                          placeholder={errors.MaKho ? errors.MaKho : ''}
                          status={errors.MaKho ? 'error' : ''}
                          onChange={(value) => {
                            setXSDForm({
                              ...XSDForm,
                              MaKho: value,
                            })
                            setErrors({ ...errors, MaKho: '' })
                          }}
                        >
                          {dataKhoHang &&
                            dataKhoHang?.map((item) => (
                              <Select.Option key={item.MaKho} value={item.MaKho}>
                                {item.ThongTinKho}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 px-2 border-2 py-2.5 border-black-200 rounded relative">
                      <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người tạo</label>
                          <input className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border outline-none text-[1rem]" readOnly />
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <input className="px-2 w-full resize-none rounded border outline-none text-[1rem]" readOnly />
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người sửa</label>
                          <input className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border outline-none text-[1rem]" readOnly />
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <input className="px-2 w-full resize-none rounded border outline-none text-[1rem]" readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap min-w-[100px] text-sm flex justify-end">Ghi chú</label>
                    <input
                      type="text"
                      className="px-2 w-[70rem] resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem]"
                      name="GhiChu"
                      value={XSDForm?.GhiChu || ''}
                      onChange={(e) =>
                        setXSDForm({
                          ...XSDForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="border-2 rounded relative">
                    <EditTable
                      typeTable="create"
                      typeAction="create"
                      tableName="PhieuNhapDieuChinh"
                      param={selectedRowData}
                      handleEditData={handleEditData}
                      ColumnTable={['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong']}
                      columName={nameColumsPhieuXuatSuDung}
                      yourMaHangOptions={dataHangHoa}
                    />
                    <Tooltip
                      placement="topLeft"
                      title={isAdd ? 'Vui lòng chọn tên hàng!' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách!'}
                      color={isAdd ? 'gray' : 'blue'}
                    >
                      <FloatButton
                        type={isAdd ? 'default' : 'primary'}
                        className="absolute z-3 bg-transparent w-[26px] h-[26px]"
                        icon={<IoMdAddCircle />}
                        style={{
                          right: 18,
                          top: 8,
                        }}
                        onClick={addHangHoaCT}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2 justify-start">
                    <ActionButton
                      handleAction={
                        isAdd
                          ? ''
                          : () => {
                              handleCreate(true, true)
                            }
                      }
                      icon={<MdPrint className="w-5 h-5" />}
                      title={'In Phiếu'}
                      color={'slate-50'}
                      background={isAdd ? 'gray-500' : 'purple-500'}
                      color_hover={isAdd ? 'gray-500' : 'purple-500'}
                      bg_hover={'white'}
                      isPermission={isAdd ? false : true}
                      isModal={true}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <ActionButton
                      handleAction={isAdd ? '' : () => handleCreate(true, false)}
                      title={'Lưu'}
                      isModal={true}
                      color={'slate-50'}
                      background={isAdd ? 'gray-500' : 'blue-500'}
                      color_hover={isAdd ? 'gray-500' : 'blue-500'}
                      bg_hover={'white'}
                      isPermission={isAdd ? false : true}
                    />
                    <ActionButton
                      handleAction={isAdd ? '' : () => handleCreate(false, false)}
                      title={'Lưu & Đóng'}
                      isModal={true}
                      color={'slate-50'}
                      background={isAdd ? 'gray-500' : 'blue-500'}
                      color_hover={isAdd ? 'gray-500' : 'blue-500'}
                      bg_hover={'white'}
                      isPermission={isAdd ? false : true}
                    />
                    <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {isShowModal &&
              (actionType === 'print' ? (
                <XSDPrint close={() => setIsShowModal(false)} dataPrint={{ ...XSDForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss'), SoChungTu: SoCTu }} />
              ) : (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col xl:w-[87vw] lg:w-[95vw] md:w-[95vw] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden z-10">
                  <div className="flex flex-col gap-2 p-2 ">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 py-1">
                        <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                        <p className="text-blue-700 font-semibold uppercase">Danh Sách Hàng Hóa - Phiếu Xuất Kho Sử Dụng</p>
                        <FaSearch className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                      </div>
                      <div className="flex w-[20rem] overflow-hidden">
                        {isShowSearch && (
                          <input
                            type="text"
                            value={searchHangHoa}
                            placeholder="Nhập ký tự bạn cần tìm"
                            onChange={handleSearch}
                            className="px-2 py-0.5 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[1px] hover:border-blue-500 outline-none text-[1rem]  "
                          />
                        )}
                      </div>
                    </div>
                    <div className="border-2 p-2 rounded m-1 flex flex-col gap-2 max-h-[35rem]">
                      <Table
                        bordered
                        className="table_HH"
                        columns={title}
                        dataSource={filteredHangHoa.map((record, index) => ({ ...record, key: index }))}
                        onRow={(record) => ({
                          onDoubleClick: () => {
                            handleChoose(record)
                          },
                        })}
                        pagination={{
                          defaultPageSize: parseInt(localStorage.getItem('pageSize') || 50),
                          showSizeChanger: true,
                          pageSizeOptions: ['50', '100', '1000'],
                          onShowSizeChange: (current, size) => {
                            localStorage.setItem('pageSize', size)
                          },
                        }}
                        size="small"
                        scroll={{
                          x: 1100,
                          y: 420,
                        }}
                        style={{
                          whiteSpace: 'nowrap',
                          fontSize: '24px',
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <ActionButton
                        handleAction={() => setIsShowModal(false)}
                        title={'Đóng'}
                        isModal={true}
                        color={'slate-50'}
                        background={'red-500'}
                        color_hover={'red-500'}
                        bg_hover={'white'}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  )
}

export default XSDCreate
