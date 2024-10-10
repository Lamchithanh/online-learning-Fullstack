// Courses.js
import React from "react";
import { Table, Button, Spin } from "antd";
import { useDataFetching } from "../UseDataFetching/useDataFetching";

const Courses = ({ fetchCourses }) => {
    const { data: courses, loading: coursesLoading } = useDataFetching(
        fetchCourses,
        "Unable to load courses"
    );

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
                    <Button>Edit</Button>
                    <Button style={{ marginLeft: 8 }}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <Spin spinning={coursesLoading}>
            <Table columns={courseColumns} dataSource={courses} rowKey="id" />
        </Spin>
    );
};

export default Courses;
