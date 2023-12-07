import { Route, Routes } from "react-router-dom";
import ErrorPage from "../util/Erorr/ErrorPage";
import DashBoar from "../DashBoar/DashBoar";
import FAQ from "../FAQ/FAQ";
import DKSD from "../FAQ/DKSD";
// import PhieuMuaHang from "../DULIEU/PhieuMuaHang";
import Table from "../util/Table/Table";
// import Home from "../Home/Home";
import Phieumuahang from "../../pages_K/publics/MenuPage/PhieuMuaHang";

// eslint-disable-next-line react/prop-types
function MainPage({ isSidebarVisible }) {
  return (
    <>
      <main id="main" className={isSidebarVisible ? "main" : "main show_main"}>
        <Routes>
          <Route path="/" element={<DashBoar />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/DKSD" element={<DKSD />} />
          <Route path="/DanhMuc_HangHoa" element={<Table />} />
          <Route path="/DuLieuDV/DuLieu_PMH" element={<Phieumuahang />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  );
}

export default MainPage;
