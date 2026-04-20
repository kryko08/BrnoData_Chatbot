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
        <div className="">
            <div className="">
                {loading ? (
                    <div className="">Loading…</div>
                ) : user ? (
                    <>
                        <div className="">{user.username}</div>
                        <div className="">{user.email}</div>
                    </>
                ) : null}
            </div>
            <button className="" onClick={handleLogout}>
                Sign out
            </button>
        </div>
    );
}