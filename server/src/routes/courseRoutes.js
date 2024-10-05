const express = require("express");
const { createCourse, getCourses } = require("../controllers/courseController");

const router = express.Router();

router.post("/create", createCourse);
router.get("/all", getCourses);

module.exports = router;
