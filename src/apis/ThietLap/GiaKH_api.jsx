/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachGKH = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/DanhSach',
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
export const DanhSachFullGKH = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/DanhSachFull',
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

export const ThongTinGKH = (token, Sct) =>
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

export const ListHelperDTGKH = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/ListHelper_DoiTuong',
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
export const ListHelperNGGKH = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/ListHelper_NhomGia',
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

export const ThemGKH = (token, formGKH) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formGKH,
      })
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formGKH,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaGKH = (token, formEdit) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formEdit,
      })
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/Sua',
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

export const XoaGKH = (token, Ma, HieuLuc) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/Xoa',
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
export const DieuChinhGKH = (token, formAdjustPrice) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formAdjustPrice,
      })
      const response = await axios({
        url: '/settings/NhomGiaDoiTuong/DieuChinh',
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

export const InGKH = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPrint,
        SoChungTuBatDau: SctBD,
        SoChungTuketThuc: SctKT,
        SoLien: SoLien,
      })
      const response = await axios({
        url: '/entries/DuLieuGiaBanLe/InPhieu',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ...formPrint,
          SoChungTuBatDau: SctBD,
          SoChungTuketThuc: SctKT,
          SoLien: SoLien,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
