import { useSelector } from "react-redux";
import { dataSelector } from "../../redux/selector";
import { Link } from "react-router-dom";
import { AlignLeftOutlined } from "@ant-design/icons";

import { Layout, Menu } from "antd";
// import { Link } from "react-router-dom";
const { Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const SiderMenu = (isNavi) => {
    console.log(isNavi);
    const data = useSelector(dataSelector);
    const dataSider = data.DataResults;

    const items = dataSider
        ? dataSider.map(
              (items) =>
                  items.NhomChucNang === "10" &&
                  getItem(
                      `${items.TenChucNang}`,
                      `${items.MaChucNang}`,
                      <AlignLeftOutlined />,
                      dataSider.map((item2) =>
                          item2.NhomChucNang === items.MaChucNang
                              ? getItem(
                                    `${item2.TenChucNang}`,
                                    `${item2.MaChucNang}`,
                                    <></>,
                                    dataSider.map((item3) =>
                                        item3.NhomChucNang === item2.MaChucNang
                                            ? getItem(
                                                  `${item3.TenChucNang}`,
                                                  `${item3.MaChucNang}`,
                                                  <Link
                                                      to={`/${item3.MaChucNang}`}
                                                  ></Link>
                                              )
                                            : null
                                    )
                                )
                              : null
                      )
                  )
          )
        : [getItem("Null", "1", <></>)];

    return (
        <Sider
            collapsible
            collapsed={!isNavi.isNavi}
            // onCollapse={(isNavi) => setCollapsed(isNavi)}
            style={{
                width: "400px",
                overflow: "auto",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                background: "#fff",
            }}
        >
            <div className="demo-logo-vertical" />
            <Menu
                theme="light"
                defaultSelectedKeys={["1"]}
                mode="inline"
                items={items}
            />
        </Sider>
    );
};
export default SiderMenu;
