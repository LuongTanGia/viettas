/* eslint-disable react/prop-types */
const HighlightedCell = ({ text, search }) => {
  const searchLower = typeof search === 'string' ? search.toLowerCase() : ''
  if (!searchLower || !text?.toLowerCase().includes(searchLower)) {
    return <span>{text}</span>
  }
  const parts = text.split(new RegExp(`(${searchLower})`, 'gi'))
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === searchLower ? (
          <span key={index} style={{ backgroundColor: 'yellow' }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  )
}

export default HighlightedCell
