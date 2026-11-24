
function ChatMessage({ message }) {
  const isAssistant = message.sender === "assistant";

  return (
    <div className={`message-row ${isAssistant ? "assistant-row" : "user-row"}`}>
      {isAssistant && <div className="message-avatar">✦</div>}

      <div className={`message-bubble ${isAssistant ? "assistant-bubble" : "user-bubble"}`}>
        <p>{message.text}</p>
        <span className="message-time">
          {message.time.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
