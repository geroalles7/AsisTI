
function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="brand">
        <div className="brand-icon">✦</div>

        <div>
          <h2>AsisTI</h2>
          <span>Asistente virtual IT</span>
        </div>
      </div>

      <div className="connection-status">
        <span className="status-dot"></span>
        En línea
      </div>
    </header>
  );
}

export default ChatHeader;
