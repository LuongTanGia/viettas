/* eslint-disable react/prop-types */
function ActionButton({ handleAction, title, icon, color, background, color_hover, bg_hover }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={handleAction}
        className={`border-2 border-${background} text-${color} hover:text-${color_hover} text-base font-medium bg-${background} hover:bg-${bg_hover} rounded-md px-2 py-1 flex items-center gap-1 whitespace-nowrap`}
      >
        <i className="text-sm">{icon}</i>
        {title}
      </button>
    </div>
  )
}

export default ActionButton
