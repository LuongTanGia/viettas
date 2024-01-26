/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useMemo } from 'react'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { IoMdClose, IoMdAddCircle } from 'react-icons/io'
import { Checkbox, Table, Tooltip, Select, InputNumber, FloatButton } from 'antd'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import './style/NDC.css'
import logo from '../../../../../assets/VTS-iSale.ico'
import categoryAPI from '../../../../../API/linkAPI'
import { RETOKEN } from '../../../../../action/Actions'
import { useSearch } from '../../../../hooks/Search'
import ActionButton from '../../../../../components/util/Button/ActionButton'
import SimpleBackdrop from '../../../../../components/util/Loading/LoadingPage'
import HighlightedCell from '../../../../hooks/HighlightedCell'
import NDCPrint from './NDCPrint'

const NDCCreate = ({ close, loadingData, targetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [dataKhoHang, setDataKhoHang] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [dataHangHoa, setDataHangHoa] = useState('')
  const [setSearchHangHoa, filteredHangHoa, searchHangHoa] = useSearch(dataHangHoa)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [valueDate, setValueDate] = useState(dayjs(new Date()))
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState('')
  const [SoCTu, setSoCTu] = useState('')
  const [targetRowModals, setTargetRowModals] = useState([])

  const currentRowData = useCallback(
    (mahang) => {
      return selectedRowData?.map((item) => item.MaHang).filter((item) => item !== '' && item !== mahang)
    },
    [selectedRowData],
  )
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
  const [NDCForm, setNDCForm] = useState(() => {
    return innitProduct
  })

  const [errors, setErrors] = useState({
    MaKho: '',
  })

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
    if (targetRow !== null) {
      setTargetRowModals(targetRow)
    }
  }, [targetRow])

  useEffect(() => {
    const getDataKhoHangNDC = async () => {
      try {
        const response = await categoryAPI.ListKhoHangNDC(TokenAccess)
        if (response.data.DataError == 0) {
          setDataKhoHang(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataKhoHangNDC()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getDataKhoHangNDC()
    }
  }, [isLoading])

  useEffect(() => {
    const getDataHangHoaNDC = async () => {
      try {
        const response = await categoryAPI.ListHangHoaNDC(TokenAccess)
        if (response.data.DataError == 0) {
          setDataHangHoa(response.data.DataResults)
          setIsLoading(true)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getDataHangHoaNDC()
        }
      } catch (error) {
        console.log(error)
        setIsLoading(true)
      }
    }
    if (!isLoading) {
      getDataHangHoaNDC()
    }
  }, [isLoading])

  useEffect(() => {
    setNDCForm((prev) => ({
      ...prev,
      DataDetails: selectedRowData.map((item, index) => {
        return {
          STT: index + 1,
          MaHang: item.MaHang,
          TenHang: item.TenHang,
          DVT: item.DVT,
          SoLuong: item.SoLuong,
          TienHang: 0,
          DonGia: item.DonGia,
          MaHangLR: '',
        }
      }),
    }))
  }, [selectedRowData])

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
  const handleChoose = (dataRow) => {
    const defaultValues = {
      SoLuong: 1,
      TienHang: 0,
      MaHangLR: null,
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
      setNDCForm({ ...NDCForm, DataDetails: selectedRowData })
    }
  }
  const handleCreate = async (isSave = true, isPrint = true) => {
    if (!NDCForm?.MaKho) {
      setErrors({
        MaKho: NDCForm?.MaKho ? '' : 'Kho không được trống',
      })
      return
    }
    try {
      const response = await categoryAPI.NDCCreate({ ...NDCForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss') }, TokenAccess)
      if (response.data.DataError == 0) {
        isPrint ? handlePrint() : isSave ? toast.success('Tạo thành công') : (close(), toast.success('Tạo thành công'))
        loadingData()
        setSoCTu(response.data.DataResults[0].SoChungTu)
        targetRow(response.data.DataResults[0].SoChungTu)
      } else {
        isPrint ? toast.error(response.data) : toast.error(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handlePrint = () => {
    setIsShowModal(true)
    setActionType('print')
  }
  const handleChange = (index, key, newValue) => {
    const newDataList = [...NDCForm.DataDetails]
    if (key === 'SoLuong') {
      newValue = parseFloat(newValue)
    }
    if (key === 'TenHang') {
      const selectedHangHoa = dataHangHoa.find((item) => item.MaHang === newValue)
      newDataList[index]['MaHang'] = selectedHangHoa?.MaHang
    }
    const existMaHang = newDataList.some((item, i) => i !== index && item.MaHang === newValue)
    if (!existMaHang) {
      newDataList[index][key] = newValue
      setSelectedRowData(newDataList)
      setNDCForm((prevNDCForm) => ({ ...prevNDCForm, DataDetails: newDataList }))
    } else {
      toast.warning('Hàng hóa đã được chọn', { autoClose: 1000 })
    }
  }
  const isAdd = useMemo(() => selectedRowData.map((item) => item.MaHang).includes(''), [selectedRowData])
  const addHangHoaCT = () => {
    if (selectedRowData.map((item) => item.MaHang).includes('')) return
    const addHHCT = Array.isArray(NDCForm.DataDetails) ? [...NDCForm.DataDetails] : []
    setSelectedRowData([...addHHCT, { MaHang: '', TenHang: '', DonGia: 0, SoLuong: 1 }])
  }
  const removeRow = (index) => {
    const updatedRow = [...NDCForm.DataDetails]
    updatedRow.splice(index, 1)
    setSelectedRowData(updatedRow)
    setNDCForm({
      ...NDCForm,
      DataDetails: updatedRow,
    })
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
        <Tooltip title={text}>
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
        <Tooltip title={text}>
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
        <span className={`flex justify-end ${text < 0 ? 'text-red-600 text-base font-bold' : text === 0 || text === null ? 'text-gray-300' : ''}`}>
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
                  <p className="text-blue-700 font-semibold uppercase">Thêm - Phiếu Nhập Điều Chỉnh</p>
                </div>
                <div className="flex flex-col gap-2 border-2 px-1 py-2.5">
                  <div className="grid grid-cols-2 items-center gap-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap min-w-[100px] flex justify-end">Số chứng từ</label>
                          <input
                            type="text"
                            className="px-2 w-full resize-none rounded border outline-none text-[1rem]"
                            name="SoChungTu"
                            value={NDCForm?.SoChungTu || ''}
                            onChange={(e) =>
                              setNDCForm({
                                ...NDCForm,
                                [e.target.name]: e.target.value,
                              })
                            }
                            readOnly
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="required whitespace-nowrap">Ngày c.từ</label>
                          <DatePicker
                            className="DatePicker_NDCKho"
                            format="DD/MM/YYYY"
                            value={valueDate}
                            onChange={(values) => {
                              setNDCForm({ ...NDCForm, NgayCTu: dayjs(setValueDate(values)).format('YYYY-MM-DDTHH:mm:ss') })
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
                        <label className="required whitespace-nowrap min-w-[100px] flex justify-end">Kho hàng</label>
                        <Select
                          style={{ width: '100%' }}
                          showSearch
                          required
                          size="small"
                          value={NDCForm?.MaKho}
                          placeholder={errors?.MaKho ? errors?.MaKho : ''}
                          status={errors.MaKho ? 'error' : ''}
                          onChange={(value) => {
                            setNDCForm({
                              ...NDCForm,
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
                          <label className="whitespace-nowrap">Người tạo</label>
                          <input className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                        </div>
                        <div className="flex gap-1 items-center">
                          <label>Lúc</label>
                          <input className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <label className="whitespace-nowrap">Người sửa</label>
                          <input className="px-2 2xl:w-[18rem] xl:w-[14.5rem] lg:w-[13rem] md:w-[8rem] resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                        </div>
                        <div className="flex gap-1 items-center">
                          <label>Lúc</label>
                          <input className="px-2 w-full resize-none rounded border-[0.125rem] outline-none text-[1rem]" readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="whitespace-nowrap min-w-[100px]  flex justify-end">Ghi chú</label>
                    <input
                      type="text"
                      className="px-2 w-[70rem] resize-none rounded border-[1px] hover:border-blue-500 outline-none text-[1rem]"
                      name="GhiChu"
                      value={NDCForm?.GhiChu || ''}
                      onChange={(e) =>
                        setNDCForm({
                          ...NDCForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="border-2 p-2 rounded m-1 flex flex-col gap-2 min-h-[26rem] items-start relative ">
                    <div className="w-full max-h-[25.25rem] overflow-y-auto">
                      <table className="barcodeList">
                        <thead>
                          <tr>
                            <th className="w-[5rem]">STT</th>
                            <th className="w-[10rem]">Mã hàng</th>
                            <th>Tên hàng</th>
                            <th className="w-[20rem]">Số lượng</th>
                            <th className={`${selectedRowData?.length > 9 ? 'w-[3.5rem]' : 'w-[5.5rem] '}`}></th>
                          </tr>
                        </thead>
                        <tbody className="">
                          {selectedRowData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="flex justify-center">{index + 1}</div>
                              </td>
                              <td>
                                <div className="flex justify-center">{item.MaHang}</div>
                              </td>
                              <td>
                                <div>
                                  <Select
                                    className=" text-start"
                                    showSearch
                                    size="small"
                                    value={item.TenHang || ''}
                                    style={{
                                      width: '100%',
                                    }}
                                    onChange={(value) => handleChange(index, 'TenHang', value)}
                                  >
                                    {dataHangHoa
                                      ?.filter((row) => !currentRowData(item.MaHang).includes(row?.MaHang))
                                      ?.map((hangHoa) => (
                                        <>
                                          <Select.Option key={hangHoa.MaHang} value={hangHoa.MaHang}>
                                            <p className="text-start truncate">
                                              {hangHoa.MaHang}-{hangHoa.TenHang}
                                            </p>
                                          </Select.Option>
                                        </>
                                      ))}
                                  </Select>
                                </div>
                              </td>
                              <td>
                                <div className="inputNDC flex justify-end">
                                  <InputNumber
                                    value={item.SoLuong}
                                    min={1}
                                    max={999999999999}
                                    size="small"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => {
                                      const parsedValue = parseFloat(value.replace(/\$\s?|(,*)/g, ''))
                                      return isNaN(parsedValue) ? null : parsedValue.toFixed(dataThongSo?.SOLESOLUONG)
                                    }}
                                    onChange={(value) => handleChange(index, 'SoLuong', value)}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex justify-center">
                                  <IoMdClose className="hover:text-red-600 w-6 h-6" onClick={() => removeRow(index)} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <FloatButton
                      type={isAdd ? 'default' : 'primary'}
                      className={`${selectedRowData?.length > 9 ? 'nDC_Edit top-[10px] right-[35px]' : 'top-[10px] right-[35px]'}  absolute bg-transparent w-[30px] h-[30px]`}
                      icon={<IoMdAddCircle />}
                      onClick={addHangHoaCT}
                      tooltip={isAdd ? <div>Vui lòng chọn tên hàng!</div> : <div>Bấm vào đây để thêm hàng hoặc nhấn F9!</div>}
                    />
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
                      title={'In Phiếu'}
                      color={'slate-50'}
                      background={isAdd ? 'gray-500' : 'purple-500'}
                      color_hover={isAdd ? 'gray-500' : 'purple-500'}
                      bg_hover={isAdd ? 'gray-500' : 'white'}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <ActionButton
                      handleAction={isAdd ? '' : () => handleCreate(true, false)}
                      title={'Lưu'}
                      color={'slate-50'}
                      background={isAdd ? 'gray-500' : 'blue-500'}
                      color_hover={isAdd ? 'gray-500' : 'blue-500'}
                      bg_hover={isAdd ? 'gray-500' : 'slate-50'}
                    />
                    <ActionButton
                      handleAction={isAdd ? '' : () => handleCreate(false, false)}
                      title={'Lưu & Đóng'}
                      color={'slate-50'}
                      background={isAdd ? 'gray-500' : 'blue-500'}
                      color_hover={isAdd ? 'gray-500' : 'blue-500'}
                      bg_hover={isAdd ? 'gray-500' : 'slate-50'}
                    />
                    <ActionButton handleAction={close} title={'Đóng'} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {isShowModal &&
              (actionType === 'print' ? (
                <NDCPrint close={() => setIsShowModal(false)} dataPrint={{ ...NDCForm, NgayCTu: dayjs(valueDate).format('YYYY-MM-DDTHH:mm:ss'), SoChungTu: SoCTu }} />
              ) : (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col xl:w-[87vw] lg:w-[95vw] md:w-[95vw] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden z-10">
                  <div className="flex flex-col gap-2 p-2 ">
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                      <p className="text-blue-700 font-semibold uppercase">Danh Sách Hàng Hóa - Phiếu Nhập Điều Chỉnh</p>
                    </div>
                    <div className="border-2">
                      <div className=" p-2 rounded m-1 flex flex-col gap-2 max-h-[35rem]">
                        <div className="flex w-[20rem] overflow-hidden  relative ">
                          <FaSearch className="absolute left-[0.5rem] top-2.5 hover:text-red-400 cursor-pointer" />
                          <input
                            type="text"
                            value={searchHangHoa}
                            placeholder="Nhập ký tự bạn cần tìm"
                            onChange={handleSearch}
                            className="px-[2rem] py-1 w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[1px] hover:border-blue-500 outline-none text-[1rem]  "
                          />
                        </div>
                        <Table
                          columns={title}
                          dataSource={filteredHangHoa}
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
                    </div>
                    <div className="flex gap-2 justify-end">
                      <ActionButton
                        handleAction={() => setIsShowModal(false)}
                        title={'Đóng'}
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

export default NDCCreate
