import { useEffect, useState, useRef } from 'react'
import { Table, Tooltip, Input, Typography } from 'antd'
import icons from '../../untils/icons'
import { toast } from 'react-toastify'
import * as apis from '../../apis'

import { RETOKEN, formatPrice } from '../../action/Actions'
import HighlightedCell from '../../components/hooks/HighlightedCell'
import dayjs from 'dayjs'
import { CloseSquareFilled } from '@ant-design/icons'
import { useSearchHH } from '../../components_K/myComponents/useSearchHH'
import { PermissionView } from '../../components_K'
import { DateField } from '@mui/x-date-pickers'
import SimpleBackdrop from '../../components/util/Loading/LoadingPage'
import moment from 'moment'
const { Text } = Typography
const { BsSearch } = icons

const DuLieuBLQ = () => {
  const optionContainerRef = useRef(null)
  const [tableLoad, setTableLoad] = useState(true)
  const [tableLoadChild, setTableLoadChild] = useState(false)
  const [tableLoadTT, setTableLoadTT] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [isShowOption, setIsShowOption] = useState(false)
  const [dataQuayCa, setDataQuayCa] = useState([])
  const [dataBLQ, setDataBLQ] = useState([])
  const [dataThongTin, setDataThongTin] = useState({})
  const [dataQuyenHan, setDataQuyenHan] = useState({})
  const [setSearchDuLieuBLQ, filteredDuLieuBLQ, searchDuLieuBLQ] = useSearchHH(dataBLQ)
  const [prevSearchValue, setPrevSearchValue] = useState('')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [prevdateValue, setPrevDateValue] = useState({})
  const [lastSearchTime, setLastSearchTime] = useState(0)
  // const [hasCalledGetThongTin, setHasCalledGetThongTin] = useState(false)

  const [formKhoanNgay, setFormKhoanNgay] = useState({})
  const [formPBLQ, setFormPBLQ] = useState({})

  // bỏ focus option thì hidden
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionContainerRef.current && !optionContainerRef.current.contains(event.target)) {
        // Click ngoài phần tử chứa isShowOption, ẩn isShowOption
        setIsShowOption(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isShowOption])

  // default value

  useEffect(() => {
    if (dataQuayCa && dataQuayCa.length > 0) {
      const formDF = dataQuayCa[0]
      const record = null
      getDSBLQ(record, formDF)
    }
  }, [dataQuayCa])

  useEffect(() => {
    if (dataBLQ && dataBLQ.length > 0) {
      const sct = dataBLQ[0]?.SoChungTu
      const record = null
      setTableLoadTT(true)
      getThongTin(record, sct)
    }
  }, [dataBLQ])

  // get Chức năng quyền hạn
  useEffect(() => {
    const getChucNangQuyenHan = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.ChucNangQuyenHan(tokenLogin, 'TruyVan_DuLieuBanLeQuay')

        if (response.data && response.data.DataError === 0) {
          setDataQuyenHan(response.data)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getChucNangQuyenHan()
        }
      } catch (error) {
        console.error('Kiểm tra token thất bại', error)
      }
    }

    getChucNangQuyenHan()
  }, [])
  useEffect(() => {
    if (dataQuyenHan?.VIEW == false) {
      setIsShowNotify(true)
    }
  }, [dataQuyenHan])

  // get Khoảng ngày
  useEffect(() => {
    const getKhoanNgay = async () => {
      try {
        const tokenLogin = localStorage.getItem('TKN')
        const response = await apis.KhoanNgay(tokenLogin)

        if (response.data && response.data.DataError === 0) {
          setFormKhoanNgay(response.data)
          setIsLoading(false)
        } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
          setIsLoading(false)
        } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
          await RETOKEN()
          getKhoanNgay()
        } else {
          toast.error(response.data.DataErrorDescription)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Kiểm tra token thất bại', error)
        setIsLoading(false)
      }
    }

    getKhoanNgay()
  }, [])

  //get DSDuLieuBLQ
  useEffect(() => {
    if (tableLoad && dataQuyenHan?.VIEW) {
      getDSQuayCa()
    }
  }, [tableLoad, dataQuyenHan?.VIEW])

  const getDSQuayCa = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      const response = await apis.DanhSachBLQ(tokenLogin, formKhoanNgay)
      if (response.data && response.data.DataError === 0) {
        setDataQuayCa(response.data.DataResults)
        setTableLoad(false)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getDSQuayCa()
      } else if ((response.data && response.data.DataError === -1) || (response.data && response.data.DataError === -2) || (response.data && response.data.DataError === -3)) {
        toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response.data.DataErrorDescription}</div>)
        setTableLoad(false)
      } else {
        toast.error(response.data.DataErrorDescription)
        setDataQuayCa([])
        setTableLoad(false)
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoad(false)
    }
  }

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'NgayCTu',
      key: 'NgayCTu',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchDuLieuBLQ} />,
      width: 100,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayCTu)
        const dateB = new Date(b.NgayCTu)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Quầy',
      dataIndex: 'Quay',
      key: 'Quay',
      width: 80,
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div className="truncate text-end">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchDuLieuBLQ} />
            </span>
          </Tooltip>
        </div>
      ),
      sorter: (a, b) => a.Quay - b.Quay,
    },

    {
      title: 'Ca',
      dataIndex: 'Ca',
      key: 'Ca',
      align: 'center',
      width: 80,
      sorter: (a, b) => a.Ca.localeCompare(b.Ca),
      showSorterTooltip: false,
      render: (text) => (
        <div className="truncate ">
          <Tooltip title={text} color="blue" placement="top">
            <span>
              <HighlightedCell text={text} search={searchDuLieuBLQ} />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'NhanVien',
      key: 'NhanVien',
      width: 150,
      align: 'center',
      render: (text) => (
        <div className="text-start">
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.NhanVien.localeCompare(b.NhanVien),
      showSorterTooltip: false,
    },
  ]
  const columnChild1 = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 60,
      hight: 10,
      fixed: 'left',
      align: 'center',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
    },
    {
      title: 'Số Phiếu',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
    },

    {
      title: 'Tiền hàng',
      dataIndex: 'TongTienHang',
      key: 'TongTienHang',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongTienHang - b.TongTienHang,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TongTienThue',
      key: 'TongTienThue',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongTienThue - b.TongTienThue,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongThanhTien - b.TongThanhTien,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: '%CK TH.Toán',
      dataIndex: 'TyLeCKTT',
      key: 'TyLeCKTT',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TyLeCKTT - b.TyLeCKTT,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLETYLE)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Tiền CK TH.Toán',
      dataIndex: 'TongTienCKTT',
      key: 'TongTienCKTT',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongTienCKTT - b.TongTienCKTT,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'TongTongCong',
      key: 'TongTongCong',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.TongTongCong - b.TongTongCong,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Khách đưa',
      dataIndex: 'KhachTra',
      key: 'KhachTra',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.KhachTra - b.KhachTra,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Hoàn lại khách',
      dataIndex: 'HoanLai',
      key: 'HoanLai',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.HoanLai - b.HoanLai,
      showSorterTooltip: false,
      render: (text) => (
        <div className={`text-end ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'MaDoiTuong',
      key: 'MaDoiTuong',
      width: 150,
      sorter: (a, b) => {
        const MaDoiTuongA = a.MaDoiTuong || ''
        const MaDoiTuongB = b.MaDoiTuong || ''

        return MaDoiTuongA.localeCompare(MaDoiTuongB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Tạo lúc',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      align: 'center',
      render: (text) => <HighlightedCell text={moment(text).format('DD/MM/YYYY')} search={searchDuLieuBLQ} />,
      width: 150,
      sorter: (a, b) => {
        const dateA = new Date(a.NgayTao)
        const dateB = new Date(b.NgayTao)
        return dateA - dateB
      },
      showSorterTooltip: false,
    },
    {
      title: 'Chứng từ gộp',
      dataIndex: 'SoChungTuTH',
      key: 'SoChungTuTH',
      width: 150,
      fixed: 'right',
      sorter: (a, b) => {
        const SoChungTuTHA = a.SoChungTuTH || ''
        const SoChungTuTHB = b.SoChungTuTH || ''

        return SoChungTuTHA.localeCompare(SoChungTuTHB)
      },
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
    },
  ]

  const columnChild2 = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 80,
      fixed: 'left',
      align: 'center',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Số phiếu',
      dataIndex: 'SoChungTu',
      key: 'SoChungTu',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => a.SoChungTu.localeCompare(b.SoChungTu),
      showSorterTooltip: false,
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'start' }}>
          {' '}
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'Dòng',
      dataIndex: 'Dong',
      key: 'Dong',
      width: 80,
      fixed: 'left',
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
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
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
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 100,
      align: 'center',
      render: (text) => (
        <div>
          <HighlightedCell text={text} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.DVT.localeCompare(b.DVT),
      showSorterTooltip: false,
    },

    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      width: 100,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOLUONG)} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      showSorterTooltip: false,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      width: 100,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.SoLuong - b.SoLuong,
      showSorterTooltip: false,
    },
    {
      title: 'Tiền hàng',
      dataIndex: 'TienHang',
      key: 'TienHang',
      width: 100,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.TienHang - b.TienHang,
      showSorterTooltip: false,
    },
    {
      title: '% thuế',
      dataIndex: 'TyLeThue',
      key: 'TyLeThue',
      width: 100,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLETYLE)} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.TyLeThue - b.TyLeThue,
      showSorterTooltip: false,
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'TienThue',
      key: 'TienThue',
      width: 100,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.TienThue - b.TienThue,
      showSorterTooltip: false,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      width: 120,
      align: 'center',
      render: (text) => (
        <div className={`flex justify-end w-full h-full    ${text < 0 ? 'text-red-600 ' : text === 0 ? 'text-gray-300' : ''} `}>
          <HighlightedCell text={formatPrice(text, dataThongSo?.SOLESOTIEN)} search={searchDuLieuBLQ} />
        </div>
      ),
      sorter: (a, b) => a.ThanhTien - b.ThanhTien,
      showSorterTooltip: false,
    },
  ]

  const handleView = (record) => {
    setTableLoadChild(true)
    getDSBLQ(record)
  }

  const getDSBLQ = async (record, formDF) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response

      if (record) {
        response = await apis.DanhSachPhieuBLQ(tokenLogin, { ...formPBLQ, NgayCTu: record.NgayCTu, Quay: record.Quay, Ca: record.Ca, NhanVien: record.NhanVien })
      } else {
        response = await apis.DanhSachPhieuBLQ(tokenLogin, formDF)
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResults } = response.data
        if (DataError === 0) {
          setDataBLQ(DataResults)
          setTableLoadChild(false)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          getDSBLQ()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
          setTableLoadChild(false)
        } else {
          toast.error(DataErrorDescription)
          setDataBLQ([])
          setTableLoadChild(false)
        }
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoadChild(false)
    }
  }

  const handleViewThongTin = (record) => {
    setTableLoadTT(true)
    getThongTin(record)
  }

  const getThongTin = async (record, sct) => {
    try {
      console.log(sct)
      const tokenLogin = localStorage.getItem('TKN')
      let response
      if (record) {
        response = await apis.ThongTinPhieuBLQ(tokenLogin, record.SoChungTu)
      } else {
        response = await apis.ThongTinPhieuBLQ(tokenLogin, sct)
      }

      if (response) {
        const { DataError, DataErrorDescription, DataResult } = response.data
        if (DataError === 0) {
          setDataThongTin(DataResult)
          setTableLoadTT(false)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          getThongTin()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
          setTableLoadTT(false)
        } else {
          toast.error(DataErrorDescription)
          setDataThongTin([])
          setTableLoadTT(false)
        }
      }
    } catch (error) {
      console.error('Kiểm tra token thất bại', error)
      setTableLoadTT(false)
    }
  }

  const handleFilterDS = () => {
    const currentTime = new Date().getTime()
    if (currentTime - lastSearchTime >= 1000 && formKhoanNgay !== prevdateValue) {
      setTableLoad(true)
      setLastSearchTime(currentTime)
    }
  }

  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formKhoanNgay.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
      })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formKhoanNgay.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DD')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, cập nhật ngày bắt đầu
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayKetThuc: endDate,
      })
    }
  }

  const handleSearch = (newSearch) => {
    if (newSearch !== prevSearchValue) {
      setTableLoad(true)
      setSearchDuLieuBLQ(newSearch)
    }
  }

  const transformedDataSource = {
    Details: dataThongTin?.Details?.map((item) => ({
      SoChungTu: dataThongTin?.SoChungTu,
      ...item,
    })),
  }

  return (
    <>
      {dataQuyenHan?.VIEW === false ? (
        <>{isShowNotify && <PermissionView close={() => setIsShowNotify(false)} />}</>
      ) : (
        <>
          {isLoading ? (
            <SimpleBackdrop />
          ) : (
            <div className="w-auto">
              <div className="relative text-lg flex justify-between items-center mb-1">
                <div className="flex items-center gap-x-4 font-bold">
                  <h1 className="w-full text-xl uppercase truncate">Dữ liệu bán lẻ tại các quầy</h1>
                  <div>
                    <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
                  </div>
                </div>
                <div className="flex  ">
                  {isShowSearch && (
                    <div className={`flex absolute left-[22rem] -top-[2px] transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
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
                {/*  */}
              </div>
              <div className="flex  items-center px-2  gap-2">
                <div className="flex flex-col gap-y-2 ">
                  {/* DatePicker */}
                  <div className="flex gap-3">
                    <div className="flex gap-x-2 items-center">
                      <label htmlFor="">Ngày</label>
                      <DateField
                        className="DatePicker_PMH max-w-[110px]"
                        format="DD/MM/YYYY"
                        value={dayjs(formKhoanNgay.NgayBatDau)}
                        onChange={(newDate) => {
                          setFormKhoanNgay({
                            ...formKhoanNgay,
                            NgayBatDau: dayjs(newDate).format('YYYY-MM-DD'),
                          })
                        }}
                        onBlur={() => {
                          handleStartDateChange(formKhoanNgay.NgayBatDau)
                          handleFilterDS()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleStartDateChange(formKhoanNgay.NgayBatDau)

                            setPrevDateValue(formKhoanNgay)
                            handleFilterDS()
                          }
                        }}
                        onFocus={() => setPrevDateValue(formKhoanNgay)}
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
                    <div className="flex gap-x-2 items-center">
                      <label htmlFor="">Đến</label>
                      <DateField
                        className="DatePicker_PMH max-w-[110px]"
                        format="DD/MM/YYYY"
                        value={dayjs(formKhoanNgay.NgayKetThuc)}
                        onChange={(newDate) => {
                          setFormKhoanNgay({
                            ...formKhoanNgay,
                            NgayKetThuc: dayjs(newDate).format('YYYY-MM-DD'),
                          })
                        }}
                        onBlur={() => {
                          handleEndDateChange(formKhoanNgay.NgayKetThuc)
                          handleFilterDS()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleEndDateChange(formKhoanNgay.NgayKetThuc)
                            setPrevDateValue(formKhoanNgay)
                            handleFilterDS()
                          }
                        }}
                        onFocus={() => setPrevDateValue(formKhoanNgay)}
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
                </div>
              </div>
              <div id="my-table" className="pt-2 flex gap-2 ">
                <div className="w-[30vw]">
                  <Table
                    loading={tableLoad}
                    className="BLQ"
                    columns={columns}
                    dataSource={dataQuayCa}
                    size="small"
                    scroll={{
                      x: 'max-content',
                      y: 300,
                    }}
                    bordered
                    pagination={false}
                    onRow={(record) => ({
                      onDoubleClick: () => handleView(record),
                    })}
                    summary={() => {
                      return (
                        <Table.Summary fixed="bottom">
                          <Table.Summary.Row>
                            {columns
                              .filter((column) => column.render)
                              .map((column) => {
                                const isNumericColumn = typeof filteredDuLieuBLQ[0]?.[column.dataIndex] === 'number'
                                return (
                                  <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                    {column.dataIndex === 'STT' ? (
                                      <Text className="text-center flex justify-center" strong>
                                        {dataQuayCa.length}
                                      </Text>
                                    ) : null}
                                  </Table.Summary.Cell>
                                )
                              })}
                          </Table.Summary.Row>
                        </Table.Summary>
                      )
                    }}
                  ></Table>
                </div>
                <div className="w-[67vw] ">
                  <div>
                    <Table
                      loading={tableLoadChild}
                      className="BLQ_child1"
                      columns={columnChild1}
                      dataSource={filteredDuLieuBLQ}
                      size="small"
                      scroll={{
                        x: 'max-content',
                        y: 200,
                      }}
                      bordered
                      onRow={(record) => ({
                        onDoubleClick: () => handleViewThongTin(record),
                      })}
                      pagination={false}
                      summary={() => {
                        return (
                          <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                              {columnChild1
                                .filter((column) => column.render)
                                .map((column) => {
                                  const isNumericColumn = typeof filteredDuLieuBLQ[0]?.[column.dataIndex] === 'number'
                                  return (
                                    <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                      {column.dataIndex === 'TyLeCKTT' ? (
                                        <Text strong>
                                          {Number(filteredDuLieuBLQ.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLETYLE,
                                            maximumFractionDigits: dataThongSo?.SOLETYLE,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'TongTienHang' ||
                                        column.dataIndex === 'TongTienThue' ||
                                        column.dataIndex === 'TongThanhTien' ||
                                        column.dataIndex === 'TongTienCKTT' ||
                                        column.dataIndex === 'TongTongCong' ||
                                        column.dataIndex === 'KhachTra' ||
                                        column.dataIndex === 'HoanLai' ? (
                                        <Text strong>
                                          {Number(filteredDuLieuBLQ.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'SoChungTu' ? (
                                        <Text strong>{Object.values(dataBLQ).filter((value) => value.SoChungTu).length}</Text>
                                      ) : null}
                                    </Table.Summary.Cell>
                                  )
                                })}
                            </Table.Summary.Row>
                          </Table.Summary>
                        )
                      }}
                    ></Table>
                  </div>
                  <div>
                    <Table
                      loading={tableLoadTT}
                      className="BLQ_child2"
                      columns={columnChild2}
                      dataSource={transformedDataSource?.Details}
                      size="small"
                      scroll={{
                        x: 'max-content',
                        y: 200,
                      }}
                      bordered
                      pagination={false}
                      summary={() => {
                        return !transformedDataSource.Details ? null : (
                          <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                              {columnChild2
                                .filter((column) => column.render)
                                .map((column) => {
                                  const isNumericColumn = typeof transformedDataSource?.Details[0]?.[column.dataIndex] === 'number'
                                  return (
                                    <Table.Summary.Cell key={column.key} align={isNumericColumn ? 'right' : 'left'} className="text-end font-bold  bg-[#f1f1f1]">
                                      {column.dataIndex === 'TyLeThue' ? (
                                        <Text strong>
                                          {Number(transformedDataSource?.Details?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLETYLE,
                                            maximumFractionDigits: dataThongSo?.SOLETYLE,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'SoLuong' ? (
                                        <Text strong>
                                          {Number(transformedDataSource?.Details?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOLUONG,
                                            maximumFractionDigits: dataThongSo?.SOLESOLUONG,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'DonGia' ||
                                        column.dataIndex === 'TienHang' ||
                                        column.dataIndex === 'TienThue' ||
                                        column.dataIndex === 'ThanhTien' ? (
                                        <Text strong>
                                          {Number(transformedDataSource?.Details?.reduce((total, item) => total + (item[column.dataIndex] || 0), 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: dataThongSo?.SOLESOTIEN,
                                            maximumFractionDigits: dataThongSo?.SOLESOTIEN,
                                          })}
                                        </Text>
                                      ) : column.dataIndex === 'MaHang' ? (
                                        <Text strong>{Object.values(transformedDataSource?.Details).filter((value) => value.MaHang).length}</Text>
                                      ) : null}
                                    </Table.Summary.Cell>
                                  )
                                })}
                            </Table.Summary.Row>
                          </Table.Summary>
                        )
                      }}
                    ></Table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DuLieuBLQ
