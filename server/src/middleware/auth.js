const jwt = require("jsonwebtoken");

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            error: "Only administrators can access this route",
        });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        return res.status(401).json({ error: "No token provided" });
    }
};
