// Nhập các mô-đun cần thiết
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const configViewEngine = require("./config/ViewEngine");
const db = require("./config/db");
require("dotenv").config();

// Tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 8081;
//config template engine
configViewEngine(app);
// Kết nối tới cơ sở dữ liệu MySQL bằng pool
db.getConnection((err, connection) => {
    if (err) {
        console.error("Lỗi kết nối tới MySQL:", err);
        return;
    }
    console.log("Đã kết nối tới MySQL bằng pool");
    connection.release(); // giải phóng kết nối về lại pool
});

// Truy vấn bằng pool
db.query("SELECT * FROM users", (err, results) => {
    if (err) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
        return;
    }
    console.log(">>>> kết quả: ", results);
});

// Định nghĩa tuyến đường cho đăng nhập
// app.post("/Login", (req, res) => {
//     const { email, password } = req.body;

//     // Truy vấn cơ sở dữ liệu để tìm người dùng
//     db.query(`SELECT * FROM users WHERE email = ?`, email, (err, results) => {
//         if (err) {
//             console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
//             res.status(500).send({ error: "Lỗi Máy chủ Nội bộ" });
//             return;
//         }

//         if (results.length === 0) {
//             res.status(401).send({ error: "Email hoặc mật khẩu không hợp lệ" });
//             return;
//         }

//         const user = results[0];
//         const hashedPassword = user.password;

//         // So sánh mật khẩu được cung cấp với mật khẩu đã mã hóa
//         bcrypt.compare(password, hashedPassword, (err, result) => {
//             if (err) {
//                 console.error("Lỗi so sánh mật khẩu:", err);
//                 res.status(500).send({ error: "Lỗi Máy chủ Nội bộ" });
//                 return;
//             }

//             if (!result) {
//                 res.status(401).send({ error: "Email hoặc mật khẩu không hợp lệ" });
//                 return;
//             }

//             // Đăng nhập thành công, chuyển hướng đến bảng điều khiển hoặc một nơi khác
//             res.send({ message: "Đăng nhập thành công" });
//         });
//     });
// });

// Khởi động máy chủ
app.listen(port, () => {
    console.log("Máy chủ đã khởi động tại cổng 8081");
});
