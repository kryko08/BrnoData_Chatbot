import { type Message } from "../types/chat"
import "../css/chat.css"

interface Props {
    messages: Message[]
    loading: boolean
}

function ChatMessage({message}: {message: Message}) {
    const isUser = message.role !== "model";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`w-4/5 rounded-b-lg p-3 ${
                isUser ? "bg-yellow-600 rounded-tl-lg" : "bg-gray-300 rounded-tr-lg"
                }`}
            >
                <div className="text-sm">
                {message.text}
                </div>
            </div>
        </div>
  );
}

export default function ChatMessages({messages, loading}: Props) {
    console.log(messages)

    return (
        <>
            <div className="mx-4 my-5 flex flex-col gap-4 overflow-auto">
                {messages.length === 0 && !loading ? (
                <div className="empty-state">
                    <div className="empty-title">How can I help?</div>
                </div>
                ) : (
                messages.map((m) => (
                    <ChatMessage message={m}/>
                ))
                )}

                {loading && (
                <div className="message-row assistant">
                    <div className="message-label">Claude</div>
                    <div className="bubble assistant">
                    <div className="typing-dots"><span /><span /><span /></div>
                    </div>
                </div>
                )}
            </div>
            {/*
            <div className="input-area">
                <div className="input-wrap">
                <textarea
                    className="chat-textarea"
                    placeholder="Message…"
                    rows={1}
                />
                <button className="send-btn">
                    <svg className="send-icon" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
                </div>
            </div>
            */}
        </>
    )
}