/* eslint-disable react/prop-types */
import { useMediaQuery } from '@mui/material'
import { Checkbox, Tooltip } from 'antd'

function ActionCheckBox({ id, label, checked, onChange, value, disabled }) {
  // const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')

  return (
    <div className="flex gap-2">
      <Checkbox id={id} checked={checked} onChange={(e) => onChange(e, value)} disabled={disabled}></Checkbox>
      <Tooltip placement="top" title={isTablet ? label : ''} color="blue">
        <label htmlFor={id} className={`w-full truncate   disable1 ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}`}>
          {label}
        </label>
      </Tooltip>
    </div>
  )
}

export default ActionCheckBox
