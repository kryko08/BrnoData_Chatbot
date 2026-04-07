import { type UserMe } from "../types/chat";
import { useNavigate } from "react-router-dom";

interface Props {
    user: UserMe | null;
    loading: boolean;
}

export default function UserInfo({ user, loading }: Props) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="user-info">
            <div className="user-details">
                {loading ? (
                    <div className="user-loading">Loading…</div>
                ) : user ? (
                    <>
                        <div className="user-name">{user.username}</div>
                        <div className="user-email">{user.email}</div>
                    </>
                ) : null}
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                Sign out
            </button>
        </div>
    );
}