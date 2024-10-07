import React from "react";
import { Layout, Menu, Breadcrumb, theme } from "antd";
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import "./HomePage.scss"; // Import file SCSS

const { Header, Content, Sider } = Layout;

const HomePage = () => {
    // Dữ liệu cho menu chính
    const items1 = ["1", "2", "3"].map((key) => ({
        key,
        label: `nav ${key}`,
    }));

    // Dữ liệu cho menu bên trái
    const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
        (icon, index) => {
            const key = String(index + 1);
            return {
                key: `sub${key}`,
                icon: React.createElement(icon),
                label: `subnav ${key}`,
                children: new Array(4).fill(null).map((_, j) => {
                    const subKey = index * 4 + j + 1;
                    return {
                        key: subKey,
                        label: `option${subKey}`,
                    };
                }),
            };
        }
    );

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Layout>
                <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
                        className="sider-menu"
                        items={items2}
                    />
                </Sider>
                <Layout
                    style={{
                        padding: "0 24px 24px",
                    }}
                >
                    <Breadcrumb
                        className="breadcrumb"
                        items={[
                            {
                                title: "Home",
                            },
                            {
                                title: "List",
                            },
                            {
                                title: "App",
                            },
                        ]}
                    />
                    <Content className="content">Content</Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default HomePage;
