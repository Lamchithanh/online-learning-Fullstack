import React, { useEffect, useState } from "react";
import { Card, Descriptions, Alert } from "antd";
import { fetchUserProfile } from "../../../../server/src/api";

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetchUserProfile();
                setUser(response.user);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setError(
                    "Không thể tải thông tin người dùng. Vui lòng thử lại sau."
                );
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    if (error) {
        return (
            <Alert message="Lỗi" description={error} type="error" showIcon />
        );
    }

    if (!user) {
        return (
            <Alert
                message="Thông báo"
                description="Không tìm thấy thông tin người dùng. Vui lòng kiểm tra lại kết nối hoặc liên hệ hỗ trợ."
                type="warning"
                showIcon
            />
        );
    }

    return (
        <Card title="Thông tin người dùng">
            <Descriptions layout="vertical" bordered>
                <Descriptions.Item label="Tên người dùng">
                    {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                    {user.role === "admin"
                        ? "Quản trị viên"
                        : user.role === "instructor"
                        ? "Giảng viên"
                        : "Học viên"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {new Date(user.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">
                    {new Date(user.updatedAt).toLocaleString()}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default UserInfo;
