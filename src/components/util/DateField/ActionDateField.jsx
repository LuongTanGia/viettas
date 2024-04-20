/* eslint-disable react/prop-types */
import dayjs from 'dayjs'
import { DateField } from '@mui/x-date-pickers'

const ActionDateField = ({ formKhoanNgay, setFormKhoanNgay, setPrevDateValue, handleFilterDS }) => {
  const handleStartDateChange = (newDate) => {
    const startDate = newDate
    const endDate = formKhoanNgay.NgayKetThuc

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
        NgayKetThuc: startDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: startDate,
      })
    }
  }

  const handleEndDateChange = (newDate) => {
    const startDate = formKhoanNgay.NgayBatDau
    const endDate = dayjs(newDate).format('YYYY-MM-DD')

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, cập nhật ngày bắt đầu
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayBatDau: endDate,
        NgayKetThuc: endDate,
      })
    } else {
      setFormKhoanNgay({
        ...formKhoanNgay,
        NgayKetThuc: endDate,
      })
    }
  }

  return (
    <>
      <div className="flex gap-x-2 items-center">
        <label htmlFor="">Ngày</label>
        <DateField
          className="DatePicker_PMH max-w-[132px] min-w-[132px]"
          format="DD/MM/YYYY"
          value={dayjs(formKhoanNgay.NgayBatDau)}
          // maxDate={dayjs(formKhoanNgay.NgayKetThuc)}
          onChange={(newDate) => {
            setFormKhoanNgay({
              ...formKhoanNgay,
              NgayBatDau: dayjs(newDate).format('YYYY-MM-DD'),
            })
          }}
          onFocus={() => setPrevDateValue(formKhoanNgay)}
          onBlur={() => {
            handleStartDateChange(formKhoanNgay.NgayBatDau)
            handleFilterDS()
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setPrevDateValue(formKhoanNgay)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleStartDateChange(formKhoanNgay.NgayBatDau)
              handleFilterDS()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
            '& .MuiButtonBase-root': {
              padding: '4px',
            },
            '& .MuiSvgIcon-root': {
              width: '18px',
              height: '18px',
            },
            '& .MuiInputBase-input': {
              // fontSize: '14px',
              textAlign: 'center',
            },
          }}
        />
      </div>
      <div className="flex gap-x-2 items-center">
        <label htmlFor="">Đến</label>
        <DateField
          className="DatePicker_PMH max-w-[132px] min-w-[132px]"
          format="DD/MM/YYYY"
          value={dayjs(formKhoanNgay.NgayKetThuc)}
          onChange={(newDate) => {
            setFormKhoanNgay({
              ...formKhoanNgay,
              NgayKetThuc: dayjs(newDate).format('YYYY-MM-DD'),
            })
          }}
          onFocus={() => setPrevDateValue(formKhoanNgay)}
          onBlur={() => {
            handleEndDateChange(formKhoanNgay.NgayKetThuc)
            handleFilterDS()
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setPrevDateValue(formKhoanNgay)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEndDateChange(formKhoanNgay.NgayKetThuc)
              handleFilterDS()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #007FFF' },
            '& .MuiButtonBase-root': {
              padding: '4px',
            },
            '& .MuiSvgIcon-root': {
              width: '18px',
              height: '18px',
            },
            '& .MuiInputBase-input': {
              // fontSize: '14px',
              textAlign: 'center',
            },
          }}
        />
      </div>
    </>
  )
}

export default ActionDateField
