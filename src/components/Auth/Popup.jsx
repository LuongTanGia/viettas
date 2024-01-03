/* eslint-disable react/prop-types */

import { useDispatch } from 'react-redux'
import { LOGIN } from '../../action/Actions'
import API from '../../API/API'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Spin } from 'antd'
const CollectionCreateForm = ({ isShow, close, data, dataUser }) => {
  console.log(Cookies.get('remoteDb'))
  const [RemoteDB, setRemoteDB] = useState(Cookies.get('remoteDb'))
  const [isRemoteChanged, setIsRemoteChanged] = useState(Cookies.get('remoteDb') !== undefined ? true : false || false)
  const token = window.localStorage.getItem('tokenDuLieu')
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    Cookies.set('remoteDb', RemoteDB)
  }, [token])
  const handleLogin = async () => {
    setLoading(true)
    const response = await LOGIN(API.DANGNHAP, API.DANHSACHDULIEU, token, RemoteDB, dataUser, dispatch)
    setLoading(false)

    window.localStorage.setItem('firstLogin', true)

    if (response === 1) {
      Cookies.set('remoteDb', RemoteDB)
      window.location.href = '/'
    } else {
      setRemoteDB('')
    }
  }

  const handleChangeRadio = (e) => {
    const newRemoteDB = e.target.value
    setRemoteDB(newRemoteDB)
    setIsRemoteChanged(true)
  }

  return (
    <>
      {isShow ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <div className="w-[600px] m-6 p-6 absolute   shadow-lg bg-white rounded-md flex flex-col">
            <div className="flex justify-between items-center">
              <label className="text-lg font-bold">Chọn cơ sở dữ liệu</label>
            </div>

            <div className="p-6">
              {data?.DataResults?.map((item, index) => (
                <div className="flex items-center p-3" key={index}>
                  <input id={item.RemoteDB} type="radio" name="remoteDB" value={item.RemoteDB} onChange={handleChangeRadio} checked={item.RemoteDB === RemoteDB} />
                  <label htmlFor={item.RemoteDB} className={`ml-2 text-base ${item.RemoteDB === RemoteDB ? 'underline decoration-black-700/[.73]' : ''} font-medium `}>
                    {item.RemoteDBDescription}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Spin spinning={loading} delay={500}>
                <button
                  onClick={handleLogin}
                  disabled={!isRemoteChanged}
                  className={` active:scale-[.98] active:duration-75 text-white text-lg font-bold bg-blue-500 rounded-md px-2 py-1 w-[100px] mr-4 ${
                    !isRemoteChanged ? 'cursor-not-allowed bg-gray-500' : ''
                  }`}
                >
                  Xác nhận
                </button>
              </Spin>
              <button onClick={() => close()} className="active:scale-[.98] active:duration-75 text-white text-lg font-bold bg-rose-500 rounded-md px-2 py-1 w-[100px]">
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default CollectionCreateForm
