// Users.js
import React, { useState, useMemo } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Spin,
    message,
    Switch,
} from "antd"; // Thêm Switch để khóa/mở khóa tài khoản
import axios from "axios";
import { useDataFetching } from "../UseDataFetching/useDataFetching";
import Loader from "../../../../client/src/context/Loader";

const { Option } = Select;

const Users = ({ fetchUsers }) => {
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isUserEditModalVisible, setIsUserEditModalVisible] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [userForm] = Form.useForm();

    const {
        data: users,
        loading: usersLoading,
        setData: setUsers,
    } = useDataFetching(fetchUsers, "Unable to load users");

    const addUser = async (values) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:9000/api/users", values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("User added successfully");
            setIsUserModalVisible(false);
            userForm.resetFields();
            setUsers(await fetchUsers());
        } catch (error) {
            console.error("Error adding user:", error);
            message.error("Unable to add user");
        }
    };

    const editUser = async (values) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:9000/api/users/${userToEdit.id}`,
                values,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            message.success("User updated successfully");
            setIsUserEditModalVisible(false);
            userForm.resetFields();
            setUsers(await fetchUsers());
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Unable to update user");
        }
    };

    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:9000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("User deleted successfully");
            setUsers(await fetchUsers());
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Unable to delete user");
        }
    };

    const userColumns = useMemo(
        () => [
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Username", dataIndex: "username", key: "username" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Role", dataIndex: "role", key: "role" },
            {
                title: "Registered Courses",
                dataIndex: "registeredCourses",
                key: "registeredCourses",
            },
            { title: "Progress", dataIndex: "progress", key: "progress" },
            {
                title: "Certificates",
                dataIndex: "certificates",
                key: "certificates",
            },
            {
                title: "Account Locked",
                dataIndex: "isLocked",
                key: "isLocked",
                render: (text, record) => (
                    <Switch
                        checked={record.isLocked}
                        onChange={() =>
                            toggleAccountLock(record.id, !record.isLocked)
                        }
                    />
                ),
            },
            {
                title: "Action",
                key: "action",
                render: (_, record) => (
                    <>
                        <Button
                            onClick={() => {
                                setUserToEdit(record);
                                setIsUserEditModalVisible(true);
                                userForm.setFieldsValue(record);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => deleteUser(record.id)}
                            style={{ marginLeft: 8 }}
                        >
                            Delete
                        </Button>
                    </>
                ),
            },
        ],
        []
    );

    const toggleAccountLock = async (userId, isLocked) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:9000/api/users/${userId}/lock`,
                { isLocked },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            message.success(
                `User account ${isLocked ? "locked" : "unlocked"} successfully`
            );
            setUsers(await fetchUsers());
        } catch (error) {
            console.error("Error updating account lock status:", error);
            message.error("Unable to update account lock status");
        }
    };

    return (
        <div>
            <Button
                onClick={() => setIsUserModalVisible(true)}
                style={{ marginBottom: 16 }}
            >
                Add New User
            </Button>
            {usersLoading ? <Loader /> :<Table columns={userColumns} dataSource={users} rowKey="id" />}
                
         
            {/* Modal thêm người dùng */}
            <Modal
                title="Add New User"
                visible={isUserModalVisible}
                onOk={() => userForm.submit()}
                onCancel={() => setIsUserModalVisible(false)}
            >
                <Form form={userForm} layout="vertical" onFinish={addUser}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: "Please input the username!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please input the email!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input the password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[
                            {
                                required: true,
                                message: "Please select the role!",
                            },
                        ]}
                    >
                        <Select>
                            <Option value="student">Student</Option>
                            <Option value="instructor">Instructor</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chỉnh sửa người dùng */}
            <Modal
                title="Edit User"
                visible={isUserEditModalVisible}
                onOk={() => userForm.submit()}
                onCancel={() => setIsUserEditModalVisible(false)}
            >
                <Form form={userForm} layout="vertical" onFinish={editUser}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: "Please input the username!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please input the email!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[
                            {
                                required: true,
                                message: "Please select the role!",
                            },
                        ]}
                    >
                        <Select>
                            <Option value="student">Student</Option>
                            <Option value="instructor">Instructor</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;
