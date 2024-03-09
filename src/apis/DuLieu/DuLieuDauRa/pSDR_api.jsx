/* eslint-disable no-async-promise-executor */
import axios from '../../../axios'

export const DanhSachSDR = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuSDR/DanhSach',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formKhoanNgay,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const ThongTinSDR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDR/ThongTin',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
export const ThongTinSuaSDR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDR/ThongTinSua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
export const ListHelperDoiTuongSDR = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDR/ListHelper_DoiTuong',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {},
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const ThemSDR = (token, formCreate) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formCreate,
      })
      const response = await axios({
        url: '/entries/DuLieuSDR/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formCreate,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaSDR = (token, Sct, formSDREdit) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: formSDREdit,
      })
      const response = await axios({
        url: '/entries/DuLieuSDR/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: formSDREdit,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const XoaSDR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDR/Xoa',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { SoChungTu: Sct },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
