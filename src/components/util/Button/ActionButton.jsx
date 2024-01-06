/* eslint-disable react/prop-types */
function ActionButton({ handleAction, title, icon, color, background, color_hover, bg_hover }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={handleAction}
        className={`flex justify-center items-center border-2 border-${background} text-${color} hover:text-${color_hover} text-base font-medium bg-${background} hover:bg-${bg_hover} rounded-md px-2 py-0 flex items-center gap-1 whitespace-nowrap max-h-10`}
      >
        <i className="text-sm">{icon}</i>
        {title}
      </button>
    </div>
  )
}

export default ActionButton
