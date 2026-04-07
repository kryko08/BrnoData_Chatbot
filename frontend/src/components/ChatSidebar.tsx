
import { type Conversation, type UserMe } from "../types/chat"
import ConversationList from "./ConversationList";
import UserInfo from "./UserInfo";

interface Props {
    conversations: Conversation[];
    activeId: string | null;
    loadingConversations: boolean;
    user: UserMe | null;
    loadingUser: boolean;
    onSelect: (c: Conversation) => void;
    onNewChat: () => void;
}


export default function ChatSiderbar({
    conversations,
    activeId,
    loadingConversations,
    user,
    loadingUser,
    onSelect,
    onNewChat,
}: Props){
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="app-title">Brno Data Chatbot</div>
            </div>

            <button className="new-chat-btn" onClick={onNewChat}>
                <span className="plus">+</span> New chat
            </button>

            <ConversationList
                conversations={conversations}
                activeId={activeId}
                loading={loadingConversations}
                onSelect={onSelect}
            />

            <UserInfo user={user} loading={loadingUser} />
        </aside>
    )
}