/* eslint-disable no-async-promise-executor */
import axios from '../../axios'

export const DSTongHopPBL = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: '/processes/DuLieuQuayChuaTongHop/DanhSach',
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

export const TongHopPBL = (token, form) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('Data to be sent to API:', form)
      const response = await axios({
        url: '/processes/DuLieuQuayChuaTongHop/TongHopPhieuBanLe',
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
