import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../Login/Login.scss";
import "bootstrap";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:9000/api/login",
                {
                    email,
                    password,
                }
            );
            toast.success("Đăng nhập thành công!");

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Chuyển hướng dựa trên vai trò
            if (response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                    "Đã xảy ra lỗi. Vui lòng thử lại."
            );
        }
    };

    return (
        <div className="container">
            <button className="btn-signin" onClick={() => navigate(-1)}>
                Quay lại
            </button>
            <form className="form-signin container" onSubmit={handleSubmit}>
                <p className="title-signin">Đăng nhập vào tài khoản của bạn</p>

                <input
                    className="ipemail"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    className="ippassword"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="btn-signin" type="submit">
                    Đăng nhập
                </button>
                <p>
                    <Link to="/register">Tạo tài khoản mới</Link> |{" "}
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
