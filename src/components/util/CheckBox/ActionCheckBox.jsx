/* eslint-disable react/prop-types */
import { Checkbox } from 'antd'

function ActionCheckBox({ id, label, checked, onChange, value, disabled }) {
  return (
    <div className="flex gap-2">
      <Checkbox id={id} checked={checked} onChange={(e) => onChange(e, value)} disabled={disabled}></Checkbox>
      <label htmlFor={id} className={`w-full truncate  disable1 ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}`}>
        {label}
      </label>
    </div>
  )
}

export default ActionCheckBox
