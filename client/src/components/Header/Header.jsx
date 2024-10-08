import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import avatar from "../../assets/img/avarta.png";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownActive, setDropdownActive] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setUser(loggedInUser);
        }
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setDropdownActive(false);
        navigate("/");
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownActive((prevState) => {
            console.log("Dropdown active state: ", !prevState); // Debugging
            return !prevState;
        });
    };

    const handleMenuItemClick = (action) => {
        switch (action) {
            case "logout":
                handleLogout();
                break;
            case "profile":
                console.log("Profile clicked");
                // Điều hướng đến trang cá nhân hoặc xử lý hành động
                break;
            default:
                console.log(`Action ${action} clicked`);
        }
        setDropdownActive(false);
    };

    return (
        <header className="header">
            <div className="header__logo">
                <span className="logo-icon">
                    <img
                        width="50"
                        height="50"
                        src="https://img.icons8.com/bubbles/50/classroom.png"
                        alt="classroom"
                    />
                </span>
                <span className="logo-text">Học Lập Trình Để Đi Làm</span>
            </div>
            <div className="header__search">
                <input
                    type="text"
                    placeholder="Tìm kiếm khóa học, bài viết, video, ..."
                />
                <i className="search-icon"></i>
            </div>
            <div className="header__actions">
                {user ? (
                    <div className="user-menu" ref={dropdownRef}>
                        <button
                            onClick={handleLogout}
                            className="btn btn--logout"
                        >
                            Đăng xuất
                        </button>
                        <button
                            onClick={toggleDropdown}
                            className="user-avatar"
                        >
                            <img
                                src={user.avatarUrl || avatar}
                                alt="User Avatar"
                                className="avatar-img"
                                style={{ width: "30px", borderRadius: "50%" }}
                            />
                            <span>{user.username}</span>
                        </button>
                        {/* {dropdownActive && ( // Kiểm tra dropdownActive để hiển thị menu
                            <div
                                className={`dropdown-menu ${
                                    dropdownActive ? "active" : ""
                                }`}
                            >
                                <ul>
                                    <li
                                        onClick={() =>
                                            handleMenuItemClick("profile")
                                        }
                                    >
                                        Trang cá nhân
                                    </li>
                                    <li
                                        onClick={() =>
                                            handleMenuItemClick("write-blog")
                                        }
                                    >
                                        Viết blog
                                    </li>
                                    <li
                                        onClick={() =>
                                            handleMenuItemClick("my-posts")
                                        }
                                    >
                                        Bài viết của tôi
                                    </li>
                                    <li
                                        onClick={() =>
                                            handleMenuItemClick("saved-posts")
                                        }
                                    >
                                        Bài viết đã lưu
                                    </li>
                                    <li
                                        onClick={() =>
                                            handleMenuItemClick("settings")
                                        }
                                    >
                                        Cài đặt
                                    </li>
                                </ul>
                            </div>
                        )} */}
                    </div>
                ) : (
                    <>
                        <NavLink to="/register">
                            <button className="btn btn--outline">
                                Đăng ký
                            </button>
                        </NavLink>
                        <NavLink to="/login">
                            <button className="btn btn--primary">
                                Đăng nhập
                            </button>
                        </NavLink>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
