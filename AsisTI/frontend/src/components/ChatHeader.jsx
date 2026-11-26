
function ChatHeader({ onOpenTicket }) {
  return (
    <header className="chat-header">
      <div className="brand">
        <div className="brand-icon">✦</div>

        <div>
          <h2>AsisTI</h2>
          <span>Asistente virtual IT</span>
        </div>
      </div>

      <div className="chat-header-actions">
        <button
          type="button"
          className="header-ticket-button"
          onClick={onOpenTicket}
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">+</span>
          Cargar ticket
        </button>

        <div className="connection-status">
          <span className="status-dot"></span>
          En línea
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
