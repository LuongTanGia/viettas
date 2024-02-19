/* eslint-disable no-unused-vars */
import { useState } from 'react'

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e) => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX, y: e.clientY })
    }
  }

  return (
    <div style={{ width: '100px', height: '100px' }} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div
        style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          backgroundColor: 'red',
          left: position.x + '10px',
          top: position.y + '10px',
        }}
        onMouseDown={handleMouseDown}
      >
        aaaaa
      </div>
    </div>
  )
}

export default App
