/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router-dom'
import ActionButton from '../components/util/Button/ActionButton'
import icons from '../untils/icons'
const { CgCloseO } = icons
const PermissionView = ({ close }) => {
  const navigate = useNavigate()

  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
      <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
        <div className="flex flex-col gap-2 p-2 justify-between ">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <p className="text-blue-700 font-semibold uppercase">Kiểm tra quyền hạn người dùng</p>
              </div>
            </div>
            <div className="flex gap-2 border-2 p-3 items-center">
              <div>
                <CgCloseO className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="whitespace-nowrap">Bạn không có quyền thực hiện chức năng này!</p>
                <p className="whitespace-nowrap">
                  Vui lòng liên hệ <span className="font-bold">Người Quản Trị</span> để được cấp quyền
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <ActionButton
                handleAction={() => {
                  close()
                  navigate(-1)
                }}
                title={'Đóng'}
                isModal={true}
                color={'slate-50'}
                background={'red-500'}
                color_hover={'red-500'}
                bg_hover={'white'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionView
