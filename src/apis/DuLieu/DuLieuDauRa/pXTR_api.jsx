/* eslint-disable no-async-promise-executor */
import axios from '../../../axios'

export const DanhSachXTR = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuXTR/DanhSach',
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

export const ThongTinXTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuXTR/ThongTin',
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

export const ThongTinSuaXTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuXTR/ThongTinSua',
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

export const ListHelperKhoHangXTR = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuXTR/ListHelper_KhoHang',
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

export const ListHelperDoiTuongXTR = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuXTR/ListHelper_DoiTuong',
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

export const ListHelperHHXTR = (token, MK) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   SoChungTu: null,
      //   MaKho: MK,
      // });
      const response = await axios({
        url: '/entries/DuLieuXTR/ListHelper_HangHoa',
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

export const ThemXTR = (token, formCreate, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API 2:', {
        ...formCreate,
        MaDoiTuong: MaDoiTuong,
        MaKho: MaKho,
      })
      const response = await axios({
        url: '/entries/DuLieuXTR/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ...formCreate, MaDoiTuong: MaDoiTuong, MaKho: MaKho },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaXTR = (token, Sct, formPXTREdit, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: {
          ...formPXTREdit,
          // ...formPXTREdit,
          // DataDetails: formPXTREdit?.DataDetails?.map((item, index) => ({
          //   ...item,
          //   STT: index + 1,
          // })),
          MaDoiTuong: MaDoiTuong,
          MaKho: MaKho,
        },
      })
      const response = await axios({
        url: '/entries/DuLieuXTR/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: {
            ...formPXTREdit,
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

export const XoaXTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuXTR/Xoa',
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

export const InXTR = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPrint,
        SoChungTuBatDau: SctBD,
        SoChungTuketThuc: SctKT,
        SoLien: SoLien,
      })
      const response = await axios({
        url: '/entries/DuLieuXTR/InPhieu',
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

export const InPKXTR = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   ...formPrint,
      //   SoChungTuBatDau: SctBD,
      //   SoChungTuketThuc: SctKT,
      //   SoLien: SoLien,
      // });
      const response = await axios({
        url: '/entries/DuLieuXTR/InPhieuKho',
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

export const LapPhieuThuXTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', Sct)
      const response = await axios({
        url: '/entries/DuLieuXTR/LapPhieuThu',
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
