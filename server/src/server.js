const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

//đăng nhập
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

// đăng ký
app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [username, email, password, role],
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

// quên mật khẩu
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    // In a real application, you would generate a password reset token and send an email here
    // For this example, we'll just check if the email exists in the database

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Email:", email);
        console.log("Password :", password);
        console.log("Results from DB:", results);
        if (results.length === 0) {
            // Don't reveal if the email exists or not for security reasons
            return res.json({
                message:
                    "If an account with that email exists, we have sent password reset instructions.",
            });
        }

        // In a real application, send password reset email here
        res.json({
            message:
                "If an account with that email exists, we have sent password reset instructions.",
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
