/* eslint-disable react/prop-types */
import * as apis from '../../../apis'
import { toast } from 'react-toastify'
import ActionButton from '../../../components/util/Button/ActionButton'
import { RETOKEN } from '../../../action/Actions'

const DeleteListThietLap = ({ formDEL, loading, close }) => {
  const handleDeleteDS = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      const response = await apis.XoaDSGKH(tokenLogin, formDEL)
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDeleteDS()
        } else {
          toast.error(DataErrorDescription)
        }
      }
      close()
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  return (
    <div className=" items-center ">
      <label>
        Bạn có chắc muốn xóa tổng cộng
        <span className="font-bold mx-1">{formDEL.DanhSachMaHieuLuc.length}</span>
        dòng dữ liệu không ?
      </label>
      <div className="flex justify-end mt-4 gap-2">
        <ActionButton color={'slate-50'} title={'Xác nhận'} isModal={true} background={'bg-main'} bg_hover={'white'} color_hover={'bg-main'} handleAction={handleDeleteDS} />

        <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
      </div>
    </div>
  )
}

export default DeleteListThietLap
