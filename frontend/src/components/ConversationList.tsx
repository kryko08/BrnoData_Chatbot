import { type Conversation } from "../types/chat";

interface Props {
    conversations: Conversation[];
    activeId: string | null;
    loading: boolean;
    onSelect: (c: Conversation) => void;
}

export default function ConversationList({ conversations, activeId, loading, onSelect }: Props) {
    if (loading) {
        return <div className="history-loading">Loading…</div>;
    }

    if (conversations.length === 0) {
        return <div className="history-empty">No conversations yet.</div>;
    }

    const now = Date.now();
    const todayItems = conversations.filter(
        c => now - new Date(c.update_time).getTime() < 86400000
    );
    const olderItems = conversations.filter(
        c => now - new Date(c.update_time).getTime() >= 86400000
    );

    return (
        <div className="px-2 flex-1">
            {todayItems.length > 0 && (
                <>
                    <div className="">Today</div>
                    {todayItems.map(c => (
                        <div
                            key={c.id}
                            className={` ${c.id === activeId ? "active" : ""}`}
                            onClick={() => onSelect(c)}
                        >
                            {c.id}
                        </div>
                    ))}
                </>
            )}
            {olderItems.length > 0 && (
                <>
                    <div className="px-2 font-semibold text-sm uppercase">Earlier</div>
                    {olderItems.map(c => (
                        <div
                            key={c.id}
                            onClick={() => onSelect(c)}
                            className={`overflow-hidden truncate py-1 px-2 text-xs rounded-xl cursor-pointer hover:bg-blue-500 ${c.id === activeId ? "bg-blue-500" : ""}`}>
                            {c.id}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}