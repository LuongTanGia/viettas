import axios from 'axios'
import loginSlice from '../components/Auth/loginSlice'
import MainSlice from '../components/MainPage/MainSlice'
import DuLieuSlice from '../components/DULIEU/DuLieuSlice'
import PBSSlice from '../components/PhieuBanHang/PBSSlice'
import { toast } from 'react-toastify'

export const RETOKEN = async () => {
  const token = window.localStorage.getItem('RTKN')

  try {
    const response = await axios.post('https://isalewebapi.viettassaigon.vn/api/Auth/RefreshToken', {
      TokenID: token,
    })
    if (response.data.DataError === 0) {
      window.localStorage.setItem('TKN', response.data.TKN)
      toast.error(response.data.DataErrorDescription)
      return response.data.TKN
    } else if (response.data.DataError === -107 || response.data.DataError === -111) {
      window.location.href = '/login'
      // toast.error(response.data.DataErrorDescription);

      return 0
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHDULIEU = async (API, data) => {
  try {
    const response = await axios.post(API, data)
    window.localStorage.setItem('tokenDuLieu', response.data.TKN)
    if (response.data.DataError === 0) {
      toast.success(response.data.DataErrorDescription)

      return response.data
    } else {
      toast.error(response.data.DataErrorDescription)
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const LOGIN = async (API1, API2, TKN, RemoteDB, data, dispatch) => {
  try {
    const response = await axios.post(API1, {
      TokenID: TKN,
      RemoteDB: RemoteDB,
    })
    if (response.data.DataError === 0) {
      window.localStorage.setItem('TKN', response.data.TKN)
      window.localStorage.setItem('RTKN', response.data.RTKN)
      window.localStorage.setItem('User', response.data.MappingUser)

      dispatch(loginSlice.actions.login(response.data))
      toast.error(response.data.DataErrorDescription)

      return 1
    } else {
      dispatch(loginSlice.actions.login([]))
    }
    if (response.data.DataError !== 0) {
      toast.error(response.data.DataErrorDescription)
      await DANHSACHDULIEU(API2, data)
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHCHUCNANG = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.DataError === -107) {
      toast.error(response.data.DataErrorDescription)
      const newToken = await RETOKEN()
      if (newToken) {
        await DANHSACHCHUCNANG(API, newToken, dispatch)
      } else {
        toast.error('Failed to refresh token!')
        window.location.href = '/login'
      }
    } else {
      dispatch(loginSlice.actions.login(response.data))
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHHANGHOA = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.DataError === -107 || response.data.DataError === -108) {
      // toast.error(response.data.DataErrorDescription);
      const newToken = await RETOKEN()
      if (newToken !== 0) {
        await DANHSACHHANGHOA(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.location.href = '/login'
      }
    } else {
      dispatch(MainSlice.actions.getDSHH(response.data))
    }
    dispatch(MainSlice.actions.getDSHH(response.data))
  } catch (error) {
    // window.location.href = "/login";

    console.error('Error adding user:', error)
  }
}
export const KHOANNGAY = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    dispatch(MainSlice.actions.getKhoanNgay(response.data))
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DATATONGHOP = async (API, token, KhoanNgay, dispatch) => {
  try {
    const response = await axios.post(API, KhoanNgay, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.DataError === -107) {
      // toast.error(response.data.DataErrorDescription);
      const newToken = await RETOKEN()
      if (newToken !== 0) {
        await DATATONGHOP(API, newToken, KhoanNgay, dispatch)
      } else {
        window.location.href = '/login'
        toast.error('Failed to refresh token!')
      }
    }
    dispatch(MainSlice.actions.getDataTongHop(response.data))
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DATADULIEU = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    dispatch(DuLieuSlice.actions.getDataDL(response.data))
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const THAYDOIRMATKHAU = async (API, data, token) => {
  try {
    const response = await axios.post(API, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.data.DataError === 0) {
      toast(response.data.DataErrorDescription)
    } else {
      toast(response.data.DataErrorDescription)
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

////Phiếu mua hàng
export const DANHSACHPHIEUBANHANG = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.DataError === -107 || response.data.DataError === -108) {
      // toast.error(response.data.DataErrorDescription);
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DANHSACHPHIEUBANHANG(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.clear()
        window.location.href = '/login'
      }
    }
    dispatch(PBSSlice.actions.getDanhSach(response.data))
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const THONGTINPHIEU = async (API, token, maphieu, dispatch) => {
  try {
    const response = await axios.post(
      API,
      { SoChungTu: maphieu },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.DataError === -107 || response.data.DataError === -108) {
      // toast.error(response.data.DataErrorDescription);
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await THONGTINPHIEU(API, newToken, maphieu, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.clear()
        window.location.href = '/login'
      }
    }
    dispatch(PBSSlice.actions.data_chitiet(response.data))
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHDOITUONG = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.DataError === -107 || response.data.DataError === -108) {
      // toast.error(response.data.DataErrorDescription);
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DANHSACHDOITUONG(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.clear()
        window.location.href = '/login'
      }
    }
    return response.data.DataResults
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHKHOHANG = async (API, token, dispatch) => {
  try {
    const response = await axios.post(
      API,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.DataError === -107 || response.data.DataError === -108) {
      // toast.error(response.data.DataErrorDescription);
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DANHSACHKHOHANG(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.clear()
        window.location.href = '/login'
      }
    }
    return response.data.DataResults
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHHANGHOA_PBS = async (API, token, data) => {
  console.log(data, 'dataAPI')
  try {
    const response = await axios.post(API, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response && response.data) {
      if (response.data.DataError === -107 || response.data.DataError === -108) {
        // toast.error(response.data.DataErrorDescription);
        const newToken = await RETOKEN()
        if (newToken !== '') {
          await DANHSACHHANGHOA_PBS(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data.DataResults) {
        console.log(response.data.DataResults, 'dataHelper')
        return response.data.DataResults
      } else {
        console.error('DataResults is undefined or null.')
      }
    } else {
      console.error('Response or response.data is undefined or null.')
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

// function Normal
export const base64ToPDF = (Base64PMH) => {
  // Decode base64 string
  const decodedData = atob(Base64PMH)
  // Convert decoded data to array buffer
  const arrayBuffer = new ArrayBuffer(decodedData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < decodedData.length; i++) {
    uint8Array[i] = decodedData.charCodeAt(i)
  }
  // Create Blob from array buffer
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  // Create a data URL from the Blob
  const dataUrl = URL.createObjectURL(blob)
  // Open a new window with the data URL
  const newWindow = window.open(dataUrl, '_blank')
  // Print the opened window
  newWindow.onload = function () {
    newWindow.print()
  }
}

export const keyDown = (e) => {
  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', 'Backspace', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  if (!validKeys.includes(e.key)) {
    e.preventDefault()
  }
}

export const roundNumber = (number) => {
  const roundedNumber = Math.round(number * 10) / 10
  return roundedNumber.toFixed(1)
}
