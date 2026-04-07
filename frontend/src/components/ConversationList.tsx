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
    console.log(conversations)
    const now = Date.now();
    const todayItems = conversations.filter(
        c => now - new Date(c.update_time).getTime() < 86400000
    );
    const olderItems = conversations.filter(
        c => now - new Date(c.update_time).getTime() >= 86400000
    );

    return (
        <div className="history-list">
            {todayItems.length > 0 && (
                <>
                    <div className="history-section-label">Today</div>
                    {todayItems.map(c => (
                        <div
                            key={c.id}
                            className={`history-item ${c.id === activeId ? "active" : ""}`}
                            onClick={() => onSelect(c)}
                        >
                            {c.id}
                        </div>
                    ))}
                </>
            )}
            {olderItems.length > 0 && (
                <>
                    <div className="history-section-label">Earlier</div>
                    {olderItems.map(c => (
                        <div
                            key={c.id}
                            className={`history-item ${c.id === activeId ? "active" : ""}`}
                            onClick={() => onSelect(c)}
                        >
                            {c.id}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}