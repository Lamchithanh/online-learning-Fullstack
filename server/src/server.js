const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes ");
const courseRoutes = require("./routes/courseRoutes");
const { verifyToken } = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

// Apply verifyToken middleware to all routes except login and register
app.use("/api/users", (req, res, next) => {
    if (req.path === "/login" || req.path === "/register") {
        return next();
    }
    verifyToken(req, res, next);
});

app.use("/api/users", userRoutes);
app.use("/api/courses", verifyToken, courseRoutes);

app.listen(port, () => {
    console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
