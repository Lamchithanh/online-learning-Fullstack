import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Page/Login/Login";
import Register from "./Page/Login/Register";
import ForgotPassword from "./Page/Login/ForgotPassword";
import HomePage from "./Page/Home/HomePage";
import AdminDashboard from "../../server/src/Admin/AdminDashboard";
import User from "./components/User";
import "bootstrap";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const App = () => {
    return (
        <Router>
            <div className="app">
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<User />}>
                        <Route index element={<HomePage />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
