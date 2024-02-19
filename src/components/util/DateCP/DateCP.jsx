/* eslint-disable react/prop-types */
import { DateField } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

function Date({ dataDate, onDateChange, dateType }) {
  const [startDate, setStartDate] = useState(dayjs(dataDate?.NgayBatDau))
  const [endDate, setEndDate] = useState(dayjs(dataDate?.NgayKetThuc))
  const [DateChange, setDateChange] = useState(false)

  let timerId
  useEffect(() => {
    setStartDate(dayjs(dataDate?.NgayBatDau))
    setEndDate(dayjs(dataDate?.NgayKetThuc))
  }, [dataDate?.NgayBatDau, dataDate?.NgayKetThuc])

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue)
    setDateChange(false)
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue)
    setDateChange(true)
  }

  const handleDateChange = () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!DateChange && startDate && endDate && startDate.isAfter(endDate)) {
        onDateChange({
          ...dataDate,
          NgayBatDau: dayjs(startDate).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(startDate).format('YYYY-MM-DD'),
        })
        dateType === 'local'
          ? localStorage.setItem('dateLogin', JSON.stringify({ NgayBatDau: dayjs(startDate).format('YYYY-MM-DD'), NgayKetThuc: dayjs(startDate).format('YYYY-MM-DD') }))
          : null
        return
      } else if (DateChange && startDate && endDate && startDate.isAfter(endDate)) {
        onDateChange({
          ...dataDate,
          NgayBatDau: dayjs(endDate).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(endDate).format('YYYY-MM-DD'),
        })
        dateType === 'local'
          ? localStorage.setItem(
              'dateLogin',
              JSON.stringify({
                NgayBatDau: dayjs(endDate).format('YYYY-MM-DD'),
                NgayKetThuc: dayjs(endDate).format('YYYY-MM-DD'),
              }),
            )
          : null
      } else {
        onDateChange({
          ...dataDate,
          NgayBatDau: dayjs(startDate).format('YYYY-MM-DD'),
          NgayKetThuc: dayjs(endDate).format('YYYY-MM-DD'),
        })
        dateType === 'local'
          ? localStorage.setItem(
              'dateLogin',
              JSON.stringify({
                NgayBatDau: dayjs(startDate).format('YYYY-MM-DD'),
                NgayKetThuc: dayjs(endDate).format('YYYY-MM-DD'),
              }),
            )
          : null
      }
    }, 300)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateChange()
    }
  }
  return (
    <div className="flex w-[20%] justify-start items-end gap-1 min-w-[300px] ">
      <p className=" text-base">Từ</p>
      <DateField
        onBlur={handleDateChange}
        onKeyDown={handleKeyDown}
        size="small"
        format="DD/MM/YYYY"
        value={startDate}
        onChange={handleStartDateChange}
        className="w-[50%]  min-w-[300px]"
        sx={{
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
          '& .MuiButtonBase-root': {
            padding: '4px',
          },
          '& .MuiSvgIcon-root': {
            width: '18px',
            height: '18px',
          },
        }}
      />
      <p className=" text-base">Tới</p>

      <DateField
        onBlur={handleDateChange}
        onKeyDown={handleKeyDown}
        size="small"
        value={endDate}
        onChange={handleEndDateChange}
        className="w-[50%] min-w-[300px]"
        format="DD/MM/YYYY"
        sx={{
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
          '& .MuiButtonBase-root': {
            padding: '4px',
          },
          '& .MuiSvgIcon-root': {
            width: '18px',
            height: '18px',
          },
        }}
      />
    </div>
  )
}

export default Date
