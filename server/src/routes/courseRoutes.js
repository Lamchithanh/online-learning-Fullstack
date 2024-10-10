const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { getAllUsers } = require("../controllers/userController");
// Không cần import isAdmin nếu không sử dụng xác thực

// Các route không cần xác thực
router.get("/courses",courseController.getAllCourses);
router.post("/courses", courseController.addCourse); // Thêm khóa học
router.put("/:courseId", courseController.updateCourse); // Cập nhật khóa học
router.delete("/:courseId", courseController.deleteCourse); // Xóa khóa học
router.post("/:courseId/lessons", courseController.addLesson); // Thêm bài học
router.get("/:courseId/lessons", courseController.getLessons); // Lấy bài học theo khóa học

module.exports = router;
