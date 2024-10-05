const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8081;
const saltRounds = 10;

app.use(cors({ origin: "http://localhost:9000" }));
app.use(bodyParser.json());

// Utility function to hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

// Utility function to check if a string is already hashed
const isHashed = (str) => {
    return /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/.test(str);
};

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Invalid email or password" });
            }

            const user = results[0];
            let storedPassword = user.password;

            // Check if the stored password is not hashed, and hash it if necessary
            if (!isHashed(storedPassword)) {
                try {
                    storedPassword = await hashPassword(storedPassword);
                    // Update the database with the hashed password
                    db.query("UPDATE users SET password = ? WHERE id = ?", [
                        storedPassword,
                        user.id,
                    ]);
                } catch (hashError) {
                    console.error("Error hashing password:", hashError);
                    return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                }
            }

            try {
                const match = await bcrypt.compare(password, storedPassword);
                if (match) {
                    res.json({
                        message: "Login successful",
                        userName: user.name,
                    });
                } else {
                    res.status(401).json({
                        error: "Invalid email or password",
                    });
                }
            } catch (compareError) {
                console.error("Error comparing password:", compareError);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    );
});

// Endpoint to register a new user
app.post("/register", async (req, res) => {
    const { id, userName, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        db.query(
            "INSERT INTO users (id, userName, email, password) VALUES (?, ?, ?, ?)",
            [id, userName, email, hashedPassword],
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
    } catch (hashError) {
        console.error("Error hashing password:", hashError);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
