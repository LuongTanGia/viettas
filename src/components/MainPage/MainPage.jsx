/* eslint-disable react/prop-types */
import { Route, Routes } from 'react-router-dom'
import ErrorPage from '../util/Erorr/ErrorPage'
import DashBoar from '../DashBoar/DashBoar'
import FAQ from '../FAQ/FAQ'
import DKSD from '../FAQ/DKSD'
import HangHoa from '../../Pages/DanhMuc/HangHoa'
import Phieumuahang from '../../pages_K/publics/MenuPage/PhieuMuaHang'
import PhieuNTR from '../../pages_K/publics/MenuPage/PhieuNTR'
import PhieuXTR from '../../pages_K/publics/MenuPage/PhieuXTR'
import PhieuChiTien from '../../pages_K/publics/MenuPage/PhieuChiTien'
import PhieuThuTien from '../../pages_K/publics/MenuPage/PhieuThuTien'
import PhieuBanHang from '../PhieuBanHang/PhieuBanHang'
import PhieuNhapDieuChinh from '../../Pages/DuLieu/DLTrongKho/PhieuNhapDieuChinh/PhieuNhapDieuChinh'
import NhapXuatTonKho from '../../Pages/TruyVan/NhapXuatTonKho'
import PhieuLapRap from '../../Pages/DuLieu/DLTrongKho/PhieuLapRap/PhieuLapRap'
import PhieuXuatDieuChinh from '../../Pages/DuLieu/DLTrongKho/PhieuXuatDieuChinh/PhieuXuatDieuChinh'
import PhieuXuatChuyenKho from '../../Pages/DuLieu/DLTrongKho/PhieuXuatChuyenKho/PhieuXuatChuyenKho'
import PhieuNhapChuyenKho from '../../Pages/DuLieu/DLTrongKho/PhieuNhapChuyenKho/PhieuNhapChuyenKho'
import PhieuXuatSuDung from '../../Pages/DuLieu/DLTrongKho/PhieuXuatSuDung/PhieuXuatSuDung'
import PhieuXuatHuy from '../../Pages/DuLieu/DLTrongKho/PhieuXuatHuy/PhieuXuatHuy'
import CongNoDauRa from '../CongNoDauRa/CongNoDauRa'
import DoiTuong from '../../Pages/DanhMuc/DoiTuong'

function MainPage({ isSidebarVisible }) {
  return (
    <>
      <main id="main" className={isSidebarVisible ? 'main' : 'main show_main'}>
        <Routes>
          <Route path="/" element={<DashBoar />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/DKSD" element={<DKSD />} />
          <Route path="/DanhMuc_HangHoa" element={<HangHoa />} />
          <Route path="/DanhMuc_DoiTuong" element={<DoiTuong />} />
          <Route path="/DuLieuDV/DuLieu_PMH" element={<Phieumuahang />} />
          <Route path="/DuLieuDV/DuLieu_NTR" element={<PhieuNTR />} />
          <Route path="/DuLieuDR/DuLieu_XTR" element={<PhieuXTR />} />
          <Route path="/DuLieuTK/DuLieu_NDC" element={<PhieuNhapDieuChinh />} />
          <Route path="/DuLieuTK/DuLieu_XSD" element={<PhieuXuatSuDung />} />
          <Route path="/DuLieuTK/DuLieu_HUY" element={<PhieuXuatHuy />} />
          <Route path="/DuLieuTK/DuLieu_PLR" element={<PhieuLapRap />} />
          <Route path="/DuLieuTK/DuLieu_NCK" element={<PhieuNhapChuyenKho />} />
          <Route path="/DuLieuTK/DuLieu_XDC" element={<PhieuXuatDieuChinh />} />
          <Route path="/DuLieuTK/DuLieu_XCK" element={<PhieuXuatChuyenKho />} />
          <Route path="/DuLieuDR/DuLieu_PBS" element={<PhieuBanHang />} />
          <Route path="/DuLieuTC/DuLieu_PCT" element={<PhieuChiTien />} />
          <Route path="/DuLieuTC/DuLieu_PTT" element={<PhieuThuTien />} />
          <Route path="/TruyVan_CongNoDauRa" element={<CongNoDauRa />} />
          <Route path="/TruyVan_CanDoiNXT_TheoKho" element={<NhapXuatTonKho />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  )
}

export default MainPage
