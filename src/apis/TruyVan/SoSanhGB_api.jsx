/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DanhSachSoSanhGB = (token, formGetData) =>
  new Promise(async (resolve, reject) => {
    try {
      // console.log('Data to be sent to API:', {
      //   formKhoanNgay,
      // })
      const response = await axios({
        url: '/inquiries/SoSanhBangGia/DanhSach',
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
export const ListHelperNhomHangSoSanhGB = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/SoSanhBangGia/ListHelper_NhomHang',
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

export const ListHelperHHSoSanhGB = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/SoSanhBangGia/ListHelper_HangHoa',
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

export const ListHelperNhomGiaSoSanhGB = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/inquiries/SoSanhBangGia/ListHelper_NhomGia',
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
