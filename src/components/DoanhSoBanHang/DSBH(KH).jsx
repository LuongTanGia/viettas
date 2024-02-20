import { useEffect, useState } from 'react'
import { CNDRTONGHOP, CNDRTONGHOP_listHelper } from '../../action/Actions'
import API from '../../API/API'
import FilterCp from '../util/filterCP/FilterCp'
import Date from '../util/DateCP/DateCP'
import Tables from '../util/Table/Table'

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

  let nhomArray = dataDoiTuong?.map((customer) => customer.Nhom)

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
            option1={Array.from(new Set(nhomArray)).filter((element) => element !== '')}
            option2={Array.from(new Set(nhomArray)).filter((element) => element !== '')}
            option3={Array.from(new Set(dataNhomDoiTuong)).filter((element) => element !== '')}
            dataAPI={dataAPI}
            setDataAPI={setDataAPI}
            title={'DauVao'}
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
