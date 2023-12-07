import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import useStore from "../../hooks/GlobalState";
import "./MainLayout.css";
import Footer from "../../components/Footer/Footer";
// import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const MainLayout = () => {
  const {
    state: { isShowSidebar },
    dispatch,
  } = useStore();
  const handleHideSidebar = () => {
    dispatch({ type: "SIDEBAR", payload: false });
  };
  return (
    <>
      <div>
        <div className="main_layout flex flex-col w-screen h-screen overflow-hidden  ">
          <Header />
          <div className="main__body flex-1 overflow-hidden">
            <div
              className={`main__sidebar  flex flex-col max-w-[15rem] max-h-[40rem]  overflow-hidden ${
                isShowSidebar ? " show" : ""
              }`}
              onClick={handleHideSidebar}
            >
              <Sidebar />
            </div>
            <div className="main__content flex flex-col overflow-hidden">
              {/* <Breadcrumb /> */}
              <div className="main__content--outlet flex flex-col overflow-y-auto">
                <Outlet />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
