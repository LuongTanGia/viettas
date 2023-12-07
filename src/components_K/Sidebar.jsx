import React, { memo, useEffect, useState } from "react";
import { Layout } from "antd";
import MenuList from "./antDesign/MenuList";

const { Header, Sider } = Layout;

const Sidebar = ({ setIsCollapsed, isCollapsed }) => {
  return (
    <Layout>
      <Sider
        collapsed={isCollapsed}
        collapsible
        trigger={null}
        className="sider"
      >
        <MenuList />
      </Sider>
    </Layout>
  );
};

export default memo(Sidebar);
