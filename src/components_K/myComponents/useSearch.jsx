/* eslint-disable no-useless-escape */
import moment from 'moment'
import { useMemo, useState } from 'react'

export const useSearch = (data) => {
  const [search, setSearch] = useState('')
  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const {
          SoChungTu,
          NgayCTu,
          MaDoiTuong,
          TenDoiTuong,
          DiaChi,
          MaKho,
          ThongTinKho,
          GhiChu,
          NgayTao,
          NguoiTao,
          NgaySuaCuoi,
          NguoiSuaCuoi,
          TongMatHang,
          TongSoLuong,
          TongTienHang,
          TongTienThue,
          TongThanhTien,
          PhieuChi,
          //XTR
          MaSoThue,
          PhieuThu,

          // PCT
          SoTien,
          TenHangMuc,
          SoThamChieu,
          // GiaBanSi
          NhomGia,
          TenNhomGia,
          TongDoiTuong,
          // SDV
          DiaChiDoiTuong,
          // Ban le Quay
          Quay,
          Ca,
          NhanVien,
          TyLeCKTT,
          TongTienCKTT,
          TongTongCong,
          KhachTra,
          HoanLai,
          SoChungTuTH,
          // Dong,
          MaHang,
          TenHang,
          DVT,
          SoLuong,
          DonGia,
          TienHang,
          TyLeThue,
          TienThue,
          ThanhTien,
          // TongHopPBL
          TongThu,
          TongChi,
          TienPhaiNop,
        } = item || {}

        return (
          (SoChungTu || '').toLowerCase().includes(search.toLowerCase()) ||
          (moment(NgayCTu).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
          (MaDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
          (DiaChi || '').toLowerCase().includes(search.toLowerCase()) ||
          (MaKho || '').toLowerCase().includes(search.toLowerCase()) ||
          (ThongTinKho || '').toLowerCase().includes(search.toLowerCase()) ||
          (GhiChu || '').toLowerCase().includes(search.toLowerCase()) ||
          (moment(NgayTao).format('DD/MM/YYYY hh:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
          // (NgayTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (moment(NgaySuaCuoi).format('DD/MM/YYYY hh:mm:ss') || '').toLowerCase().includes(search.toLowerCase()) ||
          // (NgaySuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiSuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongMatHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongSoLuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongThanhTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (PhieuChi || '').toLowerCase().includes(search.toLowerCase()) ||
          // GiaBanSi
          (TongDoiTuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (NhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenNhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
          //XTR
          (MaSoThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (PhieuThu || '').toLowerCase().includes(search.toLowerCase()) ||
          // PCT
          (SoTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenHangMuc || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoThamChieu || '').toLowerCase().includes(search.toLowerCase()) ||
          // ban le Quay
          (Quay?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (Ca || '').toLowerCase().includes(search.toLowerCase()) ||
          (NhanVien || '').toLowerCase().includes(search.toLowerCase()) ||
          (TyLeCKTT?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienCKTT?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTongCong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (KhachTra?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (HoanLai?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoChungTuTH || '').toLowerCase().includes(search.toLowerCase()) ||
          // (Dong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (MaHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (DVT || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (DonGia?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TienHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TyLeThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TienThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (ThanhTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          // TongHopPBL
          (TongThu?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongChi?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TienPhaiNop?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          // SDV
          (DiaChiDoiTuong || '').toLowerCase().includes(search.toLowerCase())
        )
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
