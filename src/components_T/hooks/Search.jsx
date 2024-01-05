/* eslint-disable no-useless-escape */
import { useMemo, useState } from 'react'
import moment from 'moment'

export const useSearch = (data) => {
  const [search, setSearch] = useState('')
  const filteredData = useMemo(() => {
    if (data)
      return data
        .map((item) => ({
          ...item,
          TenHang: item?.TenHang,
          MaHang: item?.MaHang,
        }))
        .filter((item) => {
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
            // NTX
            TenNhomHang,
            TenKho,
            DVT,
            SoLuongTonDK,
            SoLuongNhap_PMH,
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
            (moment(NgayTao).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
            (moment(NgaySuaCuoi).format('DD/MM/YYYY') || '').toLowerCase().includes(search.toLowerCase()) ||
            (GiaBanLe?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
            (BangGiaSi?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
            (BangGiaSi_Min?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
            (BangGiaSi_Max?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
            // NXTKho
            (TenNhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
            (TenKho || '').toLowerCase().includes(search.toLowerCase()) ||
            (DVT || '').toLowerCase().includes(search.toLowerCase()) ||
            (SoLuongTonDK?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
            (SoLuongNhap_PMH?.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase())
          )
        })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
