// import QueryTable from '../util/Table/QueryTable'
// import LoadingPage from '../util/Loading/LoadingPage'
// import { PrinterOutlined } from '@ant-design/icons'
// import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
// import ActionModals from './ActionModals'
import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { CNDRTONGHOP, CNDRTONGHOP_listHelper } from '../../action/Actions'
import API from '../../API/API'
import FilterCp from '../util/filterCP/FilterCp'
import Date from '../util/DateCP/DateCP'
import Tables from '../util/Table/Table'

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
function DSBHKHH() {
  const token = localStorage.getItem('TKN')
  const [dataAPI, setDataAPI] = useState({
    NgayBatDau: '2023-12-15',
    NgayKetThuc: '2024-02-15',
    CodeValue1From: '',
    CodeValue1To: '',
    CodeValue1List: '',
  })
  const [data, setData] = useState([])
  const [dataDoiTuong, setDataDoiTuong] = useState([])
  const [dataNhomDoiTuong, setDataNhomDoiTuong] = useState([])

  useEffect(() => {
    const getDate = async () => {
      console.log(dataAPI)
      const listTongHop = await CNDRTONGHOP(API.DSKhachHang, token, dataAPI)
      const listDoiTuong = await CNDRTONGHOP_listHelper(API.DSListHelper_DoiTuong, token)
      const listNhomDoiTuong = await CNDRTONGHOP_listHelper(API.DSListHelper_NhomDoiTuong, token)

      setData(listTongHop.DataResults || [])
      setDataDoiTuong(listDoiTuong.DataResults)
      setDataNhomDoiTuong(listNhomDoiTuong.DataResults)
    }
    getDate()
  }, [dataAPI.NgayBatDau, dataAPI.NgayKetThuc, dataAPI.CodeValue1From, dataAPI.CodeValue1To, dataAPI.CodeValue1List])

  //   let nhomArray = dataDoiTuong?.map((customer) => customer.Nhom)

  return (
    <>
      <>
        <div className="flex justify-between ">
          <div className=" flex items-center gap-x-4 ">
            <h1 className="text-xl font-black uppercase">Doanh số bán hàng (Khách hàng) </h1>
          </div>
        </div>
        <div className="flex justify-start items-center">
          <Date onDateChange={setDataAPI} dataDate={dataAPI} />
          <FilterCp
            title1={'Nhóm'}
            title2={'Đến'}
            title3={'Chọn'}
            option1={Array.from(new Set(dataDoiTuong)).filter((element) => element !== '')}
            option2={Array.from(new Set(dataDoiTuong)).filter((element) => element !== '')}
            option3={Array.from(new Set(dataNhomDoiTuong)).filter((element) => element !== '')}
            dataAPI={dataAPI}
            setDataAPI={setDataAPI}
            title={'DoiTuong'}
          />
        </div>

        <div id="my-table">
          <Tables param={data} columName={[]} height={'setHeight'} selectMH={[1]} typeTable={'DSBH'} />
        </div>
      </>
    </>
  )
}

export default DSBHKHH
