const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required" });
    }

    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal Server Error 1" });
        }

        console.log("Email:", email);
        console.log("Password :", password);
        console.log("Results from DB:", results);

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        const storedPassword = user.password_hash; // Đã sửa thành password_hash

        // So sánh mật khẩu trực tiếp
        if (password === storedPassword) {
            // So sánh trực tiếp (cần băm mật khẩu khi đăng ký)
            res.json({
                message: "Login successful",
                userName: user.username, // Đã sửa thành username
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body; // Đã sửa thành username

    // Thay vì băm mật khẩu, lưu mật khẩu trực tiếp vào cơ sở dữ liệu
    db.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", // Đã sửa thành password_hash
        [username, email, password], // Đã sửa thành username
        (err, result) => {
            if (err) {
                console.error("Error registering new user:", err);
                return res
                    .status(500)
                    .json({ error: "Error registering new user" });
            }
            res.json({ message: "User registered successfully" });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
