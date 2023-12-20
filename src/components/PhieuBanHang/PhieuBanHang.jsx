import Table from '../util/Table/Table'
import LoadingPage from '../util/Loading/LoadingPage'

import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG } from '../../action/Actions'
import API from '../../API/API'
import { FcAddDatabase } from 'react-icons/fc'

function PhieuBanHang() {
  const dispatch = useDispatch()
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)

  const [data, setData] = useState()
  const [isShow, setIsShow] = useState(false)
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
    // setDataRecord([])
    setDataLoaded(false)
  }

  if (!dataLoaded) {
    return <LoadingPage />
  }
  return (
    <>
      <button
        onClick={handleCreate}
        className=" hover:bg-sky-500 border border-sky-500 p-2  rounded-md text-blue-400 hover:text-white font-medium float-right flex justify-center items-center
            mb-2"
      >
        <FcAddDatabase /> <p className="ml-2">Thêm Phiếu</p>
      </button>
      <Table param={data?.DataResults} columName={nameColumsPhieuBanHang} handleView={handleView} handleEdit={handleEdit} height={'h400'} handleCreate={handleCreate} />
      <ActionModals isShow={isShow} handleClose={handleClose} dataRecord={dataRecord} typeAction={type} />
    </>
  )
}

export default PhieuBanHang
