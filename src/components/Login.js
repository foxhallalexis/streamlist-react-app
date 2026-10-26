import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            setError("Please enter both an email and password.");
            return;
        }

        setError("");
        navigate("/streamlist");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <span className="material-symbols-rounded login-icon">
                        movie
                    </span>

                    <h1>Welcome to StreamList!</h1>
                    <p> Sign in to manage the movies and shows you want to watch.</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <label htmlFor="email">
                        Email
                    </label>
                    <div className="login-input-group">
                        <span className="material-symbols-rounded">
                            mail
                        </span>

                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"/>
                    </div>

                    <label htmlFor="password">
                        Password
                    </label>
                    <div className="login-input-group">
                        <span className="material-symbols-rounded">
                            lock
                        </span>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"/>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-btn">
                        <span className="material-symbols-rounded">
                            login
                        </span>
                        Sign In
                    </button>
                </form>
                
                <p className="demo-note">
                    StreamList demo
                </p>
            </div>
        </div>
    );
}

export default Login;