const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

const isAdmin = (req, res, next) => {
    // Check if the user is an administrator
    // For example, you could check if the user has a specific role or permission
    if (req.user && req.user.role === "admin") {
        next(); // Allow the request to proceed
    } else {
        res.status(403).json({
            error: "Only administrators can access this route",
        });
    }
};
// Đăng nhập
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email và mật khẩu là bắt buộc" });
    }

    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
        }

        if (results.length === 0) {
            return res
                .status(401)
                .json({ error: "Email hoặc mật khẩu không hợp lệ" });
        }

        const user = results[0];
        const storedPassword = user.password_hash;

        // So sánh mật khẩu trực tiếp (trong thực tế, bạn nên sử dụng bcrypt.compare)
        if (password === storedPassword) {
            res.json({
                message: "Đăng nhập thành công",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            res.status(401).json({ error: "Email hoặc mật khẩu không hợp lệ" });
        }
    });
});

// Đăng ký
app.post("/api/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ error: "Tên người dùng, email và mật khẩu là bắt buộc" });
    }

    const userRole = role || "student"; // Mặc định vai trò là 'student'
    if (!["student", "instructor", "admin"].includes(userRole)) {
        return res.status(400).json({ error: "Vai trò không hợp lệ" });
    }

    db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [username, email, password, userRole],
        (err, result) => {
            if (err) {
                console.error("Lỗi đăng ký người dùng mới:", err);
                return res
                    .status(500)
                    .json({ error: "Lỗi trong quá trình đăng ký người dùng" });
            }
            res.json({ message: "Người dùng đã được đăng ký thành công" });
        }
    );
});

// Quên mật khẩu
app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
        }

        if (results.length === 0) {
            // Không tiết lộ nếu email tồn tại hay không
            return res.json({
                message:
                    "Nếu tài khoản với email đó tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
            });
        }

        // Thực tế, bạn sẽ gửi email đặt lại mật khẩu ở đây
        res.json({
            message:
                "Nếu tài khoản với email đó tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
        });
    });
});

// Lấy danh sách khóa học
// New route to get all courses
app.get("/api/courses", (req, res) => {
    db.query("SELECT * FROM courses", (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
});

//lấy danh sách người dùng (không bao gồm admin)
app.get("/api/users", isAdmin, (req, res) => {
    db.query("SELECT * FROM users WHERE role != 'admin'", (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
});

// New route to add a course (admin only)
app.post("/api/courses", isAdmin, (req, res) => {
    const { title, description, instructor_id, price, level, category } =
        req.body;

    db.query(
        "INSERT INTO courses (title, description, instructor_id, price, level, category) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, instructor_id, price, level, category],
        (err, result) => {
            if (err) {
                console.error("Error adding course:", err);
                return res.status(500).json({ error: "Error adding course" });
            }
            res.json({
                message: "Course added successfully",
                id: result.insertId,
            });
        }
    );
});

//đăng xuất admin
app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Đăng xuất thất bại", err);
            res.status(500).json({
                success: false,
                error: "Đăng xuất thất bại",
            });
        } else {
            res.json({ success: true });
        }
    });
});

// New route to add a lesson to a course (admin only)
app.post("/api/courses/:courseId/lessons", isAdmin, (req, res) => {
    const { courseId } = req.params;
    const { title, content, video_url, order_index } = req.body;
    db.query(
        "INSERT INTO lessons (course_id, title, content, video_url, order_index) VALUES (?, ?, ?, ?, ?)",
        [courseId, title, content, video_url, order_index],
        (err, result) => {
            if (err) {
                console.error("Error adding lesson:", err);
                return res.status(500).json({ error: "Error adding lesson" });
            }
            res.json({
                message: "Lesson added successfully",
                id: result.insertId,
            });
        }
    );
});

// New route to get lessons for a course
app.get("/api/courses/:courseId/lessons", (req, res) => {
    const { courseId } = req.params;
    db.query(
        "SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index",
        [courseId],
        (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json(results);
        }
    );
});

// Thêm thông tin về người dùng vào request
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
    }
    next();
});

// Thêm thông tin về khóa học vào request
app.put("/api/courses/:courseId", isAdmin, (req, res) => {
    const { courseId } = req.params;
    const { title, description, instructor_id, price, level, category } =
        req.body;

    db.query(
        "UPDATE courses SET title = ?, description = ?, instructor_id = ?, price = ?, level = ?, category = ? WHERE id = ?",
        [title, description, instructor_id, price, level, category, courseId],
        (err, result) => {
            if (err) {
                console.error("Error editing course:", err);
                return res.status(500).json({ error: "Error editing course" });
            }
            res.json({
                message: "Course edited successfully",
            });
        }
    );
});

// New route to delete a course (admin only)
app.delete("/api/courses/:courseId", isAdmin, (req, res) => {
    const { courseId } = req.params;

    db.query("DELETE FROM courses WHERE id = ?", [courseId], (err, result) => {
        if (err) {
            console.error("Error deleting course:", err);
            return res.status(500).json({ error: "Error deleting course" });
        }
        res.json({
            message: "Course deleted successfully",
        });
    });
});

app.listen(port, () => {
    console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
