import { useMemo, useState } from "react";

export const useSearch = (data) => {
  const [search, setSearch] = useState("");
  const filteredData = useMemo(() => {
    if (data)
      return data.filter((item) => {
        const {
          TenHang,
          MaHang,
          TenNhom,
          DVTKho,
          DienGiaiDVTQuyDoi,
          MaVach,
          NguoiTao,
          NguoiSuaCuoi,
        } = item || {};
        return (
          (TenHang || "").toLowerCase().includes(search.toLowerCase()) ||
          (MaHang || "").toLowerCase().includes(search.toLowerCase()) ||
          (TenNhom || "").toLowerCase().includes(search.toLowerCase()) ||
          (DVTKho || "").toLowerCase().includes(search.toLowerCase()) ||
          (DienGiaiDVTQuyDoi || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (MaVach || "").toLowerCase().includes(search.toLowerCase()) ||
          (NguoiTao || "").toLowerCase().includes(search.toLowerCase()) ||
          (NguoiSuaCuoi || "").toLowerCase().includes(search.toLowerCase())
        );
      });
    else return [];
  }, [search, data]);

  return [setSearch, filteredData];
};
