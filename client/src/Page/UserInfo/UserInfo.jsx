import React from "react";
import { Card, Descriptions } from "antd";

const UserInfo = () => {
    return (
        <Card title="Thông tin cá nhân">
            <Descriptions layout="vertical" bordered>
                <Descriptions.Item label="Tên người dùng">
                    Nguyễn Văn A
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    nguyenvana@example.com
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    0123456789
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">Hà Nội</Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default UserInfo;
