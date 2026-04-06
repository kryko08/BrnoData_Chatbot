import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/auth.css";

interface AuthProps {
    mode: "login" | "register"
}


export default function Auth({ mode }: AuthProps) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(){
        setError("");

        if (!username || !password) {
            setError("Fill out both fields before submitting the form");
            return;
        }

        if (mode == "register" && !email) {
            setError("Email is required")
        }


        setLoading(true);

        try {
            let response: Response;

            if (mode === "login") {
                const formData = new URLSearchParams();
                formData.append("username", username);
                formData.append("password", password);

                response = await fetch("api/auth/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formData.toString(),
                });
            } else {
                response = await fetch("api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, email }),
                });
            }

            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                setError(data.detail || "Something went wrong.");
                return;
            }

            if (mode === "login") {
                localStorage.setItem("token", data.access_token);
                navigate("/chat");
            } else {
                // after register, go to login
                navigate("/login");
            }
 
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }

    return (
        <div className="auth-root">
            <aside className="auth-sidebar">
                <div className="auth-sidebar-header">
                    <div className="auth-app-title">Headline</div>
                </div>
                <div className="auth-sidebar-body">
                    <div className="auth-tagline"></div>
                </div>
            </aside>
 
            <main className="auth-main">
                <div className="auth-card">
                    <div className="auth-heading">
                        {mode === "login" ? "Sign in" : "Create account"}
                    </div>
 
                    <div className="auth-form">
                        <div className="auth-field">
                            <label className="auth-label">Username</label>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Your username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoComplete="username"
                            />
                        </div>

                        {/* Email only on register */}
                        {mode === "register" && (
                            <div className="auth-field">
                                <label className="auth-label">Email</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="email"
                                />
                            </div>)}

                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                            />
                        </div>
 
                        {error && <div className="auth-error">{error}</div>}
 
                        <button
                            className="auth-submit"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-spinner" />
                            ) : (
                                mode === "login" ? "Sign in →" : "Create account →"
                            )}
                        </button>
 
                        <div className="auth-switch">
                            {mode === "login" ? (
                                <>No account? <Link to="/register">Register</Link></>
                            ) : (
                                <>Have an account? <Link to="/login">Sign in</Link></>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}