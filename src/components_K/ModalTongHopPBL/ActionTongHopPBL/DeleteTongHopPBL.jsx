/* eslint-disable react/prop-types */
import dayjs from 'dayjs'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import icons from '../../../untils/icons'

const { GoQuestion } = icons

const DeleteTongHopPBL = ({ typePage, dataRecord, loading, close }) => {
  const formDEL = {
    NgayCTu: dataRecord ? dataRecord.NgayCTu : '',
    Quay: dataRecord ? dataRecord.Quay : 0,
    Ca: dataRecord ? dataRecord.Ca : '',
    NhanVien: dataRecord ? dataRecord.NguoiTao : '',
  }

  const handleDelete = async () => {
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let response
      switch (typePage) {
        case 'GoChotCa':
          response = await apis.GoChotCa(tokenLogin, formDEL)
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

  return (
    <div className=" h-[268px] items-center  ">
      <label className="text-blue-700 font-semibold uppercase pb-1">Kiểm tra dữ liệu</label>
      <div className="flex items-center  border p-3 gap-3">
        <div className="text-bg-main">
          <GoQuestion size={40}></GoQuestion>
        </div>
        <div className="flex flex-col gap-1 ">
          <label>Bạn đang gỡ dữ liệu của :</label>
          <div className="px-4 ">
            Ngày : <span>{dayjs(dataRecord.NgayCTu).format('DD/MM/YYYY')}</span>
          </div>
          <div className="px-4">
            Quầy : <span>{dataRecord.Quay}</span>
          </div>
          <div className="px-4">
            Ca : <span>{dataRecord.Ca}</span>
          </div>
          <div className="px-4">
            Nhân viên : <span>{dataRecord.NguoiTao}</span>
          </div>
          <div>Bạn có chắc chắn muốn gỡ dữ liệu này không?</div>
        </div>
      </div>
      <div className="flex justify-end mt-2 gap-2">
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

export default DeleteTongHopPBL
