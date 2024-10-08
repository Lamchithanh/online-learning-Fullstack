const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { isAdmin } = require("../middleware/auth");

router.get("/", courseController.getAllCourses);
router.post("/", isAdmin, courseController.addCourse);
router.put("/:courseId", isAdmin, courseController.updateCourse);
router.delete("/:courseId", isAdmin, courseController.deleteCourse);
router.post("/:courseId/lessons", isAdmin, courseController.addLesson);
router.get("/:courseId/lessons", courseController.getLessons);

module.exports = router;
