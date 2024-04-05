/* eslint-disable react/prop-types */

import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import { toast } from 'react-toastify'
import ActionButton from '../../../components/util/Button/ActionButton'

const DeleteThietLap = ({ typePage, dataRecord, close, loading }) => {
  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GBL':
          response = await apis.XoaGBL(tokenLogin, dataRecord.MaHang, dataRecord.HieuLucTu)
          break
        case 'GKH':
          response = await apis.XoaGKH(tokenLogin, dataRecord.MaDoiTuong, dataRecord.HieuLucTu)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(DataErrorDescription)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
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
        Bạn có chắc muốn xóa
        <span className="font-bold mx-1"> {typePage === 'GBL' ? dataRecord.MaHang : dataRecord.MaDoiTuong}</span>
        không ?
      </label>
      <div className="flex justify-end mt-4 gap-2">
        <ActionButton
          color={'slate-50'}
          title={'Xác nhận'}
          isModal={true}
          background={'bg-main'}
          bg_hover={'white'}
          color_hover={'bg-main'}
          handleAction={() => handleDelete(dataRecord)}
        />

        <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
      </div>
    </div>
  )
}

export default DeleteThietLap
