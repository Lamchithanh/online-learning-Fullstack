// Users.js
import React, { useState, useMemo } from "react";
import { Table, Button, Modal, Form, Input, Select, Spin, message } from "antd";
import axios from "axios";
import { useDataFetching } from "../UseDataFetching/useDataFetching";

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

    return (
        <div>
            <Button
                onClick={() => setIsUserModalVisible(true)}
                style={{ marginBottom: 16 }}
            >
                Add New User
            </Button>
            <Spin spinning={usersLoading}>
                <Table columns={userColumns} dataSource={users} rowKey="id" />
            </Spin>

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
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

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
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;
