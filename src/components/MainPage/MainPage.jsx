/* eslint-disable react/prop-types */
import { Route, Routes } from 'react-router-dom'
import ErrorPage from '../util/Erorr/ErrorPage'
import DashBoar from '../DashBoar/DashBoar'
import FAQ from '../FAQ/FAQ'
import DKSD from '../FAQ/DKSD'
import HangHoa from '../../Pages/DanhMuc/HangHoa'
import Phieumuahang from '../../pages_K/publics/MenuPage/PhieuMuaHang'
import PhieuNTR from '../../pages_K/publics/MenuPage/PhieuNTR'
import PhieuChiTien from '../../pages_K/publics/MenuPage/PhieuChiTien'
import PhieuThuTien from '../../pages_K/publics/MenuPage/PhieuThuTien'
import PhieuBanHang from '../PhieuBanHang/PhieuBanHang'
import PhieuNhapDieuChinh from '../../Pages/DuLieu/DLTrongKho/PhieuNhapDieuChinh/PhieuNhapDieuChinh'
import NhapXuatTonKho from '../../Pages/TruyVan/NhapXuatTonKho'
import PhieuLapRap from '../../Pages/DuLieu/DLTrongKho/PhieuLapRap/PhieuLapRap'
import PhieuXuatDieuChinh from '../../Pages/DuLieu/DLTrongKho/PhieuXuatDieuChinh/PhieuXuatDieuChinh'

function MainPage({ isSidebarVisible }) {
  return (
    <>
      <main id="main" className={isSidebarVisible ? 'main' : 'main show_main'}>
        <Routes>
          <Route path="/" element={<DashBoar />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/DKSD" element={<DKSD />} />
          <Route path="/DanhMuc_HangHoa" element={<HangHoa path={'DanhMuc_HangHoa'} />} />
          <Route path="/DuLieuDV/DuLieu_PMH" element={<Phieumuahang />} />
          <Route path="/DuLieuDV/DuLieu_NTR" element={<PhieuNTR />} />
          <Route path="/DuLieuTK/DuLieu_NDC" element={<PhieuNhapDieuChinh path="DuLieu_NDC" />} />
          <Route path="/DuLieuTK/DuLieu_PLR" element={<PhieuLapRap path="DuLieu_PLR" />} />
          <Route path="/DuLieuTK/DuLieu_XDC" element={<PhieuXuatDieuChinh path="DuLieu_XDC" />} />
          <Route path="/DuLieuDR/DuLieu_PBS" element={<PhieuBanHang />} />
          <Route path="/DuLieuTC/DuLieu_PCT" element={<PhieuChiTien />} />
          <Route path="/DuLieuTC/DuLieu_PTT" element={<PhieuThuTien />} />
          <Route path="/TruyVan_CanDoiNXT_TheoKho" element={<NhapXuatTonKho path="TruyVan_CanDoiNXT_TheoKho" />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  )
}

export default MainPage
