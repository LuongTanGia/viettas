import axios from 'axios'
import loginSlice from '../components/Auth/loginSlice'
import MainSlice from '../components/MainPage/MainSlice'
import DuLieuSlice from '../components/DULIEU/DuLieuSlice'
import PBSSlice from '../components/PhieuBanHang/PBSSlice'
import { toast } from 'react-toastify'

// CallBack API Function
export const CallBackAPI = async (API, token, data) => {
  try {
    const response = await axios.post(API, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response && response.data) {
      if (response.data.DataError === -107 || response.data.DataError === -108) {
        const newToken = await RETOKEN()

        if (newToken !== '') {
          await CallBackAPI(API, newToken, data)
        } else {
          handleTokenRefreshError()
        }
      }

      return response.data.DataResult
    }

    handleResponseError()
  } catch (error) {
    handleError(error)
  }
}
const handleTokenRefreshError = () => {
  toast.error('Failed to refresh token!')
  window.localStorage.clear()
  window.location.href = '/login'
}
const handleResponseError = () => {
  toast.error('DataResults is undefined or null.')
}
const handleError = (error) => {
  toast.error(error)
}

//------------------------------------------------------------------------------
export const RETOKEN = async () => {
  const token = window.localStorage.getItem('RTKN')

  try {
    const response = await axios.post('https://isalewebapi.viettassaigon.vn/api/Auth/RefreshToken', {
      TokenID: token,
    })
    if (response.data.DataError === 0) {
      window.localStorage.setItem('TKN', response.data.TKN)

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
      return 0
    } else {
      toast(response.data.DataErrorDescription)
      return 1
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
////Phiếu mua hàng
export const DANHSACHPHIEUBANHANG = async (API, token, data, dispatch) => {
  try {
    const response = await axios.post(API, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
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
    if (response.data.DataError === -104) {
      toast.error(response.data.DataErrorDescription)
      return -1
    }
    return response.data.DataResults
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
export const THEMPHIEUBANHANG = async (API, token, data) => {
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
          await THEMPHIEUBANHANG(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
    return response.data.DataResults
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
export const XOAPHIEUBANHANG = async (API, token, data) => {
  try {
    const response = await axios.post(API, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response && response.data.DataError !== 0) {
      return 1
    }
    if (response && response.data) {
      if (response.data.DataError === -107 || response.data.DataError === -108) {
        // toast.error(response.data.DataErrorDescription);
        const newToken = await RETOKEN()
        if (newToken !== '') {
          await XOAPHIEUBANHANG(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
export const SUAPHIEUBANHANG = async (API, token, data) => {
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
          await SUAPHIEUBANHANG(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
    return response.data
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
export const LAPPHIEUTHU = async (API, token, data) => {
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
          await LAPPHIEUTHU(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
export const LISTCHUNGTU = async (API, token, data) => {
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
          await LISTCHUNGTU(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }

      return response.data.DataResults
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
export const INPHIEUPBS = async (API, token, data) => {
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
          await INPHIEUPBS(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }

      return response.data.DataResults
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
  } catch (error) {
    toast.error('Error adding user:', error)
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

export const formatQuantity = (number, odd) => {
  return number.toFixed(Math.max(odd)).replace(/,/g, '.')
}

export const formatPrice = (price, odd) => {
  const numberOfDecimals = odd || 0

  // Làm tròn số thập phân
  const roundedAmount = price.toFixed(numberOfDecimals)

  // Tách phần nguyên và phần thập phân
  const parts = roundedAmount.split('.')
  let integerPart = parts[0]
  let decimalPart = parts[1] || ''

  // Định dạng hàng nghìn với dấu phẩy
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Kiểm tra để xem có cần thêm số chữ số thập phân không
  if (numberOfDecimals > 0) {
    // Bổ sung số chữ số thập phân bằng cách sử dụng `padEnd`
    decimalPart = decimalPart.padEnd(numberOfDecimals, '0')
    decimalPart = `.${decimalPart}`
  } else {
    decimalPart = ''
  }

  // Kết hợp lại và thêm số chữ số thập phân nếu cần
  const formattedAmount = `${integerPart}${decimalPart}`

  return formattedAmount
}
