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
import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'

function DSBHKH_HH() {
  const token = localStorage.getItem('TKN')
  const [loadingSearch, setLoadingSearch] = useState(false)

  const [dataAPI, setDataAPI] = useState({
    NgayBatDau: '2023-12-15',
    NgayKetThuc: '2024-02-15',
    CodeValue1From: '',
    CodeValue1To: '',
    CodeValue1List: '',
    CodeValue2From: '',
    CodeValue2To: '',
    CodeValue2List: '',
  })
  const [data, setData] = useState([])
  const [dataDoiTuong, setDataDoiTuong] = useState([])
  const [dataNhomDoiTuong, setDataNhomDoiTuong] = useState([])
  const [dataDoiTuong_2, setDataDoiTuong_2] = useState([])
  const [dataNhomDoiTuong_2, setDataNhomDoiTuong_2] = useState([])
  useEffect(() => {
    const getDate = async () => {
      setLoadingSearch(true)
      console.log(dataAPI)
      const listTongHop = await CNDRTONGHOP(API.DSKhachHangHangHoa, token, dataAPI)
      const listDoiTuong = await CNDRTONGHOP_listHelper(API.DSListHelper_HangHoa, token)
      const listNhomDoiTuong = await CNDRTONGHOP_listHelper(API.DSListHelper_NhomHang, token)
      const listDoiTuong_2 = await CNDRTONGHOP_listHelper(API.DSListHelper_DoiTuong, token)
      const listNhomDoiTuong_2 = await CNDRTONGHOP_listHelper(API.DSListHelper_NhomDoiTuong, token)
      setData(listTongHop.DataResults || [])
      setDataDoiTuong(listDoiTuong.DataResults)
      setDataNhomDoiTuong(listNhomDoiTuong.DataResults)
      setDataDoiTuong_2(listDoiTuong_2.DataResults)
      setDataNhomDoiTuong_2(listNhomDoiTuong_2.DataResults)
      setLoadingSearch(false)
    }
    getDate()
  }, [
    dataAPI.NgayBatDau,
    dataAPI.NgayKetThuc,
    dataAPI.CodeValue1From,
    dataAPI.CodeValue1To,
    dataAPI.CodeValue1List,
    dataAPI.CodeValue2From,
    dataAPI.CodeValue2To,
    dataAPI.CodeValue2List,
  ])

  let nhomArray = dataDoiTuong_2?.map((customer) => customer.Nhom)

  return (
    <>
      <>
        <div className="flex justify-between ">
          <div className=" flex items-center gap-x-4 ">
            <h1 className="text-xl font-black uppercase">Doanh số bán hàng (khách hàng, hàng hóa) </h1>
          </div>
        </div>
        <div className="flex justify-start items-start flex-col">
          <Date onDateChange={setDataAPI} dataDate={dataAPI} />
          <div className="flex flex-col w-full ml-[100px]">
            <FilterCp
              title1={'Nhóm'}
              title2={'Đến'}
              title3={'Chọn'}
              option1={Array.from(new Set(nhomArray)).filter((element) => element !== '')}
              option2={Array.from(new Set(nhomArray)).filter((element) => element !== '')}
              option3={Array.from(new Set(dataNhomDoiTuong_2)).filter((element) => element !== '')}
              dataAPI={dataAPI}
              setDataAPI={setDataAPI}
              title={'DauVao'}
            />
            <FilterCp
              title1={'Nhóm'}
              title2={'Đến'}
              title3={'Chọn'}
              option1={Array.from(new Set(dataDoiTuong)).filter((element) => element !== '')}
              option2={Array.from(new Set(dataDoiTuong)).filter((element) => element !== '')}
              option3={Array.from(new Set(dataNhomDoiTuong)).filter((element) => element !== '')}
              dataAPI={dataAPI}
              setDataAPI={setDataAPI}
              title_DS={'DoiTuong'}
            />
          </div>
        </div>

        <div id="my-table">
          <Tables
            columName={nameColumsPhieuBanHang}
            param={data}
            height={'setHeight DSBH_KHHH'}
            selectMH={[1]}
            typeTable={'DSBH'}
            loadingSearch={loadingSearch}
            hiden={['ThongTinHangHoa', 'DiaChiDoiTuong']}
          />
        </div>
      </>
    </>
  )
}

export default DSBHKH_HH
