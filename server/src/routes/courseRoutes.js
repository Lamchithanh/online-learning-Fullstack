const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
// Không cần import isAdmin nếu không sử dụng xác thực

// Các route không cần xác thực
router.get("/courses", async (req, res) => {
    try {
        const courses = await courseController.getAllCourses();
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/courses", courseController.addCourse); // Thêm khóa học
router.put("/:courseId", courseController.updateCourse); // Cập nhật khóa học
router.delete("/:courseId", courseController.deleteCourse); // Xóa khóa học
router.post("/:courseId/lessons", courseController.addLesson); // Thêm bài học
router.get("/:courseId/lessons", courseController.getLessons); // Lấy bài học theo khóa học

module.exports = router;
