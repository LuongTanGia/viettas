/* eslint-disable react/prop-types */
import { Route, Routes } from 'react-router-dom'
import ErrorPage from '../util/Erorr/ErrorPage'
import DashBoar from '../DashBoar/DashBoar'
import FAQ from '../FAQ/FAQ'
import DKSD from '../FAQ/DKSD'
import Phieumuahang from '../../pages_K/publics/MenuPage/PhieuMuaHang'
import PhieuNTR from '../../pages_K/publics/MenuPage/PhieuNTR'
import PhieuChiTien from '../../pages_K/publics/MenuPage/PhieuChiTien'
import HangHoa from '../../pages_T/DanhMuc/HangHoa'
import NhapXuatTonKho from '../../pages_T/TruyVan/NhapXuatTonKho'
import PhieuBanHang from '../PhieuBanHang/PhieuBanHang'
import PhieuNhapDieuChinh from '../../pages_T/DuLieu/DLTrongKho/PhieuNhapDieuChinh/PhieuNhapDieuChinh'

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
          <Route path="/DuLieuDR/DuLieu_PBS" element={<PhieuBanHang />} />
          <Route path="/DuLieuTK/DuLieu_NDC" element={<PhieuNhapDieuChinh path="DuLieu_NDC" />} />
          <Route path="/DuLieuTC/DuLieu_PCT" element={<PhieuChiTien />} />
          <Route path="/TruyVan_CanDoiNXT_TheoKho" element={<NhapXuatTonKho path="TruyVan_CanDoiNXT_TheoKho" />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  )
}

export default MainPage
