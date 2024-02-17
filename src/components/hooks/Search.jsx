/* eslint-disable no-useless-escape */
import { useMemo, useState } from 'react'
import moment from 'moment'

export const useSearch = (data) => {
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const {
          // HangHoa
          TenHang,
          MaHang,
          TenNhom,
          DVTKho,
          DienGiaiDVTQuyDoi,
          MaVach,
          NguoiTao,
          NguoiSuaCuoi,
          GiaBanLe,
          BangGiaSi,
          BangGiaSi_Min,
          BangGiaSi_Max,
          NgayTao,
          NgaySuaCuoi,
          // DoiTuong
          Ma,
          TenLoai,
          Ten,
          DiaChi,
          MST,
          DienThoai,
          Email,
          Fax,
          ThongTinNhomGia,
          // NTX
          TenNhomHang,
          TenKho,
          DVT,
          SoLuongTonDK,
          SoLuongNhap_PMH,
          SoLuongNhap_NTR,
          SoLuongNhap_NDC,
          SoLuongNhap_NCK,
          SoLuongNhap,
          SoLuongXuat_PBS,
          SoLuongXuat_PBL,
          SoLuongXuat_PBQ,
          SoLuongXuat_XTR,
          SoLuongXuat_XSD,
          SoLuongXuat_HUY,
          SoLuongXuat_XCK,
          SoLuongXuat_XDC,
          SoLuongTonCK,
          SoLuongXuat,
          // NDC, PLR , XDC, XCK, NCK
          SoChungTu,
          NgayCTu,
          SoThamChieu,
          ThongTinKho,
          ThongTinKhoNhan,
          SoMatHang,
          GhiChu,
          NhomHang,
          TongSoLuong,
          TongTriGiaKho,
        } = item || {}
        return (
          // HangHoa
          (TenHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (MaHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenNhom || '').toLowerCase().includes(search.toLowerCase()) ||
          (DVTKho || '').toLowerCase().includes(search.toLowerCase()) ||
          (DienGiaiDVTQuyDoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (MaVach || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiSuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (moment(NgayTao).format('DD/MM/YYYY HH:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
          (moment(NgaySuaCuoi).format('DD/MM/YYYY HH:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
          (GiaBanLe?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (BangGiaSi?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (BangGiaSi_Min?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (BangGiaSi_Max?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          // DoiTuong
          (Ma || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenLoai || '').toLowerCase().includes(search.toLowerCase()) ||
          (Ten || '').toLowerCase().includes(search.toLowerCase()) ||
          (DiaChi?.toString() || '').toLowerCase().includes(search.toLowerCase()) ||
          (ThongTinNhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
          (Email || '').toLowerCase().includes(search.toLowerCase()) ||
          (DienThoai?.toString() || '').includes(search.toLowerCase()) ||
          (MST?.toString() || '').includes(search.toLowerCase()) ||
          (Fax?.toString() || '').includes(search.toLowerCase()) ||
          // NXTKho
          (TenNhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenKho || '').toLowerCase().includes(search.toLowerCase()) ||
          (DVT || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongTonDK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongNhap_PMH?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongNhap_NTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongNhap_NDC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongNhap_NCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongNhap?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_PBS?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_PBL?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_PBQ?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_XTR?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_XSD?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_HUY?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_XDC?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat_XCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongTonCK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongXuat?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          // NDC
          (SoChungTu || '').toLowerCase().includes(search.toLowerCase()) ||
          (NgayCTu?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (ThongTinKho || '').toLowerCase().includes(search.toLowerCase()) ||
          (ThongTinKhoNhan || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoThamChieu || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoMatHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (GhiChu || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTriGiaKho?.toString() || '').toLowerCase().includes(search.toLowerCase()) ||
          (NhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongSoLuong?.toString() || '').toLowerCase().includes(search.toLowerCase())
        )
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
