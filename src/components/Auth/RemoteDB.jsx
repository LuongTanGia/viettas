// import React from 'react'
import CardRemoteDB from './CardRemoteDB'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../API/API'
import { LOGIN } from '../../action/Actions'
import Cookies from 'js-cookie'
function RemoteDB() {
  const navigate = useNavigate()
  const token = window.localStorage.getItem('tokenDuLieu')
  const data = JSON.parse(localStorage.getItem('dataRemote'))

  useEffect(() => {
    if (data.length === 0) {
      navigate('/login')
    }
  }, [data])

  const handleLogin = async (item) => {
    const response = await LOGIN(API.DANGNHAP, API.DANHSACHDULIEU, token, item.RemoteDB, item.MaKho, {})

    if (response === 1) {
      Cookies.set('remoteDb', RemoteDB)

      navigate('/')
    }
  }
  return (
    <div className="flex flex-wrap gap-0 justify-center items-center">
      {data.map((item, key) => (
        <CardRemoteDB item={item} key={key} handleLogin={handleLogin} />
      ))}
    </div>
  )
}

export default RemoteDB
