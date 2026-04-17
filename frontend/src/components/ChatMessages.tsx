import { type Message } from "../types/chat"

interface Props {
    messages: Message[]
    loading: boolean
}

export default function ChatMessages({messages, loading}: Props) {
    console.log(messages)

    return (
        <>
            <div className="messages-area">
                {messages.length === 0 && !loading ? (
                <div className="empty-state">
                    <div className="empty-title">How can I help?</div>
                </div>
                ) : (
                messages.map((m, i) => (
                    <div key={i} className={`message-row ${m.role}`}>
                    <div className="message-label">{m.role === "user" ? "user" : "model"}</div>
                    <div className={`bubble ${m.role}`}></div>
                    </div>
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
        </>
    )
}