import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { dataSelector } from "../../redux/selector";

const SiderMenu = () => {
  const data = useSelector(dataSelector);
  const [string] = useState([]);
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link " to="/">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            data-bs-target="#icons-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-gem"></i>
            <span>F.A.Q</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </Link>
          <ul
            id="icons-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/FAQ">
                <i className="bi bi-circle"></i>
                <span>Chính sách bảo mật</span>
              </Link>
            </li>
            <li>
              <Link to="/DKSD">
                <i className="bi bi-circle"></i>
                <span>Điều khoản và điều kiện sử dụng</span>
              </Link>
            </li>
          </ul>
        </li>
        {/* sidebar dataa */}
        {data.DataResults
          ? data.DataResults.map(
              (item, index) =>
                item.NhomChucNang === "10" && (
                  <li className="nav-item" key={index}>
                    <Link
                      className="nav-link collapsed "
                      data-bs-target={`#${item.MaChucNang}-nav`}
                      data-bs-toggle="collapse"
                    >
                      <i className="bi bi-menu-button-wide"></i>
                      <span>{item.TenChucNang}</span>
                      <i className="bi bi-chevron-down ms-auto ml-10 "></i>
                    </Link>
                    <ul
                      id={`${item.MaChucNang}-nav`}
                      className="nav-content collapse"
                      data-bs-parent="#sidebar-nav"
                    >
                      {data.DataResults.map((chir_data) =>
                        chir_data.NhomChucNang === item.MaChucNang ? (
                          <li
                            key={chir_data.MaChucNang}
                            className="submenu-item"
                          >
                            <Link
                              to={`/${
                                string.includes(chir_data.MaChucNang)
                                  ? "#!"
                                  : chir_data.MaChucNang
                              }`}
                            >
                              <i className="bi bi-circle"></i>
                              {chir_data.TenChucNang}
                            </Link>
                            <ul className="submenu_2">
                              {data.DataResults.map((chir_data_2) =>
                                chir_data_2.NhomChucNang ===
                                chir_data.MaChucNang
                                  ? string.push(chir_data.MaChucNang) && (
                                      <li
                                        key={chir_data_2.MaChucNang}
                                        className="submenu-item_2"
                                      >
                                        <Link
                                          className="lastTitle"
                                          to={`/${chir_data.MaChucNang}/${chir_data_2.MaChucNang}`}
                                          title={chir_data_2.TenChucNang}
                                        >
                                          <i className="bi bi-circle-fill"></i>
                                          {chir_data_2.TenChucNang}
                                        </Link>
                                      </li>
                                    )
                                  : null
                              )}
                            </ul>
                          </li>
                        ) : null
                      )}
                    </ul>
                  </li>
                )
            )
          : null}
      </ul>
    </aside>
  );
};
export default SiderMenu;
