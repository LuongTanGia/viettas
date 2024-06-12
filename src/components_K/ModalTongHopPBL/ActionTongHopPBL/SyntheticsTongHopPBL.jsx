/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Spin } from 'antd'
import * as apis from '../../../apis'
import { RETOKEN } from '../../../action/Actions'
import ActionButton from '../../../components/util/Button/ActionButton'
import { toast } from 'react-toastify'
import icons from '../../../untils/icons'

const { GoQuestion } = icons

const SyntheticsTongHopPBL = ({ formSynthetics, loading, close }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSynthetics = async () => {
    setIsLoading(true)
    try {
      const tokenLogin = localStorage.getItem('TKN')
      let allSuccess = true

      for (const obj of formSynthetics.DanhSach) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        let response
        response = await apis.TongHopPBL(tokenLogin, obj)
        if (response) {
          const { DataError } = response.data
          if (DataError === 0) {
            // console.log('thanh cong', allSuccess)
          } else if (DataError === -1 || DataError === -2 || DataError === -3) {
            allSuccess = false
          } else if (DataError === -107 || DataError === -108) {
            await RETOKEN()
            // handleSynthetics()
            allSuccess = false
          } else {
            allSuccess = false
          }
        }
      }

      setIsLoading(false)
      if (allSuccess === true) {
        toast.success('Xử lý dự liệu thành công')
        loading()
        close()
      } else {
        toast.error('Xử lý dự liệu thất bại')
      }
    } catch (error) {
      console.error('Error while saving data:', error)
      toast.error('Có lỗi xảy ra khi xử lý dữ liệu')
    }
  }

  return (
    <div className="px-4 pt-4 pb-2 absolute shadow-lg bg-white rounded-md flex flex-col ">
      <Spin spinning={isLoading} className="p-4">
        <div className="h-[186px]  items-center">
          <label className="text-blue-700 font-semibold uppercase pb-1">Kiểm tra dữ liệu</label>
          <div className="flex items-center border-1 border-gray-400 p-3 gap-3">
            <div className="text-bg-main">
              <GoQuestion size={40}></GoQuestion>
            </div>
            <div className="flex flex-col gap-1">
              <label>
                Bạn đang tổng hợp nhanh <span className="font-bold">{formSynthetics.DanhSach.length}</span> dòng dữ liệu bán lẻ theo quầy :
              </label>
              <div>Chỉ những dòng dữ liệu không bị khóa và chưa được xử lý mới có thể tập hợp được </div>
              <div>Bạn có chắc chắn không?</div>
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
              handleAction={() => handleSynthetics()}
              // handleAction={() => close()}
            />

            <ActionButton color={'slate-50'} title={'Đóng'} isModal={true} background={'red-500'} bg_hover={'white'} color_hover={'red-500'} handleAction={() => close()} />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default SyntheticsTongHopPBL
