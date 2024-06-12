/* eslint-disable react/prop-types */
import logo from '../../../assets/VTS-iSale.ico'
import dayjs from 'dayjs'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'

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

  // ;<div className="flex flex-col gap-1 ">
  //   <label>Bạn đang gỡ dữ liệu của :</label>
  //   <div className="px-4 ">
  //     Ngày : <span>{dayjs(dataRecord.NgayCTu).format('DD/MM/YYYY')}</span>
  //   </div>
  //   <div className="px-4">
  //     Quầy : <span>{dataRecord.Quay}</span>
  //   </div>
  //   <div className="px-4">
  //     Ca : <span>{dataRecord.Ca}</span>
  //   </div>
  //   <div className="px-4">
  //     Nhân viên : <span>{dataRecord.NguoiTao}</span>
  //   </div>
  //   <div>Bạn có chắc chắn muốn gỡ dữ liệu này không?</div>
  // </div>

  return (
    <div className="px-3 py-[12px] absolute shadow-lg bg-white rounded-md flex flex-col ">
      <div className="flex flex-col  gap-2">
        <div className="flex gap-2">
          <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
          <p className="text-blue-700 font-semibold uppercase">Gỡ dữ liệu</p>
        </div>
        <div className="flex flex-col gap-2 border-1 border-gray-400 p-4  text-lg">
          {/* <p className="text-blue-700 ">Bạn đang gỡ dữ liệu của : </p>

          <p className="text-red-600">{dataRecord?.SoChungTu}</p>
          <p className="text-blue-700 ">không ?</p>

          <p className=" text-base ">Thao tác không thể hoàn tác !</p> */}
          <div className="flex flex-col gap-1 ">
            <label className="text-blue-700 ">Bạn đang gỡ dữ liệu :</label>
            <div className="px-4 text-red-600">
              Ngày : <span>{dayjs(dataRecord.NgayCTu).format('DD/MM/YYYY')}</span>
            </div>
            <div className="px-4 text-red-600">
              Quầy : <span>{dataRecord.Quay}</span>
            </div>
            <div className="px-4 text-red-600">
              Ca : <span>{dataRecord.Ca}</span>
            </div>
            <div className="px-4 text-red-600">
              Nhân viên : <span>{dataRecord.NguoiTao}</span>
            </div>
            <div className=" text-base ">Bạn có chắc chắn muốn gỡ dữ liệu này không ?</div>
          </div>
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

export default DeleteTongHopPBL
