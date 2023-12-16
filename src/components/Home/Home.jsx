import SiderMenu from '../SiderMenu/SiderMenu'
import MainPage from '../MainPage/MainPage'
import Header from '../Header/Header'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { DANHSACHCHUCNANG, DANHSACHHANGHOA, KHOANNGAY, DATATONGHOP, DATADULIEU, DANHSACHPHIEUBANHANG } from '../../action/Actions'
import API from '../../API/API'
import { useDispatch, useSelector } from 'react-redux'
import { khoanNgaySelect } from '../../redux/selector'
import LoadingPage from '../util/Loading/LoadingPage'
// eslint-disable-next-line react/prop-types
function Home({ handleToggleSidebar, isSidebarVisible }) {
  const user = Cookies.get('user')
  const dispatch = useDispatch()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isCookie, setIsCookie] = useState(user)
  const token = localStorage.getItem('TKN')
  const tokenRF = localStorage.getItem('RTKN')

  const KhoanNgay = useSelector(khoanNgaySelect)
  useEffect(() => {
    const loadData = async () => {
      await DANHSACHCHUCNANG(API.DANHSACHCHUCNANG, token, dispatch)
      await DANHSACHHANGHOA(API.DANHSACHHANGHOA, token, dispatch)
      await KHOANNGAY(API.KHOANNGAY, token, dispatch)
      await DATATONGHOP(API.TONGHOP, token, KhoanNgay, dispatch)
      await DATADULIEU(API.DANHSACHHANGHOA, token, dispatch)
      await DANHSACHPHIEUBANHANG(API.DANHSACHPBS, token, dispatch)
      setDataLoaded(true)
    }
    loadData()
  }, [token, tokenRF])
  if (!dataLoaded) {
    return <LoadingPage />
  }
  return (
    <div>
      <Header handleToggleSidebar={handleToggleSidebar} />
      <div className={isSidebarVisible ? 'toggle-sidebar' : 'mainSider'}>
        <SiderMenu />
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
