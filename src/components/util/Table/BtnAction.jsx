import icons from '../../../untils/icons'
const { FaRegEdit, MdDelete } = icons

// eslint-disable-next-line react/prop-types
function BtnAction({ handleEdit, handleDelete, record }) {
  return (
    <div>
      <>
        <div className=" flex gap-1 items-center justify-center ">
          {/* <div
            onClick={() => handleView(record)}
            title="Xem"
            className="p-[3px] border border-yellow-500 rounded-md text-yellow-500 hover:text-white hover:bg-yellow-500 cursor-pointer"
          >
            <FaRegEye size={16} />
          </div> */}
          <div
            onClick={() => handleEdit(record)}
            title="Sửa"
            className="p-[3px] text-purple-500 border  border-purple-500 rounded-md hover:text-white hover:bg-purple-500 cursor-pointer  "
          >
            <FaRegEdit size={16} />
          </div>
          <div
            onClick={() => handleDelete(record)}
            title="Xóa"
            className="p-[3px] text-red-500 border  border-red-500 rounded-md hover:text-white hover:bg-red-500 cursor-pointer  "
          >
            <MdDelete size={16} />
          </div>
        </div>
      </>
    </div>
  )
}

export default BtnAction
