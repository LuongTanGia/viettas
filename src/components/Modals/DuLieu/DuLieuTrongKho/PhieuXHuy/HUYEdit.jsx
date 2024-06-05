/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Checkbox, FloatButton, Input, InputNumber, Select, Table, Tooltip } from 'antd'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FaSearch } from 'react-icons/fa'
// import { MdPrint } from 'react-icons/md'
import { toast } from 'react-toastify'
import { IoMdAddCircle } from 'react-icons/io'
import dayjs from 'dayjs'
import moment from 'moment'
import HUYPrint from './HUYPrint'
import { useSearch } from '../../../../hooks/Search'
import categoryAPI from '../../../../../API/linkAPI'
import logo from '../../../../../assets/VTS-iSale.ico'
import { RETOKEN, addRowClass } from '../../../../../action/Actions'
import ActionButton from '../../../../util/Button/ActionButton'
import HighlightedCell from '../../../../hooks/HighlightedCell'
import SimpleBackdrop from '../../../../util/Loading/LoadingPage'
import EditTable from '../../../../util/Table/EditTable'
import { nameColumsPhieuXuatHuy } from '../../../../util/Table/ColumnName'
import { DateField } from '@mui/x-date-pickers'

const HUYEdit = ({ close, dataHUY, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataKhoHang, setDataKhoHang] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState('')
  const [dataHUYView, setDataHUYView] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataHangHoa)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [actionType, setActionType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
  const [HUYForm, setHUYForm] = useState(() => {
    return dataHUY ? { ...dataHUY } : innitProduct
  })
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 120) {
        setIsShowModal(true)
        setActionType('choose')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isShowModal])

  useEffect(() => {
    setTargetRow()
  }, [])

  useEffect(() => {
    const getDataKhoHangHUY = async () => {
      try {
        const response = await categoryAPI.ListKhoHangHUY(TokenAccess)
        if (response.data.DataError == 0) {
          setDataKhoHang(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataKhoHangHUY()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getDataKhoHangHUY()
    }
  }, [isLoading])

  useEffect(() => {
    const getDataHangHoaHUY = async () => {
      try {
        const response = await categoryAPI.ListHangHoaHUY({ SoChungTu: HUYForm?.SoChungTu, MaKho: HUYForm?.MaKho }, TokenAccess)
        if (response.data.DataError == 0) {
          setIsLoading(true)
          setDataHangHoa(response.data.DataResults)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (HUYForm?.MaKho) {
      getDataHangHoaHUY()
    }
  }, [HUYForm?.MaKho])

  useEffect(() => {
    const handleView = async () => {
      try {
        const response = await categoryAPI.HUYInfoEdit(dataHUY?.SoChungTu, TokenAccess)
        if (response.data.DataError == 0) {
          setDataHUYView(response.data.DataResult)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (!isLoading) {
      handleView()
    }
  }, [isLoading])

  useEffect(() => {
    if (dataHUYView?.DataDetails) {
      setSelectedRowData([...dataHUYView.DataDetails])
    }
  }, [dataHUYView])

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
      setHUYForm({ ...HUYForm, DataDetails: selectedRowData })
    }
  }
  const handlePrint = () => {
    setIsShowModal(true)
    setActionType('print')
  }
  const handleEdit = async (isPrint = true) => {
    if (HUYForm.NgayCTu === 'Invalid Date') {
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
          const response = await categoryAPI.HUYEdit(
            { SoChungTu: dataHUY?.SoChungTu, Data: { ...HUYForm, NgayCTu: dayjs(HUYForm?.NgayCTu).format('YYYY-MM-DD'), DataDetails: newData } },
            TokenAccess,
          )
          if (response.data.DataError == 0) {
            isPrint ? handlePrint() : (close(), toast.success(response.data.DataErrorDescription, { autoClose: 1000 }))
            loadingData()
            setTargetRow(dataHUY?.SoChungTu)
          } else {
            console.log('sai', { SoChungTu: dataHUY?.SoChungTu, Data: { ...HUYForm, DataDetails: selectedRowData } })
            toast.warning(response.data.DataErrorDescription, { autoClose: 1000 })
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
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
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
        <div className="text-start whitespace-pre-wrap">
          <HighlightedCell text={text} search={searchHangHoa} />
        </div>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      showSorterTooltip: false,
      align: 'center',
      width: 100,
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
      width: 100,
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
      width: 100,
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
                  <p className="text-blue-700 font-semibold uppercase">Sửa - Phiếu Xuất Kho Hủy</p>
                </div>
                <div className="flex flex-col gap-2 border-1 border-gray-400 py-2.5">
                  <div className="grid grid-cols-2 items-center gap-2 px-1">
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap min-w-[90px] flex justify-end text-sm">Số chứng từ</label>
                          <input
                            size="small"
                            disabled
                            value={HUYForm?.SoChungTu || ''}
                            className="h-[24px] w-full  px-2 rounded-[4px] resize-none border-[1px] border-gray-300 outline-none truncate text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap text-sm"> Ngày</label>
                          <DateField
                            className="max-w-[130px] min-w-[130px]"
                            format="DD/MM/YYYY"
                            value={dayjs(HUYForm?.NgayCTu) || ''}
                            onChange={(values) => {
                              const newDate = dayjs(values).format('YYYY-MM-DD')
                              setHUYForm({ ...HUYForm, NgayCTu: newDate })
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
                        <label className="required whitespace-nowrap min-w-[90px] flex justify-end text-sm">Kho hàng</label>
                        <Select
                          style={{ width: '100%' }}
                          type="text"
                          showSearch
                          optionFilterProp="children"
                          required
                          size="small"
                          value={HUYForm?.MaKho}
                          onChange={(value) => {
                            setHUYForm({
                              ...HUYForm,
                              MaKho: value,
                            })
                          }}
                        >
                          {dataKhoHang &&
                            dataKhoHang?.map((item, index) => (
                              <Select.Option key={index} value={item.MaKho}>
                                {item.MaKho} - {item.TenKho}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 px-2 border-2 py-2.5 border-black-200 rounded relative">
                      <p className="absolute -top-3 left-5 bg-white px-2 text-sm font-semibold text-gray-500">Thông tin cập nhật</p>
                      <div className="flex gap-2 justify-center">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người tạo</label>
                          <Tooltip title={dataHUYView?.NguoiTao} color="blue">
                            <input
                              className="px-2 2xl:w-[18rem] xl:w-[15rem] lg:w-[13rem] md:w-[8rem] resize-none rounded-[3px] border outline-none text-sm overflow-ellipsis truncate"
                              value={dataHUYView?.NguoiTao || ''}
                              disabled
                            />
                          </Tooltip>
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <Tooltip title={moment(dataHUYView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''} color="blue">
                            <input
                              className="px-2 w-full resize-none rounded-[3px] border outline-none text-sm truncate text-center"
                              value={moment(dataHUYView?.NgayTao)?.format('DD/MM/YYYY HH:mm:ss') || ''}
                              disabled
                            />
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap text-sm">Người sửa</label>
                          <Tooltip title={dataHUYView?.NguoiSuaCuoi} color="blue">
                            <input
                              className="px-2 2xl:w-[18rem] xl:w-[15rem] lg:w-[13rem] md:w-[8rem] resize-none rounded-[3px] border  outline-none text-sm overflow-ellipsis truncate"
                              value={dataHUYView?.NguoiSuaCuoi || ''}
                              disabled
                            />
                          </Tooltip>
                        </div>
                        <div className="flex gap-1 items-center">
                          <label className="text-sm">Lúc</label>
                          <Tooltip title={dataHUYView?.NgaySuaCuoi ? moment(dataHUYView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''} color="blue">
                            <input
                              className="px-2 w-full resize-none rounded-[3px] border outline-none text-sm truncate text-center"
                              value={dataHUYView?.NgaySuaCuoi ? moment(dataHUYView?.NgaySuaCuoi)?.format('DD/MM/YYYY HH:mm:ss') : '' || ''}
                              disabled
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-1">
                    <label className="whitespace-nowrap min-w-[90px] flex justify-end text-sm">Ghi chú</label>
                    <Input
                      size="small"
                      value={HUYForm?.GhiChu || ''}
                      onChange={(e) =>
                        setHUYForm({
                          ...HUYForm,
                          GhiChu: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <EditTable
                      tableName="PhieuNhapDieuChinh"
                      param={selectedRowData}
                      handleEditData={handleEditData}
                      ColumnTable={['STT', 'MaHang', 'TenHang', 'DVT', 'SoLuong']}
                      columName={nameColumsPhieuXuatHuy}
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
                        handleEdit(true)
                      }}
                      // icon={<MdPrint className="w-5 h-5" />}
                      s
                      title={'In Phiếu'}
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
                      handleAction={() => {
                        handleEdit(false)
                      }}
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
                <HUYPrint close={() => close()} dataPrint={{ ...HUYForm }} />
              ) : (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col xl:w-[87vw] lg:w-[95vw] md:w-[95vw]  bg-white  p-2 rounded-xl shadow-custom overflow-hidden z-10">
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 py-1">
                        <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                        <p className="text-blue-700 font-semibold uppercase whitespace-nowrap md:text-[12px] lg:text-sm truncate">Danh Sách Hàng Hóa</p>
                        <FaSearch className="hover:text-red-400 cursor-pointer md:text-[14px] lg:text-sm" onClick={() => setIsShowSearch(!isShowSearch)} />
                      </div>
                      <div className="flex w-[20rem] overflow-hidden">
                        {isShowSearch && (
                          <input
                            type="text"
                            value={searchHangHoa}
                            placeholder="Nhập ký tự bạn cần tìm"
                            onChange={handleSearch}
                            className="px-2 py-0.5 w-[20rem] border-slate-200  resize-none rounded-[3px] border-[1px] hover:border-blue-500 outline-none text-sm  "
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

export default HUYEdit
