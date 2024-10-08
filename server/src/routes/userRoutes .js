const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAdmin } = require("../middleware/auth");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/forgot-password", userController.forgotPassword);
router.get("/", isAdmin, userController.getAllUsers);
router.post("/logout", userController.logout);

module.exports = router;
