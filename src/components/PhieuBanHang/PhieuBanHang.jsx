import Table from '../util/Table/Table'
import LoadingPage from '../util/Loading/LoadingPage'
import { PrinterOutlined, FileAddOutlined } from '@ant-design/icons'
import { nameColumsPhieuBanHang } from '../util/Table/ColumnName'
import ActionModals from './ActionModals'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { THONGTINPHIEU, DANHSACHPHIEUBANHANG, XOAPHIEUBANHANG, LAPPHIEUTHU } from '../../action/Actions'
import API from '../../API/API'
import { toast } from 'react-toastify'
import ModelPrint from './PrintModel'
import ActionButton from '../util/Button/ActionButton'
import Model from './Model'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { BsSearch } from 'react-icons/bs'
import dayjs from 'dayjs'

function PhieuBanHang() {
  const dispatch = useDispatch()
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [data, setData] = useState()
  const [isShow, setIsShow] = useState(false)
  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isShowDelete, setIsShowDelete] = useState(false)
  const [typeModel, setTypeModel] = useState('')
  const [type, setType] = useState()
  const [dataRecord, setDataRecord] = useState([])
  const [selectMH, setSelectMH] = useState()

  const [dataDate, setDataDate] = useState({
    NgayBatDau: '',
    NgayKetThuc: '',
  })
  //selectMH
  useEffect(() => {
    const getListData = async () => {
      setLoadingSearch(true)
      const searchData = {
        ...dataDate,
        searchText: searchText.trim(),
      }
      const filteredDataRes = await DANHSACHPHIEUBANHANG(API.DANHSACHPBS, token, searchData, dispatch)
      if (filteredDataRes === -1) {
        setData([])
      } else {
        const newData = filteredDataRes.filter((record) => {
          return Object.keys(record).some((key) => {
            const stringValue = String(record[key]).toLowerCase()
            const searchTextLower = searchText.toLowerCase()
            const isDate = dayjs(stringValue).isValid()

            if (isDate && dayjs(searchTextLower).isValid()) {
              const formattedValue = dayjs(stringValue).format('DD/MM/YYYY')
              const formattedSearchText = dayjs(searchTextLower).format('DD/MM/YYYY')
              if (stringValue.includes(formattedSearchText)) {
                return true
              }
              return formattedValue.includes(formattedSearchText)
            }
            return stringValue.includes(searchTextLower)
          })
        })

        setData(newData)
      }

      setDataLoaded(true)
      setLoadingSearch(false)
    }

    getListData()
  }, [token, dispatch, searchText, dataDate, selectMH])

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
  }
  const setMaHang = (value) => {
    setSelectMH(value)
    console.log(value, 'valueMH')
  }
  const handleCloseAction = () => {
    setIsShowPrint(false)
    setDataRecord([])
  }

  const handleDelete = async (record) => {
    setIsShowDelete(true)
    setDataRecord(record)
    setTypeModel('Delete')
  }

  const ActionDelete = async (record) => {
    const response = await XOAPHIEUBANHANG(API.XOAPHIEUBANHANG, token, { SoChungTu: record?.SoChungTu }, dispatch)
    if (response !== 1) {
      setIsShowDelete(false)
      setIsShow(false)
      setDataRecord([])
    } else {
      toast.info(`${record?.SoChungTu} đã lập phiếu thu tiền!`)
    }
  }

  const ActionPay = async (record) => {
    await LAPPHIEUTHU(API.LAPPHIEUTHU, token, { SoChungTu: record?.SoChungTu }, dispatch)
    setIsShowDelete(false)
    setIsShow(false)
    setDataRecord([])
  }

  if (!dataLoaded) {
    return <LoadingPage />
  }

  const handleChangePhieuThu = async (record) => {
    setIsShowDelete(true)
    setDataRecord(record)

    setTypeModel('Pay')
  }

  const handleShowPrint = () => {
    setIsShowPrint(!isShowPrint)
  }
  const handleSearch = async () => {
    setLoadingSearch(true)
    const searchData = {
      ...dataDate,
      searchText: searchText.trim(),
    }

    const filteredDataRes = await DANHSACHPHIEUBANHANG(API.DANHSACHPBS, token, searchData, dispatch)
    if (filteredDataRes === -1) {
      setData([])
    } else {
      const newData = filteredDataRes.filter((record) => {
        return Object.keys(record).some((key) => {
          const stringValue = String(record[key]).toLowerCase()
          const searchTextLower = searchText.toLowerCase()
          const isDate = dayjs(stringValue).isValid()

          if (isDate && dayjs(searchTextLower).isValid()) {
            const formattedValue = dayjs(stringValue).format('DD/MM/YYYY')
            const formattedSearchText = dayjs(searchTextLower).format('DD/MM/YYYY')
            if (stringValue.includes(formattedSearchText)) {
              return true
            }
            return formattedValue.includes(formattedSearchText)
          }
          return stringValue.includes(searchTextLower)
        })
      })

      setData(newData)
    }

    setDataLoaded(true)
    setLoadingSearch(false)
  }

  return (
    <>
      <div>
        <div className="relative flex items-center gap-x-4 ">
          <h1 className="text-xl font-black uppercase">Phiếu Bán Hàng</h1>
          <div>
            <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
          </div>
          <div className="flex  ">
            {isShowSearch && (
              <div className={`flex absolute left-[14rem] top-0 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                <input
                  type="text"
                  placeholder="Nhập ký tự bạn cần tìm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={'px-2  w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mb-1 justify-between max-h-[100px]">
        <div className="flex gap-3 max-h-[100px]">
          <div className="flex gap-x-2 items-center max-h-[100px]">
            <label htmlFor="">Ngày</label>
            <DatePicker
              className="DatePicker_PMH max-h-[100px]"
              format="DD/MM/YYYY"
              defaultValue={dayjs(new Date())}
              onChange={(newDate) => {
                setDataDate({
                  ...dataDate,
                  NgayBatDau: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                })
              }}
            />
          </div>
          <div className="flex gap-x-2 items-center max-h-[100px]">
            <label htmlFor="">Đến</label>
            <DatePicker
              className="DatePicker_PMH max-h-[100px]"
              format="DD/MM/YYYY"
              defaultValue={dayjs(new Date())}
              onChange={(newDate) => {
                setDataDate({
                  ...dataDate,
                  NgayKetThuc: dayjs(newDate).format('YYYY-MM-DDTHH:mm:ss'),
                })
              }}
            />
          </div>
          <div className=" ">
            <ActionButton
              icon={<PrinterOutlined />}
              color={'slate-50'}
              title={'Lọc'}
              background={'blue-500'}
              bg_hover={'white'}
              color_hover={'blue-500'}
              handleAction={handleSearch}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2    ">
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
        </div>
      </div>

      <Table
        param={data}
        columName={nameColumsPhieuBanHang}
        handleView={handleView}
        handleEdit={handleEdit}
        height={'setHeight'}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        handleChangePhieuThu={handleChangePhieuThu}
        loadingSearch={loadingSearch}
        selectMH={selectMH}
      />
      <ActionModals isShow={isShow} handleClose={handleClose} dataRecord={dataRecord} typeAction={type} setMaHang={setMaHang} />
      <Model isShow={isShowDelete} handleClose={handleClose} record={dataRecord} ActionDelete={ActionDelete} typeModel={typeModel} ActionPay={ActionPay} />
      <ModelPrint isShowModel={isShowPrint} handleCloseAction={handleCloseAction} />
    </>
  )
}

export default PhieuBanHang
