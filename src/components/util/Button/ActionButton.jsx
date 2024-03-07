import { Spin } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'

/* eslint-disable react/prop-types */
function ActionButton({ handleAction, title, icon, color, background, color_hover, bg_hover, isPermission, isModal }) {
  const [loading, setLoading] = useState(false)
  const handleActionLoad = () => {
    isPermission == true || isPermission == null ? setLoading(true) : setLoading(false)
    handleAction()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  return (
    <div className="flex justify-end" onDoubleClick={() => toast.info('Bạn đang bấm quá nhanh !!')}>
      <Spin spinning={loading}>
        <button
          disabled={loading}
          onClick={handleActionLoad}
          className={` flex justify-center items-center ${
            isModal ? '' : 'min-w-[8rem]'
          }  border-2 shadow hover:text-${color_hover} border-${background} text-${color} text-base font-medium bg-${background} hover:bg-${bg_hover} rounded-md px-2 py-1 flex items-center gap-1 whitespace-nowrap max-h-10 
        `}
        >
          <i className="text-sm">{icon}</i>
          {title}
        </button>
      </Spin>
    </div>
  )
}

export default ActionButton
