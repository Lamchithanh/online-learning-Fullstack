import React, { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
} from "antd";
import { UserOutlined, BookOutlined } from "@ant-design/icons";
import axios from "axios";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const AdminDashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState("users");
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isUserEditModalVisible, setIsUserEditModalVisible] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [userForm] = Form.useForm();
    const [courseForm] = Form.useForm();

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:9000/api/users",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Unable to load users");
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(
                "http://localhost:9000/api/courses"
            );
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            message.error("Unable to load courses");
        }
    };

    const addUser = async (values) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:9000/api/users", values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("User added successfully");
            setIsUserModalVisible(false);
            userForm.resetFields();
            fetchUsers();
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
            fetchUsers();
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
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Unable to delete user");
        }
    };

    const userColumns = [
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
    ];

    const courseColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Title", dataIndex: "title", key: "title" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Level", dataIndex: "level", key: "level" },
        { title: "Category", dataIndex: "category", key: "category" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            // Implement course edit functionality
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => {
                            // Implement course delete functionality
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["users"]}
                    onClick={({ key }) => setSelectedMenu(key)}
                >
                    <Menu.Item key="users" icon={<UserOutlined />}>
                        Users
                    </Menu.Item>
                    <Menu.Item key="courses" icon={<BookOutlined />}>
                        Courses
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: 0 }}>
                    <Button
                        style={{ float: "right", margin: "16px" }}
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </Button>
                    <h2 style={{ margin: "0 16px" }}>Admin Dashboard</h2>
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        background: "#fff",
                    }}
                >
                    {selectedMenu === "users" && (
                        <>
                            <Button
                                onClick={() => setIsUserModalVisible(true)}
                                style={{ marginBottom: 16 }}
                            >
                                Add New User
                            </Button>
                            <Table
                                columns={userColumns}
                                dataSource={users}
                                rowKey="id"
                            />
                        </>
                    )}
                    {selectedMenu === "courses" && (
                        <>
                            <Button
                                onClick={() => setIsCourseModalVisible(true)}
                                style={{ marginBottom: 16 }}
                            >
                                Add New Course
                            </Button>
                            <Table
                                columns={courseColumns}
                                dataSource={courses}
                                rowKey="id"
                            />
                        </>
                    )}
                </Content>
            </Layout>

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

            {/* Implement Course Modal here */}
        </Layout>
    );
};

export default AdminDashboard;
