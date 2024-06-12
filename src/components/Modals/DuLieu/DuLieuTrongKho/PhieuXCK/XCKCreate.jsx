/* eslinXCKDelt-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
// import { MdPrint } from 'react-icons/md'
import { IoMdAddCircle } from 'react-icons/io'
import { Checkbox, Table, Tooltip, Select, FloatButton, Input } from 'antd'
import dayjs from 'dayjs'
import XCKPrint from './XCKPrint'
import categoryAPI from '../../../../../API/linkAPI'
import { useSearch } from '../../../../hooks/Search'
import logo from '../../../../../assets/VTS-iSale.ico'
import { RETOKEN, addRowClass } from '../../../../../action/Actions'
import EditTable from '../../../../util/Table/EditTable'
import ActionButton from '../../../../util/Button/ActionButton'
import HighlightedCell from '../../../../hooks/HighlightedCell'
import SimpleBackdrop from '../../../../util/Loading/LoadingPage'
import { nameColumsPhieuNhapDieuChinh } from '../../../../util/Table/ColumnName'
import { DateField } from '@mui/x-date-pickers'

const XCKCreate = ({ close, loadingData, setTargetRow }) => {
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
  const [XCKForm, setXCKForm] = useState(() => {
    return innitProduct
  })

  const [errors, setErrors] = useState({
    MaKho_Nhan: '',
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
    const getDataKhoHangXCK = async () => {
      try {
        const response = await categoryAPI.ListKhoHangXCK(TokenAccess)
        if (response.data.DataError == 0) {
          setDataKhoHang(response.data.DataResults)
          setXCKForm({ ...XCKForm, MaKho: response?.data?.DataResults[0]?.MaKho })
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataKhoHangXCK()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getDataKhoHangXCK()
    }
  }, [isLoading])

  useEffect(() => {
    const getDataHangHoaXCK = async () => {
      try {
        const response = await categoryAPI.ListHangHoaXCK({ SoChungTu: null, MaKho: XCKForm?.MaKho }, TokenAccess)
        if (response.data && response.data.DataError == 0) {
          setDataHangHoa(response.data.DataResults)
          setIsLoading(true)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (XCKForm?.MaKho) {
      getDataHangHoaXCK()
    }
  }, [XCKForm?.MaKho])

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
      toast.success('Chọn hàng hóa thành công', {
        autoClose: 1000,
      })
      const index = selectedRowData.findIndex((item) => item.MaHang === newRow.MaHang)
      const oldQuantity = selectedRowData[index].SoLuong
      selectedRowData[index].SoLuong = oldQuantity + newRow.SoLuong
      setXCKForm({ ...XCKForm, DataDetails: selectedRowData })
    }
  }

  const handleCreate = async (isSave = true, isPrint = true) => {
    if (!XCKForm.MaKho_Nhan.trim()) {
      setErrors({
        MaKho_Nhan: XCKForm?.MaKho_Nhan.trim() ? '' : 'Kho nhận không được trống',
      })
      return
    }
    if (dayjs(valueDate).format('YYYY-MM-DD') === 'Invalid Date') {
      toast.warning('Vui lòng chọn ngày', { autoClose: 2000 })
      return
    }
    try {
      const newData = selectedRowData.map((item, index) => {
        return {
          ...item,
          STT: index + 1,
        }
      })
      if (newData?.length > 0) {
        if (isAdd) {
          toast.warning('Vui lòng chọn mã hàng', { autoClose: 2000 })
        } else {
          const response = await categoryAPI.XCKCreate({ ...XCKForm, DataDetails: newData, NgayCTu: dayjs(valueDate).format('YYYY-MM-DD') }, TokenAccess)
          if (response.data.DataError == 0) {
            isPrint
              ? (handlePrint(), setXCKForm({ MaKho: dataKhoHang[0]?.MaKho }), setSelectedRowData([]))
              : isSave
                ? (toast.success(response.data.DataErrorDescription, { autoClose: 1000 }), setXCKForm({ MaKho: dataKhoHang[0]?.MaKho }), setSelectedRowData([]))
                : (close(), toast.success(response.data.DataErrorDescription, { autoClose: 1000 }))
            loadingData()
            setSoCTu(response.data.DataResults[0].SoChungTu)
            setTargetRow(response.data.DataResults[0].SoChungTu)
          } else {
            toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
          }
        }
      } else {
        toast.warning('Chi tiết hàng không được để trống', { autoClose: 1000 })
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
      title: 'ĐVT',
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
                  <p className="text-blue-700 font-semibold uppercase">Thêm - Phiếu Xuất Chuyển Kho</p>
                </div>
                <div className="flex flex-col gap-2 border-1 border-gray-400 py-2.5">
                  <div className="grid grid-cols-2 items-center gap-2 px-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <label className="text-sm whitespace-nowrap required min-w-[90px] flex justify-end">Số chứng từ</label>
                          <input
                            size="small"
                            disabled
                            value={XCKForm?.SoChungTu || ''}
                            className="h-[24px] w-full  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap text-sm"> Ngày</label>
                          <DateField
                            className="max-w-[130px] min-w-[130px]"
                            format="DD/MM/YYYY"
                            value={valueDate}
                            onChange={(values) => {
                              setXCKForm({ ...XCKForm, NgayCTu: dayjs(setValueDate(values)).format('YYYY-MM-DD') })
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
                        <label className="text-sm required whitespace-nowrap min-w-[90px] flex justify-end">Kho</label>
                        <Select
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          required
                          size="small"
                          value={XCKForm?.MaKho}
                          onChange={(value) => {
                            setXCKForm({
                              ...XCKForm,
                              MaKho: value,
                            })
                          }}
                        >
                          {dataKhoHang &&
                            dataKhoHang?.map((item) => (
                              <Select.Option key={item.MaKho} value={item.MaKho}>
                                {item.MaKho} - {item.TenKho}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="text-sm required whitespace-nowrap min-w-[90px] flex justify-end">Kho nhận</label>
                        <Select
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          required
                          size="small"
                          value={XCKForm?.MaKho_Nhan || undefined}
                          placeholder={errors.MaKho_Nhan ? errors.MaKho_Nhan : ''}
                          status={errors.MaKho_Nhan ? 'error' : ''}
                          onChange={(value) => {
                            setXCKForm({
                              ...XCKForm,
                              MaKho_Nhan: value,
                            })
                            setErrors({ ...errors, MaKho_Nhan: '' })
                          }}
                        >
                          {dataKhoHang &&
                            dataKhoHang?.map((item) => (
                              <Select.Option key={item.MaKho} value={item.MaKho}>
                                {item.MaKho} - {item.TenKho}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 px-2 border-2 py-3 border-black-200 rounded relative">
                      <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                      <div className="flex gap-2 justify-center">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người tạo</label>
                          <input className="px-2 2xl:w-[18rem] xl:w-[15rem] lg:w-[13rem] md:w-[8rem] resize-none rounded-[3px] border outline-none text-sm" disabled />
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <input className="px-2 w-full resize-none rounded-[3px] border outline-none text-sm text-center" disabled />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người sửa</label>
                          <input className="px-2 2xl:w-[18rem] xl:w-[15rem] lg:w-[13rem] md:w-[8rem] resize-none rounded-[3px] border outline-none text-sm" disabled />
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <input className="px-2 w-full resize-none rounded-[3px] border outline-none text-sm text-center" disabled />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-1">
                    <label className="whitespace-nowrap min-w-[90px] text-sm flex justify-end">Ghi chú</label>
                    <Input
                      size="small"
                      value={XCKForm?.GhiChu || ''}
                      onChange={(e) =>
                        setXCKForm({
                          ...XCKForm,
                          GhiChu: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <EditTable
                      typeTable="create"
                      typeAction="create"
                      tableName="PhieuNhapDieuChinh"
                      param={selectedRowData}
                      handleEditData={handleEditData}
                      ColumnTable={['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong']}
                      columName={nameColumsPhieuNhapDieuChinh}
                      yourMaHangOptions={dataHangHoa}
                    />
                    <Tooltip
                      placement="topLeft"
                      title={isAdd ? 'Vui lòng chọn tên hàng.' : 'Bấm vào đây để thêm hàng mới hoặc F9 để chọn từ danh sách.'}
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
                      handleAction={() => {
                        handleCreate(true, true)
                      }}
                      title={'In Phiếu'}
                      // icon={<MdPrint className="w-5 h-5" />}
                      color={'slate-50'}
                      background={'purple-500'}
                      color_hover={'purple-500'}
                      bg_hover={'white'}
                      isPermission={true}
                      isModal={true}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <ActionButton
                      handleAction={() => handleCreate(true, false)}
                      title={'Lưu'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                      isPermission={true}
                    />
                    <ActionButton
                      handleAction={() => handleCreate(false, false)}
                      title={'Lưu & đóng'}
                      isModal={true}
                      color={'slate-50'}
                      background={'blue-500'}
                      color_hover={'blue-500'}
                      bg_hover={'white'}
                      isPermission={true}
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
                <XCKPrint close={() => setIsShowModal(false)} dataPrint={{ ...XCKForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DD'), SoChungTu: SoCTu }} />
              ) : (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col xl:w-[87vw] lg:w-[95vw] md:w-[95vw] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden z-10">
                  <div className="flex flex-col gap-2 p-2 ">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 py-1">
                        <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                        <p className="text-blue-700 font-semibold uppercase md:text-[12px] lg:text-sm truncate">Danh Sách Hàng Hóa</p>
                        <FaSearch className="hover:text-red-400 cursor-pointer md:text-[14px] lg:text-sm" onClick={() => setIsShowSearch(!isShowSearch)} />
                      </div>
                      <div className="flex w-[20rem] overflow-hidden">
                        {isShowSearch && (
                          <input
                            type="text"
                            value={searchHangHoa}
                            placeholder="Nhập ký tự bạn cần tìm"
                            onChange={handleSearch}
                            className="px-2 py-0.5 w-[20rem] border-slate-200  resize-none rounded border-[1px] hover:border-blue-500 outline-none text-sm  "
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-2 rounded m-1 flex flex-col gap-2">
                      <Table
                        className="table_HH"
                        columns={title}
                        dataSource={filteredHangHoa.map((record, index) => ({ ...record, key: index }))}
                        onRow={(record) => ({
                          onDoubleClick: () => {
                            handleChoose(record)
                          },
                        })}
                        rowClassName={(record, index) => addRowClass(record, index)}
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
                          x: 'max-content',
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

export default XCKCreate
