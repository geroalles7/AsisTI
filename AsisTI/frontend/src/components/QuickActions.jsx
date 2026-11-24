
const actions = [
  {
    icon: "🖨️",
    title: "Impresoras",
    description: "Problemas de impresión",
    message: "Tengo un problema con una impresora.",
  },
  {
    icon: "📧",
    title: "Outlook",
    description: "Correo electrónico",
    message: "Tengo un problema con Outlook.",
  },
  {
    icon: "🌐",
    title: "Conectividad",
    description: "Red e Internet",
    message: "Tengo un problema de conectividad.",
  },
  {
    icon: "💻",
    title: "Aplicaciones",
    description: "Sistemas internos",
    message: "Tengo un problema con una aplicación interna.",
  },
];

function QuickActions({ onSelect }) {
  return (
    <section className="quick-actions">
      <h3>Consultas frecuentes</h3>

      <div className="actions-grid">
        {actions.map((action) => (
          <button
            className="action-card"
            key={action.title}
            onClick={() => onSelect(action.message)}
          >
            <span className="action-icon">{action.icon}</span>
            <strong>{action.title}</strong>
            <small>{action.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
