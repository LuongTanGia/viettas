/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { dataSelector } from '../../redux/selector'
import { useNavigate } from 'react-router-dom'
import './SiderMenu.css'
import categoryAPI from '../../API/linkAPI'
import { RETOKEN } from '../../action/Actions'
import ActionButton from '../util/Button/ActionButton'
import { CgCloseO } from 'react-icons/cg'

const SiderMenu = ({ refs }) => {
  const TokenAccess = localStorage.getItem('TKN')
  const data = useSelector(dataSelector)
  const navigate = useNavigate()
  const [string] = useState([])
  const [isShowNotify, setIsShowNotify] = useState(false)

  const getQuyenHan = async (Ma) => {
    try {
      const response = await categoryAPI.QuyenHan(Ma, TokenAccess)
      if (response.data.DataError === 0) {
        Ma.includes('XuLy_') && response.data.RUN === false
          ? setIsShowNotify(true)
          : !Ma.includes('XuLy_') && response.data.VIEW === false
            ? setIsShowNotify(true)
            : navigate(`/${string.includes(Ma) ? '' : Ma}`)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getQuyenHan()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getQuyenHanChild = async (Ma1, Ma2) => {
    try {
      console.log('2')
      const response = await categoryAPI.QuyenHan(Ma2, TokenAccess)
      if (response.data.DataError === 0) {
        response.data.VIEW == false ? setIsShowNotify(true) : navigate(`/${Ma1}/${Ma2}`)
      } else if ((response.data && response.data.DataError === -107) || (response.data && response.data.DataError === -108)) {
        await RETOKEN()
        getQuyenHanChild()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <aside id="sidebar" className="sidebar" ref={refs}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-gem"></i>
              <span>F.A.Q</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </Link>
            <ul id="icons-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to="/FAQ">
                  <i className="bi bi-circle"></i>
                  <span>Chính sách bảo mật</span>
                </Link>
              </li>
              <li>
                <Link to="/DKSD">
                  <i className="bi bi-circle"></i>
                  <span>Điều khoản và điều kiện sử dụng</span>
                </Link>
              </li>
            </ul>
          </li>
          {data.DataResults
            ? data.DataResults.map(
                (item, index) =>
                  item.NhomChucNang === '10' && (
                    <li className="nav-item" key={index}>
                      <Link className="nav-link collapsed" data-bs-target={`#${item.MaChucNang}-nav`} data-bs-toggle="collapse">
                        <i className="bi bi-menu-button-wide"></i>
                        <span>{item.TenChucNang}</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </Link>
                      <ul id={`${item.MaChucNang}-nav`} className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        {data.DataResults.map((chir_data) =>
                          chir_data.NhomChucNang === item.MaChucNang ? (
                            <li key={chir_data.MaChucNang} className="submenu-item">
                              {!string.includes(chir_data.MaChucNang) ? (
                                <>
                                  {/* <Link to={`/${string.includes(chir_data.MaChucNang) ? '' : chir_data.MaChucNang}`}>
                                  <i className="bi bi-circle"></i>
                                  {chir_data.TenChucNang}
                                </Link> */}
                                  <a
                                    onClick={() => {
                                      getQuyenHan(chir_data.MaChucNang)
                                    }}
                                    className="cursor-pointer items-center hover:bg-blue-50"
                                  >
                                    <i className="bi bi-circle"></i>
                                    {chir_data.TenChucNang}
                                  </a>
                                </>
                              ) : (
                                <>
                                  <Link
                                    to={`/${string.includes(chir_data.MaChucNang) ? '' : chir_data.MaChucNang}`}
                                    className="nav-link collapsed"
                                    data-bs-target={`#${chir_data.MaChucNang}-nav`}
                                    data-bs-toggle="collapse"
                                  >
                                    <i className="bi bi-circle"></i>
                                    {chir_data.TenChucNang}
                                  </Link>
                                </>
                              )}
                              <ul id={`${chir_data.MaChucNang}-nav`} className="nav-content collapse submenu_2">
                                {data.DataResults.map((chir_data_2) =>
                                  chir_data_2.NhomChucNang === chir_data.MaChucNang
                                    ? string.push(chir_data.MaChucNang) && (
                                        <li key={chir_data_2.MaChucNang} className="submenu-item_2">
                                          {/* <Link className="lastTitle" to={`/${chir_data.MaChucNang}/${chir_data_2.MaChucNang}`} title={chir_data_2.TenChucNang}>
                                            <i className="bi bi-circle-fill"></i>
                                            {chir_data_2.TenChucNang}
                                          </Link> */}
                                          <a
                                            onClick={() => {
                                              getQuyenHanChild(chir_data.MaChucNang, chir_data_2.MaChucNang)
                                            }}
                                            className="cursor-pointer items-center hover:bg-blue-50 lastTitle"
                                          >
                                            <i className="bi bi-circle-fill"></i>
                                            {chir_data_2.TenChucNang}
                                          </a>
                                        </li>
                                      )
                                    : null,
                                )}
                              </ul>
                            </li>
                          ) : null,
                        )}
                      </ul>
                    </li>
                  ),
              )
            : null}
        </ul>
      </aside>
      <div>
        {isShowNotify && (
          <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-10">
            <div className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white px-2 rounded shadow-custom overflow-hidden">
              <div className="flex flex-col gap-2 p-2 justify-between ">
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <p className="text-blue-700 font-semibold uppercase">Kiểm tra quyền hạn người dùng</p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-2 p-3 items-center">
                    <div>
                      <CgCloseO className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="whitespace-nowrap">Bạn không có quyền thực hiện chức năng này!</p>
                      <p className="whitespace-nowrap">
                        Vui lòng liên hệ <span className="font-bold">Người Quản Trị</span> để được cấp quyền
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <ActionButton
                      handleAction={() => {
                        setIsShowNotify(false)
                      }}
                      title={'Đóng'}
                      isModal={true}
                      color={'slate-50'}
                      background={'red-500'}
                      color_hover={'red-500'}
                      bg_hover={'white'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SiderMenu
