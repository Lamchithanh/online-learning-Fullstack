import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "bootstrap";
import "./App.css";
import Login from "./Page/Login/Login";

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleLoginSuccess = (userName) => {
        setLoggedInUser(userName);
    };

    return (
        <div className="app">
            {loggedInUser ? (
                <div className="welcome-message">
                    <h1>Welcome, {loggedInUser}!</h1>
                    <p>You have successfully logged in.</p>
                </div>
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;
