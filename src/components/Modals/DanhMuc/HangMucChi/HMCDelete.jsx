/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import categoryAPI from '../../../../API/linkAPI'
import logo from '../../../../assets/VTS-iSale.ico'
import { toast } from 'react-toastify'
import ActionButton from '../../../util/Button/ActionButton'
const HMCDelete = ({ close, dataHMC, loadingData, setTargetRow }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const handleDelete = async () => {
    try {
      const response = await categoryAPI.XoaHangMucChi(dataHMC?.Ma, TokenAccess)
      if (response.data.DataError == 0) {
        loadingData()
        close()
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        setTargetRow([])
      } else {
        toast.error(response.data.DataErrorDescription, { autoClose: 1000 })
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi Server vui lòng thử lại', { autoClose: 1000 })
      close()
    }
  }
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
      <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex gap-2">
            <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
            <p className="text-blue-700 font-semibold uppercase">Xóa dữ liệu - Hạng Mục Thu Tiền</p>
          </div>
          <div className="flex flex-col gap-2 border-2 p-3 font-bold text-lg">
            <div className="flex gap-1">
              <p className="text-blue-700 uppercase">Bạn có chắc muốn xóa</p>
              <p className="text-red-600">{dataHMC?.Ma}</p>
              <p className="text-blue-700 uppercase">?</p>
            </div>
            <p className="text-slate-500 text-lg font-light">Thông tin sản phẩm không thể hoàn tác nếu bạn xóa !</p>
          </div>
          <div className="flex gap-2 justify-end">
            <ActionButton handleAction={handleDelete} title={'Xác nhận'} isModal={true} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
            <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HMCDelete
