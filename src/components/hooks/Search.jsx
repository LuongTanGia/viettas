/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
export const useSearch = (data) => {
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [search, setSearch] = useState('')
  const formatDate = (date, format) => dayjs(date).format(format) || ''
  const formatNumber = (number, decimalPlaces) => {
    if (typeof number === 'number' && !isNaN(number)) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
      })
      return formatter.format(number)
    }
    return ''
  }

  const NumberFields = {
    BangGiaSi: (value) => formatNumber(value, 0),
    GiaBanLe: (value) => formatNumber(value, dataThongSo.SOLEDONGIA),
    SoDuDK: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    SoDuCK: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongSoLuong: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTienHang: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTienThue: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongThanhTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTongCong: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Le_TienHang: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Si_TienHang: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Le_TienThue: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Si_TienThue: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Le_ThanhTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Si_ThanhTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Le_ChietKhau: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Si_ChietKhau: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Le_TongCong: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    Si_TongCong: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TienHang: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ChietKhau: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongCong: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TienThue: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TyLeCKTT: (value) => formatNumber(value, dataThongSo.SOLETYLE),
    TongTienCKTT: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    KhachTra: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    HoanLai: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhToan: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    SoTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    PhatSinhNo_PBS: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    PhatSinhNo_DC: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    PhatSinhNo_Chi_NTR: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    PhatSinhNo: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhToan_Thu_PBS: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhToan_DC: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    PhatSinhNo_PMH: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    PhatSinhNo_Thu_XTR: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhToan_Chi_PMH: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhToan_XTR: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhToan_NTR: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    SoLuongTonDK: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaTonDK: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongNhap_PMH: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaNhap_PMH: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongNhap_NTR: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaNhap_NTR: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongNhap_NDC: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaNhap_NDC: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongNhap: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaNhap: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_PBS: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_PBS: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_PBL: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_PBL: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_PBQ: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_PBQ: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_XTR: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_XTR: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_XSD: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_XSD: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_HUY: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_HUY: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat_XDC: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat_XDC: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongXuat: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaXuat: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    SoLuongTonCK: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TriGiaTonCK: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    BangGiaSi_Min: (value) => formatNumber(value, dataThongSo.SOLEDONGIA),
    BangGiaSi_Max: (value) => formatNumber(value, dataThongSo.SOLEDONGIA),
    TongTriGiaKho: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
  }
  const DateFields = {
    TuNgay: (value) => formatDate(value, 'DD/MM/YYYY'),
    DenNgay: (value) => formatDate(value, 'DD/MM/YYYY'),
    HieuLucTu: (value) => formatDate(value, 'DD/MM/YYYY'),
    NgayTao: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgaySuaCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgayCNTLCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgayCNHTCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
  }

  //         (SoLuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TienHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TienThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TienCKTT?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongCong_TM?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongCong_CN?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongCong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (Quay?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //
  //         // PhanCa
  //         (SoQuay?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (MaCa?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // BinhQuanXuatKho
  //         (NguoiThucHien || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(ThoiGianThucHien).format('DD/MM/YYYY HH:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DonGia?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(Thang).format('MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // NXTKho

  //         (SoLuongTonDK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaTonDK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongNhap_PMH?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaNhap_PMH?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongNhap_NTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaNhap_NTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongNhap_NDC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaNhap_NDC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongNhap_NCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongNhap?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaNhap?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_PBS?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_PBS?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_PBL?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_PBL?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_PBQ?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_PBQ?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_XTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_XTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_XSD?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_XSD?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_HUY?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_HUY?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_XDC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat_XDC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat_XCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongTonCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaTonCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoLuongXuat?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TriGiaXuat?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // CongNoDauVao_Ra
  //
  //         (SoDuDK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (PhatSinhNo_PMH?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (PhatSinhNo_DC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (PhatSinhNo_Thu_XTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (PhatSinhNo?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhToan_Chi_PMH?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhToan_DC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhToan_XTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoDuCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhToan?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (PhatSinhNo_PBS?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (PhatSinhNo_Chi_NTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhToan_Thu_PBS?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhToan_NTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // SoQuy
  //         (THUCONGNO?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (THUTRAHANG?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (THUKHAC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (CHICONGNO?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (CHITRAHANG?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (CHIKHAC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DauKy?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (CuoiKy?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ConLai?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // NDC
  //         (SoChungTu || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (NgayCTu?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThongTinKho || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThongTinKhoNhan || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoThamChieu || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoMatHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (GhiChu || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongTriGiaKho?.toString() || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (NhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongSoLuong?.toString() || '').toLowerCase().includes(search.toLowerCase())

  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const keys = Object.keys(item)
        return keys.some((key) => {
          const value = item[key] || ''
          if (DateFields[key]) {
            return DateFields[key](value).toLowerCase().includes(search?.trim().toLowerCase())
          } else if (NumberFields[key]) {
            return NumberFields[key](value).toLowerCase().includes(search?.trim().toLowerCase())
          }
          return String(value)?.toLowerCase().includes(search?.trim().toLowerCase())
        })
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
