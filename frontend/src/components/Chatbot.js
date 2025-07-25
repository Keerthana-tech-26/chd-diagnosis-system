import React, { useEffect, useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/chatbot/history/general`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data
            .map(c => [
              { sender: "user", text: c.message },
              { sender: "bot", text: c.reply }
            ])
            .flat();
          setMessages(formatted);
        } else {
          setMessages([{ sender: "bot", text: "⚠️ Unable to load chat history." }]);
        }
      })
      .catch(() => {
        setMessages([{ sender: "bot", text: "⚠️ Error loading chat history." }]);
      });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }) // ✅ no patientId
      });
      const data = await res.json();

      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: data.reply || "🤖 No response." }]);
        setTyping(false);
      }, 700);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Server error." }]);
      setTyping(false);
    }
  };
  return (
    <div style={{ padding: "20px", maxWidth: "650px", margin: "auto" }}>
      <h2>💬 AI Health Assistant</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "300px",
          background: "#f4f7f9",
          borderRadius: "8px",
          overflowY: "auto"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: "10px"
            }}
          >
            <span
              style={{
                background: msg.sender === "user" ? "#dcf8c6" : "#e6ebef",
                color: "#000",
                padding: "10px 15px",
                borderRadius: "16px",
                display: "inline-block",
                maxWidth: "80%"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {typing && (
          <div style={{ textAlign: "left", color: "#888", fontStyle: "italic" }}>
            Assistant is typing...
          </div>
        )}
      </div>

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 15px",
            marginLeft: "5px",
            border: "none",
            background: "#4caf50",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
