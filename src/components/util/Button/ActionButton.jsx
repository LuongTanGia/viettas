import { Tooltip } from 'antd'

/* eslint-disable react/prop-types */
function ActionButton({ handleAction, title, icon, color, background, color_hover, bg_hover }) {
  return (
    <div className="flex justify-end">
      <Tooltip title={title} color={'blue'} key={color} placement="leftTop">
        <button
          onClick={handleAction}
          className={`h-[40px] w-[40px] flex justify-center items-center border-2 border-${background} text-${color} hover:text-${color_hover} text-base font-medium bg-${background} hover:bg-${bg_hover} rounded-md px-2 py-1 flex items-center gap-1 whitespace-nowrap`}
        >
          <i className="text-sm">{icon}</i>
        </button>
      </Tooltip>
    </div>
  )
}

export default ActionButton
