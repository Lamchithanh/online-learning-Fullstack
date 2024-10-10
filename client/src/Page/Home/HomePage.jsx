import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, theme, Card, message } from "antd";
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./HomePage.scss";
import Loader from "../../context/Loader";
import { fetchCourses } from "../../../../server/src/api"; // Đường dẫn tới file API

const { Content, Sider } = Layout;

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const courses = await fetchCourses();
                setCourses(courses);
            } catch (err) {
                console.error("Lỗi khi tải danh sách khóa học:", err);
                setError(
                    "Lỗi khi tải danh sách khóa học. Vui lòng thử lại sau."
                );
                message.error(
                    "Lỗi khi tải danh sách khóa học. Vui lòng thử lại sau."
                );
            }
        };

        fetchCoursesData();
    }, []);

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
        (icon, index) => {
            const key = String(index + 1);
            const menuLabels = ["Tài khoản", "Khóa học", "Thông báo"];
            const submenuLabels = {
                0: [
                    { label: "Thông tin cá nhân", path: "user-info" },
                    { label: "Đổi mật khẩu", path: "change-password" },
                    { label: "Khóa học của tôi", path: "my-courses" },
                    { label: "Cài đặt tài khoản", path: "account-settings" },
                ],
                1: [
                    { label: "Khóa học của tôi", path: "my-courses" },
                    { label: "Khóa học mới", path: "/" },
                    { label: "Khóa học yêu thích", path: "/" },
                ],
                2: [
                    { label: "Thông báo mới", path: "/" },
                    { label: "Thông báo quan trọng", path: "/" },
                    { label: "Thông báo khác", path: "/" },
                ],
            };
            return {
                key: `sub${key}`,
                icon: React.createElement(icon),
                label: menuLabels[index],
                children: submenuLabels[index]
                    ? submenuLabels[index].map((item, j) => {
                          const subKey = index * 4 + j + 1;
                          return {
                              key: subKey,
                              label: item.label,
                              onClick: () => handleMenuClick(item.path),
                          };
                      })
                    : [],
            };
        }
    );

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const renderHomeContent = () => {
        if (loading) {
            return <Loader />;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        return (
            <div className="course-list">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        cover={
                            <img
                                alt={course.title}
                                src="https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png"
                            />
                        }
                        style={{ marginBottom: "16px" }}
                    >
                        <h5>{course.title}</h5>
                        <p>{course.description}</p>
                        <p>Price: ${course.price}</p>
                        <p>Level: {course.level}</p>
                    </Card>
                ))}
            </div>
        );
    };

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
                                title: "Trang chủ",
                            },
                        ]}
                    />
                    <Content className="content">
                        {location.pathname === "/" ? (
                            renderHomeContent()
                        ) : (
                            <Outlet />
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default HomePage;
