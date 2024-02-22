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
          // PCT
          SoTien,
          TenHangMuc,
          SoThamChieu,
          // GiaBanSi
          NhomGia,
          TenNhomGia,
          TongDoiTuong,
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
          (NgayTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (NgaySuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiSuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongMatHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongSoLuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienHang?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongThanhTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          // GiaBanSi
          (TongDoiTuong?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (NhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenNhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
          // PCT
          (SoTien?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenHangMuc || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoThamChieu || '').toLowerCase().includes(search.toLowerCase())
        )
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
