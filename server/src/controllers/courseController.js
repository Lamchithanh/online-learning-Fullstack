const pool = require("../config/pool");

exports.getAllCourses = (req, res) => {
    pool.query("SELECT * FROM courses", (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
};

exports.addCourse = (req, res) => {
    const { title, description, instructor_id, price, level, category } =
        req.body;
    // Implement add course logic here
};

exports.updateCourse = (req, res) => {
    const { courseId } = req.params;
    const { title, description, instructor_id, price, level, category } =
        req.body;
    // Implement update course logic here
};

exports.deleteCourse = (req, res) => {
    const { courseId } = req.params;
    // Implement delete course logic here
};

exports.addLesson = (req, res) => {
    const { courseId } = req.params;
    const { title, content, video_url, order_index } = req.body;
    // Implement add lesson logic here
};

exports.getLessons = (req, res) => {
    const { courseId } = req.params;
    // Implement get lessons logic here
};
