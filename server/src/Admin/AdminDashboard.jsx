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
    Upload,
    message,
} from "antd";
import {
    UserOutlined,
    BookOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const AdminDashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState("users");
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Kiểm tra lại token
            const response = await axios.get(
                "http://localhost:9000/api/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Response:", response); // Kiểm tra lại phản hồi
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Unable to load users");
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
            toast.error("Unable to load courses");
        }
    };

    const userColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Role", dataIndex: "role", key: "role" },
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
            render: (text, record) => (
                <>
                    <Button onClick={() => showLessonsModal(record)}>
                        Manage Lessons
                    </Button>
                    <Button
                        onClick={() => {
                            setIsEditModalVisible(true);
                            setCourseToEdit(record);
                            editForm.setFieldsValue(record);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => deleteCourse(record.id)}
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];
    //show users
    const showUserModal = () => {
        setIsUserModalVisible(true);
    };

    const showCoursesModal = () => {
        setIsModalVisible(true);
    };
    // Add new User
    const [userForm] = Form.useForm();
    const handleUserOk = () => {
        userForm
            .validateFields()
            .then((values) => {
                // Xử lý việc thêm người dùng mới
                console.log("Thêm người dùng mới:", values);
                setIsUserModalVisible(false);
                userForm.resetFields();
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };
    // Add new Course
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                // Here you would send the form data to your backend
                console.log("Form values:", values);
                toast.success("Course added successfully");
                setIsModalVisible(false);
                form.resetFields();
                fetchCourses(); // Refresh the courses list
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const showLessonsModal = (course) => {
        // Implement a modal to manage lessons and videos for the selected course
        console.log("Manage lessons for course:", course);
        // You would typically fetch lessons for this course and allow CRUD operations
    };

    const [editForm] = Form.useForm();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState({});

    const handleEditOk = () => {
        editForm
            .validateFields()
            .then((values) => {
                // Chuyển đổi giá trị price thành một số nguyên hoặc một số thập phân
                values.price = parseFloat(values.price);

                // Here you would send the form data to your backend
                console.log("Form values:", values);
                axios
                    .put(
                        `http://localhost:9000/api/courses/${courseToEdit.id}`,
                        values,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                        }
                    )
                    .then((response) => {
                        toast.success("Course edited successfully");
                        setIsEditModalVisible(false);
                        editForm.resetFields();
                        fetchCourses(); // Refresh the courses list
                    })
                    .catch((error) => {
                        console.error("Error editing course:", error);
                        toast.error("Unable to edit course");
                    });
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const deleteCourse = (courseId) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`http://localhost:9000/api/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                toast.success("Course deleted successfully");
                fetchCourses(); // Refresh the courses list
            })
            .catch((error) => {
                console.error("Error deleting course:", error);
                toast.error("Unable to delete course");
            });
    };

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
                        Đăng xuất
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
                                onClick={showUserModal}
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
                                onClick={showCoursesModal}
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
                title="Add New Course"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: "Please input the title!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: "Please input the description!",
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: "Please input the price!",
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[
                            {
                                required: true,
                                message: "Please select the level!",
                            },
                        ]}
                    >
                        <Select>
                            <Option value="beginner">Beginner</Option>
                            <Option value="intermediate">Intermediate</Option>
                            <Option value="advanced">Advanced</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: "Please input the category!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Course"
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: "Please input the title!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: "Please input the description!",
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: "Please input the price!",
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[
                            {
                                required: true,
                                message: "Please select the level!",
                            },
                        ]}
                    >
                        <Select>
                            <Option value="beginner">Beginner</Option>
                            <Option value="intermediate">Intermediate</Option>
                            <Option value="advanced">Advanced</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: "Please input the category!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Add New User"
                visible={isUserModalVisible}
                onOk={handleUserOk}
                onCancel={() => setIsUserModalVisible(false)}
            >
                <Form form={userForm} layout="vertical">
                    <Form.Item
                        name="username"
                        label="Tên người dùng"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên người dùng!",
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
                                message: "Vui lòng nhập email!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu!",
                            },
                        ]}
                    >
                        <Input type="password" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default AdminDashboard;
