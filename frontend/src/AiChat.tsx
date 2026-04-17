import { useState, useRef, useEffect } from "react";
import { type Conversation } from "./types/chat";
import "./css/chat.css"
import ChatSidebar from "./components/ChatSidebar";
import { apiService } from "./services/api";
import { useChat } from "./hooks/UseChat";
import { useUser } from "./hooks/UseUser";
import ChatMessages from "./components/ChatMessages";

export default function AIChat() {
    const {
        conversations,
        activeConversation,
        messages,
        input,
        setInput,
        loading,
        loadingConversations,
        bottomRef,
        textareaRef,
        startNewConversation,
        sendMessage,
        handleKeyDown,
        selectConversation,
    } = useChat();

    const { user, loading: loadingUser } = useUser();

    return (
    <>
    <div className="chat-root">

        
            <ChatSidebar
                conversations={conversations}
                activeId={activeConversation?.id ?? null}
                loadingConversations={loadingConversations}
                user={user}
                loadingUser={loadingUser}
                onSelect={selectConversation}
                onNewChat={startNewConversation}
            />

            <ChatMessages 
                messages={messages}
                loading={loading}
            />
    </div>
    </>

    );
}