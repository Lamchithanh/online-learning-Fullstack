const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth");

// Route để đăng nhập
router.post("/users/login", userController.login);

// Route để đăng ký
router.post("/register", userController.register);

// Route để lấy lại mật khẩu
router.post("/forgot-password", userController.forgotPassword);

// Route để lấy danh sách người dùng (không cần xác thực nữa)
router.get("/user", userController.getAllUsers);

// Route to fetch current logged-in user's profile based on token
router.get("/users/profile", authMiddleware, userController.getUserProfile);

// Route để đăng xuất
router.post("/logout", userController.logout);

module.exports = router;
