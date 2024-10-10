
const jwt = require("jsonwebtoken");

// Hàm kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            error: "Only administrators can access this route",
        });
    }
};

// Hàm lấy token từ localStorage (thường chỉ sử dụng ở frontend)
exports.getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user")); // Lưu ý: localStorage chỉ có ở frontend
    if (user && user.token) {
        return user.token; // Trả về token nếu có
    }
    return null; // Trả về null nếu không có token
};

// Hàm xác thực token
exports.verifyToken = (req, res, next) => {
    console.log("Headers received:", req.headers); // Log headers

    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(
                token.split(" ")[1],
                process.env.SECRET_KEY
            ); // Tách 'Bearer ' ra
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        console.error("No token provided");
        return res.status(401).json({ error: "No token provided" });
    }
};
