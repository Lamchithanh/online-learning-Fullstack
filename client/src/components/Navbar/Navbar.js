import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Trang chủ</Link>
                </li>
                <li>
                    <Link to="/courses">Khóa học</Link>
                </li>
                <li>
                    <Link to="/dashboard">Tổng quan</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
