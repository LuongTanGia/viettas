/* eslint-disable no-async-promise-executor */
import axios from '../../../axios'

export const DanhSachPMH = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuPMH/DanhSach',
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

export const ThongTinPMH = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPMH/ThongTin',
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
export const ThongTinSuaPMH = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPMH/ThongTinSua',
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

export const ListHelperKhoHangPMH = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPMH/ListHelper_KhoHang',
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

export const ListHelperDoiTuongPMH = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPMH/ListHelper_DoiTuong',
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

export const ListHelperHHPMH = (token, MK) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   SoChungTu: null,
      //   MaKho: MK,
      // });
      const response = await axios({
        url: '/entries/DuLieuPMH/ListHelper_HangHoa',
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

export const ThemPMH = (token, formPMH, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPMH,
        MaDoiTuong: MaDoiTuong,
        MaKho: MaKho,
      })
      const response = await axios({
        url: '/entries/DuLieuPMH/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ...formPMH, MaDoiTuong: MaDoiTuong, MaKho: MaKho },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaPMH = (token, Sct, formPMHEdit, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: {
          ...formPMHEdit,
          // ...formPMHEdit,
          // DataDetails: formPMHEdit?.DataDetails?.map((item, index) => ({
          //   ...item,
          //   STT: index + 1,
          // })),
          MaDoiTuong: MaDoiTuong,
          MaKho: MaKho,
        },
      })
      const response = await axios({
        url: '/entries/DuLieuPMH/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: {
            ...formPMHEdit,
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

export const XoaPMH = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuPMH/Xoa',
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

export const InPMH = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPrint,
        SoChungTuBatDau: SctBD,
        SoChungTuketThuc: SctKT,
        SoLien: SoLien,
      })
      const response = await axios({
        url: '/entries/DuLieuPMH/InPhieu',
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

export const InPK = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   ...formPrint,
      //   SoChungTuBatDau: SctBD,
      //   SoChungTuketThuc: SctKT,
      //   SoLien: SoLien,
      // });
      const response = await axios({
        url: '/entries/DuLieuPMH/InPhieuKho',
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

export const LapPhieuChi = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', Sct)
      const response = await axios({
        url: '/entries/DuLieuPMH/LapPhieuChi',
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

export const ThongSo = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/settings/GiaTriHeThong/ThongSo',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
