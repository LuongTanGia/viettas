import Tables from '../util/Table/Table'
import { nameColumsHangHoa } from '../util/Table/ColumnName'
import ActionButton from '../util/Button/ActionButton'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DANHSACHHANGHOA_PBS } from '../../action/Actions'
import API from '../../API/API'
// eslint-disable-next-line react/prop-types
function ListHelper_HangHoa({ data, close, handleAddData, form }) {
  const token = localStorage.getItem('TKN')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)

  const [dataList, setData] = useState(data)

  const [dataDate] = useState({
    NgayBatDau: '',
    NgayKetThuc: '',
  })

  const isMatch = (value, searchText) => {
    const stringValue = String(value).toLowerCase()
    const searchTextLower = searchText.toLowerCase()

    // Check if the string includes the searchText
    if (stringValue.includes(searchTextLower)) {
      return true
    }

    // Check if it's a valid date and matches (formatted or not)
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
  }, [token, searchText, dataDate])
  if (!dataLoaded) {
    return <></>
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px] ">
          <div className="flex justify-between items-start pb-1">
            <label className="font-bold ">Danh sách hàng hóa</label>
            {/* <button onClick={() => close()} className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full">
              <IoMdClose />
            </button> */}
          </div>
          <input
            type="text"
            placeholder="Nhập ký tự bạn cần tìm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={'px-2  w-[20rem] border-slate-200  resize-none rounded-[0.5rem] border-[0.125rem] border-[#0006] outline-none text-[1rem] '}
          />
          {/* table */}
          <div className="max-w-[98%]  max-h-[90%] mx-auto bg-white  rounded-md my-3 overflow-y-auto text-sm">
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
        </div>
        <ActionButton color={'slate-50'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} title={'Đóng'} handleAction={close} />
      </div>
    </div>
  )
}

export default ListHelper_HangHoa
