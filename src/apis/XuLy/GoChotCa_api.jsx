/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DSGoChotCa = (token, form) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/processes/DuLieuQuayDaTongHop/DanhSach',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: form,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

export const GoChotCa = (token, form) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', form)
      const response = await axios({
        url: '/processes/DuLieuQuayDaTongHop/GoDuLieuTongHopPhieuBanLe',
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: form,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
