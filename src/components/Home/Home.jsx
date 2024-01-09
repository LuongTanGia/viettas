/* eslint-disable react/prop-types */
import SiderMenu from '../SiderMenu/SiderMenu'
import MainPage from '../MainPage/MainPage'
import Header from '../Header/Header'
import Cookies from 'js-cookie'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { DANHSACHCHUCNANG, DANHSACHHANGHOA, KHOANNGAY, DATATONGHOP, DATADULIEU, CallBackAPI } from '../../action/Actions'
import API from '../../API/API'
import { useDispatch, useSelector } from 'react-redux'
import { khoanNgaySelect } from '../../redux/selector'
import LoadingPage from '../util/Loading/LoadingPage'

function Home({ handleToggleSidebar, isSidebarVisible }) {
  const user = Cookies.get('user')
  const dispatch = useDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isCookie, setIsCookie] = useState(user)
  const token = localStorage.getItem('TKN')
  const tokenRF = localStorage.getItem('RTKN')
  const KhoanNgay = useSelector(khoanNgaySelect)
  const sidebarRef = useRef(null)
  const [isClosingSidebarFromHeader, setIsClosingSidebarFromHeader] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch)
      await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch)
      await KHOANNGAY(API.KHOANNGAY, token, dispatch)
      await DATATONGHOP(API.TONGHOP, token, KhoanNgay, dispatch)
      await DATADULIEU(API.DANHSACHHANGHOA, token, dispatch)

      setDataLoaded(true)
    }

    const ThongSo = async () => {
      const ThongSo = await CallBackAPI(API.THONGSO, token)
      localStorage.setItem('ThongSo', JSON.stringify(ThongSo))
    }

    ThongSo()

    loadData()
  }, [token, tokenRF])

  useEffect(() => {
    // Đảm bảo là chỉ khi thanh bên không hiển thị mới thực hiện đoạn mã xử lý sự kiện.
    if (!isSidebarVisible) {
      const handleDocumentClick = (event) => {
        // Kiểm tra xem thanh bên không hiển thị và click không nằm trong thanh bên.
        if (!isSidebarVisible && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          handleToggleSidebar() // Gọi hàm để chuyển đổi trạng thái của thanh bên.
        }
      }

      const handleHeaderCloseSidebar = () => {
        // Hàm này được gọi khi đóng thanh bên từ phần header.
        document.removeEventListener('click', handleDocumentClick)
      }

      if (isClosingSidebarFromHeader) {
        document.addEventListener('click', handleHeaderCloseSidebar)
      } else {
        document.removeEventListener('click', handleHeaderCloseSidebar)
      }

      // Thêm bộ lắng nghe sự kiện cho sự kiện click trên toàn trang để đóng thanh bên.
      document.addEventListener('click', handleDocumentClick)

      // Hàm dọn dẹp để gỡ bỏ bộ lắng nghe sự kiện khi thành phần bị unmount hoặc có sự thay đổi trong các dependencies.
      return () => {
        document.removeEventListener('click', handleHeaderCloseSidebar)
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [isSidebarVisible, handleToggleSidebar, sidebarRef, isClosingSidebarFromHeader /* Thêm một giá trị động vào đây */])

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
        <SiderMenu refs={sidebarRef} />
      </div>
      <MainPage isSidebarVisible={isSidebarVisible} />
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
