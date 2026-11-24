
import { useState } from "react";

function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Escribí tu consulta..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button type="submit" disabled={!text.trim()}>
          <span>➤</span>
        </button>
      </div>

      <p>AsisTI puede cometer errores. Verificá la información importante.</p>
    </form>
  );
}

export default ChatInput;
