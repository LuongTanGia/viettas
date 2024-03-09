/* eslint-disable no-async-promise-executor */
import axios from '../../../axios'

export const DanhSachPCT = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuPCT/DanhSach',
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

export const ThongTinPCT = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPCT/ThongTin',
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
export const ThongTinSuaPCT = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPCT/ThongTinSua',
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
export const ListHelperDoiTuongPCT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPCT/ListHelper_DoiTuong',
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

export const ListHelperHangMucPCT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPCT/ListHelper_HangMuc',
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

export const ThemPCT = (token, formCreate) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        formCreate,
      })
      const response = await axios({
        url: '/entries/DuLieuPCT/Them',
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

export const SuaPCT = (token, Sct, formPCTEdit) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: formPCTEdit,
      })
      const response = await axios({
        url: '/entries/DuLieuPCT/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: formPCTEdit,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const XoaPCT = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPCT/Xoa',
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

export const InPCT = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPrint,
        SoChungTuBatDau: SctBD,
        SoChungTuketThuc: SctKT,
        SoLien: SoLien,
      })
      const response = await axios({
        url: '/entries/DuLieuPCT/InPhieu',
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
export const FilterPrint = (token, formPrint) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPCT/ListHelper_ChungTuTheoNgay',
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
