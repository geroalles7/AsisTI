
import { useState } from "react";

function ContactForm({ onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipo_inconveniente: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section
      className="contact-form-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-form-title"
    >
      <div className="contact-form-heading">
        <div className="contact-form-icon">✉</div>

        <div>
          <span className="contact-form-eyebrow">
            ASISTENCIA TÉCNICA
          </span>

          <h2 id="contact-form-title">Cargar ticket a Sistemas</h2>

          <p>
            Contanos qué problema estás teniendo y nuestro equipo de
            Sistemas podrá ayudarte.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form-section-title">
          <span>01</span>
          Tus datos de contacto
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre completo</label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            maxLength={150}
            autoComplete="name"
            required
            disabled={loading}
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={255}
            autoComplete="email"
            required
            disabled={loading}
            placeholder="nombre@empresa.com"
          />
        </div>

        <div className="contact-form-divider" />

        <div className="contact-form-section-title">
          <span>02</span>
          Información del problema
        </div>

        <div className="form-group">
          <label htmlFor="tipo_inconveniente">
            ¿Con qué necesitás ayuda?
          </label>

          <select
            id="tipo_inconveniente"
            name="tipo_inconveniente"
            value={formData.tipo_inconveniente}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Seleccioná una categoría</option>
            <option value="Hardware">Equipos y hardware</option>
            <option value="Software">Software y aplicaciones</option>
            <option value="Impresora">Impresoras</option>
            <option value="Red y conectividad">Red y conectividad</option>
            <option value="Correo electrónico">Correo electrónico</option>
            <option value="Accesos y permisos">Accesos y permisos</option>
            <option value="Otro">Otro tipo de consulta</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Describí el problema
          </label>

          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            maxLength={2000}
            rows={5}
            required
            disabled={loading}
            placeholder="Contanos qué sucede, desde cuándo y qué intentaste hacer para solucionarlo..."
          />

          <span className="form-character-count">
            {formData.descripcion.length}/2000 caracteres
          </span>
        </div>

        <div className="contact-form-notice">
          <span className="contact-form-notice-icon">i</span>

          <p>
            Tu solicitud será enviada al equipo de Sistemas para su
            revisión. Nos comunicaremos a través del correo indicado.
          </p>
        </div>

        <div className="contact-form-actions">
          <button
            type="button"
            className="contact-cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="contact-submit-button"
            disabled={loading}
          >
            {loading ? (
              "Enviando solicitud..."
            ) : (
              <>
                Enviar solicitud
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
