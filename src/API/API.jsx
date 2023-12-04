const BASE_URL = "https://isalewebapi.viettassaigon.vn";

const API = {
    MAIN: BASE_URL,
    DANHSACHDULIEU: `${BASE_URL}/api/Auth/DanhSachDuLieu`,
    DANGNHAP: `${BASE_URL}/api/Auth/DangNhap`,
    TONGHOP: `${BASE_URL}/api/statistics/TongHop`,
    DANHSACHCHUCNANG: `${BASE_URL}/api/settings/GiaTriHeThong/DanhSachChucNang`,
    DANHSACHHANGHOA: `${BASE_URL}/api/lists/HangHoa/DanhSach`,
};

export default API;
