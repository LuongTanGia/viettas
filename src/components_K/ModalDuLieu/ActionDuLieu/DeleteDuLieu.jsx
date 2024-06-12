/* eslint-disable react/prop-types */
import * as apis from '../../../apis'
import { toast } from 'react-toastify'
import ActionButton from '../../../components/util/Button/ActionButton'
import { RETOKEN } from '../../../action/Actions'
import logo from '../../../assets/VTS-iSale.ico'
import { Tooltip } from 'antd'
const DeleteDuLieu = ({ actionType, typePage, dataRecord, setHightLight, loading, close }) => {
  const handleDelete = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'PMH':
          response = await apis.XoaPMH(tokenLogin, dataRecord.SoChungTu)
          break
        case 'NTR':
          response = await apis.XoaNTR(tokenLogin, dataRecord.SoChungTu)
          break
        case 'XTR':
          response = await apis.XoaXTR(tokenLogin, dataRecord.SoChungTu)
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
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
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
  const handlePay = async (dataRecord) => {
    try {
      const tokenLogin = localStorage.getItem('TKN')

      let response
      switch (typePage) {
        case 'PMH':
          response = await apis.LapPhieuChi(tokenLogin, dataRecord.SoChungTu)
          break
        case 'NTR':
          response = await apis.LapPhieuChiNTR(tokenLogin, dataRecord.SoChungTu)
          break
        case 'XTR':
          response = await apis.LapPhieuThuXTR(tokenLogin, dataRecord.SoChungTu)
          break
        default:
          break
      }
      if (response) {
        const { DataError, DataErrorDescription } = response.data
        if (DataError === 0) {
          toast.success(DataErrorDescription)
          loading()
          setHightLight(dataRecord.SoChungTu)
          close()
        } else if (DataError === -1 || DataError === -2 || DataError === -3) {
          toast.warning(<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{DataErrorDescription}</div>)
        } else if (DataError === -107 || DataError === -108) {
          await RETOKEN()
          handleDelete()
        } else {
          toast.error(DataErrorDescription)
        }
      }
    } catch (error) {
      console.error('Error while saving data:', error)
    }
  }

  return (
    <div className="px-3 py-[12px] absolute shadow-lg bg-white rounded-md flex flex-col  max-w-[700px]">
      <div className="flex flex-col  gap-2">
        <div className="flex gap-2">
          <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
          <p className="text-blue-700 font-semibold uppercase">{`${actionType === 'delete' ? 'Xóa dữ liệu' : typePage === 'XTR' ? 'Lập phiếu thu' : 'Lập phiếu chi'}`}</p>
        </div>
        <div className="flex flex-col gap-2 border-1 border-gray-400 p-4  text-lg">
          <div className="flex gap-1">
            <p className="text-blue-700 ">Bạn có chắc muốn {`${actionType === 'delete' ? 'xóa' : typePage === 'XTR' ? 'lập phiếu thu' : 'lập phiếu chi'}`} </p>
            <Tooltip title={dataRecord?.SoChungTu} color="blue">
              <p className="text-red-600 truncate">{dataRecord?.SoChungTu}</p>
            </Tooltip>

            <p className="text-blue-700 ">không ?</p>
          </div>
          <p className=" text-base ">Thao tác không thể hoàn tác !</p>
        </div>

        <div className="flex gap-2 justify-end mt-1">
          <ActionButton
            handleAction={actionType === 'delete' ? () => handleDelete(dataRecord) : () => handlePay(dataRecord)}
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

export default DeleteDuLieu
