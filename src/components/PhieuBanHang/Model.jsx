import { Tooltip } from 'antd'
// import logo from '../../../../../assets/VTS-iSale.ico'
import logo from '../../assets/VTS-iSale.ico'
import ActionButton from '../util/Button/ActionButton'
/* eslint-disable react/prop-types */
function Model({ isShow, handleClose, record, ActionDelete, typeModel, ActionPay }) {
  return (
    <>
      {isShow ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
          <div className="px-3 py-[12px] absolute shadow-lg bg-white rounded-md flex flex-col  max-w-[700px]">
            <div className="flex flex-col  gap-2">
              <div className="flex gap-2">
                <img src={logo} alt="Công Ty Viettas" className="w-[25px] h-[20px]" />
                <p className="text-blue-700 font-semibold uppercase"> {typeModel === 'Delete' ? 'Xóa dữ liệu' : 'Lập phiếu thu tiền'}</p>
              </div>
              <div className="flex flex-col gap-2 border-1 border-gray-400 p-4 text-lg">
                <div className="flex gap-1">
                  <p className="text-blue-700 whitespace-nowrap"> {typeModel === 'Delete' ? ' Bạn có chắc muốn xóa phiếu' : 'Bạn có muốn lập phiếu thu tiền'}</p>
                  <Tooltip title={record.SoChungTu} color="blue">
                    <p className="text-red-600 truncate">{record.SoChungTu}</p>
                  </Tooltip>
                  <p className="text-blue-700 whitespace-nowrap">không ?</p>
                </div>
                <p className="text-base">Thao tác không thể hoàn tác !</p>
              </div>

              <div className="flex gap-2 justify-end mt-1">
                <ActionButton
                  handleAction={() => (typeModel === 'Delete' ? ActionDelete(record) : typeModel === 'Pay' ? ActionPay(record) : null)}
                  title={'Xác nhận'}
                  isModal={true}
                  color={'slate-50'}
                  background={'blue-500'}
                  color_hover={'blue-500'}
                  bg_hover={'white'}
                />
                <ActionButton handleAction={handleClose} title={'Đóng'} isModal={true} color={'slate-50'} background={'red-500'} color_hover={'red-500'} bg_hover={'white'} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Model
