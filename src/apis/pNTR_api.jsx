import axios from '../axios'

export const DanhSachNTR = (token, formKhoanNgay) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/entries/DuLieuNTR/DanhSach',
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

export const ThongTinNTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuNTR/ThongTin',
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

export const ListHelperKhoHangNTR = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuNTR/ListHelper_KhoHang',
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

export const ListHelperDoiTuongNTR = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuNTR/ListHelper_DoiTuong',
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

export const ListHelperHHNTR = (token, MK) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   SoChungTu: null,
      //   MaKho: MK,
      // });
      const response = await axios({
        url: '/entries/DuLieuNTR/ListHelper_HangHoa',
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

export const ThemNTR = (token, formPNTR, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPNTR,
        MaDoiTuong: MaDoiTuong,
        MaKho: MaKho,
      })
      const response = await axios({
        url: '/entries/DuLieuNTR/Them',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ...formPNTR, MaDoiTuong: MaDoiTuong, MaKho: MaKho },
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const SuaNTR = (token, Sct, formPNTREdit, MaDoiTuong, MaKho) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        SoChungTu: Sct,
        Data: {
          ...formPNTREdit,
          // ...formPNTREdit,
          // DataDetails: formPNTREdit?.DataDetails?.map((item, index) => ({
          //   ...item,
          //   STT: index + 1,
          // })),
          MaDoiTuong: MaDoiTuong,
          MaKho: MaKho,
        },
      })
      const response = await axios({
        url: '/entries/DuLieuNTR/Sua',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          SoChungTu: Sct,
          Data: {
            ...formPNTREdit,
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

export const XoaNTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/entries/DuLieuNTR/Xoa',
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

export const InNTR = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', {
        ...formPrint,
        SoChungTuBatDau: SctBD,
        SoChungTuketThuc: SctKT,
        SoLien: SoLien,
      })
      const response = await axios({
        url: '/entries/DuLieuNTR/InPhieu',
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

export const InPKNTR = (token, formPrint, SctBD, SctKT, SoLien) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log("Data to be sent to API:", {
      //   ...formPrint,
      //   SoChungTuBatDau: SctBD,
      //   SoChungTuketThuc: SctKT,
      //   SoLien: SoLien,
      // });
      const response = await axios({
        url: '/entries/DuLieuNTR/InPhieuKho',
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

export const LapPhieuChiNTR = (token, Sct) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', Sct)
      const response = await axios({
        url: '/entries/DuLieuNTR/LapPhieuChi',
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
