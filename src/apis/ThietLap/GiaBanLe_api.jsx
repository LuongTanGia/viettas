/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachGBL = (token, formGetData) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/settings/GiaBanLe/DanhSach',
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
export const DanhSachFullGBL = (token, formGetData) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/settings/GiaBanLe/DanhSachFull',
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

export const ThongTinGBL = (token, Sct) =>
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

export const ListHelperHHGBL = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaBanLe/ListHelper_HangHoa',
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

export const ListHelperNhomGiaGBL = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaBanLe/ListHelper_NhomHang',
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

export const ThemGBL = (token, formGBL) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formGBL,
      })
      const response = await axios({
        url: '/settings/GiaBanLe/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formGBL,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaGBL = (token, formEdit) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formEdit,
      })
      const response = await axios({
        url: '/settings/GiaBanLe/Sua',
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

export const XoaGBL = (token, Ma, HieuLuc) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaBanLe/Xoa',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { Ma, HieuLuc },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
export const DieuChinhGBL = (token, formAdjustPrice) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', formAdjustPrice)
      const response = await axios({
        url: '/settings/GiaBanLe/DieuChinh',
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

export const InGBL = (token, formPrint) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', formPrint)
      const response = await axios({
        url: '/settings/GiaBanLe/InBangGia',
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
export const ImportGBL = (token, formGBL) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formGBL,
      })
      const response = await axios({
        url: '/settings/GiaBanLe/Import',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formGBL,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
