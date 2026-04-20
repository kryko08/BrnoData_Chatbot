import { type UserMe, type Conversation, type Message, type Page } from "../types/chat";

const BASE_URL = "/api"


async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Request failed");
    }
    return res.json();
}


function authHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}


export const apiService = {

    async getMe(): Promise<UserMe> {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            headers: authHeaders()
        })
        return handleResponse<UserMe>(res);
    },

    async getConversations(): Promise<Conversation[]> {
        const res = await fetch(`${BASE_URL}/sessions/`, {
            method: "GET",
            headers: authHeaders()
        });
        return handleResponse<Conversation[]>(res);
    },

    async getConversationMessages(session_id: string): Promise<Message[]> {
        const res = await fetch(`${BASE_URL}/sessions/${session_id}/events`, {
            method: "GET",
            headers: authHeaders()
        });

        return handleResponse<Message[]>(res);
    }

}