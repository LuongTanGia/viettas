/* eslint-disable no-useless-escape */
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
export const useSearch = (data) => {
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
  const DateFields = {
    TuNgay: (value) => formatDate(value, 'DD/MM/YYYY'),
    DenNgay: (value) => formatDate(value, 'DD/MM/YYYY'),
    HieuLucTu: (value) => formatDate(value, 'DD/MM/YYYY'),
    NgayTao: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgaySuaCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgayCNTLCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgayCNHTCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
  }
  // const filteredData = useMemo(() => {
  //   if (data)
  //     return data.filter((item) => {
  //       const {
  //         // HangHoa
  //         TenHang,
  //         MaHang,
  //         TenNhom,
  //         DVTKho,
  //         DienGiaiDVTQuyDoi,
  //         MaVach,
  //         NguoiTao,
  //         NguoiSuaCuoi,
  //         GiaBanLe,
  //         BangGiaSi,
  //         BangGiaSi_Min,
  //         BangGiaSi_Max,
  //         NgayTao,
  //         NgaySuaCuoi,
  //         // DoiTuong
  //         Ma,
  //         MaNhom,
  //         TenLoai,
  //         Ten,
  //         DiaChi,
  //         MST,
  //         DienThoai,
  //         Email,
  //         Fax,
  //         ThongTinNhomGia,
  //         // DSBH
  //         SoLuong,
  //         TienHang,
  //         TienThue,
  //         ThanhTien,
  //         TienCKTT,
  //         TongCong_TM,
  //         TongCong_CN,
  //         TongCong,
  //         // KhoHang
  //         MaKho,
  //         TenDayDu,
  //         // QuanLy
  //         MaNguoiDung,
  //         MaQuanLy,
  //         TenNguoiDung,
  //         TuNgay,
  //         DenNgay,
  //         // QuayTinhTIen
  //         Quay,
  //         TenMayTinh,
  //         SQLServer,
  //         SQLDatabase,
  //         NhomGia,
  //         DienGiaiLoai,
  //         NguoiCNHTCuoi,
  //         NgayCNHTCuoi,
  //         NguoiCNTLCuoi,
  //         NgayCNTLCuoi,
  //         // Phân ca (Danh sách)
  //         SoQuay,
  //         HieuLucTu,
  //         MaCa,
  //         // Xử lý/ Bình Quân Xuất Kho
  //         Thang,
  //         NguoiThucHien,
  //         ThoiGianThucHien,
  //         DonGia,
  //         // NTX
  //         TenNhomHang,
  //         TenKho,
  //         DVT,
  //         SoLuongTonDK,
  //         TriGiaTonDK,
  //         SoLuongNhap_PMH,
  //         TriGiaNhap_PMH,
  //         SoLuongNhap_NTR,
  //         TriGiaNhap_NTR,
  //         SoLuongNhap_NDC,
  //         TriGiaNhap_NDC,
  //         SoLuongNhap_NCK,
  //         SoLuongNhap,
  //         TriGiaNhap,
  //         SoLuongXuat_PBS,
  //         TriGiaXuat_PBS,
  //         SoLuongXuat_PBL,
  //         TriGiaXuat_PBL,
  //         SoLuongXuat_PBQ,
  //         TriGiaXuat_PBQ,
  //         SoLuongXuat_XTR,
  //         TriGiaXuat_XTR,
  //         SoLuongXuat_XSD,
  //         TriGiaXuat_XSD,
  //         SoLuongXuat_HUY,
  //         TriGiaXuat_HUY,
  //         SoLuongXuat_XCK,
  //         SoLuongXuat_XDC,
  //         TriGiaXuat_XDC,
  //         SoLuongTonCK,
  //         TriGiaTonCK,
  //         SoLuongXuat,
  //         TriGiaXuat,
  //         // CongNoDauVao_Ra
  //         MaDoiTuong,
  //         TenDoiTuong,
  //         DiaChiDoiTuong,
  //         SoDuDK,
  //         PhatSinhNo_PMH,
  //         PhatSinhNo_PBS,
  //         PhatSinhNo_DC,
  //         PhatSinhNo_Thu_XTR,
  //         PhatSinhNo_Chi_NTR,
  //         PhatSinhNo,
  //         ThanhToan_Chi_PMH,
  //         ThanhToan_Thu_PBS,
  //         ThanhToan_DC,
  //         ThanhToan_NTR,
  //         ThanhToan_XTR,
  //         ThanhToan,
  //         SoDuCK,
  //         // SoQuy
  //         THUCONGNO,
  //         THUTRAHANG,
  //         THUKHAC,
  //         CHICONGNO,
  //         CHITRAHANG,
  //         CHIKHAC,
  //         DauKy,
  //         CuoiKy,
  //         ConLai,
  //         // NDC, PLR , XDC, XCK, NCK
  //         SoChungTu,
  //         NgayCTu,
  //         SoThamChieu,
  //         ThongTinKho,
  //         ThongTinKhoNhan,
  //         SoMatHang,
  //         GhiChu,
  //         NhomHang,
  //         TongSoLuong,
  //         TongTriGiaKho,
  //       } = item || {}
  //       return (
  //         // HangHoa
  //         (DVTKho || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (GiaBanLe?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (BangGiaSi?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (BangGiaSi_Min?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (BangGiaSi_Max?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // DoiTuong
  //         (Ma || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (MaNhom || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TenLoai || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (Ten || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DiaChi?.toString() || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThongTinNhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (Email || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DienThoai?.toString() || '').includes(search.toLowerCase()) ||
  //         (MST?.toString() || '').includes(search.toLowerCase()) ||
  //         (Fax?.toString() || '').includes(search.toLowerCase()) ||
  //         // KhoHang
  //         (MaKho || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TenDayDu || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // DSBH
  //         (SoLuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TienHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TienThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (ThanhTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TienCKTT?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongCong_TM?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongCong_CN?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TongCong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // QuanLy
  //         (MaNguoiDung || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (MaQuanLy || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TenNguoiDung || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(TuNgay).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(DenNgay).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // QuayTinhTien
  //         (DienGiaiLoai || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TenMayTinh || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SQLServer || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SQLDatabase || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (NhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (Quay?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (NguoiCNHTCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (NguoiCNTLCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(NgayCNTLCuoi).format('DD/MM/YYYY HH:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(NgayCNHTCuoi).format('DD/MM/YYYY HH:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // PhanCa
  //         (moment(HieuLucTu).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (SoQuay?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (MaCa?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // BinhQuanXuatKho
  //         (NguoiThucHien || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(ThoiGianThucHien).format('DD/MM/YYYY HH:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DonGia?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (moment(Thang).format('MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
  //         // NXTKho
  //         (TenNhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TenKho || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DVT || '').toLowerCase().includes(search.toLowerCase()) ||
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
  //         (MaDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (TenDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
  //         (DiaChiDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
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
  //       )
  //     })
  //   else return []
  // }, [search, data])
  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const keys = Object.keys(item)
        return keys.some((key) => {
          const value = item[key] || ''
          if (DateFields[key]) {
            return DateFields[key](value).toLowerCase().includes(search?.trim().toLowerCase())
          }
          return String(value)?.toLowerCase().includes(search?.trim().toLowerCase())
        })
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
