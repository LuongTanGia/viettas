import axios from 'axios'
import loginSlice from '../components/Auth/loginSlice'
import MainSlice from '../components/MainPage/MainSlice'
import DuLieuSlice from '../components/DULIEU/DuLieuSlice'
import PBSSlice from '../components/PhieuBanHang/PBSSlice'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

import API from '../API/API'
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

const handleAPIError = (response) => {
  if (response.data.DataError !== 0) {
    toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
  }
}
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
  window.localStorage.removeItem('firstLogin')
  window.localStorage.removeItem('TKN')
  window.localStorage.removeItem('tokenDuLieu')
  window.localStorage.removeItem('RTKN')
  window.localStorage.removeItem('userName')
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
      return 0
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DANHSACHDULIEU = async (API, data) => {
  try {
    const response = await axiosInstance.post(API, data)
    window.localStorage.setItem('tokenDuLieu', response.data.TKN)
    if (response.data.DataError === 0) {
      return response.data
    } else {
      console.log('Error')
      // handleAPIError(response)
    }
    return response.data
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const LOGIN = async (API1, API2, TKN, RemoteDB, data, dispatch) => {
  try {
    const response = await axiosInstance.post(API1, {
      TokenID: TKN,
      RemoteDB: RemoteDB,
    })
    if (response.data.DataError === 0) {
      window.localStorage.setItem('TKN', response.data.TKN)
      window.localStorage.setItem('RTKN', response.data.RTKN)
      window.localStorage.setItem('User', response.data.MappingUser)
      dispatch(loginSlice.actions.login(response.data))
      return 1
    } else {
      dispatch(loginSlice.actions.login([]))
      console.log('Error')
    }
    if (response.data.DataError !== 0) {
      handleAPIError(response)
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
      toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
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
    // window.location.href = "/login"
    console.error('Error adding user:', error)
  }
}
export const KHOANNGAY = async (API, token) => {
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
    return response.data
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
      toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
      return 0
    } else {
      toast.error(response.data.DataErrorDescription, { autoClose: 2000 })
      return 1
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const DoanhSoHangHoa_TopChart = async (API, token, data) => {
  try {
    const response = await axios.post(API, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.data.DataError === -107 || response.data.DataError === -108) {
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DoanhSoHangHoa_TopChart(API, newToken, data)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')

        window.location.href = '/login'
      }
    }
    return response.data.DataResults
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
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DANHSACHPHIEUBANHANG(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')
        window.location.href = '/login'
      }
    }
    if (response.data.DataError === -104) {
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
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await THONGTINPHIEU(API, newToken, maphieu, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')
        window.location.href = '/login'
      }
    }
    dispatch(PBSSlice.actions.data_chitiet(response.data))
    return response.data
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
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DANHSACHDOITUONG(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')
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
      const newToken = await RETOKEN()
      if (newToken !== '') {
        await DANHSACHKHOHANG(API, newToken, dispatch)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')
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
        const newToken = await RETOKEN()
        if (newToken !== '') {
          await DANHSACHHANGHOA_PBS(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')
          window.location.href = '/login'
        }
      }

      if (response.data.DataResults) {
        return response.data.DataResults
      }
      // else {
      //   console.error('DataResults is undefined or null.')
      // }
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
        const newToken = await RETOKEN()
        if (newToken !== '') {
          await THEMPHIEUBANHANG(API, newToken, data)
        } else if (newToken === 0) {
          toast.error('Failed to refresh token!')
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')
          window.location.href = '/login'
        }
      }
    } else {
      toast.error('Response or response.data is undefined or null.', { autoClose: 1000 })
    }
    return response.data
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
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')
          window.location.href = '/login'
        }
      }

      if (response.data && response.data.DataError == 0) {
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 2000 })
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
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')

          window.location.href = '/login'
        }
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
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')
          window.location.href = '/login'
        }
      }

      if (response.data) {
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
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
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')

          window.location.href = '/login'
        }
      }

      if (response.data) {
        // toast.success(response.data.DataErrorDescription)
      } else {
        toast.error('DataResults is undefined or null.')
      }

      return response.data.DataResults
    } else {
      toast.error('Response or response.data is undefined or null.', { autoClose: 1000 })
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
          window.localStorage.removeItem('firstLogin')
          window.localStorage.removeItem('TKN')
          window.localStorage.removeItem('tokenDuLieu')
          window.localStorage.removeItem('RTKN')
          window.localStorage.removeItem('userName')
          window.location.href = '/login'
        }
      }
      if (response.data.DataError !== 0) {
        toast.error(response.data.DataErrorDescription, { autoClose: 2000 })
      }
      return response.data.DataResults
    } else {
      toast.error('Response or response.data is undefined or null.')
    }
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
// Công nợ đầu ra
export const CNDRTONGHOP = async (API, token, data) => {
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
        await CNDRTONGHOP(API, newToken)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!')
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')
        window.location.href = '/login'
      }
    }
    if (response.data.DataError === -104) {
      toast.error(response.data.DataErrorDescription, { autoClose: 2000 })
      return -1
    }
    return response.data
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const CNDRTONGHOP_listHelper = async (API, token, data) => {
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
        await CNDRTONGHOP_listHelper(API, newToken, data)
      } else if (newToken === 0) {
        toast.error('Failed to refresh token!', { autoClose: 2000 })
        window.localStorage.removeItem('firstLogin')
        window.localStorage.removeItem('TKN')
        window.localStorage.removeItem('tokenDuLieu')
        window.localStorage.removeItem('RTKN')
        window.localStorage.removeItem('userName')

        window.location.href = '/login'
      }
    }
    if (response.data.DataError === -104) {
      toast.error(response.data.DataErrorDescription)
      return -1
    }
    return response.data
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const APIPHANQUYEN = async (token, data) => {
  try {
    const response = await axios.post(API.QUYENHAN, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    toast.error('Error adding user:', error)
  }
}
export const base64ToPDF = (Base64PMH) => {
  const decodedData = atob(Base64PMH)
  const arrayBuffer = new ArrayBuffer(decodedData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < decodedData.length; i++) {
    uint8Array[i] = decodedData.charCodeAt(i)
  }
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const dataUrl = URL.createObjectURL(blob)
  const newWindow = window.open(dataUrl, '_blank')
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

export const formatCurrency = (value) => {
  return Number(value).toLocaleString('en-US')
}

export const formatPrice = (price, odd) => {
  if (price === null || price === undefined) return
  const numberOfDecimals = odd || 0
  const roundedAmount = price.toFixed(numberOfDecimals)
  const parts = roundedAmount.split('.')
  let integerPart = parts[0]
  let decimalPart = parts[1] || ''
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (numberOfDecimals > 0) {
    decimalPart = decimalPart.padEnd(numberOfDecimals, '0')
    decimalPart = `.${decimalPart}`
  } else {
    decimalPart = ''
  }
  const formattedAmount = `${integerPart}${decimalPart}`
  return formattedAmount
}

export const exportToExcel = () => {
  const ws = XLSX.utils.table_to_sheet(document.getElementById('my-table'), { origin: 'A6' })
  const wb = XLSX.utils.book_new()
  const companyInfo = [['Tên Công Ty: Viettas SaiGon JSC'], ['Địa Chỉ: 351/9 Nơ Trang Long P.13 Q.Bình Thạnh TPHCM'], [`Ngày :${dayjs(new Date()).format('YYYY-MM-DD')}`]]
  XLSX.utils.sheet_add_aoa(ws, companyInfo, { origin: 'A2' })
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSach')
  XLSX.writeFile(wb, 'du_lieu.xlsx')
}
export const exportSampleExcel = (sheet1Data, sheet2Data) => {
  // Tạo workbook và thêm sheet
  const wb = XLSX.utils.book_new()
  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data)
  ws1['!cols'] = [{ width: 30 }, { width: 30 }]
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data)
  ws2['!cols'] = [{ width: 30 }, { width: 40 }, { width: 10 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Thay đổi bảng giá')
  XLSX.utils.book_append_sheet(wb, ws2, 'Danh sách hàng hóa')
  // Xuất file Excel
  XLSX.writeFile(wb, 'fileSampleExcel.xlsx')
}
