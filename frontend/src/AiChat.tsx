import { useState, useRef, useEffect } from "react";
import "./css/chat.css"

export default function AIChat() {

    /*
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        },[messages, loading]
    );

    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
        }, [input]
    );

    */


    /*
    const userMsg = { role: "user", content: text };

    updateSession(activeId, s => ({
    ...s,
    title: s.messages.length === 0 ? text.slice(0, 32) + (text.length > 32 ? "…" : "") : s.title,
    messages: [...s.messages, userMsg],
    }));

    setInput("");
    setLoading(true);

    try {
    const history = [...messages, userMsg];
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
    });

    const data = await response.json();
    const aiText = data.content?.map(b => b.text || "").join("") || "No response.";

    updateSession(activeId, s => ({
        ...s,
        messages: [...s.messages, userMsg, { role: "assistant", content: aiText }],
    }));
    } catch (err) {
    updateSession(activeId, s => ({
        ...s,
        messages: [...s.messages, userMsg, { role: "assistant", content: "Error: " + err.message }],
    }));
    } finally {
    setLoading(false);
    }
    */

    


    return (
    <>
    <div className="chat-root">
    <aside className="sidebar">
    <div className="sidebar-header">
    <div className="app-title">Header</div>
    </div>

        <div className="history-list">
            {/* {todaySessions.length > 0 && (
            <>
                <div className="history-section-label">Today</div>
                {todaySessions.map(s => (
                <div key={s.id} className={`history-item ${s.id === activeId ? "active" : ""}`} onClick={() => setActiveId(s.id)}>
                    {s.title}
                </div>
                ))}
            </>
            )}
            {olderSessions.length > 0 && (
            <>
                <div className="history-section-label">Earlier</div>
                {olderSessions.map(s => (
                <div key={s.id} className={`history-item ${s.id === activeId ? "active" : ""}`} onClick={() => setActiveId(s.id)}>
                    {s.title}
                </div>
                ))}
            </>
            )} */}
        </div>
        </aside>

        <main className="main">
            <div className="main-header">
                <div className="header-dot" />
                {"New Chat"}
            </div>

            <div className="messages-area">
                {/* {messages.length === 0 && !loading ? (
                <div className="empty-state">
                    <div className="empty-title">How can I help?</div>
                </div>
                ) : (
                messages.map((m, i) => (
                    <div key={i} className={`message-row ${m.role}`}>
                    <div className="message-label">{m.role === "user" ? "You" : "Claude"}</div>
                    <div className={`bubble ${m.role}`}>{m.content}</div>
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
                )} */}
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
        </main>
    </div>
    </>

    );
}