const db = require("../config/db");

const createCourse = async (req, res) => {
    const { title, description } = req.body;
    const course = await db.execute(
        `INSERT INTO courses (title, description) VALUES (?, ?)`,
        [title, description]
    );
    res.send("Tạo khóa học thành công!");
};

const getCourses = async (req, res) => {
    const courses = await db.execute("SELECT * FROM courses");
    res.send(courses);
};

module.exports = { createCourse, getCourses };
