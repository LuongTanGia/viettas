/* eslint-disable no-async-promise-executor */
import axios from '../../../axios'

export const DanhSachSDV = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuSDV/DanhSach',
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

export const ThongTinSDV = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDV/ThongTin',
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
export const ThongTinSuaSDV = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDV/ThongTinSua',
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
export const ListHelperDoiTuongSDV = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDV/ListHelper_DoiTuong',
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

export const ThemSDV = (token, formCreate) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formCreate,
      })
      const response = await axios({
        url: '/entries/DuLieuSDV/Them',
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

export const SuaSDV = (token, Sct, formSDVEdit) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: formSDVEdit,
      })
      const response = await axios({
        url: '/entries/DuLieuSDV/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: formSDVEdit,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const XoaSDV = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuSDV/Xoa',
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
