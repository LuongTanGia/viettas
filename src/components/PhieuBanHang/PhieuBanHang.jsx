import Table from '../util/Table/Table'
import LoadingPage from '../util/Loading/LoadingPage'

import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG, XOAPHIEUBANHANG, LAPPHIEUTHU } from '../../action/Actions'
import API from '../../API/API'
import { FcAddDatabase } from 'react-icons/fc'
// import { DatePicker } from 'antd'
import { toast } from 'react-toastify'
import ModelPrint from './PrintModel'
import ActionButton from '../util/Button/ActionButton'

// import 'antd/dist/antd.css'
// import dayjs from 'dayjs'

function PhieuBanHang() {
  const dispatch = useDispatch()
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)

  // const [date, setDate] = useState()

  const [data, setData] = useState()
  const [isShow, setIsShow] = useState(false)
  const [isShowPrint, setIsShowPrint] = useState(false)

  const [type, setType] = useState()
  const [dataRecord, setDataRecord] = useState([])

  useEffect(() => {
    const getListData = async () => {
      const dataRes = await DANHSACHPHIEUBANHANG(API.DANHSACHPBS, token, dispatch)
      setData(dataRes)
      setDataLoaded(true)
    }

    getListData()
  }, [dataRecord, token, dispatch, dataLoaded])

  console.log(data)

  const handleView = async (record) => {
    await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch)
    setIsShow(true)
    setType('view')
    setDataRecord(record)
  }
  const handleEdit = async (record) => {
    await THONGTINPHIEU(API.CHITIETPBS, token, record?.SoChungTu, dispatch)
    setIsShow(true)
    setType('edit')
    setDataRecord(record)
  }
  const handleCreate = async () => {
    setIsShow(true)
    setType('create')
    setDataRecord([])
  }
  const handleClose = () => {
    setIsShow(false)
    setDataRecord([])
  }
  const handleCloseAction = () => {
    setIsShowPrint(false)
    setDataRecord([])
  }
  const handleDelete = async (record) => {
    const response = await XOAPHIEUBANHANG(API.XOAPHIEUBANHANG, token, { SoChungTu: record?.SoChungTu }, dispatch)
    if (response !== 1) {
      setDataLoaded(false)
    } else {
      toast.info('Dữ liệu đã được lập phiếu thu tiền!. Không thể xóa.')
    }
  }
  if (!dataLoaded) {
    return <LoadingPage />
  }
  // const onChange = (date, dateString) => {
  //   console.log(date, dateString)
  //   setDate(date)
  // }

  const handleChangePhieuThu = async (record) => {
    await LAPPHIEUTHU(API.LAPPHIEUTHU, token, { SoChungTu: record?.SoChungTu }, dispatch)
    setDataLoaded(false)
  }
  const handleShowPrint = () => {
    setIsShowPrint(!isShowPrint)
  }
  return (
    <>
      <div>
        <div className="flex items-center gap-x-4">
          <h1 className="text-xl font-black uppercase">Phiếu Bán Hàng</h1>
        </div>
      </div>
      {/* <div className="flex gap-3 mb-2">
       
        <div className="flex gap-x-2 items-center">
          <label htmlFor="">Ngày</label>
          <DatePicker className="DatePicker_PMH" format="DD/MM/YYYY" />
        </div>
        <div className="flex gap-x-2 items-center">
          <label htmlFor="">Đến</label>
          <DatePicker className="DatePicker_PMH" format="DD/MM/YYYY" />
        </div>
        <div className=" ">
          <button className="flex items-center py-1 px-2 bg-bg-main rounded-md  text-white text-sm hover:opacity-80">Lọc</button>
        </div>
      </div> */}

      <div className="flex justify-end gap-2">
        <ActionButton color={'slate-50'} title={'Bản In'} background={'blue-500'} icon={''} bg_hover={'white'} color_hover={'blue-500'} handleAction={handleShowPrint} />
        <ActionButton
          color={'slate-50'}
          title={'Thêm Phiếu'}
          background={'blue-500'}
          icon={<FcAddDatabase />}
          bg_hover={'white'}
          color_hover={'blue-500'}
          handleAction={handleCreate}
        />
      </div>

      <Table
        param={data?.DataResults}
        columName={nameColumsPhieuBanHang}
        handleView={handleView}
        handleEdit={handleEdit}
        height={'h400'}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        handleChangePhieuThu={handleChangePhieuThu}
      />
      <ActionModals isShow={isShow} handleClose={handleClose} dataRecord={dataRecord} typeAction={type} />
      <ModelPrint isShowModel={isShowPrint} handleCloseAction={handleCloseAction} />
    </>
  )
}

export default PhieuBanHang
