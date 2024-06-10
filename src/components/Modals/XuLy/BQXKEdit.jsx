/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import logo from '../../../assets/VTS-iSale.ico'
import { toast } from 'react-toastify'
import ActionButton from '../../util/Button/ActionButton'
import categoryAPI from '../../../API/linkAPI'
import { useEffect } from 'react'
import moment from 'moment'

const BQXKEdit = ({ close, dataBQXK, loadingData, setTargetRow, setDataBinhQuan }) => {
  const TokenAccess = localStorage.getItem('TKN')

  useEffect(() => {
    setTargetRow([])
  }, [])

  const handleSetting = async () => {
    try {
      const response = await categoryAPI.TinhBinhQuanXuatKhoList(dataBQXK?.Thang, TokenAccess)
      if (response.data.DataError == 0) {
        setDataBinhQuan(response.data.DataResults)
        toast.success(response.data.DataErrorDescription, { autoClose: 1000 })
        loadingData()
        close()
        setTargetRow(dataBQXK?.Thang)
      } else {
        toast.warning(response.data.DataErrorDescription, { autoClose: 2000 })
        console.log(response.data)
        setDataBinhQuan([])
        loadingData()
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
            <p className="text-blue-700 font-semibold uppercase">Xử lý - Tính trị giá bình quân xuất kho</p>
          </div>
          <div className="flex flex-col gap-2 border-2 p-3">
            <p className="text-center text-sm">
              Trước khi thực hiện tính bình quân tháng, nhằm đảm bảo tính đúng đắng của dữ liệu, vui lòng
              <span className="text-red-500 font-medium"> tạm dừng cập nhật dữ liệu trong phạm vi kỳ tính giá lớn nhất trở về trước.</span>
            </p>
            <p className="text-blue-500 text-center text-sm">
              Trong quá trình xử lý giá bình quân tháng, vui lòng chở đến khi chương trình xử lý xong, không thoát ngang chương trình nằm tránh tình trạng hư hỏng dữ liệu.
            </p>
            <div className="flex justify-center gap-2">
              <div className="flex gap-2 items-center w-[25%]">
                <label className=" text-sm">Tháng</label>
                <input
                  type="text"
                  value={moment(dataBQXK?.Thang)?.format('MM/YYYY') || ''}
                  className="px-2 rounded w-full resize-none border outline-none text-sm truncate text-center"
                  readOnly
                />
              </div>
              <div className="flex gap-2 items-center w-[25%]">
                <label className=" text-sm">Đến</label>
                <input
                  type="text"
                  value={moment(dataBQXK?.Thang)?.format('MM/YYYY') || ''}
                  className="px-2 rounded w-full resize-none border outline-none text-sm truncate text-center"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <ActionButton handleAction={handleSetting} title={'Xử lý'} isModal={true} color={'slate-50'} background={'blue-500'} color_hover={'blue-500'} bg_hover={'white'} />
            <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BQXKEdit
