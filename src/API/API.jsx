const BASE_URL = 'https://isalewebapi.viettassaigon.vn'

const API = {
  MAIN: BASE_URL,
  DANHSACHDULIEU: `${BASE_URL}/api/Auth/DanhSachDuLieu`,
  DANGNHAP: `${BASE_URL}/api/Auth/DangNhap`,
  TONGHOP: `${BASE_URL}/api/statistics/TongHop`,
  DANHSACHCHUCNANG: `${BASE_URL}/api/settings/GiaTriHeThong/DanhSachChucNang`,
  DANHSACHHANGHOA: `${BASE_URL}/api/lists/HangHoa/DanhSach`,
  KHOANNGAY: `${BASE_URL}/api/settings/GiaTriHeThong/KhoanNgay`,
  PHIEUMUAHANG: `${BASE_URL}/api/entries/DuLieuPMH/DanhSach`,
  DOIMATKHAU: `${BASE_URL}/api/NguoiDung/DoiMatKhau`,

  //Phiếu Bán Hàng ///api/entries/DuLieuPBS

  DANHSACHPBS: `${BASE_URL}/api/entries/DuLieuPBS/DanhSach`,
  CHITIETPBS: `${BASE_URL}/api/entries/DuLieuPBS/ThongTin`,
  DANHSACHDOITUONG_PBS: `${BASE_URL}/api/entries/DuLieuPBS/ListHelper_DoiTuong`,
  DANHSACHKHOHANG_PBS: `${BASE_URL}/api/entries/DuLieuPBS/ListHelper_KhoHang`,
  DANHSACHHANGHOA_PBS: `${BASE_URL}/api/entries/DuLieuPBS/ListHelper_HangHoa`,
  THEMPHIEUBANHANG: `${BASE_URL}/api/entries/DuLieuPBS/Them`,
  SUAPHIEUBANHANG: `${BASE_URL}/api/entries/DuLieuPBS/Sua`,
  XOAPHIEUBANHANG: `${BASE_URL}/api/entries/DuLieuPBS/Xoa`,
  LAPPHIEUTHU: `${BASE_URL}/api/entries/DuLieuPBS/LapPhieuThu`,
  LISTCHUNGTU: `${BASE_URL}/api/entries/DuLieuPBS/ListHelper_ChungTuTheoNgay`,
  INPHIEU: `${BASE_URL}/api/entries/DuLieuPBS/InPhieu`,
  INPHIEUKHO: `${BASE_URL}/api/entries/DuLieuPBS/InPhieuKho`,
  //Lấy danh sách giá trị hệ thống
  THONGSO: `${BASE_URL}/api/settings/GiaTriHeThong/ThongSo`,
}

export default API
