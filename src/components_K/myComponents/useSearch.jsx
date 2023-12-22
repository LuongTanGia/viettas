import moment from 'moment'
import { useMemo, useState } from 'react'
// import dayjs from 'dayjs'

// const convertToSearchableString = (value) => {
//   // Nếu giá trị là ngày, chuyển đổi thành định dạng chuẩn
//   if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
//     return dayjs(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
//   }
//   // Nếu giá trị là số, chuyển đổi thành chuỗi
//   if (!isNaN(value)) {
//     return value.toString()
//   }
//   return value.toLowerCase()
// }

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
        } = item || {}
        // console.log('vuiiivvv', NgayCTu.toDateTime())
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
          (TongMatHang.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongSoLuong.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienThue.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongTienHang.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (TongThanhTien.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase()) ||
          (NguoiSuaCuoi || '').toLowerCase().includes(search.toLowerCase())
        )
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData]
}
