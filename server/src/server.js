const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

// Đăng nhập
app.post("/login", async (req, res) => {
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

        // So sánh mật khẩu trực tiếp
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
app.post("/register", async (req, res) => {
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
app.post("/forgot-password", async (req, res) => {
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

app.listen(port, () => {
    console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
