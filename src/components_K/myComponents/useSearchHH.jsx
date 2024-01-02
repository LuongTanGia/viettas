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

export const useSearchHH = (data) => {
  const [search, setSearch] = useState('')
  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const {
          MaHang,
          TenHang,
          DVT,

          SoLuongTon,
          NhomHang,
        } = item || {}
        // console.log('vuiiivvv', NgayCTu.toDateTime())
        return (
          (MaHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (TenHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (DVT || '').toLowerCase().includes(search.toLowerCase()) ||
          (NhomHang || '').toLowerCase().includes(search.toLowerCase()) ||
          (SoLuongTon.toString().replace(/[,\.]/g, '') || '').toLowerCase().includes(search.toLowerCase())
        )
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData]
}
