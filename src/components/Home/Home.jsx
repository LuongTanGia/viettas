import { Layout, Space } from "antd";
const { Header, Footer, Content } = Layout;
import SiderMenu from "../SiderMenu/SiderMenu";
import MainPage from "../MainPage/MainPage";
import { useState } from "react";

const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
};

const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#7dbcea",
};
function Home() {
    const [isNavi, setIsNavi] = useState(true);
    return (
        <>
            <Space
                direction="vertical"
                style={{
                    width: "100%",
                }}
                size={[0, 48]}
            >
                <Layout style={{ minHeight: "100vh" }}>
                    <SiderMenu isNavi={isNavi} />

                    <Layout
                        style={
                            isNavi
                                ? {
                                      marginLeft: "200px",
                                      transition: "all 0.3s",
                                  }
                                : { marginLeft: "80px", transition: "all 0.3s" }
                        }
                    >
                        <Header style={headerStyle}>
                            <span
                                className="icon_show"
                                onClick={() => {
                                    setIsNavi(!isNavi);
                                }}
                            >
                                onclick
                            </span>
                        </Header>
                        <Content>
                            <MainPage />
                        </Content>
                        <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
                </Layout>
            </Space>
        </>
    );
}
export default Home;
