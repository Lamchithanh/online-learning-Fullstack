import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            const response = await axios.post("http://localhost:9000/login", {
                email,
                password,
            });
            toast.success("Login successful!");
            navigate("/home", { state: { userName: response.data.userName } });
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                    "An error occurred. Please try again."
            );
        }
    };

    return (
        <div className="container">
            <form className="form-signin container" onSubmit={handleSubmit}>
                <p className="title-signin">Login in to your account</p>
                <div>
                    <input
                        className="ipemail"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className="ippassword"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn-signin" type="submit">
                    Login in
                </button>
            </form>
        </div>
    );
};

export default Login;
