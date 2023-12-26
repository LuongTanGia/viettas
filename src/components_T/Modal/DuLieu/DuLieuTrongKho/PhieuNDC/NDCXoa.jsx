/* eslint-disable react/prop-types */
import categoryAPI from '../../../../../API/linkAPI'
import { toast } from 'react-toastify'
import logo from '../../../../../assets/VTS-iSale.ico'

const NCKXoa = ({ close, dataNDC }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const handleDelete = async () => {
    try {
      const response = await categoryAPI.NDCDelete(dataNDC?.SoChungTu, TokenAccess)
      if (response.data.DataError == 0) {
        toast.success(response.data.DataErrorDescription)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
      <div onClick={close} className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded shadow-custom overflow-hidden">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex gap-2">
            <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
            <p className="text-blue-700 font-semibold uppercase">Xóa dữ liệu - Phiếu Nhập Điều Chỉnh</p>
          </div>
          <div className="flex flex-col gap-2 border-2 p-3 font-bold text-lg">
            <div className="flex gap-1">
              <p className="text-blue-700 uppercase">Bạn có chắc muốn xóa</p>
              <p className="text-red-600">{dataNDC?.SoChungTu}</p>
              <p className="text-blue-700 uppercase">?</p>
            </div>
            <p className="text-slate-500 text-lg font-light">Thông tin sản phẩm không thể hoàn tác nếu bạn xóa !</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              className="rounded px-2 py-1.5 font-bold text-slate-50 bg-red-500 border-2 hover:bg-white border-red-500 hover:text-red-500 hover:bg-white-400 w-[100px]"
              onClick={close}
            >
              Đóng
            </button>
            <button className="px-2 p-1.5 text-slate-50 bg-blue-600 border-2 border-blue-600 hover:bg-white hover:text-blue-600 font-bold rounded w-[100px]" onClick={handleDelete}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NCKXoa
