const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route để đăng nhập
router.post("/login", userController.login);

// Route để đăng ký
router.post("/register", userController.register);

// Route để lấy lại mật khẩu
router.post("/forgot-password", userController.forgotPassword);

// Route để lấy danh sách người dùng (không cần xác thực nữa)
router.get("/", userController.getAllUsers);

// Route để đăng xuất
router.post("/logout", userController.logout);

module.exports = router;
