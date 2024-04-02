import { axiosClient } from './functions'
const categoryAPI = {
  // DanhMuc/HangHoa
  HangHoa(accessToken) {
    const url = '/lists/HangHoa/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoHangHoa(Ma, accessToken) {
    const url = '/lists/HangHoa/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemHangHoa(bodyData, accessToken) {
    const url = '/lists/HangHoa/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, bodyData, { headers })
  },
  SuaHangHoa(Data, accessToken) {
    const url = '/lists/HangHoa/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, Data, { headers })
  },
  XoaHangHoa(Ma, accessToken) {
    const url = '/lists/HangHoa/Xoa'
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  GanTrangThai(body, accessToken) {
    const url = '/lists/HangHoa/GanTrangThai'
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  GanNhom(body, accessToken) {
    const url = '/lists/HangHoa/GanNhom'
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  InMaVach(body, accessToken) {
    const url = '/lists/HangHoa/InMaVach'
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListNhomHang(accessToken) {
    const url = '/lists/HangHoa/ListHelper_NhomHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaCT(accessToken) {
    const url = '/lists/HangHoa/ListHelper_HangHoaCT'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListDVT(accessToken) {
    const url = '/lists/HangHoa/ListHelper_DVT'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  GetBarCode13(Ma, accessToken) {
    const url = '/lists/HangHoa/NhanMaBarcodeEAN13'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, Ma, { headers })
  },
  GetBarCode8(Ma, accessToken) {
    const url = '/lists/HangHoa/NhanMaBarcodeEAN8'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, Ma, { headers })
  },

  // DanhMuc/DoiTuong
  DoiTuong(accessToken) {
    const url = '/lists/DoiTuong/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoDoiTuong(Ma, accessToken) {
    const url = '/lists/DoiTuong/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemDoiTuong(body, accessToken) {
    const url = '/lists/DoiTuong/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaDoiTuong(body, accessToken) {
    const url = '/lists/DoiTuong/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaDoiTuong(Ma, accessToken) {
    const url = '/lists/DoiTuong/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ListNhomDoiTuong(accessToken) {
    const url = '/lists/DoiTuong/ListHelper_NhomDoiTuong'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListNhomGia(accessToken) {
    const url = '/lists/DoiTuong/ListHelper_NhomGia'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  GanNhomDoiTuong(body, accessToken) {
    const url = '/lists/DoiTuong/GanNhom'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  GanNhomGia(body, accessToken) {
    const url = '/lists/DoiTuong/GanNhomGia'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },

  // DanhMuc/NhomDoiTuong
  NhomDoiTuong(accessToken) {
    const url = '/lists/NhomDoiTuong/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoNhomDoiTuong(Ma, accessToken) {
    const url = '/lists/NhomDoiTuong/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemNhomDoiTuong(body, accessToken) {
    const url = '/lists/NhomDoiTuong/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaNhomDoiTuong(body, accessToken) {
    const url = '/lists/NhomDoiTuong/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaNhomDoiTuong(Ma, accessToken) {
    const url = '/lists/NhomDoiTuong/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },

  // DanhMuc/NhomHang
  NhomHang(accessToken) {
    const url = '/lists/NhomHang/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoNhomHang(Ma, accessToken) {
    const url = '/lists/NhomHang/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemNhomHang(body, accessToken) {
    const url = '/lists/NhomHang/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaNhomHang(body, accessToken) {
    const url = '/lists/NhomHang/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaNhomHang(Ma, accessToken) {
    const url = '/lists/NhomHang/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },

  // DanhMuc/HangMucThu
  HangMucThu(accessToken) {
    const url = '/lists/HangMucThu/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoHangMucThu(Ma, accessToken) {
    const url = '/lists/HangMucThu/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemHangMucThu(body, accessToken) {
    const url = '/lists/HangMucThu/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaHangMucThu(body, accessToken) {
    const url = '/lists/HangMucThu/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaHangMucThu(Ma, accessToken) {
    const url = '/lists/HangMucThu/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },

  // DanhMuc/HangMucChi
  HangMucChi(accessToken) {
    const url = '/lists/HangMucChi/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoHangMucChi(Ma, accessToken) {
    const url = '/lists/HangMucChi/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemHangMucChi(body, accessToken) {
    const url = '/lists/HangMucChi/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaHangMucChi(body, accessToken) {
    const url = '/lists/HangMucChi/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaHangMucChi(Ma, accessToken) {
    const url = '/lists/HangMucChi/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  // XuLy/BinhQuanXuatKho
  BinhQuanXuatKhoList(accessToken) {
    const url = '/processes/GiaXuatKho/ListHelper_Thang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  BinhQuanXuatKhoList_HangHoa(accessToken) {
    const url = '/processes/GiaXuatKho/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  TinhBinhQuanXuatKhoList(Thang_YYYYMM, accessToken) {
    const url = '/processes/GiaXuatKho/TinhGiaBinhQuanThang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Thang_YYYYMM }, { headers })
  },
  // XuLy/Duyệt phiếu xuất chuyển kho
  ListChuaDuyet(accessToken) {
    const url = '/processes/DuLieuXuatChuyenKhoChuaDuyet/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  DuyetPhieuXuLy(SoChungTu, accessToken) {
    const url = '/processes/DuLieuXuatChuyenKhoChuaDuyet/DuyetPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  // TruyVan/NhapXuatTonKho
  InfoNXTTheoKho(body, accessToken) {
    const url = '/inquiries/NhapXuatTon/TheoKho'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  InfoNXTTheoKho_DVTQD(body, accessToken) {
    const url = '/inquiries/NhapXuatTon/TheoKho_DVTQuyDoi'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  InfoNXTTongKho(body, accessToken) {
    const url = '/inquiries/NhapXuatTon/TongKho'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  InfoNXTTongKho_DVTQD(body, accessToken) {
    const url = '/inquiries/NhapXuatTon/TongKho_DVTQuyDoi'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListNhomHangNXT(accessToken) {
    const url = '/inquiries/NhapXuatTon/ListHelper_NhomHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaNXT(accessToken) {
    const url = '/inquiries/NhapXuatTon/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListKhoHangNXT(accessToken) {
    const url = '/inquiries/NhapXuatTon/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListQuayTinhTien(accessToken) {
    const url = '/inquiries/DoanhSo/ListHelper_QuayTinhTien'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  // DoanhSo/ DoanhSoBanHangKho
  InfoBSDHKHO(body, accessToken) {
    const url = '/inquiries/DoanhSo/KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  InfoBSDHQuay(body, accessToken) {
    const url = '/inquiries/DoanhSo/Quay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  // DoanhSo/ DoanhSoBanHangKho
  InfoSoQuy(body, accessToken) {
    const url = '/inquiries/SoQuyTienMat/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  // DuLieu/DLTK/PhieuNDC
  GetDataNDC(body, accessToken) {
    const url = '/entries/DuLieuNDC/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  NDCView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuNDC/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  NDCInfoEdit(SoChungTu, accessToken) {
    const url = '/entries/DuLieuNDC/ThongTinSua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  NDCCreate(body, accessToken) {
    const url = '/entries/DuLieuNDC/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  NDCEdit(body, accessToken) {
    const url = '/entries/DuLieuNDC/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  NDCDelete(SoChungTu, accessToken) {
    const url = '/entries/DuLieuNDC/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  NDCPrint(body, accessToken) {
    const url = '/entries/DuLieuNDC/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuNDC(body, accessToken) {
    const url = '/entries/DuLieuNDC/ListHelper_ChungTuTheoNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListKhoHangNDC(accessToken) {
    const url = '/entries/DuLieuNDC/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaNDC(body, accessToken) {
    const url = '/entries/DuLieuNDC/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },

  // DuLieu/DCTK/PhieuLapRap
  GetDataPLR(body, accessToken) {
    const url = '/entries/DuLieuPLR/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  PLRView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuPLR/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  PLRInfoEdit(SoChungTu, accessToken) {
    const url = '/entries/DuLieuPLR/ThongTinSua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  PLRCreate(body, accessToken) {
    const url = '/entries/DuLieuPLR/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  PLREdit(body, accessToken) {
    const url = '/entries/DuLieuPLR/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  PLRDel(SoChungTu, accessToken) {
    const url = '/entries/DuLieuPLR/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  PLRPrint(body, accessToken) {
    const url = '/entries/DuLieuPLR/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  PLRPrintNhap(body, accessToken) {
    const url = '/entries/DuLieuPLR/InPhieuNhap'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  PLRPrintXuat(body, accessToken) {
    const url = '/entries/DuLieuPLR/InPhieuXuat'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuPLR(body, accessToken) {
    const url = '/entries/DuLieuPLR/ListHelper_ChungTuTheoNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListKhoHangPLR(accessToken) {
    const url = '/entries/DuLieuPLR/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaPLR(accessToken) {
    const url = '/entries/DuLieuPLR/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },

  // DuLieu/DLTK/PhieuXDC
  GetDataXDC(body, accessToken) {
    const url = '/entries/DuLieuXDC/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XDCView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXDC/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XDCCreate(body, accessToken) {
    const url = '/entries/DuLieuXDC/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XDCEdit(body, accessToken) {
    const url = '/entries/DuLieuXDC/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XDCDelete(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXDC/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XDCPrint(body, accessToken) {
    const url = '/entries/DuLieuXDC/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuXDC(body, accessToken) {
    const url = '/entries/DuLieuXDC/ListHelper_ChungTuTheoNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListKhoHangXDC(accessToken) {
    const url = '/entries/DuLieuXDC/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaXDC(accessToken) {
    const url = '/entries/DuLieuXDC/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },

  // DuLieu/DLTK/PhieuXCK
  GetDataXCK(body, accessToken) {
    const url = '/entries/DuLieuXCK/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XCKView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXCK/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XCKCreate(body, accessToken) {
    const url = '/entries/DuLieuXCK/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XCKEdit(body, accessToken) {
    const url = '/entries/DuLieuXCK/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XCKInfoEdit(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXCK/ThongTinSua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XCKDelete(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXCK/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XCKPrint(body, accessToken) {
    const url = '/entries/DuLieuXCK/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuXCK(body, accessToken) {
    const url = '/entries/DuLieuXCK/ListHelper_ChungTuTheoNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListKhoHangXCK(accessToken) {
    const url = '/entries/DuLieuXCK/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaXCK(body, accessToken) {
    const url = '/entries/DuLieuXCK/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },

  // DuLieu/DLTK/PhieuNCK
  GetDataNCK(body, accessToken) {
    const url = '/entries/DuLieuNCK/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  NCKView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuNCK/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  NCKDelete(SoChungTu, accessToken) {
    const url = '/entries/DuLieuNCK/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  NCKPrint(body, accessToken) {
    const url = '/entries/DuLieuNCK/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuNCK(body, accessToken) {
    const url = '/entries/DuLieuNCK/ListHelper_ChungTuTheo'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChuaDuyetNCK(accessToken) {
    const url = '/entries/DuLieuNCK/ListHelper_DanhSachChuaDuyet'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  DuyetPhieuNCK(SoChungTu, accessToken) {
    const url = '/entries/DuLieuNCK/DuyetPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },

  // DuLieu/DLTK/PhieuXSD
  GetDataXSD(body, accessToken) {
    const url = '/entries/DuLieuXSD/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XSDView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXSD/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XSDInfoEdit(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXSD/ThongTinSua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XSDCreate(body, accessToken) {
    const url = '/entries/DuLieuXSD/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XSDEdit(body, accessToken) {
    const url = '/entries/DuLieuXSD/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XSDDelete(SoChungTu, accessToken) {
    const url = '/entries/DuLieuXSD/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  XSDPrint(body, accessToken) {
    const url = '/entries/DuLieuXSD/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuXSD(body, accessToken) {
    const url = '/entries/DuLieuXSD/ListHelper_ChungTuTheoNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListKhoHangXSD(accessToken) {
    const url = '/entries/DuLieuXSD/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaXSD(body, accessToken) {
    const url = '/entries/DuLieuXSD/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },

  // DuLieu/DLTK/PhieuHUY
  GetDataHUY(body, accessToken) {
    const url = '/entries/DuLieuHUY/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  HUYView(SoChungTu, accessToken) {
    const url = '/entries/DuLieuHUY/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  HUYInfoEdit(SoChungTu, accessToken) {
    const url = '/entries/DuLieuHUY/ThongTinSua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  HUYCreate(body, accessToken) {
    const url = '/entries/DuLieuHUY/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  HUYEdit(body, accessToken) {
    const url = '/entries/DuLieuHUY/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  HUYDelete(SoChungTu, accessToken) {
    const url = '/entries/DuLieuHUY/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { SoChungTu }, { headers })
  },
  HUYPrint(body, accessToken) {
    const url = '/entries/DuLieuHUY/InPhieu'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListChungTuHUY(body, accessToken) {
    const url = '/entries/DuLieuHUY/ListHelper_ChungTuTheoNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListKhoHangHUY(accessToken) {
    const url = '/entries/DuLieuHUY/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHangHoaHUY(accessToken) {
    const url = '/entries/DuLieuHUY/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  // ThietLap/KhoHang
  KhoHang(accessToken) {
    const url = '/settings/KhoHang/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoKhoHang(Ma, accessToken) {
    const url = '/settings/KhoHang/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemKhoHang(body, accessToken) {
    const url = '/settings/KhoHang/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaKhoHang(body, accessToken) {
    const url = '/settings/KhoHang/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaKhoHang(Ma, accessToken) {
    const url = '/settings/KhoHang/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },

  // ThietLap/QuanLy
  QuanLy(accessToken) {
    const url = '/settings/QuanLy/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoQuanLy(Ma, accessToken) {
    const url = '/settings/QuanLy/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemQuanLy(body, accessToken) {
    const url = '/settings/QuanLy/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaQuanLy(body, accessToken) {
    const url = '/settings/QuanLy/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaQuanLy(Ma, accessToken) {
    const url = '/settings/QuanLy/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  InTheQuanLy(Ma, accessToken) {
    const url = '/settings/QuanLy/InThe'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ListHelper_NguoiDung(accessToken) {
    const url = '/settings/QuanLy/ListHelper_NguoiDung'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  // ThietLap/QuayTinhTien
  QuayTinhTien(accessToken) {
    const url = '/settings/QuayTinhTien/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoQuayTinhTien(Ma, accessToken) {
    const url = '/settings/QuayTinhTien/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ThemQuayTinhTien(body, accessToken) {
    const url = '/settings/QuayTinhTien/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaQuayTinhTien(body, accessToken) {
    const url = '/settings/QuayTinhTien/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaQuayTinhTien(Ma, accessToken) {
    const url = '/settings/QuayTinhTien/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
  ListHelper_NhomGia(accessToken) {
    const url = '/settings/QuayTinhTien/ListHelper_NhomGia'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHelper_Kho(accessToken) {
    const url = '/settings/QuayTinhTien/ListHelper_KhoHang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  // ThietLap/PhanCa
  PhanCa(accessToken) {
    const url = '/settings/PhanCa/DanhSach'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  PhanCaFull(accessToken) {
    const url = '/settings/PhanCa/DanhSachFull'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  InfoPhanCa(body, accessToken) {
    const url = '/settings/PhanCa/ThongTin'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ThemPhanCa(body, accessToken) {
    const url = '/settings/PhanCa/Them'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  SuaPhanCa(body, accessToken) {
    const url = '/settings/PhanCa/Sua'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  XoaPhanCa(body, accessToken) {
    const url = '/settings/PhanCa/Xoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, body, { headers })
  },
  ListHelperPC_NguoiDung(accessToken) {
    const url = '/settings/PhanCa/ListHelper_NguoiDung'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHelperPC_QuayTinhTien(accessToken) {
    const url = '/settings/PhanCa/ListHelper_QuayTinhTien'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHelperPC_CaLamViec(accessToken) {
    const url = '/settings/PhanCa/ListHelper_CaLamViec'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  // Hethong/PhanQuyen
  ThongKeQuyenHan(accessToken) {
    const url = '/settings/PhanQuyen/ThongKeQuyenHan'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  DieuChinhQuyenHan(body, accessToken) {
    const url = '/settings/PhanQuyen/DieuChinhQuyenHan'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { body }, { headers })
  },
  ListHelperPhanQuyen_NguoiDung(accessToken) {
    const url = '/settings/PhanQuyen/ListHelper_NguoiDung'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ListHelperPhanQuyen_ChucNang(accessToken) {
    const url = '/settings/PhanQuyen/ListHelper_ChucNang'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  // Hethong/KhoanNgay
  KhoanNgay(accessToken) {
    const url = '/settings/GiaTriHeThong/KhoanNgay'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  ThongSo(accessToken) {
    const url = '/settings/GiaTriHeThong/ThongSo'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
  },
  QuyenHan(Ma, accessToken) {
    const url = '/settings/GiaTriHeThong/ChucNang_QuyenHan'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, { Ma }, { headers })
  },
}

export default categoryAPI
