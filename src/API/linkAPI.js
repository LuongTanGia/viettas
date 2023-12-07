import { axiosClient } from "./functions";
const categoryAPI = {
  // Auth
  getTokenDSDL(data, TokenID) {
    const url = "/Auth/DanhSachDuLieu";
    return axiosClient.post(url, data, { TokenID });
  },

  DangNhapGG(TokenID) {
    const url = "/Auth/DanhSachDuLieu";
    return axiosClient.post(url, { TokenID });
  },

  DangNhap(TokenID, RemoteDB) {
    const url = "/Auth/DangNhap";
    return axiosClient.post(url, { TokenID, RemoteDB });
  },

  Refresh(TokenID) {
    const url = "/RefreshToken";
    return axiosClient.post(url, { TokenID });
  },

  // TongHop
  TongHop(accessToken) {
    const url = "/statistics/TongHop";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },
  // DanhMuc/HangHoa
  HangHoa(accessToken) {
    const url = "/lists/HangHoa/DanhSach";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  InfoHangHoa(Ma, accessToken) {
    const url = "/lists/HangHoa/ThongTin";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, { Ma }, { headers });
  },

  ThemHangHoa(bodyData, accessToken) {
    const url = "/lists/HangHoa/Them";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, bodyData, { headers });
  },

  SuaHangHoa(Data, accessToken) {
    const url = "/lists/HangHoa/Sua";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, Data, { headers });
  },

  XoaHangHoa(Ma, accessToken) {
    const url = "/lists/HangHoa/Xoa";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, { Ma }, { headers });
  },

  GanTrangThai(body, accessToken) {
    const url = "/lists/HangHoa/GanTrangThai";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, body, { headers });
  },

  GanNhom(body, accessToken) {
    const url = "/lists/HangHoa/GanNhom";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, body, { headers });
  },

  InMaVach(body, accessToken) {
    const url = "/lists/HangHoa/InMaVach";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, body, { headers });
  },

  ListNhomHang(accessToken) {
    const url = "/lists/HangHoa/ListHelper_NhomHang";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  ListHangHoaCT(accessToken) {
    const url = "/lists/HangHoa/ListHelper_HangHoaCT";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  ListDVT(accessToken) {
    const url = "/lists/HangHoa/ListHelper_DVT";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  // TruyVan/NhapXuatTonKho
  InfoNXTTheoKho(body, accessToken) {
    const url = "/inquiries/NhapXuatTon/TheoKho";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, body, { headers });
  },

  ListNhomHangNXT(accessToken) {
    const url = "/inquiries/NhapXuatTon/ListHelper_NhomHang";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  ListHangHoaNXT(accessToken) {
    const url = "/inquiries/NhapXuatTon/ListHelper_HangHoa";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  ListKhoHangNXT(accessToken) {
    const url = "/inquiries/NhapXuatTon/ListHelper_KhoHang";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },

  // Hethong/KhoanNgay
  KhoanNgay(accessToken) {
    const url = "/settings/GiaTriHeThong/KhoanNgay";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosClient.post(url, {}, { headers });
  },
};

export default categoryAPI;
