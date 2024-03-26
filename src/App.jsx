import './index.css'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'
import Test from './components/util/testComponents/Test'
import { useState } from 'react'

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const handleToggleSidebar = () => {
    setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible)
  }

  const isLogged = localStorage.getItem('firstLogin')

  // useEffect(() => {
  //   let timeoutId

  //   const handleKeyDown = () => {
  //     console.log('abcssss')
  //     setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible)
  //   }

  //   if (!isSidebarVisible) {
  //     timeoutId = setTimeout(() => {
  //       document.addEventListener('click', handleKeyDown)
  //     }, 100)
  //   }

  //   return () => {
  //     clearTimeout(timeoutId)
  //     document.removeEventListener('click', handleKeyDown)
  //   }
  // }, [isSidebarVisible])

  return (
    <Router>
      <Routes>
        <Route path="*" element={isLogged === 'true' ? <Home handleToggleSidebar={handleToggleSidebar} isSidebarVisible={isSidebarVisible} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        style={{
          width: 'fit-content',
          maxWidth: '35rem',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      />
    </Router>
  )
}

export default App
