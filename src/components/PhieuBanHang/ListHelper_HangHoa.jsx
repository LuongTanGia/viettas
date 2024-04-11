import Tables from '../util/Table/Table'
import Logo from '../../assets/VTS-iSale.ico'

import { nameColumsHangHoa } from '../util/Table/ColumnName'
import ActionButton from '../util/Button/ActionButton'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DANHSACHHANGHOA_PBS } from '../../action/Actions'
import API from '../../API/API'
import { BsSearch } from 'react-icons/bs'
import { Input } from 'antd'
// eslint-disable-next-line react/prop-types
function ListHelper_HangHoa({ data, close, handleAddData, form }) {
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [dataList, setData] = useState(data)

  const [dataDate] = useState({
    NgayBatDau: '',
    NgayKetThuc: '',
  })

  const isMatch = (value, searchText) => {
    const stringValue = String(value).toLowerCase()
    const searchTextLower = searchText.toLowerCase()

    if (stringValue.includes(searchTextLower)) {
      return true
    }

    const isDateTime = dayjs(stringValue).isValid()
    if (isDateTime) {
      const formattedValue = dayjs(stringValue).format('DD/MM/YYYY').toString()
      const formattedSearchText = searchTextLower
      if (formattedValue.includes(formattedSearchText)) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    const getListData = async () => {
      setLoadingSearch(true)
      const searchData = {
        ...dataDate,
        ...form,
        searchText: searchText.trim(),
      }
      const filteredDataRes = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, searchData)
      if (filteredDataRes === -1) {
        setData([])
      } else {
        const newData = filteredDataRes?.filter((record) => {
          return Object.keys(record).some((key) => isMatch(record[key], searchText))
        })
        setData(newData)
      }
      setDataLoaded(true)
      setLoadingSearch(false)
    }
    getListData()
  }, [searchText])

  if (!dataLoaded) {
    return <></>
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="px-4 pt-4 pm-0 shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[590px] ">
          <div className="flex justify-between items-start">
            <div className="flex justify-between items-center gap-2 pb-3">
              <img src={Logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
              <label className="text-blue-700 uppercase font-semibold py-1 ">Danh sách hàng hóa</label>
              <BsSearch size={18} className="hover:text-red-400 cursor-pointer" onClick={() => setIsShowSearch(!isShowSearch)} />
              {isShowSearch && (
                <div className={`flex left-[14rem] top-0 transition-all linear duration-700 ${isShowSearch ? 'w-[20rem]' : 'w-0'} overflow-hidden`}>
                  {/* <input
                  type="text"
                  placeholder="Nhập ký tự bạn cần tìm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={'px-2  w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
                /> */}
                  <Input placeholder="Nhập ký tự bạn cần tìm" onPressEnter={(e) => setSearchText(e.target.value)} onBlur={(e) => setSearchText(e.target.value)} />
                </div>
              )}
            </div>
          </div>
          <div className=" mx-auto bg-white  rounded-md overflow-y-auto text-sm">
            <Tables
              param={dataList}
              columName={nameColumsHangHoa}
              height={'h400'}
              typeTable={'listHelper'}
              handleAddData={handleAddData}
              loadingSearch={loadingSearch}
              textSearch={searchText}
            />
          </div>
          <ActionButton color={'slate-50'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} title={'Đóng'} isModal={true} handleAction={close} />
        </div>
      </div>
    </div>
  )
}

export default ListHelper_HangHoa
