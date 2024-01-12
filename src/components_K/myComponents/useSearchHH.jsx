import { useMemo, useState } from 'react'

export const useSearchHH = (data) => {
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
          const { MaHang, TenHang, DVT, SoLuongTon, NhomHang } = item || {}
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

  return [setSearch, filteredData, search]
}
