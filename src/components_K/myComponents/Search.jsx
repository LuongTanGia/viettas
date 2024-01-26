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

export const Search = (data) => {
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter((item) => {
      return Object.values(item).some((fieldValue) => {
        const searchableValue = typeof fieldValue === 'string' ? fieldValue : fieldValue?.toString().toLowerCase()

        return searchableValue.includes(search?.toLowerCase())
      })
    })
  }, [search, data])

  return [setSearch, filteredData, search]
}
