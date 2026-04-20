
import { type Conversation, type UserMe } from "../types/chat"
import ConversationList from "./ConversationList";
import UserInfo from "./UserInfo";
import newChatIcon from "../images/svg/chat-plus-light.svg"

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
        <aside className="hidden md:flex md:w-1/3 lg:w-80 shrink-0 flex-col bg-blue-400">
            <div className="pt-8 pb-5 text-center">
                <div className="text-lg font-bold uppercase">Brno Data Chatbot</div>
            </div>

            
            <ConversationList
                conversations={conversations}
                activeId={activeId}
                loading={loadingConversations}
                onSelect={onSelect}
            />

            <div className="flex justify-between items-center">
                <UserInfo user={user} loading={loadingUser} />
                <img src={newChatIcon} alt="icon" className="w-5 h-5" />
            </div>
        </aside>
    )
}