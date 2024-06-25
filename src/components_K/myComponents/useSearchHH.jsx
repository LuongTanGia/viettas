/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

export const useSearchHH = (data) => {
  const [search, setSearch] = useState('')
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
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
    HieuLucTu: (value) => formatDate(value, 'DD/MM/YYYY'),
    NgayTao: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgaySuaCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
  }
  const NumberFields = {
    SoLuongTon: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TyLeThue: (value) => formatNumber(value, dataThongSo.SOLETYLE),
    DonGia: (value) => formatNumber(value, dataThongSo.SOLEDONGIA),
    GiaLe: (value) => formatNumber(value, dataThongSo.SOLEDONGIA),
  }
  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const keys = Object.keys(item)
        return keys.some((key) => {
          const value = item[key] || ''
          if (DateFields[key]) {
            return DateFields[key](value).toLowerCase().includes(search?.trim().toLowerCase())
          } else if (NumberFields[key]) {
            return NumberFields[key](value).toLowerCase().includes(search?.trim().toLowerCase())
          }
          return String(value)?.toLowerCase().includes(search?.trim().toLowerCase())
        })
      })
    else return []
  }, [search, data])

  return [setSearch, filteredData, search]
}
