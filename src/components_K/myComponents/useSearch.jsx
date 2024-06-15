/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export const useSearch = (data) => {
  const ThongSo = localStorage.getItem('ThongSo')
  const dataThongSo = ThongSo ? JSON.parse(ThongSo) : null
  const [search, setSearch] = useState('')
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
  const NumberFields = {
    TongMatHang: (value) => formatNumber(value, 0),
    SoLuong: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TongSoLuong: (value) => formatNumber(value, dataThongSo.SOLESOLUONG),
    TyLeCKTT: (value) => formatNumber(value, dataThongSo.SOLETYLE),
    TyLeThue: (value) => formatNumber(value, dataThongSo.SOLETYLE),
    DonGia: (value) => formatNumber(value, dataThongSo.SOLEDONGIA),
    SoTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongChi: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongThu: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    HoanLai: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    KhachTra: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TienThue: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TienHang: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    ThanhTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TienPhaiNop: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTienHang: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTienThue: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTongCong: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongTienCKTT: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
    TongThanhTien: (value) => formatNumber(value, dataThongSo.SOLESOTIEN),
  }
  const DateFields = {
    NgayCTu: (value) => formatDate(value, 'DD/MM/YYYY'),
    NgayTao: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
    NgaySuaCuoi: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
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
