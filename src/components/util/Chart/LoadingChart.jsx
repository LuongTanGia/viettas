// eslint-disable-next-line react/prop-types
const HorizontalProgressBar = ({ percentage, color }) => {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{
          width: `${percentage}%`,
          color: '#fff',
          background: color,
        }}
      >
        {percentage}%
      </div>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
const RateBar = ({ percentage, color }) => {
  return <HorizontalProgressBar percentage={percentage} color={color} />
}

export default RateBar
