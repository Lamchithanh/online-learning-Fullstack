const pool = require("../config/pool");

// Lấy tất cả khóa học
exports.getAllCourses = async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM courses");
        res.status(200).json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

// Thêm khóa học mới
exports.addCourse = (req, res) => {
    const { title, description, instructor_id, price, level, category } =
        req.body;

    const query = `
        INSERT INTO courses (title, description, instructor_id, price, level, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [title, description, instructor_id, price, level, category];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error("Error adding course:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json(results.rows[0]); // Trả về khóa học vừa được thêm
    });
};

// Cập nhật thông tin khóa học
exports.updateCourse = (req, res) => {
    const { courseId } = req.params;
    const { title, description, instructor_id, price, level, category } =
        req.body;

    const query = `
        UPDATE courses
        SET title = $1, description = $2, instructor_id = $3, price = $4, level = $5, category = $6
        WHERE id = $7
        RETURNING *;
    `;

    const values = [
        title,
        description,
        instructor_id,
        price,
        level,
        category,
        courseId,
    ];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error("Error updating course:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(results.rows[0]); // Trả về khóa học đã được cập nhật
    });
};

// Xóa khóa học
exports.deleteCourse = (req, res) => {
    const { courseId } = req.params;

    const query = `DELETE FROM courses WHERE id = $1 RETURNING *;`;

    pool.query(query, [courseId], (err, results) => {
        if (err) {
            console.error("Error deleting course:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" });
    });
};

// Thêm bài học vào khóa học
exports.addLesson = (req, res) => {
    const { courseId } = req.params;
    const { title, content, video_url, order_index } = req.body;

    const query = `
        INSERT INTO lessons (course_id, title, content, video_url, order_index)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [courseId, title, content, video_url, order_index];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error("Error adding lesson:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json(results.rows[0]); // Trả về bài học vừa được thêm
    });
};

// Lấy danh sách bài học của khóa học
exports.getLessons = (req, res) => {
    const { courseId } = req.params;

    pool.query(
        "SELECT * FROM lessons WHERE course_id = $1",
        [courseId],
        (err, results) => {
            if (err) {
                console.error("Error fetching lessons:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json(results.rows); // Trả về danh sách bài học
        }
    );
};
