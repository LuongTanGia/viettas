import Table from '../util/Table/Table'
import { useSelector } from 'react-redux'
import { danhSachPBS } from '../../redux/selector'
import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU } from '../../action/Actions'
import API from '../../API/API'
import { FcAddDatabase } from 'react-icons/fc'
function PhieuBanHang() {
  const dispatch = useDispatch()
  const token = localStorage.getItem('TKN')
  const data = useSelector(danhSachPBS)
  const [isShow, setIsShow] = useState(false)
  const [type, setType] = useState()

  const [dataRecord, setDataRecord] = useState([])
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
    console.log('he')
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
      <Table param={data.DataResults} columName={nameColumsPhieuBanHang} handleView={handleView} handleEdit={handleEdit} height={'h400'} handleCreate={handleCreate} />
      <ActionModals isShow={isShow} handleClose={handleClose} dataRecord={dataRecord} typeAction={type} />
    </>
  )
}

export default PhieuBanHang
