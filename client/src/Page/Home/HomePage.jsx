import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, theme, Card } from "antd"; // Thêm Card từ Ant Design
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import "./HomePage.scss"; // Import file SCSS

const { Header, Content, Sider } = Layout;

const HomePage = () => {
    const [courses, setCourses] = useState([]); // Trạng thái để lưu trữ danh sách khóa học
    const [loading, setLoading] = useState(true); // Trạng thái để kiểm soát việc tải

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/courses"
                );
                const data = await response.json();
                setCourses(data); // Cập nhật trạng thái với danh sách khóa học
                setLoading(false); // Đặt trạng thái loading thành false khi hoàn tất
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu khóa học:", error);
                setLoading(false); // Đảm bảo trạng thái loading được đặt thành false ngay cả khi có lỗi
            }
        };

        fetchCourses();
    }, []); // Chạy một lần khi component được mount

    // Dữ liệu cho menu chính
    // const menuNames = ["Trang chủ", "Danh sách khóa học", "Liên hệ"];

    // const items1 = ["1", "2", "3"].map((key, index) => ({
    //     key,
    //     label: menuNames[index],
    // }));

    // Dữ liệu cho menu bên trái
    const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
        (icon, index) => {
            const key = String(index + 1);
            const menuLabels = ["Tài khoản", "Khóa học", "Thông báo"];
            const submenuLabels = {
                0: [
                    "Thông tin cá nhân",
                    "Đổi mật khẩu",
                    "Khóa học của tôi",
                    "Cài đặt tài khoản",
                ], // Tài khoản
                1: ["Khóa học của tôi", "Khóa học mới", "Khóa học yêu thích"], // Khóa học
                2: ["Thông báo mới", "Thông báo quan trọng", "Thông báo khác"], // Thông báo
            };
            return {
                key: `sub${key}`,
                icon: React.createElement(icon),
                label: menuLabels[index], // Thay đổi label thành "Tài khoản", "Khóa học", "Thông báo"
                children: submenuLabels[index]
                    ? submenuLabels[index].map((label, j) => {
                          const subKey = index * 4 + j + 1;
                          return {
                              key: subKey,
                              label, // Use the label from the submenuLabels array
                          };
                      })
                    : [], // Trả về một mảng rỗng nếu submenuLabels[index] là undefined
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
                                title: "Trang chủ",
                            },
                        ]}
                    />
                    <Content className="content">
                        {loading ? ( // Hiển thị loading nếu đang tải
                            <div>Đang tải khóa học...</div>
                        ) : (
                            <div className="course-list">
                                {courses.map((course) => (
                                    <Card
                                        key={course.id}
                                        cover={
                                            <img
                                                alt={course.title}
                                                src="https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png"
                                            />
                                        } // Thêm hình ảnh vào card
                                        style={{ marginBottom: "16px" }}
                                    >
                                        <h5>{course.title}</h5>
                                        <p>{course.description}</p>
                                        <p>Giá: ${course.price}</p>
                                        <p>Trình độ: {course.level}</p>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default HomePage;
