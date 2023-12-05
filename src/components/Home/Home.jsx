import SiderMenu from "../SiderMenu/SiderMenu";
import MainPage from "../MainPage/MainPage";
import Header from "../Header/Header";
// eslint-disable-next-line react/prop-types
function Home({ handleToggleSidebar, isSidebarVisible }) {
    return (
        <div>
            <Header handleToggleSidebar={handleToggleSidebar} />
            <div className={isSidebarVisible ? "toggle-sidebar" : ""}>
                <SiderMenu />
            </div>
            <MainPage isSidebarVisible={isSidebarVisible} />
            {/* {isCookie === "false" ? (
                <div className="card cook_tag">
                    <span
                        aria-hidden="true"
                        className="btn_cooks"
                        onClick={() => {
                            Cookies.set("isCookie", "true");
                            setIsCookie(false);
                        }}
                    >
                        &times;
                    </span>
                    <div className="card-body">
                        <p className="card-text">
                            Chúng tôi đang sử dụng cookie để cung cấp cho bạn
                            những trải nghiệm tốt nhất trên trang web này. Bằng
                            cách tiếp tục truy cập, bạn đồng ý với{" "}
                            <Link to="/FAQ">
                                Chính sách thu thập và sử dụng cookie của chúng
                                tôi.
                            </Link>
                        </p>
                    </div>
                </div>
            ) : null} */}
        </div>
    );
}
export default Home;
