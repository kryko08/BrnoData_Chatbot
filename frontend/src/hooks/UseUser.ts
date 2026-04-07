import { useEffect, useState } from "react";
import { type UserMe } from "../types/chat";
import { apiService } from "../services/api";
 
export function useUser() {
    const [user, setUser] = useState<UserMe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
 
    useEffect(() => {
        apiService
            .getMe()
            .then(setUser)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
 
    return { user, loading, error };
}