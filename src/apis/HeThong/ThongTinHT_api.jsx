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

export const DieuChinhThongSo = (token, formHT) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', formHT)
      const response = await axios({
        url: '/settings/GiaTriHeThong/DieuChinhThongSo',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formHT,
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
