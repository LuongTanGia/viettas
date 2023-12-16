import './index.css'
import './App.css'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'
import Test from './components/util/testComponents/Test'
import { useState } from 'react'

function App() {
  const token = localStorage.getItem('TKN')
  const tokenRF = localStorage.getItem('RTKN')

  const KhoanNgay = useSelector(khoanNgaySelect)

  const dispatch = useDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (token === null) {
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
      const loadData = async () => {
        await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch)
        await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch)
        await KHOANNGAY(API.KHOANNGAY, token, dispatch)
        await DATATONGHOP(API.TONGHOP, token, KhoanNgay, dispatch)
        await DATADULIEU(API.PHIEUMUAHANG, token, dispatch)

        setDataLoaded(true)
      }

      loadData()
    }
  }, [token, dispatch, tokenRF])

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const isLogged = localStorage.getItem('firstLogin')

  // if (!dataLoaded) {
  //     return <LoadingPage />;
  // }

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
        style={{
          width: 'fit-content',
          maxWidth: '30rem',
          whiteSpace: 'nowrap',
        }}
      />
    </Router>
  )
}

export default App
