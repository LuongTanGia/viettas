/* eslint-disable react/prop-types */
import { toast } from 'react-toastify'
import categoryAPI from '../../../../../API/linkAPI'
import logo from '../../../../../assets/VTS-iSale.ico'
import ActionButton from '../../../../util/Button/ActionButton'
import { Tooltip } from 'antd'

const XDCDel = ({ close, dataXDC, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const handleDelete = async () => {
    try {
      const response = await categoryAPI.XDCDelete(dataXDC?.SoChungTu, TokenAccess)
      if (response.data.DataError == 0) {
        loadingData()
        close()
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setTargetRow()
      } else {
        toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  return (
    <div className=" fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
      <div className="px-3 py-[12px] absolute shadow-lg bg-white rounded-md flex flex-col  max-w-[700px]">
        <div className="flex flex-col  gap-2">
          <div className="flex gap-2">
            <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
            <p className="text-blue-700 font-semibold uppercase">Xóa dữ liệu</p>
          </div>
          <div className="flex flex-col gap-2 border-1 border-gray-400 p-4 text-lg">
            <div className="flex gap-1">
              <p className="text-blue-700 whitespace-nowrap">Bạn có chắc muốn xóa </p>
              <Tooltip title={dataXDC?.SoChungTu} color="blue">
                <p className="text-red-600 truncate">{dataXDC?.SoChungTu}</p>
              </Tooltip>
              <p className="text-blue-700 whitespace-nowrap">không ?</p>
            </div>
            <p className=" text-base ">Thao tác không thể hoàn tác !</p>
          </div>

          <div className="flex gap-2 justify-end mt-1">
            <ActionButton handleAction={handleDelete} title={'Xác nhận'} isModal={true} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
            <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default XDCDel
