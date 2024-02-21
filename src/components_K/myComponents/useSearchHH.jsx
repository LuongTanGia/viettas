/* eslint-disable no-useless-escape */
import moment from 'moment'
import { useMemo, useState } from 'react'

export const useSearchHH = (data) => {
  const [search, setSearch] = useState('')
  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const {
          MaHang,
          TenHang,
          DVT,
          NhomHang,
          // GiaBanLe
          ThongTinNhom,
          SoLuongTon,
          HieuLucTu,
          DonGia,
          TyLeThue,
          NgayTao,
          NguoiTao,
          NgaySuaCuoi,
          NguoiSuaCuoi,
          MaVach,
          // GiaKH
          MaDoiTuong,
          TenDoiTuong,
          ThongTinNhomGia,
          GhiChu,
        } = item || {}

        return (
          (MaHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (DVT || '').toLowerCase().includes(search.toLowerCase()) ||
          (NhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongTon?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (moment(HieuLucTu).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
          // GiaBanLe
          (ThongTinNhom || '').toLowerCase().includes(search.toLowerCase()) ||
          (DonGia?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TyLeThue?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (NgayTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiTao || '').toLowerCase().includes(search.toLowerCase()) ||
          (NgaySuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiSuaCuoi || '').toLowerCase().includes(search.toLowerCase()) ||
          (MaVach?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          // GiaKH
          (MaDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenDoiTuong || '').toLowerCase().includes(search.toLowerCase()) ||
          (ThongTinNhomGia || '').toLowerCase().includes(search.toLowerCase()) ||
          (GhiChu || '').toLowerCase().includes(search.toLowerCase())
        )
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
