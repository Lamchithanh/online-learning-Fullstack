const pool = require("../config/pool"); // Đảm bảo rằng đường dẫn này đúng
const connection = require("../config/pool"); // Import kết nối cơ sở dữ liệu

// truy xuất dữ liệu và đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Truy vấn để lấy thông tin người dùng theo email
        const [results] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (results.length === 0) {
            return res.status(401).json({ error: "Người dùng không tồn tại" });
        }

        const user = results[0];

        // So sánh mật khẩu (nếu không sử dụng hàm băm, hãy kiểm tra trực tiếp)
        if (user.password_hash !== password) {
            // Lưu ý: Nên dùng băm cho mật khẩu
            return res.status(401).json({ error: "Mật khẩu không đúng" });
        }

        // Nếu thành công, trả về thông tin người dùng
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            message: "Đăng nhập thành công!",
        });
    } catch (err) {
        console.error("Database query error: ", err);
        return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
};
// truy xuất và đăng ký
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Kiểm tra xem có đầy đủ dữ liệu không
        if (!username || !email || !password || !role) {
            return res
                .status(400)
                .json({ error: "Tất cả các trường đều bắt buộc!" });
        }

        // Kiểm tra xem tên người dùng đã tồn tại chưa
        const [existingUser] = await connection.query(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (existingUser.length > 0) {
            return res
                .status(400)
                .json({ error: "Tên người dùng hoặc email đã tồn tại!" });
        }

        // Chèn người dùng mới vào cơ sở dữ liệu
        const result = await connection.query(
            `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
            [username, email, password, role]
        );

        return res
            .status(201)
            .json({ message: "Đăng ký người dùng thành công!" });
    } catch (error) {
        console.error("Lỗi khi đăng ký người dùng: ", error); // In ra lỗi chi tiết
        return res.status(500).json({ error: "Lỗi nội bộ máy chủ" });
    }
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    // Implement forgot password logic here
};

exports.getAllUsers = async (req, res) => {
    try {
        const results = await pool.query(
            "SELECT * FROM users WHERE role != 'admin'"
        );
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};
exports.logout = (req, res) => {
    // Implement logout logic here
};
