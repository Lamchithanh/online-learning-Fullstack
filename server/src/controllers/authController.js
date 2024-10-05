const db = require("../config/db");

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const user = await db.execute(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, password]
    );
    res.send("Đăng ký thành công!");
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await db.execute(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password]
    );
    if (!user) {
        res.status(401).send("Tài khoản không tồn tại!");
    } else {
        // Xử lý đăng nhập
    }
};

module.exports = { register, login };
