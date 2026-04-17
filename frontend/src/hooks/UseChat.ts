import { useEffect, useRef, useState } from "react";
import { type Conversation, type Message } from "../types/chat";
import { apiService } from "../services/api";

export function useChat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load conversation list on mount
    useEffect(() => {
        async function load() {
            try {
                const data = await apiService.getConversations();
                setConversations(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoadingConversations(false);
            }
        }
        load();
    }, []);
    
    // Load messages when active conversation changes
    useEffect(() => {
        if (!activeConversation) {
            setMessages([]);
            return;
        }
        const conversationId = activeConversation.id;

        async function load() {
            setLoading(true)
            try {
                const data = await apiService.getConversationMessages(conversationId)
                setMessages(data.items);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load()
    }, [activeConversation]);
    /*
    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }, [input]);

    async function startNewConversation() {
        try {
            const title = "New Chat";
            const conversation = await apiService.createConversation(title);
            setConversations(prev => [conversation, ...prev]);
            setActiveConversation(conversation);
            setMessages([]);
        } catch (err: any) {
            setError(err.message);
        }
    }

    async function sendMessage() {
        const text = input.trim();
        if (!text || loading || !activeConversation) return;

        const userMsg: Message = { role: "user", content: text };
        const updatedMessages = [...messages, userMsg];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        setError(null);

        // Update conversation title if it's the first message
        if (messages.length === 0) {
            const newTitle = text.slice(0, 32) + (text.length > 32 ? "…" : "");
            setConversations(prev =>
                prev.map(c =>
                    c.id === activeConversation.id ? { ...c, title: newTitle } : c
                )
            );
        }

        try {
            const aiText = await apiService.sendMessage(activeConversation.id, updatedMessages);
            setMessages(prev => [...prev, { role: "assistant", content: aiText }]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: "Error: " + err.message },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }
    */

    function selectConversation(conversation: Conversation) {
        if (conversation.id === activeConversation?.id) return;
        setActiveConversation(conversation);
    }
    return {
        conversations,
        activeConversation,
        messages,
        input,
        setInput,
        loading,
        loadingConversations,
        error,
        bottomRef,
        textareaRef,
        startNewConversation: () => console.log("test"),
        sendMessage: () => console.log("test"),
        handleKeyDown: () => console.log("test"),
        selectConversation: selectConversation,
    };
}