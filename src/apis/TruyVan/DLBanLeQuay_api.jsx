/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachBLQ = (token, formGetData) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/inquiries/DuLieuQuayBanLe/DanhSachQuayCa',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formGetData,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
export const DanhSachPhieuBLQ = (token, formPBLQ) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/DuLieuQuayBanLe/DanhSachPhieuBanLeTaiQuay',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formPBLQ,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const DanhSachPhieuThuQ = (token, formPBLQ) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/DuLieuQuayBanLe/DanhSachPhieuThuTaiQuay',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formPBLQ,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
export const DanhSachPhieuChiQ = (token, formPBLQ) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/DuLieuQuayBanLe/DanhSachPhieuChiTaiQuay',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formPBLQ,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const ThongTinPhieuBLQ = (token, sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/DuLieuQuayBanLe/ThongTinPhieuBanLeTaiQuay',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: sct,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
