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
import * as XLSX from 'xlsx'

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

            const isDateTime = dayjs(stringValue).isValid()

            if (isDateTime) {
              const formattedValue = dayjs(stringValue).format('DD/MM/YYYY').toString()

              const formattedSearchText = searchTextLower

              if (formattedValue.includes(formattedSearchText)) {
                return true
              }
            } else return false
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
          const stringValue = String(record[key]).toString().toLowerCase()
          const searchTextLower = searchText.toString().toLowerCase()
          const isDate = dayjs(searchTextLower, { strict: true }).isValid()
          const isDateTime = dayjs(stringValue).isValid()

          if (isDate && isDateTime) {
            const formattedValue = dayjs(stringValue).format('YYYY-MM-DDTHH:mm:ss')
            const formattedSearchText = dayjs(searchTextLower, { strict: true }).format('YYYY-MM-DDTHH:mm:ss')

            if (formattedValue.startsWith(formattedSearchText)) {
              return true
            }
          } else if (!isDate && stringValue.includes(searchTextLower)) {
            return true
          }

          return false
        })
      })

      setData(newData)
    }

    setDataLoaded(true)
    setLoadingSearch(false)
  }
  // const exportToExcel = () => {
  //   const ws = XLSX.utils.table_to_sheet(document.getElementById('my-table'))
  //   const wb = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  //   XLSX.writeFile(wb, 'du_lieu.xlsx')
  // }
  const exportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('my-table'))
    const wb = XLSX.utils.book_new()

    // Add company information to the worksheet starting from cell A1
    const companyInfo = [['Tên Công Ty: ABC Corporation'], ['Địa Chỉ: 123 Main Street'], ['Ngày: 2024-01-01']]
    XLSX.utils.sheet_add_aoa(ws, companyInfo, { origin: 'A1' })

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // Add additional data starting from row 11 (excluding the first 10 rows)
    const additionalData = [
      ['John Doe', '30', 'Engineer'],
      ['Jane Doe', '25', 'Designer'],
      // Add more data as needed
    ]
    XLSX.utils.sheet_add_aoa(ws, additionalData, { origin: 'A11' })

    // Save the workbook to a file
    XLSX.writeFile(wb, 'du_lieu.xlsx')
  }

  return (
    <>
      <div>
        <div className="relative flex items-center gap-x-4 ">
          <h1 className="text-xl font-black uppercase">Phiếu Bán Hàng </h1>
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
              // icon={<PrinterOutlined />}
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
            // icon={<PrinterOutlined />}
            color={'slate-50'}
            title={'Xuất Excel'}
            background={'blue-500'}
            bg_hover={'white'}
            color_hover={'blue-500'}
            handleAction={exportToExcel}
          />
          <ActionButton
            icon={<PrinterOutlined />}
            color={'slate-50'}
            title={'In Phiếu'}
            background={'blue-500'}
            bg_hover={'white'}
            color_hover={'blue-500'}
            handleAction={handleShowPrint}
          />
          <ActionButton
            color={'slate-50'}
            title={'Thêm Phiếu'}
            background={'blue-500'}
            icon={<FileAddOutlined />}
            bg_hover={'white'}
            color_hover={'blue-500'}
            handleAction={handleCreate}
          />
        </div>
      </div>

      <div id="my-table">
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
          textSearch={searchText}
        />
      </div>
      <ActionModals isShow={isShow} handleClose={handleClose} dataRecord={dataRecord} typeAction={type} setMaHang={setMaHang} />
      <Model isShow={isShowDelete} handleClose={handleClose} record={dataRecord} ActionDelete={ActionDelete} typeModel={typeModel} ActionPay={ActionPay} />
      <ModelPrint isShowModel={isShowPrint} handleCloseAction={handleCloseAction} />
    </>
  )
}

export default PhieuBanHang
