import React, { useState } from "react";
import { Table, Button, Spin, Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useDataFetching } from "../UseDataFetching/useDataFetching";

const { Option } = Select;

const Courses = ({ fetchCourses }) => {
    const {
        data: courses,
        loading: coursesLoading,
        setData: setCourses,
    } = useDataFetching(fetchCourses, "Unable to load courses");

    const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
    const [isCourseEditModalVisible, setIsCourseEditModalVisible] =
        useState(false);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const [courseForm] = Form.useForm();

    const addCourse = async (values) => {
        console.log("Adding course with values:", values);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:9000/api/courses",
                values,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            message.success("Course added successfully");

            setIsCourseModalVisible(false);
            courseForm.resetFields();

            console.log("Modal visibility status:", isCourseModalVisible); // Kiểm tra trạng thái
            setCourses((prevCourses) => [...prevCourses, response.data]);
        } catch (error) {
            console.error("Error adding course:", error);
            message.error("Unable to add course");
        }
    };

    const editCourse = async (values) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:9000/api/courses/${courseToEdit.id}`,
                values,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            message.success("Course updated successfully");
            setIsCourseEditModalVisible(false);
            courseForm.resetFields();
            // Cập nhật state courses với khóa học đã được sửa
            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course.id === courseToEdit.id ? response.data : course
                )
            );
        } catch (error) {
            console.error("Error updating course:", error);
            message.error("Unable to update course");
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `http://localhost:9000/api/courses/${courseId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            message.success("Course deleted successfully");
            // Cập nhật state courses bằng cách loại bỏ khóa học đã xóa
            setCourses((prevCourses) =>
                prevCourses.filter((course) => course.id !== courseId)
            );
        } catch (error) {
            console.error("Error deleting course:", error);
            message.error("Unable to delete course");
        }
    };

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
                            setCourseToEdit(record);
                            setIsCourseEditModalVisible(true);
                            courseForm.setFieldsValue(record);
                            console.log("Editing course:", record);
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

    return (
        <Spin spinning={coursesLoading}>
            <Button
                onClick={() => setIsCourseModalVisible(true)}
                style={{ marginBottom: 16 }}
            >
                Add New Course
            </Button>
            <Table columns={courseColumns} dataSource={courses} rowKey="id" />

            <Modal
                title="Add New Course"
                visible={isCourseModalVisible}
                onOk={() => courseForm.submit()}
                onCancel={() => setIsCourseModalVisible(false)}
            >
                <Form form={courseForm} layout="vertical" onFinish={addCourse}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: "Please input the course title!",
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
                                message: "Please input the course description!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: "Please input the course price!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[
                            {
                                required: true,
                                message: "Please select the course level!",
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
                                message: "Please input the course category!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Course"
                visible={isCourseEditModalVisible}
                onOk={() => courseForm.submit()}
                onCancel={() => setIsCourseEditModalVisible(false)}
            >
                <Form form={courseForm} layout="vertical" onFinish={editCourse}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: "Please input the course title!",
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
                                message: "Please input the course description!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: "Please input the course price!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[
                            {
                                required: true,
                                message: "Please select the course level!",
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
                                message: "Please input the course category!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
};

export default Courses;
