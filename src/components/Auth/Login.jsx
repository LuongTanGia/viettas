/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { DANHSACHDULIEU, LOGIN } from '../../action/Actions'
import { GoogleLogin } from '@react-oauth/google'
import API from '../../API/API'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { FcGoogle } from 'react-icons/fc'
import { Checkbox, Input, Spin } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import backgroundImg from '../../assets/img/backgroud.jfif'
import FAQ from '../FAQ/FAQ'
import './auth.css'
import Logo from '../../assets/bluelogo_viettas.svg'
import { toast } from 'react-toastify'

const App = () => {
  const [rememberMe, setRememberMe] = useState(Cookies.get('useCookies') === 'true')
  const [isShow, setIsShow] = useState(false)
  const token = window.localStorage.getItem('tokenDuLieu')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)

  const [user, setUser] = useState({
    User: '',
    Pass: '',
  })
  const [errors, setErrors] = useState({
    User: '',
    Pass: '',
  })
  useEffect(() => {
    Cookies.set('useCookies', rememberMe)
  }, [rememberMe, token])

  const onChangeInput = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        {
          rememberMe ? handleAddUser() : toast.warning('Chưa được cho phép sử dụng Cookie')
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [user.User, user.Pass, rememberMe])

  useEffect(() => {
    const authLogin = window.localStorage.getItem('authLogin')
    const handleLogin = async () => {
      setDataLoaded(false)
      try {
        const response_1 = authLogin ? await DANHSACHDULIEU(API.DANHSACHDULIEU, { TokenId: localStorage.getItem('authLogin') }, dispatch) : null
        const response_2 = authLogin ? await LOGIN(API.DANGNHAP, API.DANHSACHDULIEU, response_1.TKN, Cookies.get('remoteDb'), {}, dispatch) : null
        window.localStorage.setItem('firstLogin', true)
        if (response_2 === 1) {
          setTimeout(() => {
            setDataLoaded(true)
            window.location.href = '/'
          }, 300)
        } else {
          setDataLoaded(true)
        }
      } catch (error) {
        setDataLoaded(true)

        console.error('Error during login:', error)
      }
    }

    handleLogin()
  }, [])

  const handleAddUser = async () => {
    if (!user.User.trim() || !user.Pass.trim()) {
      setErrors({
        User: user.User.trim() ? '' : 'Tài khoản không được để trống',
        Pass: user.Pass.trim() ? '' : 'Mật khẩu không được để trống',
      })
      return
    }
    window.localStorage.setItem('userName', user.User)
    try {
      setLoading(true)
      const response = await DANHSACHDULIEU(API.DANHSACHDULIEU, user, dispatch)
      setLoading(false)
      if (response?.DataResults?.length === 1) {
        const remoteDB = response.DataResults[0].RemoteDB

        await LOGIN(API.DANGNHAP, API.DANHSACHDULIEU, response.TKN, remoteDB, {}, dispatch)
        window.localStorage.setItem('firstLogin', true)
        window.location.href = '/'
      } else if (response?.DataResults?.length > 1) {
        window.location.href = '/remotedb'
      }
    } catch (error) {
      console.error('Đăng nhập thất bại', error)
    }
  }
  const fetchGoogleUserInfo = async (googleCredential) => {
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleCredential}`)
    const googleUserInfo = await googleResponse.json()
    return googleUserInfo
  }
  const handleGoogleLogin = async (TokenID) => {
    console.log(TokenID)
    try {
      localStorage.setItem('authLogin', TokenID.credential)
      const googleUserInfo = await fetchGoogleUserInfo(TokenID.credential)
      window.localStorage.setItem('userInfo', JSON.stringify(googleUserInfo))

      const response = await DANHSACHDULIEU(API.DANHSACHDULIEU, { TokenId: TokenID.credential }, dispatch)

      if (response?.DataResults?.length === 1) {
        const remoteDB = response.DataResults[0].RemoteDB

        await LOGIN(API.DANGNHAP, API.DANHSACHDULIEU, response.TKN, remoteDB, {}, dispatch)
        window.localStorage.setItem('firstLogin', true)
        window.location.href = '/'
      } else if (response?.DataResults?.length > 1) {
        window.location.href = '/remotedb'
      }
    } catch (error) {
      console.error('Đăng nhập thất bại', error)
    }
  }

  return (
    <Spin tip="Kiểm tra đăng nhập ..." spinning={!dataLoaded}>
      <div className="flex justify-center items-center h-screen bg-cover" style={{ backgroundImage: `url(${backgroundImg})` }}>
        <div className=" w-[500px] p-6 shadow-lg bg-white rounded-md">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-center font-semibold text-3xl">Đăng Nhập</h1>
            <div className="object-contain block">
              <img src={Logo} alt="logo" />
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-4 flex flex-col">
              {/* <label className="text-lg font-medium mb-2">Tài khoản</label> */}
              <Input
                prefix={<UserOutlined className="site-form-item-icon text-neutral-500" />}
                size="large"
                name="User"
                required
                placeholder={errors.User ? errors.User && errors.User : 'Nhập tài khoản'}
                className={`${errors.User ? 'border-red-500' : ''} w-full rounded-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                value={user.User}
                onChange={onChangeInput}
              />
            </div>
            <div className="mb-4 flex flex-col">
              {/* <label className="text-lg font-medium mb-2">Mật khẩu</label> */}
              <Input.Password
                required
                name="Pass"
                prefix={<LockOutlined className="site-form-item-icon text-neutral-500" />}
                size="large"
                className={`${errors.Pass ? 'border-red-500' : ''} w-full rounded-full overflow-hidden whitespace-nowrap overflow-ellipsis`}
                value={user.Pass}
                placeholder={errors.Pass ? errors.Pass && errors.Pass : 'Nhập mật khẩu'}
                onChange={onChangeInput}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Checkbox id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="mr-2 text-base font-medium">
                  Sử dụng cookie
                </Checkbox>
                <p className="text-sm leading-relaxed">
                  Chúng tôi đang sử dụng <strong className="underline decoration-sky-500">cookie</strong> để cung cấp cho bạn những trải nghiệm tốt nhất trên trang web này. Bằng
                  cách tiếp tục truy cập, bạn đồng ý với <br />
                  <a className="underline decoration-sky-500 font-bold">Chính sách thu thập và sử dụng cookie của chúng tôi.</a>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 mt-8">
              <Spin spinning={loading}>
                <button
                  onClick={handleAddUser}
                  disabled={!rememberMe}
                  className={`w-full active:scale-[.98] active:duration-75 text-white text-lg font-bold  bg-blue-500 rounded-md px-4 py-2 ${
                    !rememberMe ? 'cursor-not-allowed bg-gray-400' : ''
                  }`}
                >
                  Đăng nhập
                </button>
              </Spin>
              <div className="block w-full border-t border-gray-300 mt-4 text-center">
                <b className="inline-block px-4 font-light text-sm text-center leading-10 text-slate-400 bg-neutral-100 border-gray-300 rounded-[50%] relative top-[-22px] z-1">
                  hoặc
                </b>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              {rememberMe ? (
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  text={'Đăng nhập bằng Google'}
                  onError={() => {
                    toast.error('Đăng nhập thất bại')
                  }}
                  useOneTap
                />
              ) : (
                <div>
                  <button
                    disabled
                    className="w-full py-2 px-2.5 border-2 text-sm font-google-sans bg-slate-300 rounded-[3px] cursor-not-allowed flex items-center text-center justify-center gap-2"
                  >
                    <FcGoogle className="w-[20px] h-[20px]" /> Sign in with Google
                  </button>
                </div>
              )}
            </div>
            {isShow ? (
              <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
                <div className="w-[80%] m-6 p-6 absolute shadow-lg bg-white rounded-md flex flex-col scroll-smooth box_dieuKhoan">
                  <FAQ />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsShow(false)}
                      className="active:scale-[.98] active:duration-75 text-white text-lg font-bold bg-rose-500 rounded-md px-2 py-1 w-[100px]"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => {
                        setRememberMe(!rememberMe)
                        setIsShow(false)
                      }}
                      className={`active:scale-[.98] active:duration-75 text-white text-lg font-bold bg-blue-500 rounded-md px-2 py-1 w-[100px] ml-4
                     `}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default App
