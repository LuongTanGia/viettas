import { Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { memo, useEffect, useState } from "react";
import icons from "../../untils/icons";
import { NavLink } from "react-router-dom";

const { BiCategory, MdQueryStats, BsDatabase, SiGithubactions } = icons;

const recursiveSubMenu = (data, parentKey) => {
  return data
    .filter((item) => item.NhomChucNang === parentKey)
    .map((item) => {
      const hasChildren = data.some(
        (subItem) => subItem.NhomChucNang === item.MaChucNang
      );
      return hasChildren ? (
        <Menu.SubMenu
          key={item.SapXep}
          title={item.TenChucNang}
          style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}
        >
          {recursiveSubMenu(data, item.MaChucNang)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={item.SapXep}
          className="menu_itemk"
          // style={{ maxHeight: 30 ,}}
        >
          <NavLink to={item.MaChucNang}>{item.TenChucNang} </NavLink>
        </Menu.Item>
      );
    });
};

const MenuList = () => {
  const [dataLogin, setDataLogin] = useState(null);

  useEffect(() => {
    const getDataLogIn = () => {
      const storedData = localStorage.getItem("datalogin");
      const datalogin = storedData ? JSON.parse(storedData) : null;
      setDataLogin(datalogin);
    };
    getDataLogIn();
  }, []);

  return (
    <Menu
      theme="light"
      className="menulist"
      style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}
    >
      <Menu.Item key="tonghop" icon={<HomeOutlined />}>
        <NavLink to={""}> Tổng hợp</NavLink>
      </Menu.Item>

      {/* DanhMuc */}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "DanhMuc" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<BiCategory />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "DanhMuc")}
            </Menu.SubMenu>
          )
      )}
      {/* TruyVan */}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "TruyVan" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<MdQueryStats />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "TruyVan")}
            </Menu.SubMenu>
          )
      )}
      {/*  DuLieu*/}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "DuLieu" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<BsDatabase />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "DuLieu")}
            </Menu.SubMenu>
          )
      )}
      {/*  XuLy*/}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "XuLy" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<HomeOutlined />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "XuLy")}
            </Menu.SubMenu>
          )
      )}

      {/* ThietLap */}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "ThietLap" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<SiGithubactions />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "ThietLap")}
            </Menu.SubMenu>
          )
      )}
      {/* HeThong */}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "HeThong" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<HomeOutlined />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "HeThong")}
            </Menu.SubMenu>
          )
      )}
      {/* BaoCao */}
      {dataLogin?.map(
        (item) =>
          item.MaChucNang === "BaoCao" && (
            <Menu.SubMenu
              key={item.SapXep}
              icon={<HomeOutlined />}
              title={item.TenChucNang}
            >
              {recursiveSubMenu(dataLogin, "BaoCao")}
            </Menu.SubMenu>
          )
      )}
    </Menu>
  );
};

export default memo(MenuList);
