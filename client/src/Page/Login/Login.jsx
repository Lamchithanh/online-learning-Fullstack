import React, { useState } from "react";
import axios from "axios";
import "../Login/Login.scss";

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post("http://localhost:9000", {
                email,
                password,
            });
            onLoginSuccess(response.data.userName);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                    "An error occurred. Please try again."
            );
        }
    };

    return (
        <div>
            <form className="form-signin" onSubmit={handleSubmit}>
                <p className="title-signin">Sign in to your account</p>
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
                    Sign in
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
