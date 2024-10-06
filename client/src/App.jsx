import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Page/Login/Login";
import Register from "./Page/Login/Register";
import ForgotPassword from "./Page/Login/ForgotPassword";
import HomePage from "./Page/Home/HomePage";

const App = () => {
    return (
        <Router>
            <div className="app">
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/home" element={<HomePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
