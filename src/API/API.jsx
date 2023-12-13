const BASE_URL = "https://isalewebapi.viettassaigon.vn";

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
};

export default API;
