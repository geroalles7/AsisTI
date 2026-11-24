
import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import QuickActions from "./components/QuickActions";
import ContactForm from "./components/ContactForm";
import {
  sendMessage,
  submitContact,
} from "./services/assistantService";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "¡Hola! Soy AsisTI, tu asistente virtual de soporte IT. ¿En qué puedo ayudarte hoy?",
      time: new Date(),
    },
  ]);

  const [showActions, setShowActions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const sendUserMessage = async (text) => {
    if (!text.trim() || loading || showContactForm) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowActions(false);
    setLoading(true);

    try {
      const data = await sendMessage(text);

      if (!data.success || !data.response) {
      throw new Error("El servidor devolvió una respuesta inválida.");
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "assistant",
        text: data.response,
        time: new Date(),
      },
    ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: "No pude comunicarme con el servidor. Intentá nuevamente más tarde.",
          time: new Date(),
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (contactData) => {
    if (contactLoading) return;

    setContactLoading(true);

    try {
      const result = await submitContact(contactData);

      setShowContactForm(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "assistant",
          text:
            result.message ||
            "Tu solicitud fue enviada correctamente. El equipo de Sistemas podrá revisar tu consulta.",
          time: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error al contactar a Soporte:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "assistant",
          text:
            error.message ||
            "No se pudo enviar tu solicitud a Soporte. Intentá nuevamente más tarde.",
          time: new Date(),
        },
      ]);
    } finally {
      setContactLoading(false);
    }
  };

  const openContactForm = () => {
    setShowContactForm(true);
    setShowActions(false);
  };

  const closeContactForm = () => {
    if (contactLoading) return;
    setShowContactForm(false);
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <ChatHeader />

        <main className="chat-main">
          <div className="chat-content">
            <div className="welcome-section">
              <div className="welcome-icon">✦</div>

              <h1>¿Cómo puedo ayudarte?</h1>

              <p>
                Estoy acá para ayudarte con consultas técnicas y problemas
                relacionados con Sistemas. Contame qué necesitás.
              </p>
            </div>

            {showContactForm && (
              <ContactForm
                onSubmit={handleContactSubmit}
                onCancel={closeContactForm}
                loading={contactLoading}
              />
            )}

            <div className="messages-container">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>

            {loading && (
              <div className="loading-message">
                AsisTI está preparando una respuesta...
              </div>
            )}

            {showActions && (
              <QuickActions onSelect={sendUserMessage} />
            )}

            {!showContactForm &&
              messages.length > 1 &&
              !loading && (
                <div className="support-escalation">
                  <div className="support-escalation-icon">
                    <span>?</span>
                  </div>

                  <div className="support-escalation-content">
                    <strong>¿No pudiste resolverlo?</strong>
                    <p>
                      Nuestro equipo de Sistemas puede ayudarte con tu
                      problema.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openContactForm}
                    className="support-escalation-button"
                  >
                    Contactar a Soporte
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
          </div>
        </main>

        {!showContactForm && (
          <ChatInput onSend={sendUserMessage} />
        )}

        <footer className="chat-footer">
          AsisTI · Asistente virtual de soporte IT
        </footer>
      </div>
    </div>
  );
}

export default App;
