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

  // TruyVan/NhapXuatTonKho
  InfoNXTTheoKho(body, accessToken) {
    const url = '/inquiries/NhapXuatTon/TheoKho'
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
  ListHangHoaNDC(accessToken) {
    const url = '/entries/DuLieuNDC/ListHelper_HangHoa'
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    return axiosClient.post(url, {}, { headers })
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
