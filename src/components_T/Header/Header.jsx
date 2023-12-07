import { Link, useNavigate } from "react-router-dom";
import Logo from "/icons/viettas.svg";
import { toast } from "react-toastify";
import { IoIosLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import useStore from "../../hooks/GlobalState";

const Header = () => {
  const {
    state: { isShowSidebar },
    dispatch,
  } = useStore();
  const navigate = useNavigate();
  const handleLogOut = () => {
    navigate("");
    localStorage.clear();
    toast.info("Đăng Xuất Thành Công");
  };

  const handleToggleSidebar = () => {
    dispatch({ type: "SIDEBAR", payload: !isShowSidebar });
  };
  const userInfo = localStorage.getItem("user");
  return (
    <div className="flex justify-between items-center py-4 px-8 bg-slate-200 shadow-custom">
      <div className="flex items-center gap-4">
        <div
          className="hover:bg-slate-400 rounded-full cursor-pointer"
          onClick={() => handleToggleSidebar(false)}
        >
          <div className="p-2">
            {isShowSidebar ? <GiHamburgerMenu /> : <GiHamburgerMenu />}
          </div>
        </div>
        <Link to="tonghop">
          <img src={Logo} alt="" className="w-3/5" />
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-4">
          <FaUserCircle
            className="w-6 h-6 text-gray-700 cursor-pointer font-bold hover:text-blue-600"
            title={userInfo}
          />
          <IoIosLogOut
            onClick={handleLogOut}
            title="Đăng xuất"
            className="w-6 h-6 text-gray-700 cursor-pointer font-bold hover:text-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
