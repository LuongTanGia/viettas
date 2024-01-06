import { useState, useEffect } from 'react'
import logo from '../../../assets/whitelogo_viettas.svg'

import { format } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
const DateTimeClock = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const formatDate = (date) => {
    return format(date, 'EEEE, dd-MM-yyyy', { locale: viLocale, timeZone: 'Asia/Ho_Chi_Minh' })
  }

  const formatTime = (date) => {
    return format(date, 'HH:mm:ss', { timeZone: 'Asia/Ho_Chi_Minh' })
  }

  return (
    <div className="p-3 pt-2">
      <div className="flex flex-col justify-end items-end">
        <h2 className="text-xl font-mono font-semibold  text-white"> {formatDate(currentDateTime)}</h2>
        <h2 className="text-xl font-mono font-semibold text-white"> {formatTime(currentDateTime)}</h2>
      </div>
      <div>
        <img src={logo} alt="" />
        <h2 className="text-xl font-mono font-semibold  text-white">Chia sẻ thành công, kết nối đam mê</h2>
      </div>
    </div>
  )
}

export default DateTimeClock
