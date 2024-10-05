const db = require("../config/db");

const createQuiz = async (req, res) => {
    const { title, description } = req.body;
    const quiz = await db.execute(
        `INSERT INTO quizzes (title, description) VALUES (?, ?)`,
        [title, description]
    );
    res.send("Tạo bài kiểm tra thành công!");
};

const getQuizzes = async (req, res) => {
    const quizzes = await db.execute("SELECT * FROM quizzes");
    res.send(quizzes);
};

module.exports = { createQuiz, getQuizzes };
