/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DSThongSo = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ThongSo',
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

export const DieuChinhThongSo = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/GiaBanLe/ThongTin',
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

export const ListHelperDateLimitHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_DATERANGELIMIT',
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

export const ListHelperDateTypeHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_DATERANGETYPE',
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

export const ListHelperNCPHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_NhaCungCap',
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
export const ListHelperKHHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_KhachHang',
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
export const ListHelpeKhoHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_KhoHang',
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

export const ListHelpeHMThuHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_HangMucThu',
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

export const ListHelpeHMChiHT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ListHelper_HangMuchi',
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
