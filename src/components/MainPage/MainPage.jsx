/* eslint-disable react/prop-types */
import { Route, Routes } from 'react-router-dom'
import ErrorPage from '../util/Erorr/ErrorPage'
import DashBoar from '../DashBoar/DashBoar'
import FAQ from '../FAQ/FAQ'
import DKSD from '../FAQ/DKSD'
import HangHoa from '../../Pages/DanhMuc/HangHoa'
import PhieuMuaHang from '../../Pages/DuLieu/DLDauVao/PhieuMuaHang'
import PhieuBanLe from '../../Pages/DuLieu/DLDauRa/PhieuBanLe'
import PhieuNTR from '../../Pages/DuLieu/DLDauVao/PhieuNTR'
import PhieuXTR from '../../Pages/DuLieu/DLDauRa/PhieuXTR'
import PhieuChiTien from '../../Pages/DuLieu/ThuChi/PhieuChiTien'
import PhieuThuTien from '../../Pages/DuLieu/ThuChi/PhieuThuTien'
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
import GiaBanLe from '../../Pages/ThietLap/GiaBanLe'
import GiaBanSi from '../../Pages/ThietLap/GiaBanSi'
import BangGiaKH from '../../Pages/ThietLap/BangGiaKH'
import CongNoDauVao from '../CongNoDauVao/CongNoDauVao'
import DSBHHH from '../DoanhSoBanHang/DSBH(HH)'
import DSBHKHH from '../DoanhSoBanHang/DSBH(KH)'
import DSBHKH_HH from '../DoanhSoBanHang/DSBH(KH_HH)'
import NhomDoiTuong from '../../Pages/DanhMuc/NhomDoiTuong'
import NhomHang from '../../Pages/DanhMuc/NhomHang'
import HangMucThu from '../../Pages/DanhMuc/HangMucThu'
import HangMucChi from '../../Pages/DanhMuc/HangMucChi'
import KhoHang from '../../Pages/ThietLap/KhoHang'
import QuanLy from '../../Pages/ThietLap/QuanLy'
import QuayTinhTien from '../../Pages/ThietLap/QuayTinhTien'
import NhapXuatTon from '../../Pages/TruyVan/NhapXuatTon'

function MainPage({ isSidebarVisible }) {
  return (
    <>
      <main id="main" className={isSidebarVisible ? 'main' : 'main show_main'}>
        <Routes>
          <Route path="/" element={<DashBoar />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/DKSD" element={<DKSD />} />
          <Route path="/DanhMuc_HangHoa" element={<HangHoa />} />
          <Route path="/DanhMuc_NhomDoiTuong" element={<NhomDoiTuong />} />
          <Route path="/DanhMuc_NhomHang" element={<NhomHang />} />
          <Route path="/DanhMuc_DoiTuong" element={<DoiTuong />} />
          <Route path="/DanhMuc_HangMucThu" element={<HangMucThu />} />
          <Route path="/DanhMuc_HangMucChi" element={<HangMucChi />} />
          <Route path="/DuLieuDV/DuLieu_PMH" element={<PhieuMuaHang />} />
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
          <Route path="/DuLieuDR/DuLieu_PBL" element={<PhieuBanLe />} />
          <Route path="/DuLieuTC/DuLieu_PCT" element={<PhieuChiTien />} />
          <Route path="/DuLieuTC/DuLieu_PTT" element={<PhieuThuTien />} />
          <Route path="/TruyVan_CongNoDauRa" element={<CongNoDauRa />} />
          <Route path="/TruyVan_CongNoDauVao" element={<CongNoDauVao />} />
          <Route path="/TruyVan_DoanhSoBanHangHH" element={<DSBHHH />} />
          <Route path="/TruyVan_DoanhSoBanHangKH" element={<DSBHKHH />} />
          <Route path="/TruyVan_DoanhSoBanHangKHHH" element={<DSBHKH_HH />} />
          <Route path="/TruyVan_CanDoiNXT_TheoKho" element={<NhapXuatTonKho />} />
          <Route path="/TruyVan_CanDoiNXT_TongKho" element={<NhapXuatTon />} />
          <Route path="/ThietLap_GiaLe" element={<GiaBanLe />} />
          <Route path="/ThietLap_NhomGiaDoiTuong" element={<BangGiaKH />} />
          <Route path="/ThietLap_GiaLe" element={<GiaBanLe />} />
          <Route path="/ThietLap_GiaSi" element={<GiaBanSi />} />
          <Route path="/ThietLap_KhoHang" element={<KhoHang />} />
          <Route path="/ThietLap_QuanLy" element={<QuanLy />} />
          <Route path="/ThietLap_QuayTinhTien" element={<QuayTinhTien />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  )
}

export default MainPage
