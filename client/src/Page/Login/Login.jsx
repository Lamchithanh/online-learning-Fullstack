import React, { useState } from "react";
import axios from "axios"; // Ensure axios is correctly imported
import "../Login/Login.scss";
import "bootstrap";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/login", {
                email,
                password,
            });
            const data = response.data;

            if (data.error) {
                setError(data.error);
            } else {
                // Login successful, redirect to dashboard or whatever
                window.location.href = "/dashboard";
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
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
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="ippassword"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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
