const db = require("../config/db");

const createComment = async (req, res) => {
    const { content, userId, courseId } = req.body;
    const comment = await db.execute(
        `INSERT INTO comments (content, userId, courseId) VALUES (?, ?, ?)`,
        [content, userId, courseId]
    );
    res.send("Đăng bình luận thành công!");
};

const getComments = async (req, res) => {
    const comments = await db.execute("SELECT * FROM comments");
    res.send(comments);
};

module.exports = { createComment, getComments };
