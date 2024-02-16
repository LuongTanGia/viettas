import QueryTable from '../util/Table/QueryTable'
// import LoadingPage from '../util/Loading/LoadingPage'
// import { PrinterOutlined } from '@ant-design/icons'
// import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
// import ActionModals from './ActionModals'
import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { CNDRTONGHOP } from '../../action/Actions'
import API from '../../API/API'

// import ModelPrint from './PrintModel'
// import ActionButton from '../util/Button/ActionButton'
// import Model from './Model'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { DateField } from '@mui/x-date-pickers/DateField'
// import { BsSearch } from 'react-icons/bs'
// import dayjs from 'dayjs'
// import { Checkbox, Col, Input, Row } from 'antd'
// import { TfiMoreAlt } from 'react-icons/tfi'
// import { RiFileExcel2Fill } from 'react-icons/ri'
// import { Button, Spin } from 'antd'
// import { IoAddCircleOutline } from 'react-icons/io5'
// import { FaEyeSlash } from 'react-icons/fa'
// import { CloseSquareFilled } from '@ant-design/icons'
function CongNoDauRa() {
  const token = localStorage.getItem('TKN')
  const dataAPI = {
    NgayBatDau: '2023-12-15',
    NgayKetThuc: '2024-02-15',
    CodeValue1From: '',
    CodeValue1To: '',
    CodeValue1List: '',
  }
  const [data, setData] = useState([])
  useEffect(() => {
    const getDate = async () => {
      const listTongHop = await CNDRTONGHOP(API.CNDRTONGHOP, token, dataAPI)
      setData(listTongHop.DataResults)
    }
    getDate()
  }, [])
  console.log(data)
  return (
    <>
      <div className="flex justify-between mb-2 relative">
        <QueryTable param={data} columName={[]} height={'setHeight'} />
      </div>
    </>
  )
}

export default CongNoDauRa
