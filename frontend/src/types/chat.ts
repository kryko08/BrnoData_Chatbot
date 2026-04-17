export interface UserMe {
    id: string
    is_admin: boolean
    is_activate: boolean
    username: string
    email: string
}

export interface Page<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface Conversation {
    id: string;
    update_time: string;
}

export interface Message {
    id: string;
    role: "user" | "model";
    text: string;
    timestamp: string;
}