/* eslint-disable no-async-promise-executor */
import axios from '../../../axios'

export const DanhSachPBL = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuPBL/DanhSach',
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

export const ThongTinPBL = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPBL/ThongTin',
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

export const InPBL = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPrint,
        SoChungTuBatDau: SctBD,
        SoChungTuketThuc: SctKT,
        SoLien: SoLien,
      })
      const response = await axios({
        url: '/entries/DuLieuPBL/InPhieu',
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

export const InPKPBL = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   ...formPrint,
      //   SoChungTuBatDau: SctBD,
      //   SoChungTuketThuc: SctKT,
      //   SoLien: SoLien,
      // });
      const response = await axios({
        url: '/entries/DuLieuPBL/InPhieuKho',
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
