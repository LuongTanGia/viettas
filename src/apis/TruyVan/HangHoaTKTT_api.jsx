/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachHangHoaTKTT = (token, formGetData) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/inquiries/HangHoaTonKhoTamTinh/DanhSach',
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
export const ListHelperNhomHangHangHoaTKTT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/HangHoaTonKhoTamTinh/ListHelper_NhomHang',
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

export const ListHelperHHHangHoaTKTT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/HangHoaTonKhoTamTinh/ListHelper_HangHoa',
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

export const ListHelperKhoHangHangHoaTKTT = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/HangHoaTonKhoTamTinh/ListHelper_KhoHang',
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
