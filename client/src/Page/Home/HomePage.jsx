import React from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
    const location = useLocation();
    const userName = location.state?.userName || "User";

    return (
        <div className="home">
            <h1>Welcome to the Home Page, {userName}!</h1>
            <p>You have successfully logged in.</p>
        </div>
    );
};

export default HomePage;
