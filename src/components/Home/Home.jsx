import SiderMenu from "../SiderMenu/SiderMenu";
import MainPage from "../MainPage/MainPage";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line react/prop-types
function Home({ handleToggleSidebar, isSidebarVisible }) {
  const user = Cookies.get("user");
  console.log(typeof user);
  const [isCookie, setIsCookie] = useState(user);
  return (
    <div>
      <Header handleToggleSidebar={handleToggleSidebar} />
      <div className={isSidebarVisible ? "toggle-sidebar" : "mainSider"}>
        <SiderMenu />
      </div>
      <MainPage isSidebarVisible={isSidebarVisible} />
      {isCookie === "true" ? (
        <div className="card cook_tag">
          <div className="flex justify-end px-2">
            <span
              aria-hidden="true"
              className="btn_cooks hover:text-red-400  "
              onClick={() => {
                Cookies.set("user", false);
                setIsCookie(false);
              }}
            >
              &times;
            </span>
          </div>

          <div className="card-body">
            <p className="card-text">
              Chúng tôi đang sử dụng cookie để cung cấp cho bạn những trải
              nghiệm tốt nhất trên trang web này. Bằng cách tiếp tục truy cập,
              bạn đồng ý với{" "}
              <Link to="/FAQ">
                Chính sách thu thập và sử dụng cookie của chúng tôi.
              </Link>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default Home;
