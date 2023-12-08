import { Link } from "react-router-dom";

import Logo from "../../assets/img/logo.png";
import ChangePass from "./ChangePass";
import { useState } from "react";
// eslint-disable-next-line react/prop-types
function Header({ handleToggleSidebar }) {
    const [isShow, setIsShow] = useState(false);
    const user = localStorage.getItem("User");
    const logout = () => {
        window.localStorage.clear();
        window.location.href = "/login";
    };
    const handeleChange = () => {
        setIsShow(true);
    };
    const close = () => {
        setIsShow(false);
    };
    return (
        <>
            <header
                id="header"
                className="header fixed-top d-flex align-items-center z-10"
            >
                <div className="d-flex align-items-center justify-content-between">
                    <Link
                        href="index.html"
                        className="logo d-flex align-items-center"
                    >
                        <img src="assets/img/logo.png" alt="" />
                        <span className="d-none d-lg-block">VietTas</span>
                    </Link>
                    <i
                        className="bi bi-list toggle-sidebar-btn"
                        onClick={handleToggleSidebar}
                    ></i>
                </div>

                <div className="search-bar"></div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item d-block d-lg-none">
                            <Link
                                className="nav-link nav-icon search-bar-toggle "
                                href="#"
                            >
                                <i className="bi bi-search"></i>
                            </Link>
                        </li>

                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link nav-icon"
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <i className="bi bi-bell"></i>
                                <span className="badge bg-primary badge-number">
                                    4
                                </span>
                            </Link>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                                <li className="dropdown-header">
                                    You have 4 new notifications
                                    <Link href="#">
                                        <span className="badge rounded-pill bg-primary p-2 ms-2">
                                            View all
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-exclamation-circle text-warning"></i>
                                    <div>
                                        <h4>Lorem Ipsum</h4>
                                        <p>
                                            Quae dolorem earum veritatis
                                            oditseno
                                        </p>
                                        <p>30 min. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-x-circle text-danger"></i>
                                    <div>
                                        <h4>Atque rerum nesciunt</h4>
                                        <p>
                                            Quae dolorem earum veritatis
                                            oditseno
                                        </p>
                                        <p>1 hr. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-check-circle text-success"></i>
                                    <div>
                                        <h4>Sit rerum fuga</h4>
                                        <p>
                                            Quae dolorem earum veritatis
                                            oditseno
                                        </p>
                                        <p>2 hrs. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="notification-item">
                                    <i className="bi bi-info-circle text-primary"></i>
                                    <div>
                                        <h4>Dicta reprehenderit</h4>
                                        <p>
                                            Quae dolorem earum veritatis
                                            oditseno
                                        </p>
                                        <p>4 hrs. ago</p>
                                    </div>
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li className="dropdown-footer">
                                    <Link href="#">Show all notifications</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link nav-icon"
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <i className="bi bi-chat-left-text"></i>
                                <span className="badge bg-success badge-number">
                                    3
                                </span>
                            </Link>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                                <li className="dropdown-header">
                                    You have 3 new messages
                                    <Link href="#">
                                        <span className="badge rounded-pill bg-primary p-2 ms-2">
                                            View all
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <Link href="#">
                                        <img
                                            src="assets/img/messages-1.jpg"
                                            alt=""
                                            className="rounded-circle"
                                        />
                                        <div>
                                            <h4>Maria Hudson</h4>
                                            <p>
                                                Velit asperiores et ducimus
                                                soluta repudiandae labore
                                                officia est ut...
                                            </p>
                                            <p>4 hrs. ago</p>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <Link href="#">
                                        <img
                                            src="assets/img/messages-2.jpg"
                                            alt=""
                                            className="rounded-circle"
                                        />
                                        <div>
                                            <h4>Anna Nelson</h4>
                                            <p>
                                                Velit asperiores et ducimus
                                                soluta repudiandae labore
                                                officia est ut...
                                            </p>
                                            <p>6 hrs. ago</p>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="message-item">
                                    <Link href="#">
                                        <img
                                            src="assets/img/messages-3.jpg"
                                            alt=""
                                            className="rounded-circle"
                                        />
                                        <div>
                                            <h4>{user}</h4>
                                            <p>
                                                Velit asperiores et ducimus
                                                soluta repudiandae labore
                                                officia est ut...
                                            </p>
                                            <p>8 hrs. ago</p>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li className="dropdown-footer">
                                    <Link href="#">Show all messages</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown pe-3">
                            <Link
                                className="nav-link nav-profile d-flex align-items-center pe-0"
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    src={Logo}
                                    alt="Profile"
                                    className="rounded-circle"
                                />
                                <span className="d-none d-md-block dropdown-toggle ps-2">
                                    {user}
                                </span>
                            </Link>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>{user}</h6>
                                    <span>Web Designer</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <Link
                                        className="dropdown-item d-flex align-items-center"
                                        href="users-profile.html"
                                        onClick={handeleChange}
                                    >
                                        <i className="bi bi-gear"></i>
                                        <span>Đổi mật khẩu </span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <Link
                                        className="dropdown-item d-flex align-items-center"
                                        href="pages-faq.html"
                                    >
                                        <i className="bi bi-question-circle"></i>
                                        <span>Need Help?</span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li onClick={logout}>
                                    <Link
                                        className="dropdown-item d-flex align-items-center"
                                        href="#"
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Thoát</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <ChangePass isShow={isShow} close={close} />
            </header>
        </>
    );
}

export default Header;
