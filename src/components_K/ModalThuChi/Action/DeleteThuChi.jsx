/* eslint-disable react/prop-types */
import logo from '../../../assets/VTS-iSale.ico'
import ActionButton from '../../../components/util/Button/ActionButton'
import * as apis from '../../../apis'
import { toast } from 'react-toastify'
import { RETOKEN } from '../../../action/Actions'

const DeleteThuChi = ({ typePage, dataRecord, loading, close }) => {
  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'PCT':
          response = await apis.XoaPCT(tokenLogin, dataRecord.SoChungTu)
          break
        case 'PTT':
          response = await apis.XoaPTT(tokenLogin, dataRecord.SoChungTu)
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
    <div className="px-3 py-[12px] absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className="flex flex-col  gap-2">
        <div className="flex gap-2">
          <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
          <p className="text-blue-700 font-semibold uppercase">Xóa dữ liệu</p>
        </div>
        <div className="flex flex-col gap-2 border-2 p-4  text-lg">
          <div className="flex gap-1">
            <p className="text-blue-700 ">Bạn có chắc muốn xóa </p>
            <p className="text-red-600">{dataRecord?.SoChungTu}</p>
            <p className="text-blue-700 ">không ?</p>
          </div>
          <p className=" text-base ">Thao tác không thể hoàn tác !</p>
        </div>

        <div className="flex gap-2 justify-end mt-1">
          <ActionButton
            handleAction={() => handleDelete(dataRecord)}
            title={'Xác nhận'}
            isModal={true}
            color={'slate-50'}
            background={'blue-500'}
            color_hover={'blue-500'}
            bg_hover={'white'}
          />
          <ActionButton handleAction={close} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
        </div>
      </div>
    </div>
  )
}

export default DeleteThuChi
