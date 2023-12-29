import Table from '../util/Table/Table'
import LoadingPage from '../util/Loading/LoadingPage'
import { SwitcherOutlined, PrinterOutlined, FileAddOutlined, HeartOutlined, FormOutlined } from '@ant-design/icons'
import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG, XOAPHIEUBANHANG, LAPPHIEUTHU } from '../../action/Actions'
import API from '../../API/API'
// import { FcAddDatabase } from 'react-icons/fc'
// import { DatePicker } from 'antd'
import { toast } from 'react-toastify'
import ModelPrint from './PrintModel'
import ActionButton from '../util/Button/ActionButton'
import Model from './Model'
import { FloatButton } from 'antd'
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
  const [isShowDelete, setIsShowDelete] = useState(false)
  const [typeModel, setTypeModel] = useState('')

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
    setIsShowDelete(false)
    setDataRecord([])
  }
  const handleCloseAction = () => {
    setIsShowPrint(false)
    setDataRecord([])
  }

  const handleDelete = async (record) => {
    setIsShowDelete(true)
    setDataRecord(record)
    setTypeModel('Delete')
    // const response = await XOAPHIEUBANHANG(API.XOAPHIEUBANHANG, token, { SoChungTu: record?.SoChungTu }, dispatch)
    // if (response !== 1) {
    //   setDataLoaded(false)
    // } else {
    //   toast.info('Dữ liệu đã được lập phiếu thu tiền!. Không thể xóa.')
    // }
  }

  const ActionDelete = async (record) => {
    const response = await XOAPHIEUBANHANG(API.XOAPHIEUBANHANG, token, { SoChungTu: record?.SoChungTu }, dispatch)
    if (response !== 1) {
      setDataLoaded(false)
      setIsShowDelete(false)
    } else {
      toast.info(`${record?.SoChungTu} đã lập phiếu thu tiền!`)
    }
  }

  //ActionPay
  const ActionPay = async (record) => {
    await LAPPHIEUTHU(API.LAPPHIEUTHU, token, { SoChungTu: record?.SoChungTu }, dispatch)
    setDataLoaded(false)
    setIsShowDelete(false)
  }

  if (!dataLoaded) {
    return <LoadingPage />
  }
  // const onChange = (date, dateString) => {
  //   console.log(date, dateString)
  //   setDate(date)
  // }

  console.log(data.DataResults)
  const handleChangePhieuThu = async (record) => {
    setIsShowDelete(true)
    setDataRecord(record)
    setTypeModel('Pay')
  }
  const handleShowPrint = () => {
    setIsShowPrint(!isShowPrint)
  }
  return (
    <>
      <div>
        <div className="flex items-center gap-x-4 mb-6">
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

      <FloatButton.Group
        trigger="click"
        type="primary"
        shape="square"
        style={{
          right: 10,
          top: 60,
        }}
        icon={<SwitcherOutlined />}
      >
        <div className="flex justify-end gap-2 mb-3 absolute right-0 top-[70px] flex-col">
          <ActionButton
            icon={<PrinterOutlined />}
            color={'slate-50'}
            title={'Lập Phiếu In'}
            background={'blue-500'}
            bg_hover={'white'}
            color_hover={'blue-500'}
            handleAction={handleShowPrint}
          />
          <ActionButton
            color={'slate-50'}
            title={'Thêm Phiếu Bán Hàng'}
            background={'blue-500'}
            icon={<FileAddOutlined />}
            bg_hover={'white'}
            color_hover={'blue-500'}
            handleAction={handleCreate}
          />
          <ActionButton
            color={'slate-50'}
            title={'Title button'}
            background={'blue-500'}
            icon={<HeartOutlined />}
            bg_hover={'white'}
            color_hover={'blue-500'}
            // handleAction={handleCreate}
          />
          <ActionButton
            color={'slate-50'}
            title={'Title button'}
            background={'blue-500'}
            icon={<FormOutlined />}
            bg_hover={'white'}
            color_hover={'blue-500'}
            // handleAction={handleCreate}
          />
        </div>
      </FloatButton.Group>
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
      <Model isShow={isShowDelete} handleClose={handleClose} record={dataRecord} ActionDelete={ActionDelete} typeModel={typeModel} ActionPay={ActionPay} />
      <ModelPrint isShowModel={isShowPrint} handleCloseAction={handleCloseAction} />
    </>
  )
}

export default PhieuBanHang
