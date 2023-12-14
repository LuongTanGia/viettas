import icons from '../../untils/icons'
import Tables from '../util/Table/Table'
import { DANHSACHHANGHOA_PBS } from '../../action/Actions'
import API from '../../API/API'
import { useEffect, useState } from 'react'
import { nameColumsHangHoa } from '../util/Table/ColumnName'
const { IoMdClose } = icons

// eslint-disable-next-line react/prop-types
function ListHelper_HangHoa({ data, isShowList, close, handleAddData }) {
  const token = window.localStorage.getItem('TKN')

  const [listHangHoa, setListHangHoa] = useState([])
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await DANHSACHHANGHOA_PBS(API.DANHSACHHANGHOA_PBS, token, data)
        setListHangHoa(result)
        setIsLoad(true)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    loadData()
  }, [isShowList, token])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="  m-6  p-4 absolute shadow-lg bg-white rounded-md flex flex-col ">
        <div className=" w-[90vw] h-[600px] ">
          <div className="flex justify-between items-start pb-1">
            <label className="font-bold ">Danh sách hàng hóa</label>
            <button onClick={() => close()} className="text-gray-500 p-1 border hover:border-gray-300 hover:bg-red-600 hover:text-white rounded-full">
              <IoMdClose />
            </button>
          </div>
          {/* table */}
          <div className="max-w-[98%]  max-h-[90%] mx-auto bg-white  rounded-md my-3 overflow-y-auto text-sm">
            {isLoad && <Tables param={listHangHoa} columName={nameColumsHangHoa} height={'h400'} typeTable={'listHelper'} handleAddData={handleAddData} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListHelper_HangHoa
