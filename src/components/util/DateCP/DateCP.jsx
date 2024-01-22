/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Input } from 'antd'
// import moment from 'moment'

const CustomDatePicker = ({ data }) => {
  const [dateValue, setDateValue] = useState(data)

  const handleInputChange = (e) => {
    const inputText = e.target.value
    const numericInput = inputText.replace(/[^0-9/]/g, '')
    setDateValue(numericInput)
  }

  const onBlurhandle = () => {
    let formattedInput = ''

    if (dateValue.length > 0) {
      formattedInput += dateValue.slice(0, 2)
    }
    if (dateValue.length > 2) {
      if (!dateValue.includes('/')) {
        formattedInput += '/' + dateValue.slice(2, 4)
      } else {
        formattedInput += dateValue.slice(2, 4)
      }
    }
    if (dateValue.length > 4) {
      if (!dateValue.includes('/', 5)) {
        formattedInput += '/' + dateValue.slice(4, 10)
      } else {
        formattedInput += dateValue.slice(4, 10)
      }
    }
    setDateValue(formattedInput)
  }

  return <Input value={dateValue} onChange={handleInputChange} onBlur={onBlurhandle} placeholder="Chọn ngày" />
}

export default CustomDatePicker
