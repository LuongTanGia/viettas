import { Route, Routes } from 'react-router-dom'
import ErrorPage from '../util/Erorr/ErrorPage'
import DashBoar from '../DashBoar/DashBoar'
import FAQ from '../FAQ/FAQ'
import DKSD from '../FAQ/DKSD'
// import PhieuMuaHang from "../DULIEU/PhieuMuaHang";
// import Home from "../Home/Home";
import Phieumuahang from '../../pages_K/publics/MenuPage/PhieuMuaHang'
import PhieuNTR from '../../pages_K/publics/MenuPage/PhieuNTR'
import PhieuChiTien from '../../pages_K/publics/MenuPage/PhieuChiTien'
import HangHoa from '../../pages_T/DanhMuc/HangHoa'
import NhapXuatTonKho from '../../pages_T/TruyVan/NhapXuatTonKho'
import PhieuBanHang from '../PhieuBanHang/PhieuBanHang'
import PhieuNhapDieuChinh from '../../pages_T/DuLieu/DLTrongKho/PhieuNhapDieuChinh/PhieuNhapDieuChinh'
// eslint-disable-next-line react/prop-types
function MainPage({ isSidebarVisible, dataCRUD }) {
  return (
    <>
      <main id="main" className={isSidebarVisible ? 'main' : 'main show_main'}>
        <Routes>
          <Route path="/" element={<DashBoar />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/DKSD" element={<DKSD />} />
          <Route path="/DanhMuc_HangHoa" element={<HangHoa dataCRUD={dataCRUD} />} />
          <Route path="/TruyVan_CanDoiNXT_TheoKho" element={<NhapXuatTonKho dataCRUD={dataCRUD} />} />
          <Route path="/DuLieuDV/DuLieu_PMH" element={<Phieumuahang dataCRUD={dataCRUD} />} />
          <Route path="/DuLieuDV/DuLieu_NTR" element={<PhieuNTR dataCRUD={dataCRUD} />} />
          <Route path="/DuLieuDR/DuLieu_PBS" element={<PhieuBanHang dataCRUD={dataCRUD} />} />
          <Route path="/DuLieuTK/DuLieu_NDC" element={<PhieuNhapDieuChinh dataCRUD={dataCRUD} />} />
          <Route path="/DuLieuTC/DuLieu_PCT" element={<PhieuChiTien dataCRUD={dataCRUD} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  )
}

export default MainPage
