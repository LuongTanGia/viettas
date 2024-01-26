import axios from '../axios'

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

export const ThemPCT = (token, formPCT, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPCT,
        MaDoiTuong: MaDoiTuong,
        MaKho: MaKho,
      })
      const response = await axios({
        url: '/entries/DuLieuPCT/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ...formPCT, MaDoiTuong: MaDoiTuong, MaKho: MaKho },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaPCT = (token, Sct, formPCTEdit, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: {
          ...formPCTEdit,
          // ...formPCTEdit,
          // DataDetails: formPCTEdit?.DataDetails?.map((item, index) => ({
          //   ...item,
          //   STT: index + 1,
          // })),
          MaDoiTuong: MaDoiTuong,
          MaKho: MaKho,
        },
      })
      const response = await axios({
        url: '/entries/DuLieuPCT/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: {
            ...formPCTEdit,
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

export const LapPhieuChi = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', Sct)
      const response = await axios({
        url: '/entries/DuLieuPCT/LapPhieuChi',
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
