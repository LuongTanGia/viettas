import Tables from '../util/Table/Table'
import { nameColumsHangHoa } from '../util/Table/ColumnName'
import ActionButton from '../util/Button/ActionButton'

// eslint-disable-next-line react/prop-types
function ListHelper_HangHoa({ data, close, handleAddData }) {
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
          {/* table */}
          <div className="max-w-[98%]  max-h-[90%] mx-auto bg-white  rounded-md my-3 overflow-y-auto text-sm">
            <Tables param={data} columName={nameColumsHangHoa} height={'h400'} typeTable={'listHelper'} handleAddData={handleAddData} />
          </div>
        </div>
        <ActionButton color={'slate-50'} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} title={'Đóng'} handleAction={close} />
      </div>
    </div>
  )
}

export default ListHelper_HangHoa
