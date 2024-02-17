/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachGBL = (token) =>
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
        data: {},
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
        url: '/entries/DuLieuGiaBanLe/ThongTin',
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
export const ThongTinSuaGBL = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuGiaBanLe/ThongTinSua',
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

export const ListHelperHHGBL = (token, MK) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   SoChungTu: null,
      //   MaKho: MK,
      // });
      const response = await axios({
        url: '/entries/DuLieuGiaBanLe/ListHelper_HangHoa',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { SoChungTu: null, MaKho: MK },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const ThemGBL = (token, formGBL, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formGBL,
        MaDoiTuong: MaDoiTuong,
        MaKho: MaKho,
      })
      const response = await axios({
        url: '/entries/DuLieuGiaBanLe/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ...formGBL, MaDoiTuong: MaDoiTuong, MaKho: MaKho },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaGBL = (token, Sct, formGBLEdit, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: {
          ...formGBLEdit,
          // ...formGiaBanLeEdit,
          // DataDetails: formGiaBanLeEdit?.DataDetails?.map((item, index) => ({
          //   ...item,
          //   STT: index + 1,
          // })),
          MaDoiTuong: MaDoiTuong,
          MaKho: MaKho,
        },
      })
      const response = await axios({
        url: '/entries/DuLieuGiaBanLe/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: {
            ...formGBLEdit,
            MaDoiTuong: MaDoiTuong,
            MaKho: MaKho,
          },
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const XoaGBL = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuGiaBanLe/Xoa',
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

export const InGBL = (token, formPrint, SctBD, SctKT, SoLien) =>
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
