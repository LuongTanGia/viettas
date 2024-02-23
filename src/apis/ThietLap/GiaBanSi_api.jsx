/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachGBS = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/settings/NhomGia/DanhSach',
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

export const ThongTinGBS = (token, Ma) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/NhomGia/ThongTin',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { Ma: Ma },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const ListHelperHHGBS = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/NhomGia/ListHelper_HangHoa',
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

export const ThemGBS = (token, formGBS) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formGBS,
      })
      const response = await axios({
        url: '/settings/NhomGia/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formGBS,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaGBS = (token, formEdit) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formEdit,
      })
      const response = await axios({
        url: '/settings/NhomGia/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formEdit,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const XoaGBS = (token, Ma) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        Ma,
      })
      const response = await axios({
        url: '/settings/NhomGia/Xoa',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { Ma },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
export const DieuChinhGBS = (token, formAdjustPrice) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', formAdjustPrice)
      const response = await axios({
        url: '/settings/NhomGia/DieuChinh',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formAdjustPrice,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const InGBS = (token, formPrint) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formPrint,
      })
      const response = await axios({
        url: '/settings/NhomGia/InBangGia',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formPrint,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
