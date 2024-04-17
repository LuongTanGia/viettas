/* eslint-disable react/prop-types */
import icons from '../../../untils/icons'
import { MdEdit } from 'react-icons/md'
import { Tooltip } from 'antd'
const { MdDelete, GiReceiveMoney } = icons

// eslint-disable-next-line react/prop-types
function BtnAction({ handleEdit, handleDelete, record, handleChangePhieuThu, typeTable }) {
  return (
    <div>
      <>
        {typeTable === 'detail' ? (
          <div className=" flex gap-1 items-center justify-center ">
            <Tooltip title="Xóa" color="blue">
              <div
                onClick={() => handleDelete(record)}
                className="p-[3px]  border  border-red-500 rounded-md text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
              >
                <MdDelete size={16} />
              </div>
            </Tooltip>
          </div>
        ) : (
          <div className=" flex gap-1 items-center justify-center ">
            <Tooltip title="Lập phiếu thu" color="blue">
              <div
                // disabled="true"
                onClick={() => (record.PhieuThu ? null : handleChangePhieuThu(record))}
                className={`p-[3px] border rounded-md text-slate-50 ${
                  record.PhieuThu ? 'bg-gray-400 cursor-not-allowed' : 'border-blue-500 bg-blue-500 hover:bg-white hover:text-blue-500 cursor-pointer'
                }`}
                disabled={record.PhieuThu ? true : false}
              >
                <GiReceiveMoney size={16} />
              </div>
            </Tooltip>
            <Tooltip title="Sửa" color="blue">
              <div
                onClick={() => handleEdit(record)}
                className="p-[3px] border rounded-md text-slate-50 border-yellow-400 bg-yellow-400 hover:bg-white hover:text-yellow-400 cursor-pointer"
              >
                <MdEdit size={16} />
              </div>
            </Tooltip>
            <Tooltip title="Xóa" color="blue">
              <div
                onClick={() => handleDelete(record)}
                className="p-[3px]  border  border-red-500 rounded-md text-slate-50 bg-red-500  hover:bg-white hover:text-red-500  cursor-pointer "
              >
                <MdDelete size={16} />
              </div>
            </Tooltip>
          </div>
        )}
      </>
    </div>
  )
}

export default BtnAction
