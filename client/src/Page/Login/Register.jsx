import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Register.scss"; // You'll need to create this file for styling
import "bootstrap";
const Register = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:9000/register",
                {
                    username,
                    role,
                    email,
                    password,
                }
            );
            toast.success("Registration successful! Please log in.");
            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                    "An error occurred. Please try again."
            );
        }
    };

    return (
        <div className="container">
            <form className="form-Register" onSubmit={handleSubmit}>
                <h2 className="title-Register">Create an Account</h2>
                <input
                    className="ip_user form-control"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="student">1. student</option>
                    <option value="instructor">2. instructor</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <div className="d-flex justify-content-center">
                    <button className="btn-Register" type="submit">
                        Register
                    </button>
                </div>
                <p>
                    Already have an account? <a href="/">Log in</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
