/* eslint-disable react/prop-types */
import SiderMenu from '../SiderMenu/SiderMenu'
import MainPage from '../MainPage/MainPage'
import Header from '../Header/Header'
import Cookies from 'js-cookie'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { DANHSACHCHUCNANG, CallBackAPI } from '../../action/Actions'
import API from '../../API/API'
import { useDispatch } from 'react-redux'
// import { khoanNgaySelect } from '../../redux/selector'
import LoadingPage from '../util/Loading/LoadingPage'

function Home({ handleToggleSidebar, isSidebarVisible }) {
  const user = Cookies.get('user')
  const dispatch = useDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isCookie, setIsCookie] = useState(user)
  const token = localStorage.getItem('TKN')
  // const KhoanNgay = useSelector(khoanNgaySelect)
  const sidebarRef = useRef(null)
  const [targetRow, setTargetRow] = useState()
  const [tableLoad, setTableLoad] = useState()
  const [isClosingSidebarFromHeader, setIsClosingSidebarFromHeader] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch)

      setDataLoaded(true)
    }
    const ThongSo = async () => {
      const ThongSo = await CallBackAPI(API.THONGSO, token)
      localStorage.setItem('ThongSo', JSON.stringify(ThongSo))
    }
    ThongSo()
    loadData()
  }, [])

  useEffect(() => {
    if (!isSidebarVisible) {
      const handleDocumentClick = (event) => {
        if (!isSidebarVisible && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          handleToggleSidebar()
        }
      }
      const handleHeaderCloseSidebar = () => {
        document.removeEventListener('click', handleDocumentClick)
      }
      if (isClosingSidebarFromHeader) {
        document.addEventListener('click', handleHeaderCloseSidebar)
      } else {
        document.removeEventListener('click', handleHeaderCloseSidebar)
      }
      document.addEventListener('click', handleDocumentClick)
      return () => {
        document.removeEventListener('click', handleHeaderCloseSidebar)
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [isSidebarVisible, handleToggleSidebar, sidebarRef, isClosingSidebarFromHeader])

  if (!dataLoaded) {
    return <LoadingPage />
  }

  return (
    <div>
      <Header
        handleToggleSidebar={() => {
          setIsClosingSidebarFromHeader(true)
          handleToggleSidebar()
        }}
      />
      <div className={isSidebarVisible ? 'toggle-sidebar' : 'mainSider'} ref={sidebarRef}>
        <SiderMenu
          handleToggleSidebar={() => {
            setIsClosingSidebarFromHeader(true)
            handleToggleSidebar()
          }}
          refs={sidebarRef}
          isTargetRow={setTargetRow}
          isTableLoad={setTableLoad}
          isSidebarVisible={isSidebarVisible}
        />
      </div>
      <MainPage isSidebarVisible={isSidebarVisible} isTargetRow={targetRow} isTableLoad={tableLoad} />
      <Footer />
      {isCookie === 'true' ? (
        <div className="card cook_tag">
          <span
            aria-hidden="true"
            className="btn_cooks"
            onClick={() => {
              Cookies.set('user', false)
              setIsCookie(false)
            }}
          >
            &times;
          </span>
          <div className="card-body">
            <p className="card-text">
              Chúng tôi đang sử dụng cookie để cung cấp cho bạn những trải nghiệm tốt nhất trên trang web này. Bằng cách tiếp tục truy cập, bạn đồng ý với{' '}
              <Link to="/FAQ">Chính sách thu thập và sử dụng cookie của chúng tôi.</Link>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Home
