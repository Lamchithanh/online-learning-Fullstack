    import axios from "axios";

    const API_URL = "http://localhost:9000/api";
    // const { getAuthHeader } = require("./middleware/auth"); // Đường dẫn chính xác đến file auth.js

    const api = axios.create({
        baseURL: API_URL,
    });

    api.interceptors.request.use(
        (config) => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    const getAuthHeader = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            console.log(
                "Mã thông báo được tìm thấy trong localStorage:",
                user.token
            );
            return { Authorization: `Bearer ${user.token}` };
        }
        console.log("Không tìm thấy mã thông báo trong localStorage");
        return {};
    };
    // Đăng nhập người dùng
    // export const login = async (email, password) => {
    //     const response = await axios.post(`${API_URL}/users/login`, {
    //         email,
    //         password,
    //     });
    //     return response.data;
    // };

    // export const login = async (email, password) => {
    //     try {
    //         const response = await axios.post(`${API_URL}/users/login`, {
    //             email,
    //             password,
    //         });
    //         if (response.data.token) {
    //             localStorage.setItem("user", JSON.stringify(response.data));
    //         }
    //         return response.data;
    //     } catch (error) {
    //         console.error("Login error:", error);
    //         throw error;
    //     }
    // };

    // Đăng ký người dùng mới
    export const register = async (userData) => {
        try {
            const response = await axios.post(
                `${API_URL}/users/register`,
                userData
            );
            return response.data;
        } catch (error) {
            console.error("Error registering user:", error.response?.data); // In ra lỗi
            throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi
        }
    };

    // login
    export const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, {
                email,
                password,
            });
            console.log("Phản hồi đăng nhập:", response.data);
            if (response.data.token) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        token: response.data.token,
                        ...response.data.user,
                    })
                );
                console.log(
                    "Mã thông báo đã được lưu vào localStorage:",
                    response.data.token
                );
            } else {
                console.error("Không nhận được mã thông báo từ máy chủ");
            }
            return response.data;
        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response || error);
            throw error;
        }
    };

    // Lấy danh sách người dùng (chỉ admin mới có quyền)
    export const fetchUsers = async () => {
        const response = await axios.get(`${API_URL}/users`, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    //hàm để lấy thông tin người dùng
    export const fetchUserProfile = async () => {
        try {
            console.log("Đang tải hồ sơ người dùng...");
            const headers = getAuthHeader();
            console.log("Headers:", headers);
            const response = await axios.get(`${API_URL}/users/profile`, {
                headers,
            });
            console.log("Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải hồ sơ người dùng:", error.response || error);
            throw error;
        }
    };
    // Lấy danh sách khóa học
    export const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw error;
        }
    };

    // Thêm khóa học mới (chỉ instructor hoặc admin mới có quyền)
    export const addCourse = async (courseData) => {
        const response = await axios.post(`${API_URL}/courses`, courseData, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Cập nhật thông tin khóa học
    export const updateCourse = async (courseId, courseData) => {
        const response = await axios.put(
            `${API_URL}/courses/${courseId}`,
            courseData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Xóa khóa học
    export const deleteCourse = async (courseId) => {
        const response = await axios.delete(`${API_URL}/courses/${courseId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Lấy thông tin chi tiết khóa học (bao gồm các bài học và bài kiểm tra)
    export const fetchCourseDetails = async (courseId) => {
        const response = await axios.get(`${API_URL}/courses/${courseId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Đăng ký khóa học (user đăng ký tham gia khóa học)
    export const enrollCourse = async (courseId) => {
        const response = await axios.post(
            `${API_URL}/enrollments`,
            { course_id: courseId },
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Lấy danh sách bài học của khóa học
    export const fetchLessons = async (courseId) => {
        const response = await axios.get(`${API_URL}/courses/${courseId}/lessons`, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Thêm bài học vào khóa học
    export const addLesson = async (courseId, lessonData) => {
        const response = await axios.post(
            `${API_URL}/courses/${courseId}/lessons`,
            lessonData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Lấy danh sách bài kiểm tra của bài học
    export const fetchQuizzes = async (lessonId) => {
        const response = await axios.get(`${API_URL}/lessons/${lessonId}/quizzes`, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Thêm bài kiểm tra vào bài học
    export const addQuiz = async (lessonId, quizData) => {
        const response = await axios.post(
            `${API_URL}/lessons/${lessonId}/quizzes`,
            quizData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Lấy danh sách câu hỏi của bài kiểm tra
    export const fetchQuizQuestions = async (quizId) => {
        const response = await axios.get(`${API_URL}/quizzes/${quizId}/questions`, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Thêm câu hỏi vào bài kiểm tra
    export const addQuizQuestion = async (quizId, questionData) => {
        const response = await axios.post(
            `${API_URL}/quizzes/${quizId}/questions`,
            questionData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Lấy danh sách chủ đề thảo luận trong forum
    export const fetchForumTopics = async (courseId) => {
        const response = await axios.get(
            `${API_URL}/courses/${courseId}/forum/topics`,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Thêm chủ đề thảo luận vào forum
    export const addForumTopic = async (courseId, topicData) => {
        const response = await axios.post(
            `${API_URL}/courses/${courseId}/forum/topics`,
            topicData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Lấy danh sách phản hồi của chủ đề thảo luận
    export const fetchForumReplies = async (topicId) => {
        const response = await axios.get(
            `${API_URL}/forum/topics/${topicId}/replies`,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Thêm phản hồi vào chủ đề thảo luận
    export const addForumReply = async (topicId, replyData) => {
        const response = await axios.post(
            `${API_URL}/forum/topics/${topicId}/replies`,
            replyData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Xử lý thanh toán cho khóa học
    export const processPayment = async (paymentData) => {
        const response = await axios.post(`${API_URL}/payments`, paymentData, {
            headers: getAuthHeader(),
        });
        return response.data;
    };

    // Lấy tiến độ học tập của người dùng
    export const fetchProgress = async (courseId, userId) => {
        const response = await axios.get(
            `${API_URL}/progress?courseId=${courseId}&userId=${userId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Cập nhật tiến độ học tập
    export const updateProgress = async (lessonId, progressData) => {
        const response = await axios.put(
            `${API_URL}/progress/${lessonId}`,
            progressData,
            { headers: getAuthHeader() }
        );
        return response.data;
    };

    // Lấy danh sách chứng chỉ của người dùng
    export const fetchCertificates = async (userId) => {
        const response = await axios.get(
            `${API_URL}/users/${userId}/certificates`,
            { headers: getAuthHeader() }
        );
        return response.data;
    };
